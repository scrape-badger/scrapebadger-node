/**
 * StreamClient -- stream monitor management and live WebSocket streaming.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { EventEmitter } from "node:events";
import WebSocket from "ws";
import type { BaseClient } from "../internal/client.js";
import { WebSocketStreamError } from "../internal/exceptions.js";
import type {
  BillingLogList,
  ConnectOptions,
  ConnectedEvent,
  CreateMonitorParams,
  DeliveryLogList,
  ErrorEvent,
  FilterRuleCreate,
  FilterRuleDeliveryLogListResponse,
  FilterRuleListResponse,
  FilterRulePricingTiersResponse,
  FilterRuleResponse,
  FilterRuleUpdate,
  FilterRuleValidateResponse,
  PingEvent,
  StreamEvent,
  StreamMonitor,
  StreamMonitorList,
  StreamTweet,
  TweetEvent,
  UpdateMonitorParams,
} from "./stream-types.js";

// Minimum reconnect delay regardless of caller configuration (seconds)
const MIN_RECONNECT_DELAY_SECONDS = 5;

/**
 * Derive WebSocket URL from HTTP base URL.
 * 'https://...' -> 'wss://...'
 * 'http://...'  -> 'ws://...'
 */
export function wsUrlFromBase(baseUrl: string): string {
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace("https://", "wss://") + "/v1/twitter/stream";
  }
  if (baseUrl.startsWith("http://")) {
    return baseUrl.replace("http://", "ws://") + "/v1/twitter/stream";
  }
  return baseUrl + "/v1/twitter/stream";
}

/**
 * Map a raw server JSON object to a camelCase StreamEvent.
 * Unknown types return an ErrorEvent with code 0.
 */
export function parseEvent(raw: Record<string, unknown>): StreamEvent {
  const type = raw["type"] as string | undefined;

  switch (type) {
    case "connected":
      return {
        type: "connected",
        connectionId: raw["connection_id"] as string,
        apiKeyId: raw["api_key_id"] as string,
      } satisfies ConnectedEvent;

    case "ping":
      return {
        type: "ping",
        timestamp: raw["timestamp"] as string,
      } satisfies PingEvent;

    case "tweet":
      return {
        type: "tweet",
        monitorId: raw["monitor_id"] as string,
        tweetId: raw["tweet_id"] as string,
        authorUsername: raw["author_username"] as string,
        tweetPublishedAt: raw["tweet_published_at"] as string,
        detectedAt: raw["detected_at"] as string,
        latencyMs: raw["latency_ms"] as number,
        tweet: raw["tweet"] as StreamTweet,
      } satisfies TweetEvent;

    case "error":
      return {
        type: "error",
        code: raw["code"] as number,
        message: raw["message"] as string,
      } satisfies ErrorEvent;

    default:
      return {
        type: "error",
        code: 0,
        message: `Unknown event type: ${String(type)}`,
      } satisfies ErrorEvent;
  }
}

/**
 * Typed EventEmitter for stream events.
 *
 * @example
 * ```typescript
 * const stream = client.twitter.stream.connect();
 * stream.on("tweet", (event) => console.log(event.authorUsername));
 * stream.on("error", (err) => console.error(err));
 * ```
 */
export interface StreamEmitter extends EventEmitter {
  on(event: "connected", listener: (event: ConnectedEvent) => void): this;
  on(event: "ping", listener: (event: PingEvent) => void): this;
  on(event: "tweet", listener: (event: TweetEvent) => void): this;
  on(event: "error", listener: (error: WebSocketStreamError) => void): this;
  on(event: "close", listener: () => void): this;

  once(event: "connected", listener: (event: ConnectedEvent) => void): this;
  once(event: "tweet", listener: (event: TweetEvent) => void): this;
  once(event: "close", listener: () => void): this;

  /** Gracefully close the WebSocket connection. */
  close(): void;
}

