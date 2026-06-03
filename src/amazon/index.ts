/**
 * Amazon API module.
 *
 * @module amazon
 */

export { AmazonClient } from "./client.js";
export { SearchClient as AmazonSearchClient } from "./search.js";
export { ProductsClient as AmazonProductsClient } from "./products.js";
export { ListingsClient as AmazonListingsClient } from "./listings.js";
export { SellersClient as AmazonSellersClient } from "./sellers.js";
export { ReferenceClient as AmazonReferenceClient } from "./reference.js";

// Export all types
export type {
  // Shared
  AmazonPrice,
  Pagination as AmazonPagination,
  MarketInfo as AmazonMarketInfo,
  CategoryInfo as AmazonCategoryInfo,
  // Product
  RatingBreakdown as AmazonRatingBreakdown,
  BestsellersRankEntry as AmazonBestsellersRankEntry,
  ProductVariant as AmazonProductVariant,
  Buybox as AmazonBuybox,
  ProductBadges as AmazonProductBadges,
  Coupon as AmazonCoupon,
  ProductDeal as AmazonProductDeal,
  Delivery as AmazonDelivery,
  RelatedProduct as AmazonRelatedProduct,
  Product as AmazonProduct,
  // Search
  SearchResult as AmazonSearchResult,
  // Offers
  OfferSeller as AmazonOfferSeller,
  OfferCondition as AmazonOfferCondition,
  OfferDelivery as AmazonOfferDelivery,
  Offer as AmazonOffer,
  // Reviews
  ReviewProfile as AmazonReviewProfile,
  Review as AmazonReview,
  // Bestsellers / new releases
  Bestseller as AmazonBestseller,
  // Deals
  Deal as AmazonDeal,
  // Sellers
  FeedbackWindow as AmazonFeedbackWindow,
  SellerFeedbackSummary as AmazonSellerFeedbackSummary,
  Seller as AmazonSeller,
  SellerFeedbackEntry as AmazonSellerFeedbackEntry,
  // Autocomplete
  AutocompleteSuggestion as AmazonAutocompleteSuggestion,
  // Response envelopes
  SearchResponse as AmazonSearchResponse,
  ProductDetailResponse as AmazonProductDetailResponse,
  OffersResponse as AmazonOffersResponse,
  ReviewsResponse as AmazonReviewsResponse,
  BestsellersResponse as AmazonBestsellersResponse,
  NewReleasesResponse as AmazonNewReleasesResponse,
  DealsResponse as AmazonDealsResponse,
  CategoryResponse as AmazonCategoryResponse,
  SellerProfileResponse as AmazonSellerProfileResponse,
  SellerProductsResponse as AmazonSellerProductsResponse,
  SellerFeedbackResponse as AmazonSellerFeedbackResponse,
  AutocompleteResponse as AmazonAutocompleteResponse,
  MarketsResponse as AmazonMarketsResponse,
  CategoriesResponse as AmazonCategoriesResponse,
  // Request params
  AmazonSearchParams,
  AmazonProductParams,
  AmazonOffersParams,
  AmazonReviewsParams,
  AmazonListingsParams,
  AmazonDealsParams,
  AmazonCategoryParams,
  AmazonSellerListParams,
  AmazonSellerParams,
  AmazonAutocompleteParams,
} from "./types.js";
