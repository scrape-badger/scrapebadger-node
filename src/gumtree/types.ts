/**
 * TypeScript types for the Gumtree API.
 *
 * These interfaces mirror the backend `gumtree_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 *
 * Three markets share these types: `uk` (gumtree.com, GBP), `au`
 * (gumtree.com.au, AUD) and `za` (gumtree.co.za, ZAR). They are separate
 * platforms, so a field one market does not publish is simply `null` there.
 * Every top-level response carries the `market` it came from. Every datetime
 * ships in BOTH forms: `*_utc` (Unix seconds) and `*_at` (ISO 8601 UTC string).
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
  /** za: the 10-digit id Gumtree shows (the `id` is the full ad id). */
  short_id: string | null;
  title: string | null;
  url: string | null;
  /** Gumtree's short description. */
  description: string | null;
  /** Numeric price in `currency`. */
  price: number | null;
  /** Price as shown, e.g. `"£1,850.00pm"`. */
  price_text: string | null;
  /** `pm` / `pw` for rentals. */
  price_frequency: string | null;
  /** au/za: `FIXED`, `NEGOTIABLE` / `MAKE_OFFER`, `FREE`, `SWAP_TRADE`… */
  price_type: string | null;
  currency: string;
  location: string | null;
  location_id: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  /** e.g. `"13 miles"` (uk) or `"4 km"` (au) from the search location. */
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
  seller_name: string | null;
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
  /** au/za: the category id `search` takes. */
  id: number | null;
  name: string | null;
  slug: string | null;
  count: number | null;
}

/** Response from `GET /v1/gumtree/search`. */
export interface GumtreeSearchResponse {
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
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
  /** Currency of every price in the results, e.g. `"GBP"`. */
  currency: string;
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
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
  category: string | null;
  category_name: string | null;
  total_results: number | null;
  filters: GumtreeSearchFilter[];
  sort_options: GumtreeSortOption[];
  /** Radius values: miles (uk) or km (au). */
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
  /** au: year the account opened. */
  member_since_year: number | null;
  /** au: e.g. `"yesterday"`. */
  last_active_text: string | null;
  last_active_utc: number | null;
  last_active_at: string | null;
  /** Live listings right now. */
  total_listings: number | null;
  /** za: ads ever posted. */
  lifetime_listings: number | null;
  /** za: views across all their ads. */
  total_views: number | null;
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
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
  id: string;
  title: string | null;
  url: string | null;
  description: string | null;
  price: number | null;
  price_text: string | null;
  price_frequency: string | null;
  /** au/za: `FIXED`, `NEGOTIABLE` / `MAKE_OFFER`, `FREE`, `SWAP_TRADE`… */
  price_type: string | null;
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
  status: string | null;
  /** au/za: views of this ad. */
  view_count: number | null;
  /** au: replies to this ad. */
  reply_count: number | null;
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
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
  listing_id: string;
  seller_name: string | null;
  total_results: number | null;
  page: number;
  total_pages: number | null;
  /** `za`: another page follows (the site gives no total upfront). `null` elsewhere. */
  has_next?: boolean | null;
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
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
  query: string;
  result_count: number;
  suggestions: GumtreeSuggestion[];
}

