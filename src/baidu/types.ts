/**
 * TypeScript types for Baidu API responses.
 *
 * These interfaces mirror the backend `baidu_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises them
 * (`baidu_url`, `display_url`, `date_at`); nullable backend fields are typed
 * as `Type | null`.
 *
 * Every result carries BOTH URLs: `url` is the **real target URL** (decoded
 * from Baidu's `mu` attribute) and `baidu_url` is the `baidu.com/link?url=`
 * tracking redirect. Dates ship raw in `date` (Baidu's own Chinese relative or
 * absolute string) plus `date_at` (ISO 8601 date) when the raw form is
 * unambiguous; Baidu's SERP carries no time-of-day, so there is deliberately
 * no timestamp field.
 */

// =============================================================================
// Web search
// =============================================================================

/** One organic result from a Baidu web SERP. */
export interface BaiduOrganicResult {
  /** 1-based rank on the page. */
  position: number;
  /** Result title text. */
  title: string;
  /** The REAL target URL, decoded from Baidu's `mu` attribute. */
  url: string | null;
  /** Baidu's `baidu.com/link?url=...` tracking redirect. */
  baidu_url: string | null;
  /** The URL as displayed on the result, when Baidu shows one. */
  display_url: string | null;
  /** Result description text. */
  snippet: string | null;
  /** Site name shown on the result, e.g. `阿里巴巴1688`. */
  source: string | null;
  /** Baidu's own date string, e.g. `2026年8月1日` or `3天前`. */
  date: string | null;
  /** ISO 8601 date (`YYYY-MM-DD`) when `date` is unambiguous. */
  date_at: string | null;
  /** Thumbnail image URL, when the result carries one. */
  thumbnail: string | null;
  /** Baidu's result template id, e.g. `se_com_default`, `www_index`. */
  tpl: string | null;
}

/** One of Baidu's related-search suggestions. */
export interface BaiduRelatedSearch {
  /** The suggested query. */
  query: string;
  /** Baidu SERP URL for the suggestion. */
  url: string | null;
}

/** Response from the Baidu web search endpoint. */
export interface BaiduSearchResponse {
  /** Echo of the requested query. */
  query: string;
  /** The page returned. */
  page: number;
  /** Results per page that was requested. */
  num: number;
  /** Baidu's own reported total (from `百度为您找到相关结果约N个`). */
  total_results: number | null;
  /** Organic results on this page. */
  results: BaiduOrganicResult[];
  /** Baidu's related-search suggestions. */
  related_searches: BaiduRelatedSearch[];
  /** The baidu.com URL that was fetched. */
  url: string;
}

// =============================================================================
// News
// =============================================================================

/** One article from the Baidu news vertical. */
export interface BaiduNewsResult {
  /** 1-based rank on the page. */
  position: number;
  /** Article headline. */
  title: string;
  /** The REAL article URL. */
  url: string | null;
  /** Baidu's tracking redirect, when present. */
  baidu_url: string | null;
  /** Article excerpt. */
  snippet: string | null;
  /** Publisher name, e.g. `新华网`. */
  source: string | null;
  /** Baidu's own date string, e.g. `2026年8月1日` or `3小时前`. */
  date: string | null;
  /** ISO 8601 date (`YYYY-MM-DD`) when `date` is unambiguous. */
  date_at: string | null;
  /** Article image URL, when present. */
  thumbnail: string | null;
}

/** Response from the Baidu news endpoint. */
export interface BaiduNewsResponse {
  /** Echo of the requested query. */
  query: string;
  /** The page returned. */
  page: number;
  /** Baidu's own reported total, when present. */
  total_results: number | null;
  /** Articles on this page. */
  results: BaiduNewsResult[];
  /** The baidu.com URL that was fetched. */
  url: string;
}

// =============================================================================
// Images
// =============================================================================

/** One image from Baidu image search. */
export interface BaiduImageResult {
  /** 1-based rank on the page. */
  position: number;
  /** Image title / caption. */
  title: string | null;
  /** Full-size image URL (Baidu's decoded `objURL`). */
  image_url: string | null;
  /** Baidu-hosted thumbnail. */
  thumbnail_url: string | null;
  /** Baidu-hosted mid-size copy. */
  middle_url: string | null;
  /** Baidu-hosted hover-preview copy. */
  hover_url: string | null;
  /** Full-size image width in pixels. */
  width: number | null;
  /** Full-size image height in pixels. */
  height: number | null;
  /** Image format, e.g. `jpg`. */
  type: string | null;
  /** Page the image was found on. */
  from_url: string | null;
  /** Title of the page the image was found on. */
  from_title: string | null;
}

/** Response from the Baidu image search endpoint. */
export interface BaiduImagesResponse {
  /** Echo of the requested query. */
  query: string;
  /** The page returned (30 images per page). */
  page: number;
  /** Baidu's own reported total, when present. */
  total_results: number | null;
  /** Images on this page. */
  results: BaiduImageResult[];
}

// =============================================================================
// Autocomplete
// =============================================================================

/** One Baidu search-box suggestion. */
export interface BaiduSuggestion {
  /** The suggested query. */
  query: string;
  /** Baidu's suggestion type, e.g. `sug`. */
  type: string | null;
}

/** Response from the Baidu autocomplete endpoint. */
export interface BaiduAutocompleteResponse {
  /** Echo of the partial term. */
  query: string;
  /** Baidu's suggestions for the partial term. */
  suggestions: BaiduSuggestion[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Result language restriction — Baidu's only three language codes. */
export type BaiduLanguage = "all" | "zh-cn" | "zh-tw";

/** News result ordering. */
export type BaiduNewsSort = "relevance" | "time";

/** Options for the /search endpoint. */
export interface BaiduSearchParams {
  /** Result page, 1-76 (default: 1). Baidu stops serving past ~76 pages. */
  page?: number;
  /** Results per page, 1-50 (default: 10) — Baidu's own cap. */
  num?: number;
  /** Restrict result language (default: "all"). */
  language?: BaiduLanguage;
  /** Unix timestamp — only results published after this. */
  timeFrom?: number;
  /** Unix timestamp — only results published before this. */
  timeTo?: number;
}

/** Options for the /news endpoint. */
export interface BaiduNewsParams {
  /** Result page, 1-76 (default: 1). */
  page?: number;
  /** Order by relevance or recency (default: "relevance"). */
  sort?: BaiduNewsSort;
}

/** Options for the /images endpoint. */
export interface BaiduImagesParams {
  /** Result page, 1-50 (default: 1). Baidu serves 30 images per page. */
  page?: number;
}
