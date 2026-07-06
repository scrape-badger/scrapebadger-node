/**
 * Leboncoin API module.
 *
 * @module leboncoin
 */

export { LeboncoinClient } from "./client.js";
export { SearchClient as LeboncoinSearchClient } from "./search.js";
export { AdsClient as LeboncoinAdsClient } from "./ads.js";
export { SellersClient as LeboncoinSellersClient } from "./sellers.js";
export { ReferenceClient as LeboncoinReferenceClient } from "./reference.js";

// Export all types
export type {
  // Ad building blocks
  Attribute as LeboncoinAttribute,
  Location as LeboncoinLocation,
  Owner as LeboncoinOwner,
  Images as LeboncoinImages,
  Ad as LeboncoinAd,
  // Seller / store
  FeedbackScores as LeboncoinFeedbackScores,
  StoreRatingReview as LeboncoinStoreRatingReview,
  Seller as LeboncoinSeller,
  // Reference
  Category as LeboncoinCategory,
  Region as LeboncoinRegion,
  Department as LeboncoinDepartment,
  LocationSuggestion as LeboncoinLocationSuggestion,
  // Response envelopes
  SearchResponse as LeboncoinSearchResponse,
  AdResponse as LeboncoinAdResponse,
  SimilarResponse as LeboncoinSimilarResponse,
  SellerResponse as LeboncoinSellerResponse,
  SellerListingsResponse as LeboncoinSellerListingsResponse,
  CategoriesResponse as LeboncoinCategoriesResponse,
  RegionsResponse as LeboncoinRegionsResponse,
  DepartmentsResponse as LeboncoinDepartmentsResponse,
  LocationSearchResponse as LeboncoinLocationSearchResponse,
  MarketsResponse as LeboncoinMarketsResponse,
  // Param enums
  LeboncoinOwnerType,
  LeboncoinAdType,
  LeboncoinSortBy,
  // Request params
  LeboncoinSearchParams,
  LeboncoinSimilarParams,
  LeboncoinSellerListingsParams,
  LeboncoinDepartmentsParams,
} from "./types.js";
