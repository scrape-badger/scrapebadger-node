/**
 * Async requests: submit any call asynchronously, poll it, wait for it, and
 * check its webhook delivery.
 *
 * Polling, waiting, batch submits and callback checks are free; the submitted
 * call is billed once, when it completes, like the same call made directly.
 */

import type { BaseClient, RawResponse } from "../internal/client.js";
import { TimeoutError } from "../internal/exceptions.js";
import type {
  AsyncRequest,
  BatchItem,
  BatchOptions,
  BatchSubmission,
  CallbackStatus,
  SubmitOptions,
  WaitOptions,
} from "../agent/types.js";

/** The API's default `wait` when `Prefer: respond-async` names none. */
const DEFAULT_WAIT_S = 25;
/** The API's longest `wait`. */
const MAX_WAIT_S = 120;
/** Poll interval when the API suggests none. */
const DEFAULT_POLL_S = 5;
/** Shortest pause between two polls, whatever the API suggests. */
const MIN_POLL_MS = 250;
/** Default `timeoutMs` of `wait()`: ten minutes. */
const DEFAULT_WAIT_TIMEOUT_MS = 600_000;
/** Retries per poll inside `wait()`, so a stored error result surfaces quickly. */
const WAIT_POLL_RETRIES = 2;

/**
 * Thrown by {@link RequestsClient.wait} when the call is still running at the
 * deadline. The call keeps running and is billed only if it completes: poll
 * it again with `requests.get(err.requestId)` or `requests.wait(...)`; never
 * re-submit it.
 */
export class WaitTimeoutError extends TimeoutError {
  /** The request that is still running. */
  readonly requestId: string;

  constructor(requestId: string, timeoutMs: number) {
    super(
      `Request ${requestId} still running after ${timeoutMs}ms. It keeps running: poll it ` +
        "again with requests.get() or requests.wait(); do not re-submit it.",
      timeoutMs
    );
    this.name = "WaitTimeoutError";
    this.requestId = requestId;
    Object.setPrototypeOf(this, WaitTimeoutError.prototype);
  }
}

/**
 * Client for async requests (`client.requests`).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Submit, then wait for the result (honours Retry-After).
 * const run = await client.requests.submit("/v1/perplexity/ask", {
 *   params: { prompt: "best crm for startups" },
 *   idempotencyKey: "crm-2026-11-18",
 * });
 * const done = run.status === "completed" ? run : await client.requests.wait(run.requestId);
 * console.log(done.statusCode, done.body);
 *
 * // Or get a signed webhook when it completes.
 * await client.requests.submit("/v1/perplexity/ask", {
 *   params: { prompt: "best crm for startups" },
 *   callbackUrl: "https://example.com/scrapebadger/webhook",
 * });
 * ```
 */
