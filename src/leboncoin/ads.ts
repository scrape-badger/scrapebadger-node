/**
 * Leboncoin Ads API client.
 *
 * Provides methods for fetching a single ad's detail and the ads Leboncoin
 * surfaces as similar to it.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  LeboncoinSimilarParams,
  AdResponse,
  SimilarResponse,
} from "./types.js";

/**
 * Client for Leboncoin ad endpoints (detail, similar).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const detail = await client.leboncoin.ads.get(2934857123);
 * console.log(detail.ad.subject);
 *
 * const similar = await client.leboncoin.ads.similar(2934857123);
 * console.log(`${similar.ads.length} similar ads`);
 * ```
 */
export class AdsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single Leboncoin ad's full detail.
   *
   * @param listId - The Leboncoin ad list id.
   * @returns Ad detail response.
   * @throws NotFoundError - If the ad doesn't exist.
   */
  async get(listId: number | string): Promise<AdResponse> {
    return this.client.request<AdResponse>(`/v1/leboncoin/ads/${listId}`);
  }

  /**
   * Get the ads Leboncoin surfaces as similar to a given ad.
   *
   * @param listId - The Leboncoin ad list id.
   * @param options - Optional parameters (limit).
   * @returns Similar-ads response.
   */
  async similar(
    listId: number | string,
    options: LeboncoinSimilarParams = {}
  ): Promise<SimilarResponse> {
    return this.client.request<SimilarResponse>(
      `/v1/leboncoin/ads/${listId}/similar`,
      { params: { limit: options.limit } }
    );
  }
}
