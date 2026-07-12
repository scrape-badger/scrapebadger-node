/**
 * Depop API module.
 *
 * @module depop
 */

export { DepopClient } from "./client.js";

// Export all types
export type {
  // Shared
  DepopCard,
  SearchMeta as DepopSearchMeta,
  DepopMarket,
  // Response envelopes
  DepopSearchResponse,
  DepopProductDetail,
  DepopShopProfile,
  DepopUserProductsResponse,
  DepopMarketsResponse,
  // Request params
  DepopSearchParams,
  DepopProductParams,
  DepopUserParams,
  DepopUserProductsParams,
} from "./types.js";
