/**
 * Apartments.com API types.
 *
 * These mirror the backend `apartments_scraper` response schema
 * field-for-field. Single market: apartments.com (US, USD, en-US).
 *
 * There are no datetime fields: availability is rendered as free text with no
 * year ("Now", "Sep 3"), so it is carried verbatim rather than converted.
 */

/** A single rentable unit within a floor plan. */
export interface Unit {
  unit_number: string | null;
  unit_key: string | null;
  rental_key: string | null;
  model_key: string | null;
  beds: number | null;
  baths: number | null;
  /** The advertised rent, from the rendered price column. Use THIS. */
  rent: number | null;
  rent_price_text: string | null;
  /**
   * Raw `data-maxrent` — measures roughly 2x the advertised rent and looks
   * like an upper bound across lease terms. Exposed unparsed; do NOT treat it
   * as the rent.
   */
  max_term_rent: number | null;
  currency: string;
  sqft: number | null;
  /** Verbatim availability, e.g. "Now", "Sep 3". No year is rendered. */
  available_text: string | null;
  model_name: string | null;
  photo_count: number;
  video_count: number;
  floorplan_count: number;
  virtual_tour_count: number;
  apply_now_url: string | null;
}

/** A floor-plan model, grouping zero or more units. */
export interface FloorPlan {
  name: string | null;
  model_key: string | null;
  rental_key: string | null;
  beds: number | null;
  baths: number | null;
  price_text: string | null;
  rent_min: number | null;
  rent_max: number | null;
  summary_text: string | null;
  sqft_min: number | null;
  sqft_max: number | null;
  units: Unit[];
  /**
   * 0 on properties whose layout lists plans without individual units — that
   * is the site's own markup, not missing data.
   */
  units_available: number;
}

/** An apartments.com property (a complex, not a single home). */
export interface Property {
  property_id: string | null;
  url: string;
  name: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  rent_range_text: string | null;
  rent_min: number | null;
  rent_max: number | null;
  beds_text: string | null;
  description: string | null;
  amenities: string[];
  office_hours: string[];
  photos: string[];
  floor_plans: FloorPlan[];
  /** Every unit across every floor plan, flattened. */
  units: Unit[];
  total_units_available: number;
}

/**
 * One property card on a search-results page. A card is a summary carrying a
 * rent/bed rollup, not per-unit inventory — call `getProperty` with `url`.
 */
export interface SearchResult {
  property_id: string | null;
  url: string | null;
  name: string | null;
  address: string | null;
  street_address: string | null;
  country_code: string | null;
  phone: string | null;
  pricing: Array<Record<string, string>>;
  rent_min: number | null;
  beds_text: string | null;
  amenities: string[];
  is_featured: boolean;
}

/** A page of search results (40 cards per page). */
export interface SearchResponse {
  location: string;
  url: string;
  page: number;
  total_pages: number | null;
  total_results: number | null;
  results_on_page: number;
  results: SearchResult[];
}

/** Search request parameters. */
export interface ApartmentsSearchParams {
  /** 1-28. Each page holds up to 40 cards. */
  page?: number;
  /** 0 for studios, 1-4 for bedroom counts. */
  beds?: number;
  minPrice?: number;
  maxPrice?: number;
}

/** Property lookup by slug + id (alternative to a full URL). */
export interface ApartmentsPropertyParams {
  slug?: string;
  propertyId?: string;
}
