/**
 * Google Ads Transparency Center API client.
 *
 * Ads Transparency endpoints: searchAds (creatives by advertiser, domain or
 * free text), getCreative (one creative in full), searchAdvertisers (resolve a
 * name or domain to advertiser IDs) and getAdvertiser (identity plus disclosed
 * spend).
 *
 * Filter honesty: `region`, `advertiser_id` and `query` are pushed into the
 * upstream RPC; `format` and the date window are applied over the parsed page.
 * `platform` and `political` cannot be applied upstream yet — both are
 * validated and reported back under `filters_applied` so a caller can see they
 * were not honoured.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleAdsAdvertiserParams,
  GoogleAdsAdvertiserResponse,
  GoogleAdsAdvertisersParams,
  GoogleAdsAdvertisersResponse,
  GoogleAdsCreativeParams,
  GoogleAdsCreativeResponse,
  GoogleAdsSearchParams,
  GoogleAdsSearchResponse,
} from "./types.js";

/**
 * Client for all Google Ads Transparency Center API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Resolve a domain to advertiser IDs
 * const found = await client.googleAds.searchAdvertisers("tesla.com");
 * const advertiserId = found.advertisers[0]!.advertiser_id!;
 *
 * // Their creatives
 * const ads = await client.googleAds.searchAds({ advertiserId, format: "VIDEO" });
 * for (const creative of ads.creatives) {
 *   console.log(creative.creative_id, creative.first_shown_at);
 * }
 *
 * // One creative in full
 * const detail = await client.googleAds.getCreative(
 *   advertiserId,
 *   ads.creatives[0]!.creative_id!
 * );
 *
 * // Disclosed spend
 * const profile = await client.googleAds.getAdvertiser(advertiserId);
 * console.log(profile.spend, profile.currency);
 * ```
 */
export class GoogleAdsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search creatives by advertiser, domain or free text.
   *
   * One of `advertiserId` or `query` is required.
   *
   * @param options - Search parameters (advertiserId, query, region, platform,
   *   format, startDate, endDate, political, num, cursor).
   * @returns Search response with matching creatives and which filters were
   *   actually honoured.
   * @throws ValidationError - If neither `advertiserId` nor `query` is given,
   *   or a filter value is unknown.
   * @throws AuthenticationError - If the API key is invalid.
   */
  async searchAds(options: GoogleAdsSearchParams = {}): Promise<GoogleAdsSearchResponse> {
    return this.client.request<GoogleAdsSearchResponse>("/v1/google/ads/search", {
      params: {
        advertiser_id: options.advertiserId,
        query: options.query,
        region: options.region ?? "US",
        platform: options.platform,
        format: options.format,
        start_date: options.startDate,
        end_date: options.endDate,
        political: options.political,
        num: options.num,
        cursor: options.cursor,
      },
    });
  }

  /**
   * Get full detail for a single creative: media, variations, dates, domain.
   *
   * @param advertiserId - Advertiser ID, e.g. "AR01614014350098432001".
   * @param creativeId - Creative ID, e.g. "CR10484731423840108545".
   * @param options - Optional parameters (region, political).
   * @returns Creative response with every rendered variation.
   * @throws NotFoundError - If the creative doesn't exist for the advertiser.
   */
  async getCreative(
    advertiserId: string,
    creativeId: string,
    options: GoogleAdsCreativeParams = {}
  ): Promise<GoogleAdsCreativeResponse> {
    return this.client.request<GoogleAdsCreativeResponse>("/v1/google/ads/creative", {
      params: {
        advertiser_id: advertiserId,
        creative_id: creativeId,
        region: options.region ?? "US",
        political: options.political,
      },
    });
  }

  /**
   * Resolve an advertiser name or domain to advertiser IDs.
   *
   * @param query - Advertiser name or domain to autocomplete (2+ characters).
   * @param options - Optional parameters (region, num).
   * @returns Advertisers response with matching advertisers and their IDs.
   * @throws ValidationError - If the query is too short.
   */
  async searchAdvertisers(
    query: string,
    options: GoogleAdsAdvertisersParams = {}
  ): Promise<GoogleAdsAdvertisersResponse> {
    return this.client.request<GoogleAdsAdvertisersResponse>("/v1/google/ads/advertisers", {
      params: { query, region: options.region ?? "US", num: options.num },
    });
  }

  /**
   * Get advertiser identity plus disclosed spend and ad mix for one region.
   *
   * @param advertiserId - Advertiser ID, e.g. "AR01614014350098432001".
   * @param options - Optional parameters (region, startDate, endDate).
   * @returns Advertiser response with disclosed spend, ad mix and a daily
   *   spend series.
   * @throws NotFoundError - If there is no disclosure for the advertiser in the
   *   region and window.
   */
  async getAdvertiser(
    advertiserId: string,
    options: GoogleAdsAdvertiserParams = {}
  ): Promise<GoogleAdsAdvertiserResponse> {
    return this.client.request<GoogleAdsAdvertiserResponse>("/v1/google/ads/advertiser", {
      params: {
        advertiser_id: advertiserId,
        region: options.region ?? "US",
        start_date: options.startDate,
        end_date: options.endDate,
      },
    });
  }
}
