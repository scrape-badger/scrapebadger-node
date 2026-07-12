/**
 * Redfin API module.
 *
 * @module redfin
 */

export { RedfinClient } from "./client.js";

// Export all types
export type {
  // Shared
  LatLong as RedfinLatLong,
  Pagination as RedfinPagination,
  MapBounds as RedfinMapBounds,
  RegionSelection as RedfinRegionSelection,
  SearchMedian as RedfinSearchMedian,
  DataSource as RedfinDataSource,
  Sash as RedfinSash,
  MarketInfo as RedfinMarketInfo,
  // Search element
  Listing as RedfinListing,
  // Property detail
  Address as RedfinAddress,
  PriceHistoryEvent as RedfinPriceHistoryEvent,
  TaxHistoryEvent as RedfinTaxHistoryEvent,
  School as RedfinSchool,
  Photo as RedfinPhoto,
  AmenityGroup as RedfinAmenityGroup,
  Property as RedfinProperty,
  // Agent
  AgentReview as RedfinAgentReview,
  Agent as RedfinAgent,
  // Autocomplete
  AutocompleteResult as RedfinAutocompleteResult,
  // Response envelopes
  SearchResponse as RedfinSearchResponse,
  PropertyResponse as RedfinPropertyResponse,
  AgentResponse as RedfinAgentResponse,
  AutocompleteResponse as RedfinAutocompleteResponse,
  MarketsResponse as RedfinMarketsResponse,
  // Param enums
  RedfinSort,
  RedfinHomeType,
  // Request params
  RedfinSearchParams,
  RedfinPropertyParams,
  RedfinAgentParams,
} from "./types.js";