export class RequestsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Submit any API call asynchronously.
   *
   * Sends `Prefer: respond-async[, wait=N]`, plus `X-Callback-URL` and
   * `Idempotency-Key` when given. A call that finishes within `wait` comes
   * back completed; otherwise the API answers 202 and this returns a running
   * request to {@link get} or {@link wait} for (or to expect a webhook for).
   *
   * Without an `idempotencyKey`, a submit that times out or hits a network
   * fault is thrown, not retried: the call may already be running, and a
   * second submit would run and bill it again. With a key, retries are safe.
   *
   * @param path - API path, e.g. "/v1/perplexity/ask" (the "/v1" prefix is optional).
   * @param options - `method`, `params`, `body`, `callbackUrl`, `wait`, `idempotencyKey`.
   * @returns The running request (202) or the completed call.
   * @throws ScrapeBadgerError - A refusal before anything ran (400 `invalid_callback_url`,
   *   `async_not_supported`, `invalid_idempotency_key`; 401; 402; 429), or the call's own
   *   error when it completed within `wait`, as the matching subclass.
   * @throws ConflictError - 409 `idempotency_key_reused`: the key was used for a different call.
   */
  async submit<T = unknown>(path: string, options: SubmitOptions = {}): Promise<AsyncRequest<T>> {
    const { method = "GET", params, body, callbackUrl, wait, idempotencyKey } = options;
    if (wait !== undefined && (!Number.isFinite(wait) || wait < 0)) {
      throw new RangeError(`wait must be a number of seconds (0-${MAX_WAIT_S}), got ${wait}`);
    }
    // A callback without a wait answers 202 at once (the webhook carries the
    // result). Sending wait=0 explicitly also suits a gateway that still
    // requires Prefer alongside X-Callback-URL.
    const waitS = wait !== undefined ? Math.floor(wait) : callbackUrl ? 0 : undefined;
    const headers: Record<string, string> = {
      Prefer: waitS === undefined ? "respond-async" : `respond-async, wait=${waitS}`,
    };
    if (callbackUrl !== undefined) headers["X-Callback-URL"] = callbackUrl;
    if (idempotencyKey !== undefined) headers["Idempotency-Key"] = idempotencyKey;

    const query: Record<string, string | number | boolean | undefined> = {};
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== null && value !== undefined) query[key] = value;
    }
    // The API answers within `wait`; leave room for the response itself.
    const effectiveWaitS = Math.min(waitS ?? DEFAULT_WAIT_S, MAX_WAIT_S);
    const timeoutMs = Math.max(this.client.config.timeout, (effectiveWaitS + 15) * 1000);

    const response = await this.client.requestResponse(apiPath(path), {
      method,
      params: query,
      body,
      headers,
      timeoutMs,
      idempotent: idempotencyKey !== undefined,
    });
    return toAsyncRequest<T>(response);
  }

  /**
   * Poll an async request once. Free.
   *
   * @param requestId - `request_id` from the 202 response (or `AsyncRequest.requestId`).
   * @returns `status: "running"` while in progress; once completed, the original status,
   *   headers and body.
   * @throws NotFoundError - Unknown or expired request (results are kept about 15 minutes;
   *   one that never completed was not billed).
   * @throws ScrapeBadgerError - The original call finished with an error status (as the
   *   matching subclass).
   */
  async get<T = unknown>(requestId: string): Promise<AsyncRequest<T>> {
    return this.poll<T>(requestId);
  }

  /**
   * Poll an async request until it completes, pausing as long as the API's
   * `Retry-After` says between polls. Free.
   *
   * @param requestId - `request_id` of the running request.
   * @param options - `timeoutMs` (default 600000, ten minutes).
   * @returns The completed request.
   * @throws WaitTimeoutError - Still running at the deadline (it keeps running; poll it again).
   * @throws NotFoundError - Unknown or expired request.
   * @throws ScrapeBadgerError - The original call finished with an error status.
   */
  async wait<T = unknown>(requestId: string, options: WaitOptions = {}): Promise<AsyncRequest<T>> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_WAIT_TIMEOUT_MS;
    const deadline = Date.now() + timeoutMs;
    const maxRetries = Math.min(this.client.config.maxRetries, WAIT_POLL_RETRIES);
    for (;;) {
      const state = await this.poll<T>(requestId, maxRetries);
      if (state.status === "completed") return state;
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) throw new WaitTimeoutError(requestId, timeoutMs);
      const suggestedMs = (state.retryAfterSeconds ?? DEFAULT_POLL_S) * 1000;
      await sleep(Math.min(Math.max(suggestedMs, MIN_POLL_MS), remainingMs));
    }
  }

  /**
   * Webhook delivery state of a call submitted with a `callbackUrl`. Free.
   *
   * @param requestId - `request_id` of the call.
   * @throws NotFoundError - 404 `callback_not_found`: no such request, or it had no callback.
   */
  async callbackStatus(requestId: string): Promise<CallbackStatus> {
    return this.client.request<CallbackStatus>(
      `/v1/requests/${encodeURIComponent(requestId)}/callback`
    );
  }

  /**
   * Submit up to 100 GET reads as async requests in one call. Submitting is free.
   *
   * Each item runs under this key with the same auth, credit check, rate limit
   * and price as if sent alone; at most 10 of a batch run at a time.
   *
   * @example
   * ```typescript
   * const sub = await client.requests.batch(
   *   prompts.map((prompt) => ({ path: "/v1/chatgpt/ask", query: { prompt } })),
   *   { callbackUrl: "https://example.com/hook" }
   * );
   * const ids = sub.requests.filter((r) => r.accepted).map((r) => r.request_id);
   * ```
   *
   * @param items - `{ path: "/v1/...", query: {...} }` (method defaults to GET).
   * @param options - `callbackUrl` for one signed webhook per item.
   * @returns A request_id (or the refusal) for every item.
   */
  async batch(items: BatchItem[], options: BatchOptions = {}): Promise<BatchSubmission> {
    return this.client.request<BatchSubmission>("/v1/batch", {
      method: "POST",
      body: { requests: items, callback_url: options.callbackUrl },
    });
  }

  private async poll<T>(requestId: string, maxRetries?: number): Promise<AsyncRequest<T>> {
    const response = await this.client.requestResponse(
      `/v1/requests/${encodeURIComponent(requestId)}`,
      { maxRetries }
    );
    return toAsyncRequest<T>(response, requestId);
  }
}

