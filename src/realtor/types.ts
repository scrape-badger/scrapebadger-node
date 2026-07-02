/**
 * TypeScript types for Realtor API responses.
 *
 * These interfaces mirror the backend `realtor_scraper` response schema
 * field-for-field. Backend keys are snake_case (e.g. `property_id`,
 * `list_price`, `last_sold_date_at`, `tax_history`) and are kept snake_case
 * here to match the JSON exactly. All model fields are optional and nullable
 * (`field?: type | null`); list fields default to `[]` on the backend and are
 * typed as arrays. Every datetime field ships in BOTH `*_utc` (string) and
 * `*_at` (string) form.
 */

// =============================================================================
// Shared Types
// =============================================================================

/** A lat/lon coordinate pair. */
export interface Coordinate {
  lat?: number | null;
  lon?: number | null;
}

/** A postal address with an optional coordinate. */
export interface Address {
  line?: string | null;
  city?: string | null;
  state?: string | null;
  state_code?: string | null;
  postal_code?: string | null;
  country?: string | null;
  neighborhood?: string | null;
  county?: string | null;
  coordinate?: Coordinate | null;
}

/** A property photo with multiple resolutions. */
export interface Photo {
  href?: string | null;
  href_high?: string | null;
  href_med?: string | null;
  href_low?: string | null;
  tags?: string[];
  description?: string | null;
}

/** A phone number attached to an agent or office. */
export interface Phone {
  number?: string | null;
  type?: string | null;
  ext?: string | null;
  primary?: boolean | null;
}

/** An agent's brokerage office. */
export interface Office {
  name?: string | null;
  email?: string | null;
  href?: string | null;
  logo?: string | null;
  phones?: Phone[];
  address?: Address | null;
}

/** A listing agent. */
export interface Agent {
  agent_id?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  title?: string | null;
  type?: string | null;
  email?: string | null;
  phones?: Phone[];
  photo?: string | null;
  href?: string | null;
  office?: Office | null;
  broker?: string | null;
  nrds_id?: string | null;
  state_license?: string | null;
}

/** A scheduled open house. */
export interface OpenHouse {
  start_utc?: string | null;
  start_at?: string | null;
  end_utc?: string | null;
  end_at?: string | null;
  description?: string | null;
  time_zone?: string | null;
  href?: string | null;
}

/** A nearby school. */
export interface School {
  name?: string | null;
  rating?: number | null;
  education_levels?: string[];
  grades?: string | null;
  distance_miles?: number | null;
  district?: string | null;
}

/** A single year's tax + assessment record. */
export interface TaxRecord {
  year?: number | null;
  tax?: number | null;
  assessment_building?: number | null;
  assessment_land?: number | null;
  assessment_total?: number | null;
}

/** A single price-history event (list, sold, reduced, etc.). */
export interface PriceEvent {
  date_utc?: string | null;
  date_at?: string | null;
  event?: string | null;
  price?: number | null;
  price_per_sqft?: number | null;
  source_listing_id?: string | null;
}

/** A third-party value estimate. */
export interface Estimate {
  source?: string | null;
  estimate?: number | null;
  estimate_high?: number | null;
  estimate_low?: number | null;
  date_utc?: string | null;
  date_at?: string | null;
}

/** A named group of detail lines (e.g. "Interior Features"). */
export interface DetailGroup {
  category?: string | null;
  text?: string[];
}

/** Boolean status flags for a listing. */
export interface Flags {
  is_new_listing?: boolean | null;
  is_pending?: boolean | null;
  is_contingent?: boolean | null;
  is_foreclosure?: boolean | null;
  is_new_construction?: boolean | null;
  is_price_reduced?: boolean | null;
  is_coming_soon?: boolean | null;
}

// =============================================================================
// Property (search results)
// =============================================================================

