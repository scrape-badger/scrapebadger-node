/**
 * TypeScript types for Redfin API responses.
 *
 * These interfaces mirror the backend `redfin_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; list fields default to `[]` and are typed as arrays.
 *
 * Redfin is a single-domain, single-locale target (redfin.com, USD, en-US
 * behind a US residential IP), so there is no market/currency dimension on
 * these types. Every datetime field ships in BOTH `*_utc` (Unix float
 * seconds) and `*_at` (ISO-8601 Z string).
 */

// =============================================================================
// Shared
// =============================================================================

export interface LatLong {
  latitude: number | null;
  longitude: number | null;
}

export interface Pagination {
  current_page: number;
  per_page: number | null;
  total_results: number | null;
}

/** Map bounding box a search covers. */
export interface MapBounds {
  north: number | null;
  east: number | null;
  south: number | null;
  west: number | null;
}

/** The geocoded region a search resolved to (name + centre point). */
export interface RegionSelection {
  name: string | null;
  display_name: string | null;
  type: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** Median stats over the result set. */
export interface SearchMedian {
  price: number | null;
  sqft: number | null;
  price_per_sqft: number | null;
  dom: number | null;
  beds: number | null;
  baths: number | null;
}

/** MLS attribution. */
export interface DataSource {
  id: number | null;
  name: string | null;
  description: string | null;
}

/** A listing badge — "Open House", "New", "3D Tour"… */
export interface Sash {
  type_id: number | null;
  name: string | null;
  color: string | null;
  text: string | null;
}

/** A supported coverage region (for /markets). */
export interface MarketInfo {
  code: string;
  country: string;
  currency: string;
  locale: string;
  name: string;
  domain: string;
}

// =============================================================================
// Search results
// =============================================================================

/** One Redfin GIS search card. */
export interface Listing {
  position: number;
  property_id: number | null;
  listing_id: number | null;
  building_id: number | null;
  url: string | null;
  // Status / type
  mls_id: string | null;
  mls_status: string | null;
  search_status: number | null;
  property_type: number | null;
  ui_property_type: number | null;
  listing_type: number | null;
  is_redfin: boolean | null;
  is_new_construction: boolean | null;
  is_hot: boolean | null;
  // Price / valuation
  price: number | null;
  price_per_sqft: number | null;
  hoa: number | null;
  is_hoa_frequency_known: boolean | null;
  // Specs
  beds: number | null;
  baths: number | null;
  full_baths: number | null;
  partial_baths: number | null;
  sqft: number | null;
  lot_size: number | null;
  stories: number | null;
  year_built: number | null;
  parking_spaces: number | null;
  // Address
  street_line: string | null;
  unit_number: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country_code: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  show_address_on_map: boolean | null;
  // Listing meta / timing
  days_on_market: number | null;
  time_on_redfin_ms: number | null;
  time_zone: string | null;
  sold_date_utc: number | null;
  sold_date_at: string | null;
  listing_agent_name: string | null;
  listing_agent_id: number | null;
  listing_broker_name: string | null;
  listing_broker_is_redfin: boolean | null;
  // Content
  listing_remarks: string | null;
  key_facts: string[];
  listing_tags: string[];
  hotness_message: string | null;
  sashes: Sash[];
  // Media
  num_pictures: number | null;
  photo_format: string | null;
  primary_photo: string | null;
  has_virtual_tour: boolean | null;
  has_video_tour: boolean | null;
  has_3d_tour: boolean | null;
  tour_url: string | null;
  open_house_start_utc: number | null;
  open_house_start_at: string | null;
  open_house_end_utc: number | null;
  open_house_end_at: string | null;
  open_house_text: string | null;
}

// =============================================================================
// Property detail nested
// =============================================================================

export interface Address {
  street_address: string | null;
  unit_number: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  county: string | null;
  neighborhood: string | null;
  country_code: string | null;
}

export interface PriceHistoryEvent {
  date: string | null;
  date_utc: number | null;
  date_at: string | null;
  event: string | null;
  price: number | null;
  price_per_sqft: number | null;
  source: string | null;
  source_id: string | null;
  mls_status: string | null;
}

export interface TaxHistoryEvent {
  year: number | null;
  tax: number | null;
  assessment_total: number | null;
  assessment_land: number | null;
  assessment_improvement: number | null;
}

export interface School {
  name: string | null;
  rating: number | null;
  grades: string | null;
  level: string | null;
  type: string | null;
  distance: number | null;
  num_students: number | null;
  url: string | null;
}

export interface Photo {
  url: string | null;
  caption: string | null;
}

/** One `amenitiesInfo` super-group → group → referenceName/content. */
export interface AmenityGroup {
  title: string | null;
  items: Record<string, unknown>[];
}

/** Full Redfin property detail. */
export interface Property {
  // Identity
  property_id: number;
  listing_id: number | null;
  url: string | null;
  mls_id: string | null;
  mls_status: string | null;
  property_type: string | null;
  ui_property_type: number | null;
  listing_type: number | null;
  is_redfin: boolean | null;
  is_new_construction: boolean | null;
  // Price / valuation
  price: number | null;
  price_per_sqft: number | null;
  list_price: number | null;
  sold_price: number | null;
  last_sold_date_utc: number | null;
  last_sold_date_at: string | null;
  redfin_estimate: number | null;
  rent_estimate: number | null;
  hoa_fee: number | null;
  hoa_frequency: string | null;
  tax_annual: number | null;
  // Specs
  beds: number | null;
  baths: number | null;
  full_baths: number | null;
  partial_baths: number | null;
  sqft: number | null;
  lot_sqft: number | null;
  stories: number | null;
  year_built: number | null;
  year_renovated: number | null;
  days_on_market: number | null;
  parking_spaces: number | null;
  parking_type: string | null;
  style: string | null;
  // Location
  latitude: number | null;
  longitude: number | null;
  address: Address | null;
  time_zone: string | null;
  apn: string | null;
  county: string | null;
  // Content
  description: string | null;
  key_facts: string[];
  listing_tags: string[];
  // Media
  photos: Photo[];
  num_photos: number | null;
  has_3d_tour: boolean | null;
  has_video_tour: boolean | null;
  tour_url: string | null;
  // Agent / broker
  listing_agent_name: string | null;
  listing_agent_id: number | null;
  listing_broker_name: string | null;
  listing_broker_phone: string | null;
  // Nested collections
  price_history: PriceHistoryEvent[];
  tax_history: TaxHistoryEvent[];
  schools: School[];
  amenities: AmenityGroup[];
  // Timestamps
  scraped_utc: number | null;
  scraped_at: string | null;
}

// =============================================================================
// Agent profile
// =============================================================================

export interface AgentReview {
  rating: number | null;
  comment: string | null;
  date: string | null;
  reviewer_name: string | null;
  reviewer_type: string | null;
}

/** A Redfin real-estate agent profile. */
export interface Agent {
  agent_id: string | null;
  name: string | null;
  url: string | null;
  profile_photo: string | null;
  title: string | null;
  is_redfin_agent: boolean | null;
  phone: string | null;
  email: string | null;
  brokerage: string | null;
  bio: string | null;
  rating: number | null;
  review_count: number | null;
  deals_last_year: number | null;
  total_deals: number | null;
  price_range_min: number | null;
  price_range_max: number | null;
  years_experience: number | null;
  service_areas: string[];
  specialties: string[];
  languages: string[];
  reviews: AgentReview[];
  listings: Listing[];
  scraped_utc: number | null;
  scraped_at: string | null;
}

// =============================================================================
// Autocomplete
// =============================================================================

/** A geocoded place suggestion for a search term (name + centre + bbox). */
export interface AutocompleteResult {
  name: string | null;
  display_name: string | null;
  type: string | null;
  latitude: number | null;
  longitude: number | null;
  north: number | null;
  south: number | null;
  east: number | null;
  west: number | null;
}

// =============================================================================
// Response Envelopes
// =============================================================================

export interface SearchResponse {
  location: string | null;
  status: string;
  results: Listing[];
  total_results: number;
  region: RegionSelection | null;
  map_bounds: MapBounds | null;
  search_median: SearchMedian | null;
  data_sources: DataSource[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

export interface PropertyResponse {
  property: Property;
}

export interface AgentResponse {
  agent: Agent;
}

export interface AutocompleteResponse {
  query: string;
  results: AutocompleteResult[];
}

export interface MarketsResponse {
  markets: MarketInfo[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Sort field for the /search endpoint. */
export type RedfinSort =
  | "relevant"
  | "newest"
  | "price_low_to_high"
  | "price_high_to_low"
  | "square_feet"
  | "lot_size"
  | "price_per_sqft"
  | "beds"
  | "baths";

/** Home type filter for the /search endpoint. */
export type RedfinHomeType =
  | "house"
  | "condo"
  | "townhouse"
  | "multi_family"
  | "land"
  | "other"
  | "mobile"
  | "coop";

/** Options for the /search endpoint (for-sale only). */
export interface RedfinSearchParams {
  /** Page number (1-20, default: 1) */
  page?: number;
  /** Sort order */
  sort?: RedfinSort;
  /** Minimum price filter */
  price_min?: number;
  /** Maximum price filter */
  price_max?: number;
  /** Minimum number of bedrooms */
  beds_min?: number;
  /** Minimum number of bathrooms */
  baths_min?: number;
  /** Home type filter */
  home_type?: RedfinHomeType;
  /** Minimum living area (square feet) */
  sqft_min?: number;
  /** Maximum living area (square feet) */
  sqft_max?: number;
  /** Minimum lot size (square feet) */
  lot_min?: number;
  /** Maximum lot size (square feet) */
  lot_max?: number;
  /** Minimum year built */
  year_built_min?: number;
  /** Maximum year built */
  year_built_max?: number;
  /** Maximum days on market */
  max_days_on_market?: number;
  /** North map bound. Optional bbox override. */
  north?: number;
  /** South map bound */
  south?: number;
  /** East map bound */
  east?: number;
  /** West map bound */
  west?: number;
}

/** Options for the /property endpoint. */
export interface RedfinPropertyParams {
  /** Full Redfin home URL — alternative to the propertyId positional arg */
  url?: string;
}

/** Options for the /agent endpoint. */
export interface RedfinAgentParams {
  /** Full Redfin agent profile URL — alternative to the agentId positional arg */
  url?: string;
}
