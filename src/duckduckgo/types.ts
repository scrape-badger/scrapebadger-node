/**
 * TypeScript types for the DuckDuckGo API.
 *
 * These interfaces mirror the backend `duckduckgo_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 *
 * Field names are snake_case to match the backend payload and the rest of this
 * SDK (see the Walmart module).
 */

/** An untyped JSON object passed through verbatim from DuckDuckGo's payload. */
export type DuckDuckGoRaw = Record<string, unknown>;

// =============================================================================
// Web search
// =============================================================================

/** A single organic (or sponsored) web result. */
export interface DuckDuckGoSearchResult {
  title: string | null;
  url: string | null;
  snippet: string | null;
  display_url: string | null;
  is_ad: boolean | null;
}

/** The Instant-Answer abstract shown above the organic results. */
export interface DuckDuckGoAbstract {
  heading: string | null;
  text: string | null;
  url: string | null;
  image: string | null;
  source: string | null;
}

/** A page of web results plus its optional abstract. */
export interface DuckDuckGoSearchResponse {
  query: string;
  region: string | null;
  results: DuckDuckGoSearchResult[];
  abstract: DuckDuckGoAbstract | null;
  result_count: number;
  has_next: boolean | null;
}

// =============================================================================
// Images
// =============================================================================

/** A single image result. */
export interface DuckDuckGoImageResult {
  title: string | null;
  image: string | null;
  thumbnail: string | null;
  url: string | null;
  width: number | null;
  height: number | null;
  source: string | null;
  encoding_format: string | null;
  discovery_date: string | null;
}

/** A page of image results. */
export interface DuckDuckGoImagesResponse {
  query: string;
  region: string | null;
  results: DuckDuckGoImageResult[];
  result_count: number;
  has_next: boolean | null;
}

// =============================================================================
// News
// =============================================================================

/** A single news result. */
export interface DuckDuckGoNewsResult {
  title: string | null;
  url: string | null;
  excerpt: string | null;
  source: string | null;
  image: string | null;
  relative_time: string | null;
  /** Unix seconds. */
  date_utc: number | null;
  /** ISO 8601 string. */
  date_at: string | null;
  syndicate: string | null;
}

/** A page of news results. */
export interface DuckDuckGoNewsResponse {
  query: string;
  region: string | null;
  results: DuckDuckGoNewsResult[];
  result_count: number;
  has_next: boolean | null;
}

// =============================================================================
// Videos
// =============================================================================

/** A single video result. */
export interface DuckDuckGoVideoResult {
  title: string | null;
  content: string | null;
  description: string | null;
  duration: string | null;
  publisher: string | null;
  uploader: string | null;
  published_at: string | null;
  view_count: number | null;
  /** Thumbnail set (small / medium / large / motion), passed through verbatim. */
  images: DuckDuckGoRaw | null;
  embed_url: string | null;
}

/** A page of video results. */
export interface DuckDuckGoVideosResponse {
  query: string;
  region: string | null;
  results: DuckDuckGoVideoResult[];
  result_count: number;
  has_next: boolean | null;
}

// =============================================================================
// Autocomplete
// =============================================================================

/** Search-box suggestions for a partial query. */
export interface DuckDuckGoAutocompleteResponse {
  query: string;
  suggestions: string[];
}

// =============================================================================
// Instant Answer
// =============================================================================

/** A related-topic link from the Instant Answer API. */
export interface DuckDuckGoRelatedTopic {
  text: string | null;
  url: string | null;
  icon: string | null;
}

/** The DuckDuckGo Instant Answer (zero-click info) response. */
export interface DuckDuckGoInstantResponse {
  query: string;
  abstract: string | null;
  abstract_text: string | null;
  abstract_source: string | null;
  abstract_url: string | null;
  heading: string | null;
  answer: string | null;
  answer_type: string | null;
  definition: string | null;
  definition_source: string | null;
  definition_url: string | null;
  image: string | null;
  type: string | null;
  redirect: string | null;
  related_topics: DuckDuckGoRelatedTopic[];
}

// =============================================================================
// Reference
// =============================================================================

/** A supported search region. */
export interface DuckDuckGoRegion {
  code: string;
  name: string;
}

/** The list of supported regions. */
export interface DuckDuckGoRegionsResponse {
  regions: DuckDuckGoRegion[];
  count: number;
}

// =============================================================================
// Request params
// =============================================================================

/** Options for the web-search endpoint. */
export interface DuckDuckGoSearchParams {
  /** Region code, e.g. `"us-en"`. Defaults to `"wt-wt"` (no region). */
  region?: string;
  /** `"on"`, `"moderate"` (default) or `"off"`. */
  safesearch?: string;
  /** Recency filter: `"d"`, `"w"`, `"m"` or `"y"`. */
  timelimit?: string;
  /** Page number, 1-based. */
  page?: number;
}

/** Options for the image-search endpoint. */
export interface DuckDuckGoImagesParams {
  region?: string;
  safesearch?: string;
  page?: number;
  size?: string;
  color?: string;
  image_type?: string;
  layout?: string;
  license?: string;
}

/** Options for the news-search endpoint. */
export interface DuckDuckGoNewsParams {
  region?: string;
  safesearch?: string;
  timelimit?: string;
  page?: number;
}

/** Options for the video-search endpoint. */
export interface DuckDuckGoVideosParams {
  region?: string;
  safesearch?: string;
  page?: number;
  duration?: string;
  resolution?: string;
}

/** Options for the autocomplete endpoint. */
export interface DuckDuckGoAutocompleteParams {
  region?: string;
}
