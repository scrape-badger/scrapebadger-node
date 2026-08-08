/**
 * Yandex API module.
 *
 * @module yandex
 */

export { YandexClient } from "./client.js";
export { SearchClient as YandexSearchClient } from "./search.js";
export { ImagesClient as YandexImagesClient } from "./images.js";
export { ReferenceClient as YandexReferenceClient } from "./reference.js";

export type {
  // Shared
  YandexRaw,
  // Web search
  YandexSitelink,
  YandexOrganicResult,
  YandexPagination,
  YandexSearchResponse,
  // Images
  YandexImage,
  YandexImageResult,
  YandexImagesResponse,
  // Reverse image
  YandexReverseSite,
  YandexSimilarImage,
  YandexTag,
  YandexOtherSize,
  YandexReverseImageResponse,
  // Markets
  YandexMarket,
  YandexMarketsResponse,
  // Request params
  YandexSearchParams,
  YandexImagesParams,
  YandexReverseParams,
} from "./types.js";
