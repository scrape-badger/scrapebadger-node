/**
 * TypeScript types for Apple App Store API responses.
 *
 * These interfaces mirror the backend `app_store_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises them
 * (`app_id`, `formatted_price`, `release_date_utc`); optional / nullable
 * backend fields are left `?`-optional.
 *
 * Two upstream sources feed these types, and the split matters for reliability:
 *
 * - **iTunes** — the documented public API. Every field on `AppStoreApp`,
 *   `AppStoreReview`, `AppStoreChartEntry` and `AppStoreDeveloper` comes from
 *   here.
 * - **Storefront** — the server-rendered product page, whose embedded JSON
 *   carries what the API omits: the 1-5 star histogram, the in-app-purchase
 *   price list, per-device screenshots at full resolution, chart position,
 *   Editors' Choice, and the App Privacy breakdown. Everything sourced from it
 *   lives under `AppStoreApp.extras` and is OPTIONAL — a detail response
 *   degrades to iTunes-only rather than failing.
 *
 * Every datetime ships in BOTH forms: `*_utc` (Unix seconds, for maths and
 * sorting) and `*_at` (ISO 8601 UTC string, for humans).
 */

// =============================================================================
// Storefront-only value objects (AppStoreApp.extras)
// =============================================================================

/**
 * A screenshot at its native resolution.
 *
 * iTunes returns screenshots pre-scaled to a fixed thumbnail size; the
 * storefront returns the source artwork plus its true dimensions, so these are
 * the full-resolution originals.
 */
export interface AppStoreScreenshot {
  url: string;
  width?: number;
  height?: number;
}

/**
 * One IAP tier as displayed on the product page.
 *
 * Apple exposes only the display price (localised, tax-inclusive per
 * storefront) — there is no numeric/currency split on the page.
 */
export interface AppStoreInAppPurchase {
  name: string;
  price?: string;
}

/**
 * Star breakdown behind the average rating.
 *
 * `total` is Apple's own count for the storefront and can differ slightly from
 * the iTunes `rating_count` — the two are computed on different schedules.
 * Both are surfaced rather than reconciled.
 */
export interface AppStoreRatingHistogram {
  average?: number;
  total?: number;
  one_star: number;
  two_star: number;
  three_star: number;
  four_star: number;
  five_star: number;
}

/** One App Privacy ("nutrition label") group and its data categories. */
export interface AppStorePrivacyType {
  identifier?: string;
  title?: string;
  detail?: string;
  categories: string[];
}

/** Storefront-sourced enrichment. Absent when the page fetch/parse fails. */
export interface AppStoreAppExtras {
  rating_histogram?: AppStoreRatingHistogram;
  has_in_app_purchases?: boolean;
  in_app_purchases: AppStoreInAppPurchase[];
  iphone_screenshots: AppStoreScreenshot[];
  ipad_screenshots: AppStoreScreenshot[];
  whats_new?: string;
  whats_new_version?: string;
  description?: string;
  chart_position?: number;
  chart_category?: string;
  is_editors_choice: boolean;
  privacy_types: AppStorePrivacyType[];
  /**
   * Raw "Information" rows (Seller / Size / Category / Compatibility /
   * Languages / Age Rating / Copyright …) as the page displays them. A flat
   * record because Apple adds and renames rows per app type.
   */
  information: Record<string, string>;
}

// =============================================================================
// App
// =============================================================================

/** An app, as returned by iTunes search and lookup (identical shapes). */
export interface AppStoreApp {
  // Identity
  app_id?: number;
  bundle_id?: string;
  name?: string;
  censored_name?: string;
  kind?: string;
  url?: string;

  // Developer
  developer_id?: number;
  developer_name?: string;
  developer_url?: string;
  seller_name?: string;
  seller_url?: string;

  // Pricing
  price?: number;
  currency?: string;
  formatted_price?: string;

  // Ratings
  rating?: number;
  rating_count?: number;
  rating_current_version?: number;
  rating_count_current_version?: number;

  // Content
  description?: string;
  release_notes?: string;
  version?: string;
  minimum_os_version?: string;
  file_size_bytes?: number;
  content_rating?: string;
  advisories: string[];
  genres: string[];
  genre_ids: number[];
  primary_genre?: string;
  primary_genre_id?: number;
  language_codes: string[];
  supported_devices: string[];
  features: string[];
  is_game_center_enabled?: boolean;
  is_vpp_device_based_licensing_enabled?: boolean;

  // Artwork
  icon_url?: string;
  icon_url_60?: string;
  icon_url_100?: string;
  screenshot_urls: string[];
  ipad_screenshot_urls: string[];
  appletv_screenshot_urls: string[];

  // Dates (dual form)
  release_date_utc?: number;
  release_date_at?: string;
  current_version_release_date_utc?: number;
  current_version_release_date_at?: string;

  // Storefront enrichment (detail endpoint only)
  extras?: AppStoreAppExtras;
}

// =============================================================================
// Reviews
// =============================================================================

/** One customer review. */
export interface AppStoreReview {
  review_id?: string;
  user_name?: string;
  user_url?: string;
  title?: string;
  content?: string;
  rating?: number;
  version?: string;
  vote_sum?: number;
  vote_count?: number;
  updated_utc?: number;
  updated_at?: string;
}

