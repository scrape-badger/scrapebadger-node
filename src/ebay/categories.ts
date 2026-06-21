/**
 * eBay Categories API client.
 *
 * Provides methods for browsing a category's listings and listing the
 * reference category aliases.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  EbayCategoryParams,
  CategoryResponse,
  CategoriesResponse,
} from "./types.js";

/**
 * Client for eBay category endpoints (browse, list).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const listings = await client.ebay.categories.browse("9355");
 * for (const item of listings.results) {
 *   console.log(item.title);
 * }
 *
 * const categories = await client.ebay.categories.list();
 * ```
 */
export class CategoriesClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * List active listings within an eBay category.
   *
   * @param categoryId - The eBay category id.
   * @param options - Optional parameters (domain, page, per_page, sort_by, min_price, max_price).
   * @returns Category response with result cards, facets, and pagination.
   */
  async browse(
    categoryId: string,
    options: EbayCategoryParams = {}
  ): Promise<CategoryResponse> {
    return this.client.request<CategoryResponse>(
      `/v1/ebay/categories/${categoryId}/items`,
      {
        params: {
          domain: options.domain,
          page: options.page,
          per_page: options.per_page,
          sort_by: options.sort_by,
          min_price: options.min_price,
          max_price: options.max_price,
        },
      }
    );
  }

  /**
   * List eBay's reference top-level category ids.
   *
   * @returns Categories response with all category aliases.
   */
  async list(): Promise<CategoriesResponse> {
    return this.client.request<CategoriesResponse>("/v1/ebay/categories");
  }
}
