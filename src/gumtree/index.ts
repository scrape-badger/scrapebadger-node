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
  // Request params
  GumtreeSort,
  GumtreeSellerType,
  GumtreeSearchParams,
  GumtreeSearchFiltersParams,
} from "./types.js";
