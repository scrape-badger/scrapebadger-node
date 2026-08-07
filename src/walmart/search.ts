/**
 * Walmart Search API client.
 *
 * Search, category browse, the deals feed, and search-box autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  WalmartAutocompleteResponse,
  WalmartCategoryParams,
  WalmartDealsParams,
  WalmartSearchParams,
  WalmartSearchResponse,
} from "./types.js";

/**
 * Client for Walmart search, category, deals and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.walmart.search.search("laptop", { sort: "price_low" });
 * for (const item of results.items) {
 *   console.log(`${item.position}. ${item.name} — $${item.price}`);
 * }
 *
 * const browse = await client.walmart.search.category("electronics/3944");
 * const deals = await client.walmart.search.deals();
 * const suggestions = await client.walmart.search.autocomplete("lapt");
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search walmart.com.
   *
   * @param query - Search keywords, e.g. `"laptop"`.
   * @param params - Optional page (1-10), sort, price and facet filters.
   * @returns A page of ~40-60 organic products.
   *
   * @remarks
   * Results dry up after page 10 regardless of `total_results_reported`; bound
   * a crawl with `max_page`. Sponsored ad tiles are dropped, sponsored
   * *products* are returned and flagged `is_sponsored`.
   */
  async search(
    query: string,
    params: WalmartSearchParams = {},
  ): Promise<WalmartSearchResponse> {
    return this.client.request<WalmartSearchResponse>("/v1/walmart/search", {
      params: {
        query,
        page: params.page,
        sort: params.sort,
        min_price: params.min_price,
        max_price: params.max_price,
        facet: params.facet,
      },
    });
  }

  /**
   * Browse a Walmart category. Same result shape as {@link search}.
   *
   * @param path - Browse path, e.g. `"electronics/3944"`, or a `/cp/...` path.
   * @param params - Optional page (1-11), price and facet filters.
   *
   * @remarks
   * No `sort`: Walmart's browse pages ignore it (verified). Sort on
   * {@link search} instead.
   */
  async category(
    path: string,
    params: WalmartCategoryParams = {},
  ): Promise<WalmartSearchResponse> {
    return this.client.request<WalmartSearchResponse>("/v1/walmart/category", {
      params: {
        path,
        page: params.page,
        min_price: params.min_price,
        max_price: params.max_price,
        facet: params.facet,
      },
    });
  }

  /**
   * Walmart's current deals, rollbacks and clearance.
   *
   * @param params - Optional page (1-11) and price filters.
   */
  async deals(params: WalmartDealsParams = {}): Promise<WalmartSearchResponse> {
    return this.client.request<WalmartSearchResponse>("/v1/walmart/deals", {
      params: {
        page: params.page,
        min_price: params.min_price,
        max_price: params.max_price,
      },
    });
  }

  /**
   * Walmart search-box suggestions — the cheapest call in this API.
   *
   * @param query - Partial search term, e.g. `"lapt"`.
   */
  async autocomplete(query: string): Promise<WalmartAutocompleteResponse> {
    return this.client.request<WalmartAutocompleteResponse>("/v1/walmart/autocomplete", {
      params: { query },
    });
  }
}
