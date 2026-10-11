/**
 * TypeScript types for the Gumtree API.
 *
 * These interfaces mirror the backend `gumtree_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 *
 * Gumtree is UK-only (gumtree.com), so there is no market or country
 * parameter anywhere in this module. Prices are in GBP. Every datetime ships
 * in BOTH forms: `*_utc` (Unix seconds) and `*_at` (ISO 8601 UTC string).
 * Phone numbers are only ever the MASKED form Gumtree shows a logged-out
 * visitor.
 */

// =============================================================================
// Shared value objects
// =============================================================================

/** One listing attribute — e.g. `vehicle_mileage` = `117628`. */
export interface GumtreeAttribute {
  key: string;
  label: string | null;
  value: string | null;
  unit: string | null;
}

/** A category reference attached to an autocomplete suggestion. */
export interface GumtreeCategoryRef {
  id: number | null;
  name: string | null;
  slug: string | null;
}

/** One step of a listing's category breadcrumb trail. */
export interface GumtreeBreadcrumb {
  name: string | null;
  url: string | null;
}

/** A listing as it appears on a search / seller / similar-listings grid. */
export interface GumtreeListingSummary {
  id: string;
  title: string | null;
  url: string | null;
  /** Gumtree's short description. */
  description: string | null;
  /** Numeric price in GBP. */
  price: number | null;
  /** Price as shown, e.g. `"£1,850.00pm"`. */
  price_text: string | null;
  /** `pm` / `pw` for rentals. */
  price_frequency: string | null;
  currency: string;
  location: string | null;
  location_id: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  /** e.g. `"13 miles"` from the search location. */
  distance_text: string | null;
  distance_miles: number | null;
  category_id: number | null;
  category_name: string | null;
  /** Root-to-leaf category ids. */
  category_ids: number[];
  image_url: string | null;
  image_urls: string[];
  image_count: number | null;
  /** Relative age as shown, e.g. `"3 days ago"`. */
  posted_text: string | null;
  posted_utc: number | null;
  posted_at: string | null;
  status: string | null;
  /** Private / Trade / Agency. */
  seller_type: string | null;
  seller_id: string | null;
  account_id: string | null;
  is_pro_seller: boolean | null;
  /** Paid top-slot ad. */
  is_featured: boolean | null;
  is_urgent: boolean | null;
  is_bumped_up: boolean | null;
  is_standout: boolean | null;
  is_premium: boolean | null;
  has_video: boolean | null;
  supports_shipping: boolean | null;
  favourite_count: number | null;
  /** Services listings only. */
  seller_skills: string[];
  attributes: GumtreeAttribute[];
}

// =============================================================================
// Search
// =============================================================================

/** A sub-category of a result set, with its listing count. */
export interface GumtreeCategoryFacet {
  name: string | null;
  slug: string | null;
  count: number | null;
}

/** Response from `GET /v1/gumtree/search`. */
export interface GumtreeSearchResponse {
  query: string | null;
  /** Category slug the search ran in. */
  category: string | null;
  category_name: string | null;
  category_id: number | null;
  /** Location slug / postcode searched. */
  location: string | null;
  location_name: string | null;
  distance: number | null;
  sort: string | null;
  page: number;
  total_pages: number | null;
  total_results: number | null;
  result_count: number;
  listings: GumtreeListingSummary[];
  /** Sub-categories of the result set, with counts. */
  category_facets: GumtreeCategoryFacet[];
  url: string | null;
}

/** One selectable value of a search filter, with its live result count. */
export interface GumtreeFilterOption {
  label: string | null;
  value: string | null;
  count: number | null;
}

/** One filter Gumtree offers for the category, as `filters: "key:value"` input. */
export interface GumtreeSearchFilter {
  key: string;
  label: string | null;
  /** enum / multiple_selection / enum_range / range_freeform / boolean. */
  type: string | null;
  /** Range filters: the lower-bound key. */
  min_key: string | null;
  /** Range filters: the upper-bound key. */
  max_key: string | null;
  options: GumtreeFilterOption[];
  min_options: GumtreeFilterOption[];
  max_options: GumtreeFilterOption[];
}

/** A sort order Gumtree offers for the category. */
export interface GumtreeSortOption {
  value: string;
  label: string | null;
}

/** Response from `GET /v1/gumtree/search/filters`. */
export interface GumtreeFiltersResponse {
  category: string | null;
  category_name: string | null;
  total_results: number | null;
  filters: GumtreeSearchFilter[];
  sort_options: GumtreeSortOption[];
  /** Radius values in miles. */
  distance_options: number[];
  category_facets: GumtreeCategoryFacet[];
}

// =============================================================================
// Listing detail
// =============================================================================

/** Seller star rating with a per-star breakdown (`"1"`..`"5"`). */
export interface GumtreeSellerRating {
  average: number | null;
  total: number | null;
  breakdown: Record<string, number>;
}

/** Gumtree's business-verification status and the checks it passed. */
export interface GumtreeSellerVerification {
  status: string | null;
  label: string | null;
  checks: string[];
}

/** The seller of a listing. */
export interface GumtreeSeller {
  name: string | null;
  user_id: string | null;
  public_id: string | null;
  /** Private / Trade / Agency. */
  type: string | null;
  is_pro: boolean | null;
  /** e.g. `"6+ years"`. */
  posting_since: string | null;
  last_active_utc: number | null;
  last_active_at: string | null;
  total_listings: number | null;
  listings_last_year: number | null;
  listings_by_category: Record<string, number>;
  reply_speed: string | null;
  reply_rate: string | null;
  rating: GumtreeSellerRating | null;
  verification: GumtreeSellerVerification | null;
  /** e.g. `"0794997XXXX"`. */
  phone_masked: string | null;
  website_url: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  badges: string[];
}

