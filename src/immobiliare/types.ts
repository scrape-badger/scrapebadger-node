/**
 * TypeScript types for Immobiliare API responses.
 *
 * These interfaces mirror the backend `immobiliare_scraper` response schema,
 * which normalises Immobiliare's internal `api-next` shapes into a clean,
 * market-agnostic snake_case schema. Optional / nullable backend fields are
 * typed as `Type | null`; list fields default to `[]` and are typed as
 * arrays. Markets: it (immobiliare.it), es (indomio.es), gr (indomio.gr),
 * lu (immotop.lu) — all EUR.
 */

// =============================================================================
// Shared nested types
// =============================================================================

/** A single listing photo in three sizes. */
export interface Photo {
  id: number | null;
  caption: string | null;
  small: string | null;
  medium: string | null;
  large: string | null;
}

/** A listing price (`price_per_sqm` / `loan_from` are detail-only). */
export interface Price {
  value: number | null;
  formatted: string | null;
  min_value: string | null;
  max_value: string | null;
  currency: string;
  visible: boolean;
  price_per_sqm: string | null;
  loan_from: string | null;
}

/** The geographic location block of a listing. */
export interface Location {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  marker: string | null;
  region: string | null;
  province: string | null;
  city: string | null;
  macrozone: string | null;
  microzone: string | null;
  zipcode: string | null;
  nation_code: string | null;
  nation_name: string | null;
}

/** A single listing feature/amenity. */
export interface Feature {
  type: string | null;
  label: string | null;
  compact_label: string | null;
}

/** The advertising agency summary attached to a listing. */
export interface Agency {
  id: number | null;
  type: string | null;
  display_name: string | null;
  label: string | null;
  url: string | null;
  is_paid: boolean | null;
  guaranteed: boolean | null;
  show_logo: boolean | null;
  image_small: string | null;
  image_large: string | null;
  phones: string[];
}

/** The individual agent behind a listing. */
export interface Agent {
  type: string | null;
  display_name: string | null;
  label: string | null;
  image_gender: string | null;
  image_url: string | null;
  phones: string[];
}

/** One unit within a listing (a listing may bundle several — a "project"). */
export interface PropertyUnit {
  is_main: boolean;
  surface: string | null;
  surface_value: number | null;
  rooms: string | null;
  bathrooms: string | null;
  bedrooms: string | null;
  floor: string | null;
  elevator: boolean | null;
  garage: string | null;
  heating: string | null;
  energy_class: string | null;
  condominium_fees: string | null;
  typology: string | null;
  category: string | null;
  caption: string | null;
  description: string | null;
  price: Price | null;
  features: Feature[];
  ga4_features: string[];
  views: string[];
  photos: Photo[];
}

// =============================================================================
// Listing (search card + /listings/{id} detail)
// =============================================================================

/** A normalised Immobiliare listing (search card or detail). */
export interface Listing {
  id: number;
  uuid: string | null;
  url: string | null;
  title: string | null;
  /** "sale" | "rent" */
  contract: string | null;
  is_new: boolean | null;
  luxury: boolean | null;
  is_project: boolean | null;
  is_mosaic: boolean | null;
  visibility: string | null;
  typology: string | null;
  category: string | null;
  price: Price | null;
  location: Location | null;
  /** Flattened convenience fields (from the main property unit) */
  surface: string | null;
  rooms: string | null;
  bathrooms: string | null;
  floor: string | null;
  energy_class: string | null;
  description: string | null;
  photo_count: number | null;
  has_virtual_tour: boolean | null;
  photos: Photo[];
  agency: Agency | null;
  agent: Agent | null;
  properties_count: number | null;
  properties: PropertyUnit[];
  /** Detail-only fields (populated by GET /listings/{id}) */
  creation_date: string | null;
  last_modified_utc: number | null;
  last_modified_at: string | null;
  features_full: Feature[];
}

// =============================================================================
// Agency profile (/agencies/{id})
// =============================================================================

/** A single agent on an agency profile. */
export interface AgencyAgent {
  id: number | null;
  name: string | null;
  surname: string | null;
  gender: string | null;
  thumbnail: string | null;
}

/** Full agency/advertiser profile (rendered from the agency page). */
export interface AgencyProfile {
  id: number;
  type: string | null;
  name: string | null;
  url: string | null;
  address: string | null;
  description: string | null;
  website: string | null;
  image: string | null;
  is_paid: boolean | null;
  partnership: string | null;
  real_estate_ads: number | null;
  real_estate_sales: number | null;
  region: string | null;
  province: string | null;
  city: string | null;
  macrozone: string | null;
  latitude: number | null;
  longitude: number | null;
  phones: string[];
  opening_hours: string[];
  agents: AgencyAgent[];
  market: string;
}

// =============================================================================
// Autocomplete (/autocomplete)
// =============================================================================

/** A geography autocomplete candidate → usable as a search location. */
export interface Suggestion {
  id: string | null;
  label: string | null;
  /** nation | region | province | comune | zone */
  type: string | null;
  region_id: string | null;
  province_id: string | null;
  city_id: string | null;
  macrozone_ids: string[];
  url: string | null;
}

