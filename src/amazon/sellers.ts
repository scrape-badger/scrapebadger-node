/**
 * Amazon Sellers API client.
 *
 * Provides methods for seller profile, storefront products, and buyer feedback.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  AmazonSellerParams,
  AmazonSellerListParams,
  SellerProfileResponse,
  SellerProductsResponse,
  SellerFeedbackResponse,
} from "./types.js";

/**
 * Client for Amazon seller endpoints (profile, products, feedback).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.amazon.sellers.get("A2L77EE7U53NWQ");
 * console.log(profile.seller.name);
 *
 * const products = await client.amazon.sellers.products("A2L77EE7U53NWQ");
 * ```
 */
export class SellersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a seller's profile and ratings.
   *
   * @param sellerId - The seller ID.
   * @param options - Optional parameters (domain).
   * @returns Seller profile response.
   * @throws NotFoundError - If the seller doesn't exist.
   */
  async get(
    sellerId: string,
    options: AmazonSellerParams = {}
  ): Promise<SellerProfileResponse> {
    return this.client.request<SellerProfileResponse>(
      `/v1/amazon/sellers/${sellerId}`,
      { params: { domain: options.domain } }
    );
  }

  /**
   * Get a seller's storefront listings.
   *
   * @param sellerId - The seller ID.
   * @param options - Optional parameters (domain, page).
   * @returns Seller products response with result rows and pagination.
   */
  async products(
    sellerId: string,
    options: AmazonSellerListParams = {}
  ): Promise<SellerProductsResponse> {
    return this.client.request<SellerProductsResponse>(
      `/v1/amazon/sellers/${sellerId}/products`,
      { params: { domain: options.domain, page: options.page } }
    );
  }

  /**
   * Get buyer feedback entries for a seller.
   *
   * @param sellerId - The seller ID.
   * @param options - Optional parameters (domain, page).
   * @returns Seller feedback response with feedback entries and pagination.
   */
  async feedback(
    sellerId: string,
    options: AmazonSellerListParams = {}
  ): Promise<SellerFeedbackResponse> {
    return this.client.request<SellerFeedbackResponse>(
      `/v1/amazon/sellers/${sellerId}/feedback`,
      { params: { domain: options.domain, page: options.page } }
    );
  }
}
