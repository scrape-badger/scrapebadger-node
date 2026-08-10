/**
 * Yahoo API module.
 *
 * @module yahoo
 */

export { YahooClient } from "./client.js";
export { SearchClient as YahooSearchClient } from "./search.js";
export { MediaClient as YahooMediaClient } from "./media.js";
export { NewsClient as YahooNewsClient } from "./news.js";
export { ReferenceClient as YahooReferenceClient } from "./reference.js";

export type {
  // Web search
  YahooOrganicResult,
  YahooAd,
  YahooSearchResponse,
  // Images
  YahooImageResult,
  YahooImagesResponse,
  // Videos
  YahooVideoResult,
  YahooVideosResponse,
  // News
  YahooNewsArticle,
  YahooNewsResponse,
  // Autocomplete
  YahooAutocompleteResponse,
  // Reference
  YahooMarket,
  YahooMarketsResponse,
  // Param enums
  YahooSafeSearch,
  // Request params
  YahooSearchParams,
  YahooImagesParams,
  YahooVideosParams,
  YahooNewsParams,
  YahooAutocompleteParams,
} from "./types.js";