// =============================================================================
// Market insights (/market-insights/prices)
// =============================================================================

/** One point in the €/m² time series. */
export interface PriceStatsPoint {
  label: string;
  value: number | null;
}

// =============================================================================
// Markets (/markets)
// =============================================================================

/** A single supported Immobiliare-group market. */
export interface Market {
  code: string;
  domain: string;
  country_code: string;
  locale: string;
  currency: string;
  name: string;
}

// =============================================================================
// Response envelopes
// =============================================================================

/** A related-search suggestion returned alongside search results. */
export interface RelatedSearch {
  label: string | null;
  url: string | null;
}

/** Response for /autocomplete. */
export interface SuggestResponse {
  suggestions: Suggestion[];
  market: string;
}

/** Response for /search. */
export interface SearchResponse {
  listings: Listing[];
  count: number | null;
  total_ads: number | null;
  current_page: number | null;
  max_pages: number | null;
  is_results_limit_reached: boolean | null;
  agencies: Agency[];
  related_searches: RelatedSearch[];
  market: string;
  source: string;
}

/** Response for /agencies/{id}/listings. */
export interface AgencyListingsResponse {
  agency_id: number;
  listings: Listing[];
  count: number | null;
  page: number;
  market: string;
}

/** Response for /market-insights/prices (€/m² time series). */
export interface PriceStatsResponse {
  contract: string;
  unit: string;
  points: PriceStatsPoint[];
  market: string;
}

/** Response for /markets (a bare array of markets). */
export type MarketsResponse = Market[];

/** Response for /reference (filter enums accepted by /search). */
export interface ReferenceResponse {
  contracts: string[];
  categories: string[];
  sorts: string[];
}

// =============================================================================
// Request parameter types
// =============================================================================

/** Supported Immobiliare-group market codes. */
export type ImmobiliareMarketCode = "it" | "es" | "gr" | "lu";

/** Contract type for the /search endpoint. */
export type ImmobiliareContract = "sale" | "rent";

/** Property category for the /search endpoint. */
export type ImmobiliareCategory =
  | "residential"
  | "commercial"
  | "garages"
  | "offices"
  | "land"
  | "buildings"
  | "warehouses";

/** Sort order for the /search endpoint. */
export type ImmobiliareSort =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "oldest"
  | "surface_desc"
  | "surface_asc";

/** Parameters for the autocomplete() method. */
export interface ImmobiliareAutocompleteParams {
  /** Market (default: "it") */
  market?: ImmobiliareMarketCode;
}

/** Parameters for the search() method. */
export interface ImmobiliareSearchParams {
  /** Market (default: "it") */
  market?: ImmobiliareMarketCode;
  /** Free-text place (auto-resolved to geography ids) */
  location?: string;
  /** Region id (fkRegione) from autocomplete() */
  region_id?: string;
  /** Province id (idProvincia) from autocomplete() */
  province_id?: string;
  /** City id (idComune) from autocomplete() */
  city_id?: string;
  /** "sale" | "rent" (default: "sale") */
  contract?: ImmobiliareContract;
  /** residential | commercial | garages | offices | land | buildings | warehouses (default: "residential") */
  category?: ImmobiliareCategory;
  /** Minimum price filter (EUR) */
  price_min?: number;
  /** Maximum price filter (EUR) */
  price_max?: number;
  /** Minimum surface filter (m²) */
  surface_min?: number;
  /** Maximum surface filter (m²) */
  surface_max?: number;
  /** Minimum number of rooms */
  rooms_min?: number;
  /** Maximum number of rooms */
  rooms_max?: number;
  /** Minimum number of bathrooms */
  bathrooms_min?: number;
  /** relevance | price_asc | price_desc | newest | oldest | surface_desc | surface_asc (default: "relevance") */
  sort?: ImmobiliareSort;
  /** Page number (>= 1, default: 1) */
  page?: number;
}

/** Parameters for the getListing() method. */
export interface ImmobiliareListingParams {
  /** Market (default: "it") */
  market?: ImmobiliareMarketCode;
}

/** Parameters for the getAgency() method. */
export interface ImmobiliareAgencyParams {
  /** Market (default: "it") */
  market?: ImmobiliareMarketCode;
}

/** Parameters for the getAgencyListings() method. */
export interface ImmobiliareAgencyListingsParams {
  /** Market (default: "it") */
  market?: ImmobiliareMarketCode;
  /** Page number (>= 1, default: 1) */
  page?: number;
}

/** Parameters for the priceStats() method. */
export interface ImmobiliarePriceStatsParams {
  /** Province id, e.g. "MI" */
  province_id?: string;
  /** City id (idComune) */
  city_id?: string;
  /** Market (default: "it") */
  market?: ImmobiliareMarketCode;
  /** "sale" or "rent" (default: "sale") */
  contract?: "sale" | "rent";
}
