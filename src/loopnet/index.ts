/**
 * LoopNet API module.
 *
 * @module loopnet
 */

export { LoopNetClient } from "./client.js";
export { SearchClient as LoopNetSearchClient } from "./search.js";
export { ListingsClient as LoopNetListingsClient } from "./listings.js";
export { BrokersClient as LoopNetBrokersClient } from "./brokers.js";
export { ReferenceClient as LoopNetReferenceClient } from "./reference.js";

// Export request-param helper types
export type { LoopNetListingParams } from "./listings.js";
export type { LoopNetBrokerParams } from "./brokers.js";

// Export all response types
export type {
  // Shared
  Broker as LoopNetBroker,
  Space as LoopNetSpace,
  MarketInfo as LoopNetMarketInfo,
  PropertyTypeInfo as LoopNetPropertyTypeInfo,
  Pagination as LoopNetPagination,
  // Search results
  ListingCard as LoopNetListingCard,
  // Listing detail
  ListingDetail as LoopNetListingDetail,
  // Broker profile
  BrokerProfile as LoopNetBrokerProfile,
  // Response envelopes
  SearchResponse as LoopNetSearchResponse,
  ListingResponse as LoopNetListingResponse,
  BrokerResponse as LoopNetBrokerResponse,
  MarketsResponse as LoopNetMarketsResponse,
  PropertyTypesResponse as LoopNetPropertyTypesResponse,
  // Param enums
  LoopNetMarket,
  LoopNetListingType,
  LoopNetPriceType,
  // Request params
  LoopNetSearchParams,
} from "./types.js";
