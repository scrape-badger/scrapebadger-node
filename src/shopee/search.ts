/**
 * Shopee Search API client.
 *
 * Provides methods for keyword search and category-item listing.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  ShopeeSearchParams,
  ShopeeCategoryItemsParams,
  SearchResult,
} from "./types.js";

/**
 * Client for Shopee search and category-items endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.shopee.search.search({
 *   keyword: "wireless headphones",
 *   market: "sg",
 * });
 * for (const item of results.items) {
 *   console.log(`${item.name}: ${item.price} ${item.currency}`);
 * }
 *
 * const cat = await client.shopee.search.categoryItems(100001, { market: "sg" });
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Shopee for products by keyword.
   *
   * @param params - Search parameters including keyword, market, pagination, and sort.
   * @returns Search result page with matched products and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(params: ShopeeSearchParams): Promise<SearchResult> {
    return this.client.request<SearchResult>("/v1/shopee/search", {
      params: {
        keyword: params.keyword,
        market: params.market,
        limit: params.limit,
        offset: params.offset,
        sort_by: params.sort_by,
      },
    });
  }

  /**
   * List products within a specific Shopee category.
   *
   * @param categoryId - The Shopee category ID.
   * @param options - Optional parameters (market, limit, offset, sort_by).
   * @returns Search result page with products in the category.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the category ID or market is invalid.
   */
  async categoryItems(
    categoryId: number,
    options: ShopeeCategoryItemsParams = {}
  ): Promise<SearchResult> {
    return this.client.request<SearchResult>(
      `/v1/shopee/category/${categoryId}/items`,
      {
        params: {
          market: options.market,
          limit: options.limit,
          offset: options.offset,
          sort_by: options.sort_by,
        },
      }
    );
  }
}
