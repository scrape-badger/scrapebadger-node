/**
 * Yahoo Search API client.
 *
 * Web search and search-box autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YahooAutocompleteParams,
  YahooAutocompleteResponse,
  YahooSearchParams,
  YahooSearchResponse,
} from "./types.js";

/**
 * Client for Yahoo web search and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.yahoo.search.search("coffee machine");
 * for (const r of results.results) {
 *   console.log(`${r.position}. ${r.title} — ${r.url}`);
 * }
 *
 * const suggestions = await client.yahoo.search.autocomplete("coff");
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search yahoo.com — the web SERP.
   *
   * Yahoo serves 7 organic results per page, so `offset` moves in steps of 7
   * (page 2 is `offset: 7`). There is no page-size parameter.
   *
   * @param query - Search keywords, e.g. `"coffee machine"`.
   * @param params - Optional market, offset and safe-search filter.
   * @returns A page of organic results, ads and related searches.
   */
  async search(query: string, params: YahooSearchParams = {}): Promise<YahooSearchResponse> {
    return this.client.request<YahooSearchResponse>("/v1/yahoo/search", {
      params: {
        query,
        market: params.market,
        offset: params.offset,
        safe_search: params.safe_search,
      },
    });
  }

  /**
   * Yahoo search-box suggestions — the cheapest call in this API.
   *
   * @param query - Partial search term, e.g. `"coff"`.
   * @param params - Optional market.
   */
  async autocomplete(
    query: string,
    params: YahooAutocompleteParams = {}
  ): Promise<YahooAutocompleteResponse> {
    return this.client.request<YahooAutocompleteResponse>("/v1/yahoo/autocomplete", {
      params: {
        query,
        market: params.market,
      },
    });
  }
}
