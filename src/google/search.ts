/**
 * Google Web Search (SERP) API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, GoogleSearchParams } from "./types.js";

/** Params that only full Search takes; the Light endpoint can't be upgraded. */
const FULL_SEARCH_ONLY = ["mode", "ai_overview", "expand_related_questions"] as const;

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
   *   plus `date`, `sitelinks`, `rich_snippet` and `read_more_link`.
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
   * pagination }`.
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
}
