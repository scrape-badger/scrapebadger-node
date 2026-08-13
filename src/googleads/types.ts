/**
 * TypeScript types for Google Ads Transparency Center API responses.
 *
 * These interfaces mirror the backend `google_scraper.models.ads` response
 * schema field-for-field. Keys are snake_case exactly as the backend serialises
 * them (`advertiser_id`, `first_shown_utc`, `next_page_token`); optional /
 * nullable backend fields are left `?`-optional.
 *
 * Every timestamp is exposed twice: `*_utc` as unix seconds and `*_at` as an
 * ISO-8601 string in UTC with a `Z` suffix.
 */

// =============================================================================
// Creatives
// =============================================================================

/** One creative as returned by a creative search. */
export interface GoogleAdsCreative {
  creative_id?: string;
  advertiser_id?: string;
  advertiser_name?: string;
  target_domain?: string;
  /** TEXT | IMAGE | VIDEO */
  format?: string;
  media_url?: string;
  preview_html?: string;
  first_shown_utc?: number;
  first_shown_at?: string;
  last_shown_utc?: number;
  last_shown_at?: string;
  days_shown?: number;
  details_link?: string;
}

/**
 * Which requested filters the upstream RPC actually honoured.
 *
 * `platform` and `political` have no calibrated wire field on the Transparency
 * Center RPC, so they are reported here as `false` rather than silently
 * dropped — a filter that appears to work but doesn't is worse than one that
 * says it didn't.
 */
export interface GoogleAdsAppliedFilters {
  region: boolean;
  advertiser_id: boolean;
  query: boolean;
  format: boolean;
  date_range: boolean;
  platform: boolean;
  political: boolean;
}

/** One rendered size/variant of a creative. */
export interface GoogleAdsCreativeVariation {
  media_url?: string;
  preview_html?: string;
  width?: number;
  height?: number;
}

/** Disclosed spend for a political advertiser in one region. */
export interface GoogleAdsPoliticalRegionSpend {
  region?: string;
  currency?: string;
  spend?: number;
  ads_count?: number;
}

/**
 * Political-ad disclosure for a creative's advertiser.
 *
 * `spend_min`/`spend_max` and the impression bounds are the per-creative
 * disclosure ranges the Transparency Center UI shows; their wire fields are not
 * calibrated yet and stay absent until they are.
 */
export interface GoogleAdsPoliticalDisclosure {
  currency?: string;
  spend?: number;
  spend_min?: number;
  spend_max?: number;
  impressions_min?: number;
  impressions_max?: number;
  ads_count?: number;
  regions: GoogleAdsPoliticalRegionSpend[];
}

// =============================================================================
// Advertisers
// =============================================================================

/** One advertiser (or bare domain) from the autocomplete search. */
export interface GoogleAdsAdvertiserSuggestion {
  advertiser_id?: string;
  name?: string;
  region?: string;
  domain?: string;
  verified?: boolean;
  ads_count?: number;
  details_link?: string;
}

/** Share of an advertiser's disclosed spend by creative format. */
export interface GoogleAdsAdvertiserAdMix {
  /** TEXT | IMAGE | VIDEO */
  format?: string;
  share?: number;
  spend?: number;
}

