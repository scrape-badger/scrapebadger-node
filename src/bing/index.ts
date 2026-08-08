/**
 * Bing API module.
 *
 * @module bing
 */

export { BingClient } from "./client.js";
export { SearchClient as BingSearchClient } from "./search.js";
export { MediaClient as BingMediaClient } from "./media.js";
export { NewsClient as BingNewsClient } from "./news.js";
export { ReferenceClient as BingReferenceClient } from "./reference.js";

export type {
  // Web search
  BingDeepLink,
  BingOrganicResult,
  BingAd,
  BingSearchResponse,
  // Images
  BingImageResult,
  BingImagesResponse,
  // Videos
  BingVideoResult,
  BingVideosResponse,
  // News
  BingNewsArticle,
  BingNewsResponse,
  // Autocomplete
  BingAutocompleteResponse,
  // Reference
  BingMarket,
  BingMarketsResponse,
  // Param enums
  BingSafeSearch,
  BingFreshness,
  // Request params
  BingSearchParams,
  BingImagesParams,
  BingVideosParams,
  BingNewsParams,
  BingAutocompleteParams,
} from "./types.js";
