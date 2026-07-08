/**
 * TypeScript types for LoopNet API responses.
 *
 * These interfaces mirror the backend `loopnet_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 * Every datetime field ships in BOTH `*_utc` (number) and `*_at` (string) form.
 *
 * LoopNet is multi-market (us/ca/uk/fr/es); every search response carries
 * `market` + `currency` so a caller can tell CAD from GBP.
 */

// =============================================================================
// Shared Types
// =============================================================================

/** A LoopNet broker/agent attributed to a listing or profile. */
export interface Broker {
  name: string | null;
  company: string | null;
  title: string | null;
  phone: string | null;
  email: string | null;
  photo: string | null;
  url: string | null;
  broker_id: string | null;
  city: string | null;
  region: string | null;
}

/** One leasable space / unit within a listing (lease listings). */
export interface Space {
  name: string | null;
  space_use: string | null;
  size_sqft: number | null;
  size_text: string | null;
  rent_text: string | null;
  rent_per_sqft: number | null;
  /** "/SF/YR", "/SF/MO", "/MO" */
  rent_period: string | null;
  term: string | null;
  condition: string | null;
  available_date: string | null;
  floor: string | null;
}

/** A supported coverage market (for /markets). */
export interface MarketInfo {
  code: string;
  domain: string;
  country: string;
  currency: string;
  locale: string;
  name: string;
}

/** A LoopNet property-type facet (for /property-types). */
export interface PropertyTypeInfo {
  slug: string;
  name: string;
}

/** Page-number pagination (LoopNet returns ~25 cards per page, caps ~500). */
export interface Pagination {
  current_page: number;
  per_page: number | null;
  total_pages: number | null;
  total_results: number | null;
}

// =============================================================================
// Search results
// =============================================================================

/** One LoopNet search result card (search / broker listings). */
export interface ListingCard {
  position: number;
  listing_id: string | null;
  property_id: string | null;
  url: string | null;
  // Taxonomy
  /** for-lease | for-sale | auction */
  listing_type: string | null;
  /** Office, Retail, Industrial … */
  property_type: string | null;
  property_type_id: string | null;
  space_use: string | null;
  status: string | null;
  status_id: string | null;
  exposure_level: string | null;
  is_auction: boolean | null;
  // Content
  title: string | null;
  subtitle: string | null;
  description: string | null;
  /** LoopNet "N Star" building rating */
  building_rating: number | null;
  year_built: number | null;
  // Price
  /** "$41.40 /SF/YR", "$2,500,000" */
  price_text: string | null;
  price: number | null;
  price_currency: string | null;
  /** "/SF/YR", "/SF/MO", null for sale */
  price_period: string | null;
  // Size
  /** "901 - 15,746 SF" */
  size_text: string | null;
  size_min_sqft: number | null;
  size_max_sqft: number | null;
  // Address
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  county: string | null;
  country: string | null;
  market_id: string | null;
  latitude: number | null;
  longitude: number | null;
  // Media / meta
  thumbnail: string | null;
  has_virtual_tour: boolean | null;
  page_rank: number | null;
  position_rank: number | null;
  brokers: Broker[];
}

// =============================================================================
// Listing detail
// =============================================================================

/** Full LoopNet listing detail (JSON-LD RealEstateListing + DOM facts). */
export interface ListingDetail {
  // Identity
  listing_id: string | null;
  property_id: string | null;
  url: string | null;
  market: string | null;
  country: string | null;
  /** for-lease | for-sale | auction */
  listing_type: string | null;
  /** "For Lease" / "For Sale" */
  transaction_type: string | null;
  // Content
  name: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  highlights: string[];
  // Price
  price_text: string | null;
  price: number | null;
  price_currency: string | null;
  price_period: string | null;
  rental_rate_text: string | null;
  cap_rate: number | null;
  noi: string | null;
  price_per_sqft: number | null;
  // Building / property facts
  property_type: string | null;
  property_sub_type: string | null;
  building_class: string | null;
  building_size_sqft: number | null;
  building_size_text: string | null;
  rentable_building_area: string | null;
  total_space_available: string | null;
  total_space_available_sqft: number | null;
  min_divisible: string | null;
  max_contiguous: string | null;
  typical_floor_size: string | null;
  building_height: string | null;
  ceiling_height: string | null;
  year_built: number | null;
  year_built_renovated: string | null;
  building_rating: number | null;
  lot_size_text: string | null;
  lot_size_acres: number | null;
  units: number | null;
  stories: number | null;
  percent_leased: string | null;
  tenancy: string | null;
  zoning: string | null;
  parcel_id: string | null;
  parking: string | null;
  walk_score: number | null;
  amenities: string[];
  // Address / geo
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  county: string | null;
  latitude: number | null;
  longitude: number | null;
  // Media
  images: string[];
  photo_count: number | null;
  videos: string[];
  documents: string[];
  has_virtual_tour: boolean | null;
  // Spaces (lease) + brokers
  spaces: Space[];
  brokers: Broker[];
  /** Every additionalProperty name/value pair LoopNet ships, verbatim */
  additional_facts: { name: string; value: string }[];
  // Timing
  date_posted_utc: number | null;
  date_posted_at: string | null;
  date_updated_utc: number | null;
  date_updated_at: string | null;
  scraped_utc: number | null;
  scraped_at: string | null;
}

// =============================================================================
// Broker profile
// =============================================================================

/** A LoopNet broker/professional profile with their listings. */
export interface BrokerProfile {
  broker_id: string | null;
  name: string | null;
  company: string | null;
  title: string | null;
  phone: string | null;
  email: string | null;
  photo: string | null;
  url: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  license_number: string | null;
  specialties: string[];
  listing_count: number | null;
  listings: ListingCard[];
  scraped_utc: number | null;
  scraped_at: string | null;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** Response from the /search endpoint. */
export interface SearchResponse {
  market: string;
  country: string;
  currency: string;
  listing_type: string;
  property_type: string | null;
  location: string | null;
  results: ListingCard[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /listings/{listing_id} endpoint. */
export interface ListingResponse {
  listing: ListingDetail;
}

/** Response from the /brokers/{slug}/{broker_id} endpoint. */
export interface BrokerResponse {
  broker: BrokerProfile;
}

/** Response from the /markets endpoint. */
export interface MarketsResponse {
  markets: MarketInfo[];
}

/** Response from the /property-types endpoint. */
export interface PropertyTypesResponse {
  property_types: PropertyTypeInfo[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Coverage market for LoopNet requests. */
export type LoopNetMarket = "us" | "ca" | "uk" | "fr" | "es";

/** Listing-type filter for listing search. */
export type LoopNetListingType = "for-lease" | "for-sale" | "auctions";

/** What min_price/max_price apply to. */
export type LoopNetPriceType = "unit" | "sf" | "acre";

/** Parameters for the listing search endpoint. */
export interface LoopNetSearchParams {
  /** Location — "Houston, TX", ZIP, state code, or "usa" (required) */
  location: string;
  /** Coverage market (default: "us") */
  market?: LoopNetMarket;
  /** Listing type (default: "for-lease") */
  listing_type?: LoopNetListingType;
  /** Property-type slug from /property-types (default: all) */
  property_type?: string;
  /** Page number (1-20; LoopNet caps ~500 results) */
  page?: number;
  /** Minimum price filter */
  min_price?: number;
  /** Maximum price filter */
  max_price?: number;
  /** What min/max price apply to */
  price_type?: LoopNetPriceType;
  /** Minimum size (square feet) */
  min_size?: number;
  /** Maximum size (square feet) */
  max_size?: number;
}
