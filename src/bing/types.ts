/**
 * TypeScript types for the Bing API.
 *
 * These interfaces mirror the backend `bing_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 */

// =============================================================================
// Web search
// =============================================================================

/** A sitelink shown under an organic result. */
export interface BingDeepLink {
  title: string;
  url: string | null;
}

/** One organic result from a Bing web SERP. */
export interface BingOrganicResult {
  /** 1-based rank on the page. */
  position: number;
  title: string;
  url: string | null;
  display_url: string | null;
  site_name: string | null;
  snippet: string | null;
  deep_links: BingDeepLink[];
}

/** A sponsored result on the SERP. */
export interface BingAd {
  /** 1-based rank within the ad block. */
  position: number;
  title: string;
  url: string | null;
  display_url: string | null;
  snippet: string | null;
}

/** A page of Bing web search results. */
export interface BingSearchResponse {
  query: string;
  market: string;
  total_results: number | null;
  total_results_text: string | null;
  result_count: number;
  results: BingOrganicResult[];
  ads: BingAd[];
  related_searches: string[];
}

// =============================================================================
// Images
// =============================================================================

/** One image from Bing image search. */
export interface BingImageResult {
  /** 1-based rank on the page. */
  position: number;
  title: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  source_url: string | null;
  source_domain: string | null;
  width: number | null;
  height: number | null;
}

/** Response from the Bing image search endpoint. */
export interface BingImagesResponse {
  query: string;
  market: string;
  result_count: number;
  results: BingImageResult[];
}

// =============================================================================
// Videos
// =============================================================================

/** One video from Bing video search. */
export interface BingVideoResult {
  /** 1-based rank on the page. */
  position: number;
  title: string | null;
  url: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  source: string | null;
  publisher: string | null;
  views: string | null;
  published: string | null;
}

/** Response from the Bing video search endpoint. */
export interface BingVideosResponse {
  query: string;
  market: string;
  result_count: number;
  results: BingVideoResult[];
}

// =============================================================================
// News
// =============================================================================

/** One article from the Bing news vertical. */
export interface BingNewsArticle {
  /** 1-based rank on the page. */
  position: number;
  title: string | null;
  url: string | null;
  source: string | null;
  snippet: string | null;
  /** Bing's own relative date string, e.g. `"2h"`. */
  published: string | null;
  /** ISO 8601 timestamp, when the raw form is unambiguous. */
  published_at: string | null;
  /** Unix timestamp, when the raw form is unambiguous. */
  published_utc: number | null;
}

/** Response from the Bing news endpoint. */
export interface BingNewsResponse {
  query: string;
  market: string;
  result_count: number;
  results: BingNewsArticle[];
}

// =============================================================================
// Autocomplete
// =============================================================================

/** Search-box suggestions for a partial term. */
export interface BingAutocompleteResponse {
  query: string;
  market: string;
  result_count: number;
  suggestions: string[];
}

// =============================================================================
// Reference
// =============================================================================

/** A supported Bing market. */
export interface BingMarket {
  code: string;
  name: string;
  country: string;
}

/** The supported-markets list. */
export interface BingMarketsResponse {
  result_count: number;
  markets: BingMarket[];
}

// =============================================================================
// Request parameter types
// =============================================================================

/** Adult-content filter level. */
export type BingSafeSearch = "off" | "moderate" | "strict";

/** Article-age filter for the news endpoint. */
export type BingFreshness = "day" | "week" | "month";

/** Options for the web search endpoint. */
export interface BingSearchParams {
  /** Bing market code, e.g. `"en-US"`, `"de-DE"`. Defaults to `"en-US"`. */
  market?: string;
  /** Number of results to return. Defaults to 10. */
  count?: number;
  /** Zero-based result offset for pagination. Defaults to 0. */
  offset?: number;
  safe_search?: BingSafeSearch;
}

/** Options for the image search endpoint. */
export interface BingImagesParams {
  /** Bing market code, e.g. `"en-US"`. Defaults to `"en-US"`. */
  market?: string;
  /** Number of images to return. Defaults to 35. */
  count?: number;
  safe_search?: BingSafeSearch;
}

/** Options for the video search endpoint. */
export interface BingVideosParams {
  /** Bing market code, e.g. `"en-US"`. Defaults to `"en-US"`. */
  market?: string;
  /** Number of videos to return. Defaults to 35. */
  count?: number;
  safe_search?: BingSafeSearch;
}

/** Options for the news endpoint. */
export interface BingNewsParams {
  /** Bing market code, e.g. `"en-US"`. Defaults to `"en-US"`. */
  market?: string;
  freshness?: BingFreshness;
}

/** Options for the autocomplete endpoint. */
export interface BingAutocompleteParams {
  /** Bing market code, e.g. `"en-US"`. Defaults to `"en-US"`. */
  market?: string;
}