/** Response from `GET /v1/gumtree/listings/{listing_id}`. */
export interface GumtreeListingDetail {
  id: string;
  title: string | null;
  url: string | null;
  description: string | null;
  price: number | null;
  price_text: string | null;
  price_frequency: string | null;
  currency: string;
  /** Motors trade listings: `"Inc VAT"` / `"No VAT"`. */
  vat: string | null;
  location: string | null;
  area: string | null;
  sub_area: string | null;
  location_id: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  category_id: number | null;
  category_name: string | null;
  category_ids: number[];
  breadcrumbs: GumtreeBreadcrumb[];
  image_urls: string[];
  video_urls: string[];
  posted_text: string | null;
  /** Last (re)posted — moves on a bump. */
  posted_utc: number | null;
  posted_at: string | null;
  /** When the ad was first created. */
  created_utc: number | null;
  created_at: string | null;
  updated_utc: number | null;
  updated_at: string | null;
  /** Date the ad is valid through (YYYY-MM-DD). */
  expires_at: string | null;
  is_featured: boolean | null;
  is_urgent: boolean | null;
  is_bumped_up: boolean | null;
  is_standout: boolean | null;
  favourite_count: number | null;
  /** Motors: Gumtree's vehicle history check ran on this car. */
  vehicle_history_checked: boolean | null;
  attributes: GumtreeAttribute[];
  seller: GumtreeSeller | null;
  /** Services listings only. */
  seller_skills: string[];
  seller_listings_url: string | null;
  similar_listings: GumtreeListingSummary[];
}

// =============================================================================
// Seller listings
// =============================================================================

/** Response from `GET /v1/gumtree/listings/{listing_id}/seller-listings`. */
export interface GumtreeSellerListingsResponse {
  listing_id: string;
  seller_name: string | null;
  total_results: number | null;
  page: number;
  total_pages: number | null;
  result_count: number;
  listings: GumtreeListingSummary[];
}

// =============================================================================
// Reference data
// =============================================================================

/** One search-box keyword suggestion. */
export interface GumtreeSuggestion {
  query: string;
  highlighted: string | null;
  /** Category path Gumtree attaches to the suggestion. */
  categories: GumtreeCategoryRef[];
}

/** Response from `GET /v1/gumtree/autocomplete`. */
export interface GumtreeAutocompleteResponse {
  query: string;
  result_count: number;
  suggestions: GumtreeSuggestion[];
}

/** A Gumtree location matched by name or postcode prefix. */
export interface GumtreeLocationSuggestion {
  id: number | null;
  name: string | null;
  /** location / outcode / postcode. */
  type: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** Response from `GET /v1/gumtree/locations/autocomplete`. */
export interface GumtreeLocationAutocompleteResponse {
  query: string;
  result_count: number;
  locations: GumtreeLocationSuggestion[];
}

/** A category or location node. `slug` is what `search` takes. */
export interface GumtreeTreeNode {
  id: number;
  name: string | null;
  slug: string | null;
  has_children: boolean | null;
}

/** Response from `GET /v1/gumtree/categories` and `GET /v1/gumtree/locations`. */
export interface GumtreeTreeResponse {
  id: number;
  name: string | null;
  slug: string | null;
  result_count: number;
  children: GumtreeTreeNode[];
}

// =============================================================================
// Request params
// =============================================================================

/** Result ordering for {@link GumtreeSearchParams.sort}. */
export type GumtreeSort = "relevance" | "date" | "price_asc" | "price_desc" | "distance";

/** Seller type filter. `"trade"` covers dealers, agencies and recruiters. */
export type GumtreeSellerType = "private" | "trade";

/** Parameters for `GET /v1/gumtree/search`. All optional. */
export interface GumtreeSearchParams {
  /** Search keywords, e.g. `"mountain bike"`. */
  query?: string;
  /**
   * Category slug, e.g. `"cars"`, `"for-sale"`, `"property-to-rent"`, `"jobs"`,
   * `"bicycles"`. Browse the tree with `listCategories`. Default `"all"`.
   */
  category?: string;
  /**
   * Location slug (`"london"`), town name or UK postcode (`"SW1A 1AA"`).
   * Resolve one with `locationAutocomplete`. Default `"uk"` (nationwide).
   */
  location?: string;
  /** Radius in miles around `location` (>0, max 1000). */
  distance?: number;
  /** Minimum price in GBP. Needs a category other than `"all"`. */
  min_price?: number;
  /** Maximum price in GBP. Needs a category other than `"all"`. */
  max_price?: number;
  /** Result ordering (default relevance). */
  sort?: GumtreeSort;
  seller_type?: GumtreeSellerType;
  /** Only ads marked urgent. */
  urgent_only?: boolean;
  /** Only ads with photos. */
  with_photos?: boolean;
  /**
   * Category-specific filters as comma-separated `key:value` pairs, e.g.
   * `"vehicle_make:bmw,vehicle_fuel_type:petrol,min_vehicle_mileage:10000"`.
   * Repeat a key to select several values. Discover keys with `searchFilters`.
   */
  filters?: string;
  /** Page number, 1-50. */
  page?: number;
}

/** Parameters for `GET /v1/gumtree/search/filters`. All optional. */
export interface GumtreeSearchFiltersParams {
  /** Category slug. Default `"all"`. */
  category?: string;
  /** Location slug, town or UK postcode. Default `"uk"`. */
  location?: string;
  /** Optional keywords to scope the counts. */
  query?: string;
}
