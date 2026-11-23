/**
 * Google Web Search (SERP) API client.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResolveAllOptions,
  GoogleResolveItem,
  GoogleResolveParams,
  GoogleResolveResponse,
  GoogleResponse,
  GoogleSearchParams,
} from "./types.js";

/** Params that only full Search takes; the Light endpoint can't be upgraded. */
const FULL_SEARCH_ONLY = ["mode", "ai_overview", "expand_related_questions"] as const;

/** Most results one `POST /v1/google/resolve` request takes. */
const RESOLVE_MAX_RESULTS = 25;

/** Default `maxWaitMs` of `resolveAll`: four minutes. */
const DEFAULT_RESOLVE_MAX_WAIT_MS = 240_000;

/** Shortest pause between two `resolveAll` rounds. */
const MIN_RESOLVE_WAIT_MS = 1_000;

/**
 * Client for Google Web Search.
 *
 * @example
 * ```typescript
 * const serp = await client.google.search.search({ q: "python 3.13" });
 * for (const r of serp.organic_results as any[]) {
 *   console.log(r.title, r.link);
 * }
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Google and get a structured SERP response with organic results,
   * knowledge graph, People Also Ask, related searches, AI overview, and
   * pagination.
   *
   * The response (untyped, `Record<string, unknown>`) holds, when Google
   * shows them:
   * - `search_information`: total_results, time_taken, query_displayed,
   *   organic_results_state (`"no_results"` on an explicit Google
   *   no-results answer, `"Results for relaxed query"` when Google drops
   *   quotes).
   * - `organic_results`: position, title, link, snippet, displayed_link,
   *   plus `date`, `sitelinks`, `rich_snippet` and `read_more_link`. A
   *   result whose `link` is still a Google redirect
   *   (`https://www.google.com/goto?url=...`) also has `link_token` and
   *   `retry_after_seconds` (seconds until the token can be resolved, 0 =
   *   right away); both are `null` when `link` is already the result's own
   *   URL. Pass such results to {@link resolve} or {@link resolveAll}.
   * - `related_questions`: question, rank, `type` (`"ai_overview"` or
   *   `null`), and `text_blocks` / `references` with
   *   `expand_related_questions`.
   * - `ai_overview`: `text_blocks` (paragraph, heading and list blocks; list
   *   blocks carry `list_items`) with `reference_indexes` (0-based into
   *   `references`), and `references` (title, link, source, snippet, logo).
   * - `shopping_results`: position, category, title, price, extracted_price,
   *   original_price, extracted_original_price, source, rating, reviews,
   *   delivery, extensions, thumbnail, product_id, catalog_id, product_link,
   *   scrapebadger_product_detail_link.
   * - `perspectives`, `discussions_and_forums`, `short_videos`,
   *   `things_to_know`, `ads`, `knowledge_graph`, `people_also_search_for`,
   *   `related_searches`, `local_results`, `inline_videos`, `pagination`.
   *
   * A full-mode query with a `site:` operator is answered from Google's Web
   * tab: organic results, related searches and pagination only, rich blocks
   * empty (pass `ai_overview: true` for the full page).
   *
   * @example
   * ```typescript
   * // People Also Ask answers for the first two questions
   * const serp = await client.google.search.search({
   *   q: "are noise cancelling headphones worth it",
   *   expand_related_questions: 2,
   * });
   * ```
   */
  async search(params: GoogleSearchParams & { output: "html" }): Promise<string>;
  async search(params: GoogleSearchParams & { output?: "json" }): Promise<GoogleResponse>;
  async search(params: GoogleSearchParams): Promise<GoogleResponse | string>;
  async search(params: GoogleSearchParams): Promise<GoogleResponse | string> {
    return this.client.request<GoogleResponse | string>("/v1/google/search", {
      params: { ...params },
    });
  }

  /**
   * Google Light Search — organic results + related searches only.
   *
   * Calls the dedicated `/v1/google/light/search` endpoint, billed at the
   * Light rate (half of full {@link search}; query `/public/pricing` for the
   * live rate). Skips ads, Knowledge Graph, AI Overview, People Also Ask,
   * local pack, news, inline videos, and shopping blocks. Has a 12-second
   * processing budget; past it the API returns `503` with
   * `Retry-After: 60`. Light cannot be upgraded to full Search, so
   * `ai_overview` is not sent; AI Overview and People Also Ask answers
   * (`expand_related_questions`) need {@link search}.
   *
   * Returns `{ search_information, organic_results, related_searches,
   * pagination }`. As in {@link search}, an organic result whose `link` is
   * still a Google redirect has `link_token` and `retry_after_seconds`.
   *
   * @example
   * ```typescript
   * const lite = await client.google.search.light({ q: "python 3.13" });
   * ```
   */
  async light(
    params: Omit<GoogleSearchParams, "mode" | "expand_related_questions"> & { output: "html" }
  ): Promise<string>;
  async light(
    params: Omit<GoogleSearchParams, "mode" | "expand_related_questions"> & { output?: "json" }
  ): Promise<GoogleResponse>;
  async light(
    params: Omit<GoogleSearchParams, "mode" | "expand_related_questions">
  ): Promise<GoogleResponse | string>;
  async light(
    params: Omit<GoogleSearchParams, "mode" | "expand_related_questions">
  ): Promise<GoogleResponse | string> {
    // Strip the full-Search controls even when an untyped caller passes them.
    const light: Record<string, string | number | boolean | undefined> = { ...params };
    for (const key of FULL_SEARCH_ONLY) delete light[key];
    return this.client.request<GoogleResponse | string>("/v1/google/light/search", {
      params: light,
    });
  }

  /**
   * Resolve Google redirect links to the results' own URLs. One
   * `POST /v1/google/resolve` call, 0 credits.
   *
   * Google can return a result's `link` as a redirect
   * (`https://www.google.com/goto?url=...`) and limits how fast the links of
   * one result page can be followed. Such a result has a `link_token`. Send
   * 1 to 25 results that have one; every other field of an item is returned
   * unchanged on its row, so `organic_results` items can be sent as they
   * are.
   *
   * `results` in the response has one row per item, in the order sent. Each
   * row is one of:
   * - resolved: `link` is the result's own URL. The row has no `link_token`,
   *   `retry_after_seconds` or `error`.
   * - not ready: the row has `link_token` and `retry_after_seconds`. Wait
   *   that many seconds, then send the row's `link_token` again. It can
   *   differ from the one sent, so always keep the latest. `link` is as
   *   sent.
   * - failed: the row has `link_token` as sent and `error`. Do not send it
   *   again.
   *
   * The top-level `retry_after_seconds` is the smallest wait among the rows
   * that are not ready, or `null` when no row is waiting. A token sent
   * before its wait is over is not an error: its row comes back not ready
   * with the wait that is left.
   *
   * Polling as `retry_after_seconds` says, all ten links of a result page
   * are usually known 45 to 70 seconds after the search. Once the result
   * page is about 160 seconds old, every remaining link resolves in one
   * call. {@link resolveAll} runs this loop for you.
   *
   * @example
   * ```typescript
   * const serp = await client.google.search.search({ q: "python 3.13" });
   * const pending = (serp.organic_results as any[]).filter((r) => r.link_token);
   * const { results, retry_after_seconds } = await client.google.search.resolve({
   *   results: pending,
   * });
   * ```
   *
   * @param params - `results`: 1 to 25 items, each with a `link_token`.
   * @returns The rows in the order sent, and the smallest wait.
   * @throws ValidationError - 422: no results, more than 25, or an item without a `link_token`.
   * @throws ServerError - 503 with `Retry-After`: links cannot be resolved right now; try again later.
   */
  async resolve(params: GoogleResolveParams): Promise<GoogleResolveResponse> {
    return this.client.request<GoogleResolveResponse>("/v1/google/resolve", {
      method: "POST",
      body: { results: params.results },
    });
  }

  /**
   * Resolve every Google redirect link in a list of results, polling
   * {@link resolve} until all are known or `maxWaitMs` has passed. Free.
   *
   * Pass a search response's `organic_results`. Rows with a `link_token` are
   * sent, at most 25 per request. Between rounds it waits the
   * `retry_after_seconds` the API returned (at least one second, never past
   * the deadline). A row without a `link_token` is returned as it is and
   * never sent. A row that failed (`error`) is not sent again.
   *
   * It does not throw for rows that are still not ready at the deadline:
   * they are returned with their latest `link_token` and
   * `retry_after_seconds`, and can be passed to `resolveAll` or
   * {@link resolve} again. An API error (for example a 503) is thrown as
   * usual.
   *
   * The input array and its objects are not changed.
   *
   * @example
   * ```typescript
   * const serp = await client.google.search.search({ q: "python 3.13" });
   * const results = await client.google.search.resolveAll(
   *   serp.organic_results as Record<string, unknown>[]
   * );
   * for (const r of results) {
   *   if (r.error) console.log("failed:", r.title, r.error);
   *   else if (r.link_token) console.log("not ready yet:", r.title);
   *   else console.log(r.title, r.link);
   * }
   * ```
   *
   * @param results - Result objects, normally a search response's `organic_results`.
   * @param options - `maxWaitMs`: longest time to keep polling (default 240000, four minutes).
   * @returns A new array with one row per input row, in the same order.
   */
  async resolveAll(
    results: Record<string, unknown>[],
    options: GoogleResolveAllOptions = {}
  ): Promise<Record<string, unknown>[]> {
    const deadline = Date.now() + (options.maxWaitMs ?? DEFAULT_RESOLVE_MAX_WAIT_MS);
    const rows: Record<string, unknown>[] = results.map((row) => ({ ...row }));
    for (;;) {
      const waiting = rows.flatMap((row, index) => (isWaiting(row) ? [index] : []));
      if (waiting.length === 0) return rows;

      let waitSeconds: number | null = null;
      for (let start = 0; start < waiting.length; start += RESOLVE_MAX_RESULTS) {
        const chunk = waiting.slice(start, start + RESOLVE_MAX_RESULTS);
        const response = await this.resolve({
          results: chunk.map((index) => rows[index] as GoogleResolveItem),
        });
        chunk.forEach((index, n) => {
          const row = response.results[n];
          if (row) rows[index] = row;
        });
        const retryAfter = response.retry_after_seconds;
        if (typeof retryAfter === "number" && (waitSeconds === null || retryAfter < waitSeconds)) {
          waitSeconds = retryAfter;
        }
      }

      if (!rows.some(isWaiting)) return rows;
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) return rows;
      const waitMs = Math.max((waitSeconds ?? 0) * 1000, MIN_RESOLVE_WAIT_MS);
      await sleep(Math.min(waitMs, remainingMs));
    }
  }
}

/** True for a row that can be sent to resolve: it has a token and no error. */
function isWaiting(row: Record<string, unknown>): boolean {
  return (
    typeof row.link_token === "string" &&
    row.link_token !== "" &&
    (row.error === undefined || row.error === null)
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
