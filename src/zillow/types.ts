/**
 * TypeScript types for Zillow API responses.
 *
 * These interfaces mirror the backend `zillow_scraper` response schema
 * field-for-field. Backend keys are snake_case (e.g. `home_status`,
 * `price_history`, `home_facts`, `scraped_at`) and are kept snake_case here to
 * match the JSON exactly. Most model fields are optional and nullable
 * (`field?: type | null`); list fields default to `[]` on the backend and are
 * typed as arrays. Every datetime field ships in BOTH `*_utc` (Unix float
 * seconds) and `*_at` (ISO-8601 Z string) form.
 *
 * Zillow is a single-domain, single-locale target (zillow.com, USD, en-US);
 * US + Canadian inventory are both served from zillow.com behind a US IP, so
 * there is no market/currency dimension on the models.
 */

// =============================================================================
// Shared Types
// =============================================================================

/** A lat/lon coordinate pair. */
export interface LatLong {
  latitude?: number | null;
  longitude?: number | null;
}

/** A single listing photo with its responsive source variants. */
export interface Photo {
  url?: string | null;
  caption?: string | null;
  subject_type?: string | null;
  /** Responsive variants: [{ url, width, format: "jpeg" | "webp" }] */
  sources?: Record<string, unknown>[];
}

/** Page-number pagination (Zillow search returns ~40 results per page). */
export interface Pagination {
  current_page?: number;
  per_page?: number | null;
  total_pages?: number | null;
  total_results?: number | null;
}

/**
 * The map bounding box a search covers — callers tile with this to beat
 * Zillow's ~820-result (20-page) cap by subdividing dense boxes.
 */
export interface MapBounds {
  north?: number | null;
  east?: number | null;
  south?: number | null;
  west?: number | null;
}

/** The numeric region Zillow resolved a search location to. */
export interface RegionSelection {
  region_id?: number | null;
  region_type?: number | null;
}

