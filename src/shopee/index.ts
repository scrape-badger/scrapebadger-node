/**
 * Shopee API module.
 *
 * @module shopee
 */

export { ShopeeClient } from "./client.js";
export { SearchClient as ShopeeSearchClient } from "./search.js";
export { ProductsClient as ShopeeProductsClient } from "./products.js";
export { ReviewsClient as ShopeeReviewsClient } from "./reviews.js";
export { ReferenceClient as ShopeeReferenceClient } from "./reference.js";

// Export all types
export type {
  // Sub-models
  RatingBreakdown as ShopeeRatingBreakdown,
  ProductImage as ShopeeProductImage,
  ProductModel as ShopeeProductModel,
  ProductAttribute as ShopeeProductAttribute,
  // Product
  ShopeeProduct,
  // Search / category
  SearchResult as ShopeeSearchResult,
  // Reviews
  ReviewReply as ShopeeReviewReply,
  ShopeeReview,
  ReviewSummary as ShopeeReviewSummary,
  ReviewsResult as ShopeeReviewsResult,
  // Categories
  CategoryNode as ShopeeCategoryNode,
  CategoryTree as ShopeeCategoryTree,
  // Markets
  ShopeeMarket,
  MarketsResponse as ShopeeMarketsResponse,
  // Request params
  ShopeeSearchParams,
  ShopeeCategoryItemsParams,
  ShopeeProductParams,
  ShopeeReviewsParams,
  ShopeeCategoriesParams,
} from "./types.js";
