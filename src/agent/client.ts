/**
 * Agent platform API clients.
 *
 * Free helpers around the scraper APIs: quote a call before making it and
 * report a bug. None of these calls is ever billed. (`results.get` is
 * deprecated: the API stopped storing results on 2026-11-09.) Async requests
 * (`client.requests`) live in `../requests/client.ts`.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  FeedbackOptions,
  FeedbackReceipt,
  Quote,
  QuoteOptions,
  ResultViewOptions,
} from "./types.js";

export { RequestsClient, WaitTimeoutError } from "../requests/client.js";

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

let resultsGetWarned = false;

/**
 * Deprecated client for the removed `GET /v1/results/{id}` re-read.
 *
 * ScrapeBadger no longer stores results: responses carry no `X-Result-ID` and
 * `GET /v1/results/{id}` answers 410 Gone since 2026-11-09. To get a different
 * shape of a result, re-run the call with the `jq`, `fields` or `max_items`
 * view parameters (billed as a normal call).
 *
 * @deprecated The API no longer stores results; this client will be removed.
 */
export class ResultsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Deprecated: the API no longer stores results, so there is nothing to re-read.
   *
   * `GET /v1/results/{id}` was removed from the API on 2026-11-09 and answers
   * 410 Gone, which this method throws as `ScrapeBadgerError`. Re-run the
   * original call with the `jq`, `fields` or `max_items` view parameters instead
   * (billed as a normal call). Kept only so existing code fails with a clear
   * error; it will be removed in a future release.
   *
   * @deprecated The API no longer stores results; re-run the call with view params.
   * @param resultId - ID of a stored result (no longer issued by the API).
   * @param options - `jq`, `fields`, `maxItems`, `summary` view params.
   * @throws ScrapeBadgerError - Always (410 Gone `results_removed`) against the current API.
   */
  async get<T = unknown>(resultId: string, options: ResultViewOptions = {}): Promise<T> {
    if (!resultsGetWarned) {
      resultsGetWarned = true;
      console.warn(
        "[scrapebadger] results.get() is deprecated: ScrapeBadger stopped storing results on " +
          "2026-11-09 and GET /v1/results/{id} answers 410 Gone. Re-run the call with " +
          "jq/fields/max_items view parameters instead."
      );
    }
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