// =============================================================================
// Charts
// =============================================================================

/** One app in a top chart. `rank` is its position in Apple's feed. */
export interface AppStoreChartEntry {
  rank: number;
  app_id?: number;
  name?: string;
  url?: string;
  developer_name?: string;
  developer_url?: string;
  icon_url?: string;
  price?: number;
  currency?: string;
  formatted_price?: string;
  genre?: string;
  genre_id?: number;
  summary?: string;
  rights?: string;
  release_date_utc?: number;
  release_date_at?: string;
}

// =============================================================================
// Developer
// =============================================================================

/** An App Store developer (Apple's `artist` entry). */
export interface AppStoreDeveloper {
  developer_id?: number;
  name?: string;
  developer_type?: string;
  url?: string;
}

// =============================================================================
// Reference
// =============================================================================

/** An App Store genre, for use with `charts({ genre })`. */
export interface AppStoreGenre {
  genre_id: number;
  name: string;
  parent_id?: number;
}

/** A supported App Store storefront. */
export interface AppStoreMarket {
  code: string;
  name: string;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** Full-text search results across one App Store catalogue. */
export interface AppStoreSearchResponse {
  query: string;
  country: string;
  entity: string;
  result_count: number;
  apps: AppStoreApp[];
}

/** A page of customer reviews — 50 per page, pages 1-10. */
export interface AppStoreReviewsResponse {
  app_id: string;
  country: string;
  page: number;
  sort: string;
  result_count: number;
  reviews: AppStoreReview[];
}

/** A top chart for one storefront, optionally scoped to one genre. */
export interface AppStoreChartsResponse {
  country: string;
  type: string;
  entity: string;
  genre_id?: number;
  result_count: number;
  apps: AppStoreChartEntry[];
}

/** A developer and every app they publish in the storefront. */
export interface AppStoreDeveloperResponse {
  country: string;
  developer?: AppStoreDeveloper;
  result_count: number;
  apps: AppStoreApp[];
}

/** Every chartable App Store genre id. */
export interface AppStoreGenresResponse {
  result_count: number;
  genres: AppStoreGenre[];
}

/**
 * Supported App Store storefronts.
 *
 * Informational: the endpoints accept any well-formed 2-letter code and let
 * Apple arbitrate, so a storefront missing from this list still works.
 */
export interface AppStoreMarketsResponse {
  result_count: number;
  markets: AppStoreMarket[];
}

// =============================================================================
// Param Enums
// =============================================================================

/**
 * Which catalogue to search. These are separate catalogues, not filters — a
 * Mac-only app is absent from "software" entirely.
 */
export type AppStoreEntity = "software" | "iPadSoftware" | "macSoftware";

/** Review ordering for `/apps/{app_id}/reviews`. */
export type AppStoreReviewSort = "mostRecent" | "mostHelpful";

/** Which top chart to read. */
export type AppStoreChartType = "top-free" | "top-paid" | "top-grossing";

/** Which device chart to read. */
export type AppStoreChartEntity = "apps" | "ipad";

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Options for the /search endpoint. */
export interface AppStoreSearchParams {
  /** Storefront country code, e.g. "us" (default: "us"). */
  country?: string;
  /** Which catalogue to search (default: "software"). */
  entity?: AppStoreEntity;
  /** Results to return, 1-200 (default: 50). */
  limit?: number;
  /**
   * Results to skip. Applied by the service, not by Apple — paging is a slice
   * of one 200-result response, and `offset + limit` is capped at 200.
   */
  offset?: number;
  /** Result language, e.g. "en_us". Defaults to the storefront's own. */
  lang?: string;
}

/** Options for the /apps/{app_id} endpoint. */
export interface AppStoreAppParams {
  /** Storefront country code, e.g. "us" (default: "us"). */
  country?: string;
  /** Result language, e.g. "en_us". */
  lang?: string;
  /**
   * Fetch the storefront page for the rating histogram, in-app-purchase list,
   * full-resolution screenshots and App Privacy detail (default: true). Set
   * false to skip that second fetch.
   */
  includeExtras?: boolean;
}

/** Options for the /apps/{app_id}/reviews endpoint. */
export interface AppStoreReviewsParams {
  /** Storefront country code, e.g. "us" (default: "us"). */
  country?: string;
  /** Page number, 1-10 (default: 1). */
  page?: number;
  /** Review ordering (default: "mostRecent"). */
  sort?: AppStoreReviewSort;
}

/** Options for the /developers/{developer_id} endpoint. */
export interface AppStoreDeveloperParams {
  /** Storefront country code, e.g. "us" (default: "us"). */
  country?: string;
  /** Apps to return, 1-200 (default: 50). */
  limit?: number;
}

/** Options for the /charts endpoint. */
export interface AppStoreChartsParams {
  /** Storefront country code, e.g. "us" (default: "us"). */
  country?: string;
  /** Chart to read (default: "top-free"). */
  type?: AppStoreChartType;
  /** Optional genre id to scope the chart, e.g. 6014 (Games). See `listGenres`. */
  genre?: number;
  /** Entries to return, 1-200 (default: 50). */
  limit?: number;
  /** Device chart (default: "apps"). */
  entity?: AppStoreChartEntity;
}
