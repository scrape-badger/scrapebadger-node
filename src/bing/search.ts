/**
 * Bing Search API client.
 *
 * Web search and search-box autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  BingAutocompleteParams,
  BingAutocompleteResponse,
  BingSearchParams,
  BingSearchResponse,
} from "./types.js";

/**
 * Client for Bing web search and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.bing.search.search("coffee machine");
 * for (const r of results.results) {
 *   console.log(`${r.position}. ${r.title} — ${r.url}`);
 * }
 *
 * const suggestions = await client.bing.search.autocomplete("coff");
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search bing.com — the web SERP.
   *
   * @param query - Search keywords, e.g. `"coffee machine"`.
   * @param params - Optional market, count, offset and safe-search filter.
   * @returns A page of organic results, ads and related searches.
   */
  async search(query: string, params: BingSearchParams = {}): Promise<BingSearchResponse> {
    return this.client.request<BingSearchResponse>("/v1/bing/search", {
      params: {
        query,
        market: params.market,
        count: params.count,
        offset: params.offset,
        safe_search: params.safe_search,
      },
    });
  }

  /**
   * Bing search-box suggestions — the cheapest call in this API.
   *
   * @param query - Partial search term, e.g. `"coff"`.
   * @param params - Optional market.
   */
  async autocomplete(
    query: string,
    params: BingAutocompleteParams = {}
  ): Promise<BingAutocompleteResponse> {
    return this.client.request<BingAutocompleteResponse>("/v1/bing/autocomplete", {
      params: {
        query,
        market: params.market,
      },
    });
  }
}
