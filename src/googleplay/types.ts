/**
 * TypeScript types for Google Play Store API responses.
 *
 * These interfaces mirror the backend `google_play_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises them
 * (`app_id`, `content_rating`, `next_page_token`); optional / nullable backend
 * fields are left `?`-optional.
 *
 * Play is one global host localised by two INDEPENDENT parameters: `country`
 * (`gl` — pricing, availability, chart ranking) and `lang` (`hl` — the language
 * of descriptions and reviews).
 *
 * Every datetime ships in BOTH forms: `*_utc` (Unix seconds, for maths and
 * sorting) and `*_at` (ISO 8601 UTC string, for humans).
 */

// =============================================================================
// Shared value objects
// =============================================================================

/** An app's purchase price. Free apps report 0.0 with `is_free=true`. */
export interface GooglePlayPrice {
  price?: number;
  currency?: string;
  price_text?: string;
  is_free?: boolean;
}

/**
 * The publisher, plus the legal entity Play discloses beneath it.
 *
 * `name` and `legal_name` differ more often than not (WhatsApp LLC vs Meta
 * Platforms, Inc.), and only the legal block carries the postal address and
 * phone number.
 */
export interface GooglePlayDeveloper {
  name?: string;
  developer_id?: string;
  url?: string;
  email?: string;
  website?: string;
  address?: string;
  phone?: string;
  legal_name?: string;
  legal_email?: string;
}

/** The 1-5 star breakdown Play renders as the bar chart. */
export interface GooglePlayRatingHistogram {
  one_star?: number;
  two_star?: number;
  three_star?: number;
  four_star?: number;
  five_star?: number;
}

/** A Play app or game category. */
export interface GooglePlayCategory {
  name?: string;
  category_id?: string;
  url?: string;
}

/** The "#1 top free communication" badge, when the app carries one. */
export interface GooglePlayChartRank {
  rank?: string;
  chart?: string;
}

/**
 * One row of Play's Data Safety card — a headline plus an optional blurb.
 *
 * The detail page carries only this summary; the per-data-type breakdown lives
 * behind Play's separate "See details" screen and is not available.
 */
export interface GooglePlayDataSafetySection {
  title?: string;
  description?: string;
}

/** An Android permission group and the individual permissions inside it. */
export interface GooglePlayPermissionGroup {
  group?: string;
  icon_url?: string;
  permissions: string[];
}

// =============================================================================
// Apps
// =============================================================================

/**
 * An app as it appears in a list (search, developer, cluster, similar).
 *
 * Play's list card is a genuinely rich record — it carries the description,
 * installs, rating and price, so a search result rarely needs a follow-up
 * detail fetch just to rank or filter.
 */
export interface GooglePlayAppCard {
  app_id: string;
  title?: string;
  developer?: string;
  summary?: string;
  description?: string;
  icon?: string;
  header_image?: string;
  screenshots: string[];
  score?: number;
  score_text?: string;
  installs?: string;
  genre?: string;
  content_rating?: string;
  price?: GooglePlayPrice;
  url?: string;
}

/** Full app detail from `/store/apps/details`. */
export interface GooglePlayApp {
  app_id: string;
  title?: string;
  url?: string;
  description?: string;
  summary?: string;
  developer?: GooglePlayDeveloper;

  // Ratings
  score?: number;
  score_text?: string;
  ratings?: number;
  reviews?: number;
  histogram?: GooglePlayRatingHistogram;

  // Reach
  installs?: string;
  installs_short?: string;
  min_installs?: number;
  max_installs?: number;
  chart_rank?: GooglePlayChartRank;

  // Commercials
  price?: GooglePlayPrice;
  offers_iap?: boolean;
  iap_range?: string;
  contains_ads?: boolean;
  ad_supported?: boolean;

  // Classification
  genre?: string;
  genre_id?: string;
  genre_url?: string;
  content_rating?: string;
  content_rating_description?: string;

  // Media
  icon?: string;
  header_image?: string;
  screenshots: string[];
  video?: string;
  video_image?: string;

