/**
 * Baidu API module.
 *
 * Baidu is China's #1 search engine (~60% market share). Results carry the
 * real target URL in `url`, not just Baidu's tracking redirect.
 *
 * @module baidu
 */

export { BaiduClient } from "./client.js";

// Export all types
export type {
  // Web search
  BaiduOrganicResult,
  BaiduRelatedSearch,
  BaiduSearchResponse,
  // News
  BaiduNewsResult,
  BaiduNewsResponse,
  // Images
  BaiduImageResult,
  BaiduImagesResponse,
  // Autocomplete
  BaiduSuggestion,
  BaiduAutocompleteResponse,
  // Request params
  BaiduLanguage,
  BaiduNewsSort,
  BaiduSearchParams,
  BaiduNewsParams,
  BaiduImagesParams,
} from "./types.js";
