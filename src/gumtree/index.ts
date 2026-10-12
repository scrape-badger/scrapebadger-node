/**
 * Gumtree API module.
 *
 * @module gumtree
 */

export { GumtreeClient } from "./client.js";

export type {
  // Shared value objects
  GumtreeAttribute,
  GumtreeCategoryRef,
  GumtreeBreadcrumb,
  GumtreeListingSummary,
  // Search
  GumtreeCategoryFacet,
  GumtreeSearchResponse,
  GumtreeFilterOption,
  GumtreeSearchFilter,
  GumtreeSortOption,
  GumtreeFiltersResponse,
  // Listing detail
  GumtreeSellerRating,
  GumtreeSellerVerification,
  GumtreeSeller,
  GumtreeListingDetail,
  // Seller listings
  GumtreeSellerListingsResponse,
  // Reference data
  GumtreeSuggestion,
  GumtreeAutocompleteResponse,
  GumtreeLocationSuggestion,
  GumtreeLocationAutocompleteResponse,
  GumtreeTreeNode,
  GumtreeTreeResponse,
  // Markets
  GumtreeMarketInfo,
  GumtreeMarketsResponse,
  // Request params
  GumtreeMarket,
  GumtreeSort,
  GumtreeSellerType,
  GumtreeSearchParams,
  GumtreeSearchFiltersParams,
  GumtreeMarketParams,
  GumtreeSellerListingsParams,
  GumtreeTreeParams,
} from "./types.js";
