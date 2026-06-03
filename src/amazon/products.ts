/**
 * Amazon Products API client.
 *
 * Provides methods for fetching product detail, offers, and reviews by ASIN.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  AmazonProductParams,
  AmazonOffersParams,
  AmazonReviewsParams,
  ProductDetailResponse,
  OffersResponse,
  ReviewsResponse,
} from "./types.js";

/**
 * Client for Amazon product endpoints (detail, offers, reviews).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const detail = await client.amazon.products.get("B08N5WRWNW");
 * console.log(detail.product.title);
 *
 * const offers = await client.amazon.products.offers("B08N5WRWNW");
 * console.log(`${offers.total_offers} offers`);
 *
 * const reviews = await client.amazon.products.reviews("B08N5WRWNW");
 * ```
 */
export class ProductsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get full product detail (PDP) for an ASIN.
   *
   * @param asin - The product ASIN.
   * @param options - Optional parameters (domain, zip, language).
   * @returns Product detail including variants, badges, buybox, and related products.
   * @throws NotFoundError - If the product doesn't exist.
   */
  async get(
    asin: string,
    options: AmazonProductParams = {}
  ): Promise<ProductDetailResponse> {
    return this.client.request<ProductDetailResponse>(
      `/v1/amazon/products/${asin}`,
      {
        params: {
          domain: options.domain,
          zip: options.zip,
          language: options.language,
        },
      }
    );
  }

  /**
   * Get all-seller offers (and the buybox winner) for an ASIN.
   *
   * @param asin - The product ASIN.
   * @param options - Optional parameters (domain, zip).
   * @returns Offers response with the buybox winner and full offer list.
   */
  async offers(
    asin: string,
    options: AmazonOffersParams = {}
  ): Promise<OffersResponse> {
    return this.client.request<OffersResponse>(
      `/v1/amazon/products/${asin}/offers`,
      { params: { domain: options.domain, zip: options.zip } }
    );
  }

  /**
   * Get product reviews for an ASIN.
   *
   * @param asin - The product ASIN.
   * @param options - Optional parameters (domain, page, sort_by, star, verified_only, media_only).
   * @returns Reviews response with reviews, aggregate rating, and breakdown.
   */
  async reviews(
    asin: string,
    options: AmazonReviewsParams = {}
  ): Promise<ReviewsResponse> {
    return this.client.request<ReviewsResponse>(
      `/v1/amazon/products/${asin}/reviews`,
      {
        params: {
          domain: options.domain,
          page: options.page,
          sort_by: options.sort_by,
          star: options.star,
          verified_only: options.verified_only,
          media_only: options.media_only,
        },
      }
    );
  }
}
