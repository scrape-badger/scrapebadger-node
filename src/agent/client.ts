/**
 * Agent platform API clients.
 *
 * Free helpers around the scraper APIs: quote a call before making it, report
 * a bug, re-read a recent result, and poll a call made with
 * `Prefer: respond-async`. None of these calls is ever billed.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  AsyncRequest,
  FeedbackOptions,
  FeedbackReceipt,
  Quote,
  QuoteOptions,
  ResultViewOptions,
} from "./types.js";

/**
 * Client for quoting calls and sending feedback.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const quote = await client.agent.quote("GET", "/v1/google/search", { params: { q: "x" } });
 * console.log(quote.valid, quote.credits.max, quote.usd?.max_per_call_list);
 *
 * await client.agent.reportBug("Empty organic results for a valid query", {
 *   requestId: "<X-Request-ID of the failing call>",
 *   endpoint: "/v1/google/search",
 * });
 * ```
 */
export class AgentClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Quote a call: its cost, whether its parameters are valid, and its latency.
   * Free: nothing runs and nothing is charged.
   *
   * @param method - HTTP method of the call to quote.
   * @param path - Path of the call, e.g. "/v1/google/search" (the "/v1" prefix is optional).
   * @param options - The call's query `params` and JSON `body`.
   * @throws NotFoundError - No such endpoint.
   */
  async quote(method: "GET" | "POST", path: string, options: QuoteOptions = {}): Promise<Quote> {
    return this.client.request<Quote>("/v1/quote", {
      method: "POST",
      body: { method, path, params: options.params, body: options.body },
    });
  }

  /**
   * Send feedback (an API or field you needed and couldn't find) or a bug
   * report. Free, never billed; rate limited per key (429 when over the limit).
   *
   * @param summary - One-line summary, 3-200 characters.
   * @param options - `type` ("feedback" default, or "bug"), `details`, `requestId`, `endpoint`, `contact`.
   */
  async feedback(summary: string, options: FeedbackOptions = {}): Promise<FeedbackReceipt> {
    return this.client.request<FeedbackReceipt>("/v1/feedback", {
      method: "POST",
      body: {
        type: options.type ?? "feedback",
        summary,
        details: options.details,
        request_id: options.requestId,
        endpoint: options.endpoint,
        contact: options.contact,
      },
    });
  }

  /**
   * Report a bug: a wrong or empty result for valid input, a misleading error,
   * or a price mismatch. Same as `feedback(summary, { ...options, type: "bug" })`.
   *
   * @param summary - One-line summary, 3-200 characters.
   * @param options - `details`, `requestId` (the failing call's X-Request-ID), `endpoint`, `contact`.
   */
  async reportBug(
    summary: string,
    options: Omit<FeedbackOptions, "type"> = {}
  ): Promise<FeedbackReceipt> {
    return this.feedback(summary, { ...options, type: "bug" });
  }
}

/**
 * Client for re-reading recent results for free.
 *
 * Every billed 2xx read carries an `X-Result-ID` header; the body is kept for
 * about 15 minutes and can be replayed — optionally reshaped — without
 * re-running (and re-paying for) the call.
 */
export class ResultsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Replay a recent result, optionally trimmed. Free.
   *
   * @param resultId - `X-Result-ID` of the original call.
   * @param options - `jq`, `fields`, `maxItems`, `summary` view params.
   * @returns The original response body, reshaped — any JSON value.
   * @throws NotFoundError - Unknown result, or it expired (~15 minutes).
   */
  async get<T = unknown>(resultId: string, options: ResultViewOptions = {}): Promise<T> {
    const { jq, fields, maxItems, summary } = options;
    return this.client.request<T>(`/v1/results/${encodeURIComponent(resultId)}`, {
      params: {
        jq,
        fields: Array.isArray(fields) ? fields.join(",") : fields,
        max_items: maxItems,
        summary: summary ? true : undefined,
      },
    });
  }
}

/**
 * Client for polling calls made with `Prefer: respond-async`.
 *
 * A read sent with `Prefer: respond-async, wait=25` that doesn't finish within
 * `wait` seconds answers 202 with a `request_id`; poll it here until it is
 * done. Never re-submit the original call.
 */
export class RequestsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Poll an async request. Free.
   *
   * @param requestId - `request_id` from the 202 response.
   * @returns `running: true` while in progress; once done, `data` is the original body.
   * @throws NotFoundError - Unknown or expired request (one that never completed was not billed).
   * @throws ScrapeBadgerError - The original call finished with an error status (as the matching subclass).
   */
  async get<T = unknown>(requestId: string): Promise<AsyncRequest<T>> {
    const { data, status, headers } = await this.client.requestWithHeaders<T>(
      `/v1/requests/${encodeURIComponent(requestId)}`
    );
    const running = status === 202;
    const retryAfter = running
      ? (data as { retry_after_seconds?: number } | null)?.retry_after_seconds
      : undefined;
    const credits = headers?.get("X-Credits-Used");
    return {
      requestId,
      running,
      status: status ?? 200,
      retryAfterSeconds: retryAfter ?? null,
      resultId: headers?.get("X-Result-ID") ?? null,
      creditsUsed: credits && /^\d+$/.test(credits) ? Number(credits) : null,
      data,
    };
  }
}
