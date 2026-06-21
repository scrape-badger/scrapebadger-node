/**
 * eBay Items API client.
 *
 * Provides methods for fetching item detail and catalog product reviews.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  EbayItemParams,
  EbayReviewsParams,
  ItemDetailResponse,
  ReviewsResponse,
} from "./types.js";

/**
 * Client for eBay item endpoints (detail, reviews).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const detail = await client.ebay.items.get("123456789012");
 * console.log(detail.item.title);
 *
 * const reviews = await client.ebay.items.reviews("123456789012");
 * console.log(`${reviews.ratings_total} reviews`);
 * ```
 */
export class ItemsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single eBay listing's full detail.
   *
   * @param itemId - The eBay item id.
   * @param options - Optional parameters (domain).
   * @returns Item detail including specifics, shipping, and seller summary.
   * @throws NotFoundError - If the item doesn't exist.
   */
  async get(
    itemId: string,
    options: EbayItemParams = {}
  ): Promise<ItemDetailResponse> {
    return this.client.request<ItemDetailResponse>(
      `/v1/ebay/items/${itemId}`,
      { params: { domain: options.domain } }
    );
  }

  /**
   * Get the catalog product reviews shown on an eBay listing.
   *
   * @param itemId - The eBay item id.
   * @param options - Optional parameters (domain, page, productId).
   * @returns Reviews response with reviews, aggregate rating, and histogram.
   */
  async reviews(
    itemId: string,
    options: EbayReviewsParams = {}
  ): Promise<ReviewsResponse> {
    return this.client.request<ReviewsResponse>(
      `/v1/ebay/items/${itemId}/reviews`,
      {
        params: {
          domain: options.domain,
          page: options.page,
          product_id: options.productId,
        },
      }
    );
  }
}
