/**
 * TypeScript types for the Yandex API.
 *
 * These interfaces mirror the backend `yandex_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 *
 * Field names are snake_case to match the backend payload and the rest of this
 * SDK (see the DuckDuckGo module).
 */

/** An untyped JSON object passed through verbatim from Yandex's payload. */
export type YandexRaw = Record<string, unknown>;

// =============================================================================
// Web search
// =============================================================================

/** A sitelink nested under an organic result or ad. */
export interface YandexSitelink {
  title: string | null;
  url: string | null;
  snippet: string | null;
}

/** A single organic web result (ads share the same shape). */
export interface YandexOrganicResult {
  position: number | null;
  title: string | null;
  url: string | null;
  displayed_url: string | null;
  domain: string | null;
  snippet: string | null;
  sitelinks: YandexSitelink[];
}

/** The SERP pagination block. */
export interface YandexPagination {
  current: number | null;
  next_url: string | null;
  other_pages: YandexRaw[];
}

/** A page of Yandex web results. */
export interface YandexSearchResponse {
  query: string;
  domain: string;
  page: number;
  result_count: number;
  organic_results: YandexOrganicResult[];
  ads: YandexOrganicResult[];
  inline_images: YandexRaw[];
  inline_videos: YandexRaw[];
  related_searches: string[];
  pagination: YandexPagination | null;
}

// =============================================================================
// Image search
// =============================================================================

/** An image reference with dimensions. */
export interface YandexImage {
  url: string | null;
  width: number | null;
  height: number | null;
}

/** A single image-search result. */
export interface YandexImageResult {
  position: number | null;
  title: string | null;
  source: string | null;
  source_url: string | null;
  thumbnail: string | null;
  image: YandexImage | null;
  snippet: string | null;
}

/** A page of image-search results. */
export interface YandexImagesResponse {
  query: string;
  domain: string;
  page: number;
  result_count: number;
  results: YandexImageResult[];
  suggested_searches: string[];
}

// =============================================================================
// Reverse image search (CBIR)
// =============================================================================

/** One page where the query image (or a variant) was found. */
export interface YandexReverseSite {
  title: string | null;
  description: string | null;
  url: string | null;
  domain: string | null;
  thumbnail: YandexImage | null;
  original_image: YandexImage | null;
}

/** One visually-similar image. */
export interface YandexSimilarImage {
  title: string | null;
  thumbnail: string | null;
  url: string | null;
  width: number | null;
  height: number | null;
}

/** A CBIR tag / suggested refinement. */
export interface YandexTag {
  text: string | null;
  url: string | null;
}

/** The same image at another resolution. */
export interface YandexOtherSize {
  label: string | null;
  url: string | null;
  width: number | null;
  height: number | null;
}

/** The Yandex reverse-image (CBIR) response. */
export interface YandexReverseImageResponse {
  query_image_url: string;
  domain: string;
  cbir_id: string | null;
  is_empty: boolean;
  result_count: number;
  sites: YandexReverseSite[];
  similar_images: YandexSimilarImage[];
  tags: YandexTag[];
  other_sizes: YandexOtherSize[];
}

// =============================================================================
// Markets (reference)
// =============================================================================

/** A supported Yandex market. */
export interface YandexMarket {
  code: string;
  name: string;
  domain: string;
  country_code: string;
  default_lr: number | null;
  lang: string | null;
}

/** The list of supported markets. */
export interface YandexMarketsResponse {
  result_count: number;
  markets: YandexMarket[];
}

// =============================================================================
// Request params
// =============================================================================

/** Options for the web-search endpoint. */
export interface YandexSearchParams {
  /** Market domain: `"tr"` (default), `"com"`, `"ru"`, `"by"`, `"kz"`, `"uz"`. */
  domain?: string;
  /** Page number (1-25). */
  page?: number;
  /** Yandex region id (`lr`), e.g. `213` for Moscow. */
  lr?: number;
  /** UI/results language code, e.g. `"en"`. */
  lang?: string;
}

/** Options for the image-search endpoint. */
export interface YandexImagesParams {
  /** Market domain: `"tr"` (default), `"com"`, `"ru"`, `"by"`, `"kz"`, `"uz"`. */
  domain?: string;
  /** Page number (1-25). */
  page?: number;
}

/** Options for the reverse-image endpoint. */
export interface YandexReverseParams {
  /** Market domain: `"tr"` (default), `"com"`, `"ru"`, `"by"`, `"kz"`, `"uz"`. */
  domain?: string;
}
