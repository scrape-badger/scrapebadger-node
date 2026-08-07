/**
 * Walmart Sellers API client.
 *
 * Marketplace seller profile and seller catalogue.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  WalmartSearchResponse,
  WalmartSellerProductsParams,
  WalmartSellerResponse,
} from "./types.js";

/**
 * Client for Walmart seller endpoints (profile, products).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const seller = await client.walmart.sellers.get("101040442");
 * console.log(seller.seller.name, seller.seller.rating);
 *
 * // `query` is required — the seller facet alone returns nothing.
 * const catalogue = await client.walmart.sellers.products("101040442", "headphones");
 * ```
 */
export class SellersClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get a marketplace seller's profile — contact details, address, rating,
   * policies.
   *
   * @param sellerId - Numeric catalog seller id, e.g. `"101040442"`. This is
   *   the `seller.catalog_seller_id` on a product — NOT the 32-char hex
   *   `seller_id`, which 404s as a storefront URL.
   *
   * @remarks
   * No page parameter and no product list: adding `?page=` makes Walmart's own
   * SSR throw. Use {@link products} for the catalogue.
   */
  async get(sellerId: string): Promise<WalmartSellerResponse> {
    return this.client.request<WalmartSellerResponse>(`/v1/walmart/sellers/${sellerId}`);
  }

  /**
   * List a marketplace seller's catalogue.
   *
   * @param sellerId - Numeric catalog seller id.
   * @param query - Search term scoping the catalogue. REQUIRED — this goes
   *   through search with a `retailer_id` facet, and the facet alone returns
   *   zero results.
   * @param params - Optional page (1-10) and sort.
   */
  async products(
    sellerId: string,
    query: string,
    params: WalmartSellerProductsParams = {},
  ): Promise<WalmartSearchResponse> {
    return this.client.request<WalmartSearchResponse>(
      `/v1/walmart/sellers/${sellerId}/products`,
      { params: { query, page: params.page, sort: params.sort } },
    );
  }
}
