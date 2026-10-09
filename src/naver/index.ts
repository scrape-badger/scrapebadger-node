/**
 * Naver API module.
 *
 * Naver is South Korea's #1 portal: web/news/blog search, Place (local),
 * Shopping (search, rankings, DataLab insight), SmartStore / brand stores,
 * commerce products, reviews & Q&A, and Shopping Live.
 *
 * @module naver
 */

export { NaverClient } from "./client.js";
export { SearchClient as NaverSearchClient } from "./search.js";
export { PlacesClient as NaverPlacesClient } from "./places.js";
export { ShoppingClient as NaverShoppingClient } from "./shopping.js";
export { StoresClient as NaverStoresClient } from "./stores.js";
export { ContentClient as NaverContentClient } from "./content.js";
export { ReviewsClient as NaverReviewsClient } from "./reviews.js";
export { ProductsClient as NaverProductsClient } from "./products.js";
export { ShoppingLiveClient as NaverShoppingLiveClient } from "./live.js";

export type {
  // Shared response
  NaverResponse,
  // Search family
  NaverNewsSort,
  NaverSearchParams,
  NaverNewsParams,
  NaverBlogParams,
  // Places family
  NaverLocalParams,
  NaverPlaceReviewsParams,
  NaverPlaceMediaSource,
  NaverPlacePhotosParams,
  // Shopping family
  NaverPeriodType,
  NaverShoppingBestsellersParams,
  NaverShoppingKeywordsParams,
  NaverInsightTimeUnit,
  NaverShoppingInsightParams,
  NaverShoppingSearchTab,
  NaverShoppingSearchProductsParams,
  NaverShoppingCategoryTreeParams,
  NaverShoppingSearchFilteredParams,
  NaverShoppingBrandRankParams,
  NaverShoppingBrandCategoriesParams,
  NaverShoppingKeywordPeriodsParams,
  NaverCatalogSort,
  NaverShoppingSearchCatalogParams,
  NaverDealsGender,
  NaverShoppingVertical,
  // Stores family
  NaverStoreHost,
  NaverStoreParams,
  NaverStoreProductsParams,
  NaverStoreBestsellersParams,
  // Content family
  NaverContentParams,
  // Reviews / products family
  NaverProductReviewSummaryParams,
  NaverProductReviewSort,
  NaverProductReviewsParams,
  NaverProductQnasParams,
  NaverProductDetailParams,
  // Shopping Live family
  NaverLiveBroadcastProductsParams,
  NaverLiveChannelProductsParams,
  NaverLiveShortclipSort,
  NaverLiveChannelShortclipsParams,
  NaverLiveAttachmentType,
  NaverLiveShortclipProductsParams,
  NaverLiveReplayProductsParams,
  NaverLiveBroadcastProductCategoriesParams,
} from "./types.js";
