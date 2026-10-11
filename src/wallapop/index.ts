/**
 * Wallapop API module.
 *
 * @module wallapop
 */

export { WallapopClient } from "./client.js";

// Export all types
export type {
  // Shared
  WallapopImage,
  WallapopLocation,
  WallapopTaxonomyNode,
  WallapopAttribute,
  WallapopMarket,
  // Search / items
  WallapopSearchItem,
  WallapopSearchResponse,
  WallapopItemDetail,
  // Users
  WallapopUserValidations,
  WallapopUserProfile,
  WallapopUserItem,
  WallapopUserItemsResponse,
  WallapopReviewItem,
  WallapopReviewer,
  WallapopReview,
  WallapopReviewsResponse,
  // Reference
  WallapopSuggestion,
  WallapopAutocompleteResponse,
  WallapopCategory,
  WallapopCategoriesResponse,
  WallapopFilterOption,
  WallapopSearchFilter,
  WallapopFiltersResponse,
  WallapopFilterOptionsResponse,
  WallapopMarketsResponse,
  // Request params
  WallapopOrderBy,
  WallapopTimeFilter,
  WallapopSearchParams,
  WallapopItemParams,
  WallapopUserParams,
  WallapopUserPageParams,
  WallapopMarketParams,
  WallapopFiltersParams,
} from "./types.js";