/**
 * Client for Twitter Streams -- monitor CRUD and live WebSocket streaming.
 *
 * Accessed as `client.twitter.stream`.
 *
 * @example Monitor CRUD
 * ```typescript
 * const monitor = await client.twitter.stream.createMonitor({
 *   name: "Tech Leaders",
 *   usernames: ["elonmusk", "naval"],
 *   pollIntervalSeconds: 10,
 * });
 * console.log(`Created: ${monitor.id}, tier: ${monitor.pricing_tier}`);
 * ```
 *
 * @example EventEmitter streaming
 * ```typescript
 * const stream = client.twitter.stream.connect();
 * stream.on("tweet", (event) => {
 *   console.log(`@${event.authorUsername}: ${event.tweet.text}`);
 *   console.log(`  latency: ${event.latencyMs}ms`);
 * });
 * stream.on("error", (err) => console.error("Stream error:", err));
 * // Later:
 * stream.close();
 * ```
 *
 * @example AsyncIterator streaming
 * ```typescript
 * for await (const event of client.twitter.stream.connectIter()) {
 *   if (event.type === "tweet") {
 *     console.log(event.authorUsername, event.latencyMs);
 *   }
 * }
 * ```
 */
export class StreamClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  // ===========================================================================
  // Monitor CRUD
  // ===========================================================================

  /**
   * Create a new stream monitor.
   *
   * @param params - Monitor configuration.
   * @returns The created StreamMonitor.
   * @throws InsufficientCreditsError - Credit balance below tier threshold (402).
   * @throws ValidationError - Invalid username or interval (422).
   * @throws ScrapeBadgerError - Name conflict (409).
   * @throws AuthenticationError - Invalid API key (401).
   *
   * @example
   * ```typescript
   * const monitor = await client.twitter.stream.createMonitor({
   *   name: "Breaking News",
   *   usernames: ["cnnbrk", "bbcbreaking"],
   *   pollIntervalSeconds: 5,
   * });
   * ```
   */
  async createMonitor(params: CreateMonitorParams): Promise<StreamMonitor> {
    const body: Record<string, unknown> = {
      name: params.name,
      usernames: params.usernames,
      poll_interval_seconds: params.pollIntervalSeconds,
    };
    if (params.webhookUrl !== undefined) body["webhook_url"] = params.webhookUrl;
    if (params.webhookSecret !== undefined) body["webhook_secret"] = params.webhookSecret;

    return this.client.request<StreamMonitor>("/v1/twitter/stream/monitors", {
      method: "POST",
      body,
    });
  }

  /**
   * List stream monitors for the authenticated API key.
   *
   * @param options - Filter and pagination options.
   * @returns StreamMonitorList with pagination metadata.
   *
   * @example
   * ```typescript
   * const { monitors, total } = await client.twitter.stream.listMonitors({
   *   status: "active",
   * });
   * console.log(`${total} active monitors`);
   * ```
   */
  async listMonitors(options?: {
    status?: "active" | "paused" | "error";
    page?: number;
    pageSize?: number;
  }): Promise<StreamMonitorList> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: options?.page ?? 1,
      page_size: options?.pageSize ?? 20,
      status: options?.status,
    };
    return this.client.request<StreamMonitorList>("/v1/twitter/stream/monitors", {
      params,
    });
  }

  /**
   * Get a single stream monitor by ID.
   *
   * @param monitorId - UUID of the monitor.
   * @returns The StreamMonitor.
   * @throws NotFoundError - No monitor with that ID for this API key.
   *
   * @example
   * ```typescript
   * const monitor = await client.twitter.stream.getMonitor("550e8400-...");
   * console.log(`${monitor.name}: ${monitor.status}`);
   * ```
   */
  async getMonitor(monitorId: string): Promise<StreamMonitor> {
    return this.client.request<StreamMonitor>(`/v1/twitter/stream/monitors/${monitorId}`);
  }

  /**
   * Partially update a stream monitor.
   *
   * Only fields that are explicitly set in params are sent to the server.
   *
   * @param monitorId - UUID of the monitor.
   * @param params - Fields to update (all optional).
   * @returns The updated StreamMonitor.
   * @throws NotFoundError - Monitor not found for this API key.
   * @throws InsufficientCreditsError - When resuming with insufficient credits.
   *
   * @example
   * ```typescript
   * const monitor = await client.twitter.stream.updateMonitor("550e8400-...", {
   *   pollIntervalSeconds: 60,
   * });
   * ```
   */
  async updateMonitor(monitorId: string, params: UpdateMonitorParams): Promise<StreamMonitor> {
    const body: Record<string, unknown> = {};
    if (params.name !== undefined) body["name"] = params.name;
    if (params.usernames !== undefined) body["usernames"] = params.usernames;
    if (params.pollIntervalSeconds !== undefined)
      body["poll_interval_seconds"] = params.pollIntervalSeconds;
    if (params.status !== undefined) body["status"] = params.status;
    if (params.webhookUrl !== undefined) body["webhook_url"] = params.webhookUrl;
    if (params.webhookSecret !== undefined) body["webhook_secret"] = params.webhookSecret;

    return this.client.request<StreamMonitor>(`/v1/twitter/stream/monitors/${monitorId}`, {
      method: "PATCH",
      body,
    });
  }

  /**
   * Pause an active stream monitor.
   *
   * Convenience wrapper around updateMonitor({ status: "paused" }).
   *
   * @param monitorId - UUID of the monitor.
   * @returns The updated StreamMonitor with status="paused".
   */
  async pauseMonitor(monitorId: string): Promise<StreamMonitor> {
    return this.updateMonitor(monitorId, { status: "paused" });
  }

  /**
   * Resume a paused stream monitor.
   *
   * Convenience wrapper around updateMonitor({ status: "active" }).
   *
   * @param monitorId - UUID of the monitor.
   * @returns The updated StreamMonitor with status="active".
   * @throws InsufficientCreditsError - If credits are below the tier threshold.
   */
  async resumeMonitor(monitorId: string): Promise<StreamMonitor> {
    return this.updateMonitor(monitorId, { status: "active" });
  }

  /**
   * Delete a stream monitor and all its associated logs. Irreversible.
   *
   * @param monitorId - UUID of the monitor.
   * @throws NotFoundError - Monitor not found for this API key.
   *
   * @example
   * ```typescript
   * await client.twitter.stream.deleteMonitor("550e8400-...");
   * ```
   */
  async deleteMonitor(monitorId: string): Promise<void> {
    await this.client.request<void>(`/v1/twitter/stream/monitors/${monitorId}`, {
      method: "DELETE",
    });
  }

  // ===========================================================================
  // Delivery and Billing Logs
  // ===========================================================================

  /**
   * List tweet delivery logs.
   *
   * @param options - Filter and pagination options.
   * @returns DeliveryLogList with pagination metadata.
   */
  async listDeliveryLogs(options?: {
    monitorId?: string;
    authorUsername?: string;
    deliveryStatus?: string;
    page?: number;
    pageSize?: number;
    sort?: "asc" | "desc";
  }): Promise<DeliveryLogList> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: options?.page ?? 1,
      page_size: options?.pageSize ?? 20,
      sort: options?.sort ?? "desc",
      monitor_id: options?.monitorId,
      author_username: options?.authorUsername,
      delivery_status: options?.deliveryStatus,
    };
    return this.client.request<DeliveryLogList>("/v1/twitter/stream/logs", { params });
  }

  /**
   * List billing activity logs.
   *
   * @param options - Filter and pagination options.
   * @returns BillingLogList with pagination metadata.
   */
  async listBillingLogs(options?: {
    monitorId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<BillingLogList> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: options?.page ?? 1,
      page_size: options?.pageSize ?? 20,
      monitor_id: options?.monitorId,
    };
    return this.client.request<BillingLogList>("/v1/twitter/stream/billing-logs", { params });
  }

  // ===========================================================================
  // Filter Rules CRUD
  // ===========================================================================

  /**
   * Create a new tweet filter rule.
   *
   * @param params - Filter rule configuration.
   * @returns The created FilterRuleResponse.
   * @throws ValidationError - Invalid query or interval (422).
   * @throws InsufficientCreditsError - Credit balance below tier threshold (402).
   * @throws AuthenticationError - Invalid API key (401).
   *
   * @example
   * ```typescript
   * const rule = await client.twitter.stream.createFilterRule({
   *   tag: "python news",
   *   query: "#python lang:en -is:retweet",
   *   interval_seconds: 60,
   * });
   * console.log(`Created: ${rule.id}, tier: ${rule.pricing_tier}`);
   * ```
   */
  async createFilterRule(params: FilterRuleCreate): Promise<FilterRuleResponse> {
    const body: Record<string, unknown> = {
      tag: params.tag,
      query: params.query,
      interval_seconds: params.interval_seconds,
    };
    if (params.webhook_url !== undefined) body["webhook_url"] = params.webhook_url;
    if (params.webhook_secret !== undefined) body["webhook_secret"] = params.webhook_secret;
    if (params.max_results_per_poll !== undefined)
      body["max_results_per_poll"] = params.max_results_per_poll;

    return this.client.request<FilterRuleResponse>("/v1/twitter/stream/filter-rules", {
      method: "POST",
      body,
    });
  }

  /**
   * List filter rules for the authenticated API key.
   *
   * @param options - Filter and pagination options.
   * @returns FilterRuleListResponse with pagination metadata.
   *
   * @example
   * ```typescript
   * const { rules, total } = await client.twitter.stream.listFilterRules({
   *   status: "active",
   * });
   * console.log(`${total} active rules`);
   * ```
   */
  async listFilterRules(options?: {
    status?: FilterRuleResponse["status"];
    limit?: number;
    offset?: number;
  }): Promise<FilterRuleListResponse> {
    const params: Record<string, string | number | boolean | undefined> = {
      limit: options?.limit ?? 20,
      offset: options?.offset ?? 0,
      status: options?.status,
    };
    return this.client.request<FilterRuleListResponse>("/v1/twitter/stream/filter-rules", {
      params,
    });
  }

  /**
   * Get a single filter rule by ID.
   *
   * @param ruleId - UUID of the filter rule.
   * @returns The FilterRuleResponse.
   * @throws NotFoundError - No rule with that ID for this API key.
   *
   * @example
   * ```typescript
   * const rule = await client.twitter.stream.getFilterRule("550e8400-...");
   * console.log(`${rule.tag}: ${rule.status}`);
   * ```
   */
  async getFilterRule(ruleId: string): Promise<FilterRuleResponse> {
    return this.client.request<FilterRuleResponse>(`/v1/twitter/stream/filter-rules/${ruleId}`);
  }

  /**
   * Partially update a filter rule.
   *
   * Only fields that are explicitly set in params are sent to the server.
   *
   * @param ruleId - UUID of the filter rule.
   * @param params - Fields to update (all optional).
   * @returns The updated FilterRuleResponse.
   * @throws NotFoundError - Rule not found for this API key.
   * @throws ValidationError - Invalid field values (422).
   *
   * @example
   * ```typescript
   * const rule = await client.twitter.stream.updateFilterRule("550e8400-...", {
   *   interval_seconds: 120,
   * });
   * ```
   */
  async updateFilterRule(ruleId: string, params: FilterRuleUpdate): Promise<FilterRuleResponse> {
    const body: Record<string, unknown> = {};
    if (params.tag !== undefined) body["tag"] = params.tag;
    if (params.query !== undefined) body["query"] = params.query;
    if (params.interval_seconds !== undefined) body["interval_seconds"] = params.interval_seconds;
    if (params.status !== undefined) body["status"] = params.status;
    if (params.webhook_url !== undefined) body["webhook_url"] = params.webhook_url;
    if (params.webhook_secret !== undefined) body["webhook_secret"] = params.webhook_secret;
    if (params.max_results_per_poll !== undefined)
      body["max_results_per_poll"] = params.max_results_per_poll;

    return this.client.request<FilterRuleResponse>(`/v1/twitter/stream/filter-rules/${ruleId}`, {
      method: "PATCH",
      body,
    });
  }

  /**
   * Delete a filter rule and all its associated logs. Irreversible.
   *
   * @param ruleId - UUID of the filter rule.
   * @throws NotFoundError - Rule not found for this API key.
   *
   * @example
   * ```typescript
   * await client.twitter.stream.deleteFilterRule("550e8400-...");
   * ```
   */
  async deleteFilterRule(ruleId: string): Promise<void> {
    await this.client.request<void>(`/v1/twitter/stream/filter-rules/${ruleId}`, {
      method: "DELETE",
    });
  }

  // ===========================================================================
  // Filter Rules Utility
  // ===========================================================================

  /**
   * Validate a Twitter search query before creating a rule.
   *
   * @param query - The Twitter search query to validate.
   * @returns FilterRuleValidateResponse with validity and sample result count.
   *
   * @example
   * ```typescript
   * const result = await client.twitter.stream.validateFilterRuleQuery(
   *   "#python lang:en -is:retweet"
   * );
   * if (!result.valid) {
   *   console.error("Invalid query:", result.error);
   * }
   * ```
   */
  async validateFilterRuleQuery(query: string): Promise<FilterRuleValidateResponse> {
    return this.client.request<FilterRuleValidateResponse>(
      "/v1/twitter/stream/filter-rules/validate",
      { method: "POST", body: { query } }
    );
  }

  /**
   * List tweet delivery logs for a specific filter rule.
   *
   * @param ruleId - UUID of the filter rule.
   * @param options - Filter and pagination options.
   * @returns FilterRuleDeliveryLogListResponse with pagination metadata.
   *
   * @example
   * ```typescript
   * const { logs, total } = await client.twitter.stream.listFilterRuleLogs(
   *   "550e8400-...",
   *   { limit: 50, deliveryStatus: "webhook_delivered" }
   * );
   * ```
   */
  async listFilterRuleLogs(
    ruleId: string,
    options?: {
      limit?: number;
      offset?: number;
      deliveryStatus?: string;
      sort?: "asc" | "desc";
    }
  ): Promise<FilterRuleDeliveryLogListResponse> {
    const params: Record<string, string | number | boolean | undefined> = {
      limit: options?.limit ?? 20,
      offset: options?.offset ?? 0,
      sort: options?.sort ?? "desc",
      delivery_status: options?.deliveryStatus,
    };
    return this.client.request<FilterRuleDeliveryLogListResponse>(
      `/v1/twitter/stream/filter-rules/${ruleId}/logs`,
      { params }
    );
  }

  /**
   * Get all available filter rule pricing tiers.
   *
   * @returns FilterRulePricingTiersResponse listing all tiers.
   *
   * @example
   * ```typescript
   * const { tiers } = await client.twitter.stream.getFilterRulePricingTiers();
   * tiers.forEach((t) => console.log(t.tier_label, t.credits_per_rule_per_day));
   * ```
   */
  async getFilterRulePricingTiers(): Promise<FilterRulePricingTiersResponse> {
    return this.client.request<FilterRulePricingTiersResponse>(
      "/v1/twitter/stream/filter-rules-pricing"
    );
  }

  // ===========================================================================
  // WebSocket Streaming -- EventEmitter style
  // ===========================================================================

  /**
   * Connect to the WebSocket stream and return an EventEmitter.
   *
   * The caller subscribes to events via `.on("tweet", handler)`.
   * The SDK handles pong replies to server pings automatically.
   * Call `.close()` on the emitter to disconnect cleanly.
   *
   * If reconnect is true, the emitter automatically reconnects after
   * disconnects (other than auth failures). A new "connected" event is
   * emitted on each reconnect.
   *
   * @param options - Connection options (reconnect, delay, maxReconnects).
   * @returns StreamEmitter -- an EventEmitter subclass.
   *
   * @example
   * ```typescript
   * const stream = client.twitter.stream.connect();
   * stream.on("connected", (e) => console.log("Connected:", e.connectionId));
   * stream.on("tweet", (event) => {
   *   console.log(`@${event.authorUsername}: ${event.tweet.text}`);
   *   console.log(`  latency: ${event.latencyMs}ms`);
   * });
   * stream.on("error", (err) => console.error("Stream error:", err));
   * stream.on("close", () => console.log("Stream closed"));
   *
   * // Later:
   * stream.close();
   * ```
   */
  connect(options: ConnectOptions = {}): StreamEmitter {
    const { reconnect = false, reconnectDelaySeconds = 90, maxReconnects } = options;

    const delay = Math.max(MIN_RECONNECT_DELAY_SECONDS, reconnectDelaySeconds) * 1000;
    const wsUrl = wsUrlFromBase(this.client.config.baseUrl);
    const apiKey = this.client.config.apiKey;

    const emitter = new EventEmitter() as StreamEmitter;
    let ws: WebSocket | null = null;
    let closed = false;
    let reconnectCount = 0;

    const connectOnce = (): void => {
      ws = new WebSocket(wsUrl, { headers: { "x-api-key": apiKey } });

      ws.on("message", (data: unknown) => {
        let raw: Record<string, unknown>;
        try {
          raw = JSON.parse(String(data)) as Record<string, unknown>;
        } catch {
          return;
        }

        const event = parseEvent(raw);

        if (event.type === "ping") {
          ws?.send(JSON.stringify({ type: "pong" }));
          emitter.emit("ping", event);
          return;
        }

        if (event.type === "error") {
          const code = (event as ErrorEvent).code;
          const err = new WebSocketStreamError((event as ErrorEvent).message, code);
          emitter.emit("error", err);
          if (code === 4001 || code === 4003) {
            closed = true; // Do not reconnect on auth/limit errors
            ws?.close();
          }
          return;
        }

        emitter.emit(event.type, event);
      });

      ws.on("open", () => {
        // Connection is open; wait for "connected" event from server
      });

      ws.on("close", (code: unknown, reason: unknown) => {
        if (closed) {
          emitter.emit("close");
          return;
        }

        if (!reconnect) {
          const reasonStr =
            reason instanceof Buffer ? reason.toString() : typeof reason === "string" ? reason : "";
          emitter.emit(
            "error",
            new WebSocketStreamError(`WebSocket closed: ${reasonStr || String(code)}`)
          );
          emitter.emit("close");
          return;
        }

        if (maxReconnects !== undefined && reconnectCount >= maxReconnects) {
          emitter.emit(
            "error",
            new WebSocketStreamError(`Max reconnects (${maxReconnects}) exhausted`)
          );
          emitter.emit("close");
          return;
        }

        reconnectCount++;
        setTimeout(connectOnce, delay);
      });

      ws.on("error", (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        emitter.emit("error", new WebSocketStreamError(message));
      });
    };

    // Attach close() method to emitter
    (emitter as unknown as { close: () => void }).close = (): void => {
      closed = true;
      ws?.close(1000, "Client closed");
    };

    connectOnce();
    return emitter;
  }

  // ===========================================================================
  // WebSocket Streaming -- AsyncIterator style
  // ===========================================================================

  /**
   * Connect to the WebSocket stream and return an AsyncIterator.
   *
   * Iterates over StreamEvent objects. The SDK handles pong replies
   * automatically but still yields PingEvent to the caller (the caller
   * may ignore ping events).
   *
   * @param options - Connection options (reconnect, delay, maxReconnects).
   * @yields StreamEvent
   *
   * @example
   * ```typescript
   * for await (const event of client.twitter.stream.connectIter()) {
   *   if (event.type === "tweet") {
   *     console.log(`@${event.authorUsername}: ${event.latencyMs}ms`);
   *   }
   * }
   * ```
   *
   * @example With auto-reconnect
   * ```typescript
   * for await (const event of client.twitter.stream.connectIter({
   *   reconnect: true,
   *   reconnectDelaySeconds: 90,
   * })) {
   *   if (event.type === "tweet") {
   *     // process(event);
   *   }
   * }
   * ```
   */
  async *connectIter(options: ConnectOptions = {}): AsyncIterableIterator<StreamEvent> {
    const { reconnect = false, reconnectDelaySeconds = 90, maxReconnects } = options;

    const delay = Math.max(MIN_RECONNECT_DELAY_SECONDS, reconnectDelaySeconds) * 1000;
    const wsUrl = wsUrlFromBase(this.client.config.baseUrl);
    const apiKey = this.client.config.apiKey;
    let reconnectCount = 0;

    while (true) {
      const events: StreamEvent[] = [];
      let resolveWait: (() => void) | null = null;
      let rejectWait: ((err: Error) => void) | null = null;
      let done = false;

      const ws = new WebSocket(wsUrl, { headers: { "x-api-key": apiKey } });

      const waitForEvent = (): Promise<void> =>
        new Promise<void>((res, rej) => {
          resolveWait = res;
          rejectWait = rej;
        });

      ws.on("message", (data: unknown) => {
        let raw: Record<string, unknown>;
        try {
          raw = JSON.parse(String(data)) as Record<string, unknown>;
        } catch {
          return;
        }

        const event = parseEvent(raw);

        if (event.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        }

        if (event.type === "error") {
          const code = (event as ErrorEvent).code;
          if (code === 4001 || code === 4003) {
            rejectWait?.(new WebSocketStreamError((event as ErrorEvent).message, code));
            rejectWait = null;
            resolveWait = null;
            return;
          }
        }

        events.push(event);
        resolveWait?.();
        resolveWait = null;
        rejectWait = null;
      });

      ws.on("close", () => {
        done = true;
        resolveWait?.();
        resolveWait = null;
        rejectWait = null;
      });

      ws.on("error", (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        rejectWait?.(new WebSocketStreamError(message));
        rejectWait = null;
        resolveWait = null;
      });

      try {
        while (!done || events.length > 0) {
          if (events.length === 0) {
            await waitForEvent();
          }
          while (events.length > 0) {
            yield events.shift()!;
          }
        }
      } catch (err) {
        ws.close();
        throw err;
      } finally {
        ws.close();
      }

      // Connection ended cleanly
      if (!reconnect) {
        return;
      }

      if (maxReconnects !== undefined && reconnectCount >= maxReconnects) {
        throw new WebSocketStreamError(`Max reconnects (${maxReconnects}) exhausted`);
      }

      reconnectCount++;
      await new Promise<void>((res) => setTimeout(res, delay));
      // Continue outer while loop for reconnect
    }
  }
}