  // Release / build
  released?: string;
  released_utc?: number;
  released_at?: string;
  updated_utc?: number;
  updated_at?: string;
  version?: string;
  android_version?: string;
  android_version_text?: string;
  recent_changes?: string;

  // Compliance
  privacy_policy?: string;
  data_safety: GooglePlayDataSafetySection[];
  permissions: GooglePlayPermissionGroup[];

  // Discovery
  similar_apps_url?: string;
  similar_apps: GooglePlayAppCard[];
}

// =============================================================================
// Reviews
// =============================================================================

/** One user review, with the developer's reply where one exists. */
export interface GooglePlayReview {
  review_id?: string;
  user_name?: string;
  user_image?: string;
  score?: number;
  text?: string;
  thumbs_up?: number;
  review_created_version?: string;
  at_utc?: number;
  at?: string;
  reply_author?: string;
  reply_content?: string;
  replied_utc?: number;
  replied_at?: string;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** A page of reviews. Play paginates by token only — there is no page number. */
export interface GooglePlayReviewsResponse {
  app_id: string;
  sort: string;
  result_count: number;
  next_page_token?: string;
  reviews: GooglePlayReview[];
}

/** Every Android permission an app declares, grouped as Play groups them. */
export interface GooglePlayPermissionsResponse {
  app_id: string;
  result_count: number;
  permission_groups: GooglePlayPermissionGroup[];
}

/**
 * Shared shape for every list endpoint — search, developer, similar, chart.
 *
 * One response type rather than four near-identical ones: the endpoints differ
 * in how the URL is built, not in what comes back.
 */
export interface GooglePlayAppListResponse {
  query?: string;
  url?: string;
  result_count: number;
  apps: GooglePlayAppCard[];
}

/** Every Play app and game category id. */
export interface GooglePlayCategoriesResponse {
  result_count: number;
  categories: GooglePlayCategory[];
}

/** A supported storefront country (`gl`) or content language (`hl`). */
export interface GooglePlayMarket {
  code: string;
  name: string;
}

/**
 * Supported storefront countries and content languages.
 *
 * The two are independent: `gl` selects pricing, availability and chart
 * ranking, `hl` selects the language of descriptions and reviews.
 */
export interface GooglePlayMarketsResponse {
  result_count: number;
  markets: GooglePlayMarket[];
  languages: GooglePlayMarket[];
}

// =============================================================================
// Param Enums
// =============================================================================

/** Review ordering for `/apps/{app_id}/reviews`. */
export type GooglePlayReviewSort = "helpfulness" | "newest" | "rating";

/** Price restriction for `/search`. Both when omitted. */
export type GooglePlayPriceFilter = "free" | "paid";

/** Top chart id for `/collections/{collection}`. */
export type GooglePlayCollection = "topselling_free" | "topselling_paid" | "topgrossing";

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Country (`gl`) + language (`hl`), accepted by every fetching endpoint. */
export interface GooglePlayLocaleParams {
  /** Play storefront country (`gl`), ISO 3166-1 alpha-2 (default: "US"). */
  country?: string;
  /** Play content language (`hl`), e.g. "en" or "pt-BR" (default: "en"). */
  lang?: string;
}

/** Options for the /search endpoint. */
export interface GooglePlaySearchParams extends GooglePlayLocaleParams {
  /** Restrict by price. Both free and paid when omitted. */
  price?: GooglePlayPriceFilter;
}

/** Options for the /apps/{app_id}/reviews endpoint. */
export interface GooglePlayReviewsParams extends GooglePlayLocaleParams {
  /** Review ordering (default: "newest"). */
  sort?: GooglePlayReviewSort;
  /** Reviews per page, 1-150 (default: 40). */
  count?: number;
  /** Continuation token from a previous response's `next_page_token`. */
  pageToken?: string;
}

/** Options for the /collections/{collection} endpoint. */
export interface GooglePlayCollectionParams extends GooglePlayLocaleParams {
  /** Category to rank within, e.g. "GAME" (default: "APPLICATION" — all apps). */
  category?: string;
}
