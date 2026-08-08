/**
 * DuckDuckGo API module.
 *
 * @module duckduckgo
 */

export { DuckDuckGoClient } from "./client.js";
export { SearchClient as DuckDuckGoSearchClient } from "./search.js";
export { MediaClient as DuckDuckGoMediaClient } from "./media.js";
export { ReferenceClient as DuckDuckGoReferenceClient } from "./reference.js";

export type {
  // Shared
  DuckDuckGoRaw,
  // Web search
  DuckDuckGoSearchResult,
  DuckDuckGoAbstract,
  DuckDuckGoSearchResponse,
  // Images
  DuckDuckGoImageResult,
  DuckDuckGoImagesResponse,
  // News
  DuckDuckGoNewsResult,
  DuckDuckGoNewsResponse,
  // Videos
  DuckDuckGoVideoResult,
  DuckDuckGoVideosResponse,
  // Autocomplete
  DuckDuckGoAutocompleteResponse,
  // Instant Answer
  DuckDuckGoRelatedTopic,
  DuckDuckGoInstantResponse,
  // Reference
  DuckDuckGoRegion,
  DuckDuckGoRegionsResponse,
  // Request params
  DuckDuckGoSearchParams,
  DuckDuckGoImagesParams,
  DuckDuckGoNewsParams,
  DuckDuckGoVideosParams,
  DuckDuckGoAutocompleteParams,
} from "./types.js";
