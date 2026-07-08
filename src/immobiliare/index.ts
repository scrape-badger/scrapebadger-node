/**
 * Immobiliare API module.
 *
 * @module immobiliare
 */

export { ImmobiliareClient } from "./client.js";

// Export all types
export type {
  // Shared / nested
  Photo as ImmobiliarePhoto,
  Price as ImmobiliarePrice,
  Location as ImmobiliareLocation,
  Feature as ImmobiliareFeature,
  Agency as ImmobiliareAgency,
  Agent as ImmobiliareAgent,
  PropertyUnit as ImmobiliarePropertyUnit,
  // Listing
  Listing as ImmobiliareListing,
  // Agency profile
  AgencyAgent as ImmobiliareAgencyAgent,
  AgencyProfile as ImmobiliareAgencyProfile,
  // Autocomplete
  Suggestion as ImmobiliareSuggestion,
  // Market insights
  PriceStatsPoint as ImmobiliarePriceStatsPoint,
  // Markets
  Market as ImmobiliareMarket,
  // Response envelopes
  RelatedSearch as ImmobiliareRelatedSearch,
  SuggestResponse as ImmobiliareSuggestResponse,
  SearchResponse as ImmobiliareSearchResponse,
  AgencyListingsResponse as ImmobiliareAgencyListingsResponse,
  PriceStatsResponse as ImmobiliarePriceStatsResponse,
  MarketsResponse as ImmobiliareMarketsResponse,
  ReferenceResponse as ImmobiliareReferenceResponse,
  // Param enums
  ImmobiliareMarketCode,
  ImmobiliareContract,
  ImmobiliareCategory,
  ImmobiliareSort,
  // Request params
  ImmobiliareAutocompleteParams,
  ImmobiliareSearchParams,
  ImmobiliareListingParams,
  ImmobiliareAgencyParams,
  ImmobiliareAgencyListingsParams,
  ImmobiliarePriceStatsParams,
} from "./types.js";
