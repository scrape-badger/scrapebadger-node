/**
 * Leboncoin Sellers API client.
 *
 * Provides methods for a seller's public profile and their active listings.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  LeboncoinSellerListingsParams,
  SellerResponse,
  SellerListingsResponse,
} from "./types.js";

/**
 * Client for Leboncoin seller endpoints (profile, listings).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.leboncoin.sellers.get("a1b2c3d4-...");
 * console.log(profile.seller.name);
 *
 * const listings = await client.leboncoin.sellers.listings("a1b2c3d4-...");
 * console.log(`${listings.total} ads`);
 * ```
 */
export class SellersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a Leboncoin seller's public profile.
   *
   * @param userId - The seller user id.
   * @returns Seller profile response.
   * @throws NotFoundError - If the seller doesn't exist.
   */
  async get(userId: string): Promise<SellerResponse> {
    return this.client.request<SellerResponse>(
      `/v1/leboncoin/sellers/${userId}`
    );
  }

  /**
   * List a Leboncoin seller's active ads.
   *
   * @param userId - The seller user id.
   * @param options - Optional parameters (page, limit).
   * @returns Seller listings response with ads and pagination.
   */
  async listings(
    userId: string,
    options: LeboncoinSellerListingsParams = {}
  ): Promise<SellerListingsResponse> {
    return this.client.request<SellerListingsResponse>(
      `/v1/leboncoin/sellers/${userId}/listings`,
      { params: { page: options.page, limit: options.limit } }
    );
  }
}
