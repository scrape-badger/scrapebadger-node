/**
 * Vinted API module.
 *
 * @module vinted
 */

export { VintedClient } from "./client.js";
export { SearchClient as VintedSearchClient } from "./search.js";
export { ItemsClient as VintedItemsClient } from "./items.js";
export { UsersClient as VintedUsersClient } from "./users.js";
export { ReferenceClient as VintedReferenceClient } from "./reference.js";

// Export all types
export type {
  // Common types
  VintedPrice,
  VintedPhoto,
  VintedUserSummary,
  VintedSellerSummary,
  // Item types
  VintedItemSummary,
  VintedItemDetail,
  // User types
  VintedUserProfile,
  // Reference types
  VintedBrand,
  VintedColor,
  VintedStatus,
  VintedMarket,
  // Pagination
  VintedPagination,
  // Response types
  SearchResponse as VintedSearchResponse,
  ItemDetailResponse as VintedItemDetailResponse,
  UserProfileResponse as VintedUserProfileResponse,
  UserItemsResponse as VintedUserItemsResponse,
  BrandsResponse as VintedBrandsResponse,
  ColorsResponse as VintedColorsResponse,
  StatusesResponse as VintedStatusesResponse,
  MarketsResponse as VintedMarketsResponse,
  // Search params
  VintedSearchParams,
} from "./types.js";
