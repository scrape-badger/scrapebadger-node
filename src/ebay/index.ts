/**
 * eBay API module.
 *
 * @module ebay
 */

export { EbayClient } from "./client.js";
export { SearchClient as EbaySearchClient } from "./search.js";
export { ItemsClient as EbayItemsClient } from "./items.js";
export { SellersClient as EbaySellersClient } from "./sellers.js";
export { CategoriesClient as EbayCategoriesClient } from "./categories.js";
export { ReferenceClient as EbayReferenceClient } from "./reference.js";

// Export all types
export type {
  // Shared
  EbayPrice,
  Pagination as EbayPagination,
  MarketInfo as EbayMarketInfo,
  CategoryInfo as EbayCategoryInfo,
  Image as EbayImage,
  ShippingOption as EbayShippingOption,
  // Search / listings
  SearchResult as EbaySearchResult,
  // Item detail
  ItemSeller as EbayItemSeller,
  ReturnsPolicy as EbayReturnsPolicy,
  Item as EbayItem,
  // Seller
  FeedbackBreakdown as EbayFeedbackBreakdown,
  Seller as EbaySeller,
  FeedbackEntry as EbayFeedbackEntry,
  // Reviews
  RatingHistogram as EbayRatingHistogram,
  Review as EbayReview,
  // Autocomplete
  AutocompleteSuggestion as EbayAutocompleteSuggestion,
  // Response envelopes
  SearchResponse as EbaySearchResponse,
  ItemDetailResponse as EbayItemDetailResponse,
  SellerProfileResponse as EbaySellerProfileResponse,
  SellerItemsResponse as EbaySellerItemsResponse,
  SellerFeedbackResponse as EbaySellerFeedbackResponse,
  ReviewsResponse as EbayReviewsResponse,
  CategoryResponse as EbayCategoryResponse,
  AutocompleteResponse as EbayAutocompleteResponse,
  MarketsResponse as EbayMarketsResponse,
  CategoriesResponse as EbayCategoriesResponse,
  // Param enums
  EbaySortBy,
  EbayCondition,
  EbayBuyingFormat,
  // Request params
  EbaySearchParams,
  EbayCompletedParams,
  EbayItemParams,
  EbayReviewsParams,
  EbaySellerParams,
  EbaySellerItemsParams,
  EbaySellerFeedbackParams,
  EbayCategoryParams,
  EbayAutocompleteParams,
} from "./types.js";
