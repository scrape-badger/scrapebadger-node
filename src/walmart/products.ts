/**
 * Walmart Products API client.
 *
 * Product detail and paginated customer reviews.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  WalmartProduct,
  WalmartReviewsParams,
  WalmartReviewsResponse,
} from "./types.js";

/**
 * Client for Walmart product endpoints (detail, reviews).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const product = await client.walmart.products.get("5689919121");
 * console.log(product.name, product.price, product.seller?.seller_name);
 *
 * const reviews = await client.walmart.products.reviews("5689919121", {
 *   sort: "helpful",
 * });
 * ```
 */
export class ProductsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get full product detail.
   *
   * @param itemId - Walmart `usItemId`, e.g. `"5689919121"`.
   * @throws NotFoundError - If the item doesn't exist.
   *
   * @remarks
   * Only the numeric id is needed — the SEO slug is decorative and ignored by
   * Walmart's router. Prices and availability are store-specific; the resolved
   * store is on `location`.
   */
  async get(itemId: string): Promise<WalmartProduct> {
    return this.client.request<WalmartProduct>(`/v1/walmart/products/${itemId}`);
  }

  /**
   * Get paginated customer reviews with the full star histogram.
   *
   * @param itemId - Walmart `usItemId`.
   * @param params - Optional page (1-100) and sort.
   * @returns Reviews plus the rating breakdown, aspects, and the most-helpful
   *   positive and negative reviews.
   *
   * @remarks 10 reviews per page — Walmart's page size, not adjustable.
   */
  async reviews(
    itemId: string,
    params: WalmartReviewsParams = {},
  ): Promise<WalmartReviewsResponse> {
    return this.client.request<WalmartReviewsResponse>(
      `/v1/walmart/products/${itemId}/reviews`,
      { params: { page: params.page, sort: params.sort } },
    );
  }
}
