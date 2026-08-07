/**
 * Walmart API module.
 *
 * @module walmart
 */

export { WalmartClient } from "./client.js";
export { SearchClient as WalmartSearchClient } from "./search.js";
export { ProductsClient as WalmartProductsClient } from "./products.js";
export { SellersClient as WalmartSellersClient } from "./sellers.js";
export { StoresClient as WalmartStoresClient } from "./stores.js";
export { ReferenceClient as WalmartReferenceClient } from "./reference.js";

export type {
  // Shared value objects
  WalmartRaw,
  WalmartPrice,
  WalmartPriceRange,
  WalmartPriceInfo,
  WalmartImage,
  WalmartVideo,
  WalmartBreadcrumb,
  WalmartNameValue,
  WalmartSpecificationGroup,
  WalmartBadge,
  WalmartFulfillmentOption,
  WalmartFulfillmentSummary,
  WalmartReturnPolicy,
  WalmartVariant,
  WalmartConditionOffer,
  WalmartPromotion,
  WalmartNutritionFacts,
  WalmartWarranty,
  WalmartLocationContext,
  WalmartEmbeddedSeller,
  // Product
  WalmartProduct,
  // Search / category
  WalmartSearchItem,
  WalmartSearchResponse,
  // Reviews
  WalmartRatingDistribution,
  WalmartReview,
  WalmartReviewsResponse,
  // Seller
  WalmartSeller,
  WalmartSellerResponse,
  // Stores
  WalmartStoreHours,
  WalmartStoreService,
  WalmartStore,
  WalmartStoreResponse,
  // Autocomplete
  WalmartSuggestion,
  WalmartAutocompleteResponse,
  // Reference
  WalmartMarket,
  WalmartMarketsResponse,
  // Param enums
  WalmartSortBy,
  WalmartReviewSort,
  // Request params
  WalmartSearchParams,
  WalmartCategoryParams,
  WalmartDealsParams,
  WalmartReviewsParams,
  WalmartSellerProductsParams,
} from "./types.js";
