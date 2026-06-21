/**
 * eBay Sellers API client.
 *
 * Provides methods for seller profile, storefront listings, and feedback.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  EbaySellerParams,
  EbaySellerItemsParams,
  EbaySellerFeedbackParams,
  SellerProfileResponse,
  SellerItemsResponse,
  SellerFeedbackResponse,
} from "./types.js";

/**
 * Client for eBay seller endpoints (profile, items, feedback).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.ebay.sellers.get("musicmagpie");
 * console.log(profile.seller.feedback_score);
 *
 * const items = await client.ebay.sellers.items("musicmagpie");
 * const feedback = await client.ebay.sellers.feedback("musicmagpie");
 * ```
 */
export class SellersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get an eBay seller's public profile.
   *
   * @param username - The seller username.
   * @param options - Optional parameters (domain).
   * @returns Seller profile response.
   * @throws NotFoundError - If the seller doesn't exist.
   */
  async get(
    username: string,
    options: EbaySellerParams = {}
  ): Promise<SellerProfileResponse> {
    return this.client.request<SellerProfileResponse>(
      `/v1/ebay/sellers/${username}`,
      { params: { domain: options.domain } }
    );
  }

  /**
   * List the active listings of a single eBay seller.
   *
   * @param username - The seller username.
   * @param options - Optional parameters (domain, query, page, per_page).
   * @returns Seller items response with result cards and pagination.
   */
  async items(
    username: string,
    options: EbaySellerItemsParams = {}
  ): Promise<SellerItemsResponse> {
    return this.client.request<SellerItemsResponse>(
      `/v1/ebay/sellers/${username}/items`,
      {
        params: {
          domain: options.domain,
          query: options.query,
          page: options.page,
          per_page: options.per_page,
        },
      }
    );
  }

  /**
   * Get a seller's recent feedback comments.
   *
   * @param username - The seller username.
   * @param options - Optional parameters (domain, page).
   * @returns Seller feedback response with feedback entries and pagination.
   */
  async feedback(
    username: string,
    options: EbaySellerFeedbackParams = {}
  ): Promise<SellerFeedbackResponse> {
    return this.client.request<SellerFeedbackResponse>(
      `/v1/ebay/sellers/${username}/feedback`,
      { params: { domain: options.domain, page: options.page } }
    );
  }
}
