/**
 * Realtor API module.
 *
 * @module realtor
 */

export { RealtorClient } from "./client.js";
export { SearchClient as RealtorSearchClient } from "./search.js";
export { PropertiesClient as RealtorPropertiesClient } from "./properties.js";
export { ReferenceClient as RealtorReferenceClient } from "./reference.js";

// Export all types
export type {
  // Shared
  Coordinate as RealtorCoordinate,
  Address as RealtorAddress,
  Photo as RealtorPhoto,
  Phone as RealtorPhone,
  Office as RealtorOffice,
  Agent as RealtorAgent,
  OpenHouse as RealtorOpenHouse,
  School as RealtorSchool,
  TaxRecord as RealtorTaxRecord,
  PriceEvent as RealtorPriceEvent,
  Estimate as RealtorEstimate,
  DetailGroup as RealtorDetailGroup,
  Flags as RealtorFlags,
  // Property
  Property as RealtorProperty,
  PropertyDetail as RealtorPropertyDetail,
  // Autocomplete
  Suggestion as RealtorSuggestion,
  // Reference
  MarketInfo as RealtorMarketInfo,
  // Response envelopes
  AutocompleteResponse as RealtorAutocompleteResponse,
  SearchResponse as RealtorSearchResponse,
  MarketsResponse as RealtorMarketsResponse,
  // Param enums
  RealtorMarket,
  RealtorStatus,
  RealtorSort,
  // Request params
  RealtorSearchOptions,
  RealtorAutocompleteOptions,
  RealtorPropertyOptions,
} from "./types.js";
