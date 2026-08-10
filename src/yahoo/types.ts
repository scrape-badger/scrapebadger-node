/**
 * TypeScript types for the Yahoo API.
 *
 * These interfaces mirror the backend `yahoo_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 */

// =============================================================================
// Web search
// =============================================================================

/** One organic result from a Yahoo web SERP. */
export interface YahooOrganicResult {
  /** 1-based rank on the page. */
  position: number;
  title: string;
  /** Destination URL, with Yahoo's redirect wrapper resolved. */
  url: string | null;
  display_url: string | null;
  snippet: string | null;
}

/** A sponsored result on the SERP. */
export interface YahooAd {
  /** 1-based rank within the ad block. */
  position: number;
  title: string;
  url: string | null;
  display_url: string | null;
  snippet: string | null;
}

/**
 * A page of Yahoo web search results.
 *
 * Yahoo does not expose a total-results count on the web SERP, so only
 * `result_count` (results in this response) is available.
 */
export interface YahooSearchResponse {
  query: string;
  market: string;
  result_count: number;
  results: YahooOrganicResult[];
  ads: YahooAd[];
  related_searches: string[];
}

// =============================================================================
// Images
// =============================================================================

/** One image from Yahoo image search. */
export interface YahooImageResult {
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

/** Response from the Yahoo image search endpoint. */
export interface YahooImagesResponse {
  query: string;
  market: string;
  result_count: number;
  results: YahooImageResult[];
}

// =============================================================================
// Videos
// =============================================================================

/** One video from Yahoo video search. */
export interface YahooVideoResult {
  /** 1-based rank on the page. */
  position: number;
  title: string | null;
  url: string | null;
  thumbnail_url: string | null;
  /** Runtime as displayed, e.g. `"13:47"`. */
  duration: string | null;
  /** Host platform, e.g. `"YouTube"`. */
  source: string | null;
  source_domain: string | null;
  description: string | null;
  /** View count as displayed, e.g. `"1.8M views"`. */
  views: string | null;
}

/** Response from the Yahoo video search endpoint. */
export interface YahooVideosResponse {
  query: string;
  market: string;
  result_count: number;
  results: YahooVideoResult[];
}

// =============================================================================
// News
// =============================================================================

/** One article from the Yahoo news vertical. */
export interface YahooNewsArticle {
  /** 1-based rank on the page. */
  position: number;
  title: string;
  /** Destination article URL, with Yahoo's redirect wrapper resolved. */
  url: string | null;
  /** Publisher name. */
  source: string | null;
  /** Syndication source, e.g. `"via Yahoo Finance"`. */
  via: string | null;
  snippet: string | null;
  /**
   * Relative age as rendered by Yahoo, e.g. `"26 minutes ago"`. Yahoo News
   * shows no absolute date, so there is no parsed timestamp field.
   */
  published: string | null;
  thumbnail_url: string | null;
}

/** Response from the Yahoo news endpoint. */
export interface YahooNewsResponse {
  query: string;
  market: string;
  /** Yahoo's reported total match count (approximate). */
  total_results: number | null;
  total_results_text: string | null;
  result_count: number;
  results: YahooNewsArticle[];
}

// =============================================================================
// Autocomplete
// =============================================================================

/** Search-box suggestions for a partial term. */
export interface YahooAutocompleteResponse {
  query: string;
  market: string;
  result_count: number;
  suggestions: string[];
}

// =============================================================================
// Reference
// =============================================================================

/** A supported Yahoo market. */
export interface YahooMarket {
  /** Lowercase market code, e.g. `"us"`, `"fr"`. */
  code: string;
  name: string;
  /** Two-letter country code. */
  country: string;
  /** Regional search host, e.g. `"fr.search.yahoo.com"`. */
  host: string;
}

/** The supported-markets list. */
export interface YahooMarketsResponse {
  result_count: number;
  markets: YahooMarket[];
}

// =============================================================================
// Request parameter types
// =============================================================================

/** Adult-content filter level. */
export type YahooSafeSearch = "off" | "moderate" | "strict";

/** Options for the web search endpoint. */
export interface YahooSearchParams {
  /** Yahoo market code, e.g. `"us"`, `"de"`. Defaults to `"us"`. */
  market?: string;
  /**
   * Zero-based absolute result offset. Yahoo serves 7 organic results per
   * page, so page 2 is `offset: 7`. Defaults to 0.
   */
  offset?: number;
  safe_search?: YahooSafeSearch;
}

/** Options for the image search endpoint. */
export interface YahooImagesParams {
  /** Yahoo market code, e.g. `"us"`. Defaults to `"us"`. */
  market?: string;
  /** Number of images to return (1-100). Defaults to 30. */
  count?: number;
}

/** Options for the video search endpoint. */
export interface YahooVideosParams {
  /** Yahoo market code, e.g. `"us"`. Defaults to `"us"`. */
  market?: string;
  /** Number of videos to return (1-100). Defaults to 30. */
  count?: number;
}

/** Options for the news endpoint. */
export interface YahooNewsParams {
  /** Yahoo market code, e.g. `"us"`. Defaults to `"us"`. */
  market?: string;
}

/** Options for the autocomplete endpoint. */
export interface YahooAutocompleteParams {
  /** Yahoo market code, e.g. `"us"`. Defaults to `"us"`. */
  market?: string;
}