/** "/v1/x", "v1/x", "/x" and "x" all become "/v1/x"; URLs are refused (they would get the key). */
function apiPath(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//") || path.startsWith("\\")) {
    throw new TypeError(`path must be an API path such as "/v1/perplexity/ask", not a URL`);
  }
  const bare = path.replace(/^\/+/, "");
  return bare === "v1" || bare.startsWith("v1/") ? `/${bare}` : `/v1/${bare}`;
}

function toAsyncRequest<T>(response: RawResponse, requestId?: string): AsyncRequest<T> {
  const { status, headers, body } = response;
  const accepted =
    status === 202 && typeof body === "object" && body !== null
      ? (body as { request_id?: unknown; retry_after_seconds?: unknown })
      : null;
  // A poll's 202 is always "still running"; a submit's 202 is the async
  // acceptance when it names the request.
  const running =
    status === 202 && (requestId !== undefined || typeof accepted?.request_id === "string");
  const headerMap: Record<string, string> = {};
  headers.forEach((value, name) => {
    headerMap[name.toLowerCase()] = value;
  });
  const credits = headers.get("X-Credits-Used");
  return {
    requestId:
      requestId ??
      (typeof accepted?.request_id === "string" ? accepted.request_id : null) ??
      headers.get("X-Request-ID") ??
      "",
    status: running ? "running" : "completed",
    running,
    retryAfterSeconds: running ? retryAfterSeconds(headers, accepted?.retry_after_seconds) : null,
    statusCode: status,
    headers: headerMap,
    body: body as T,
    replayed: headers.get("Idempotent-Replayed")?.trim().toLowerCase() === "true",
    creditsUsed: credits && /^\d+$/.test(credits) ? Number(credits) : null,
    resultId: null, // deprecated: the API no longer sends X-Result-ID
    data: body as T,
  };
}

/** Seconds from `Retry-After` (delta-seconds or an HTTP date), else the body's hint. */
function retryAfterSeconds(headers: Headers, fromBody: unknown): number | null {
  const header = headers.get("Retry-After")?.trim();
  if (header) {
    if (/^\d+$/.test(header)) return Number(header);
    const at = Date.parse(header);
    if (!Number.isNaN(at)) return Math.max(0, Math.ceil((at - Date.now()) / 1000));
  }
  return typeof fromBody === "number" && Number.isFinite(fromBody) && fromBody >= 0
    ? fromBody
    : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