/** Disclosed spend for one day of the requested window. */
export interface GoogleAdsAdvertiserSpendPoint {
  /** YYYYMMDD, as Google returns it. */
  date?: string;
  share?: number;
  spend?: number;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** A page of creatives matching a search. */
export interface GoogleAdsSearchResponse {
  region: string;
  total_results?: number;
  returned_results: number;
  next_page_token?: string;
  filters_applied: GoogleAdsAppliedFilters;
  creatives: GoogleAdsCreative[];
}

/** Full detail for a single creative: media, variations, dates, domain. */
export interface GoogleAdsCreativeResponse {
  creative_id?: string;
  advertiser_id?: string;
  advertiser_name?: string;
  target_domain?: string;
  region: string;
  /** TEXT | IMAGE | VIDEO */
  format?: string;
  media_url?: string;
  first_shown_utc?: number;
  first_shown_at?: string;
  last_shown_utc?: number;
  last_shown_at?: string;
  days_shown?: number;
  details_link?: string;
  variations: GoogleAdsCreativeVariation[];
  political?: GoogleAdsPoliticalDisclosure;
}

/** Advertiser name/domain resolved to advertiser IDs. */
export interface GoogleAdsAdvertisersResponse {
  query: string;
  region: string;
  advertisers: GoogleAdsAdvertiserSuggestion[];
}

/** Advertiser identity plus disclosed spend and ad mix for one region. */
export interface GoogleAdsAdvertiserResponse {
  advertiser_id: string;
  advertiser_name?: string;
  region: string;
  verified?: boolean;
  ads_count?: number;
  currency?: string;
  spend?: number;
  start_date?: string;
  end_date?: string;
  details_link?: string;
  ad_mix: GoogleAdsAdvertiserAdMix[];
  spend_by_date: GoogleAdsAdvertiserSpendPoint[];
}

// =============================================================================
// Param Enums
// =============================================================================

/** Creative format filter. */
export type GoogleAdsFormat = "TEXT" | "IMAGE" | "VIDEO";

/** Surface the ad ran on. Validated but NOT yet applied upstream. */
export type GoogleAdsPlatform = "SEARCH" | "MAPS" | "PLAY" | "SHOPPING" | "YOUTUBE";

// =============================================================================
// Request Parameter Types
// =============================================================================

/**
 * Options for the /search endpoint.
 *
 * One of `advertiserId` or `query` is required.
 */
export interface GoogleAdsSearchParams {
  /** Advertiser ID as shown in the Transparency Center URL, e.g. "AR0161…". */
  advertiserId?: string;
  /** Free text — an advertiser name or a verified domain such as "tesla.com". */
  query?: string;
  /**
   * ISO 3166-1 alpha-2 region the ad was served in ("US", "DE", "GB", …), or
   * "anywhere" for no region filter (default: "US").
   */
  region?: string;
  /** Surface the ad ran on. Validated but NOT applied — see `filters_applied`. */
  platform?: GoogleAdsPlatform;
  /** Creative format. */
  format?: GoogleAdsFormat;
  /** Only creatives still running on/after this date (YYYY-MM-DD). */
  startDate?: string;
  /** Only creatives first shown on/before this date (YYYY-MM-DD). */
  endDate?: string;
  /** Restrict to political ads. Validated but NOT applied upstream. */
  political?: boolean;
  /** Results per page, 1-100 (default: 40). */
  num?: number;
  /** `next_page_token` from a previous response. */
  cursor?: string;
}

/** Options for the /creative endpoint. */
export interface GoogleAdsCreativeParams {
  /** ISO 3166-1 alpha-2 region, or "anywhere" (default: "US"). */
  region?: string;
  /**
   * Also fetch the advertiser's political-ad spend disclosure for `region`.
   * Costs one extra upstream call and is empty for non-political advertisers.
   */
  political?: boolean;
}

/** Options for the /advertisers endpoint. */
export interface GoogleAdsAdvertisersParams {
  /** ISO 3166-1 alpha-2 region, or "anywhere" (default: "US"). */
  region?: string;
  /** Suggestions to return, 1-20 (default: 10). */
  num?: number;
}

/** Options for the /advertiser endpoint. */
export interface GoogleAdsAdvertiserParams {
  /**
   * ISO 3166-1 alpha-2 region (default: "US"). Spend disclosure is
   * region-scoped — "anywhere" returns nothing, so it falls back to "US".
   */
  region?: string;
  /** Window start (YYYY-MM-DD). Defaults to 30 days ago. */
  startDate?: string;
  /** Window end (YYYY-MM-DD). Defaults to today. */
  endDate?: string;
}
