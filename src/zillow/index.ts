/**
 * Zillow API module.
 *
 * @module zillow
 */

export { ZillowClient } from "./client.js";
export { SearchClient as ZillowSearchClient } from "./search.js";
export { PropertiesClient as ZillowPropertiesClient } from "./properties.js";
export { AgentClient as ZillowAgentClient } from "./agent.js";
export { ReferenceClient as ZillowReferenceClient } from "./reference.js";

// Export all types
export type {
  // Shared
  LatLong as ZillowLatLong,
  Photo as ZillowPhoto,
  Pagination as ZillowPagination,
  MapBounds as ZillowMapBounds,
  RegionSelection as ZillowRegionSelection,
  NearbyRegion as ZillowNearbyRegion,
  MarketInfo as ZillowMarketInfo,
  // Search results
  Listing as ZillowListing,
  // Property detail
  Address as ZillowAddress,
  ListingSubType as ZillowListingSubType,
  OpenHouse as ZillowOpenHouse,
  ZestimateHistoryPoint as ZillowZestimateHistoryPoint,
  PriceHistoryEvent as ZillowPriceHistoryEvent,
  TaxHistoryEvent as ZillowTaxHistoryEvent,
  School as ZillowSchool,
  AgentAttribution as ZillowAgentAttribution,
  MortgageRate as ZillowMortgageRate,
  MortgageRates as ZillowMortgageRates,
  HomeFacts as ZillowHomeFacts,
  Property as ZillowProperty,
  // Agent profile
  AgentReview as ZillowAgentReview,
  PastSale as ZillowPastSale,
  AgentLicense as ZillowAgentLicense,
  Agent as ZillowAgent,
  // Autocomplete
  AutocompleteResult as ZillowAutocompleteResult,
  // Response envelopes
  SearchResponse as ZillowSearchResponse,
  PropertyResponse as ZillowPropertyResponse,
  AgentResponse as ZillowAgentResponse,
  AutocompleteResponse as ZillowAutocompleteResponse,
  MarketsResponse as ZillowMarketsResponse,
  // Param enums
  ZillowStatus,
  ZillowSort,
  // Request params
  ZillowSearchOptions,
  ZillowAgentOptions,
} from "./types.js";
