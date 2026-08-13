/**
 * TikTok Ads API client.
 *
 * Provides access to TikTok's Commercial Content Library (EU-DSA ad
 * transparency) via keyword or advertiser search.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokAdSearchParams,
  TikTokAdvertiserSearchParams,
  TikTokAdDetailParams,
  AdLibrarySearchResponse,
  AdvertiserSearchResponse,
  AdDetailResponse,
} from "./types.js";

/**
 * Client for the TikTok Ad Library (Commercial Content Library) endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const ads = await client.tiktok.ads.search({ query: "shoes", region: "DE" });
 * for (const ad of ads.ads) {
 *   console.log(ad.name);
 * }
 * ```
 */
export class AdsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search TikTok's Commercial Content Library (ad transparency) by keyword or advertiser.
   *
   * @param params - Optional parameters (query, advertiser_id, region, days, sort, offset, search_id, count).
   * @returns The ad-library search response with ads and pagination.
   */
  async search(params: TikTokAdSearchParams = {}): Promise<AdLibrarySearchResponse> {
    return this.client.request<AdLibrarySearchResponse>("/v1/tiktok/ads/search", {
      params: {
        query: params.query,
        advertiser_id: params.advertiser_id,
        region: params.region,
        days: params.days,
        sort: params.sort,
        offset: params.offset,
        search_id: params.search_id,
        count: params.count,
      },
    });
  }

  /**
   * Look up advertiser business ids by name.
   *
   * Feed the returned `id` into {@link search} as `advertiser_id` to list all of an
   * advertiser's ads. Matching is on the legal entity name, so a brand may appear under
   * several legal entities.
   *
   * @param params - `query` (required), plus optional `region` and `count`.
   * @returns Matching advertisers, each with a business `id`.
   */
  async searchAdvertisers(
    params: TikTokAdvertiserSearchParams,
  ): Promise<AdvertiserSearchResponse> {
    return this.client.request<AdvertiserSearchResponse>("/v1/tiktok/ads/advertisers", {
      params: {
        query: params.query,
        region: params.region,
        count: params.count,
      },
    });
  }

  /**
   * Get a single ad's advertiser, creatives, and full targeting/impression breakdown.
   *
   * @param adId - Ad id from a {@link search} result.
   * @param params - Optional `region` (EU-only, default "DE").
   * @returns The ad, its advertiser, and per-region age/gender impression targeting.
   */
  async getDetail(
    adId: string,
    params: TikTokAdDetailParams = {},
  ): Promise<AdDetailResponse> {
    return this.client.request<AdDetailResponse>(`/v1/tiktok/ads/${adId}`, {
      params: { region: params.region },
    });
  }
}