/** A Gumtree location matched by name or postcode prefix. */
export interface GumtreeLocationSuggestion {
  id: number | null;
  name: string | null;
  /** uk: location / outcode / postcode; au/za: region / area. */
  type: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** Response from `GET /v1/gumtree/locations/autocomplete`. */
export interface GumtreeLocationAutocompleteResponse {
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
  query: string;
  result_count: number;
  locations: GumtreeLocationSuggestion[];
}

/** A category or location node. `slug` (uk) or `id` (au/za) is what `search` takes. */
export interface GumtreeTreeNode {
  id: number;
  name: string | null;
  slug: string | null;
  has_children: boolean | null;
}

/** Response from `GET /v1/gumtree/categories` and `GET /v1/gumtree/locations`. */
export interface GumtreeTreeResponse {
  /** `uk` = gumtree.com, `au` = gumtree.com.au, `za` = gumtree.co.za. */
  market: string;
  id: number;
  name: string | null;
  slug: string | null;
  result_count: number;
  children: GumtreeTreeNode[];
}

// =============================================================================
// Markets
// =============================================================================

/** One Gumtree site this API covers. */
export interface GumtreeMarketInfo {
  /** `uk` / `au` / `za` — the `market` every method takes. */
  market: string;
  /** e.g. `"www.gumtree.com.au"`. */
  domain: string;
  /** ISO country code, e.g. `"GB"`. */
  country: string;
  currency: string;
  /** Unit of the search `distance` (`null`: radius not offered). */
  distance_unit: string | null;
  /** Organic results per search page. */
  page_size: number;
  /** How search takes `category` and `location`. */
  id_format: string;
}

/** Response from `GET /v1/gumtree/markets`. */
export interface GumtreeMarketsResponse {
  result_count: number;
  markets: GumtreeMarketInfo[];
}

// =============================================================================
// Request params
// =============================================================================

/**
 * Which Gumtree: `"uk"` (gumtree.com, GBP — the server default), `"au"`
 * (gumtree.com.au, AUD) or `"za"` (gumtree.co.za, ZAR).
 */
export type GumtreeMarket = "uk" | "au" | "za";

/** Result ordering for {@link GumtreeSearchParams.sort}. */
export type GumtreeSort = "relevance" | "date" | "price_asc" | "price_desc" | "distance";

/** Seller type filter. `"trade"` covers dealers, agencies and recruiters. */
export type GumtreeSellerType = "private" | "trade";

/** Parameters for `GET /v1/gumtree/search`. All optional. */
export interface GumtreeSearchParams {
  /** Search keywords, e.g. `"mountain bike"`. */
  query?: string;
  /**
   * uk: category slug, e.g. `"cars"`, `"for-sale"`, `"property-to-rent"`.
   * au/za: numeric category id as a string, e.g. `"18320"` (au cars) or
   * `"9077"` (za cars). Browse the tree with `listCategories`. Default `"all"`.
   */
  category?: string;
  /**
   * uk: location slug (`"london"`), town name or UK postcode (`"SW1A 1AA"`).
   * au/za: numeric location id as a string, e.g. `"3003435"` (au Sydney) or
   * `"3100003"` (za Gauteng). Resolve one with `locationAutocomplete`.
   * Default: the whole country.
   */
  location?: string;
  /** Radius around `location` (>0, max 1000): miles (uk) or km (au). Not za. */
  distance?: number;
  /** Minimum price in the market's currency (uk: needs a category other than `"all"`). */
  min_price?: number;
  /** Maximum price in the market's currency (uk: needs a category other than `"all"`). */
  max_price?: number;
  /** Result ordering (default relevance; `"distance"` is not offered by za). */
  sort?: GumtreeSort;
  /** uk and za. */
  seller_type?: GumtreeSellerType;
  /** uk only: only ads marked urgent. */
  urgent_only?: boolean;
  /** uk only: only ads with photos. */
  with_photos?: boolean;
  /**
   * Category-specific filters as comma-separated `key:value` pairs, e.g.
   * `"vehicle_make:bmw,vehicle_fuel_type:petrol,min_vehicle_mileage:10000"` (uk)
   * or `"ma:toyota,fu:petrol,max_km:100000"` (za). Range filters take
   * `min_<key>`/`max_<key>`. Discover keys with `searchFilters` for the same market.
   */
  filters?: string;
  /** Page number, 1-50. */
  page?: number;
  /** Which Gumtree. Unset = the server default, `"uk"`. */
  market?: GumtreeMarket;
}

/** Parameters for `GET /v1/gumtree/search/filters`. All optional. */
export interface GumtreeSearchFiltersParams {
  /** uk: category slug; au/za: numeric category id. Default `"all"`. */
  category?: string;
  /** uk: location slug, town or UK postcode; au/za: numeric location id. Default: the whole country. */
  location?: string;
  /** Optional keywords to scope the counts. */
  query?: string;
  /** za only: filters already applied, e.g. `"ma:toyota"` to list the Toyota models. */
  filters?: string;
  /** Which Gumtree. Unset = the server default, `"uk"`. */
  market?: GumtreeMarket;
}

/** Options for the Gumtree methods that only take a market. */
export interface GumtreeMarketParams {
  /** Which Gumtree. Unset = the server default, `"uk"`. */
  market?: GumtreeMarket;
}

/** Options for `getSellerListings`. */
export interface GumtreeSellerListingsParams extends GumtreeMarketParams {
  /** Page number, 1-50. */
  page?: number;
}

/** Options for `listLocations` and `listCategories`. */
export interface GumtreeTreeParams extends GumtreeMarketParams {
  /** Node id to list the children of. Unset = the market's root. */
  parent_id?: number;
}
