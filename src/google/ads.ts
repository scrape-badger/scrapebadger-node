/**
 * Google Ads Transparency Center API client — creatives, advertisers, spend.
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
 * Client for Google Ads Transparency Center endpoints.
 *
 * Free-text `search` is domain-based and will not find a brand by name:
 * resolve the name with `searchAdvertisers` first, then pass the
 * `advertiser_id` on.
 *
 * @example
 * ```typescript
 * const found = await client.google.ads.searchAdvertisers({ query: "rufwear", fuzzy: true });
 * const advertiserId = found.advertisers[0]?.advertiser_id ?? "";
 *
 * const ads = await client.google.ads.search({ advertiser_id: advertiserId, format: "VIDEO" });
 * const creative = await client.google.ads.creative({
 *   advertiser_id: advertiserId,
 *   creative_id: ads.creatives[0]?.creative_id ?? "",
 * });
 * const spend = await client.google.ads.advertiser({ advertiser_id: advertiserId });
 * ```
 */
export class AdsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search ad creatives by advertiser ID, verified domain or free text.
   *
   * `filters_applied` says which of the requested filters Google actually
   * honoured.
   */
  async search(params: GoogleAdsSearchParams): Promise<GoogleAdsSearchResponse> {
    return this.client.request<GoogleAdsSearchResponse>("/v1/google/ads/search", {
      params: { ...params },
    });
  }

  /**
   * Resolve an advertiser name or domain to advertiser IDs.
   *
   * Google's own matching has no typo tolerance: names match by word prefix
   * and domains by substring. `fuzzy: true` also finds misspelled and
   * look-alike advertisers; each row then carries `similarity` and
   * `matched_query`, and the response lists the `variants` searched and
   * `variants_failed`. `next_page_token` pages the domain rows only.
   */
  async searchAdvertisers(
    params: GoogleAdsAdvertisersParams
  ): Promise<GoogleAdsAdvertisersResponse> {
    return this.client.request<GoogleAdsAdvertisersResponse>("/v1/google/ads/advertisers", {
      params: { ...params },
    });
  }

  /**
   * Get an advertiser's identity plus disclosed spend, ad-format mix and
   * per-day spend for one region.
   */
  async advertiser(params: GoogleAdsAdvertiserParams): Promise<GoogleAdsAdvertiserResponse> {
    return this.client.request<GoogleAdsAdvertiserResponse>("/v1/google/ads/advertiser", {
      params: { ...params },
    });
  }

  /**
   * Get full detail for one creative: media, every rendered size in
   * `variations`, run dates and, with `political: true`, the advertiser's
   * political spend disclosure.
   */
  async creative(params: GoogleAdsCreativeParams): Promise<GoogleAdsCreativeResponse> {
    return this.client.request<GoogleAdsCreativeResponse>("/v1/google/ads/creative", {
      params: { ...params },
    });
  }
}