/** A property as returned by /search. */
export interface Property {
  property_id?: string | null;
  listing_id?: string | null;
  mls_number?: string | null;
  market?: string | null;
  country?: string | null;
  url?: string | null;
  status?: string | null;
  transaction_type?: string | null;
  currency?: string | null;
  list_price?: number | null;
  list_price_formatted?: string | null;
  list_price_min?: number | null;
  list_price_max?: number | null;
  price_per_sqft?: number | null;
  price_reduced_amount?: number | null;
  last_sold_price?: number | null;
  last_sold_date_utc?: string | null;
  last_sold_date_at?: string | null;
  hoa_fee?: number | null;
  property_type?: string | null;
  sub_type?: string | null;
  beds?: number | null;
  baths?: number | null;
  baths_full?: number | null;
  baths_half?: number | null;
  sqft?: number | null;
  lot_sqft?: number | null;
  year_built?: number | null;
  stories?: number | null;
  garage?: number | null;
  rooms?: number | null;
  parking_spaces?: number | null;
  address?: Address | null;
  description_text?: string | null;
  primary_photo?: string | null;
  photo_count?: number | null;
  photos?: Photo[];
  virtual_tours?: string[];
  videos?: string[];
  flags?: Flags | null;
  tags?: string[];
  list_date_utc?: string | null;
  list_date_at?: string | null;
  last_update_utc?: string | null;
  last_update_at?: string | null;
  days_on_market?: number | null;
  agents?: Agent[];
  source_mls_id?: string | null;
  source_mls_name?: string | null;
  open_houses?: OpenHouse[];
}

/** A property as returned by /properties/{property_id} (Property + extras). */
export interface PropertyDetail extends Property {
  details?: DetailGroup[];
  amenities?: string[];
  tax_history?: TaxRecord[];
  price_history?: PriceEvent[];
  schools?: School[];
  estimates?: Estimate[];
}

// =============================================================================
// Autocomplete
// =============================================================================

/** A single location suggestion. */
export interface Suggestion {
  id?: string | null;
  type?: string | null;
  label?: string | null;
  city?: string | null;
  state_code?: string | null;
  postal_code?: string | null;
  country?: string | null;
  slug_id?: string | null;
  geo_id?: string | null;
  coordinate?: Coordinate | null;
  market?: string | null;
}

// =============================================================================
// Reference (markets)
// =============================================================================

/** A single supported market (for /markets). */
export interface MarketInfo {
  code: string;
  domain: string;
  country: string;
  currency: string;
  locale: string;
  name: string;
}

// =============================================================================
// Response Envelopes (FLAT — no `data` wrapper)
// =============================================================================

/** Response from the /autocomplete endpoint. */
export interface AutocompleteResponse {
  market: string;
  query: string;
  suggestions: Suggestion[];
}

/** Response from the /search endpoint. */
export interface SearchResponse {
  market: string;
  country: string;
  total: number;
  count: number;
  page: number;
  total_pages: number;
  results: Property[];
}

/** Response from the /markets endpoint. */
export interface MarketsResponse {
  markets: MarketInfo[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Supported market codes. */
export type RealtorMarket = "us" | "ca";

/** Listing status filter. */
export type RealtorStatus = "for_sale" | "for_rent" | "sold" | "pending";

/** Sort order for search results. */
export type RealtorSort = "relevant" | "newest" | "price_low" | "price_high" | "photo_count";

/** Options for the search endpoint. */
export interface RealtorSearchOptions {
  /** Market (default: "us") */
  market?: RealtorMarket;
  /** Listing status (default: "for_sale") */
  status?: RealtorStatus;
  /** Minimum list price */
  priceMin?: number;
  /** Maximum list price */
  priceMax?: number;
  /** Minimum bedrooms */
  bedsMin?: number;
  /** Minimum bathrooms */
  bathsMin?: number;
  /** Minimum square footage (US) */
  sqftMin?: number;
  /** Maximum square footage (US) */
  sqftMax?: number;
  /** Property type (US, CSV: single_family,condos,townhomes,multi_family,mobile,land) */
  propertyType?: string;
  /** Sort order */
  sort?: RealtorSort;
  /** Page number (default: 1) */
  page?: number;
  /** Results per page (1-200) */
  limit?: number;
  /** Bounding box min latitude (CA power-user) */
  latMin?: number;
  /** Bounding box max latitude (CA power-user) */
  latMax?: number;
  /** Bounding box min longitude (CA power-user) */
  lngMin?: number;
  /** Bounding box max longitude (CA power-user) */
  lngMax?: number;
}

/** Options for the autocomplete endpoint. */
export interface RealtorAutocompleteOptions {
  /** Market (default: "us") */
  market?: RealtorMarket;
  /** Max suggestions (1-25, default: 10) */
  limit?: number;
}

/** Options for the property detail endpoint. */
export interface RealtorPropertyOptions {
  /** Market (default: "us") */
  market?: RealtorMarket;
}