/** A linked nearby region (city / neighborhood / zip) on a property page. */
export interface NearbyRegion {
  name?: string | null;
  region_type?: string | null;
  url?: string | null;
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

/**
 * One Zillow search card (search / agent listings).
 *
 * Merges the search `listResult` top-level with its richer
 * `hdpData.homeInfo` sub-object.
 */
export interface Listing {
  position: number;
  zpid?: string | null;
  id?: string | null;
  detail_url?: string | null;
  // Status / type
  home_type?: string | null;
  home_status?: string | null;
  status_text?: string | null;
  status_type?: string | null;
  marketing_status?: string | null;
  contingent_listing_type?: string | null;
  // Price / valuation
  price?: number | null;
  price_raw?: string | null;
  currency?: string | null;
  price_change?: number | null;
  date_price_changed_utc?: number | null;
  date_price_changed_at?: string | null;
  price_reduction?: string | null;
  flex_field_text?: string | null;
  zestimate?: number | null;
  rent_zestimate?: number | null;
  tax_assessed_value?: number | null;
  // Specs
  beds?: number | null;
  baths?: number | null;
  living_area?: number | null;
  lot_area_value?: number | null;
  lot_area_unit?: string | null;
  // Address
  address?: string | null;
  street_address?: string | null;
  unit?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  country?: string | null;
  is_undisclosed_address?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  // Listing meta
  broker_name?: string | null;
  provider_listing_id?: string | null;
  days_on_zillow?: number | null;
  is_zillow_owned?: boolean | null;
  is_featured?: boolean | null;
  is_showcase?: boolean | null;
  is_fsba?: boolean | null;
  is_new_construction?: boolean | null;
  is_premier_builder?: boolean | null;
  is_preforeclosure_auction?: boolean | null;
  is_non_owner_occupied?: boolean | null;
  // Media
  img_src?: string | null;
  has_image?: boolean | null;
  has_video?: boolean | null;
  has_3d_model?: boolean | null;
  has_open_house?: boolean | null;
  open_house_start?: string | null;
  open_house_end?: string | null;
  photos?: string[];
}

// =============================================================================
// Property detail nested
// =============================================================================

/** A property's structured address. */
export interface Address {
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  community?: string | null;
  subdivision?: string | null;
  neighborhood?: string | null;
}

/** `listingSubType` flags — the for-sale / foreclosure / auction taxonomy. */
export interface ListingSubType {
  is_fsba?: boolean | null;
  is_fsbo?: boolean | null;
  is_foreclosure?: boolean | null;
  is_bank_owned?: boolean | null;
  is_for_auction?: boolean | null;
  is_coming_soon?: boolean | null;
  is_new_home?: boolean | null;
  is_pending?: boolean | null;
}

/** A scheduled open house. */
export interface OpenHouse {
  start_utc?: number | null;
  start_at?: string | null;
  end_utc?: number | null;
  end_at?: string | null;
  note?: string | null;
}

/** One point in the Zestimate value history series (`homeValueChartData`). */
export interface ZestimateHistoryPoint {
  date?: string | null;
  date_utc?: number | null;
  date_at?: string | null;
  value?: number | null;
}

/** A single price-history event (listed, price change, sold, etc.). */
export interface PriceHistoryEvent {
  date?: string | null;
  date_utc?: number | null;
  date_at?: string | null;
  event?: string | null;
  price?: number | null;
  price_per_square_foot?: number | null;
  price_change_rate?: number | null;
  source?: string | null;
  buyer_agent?: string | null;
  seller_agent?: string | null;
  posting_is_rental?: boolean | null;
}

/** A single year's tax + assessment record. */
export interface TaxHistoryEvent {
  year_utc?: number | null;
  year_at?: string | null;
  value?: number | null;
  value_increase_rate?: number | null;
  tax_paid?: number | null;
  tax_increase_rate?: number | null;
}

/** A nearby / assigned school. */
export interface School {
  name?: string | null;
  rating?: number | null;
  grades?: string | null;
  level?: string | null;
  type?: string | null;
  distance?: number | null;
  link?: string | null;
  student_count?: number | null;
  assigned?: boolean | null;
}

/** Listing agent / broker attribution (from `attributionInfo`). */
export interface AgentAttribution {
  agent_name?: string | null;
  agent_phone?: string | null;
  agent_email?: string | null;
  agent_license_number?: string | null;
  co_agent_name?: string | null;
  co_agent_number?: string | null;
  co_agent_license_number?: string | null;
  broker_name?: string | null;
  broker_phone?: string | null;
  buyer_agent_name?: string | null;
  buyer_brokerage_name?: string | null;
  mls_id?: string | null;
  mls_name?: string | null;
  mls_disclaimer?: string | null;
  listing_agreement?: string | null;
  listing_attribution_contact?: string | null;
  provider_logo?: string | null;
  true_status?: string | null;
  last_checked?: string | null;
  last_updated?: string | null;
  listing_agents?: Record<string, unknown>[];
  listing_offices?: Record<string, unknown>[];
}

/** A single mortgage rate quote. */
export interface MortgageRate {
  rate?: number | null;
  rate_source?: string | null;
  last_updated_utc?: number | null;
  last_updated_at?: string | null;
}

/** Current mortgage rates surfaced on the property page. */
export interface MortgageRates {
  fifteen_year_fixed?: MortgageRate | null;
  thirty_year_fixed?: MortgageRate | null;
  arm_5?: MortgageRate | null;
}

/**
 * High-value subset of Zillow's `resoFacts` MLS block.
 *
 * resoFacts carries ~187 keys; these are the ones competitors surface and
 * callers actually query.
 */
export interface HomeFacts {
  // Bath breakdown
  bathrooms_full?: number | null;
  bathrooms_half?: number | null;
  bathrooms_three_quarter?: number | null;
  bathrooms_one_quarter?: number | null;
  // Structure
  stories?: number | null;
  stories_decimal?: number | null;
  levels?: string | null;
  property_condition?: string | null;
  architectural_style?: string | null;
  structure_type?: string | null;
  building_name?: string | null;
  construction_materials?: string[];
  foundation_details?: string[];
  roof_type?: string | null;
  year_built_effective?: number | null;
  // Area breakdown
  above_grade_finished_area?: string | null;
  below_grade_finished_area?: string | null;
  lot_size_dimensions?: string | null;
  main_level_bedrooms?: number | null;
  main_level_bathrooms?: number | null;
  basement?: string | null;
  has_basement?: boolean | null;
  attic?: string | null;
  // Systems
  heating?: string[];
  cooling?: string[];
  appliances?: string[];
  flooring?: string[];
  utilities?: string[];
  electric?: string[];
  gas?: string[];
  sewer?: string[];
  water_source?: string[];
  // Green / energy
  green_building_verification_type?: string[];
  green_energy_efficient?: string[];
  green_energy_generation?: string[];
  green_sustainability?: string[];
  green_water_conservation?: string[];
  // Features
  interior_features?: string[];
  exterior_features?: string[];
  lot_features?: string[];
  community_features?: string[];
  accessibility_features?: string[];
  door_features?: string[];
  window_features?: string[];
  laundry_features?: string[];
  patio_and_porch_features?: string[];
  fencing?: string[];
  other_structures?: string[];
  view?: string[];
  has_view?: boolean | null;
  waterfront_features?: string[];
  water_view?: string | null;
  water_body_name?: string | null;
  security_features?: string[];
  // Parking
  parking_features?: string[];
  parking_capacity?: number | null;
  garage_parking_capacity?: number | null;
  carport_parking_capacity?: number | null;
  covered_parking_capacity?: number | null;
  open_parking_capacity?: number | null;
  has_attached_garage?: boolean | null;
  has_garage?: boolean | null;
  has_carport?: boolean | null;
  has_open_parking?: boolean | null;
  // Amenities
  pool_features?: string[];
  has_private_pool?: boolean | null;
  spa_features?: string[];
  fireplaces?: number | null;
  fireplace_features?: string[];
  has_fireplace?: boolean | null;
  // HOA / fees / tax
  association_name?: string | null;
  association_name2?: string | null;
  association_fee?: string | null;
  association_fee2?: string | null;
  association_fee_includes?: string[];
  association_amenities?: string[];
  association_phone?: string | null;
  has_association?: boolean | null;
  hoa_fee?: string | null;
  hoa_fee_total?: string | null;
  tax_annual_amount?: number | null;
  price_per_square_foot?: number | null;
  // Land / lease
  has_land_lease?: boolean | null;
  land_lease_amount?: string | null;
  land_lease_expiration_date?: string | null;
  can_raise_horses?: boolean | null;
  additional_parcels_description?: string | null;
  road_surface_type?: string[];
  // Market timing
  on_market_date?: string | null;
  cumulative_days_on_market?: number | null;
  offer_review_date?: string | null;
  // Rental / multi-unit
  number_of_units_in_community?: number | null;
  availability_date?: string | null;
  lease_term?: string | null;
  tenant_pays?: string[];
  has_pets_allowed?: boolean | null;
  pets_max_weight?: number | null;
  has_rent_control?: boolean | null;
  // Schools (as named on the MLS record)
  elementary_school?: string | null;
  middle_school?: string | null;
  high_school?: string | null;
  elementary_school_district?: string | null;
  middle_school_district?: string | null;
  high_school_district?: string | null;
  // Parcel / legal
  parcel_number?: string | null;
  subdivision_name?: string | null;
  municipality?: string | null;
  city_region?: string | null;
  zoning?: string | null;
  zoning_description?: string | null;
  ownership?: string | null;
  ownership_type?: string | null;
  property_sub_type?: string[];
  special_listing_conditions?: string | null;
  listing_terms?: string | null;
  inclusions?: string | null;
  exclusions?: string | null;
  // Flags
  is_new_construction?: boolean | null;
  is_senior_community?: boolean | null;
  has_home_warranty?: boolean | null;
  furnished?: boolean | null;
  development_status?: string | null;
  park_name?: string | null;
  // Bulk fact lists Zillow ships verbatim (label/value pairs)
  at_a_glance_facts?: Record<string, unknown>[];
  rooms?: Record<string, unknown>[];
}

/** Full Zillow property detail (from `gdpClientCache[...].property`). */
export interface Property {
  // Identity
  zpid: string;
  id?: string | null;
  url?: string | null;
  home_status?: string | null;
  home_type?: string | null;
  property_type?: string | null;
  listing_type?: string | null;
  posting_product_type?: string | null;
  listing_data_source?: string | null;
  mls_id?: string | null;
  parcel_id?: string | null;
  county_fips?: string | null;
  provider_listing_id?: string | null;
  broker_id?: string | null;
  contingent_listing_type?: string | null;
  listing_sub_type?: ListingSubType | null;
  // Price / valuation
  price?: number | null;
  currency?: string | null;
  list_price_low?: number | null;
  monthly_hoa_fee?: number | null;
  property_tax_rate?: number | null;
  annual_homeowners_insurance?: number | null;
  last_sold_price?: number | null;
  date_sold_utc?: number | null;
  date_sold_at?: string | null;
  price_change?: number | null;
  price_change_date_utc?: number | null;
  price_change_date_at?: string | null;
  zestimate?: number | null;
  rent_zestimate?: number | null;
  zestimate_low_percent?: string | null;
  zestimate_high_percent?: string | null;
  rent_zestimate_low_percent?: string | null;
  rent_zestimate_high_percent?: string | null;
  zestimate_30_days_ago?: number | null;
  rent_zestimate_30_days_ago?: number | null;
  tax_assessed_value?: number | null;
  zestimate_history?: ZestimateHistoryPoint[];
  // Specs
  bedrooms?: number | null;
  bathrooms?: number | null;
  living_area?: number | null;
  living_area_units?: string | null;
  lot_size?: number | null;
  lot_area_value?: number | null;
  lot_area_units?: string | null;
  year_built?: number | null;
  move_in_ready?: boolean | null;
  move_in_completion_date?: string | null;
  // Location
  latitude?: number | null;
  longitude?: number | null;
  street_address?: string | null;
  abbreviated_address?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  county?: string | null;
  country?: string | null;
  time_zone?: string | null;
  neighborhood?: string | null;
  is_undisclosed_address?: boolean | null;
  is_income_restricted?: boolean | null;
  // Engagement
  days_on_zillow?: number | null;
  time_on_zillow?: string | null;
  page_view_count?: number | null;
  favorite_count?: number | null;
  tour_view_count?: number | null;
  photo_count?: number | null;
  // Content
  description?: string | null;
  what_i_love?: string | null;
  home_insights?: string[];
  marketing_name?: string | null;
  brokerage_name?: string | null;
  is_showcase_listing?: boolean | null;
  has_vr_model?: boolean | null;
  has_3d_model?: boolean | null;
  virtual_tour_url?: string | null;
  interactive_floor_plan_url?: string | null;
  street_view_image_url?: string | null;
  static_map_url?: string | null;
  new_construction_type?: string | null;
  builder_name?: string | null;
  promotion_headline?: string | null;
  promotion_description?: string | null;
  has_promotion?: boolean | null;
  // Nested
  address?: Address | null;
  home_facts?: HomeFacts | null;
  agent?: AgentAttribution | null;
  mortgage_rates?: MortgageRates | null;
  price_history?: PriceHistoryEvent[];
  tax_history?: TaxHistoryEvent[];
  schools?: School[];
  photos?: Photo[];
  open_house_schedule?: OpenHouse[];
  nearby_cities?: NearbyRegion[];
  nearby_neighborhoods?: NearbyRegion[];
  nearby_zipcodes?: NearbyRegion[];
  /** nearby_homes / comps are lazy-loaded client-side (usually empty in SSR). */
  nearby_homes?: Listing[];
  // Timestamps
  scraped_utc?: number | null;
  scraped_at?: string | null;
}

// =============================================================================
// Agent profile
// =============================================================================

/** One review on a Zillow agent profile (from `reviewsData.reviews`). */
export interface AgentReview {
  rating?: number | null;
  comment?: string | null;
  date?: string | null;
  date_utc?: number | null;
  date_at?: string | null;
  work_description?: string | null;
  reviewer_name?: string | null;
  rebuttal?: string | null;
  /** [{ description: "Responsiveness", score: 5 }, …] */
  sub_ratings?: Record<string, unknown>[];
}

/** A closed transaction from an agent's `pastSales` block. */
export interface PastSale {
  zpid?: string | null;
  street_address?: string | null;
  city_state_zip?: string | null;
  price?: number | null;
  sold_date?: string | null;
  sold_date_utc?: number | null;
  sold_date_at?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  living_area?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  represented?: string | null;
  image_url?: string | null;
  url?: string | null;
}

/** A professional license held by an agent. */
export interface AgentLicense {
  state?: string | null;
  license_type?: string | null;
  license_number?: string | null;
  status?: string | null;
  expiration?: string | null;
}

/** A Zillow real-estate professional profile (from /profile/{username}). */
export interface Agent {
  username?: string | null;
  encoded_zuid?: string | null;
  name?: string | null;
  url?: string | null;
  profile_photo?: string | null;
  phone?: string | null;
  email?: string | null;
  business_name?: string | null;
  business_address?: string | null;
  broker_name?: string | null;
  title?: string | null;
  bio?: string | null;
  rating?: number | null;
  review_count?: number | null;
  recent_sales_count?: number | null;
  total_sales_last_year?: number | null;
  for_sale_count?: number | null;
  for_rent_count?: number | null;
  past_sales_count?: number | null;
  years_experience?: number | null;
  is_top_agent?: boolean | null;
  is_team_lead?: boolean | null;
  license_number?: string | null;
  license_state?: string | null;
  // Social / web
  website_url?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  x_url?: string | null;
  video_url?: string | null;
  specialties?: string[];
  service_areas?: string[];
  languages?: string[];
  licenses?: AgentLicense[];
  professional_information?: Record<string, unknown>[];
  reviews?: AgentReview[];
  past_sales?: PastSale[];
  listings?: Listing[];
  scraped_utc?: number | null;
  scraped_at?: string | null;
}

// =============================================================================
// Autocomplete
// =============================================================================

/** A region/address suggestion resolved for a search term. */
export interface AutocompleteResult {
  display?: string | null;
  region_id?: number | null;
  region_type?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  /** Populated when the suggestion is a specific home. */
  zpid?: string | null;
  metro_id?: number | null;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** Response from the /search endpoint. */
export interface SearchResponse {
  location?: string | null;
  status: string;
  results: Listing[];
  map_results_count: number;
  region?: RegionSelection | null;
  map_bounds?: MapBounds | null;
  pagination: Pagination;
  scraped_utc?: number | null;
  scraped_at?: string | null;
}

/** Response from the /property endpoints. */
export interface PropertyResponse {
  property: Property;
}

/** Response from the /agent endpoint. */
export interface AgentResponse {
  agent: Agent;
}

/** Response from the /autocomplete endpoint. */
export interface AutocompleteResponse {
  query: string;
  results: AutocompleteResult[];
}

/** Response from the /markets endpoint. */
export interface MarketsResponse {
  markets: MarketInfo[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Listing status filter. */
export type ZillowStatus = "for_sale" | "for_rent" | "sold";

/** Sort order for search results. */
export type ZillowSort =
  | "homes_for_you"
  | "newest"
  | "price_high_to_low"
  | "price_low_to_high"
  | "bedrooms"
  | "bathrooms"
  | "square_feet"
  | "lot_size"
  | "year_built";

/** Options for the search endpoint. */
export interface ZillowSearchOptions {
  /** Listing status (default: "for_sale") */
  status?: ZillowStatus;
  /** Page number, 1-20 (Zillow caps search at 20 pages / ~820 results) */
  page?: number;
  /** Sort order */
  sort?: ZillowSort;
  /** Minimum price */
  priceMin?: number;
  /** Maximum price */
  priceMax?: number;
  /** Minimum bedrooms (0-10) */
  bedsMin?: number;
  /** Minimum bathrooms (0-10) */
  bathsMin?: number;
  /** Home type (houses|condos|townhomes|apartments|manufactured|lots|multi_family) */
  homeType?: string;
  /** Minimum living area (sqft) */
  sqftMin?: number;
  /** Maximum living area (sqft) */
  sqftMax?: number;
  /** Minimum lot size (sqft) */
  lotMin?: number;
  /** Maximum lot size (sqft) */
  lotMax?: number;
  /** Minimum year built */
  yearBuiltMin?: number;
  /** Maximum year built */
  yearBuiltMax?: number;
  /** Max monthly HOA */
  hoaMax?: number;
  /** Match listing description keywords */
  keywords?: string;
  /** Days on Zillow filter (e.g. "1", "7", "30") */
  daysOn?: string;
  /** Map bounds north latitude (for tiling past the 820 cap) */
  north?: number;
  /** Map bounds south latitude */
  south?: number;
  /** Map bounds east longitude */
  east?: number;
  /** Map bounds west longitude */
  west?: number;
}

/** Options for the agent endpoint. Provide a `username` or a `url`. */
export interface ZillowAgentOptions {
  /** Zillow profile username (screen name) */
  username?: string;
  /** Full Zillow /profile/... URL */
  url?: string;
}