/**
 * Verify the HMAC-SHA256 signature of an incoming webhook request.
 *
 * The server sets the header:
 *   X-ScrapeBadger-Signature: sha256=<hex-digest>
 *
 * @param secret - The webhook secret configured on the monitor.
 * @param body - The raw request body string or Buffer.
 * @param signatureHeader - The full X-ScrapeBadger-Signature header value.
 * @returns true if the signature is valid.
 *
 * @example
 * ```typescript
 * // In an Express webhook receiver:
 * import { verifyWebhookSignature } from "scrapebadger/twitter";
 * import express from "express";
 *
 * app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
 *   const sig = req.headers["x-scrapebadger-signature"] as string;
 *   if (!verifyWebhookSignature("my-secret", req.body, sig)) {
 *     return res.status(401).json({ error: "Invalid signature" });
 *   }
 *   const event = JSON.parse(req.body.toString());
 *   // process event...
 *   res.sendStatus(200);
 * });
 * ```
 */
export function verifyWebhookSignature(
  secret: string,
  body: string | Buffer,
  signatureHeader: string
): boolean {
  if (!signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const expectedHex = signatureHeader.slice("sha256=".length);
  const bodyBuffer = typeof body === "string" ? Buffer.from(body, "utf-8") : body;
  const actualHex = createHmac("sha256", secret).update(bodyBuffer).digest("hex");

  // Use constant-time comparison to prevent timing attacks
  try {
    return timingSafeEqual(Buffer.from(expectedHex, "hex"), Buffer.from(actualHex, "hex"));
  } catch {
    // Buffers of different lengths throw -- treat as mismatch
    return false;
  }
}
