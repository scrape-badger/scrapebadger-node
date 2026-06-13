/**
 * Shopee Reviews API client.
 *
 * Provides methods for fetching product reviews and rating summaries.
 */

import type { BaseClient } from "../internal/client.js";
import type { ShopeeReviewsParams, ReviewsResult } from "./types.js";

/**
 * Client for the Shopee product reviews endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const reviews = await client.shopee.reviews.get(12345, 67890, { market: "sg" });
 * console.log(`${reviews.summary?.rating_total} reviews`);
 * for (const review of reviews.reviews) {
 *   console.log(`${review.author_username}: ${review.rating_star}* ${review.comment}`);
 * }
 * ```
 */
export class ReviewsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get product reviews for a Shopee item.
   *
   * @param shopId - The Shopee shop identifier.
   * @param itemId - The Shopee item identifier.
   * @param options - Optional parameters (market, limit, offset, rating, filter).
   * @returns Reviews result page with review items and aggregate summary.
   * @throws NotFoundError - If the product doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async get(
    shopId: number,
    itemId: number,
    options: ShopeeReviewsParams = {}
  ): Promise<ReviewsResult> {
    return this.client.request<ReviewsResult>(
      `/v1/shopee/product/${shopId}/${itemId}/reviews`,
      {
        params: {
          market: options.market,
          limit: options.limit,
          offset: options.offset,
          rating: options.rating,
          filter: options.filter,
        },
      }
    );
  }
}
