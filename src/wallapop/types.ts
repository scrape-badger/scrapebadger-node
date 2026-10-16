/**
 * TypeScript types for Wallapop API responses.
 *
 * These interfaces mirror the backend `wallapop_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises
 * them (`user_id`, `category_id`, `next_page`); nullable backend fields are
 * typed `Type | null`, list fields are always present (empty when Wallapop
 * returns nothing).
 *
 * Wallapop runs one API for all its markets (es, it, pt) and picks the
 * country from the search coordinates, so a market bundles a default search
 * centre (the capital), a language for category/filter labels and the web
 * host used for listing URLs.
 *
 * Every timestamp ships twice: `*_utc` (Unix seconds, for maths/sorting) and
 * `*_at` (ISO 8601 UTC, for people).
 */

// =============================================================================
// Shared
// =============================================================================

/** One listing / profile image in three sizes. */
export interface WallapopImage {
  /** Wallapop image id. */
  id: string | null;
  /** 320px-wide URL. */
  small: string | null;
  /** 640px-wide URL. */
  medium: string | null;
  /** 800px-wide (largest available) URL. */
  large: string | null;
  /** Average colour as a hex string without `#`, e.g. "13C1AC". */
  average_color: string | null;
}

/** Where a listing or seller is. */
export interface WallapopLocation {
  /** Latitude (approximate when `approximated` is true). */
  latitude: number | null;
  /** Longitude (approximate when `approximated` is true). */
  longitude: number | null;
  /** Postal code, e.g. "28222". */
  postal_code: string | null;
  /** City name. */
  city: string | null;
  /** Region / autonomous community, e.g. "Comunidad de Madrid". */
  region: string | null;
  /** Secondary region / province, e.g. "Madrid". */
  region2: string | null;
  /** ISO country code, e.g. "ES". */
  country_code: string | null;
  /** Whether Wallapop blurred the coordinates for privacy. */
  approximated: boolean | null;
}

/** One node of a listing's category path. */
export interface WallapopTaxonomyNode {
  /** Category id. */
  id: number;
  /** Localised category name. */
  name: string | null;
}

/** One structured listing attribute, e.g. `condition` → good / "Buen estado". */
export interface WallapopAttribute {
  /** Machine value, e.g. "good", "128gb", "Apple". */
  value: unknown;
  /** Localised attribute label, e.g. "Estado". */
  title: string | null;
  /** Localised value label, e.g. "Buen estado". */
  text: string | null;
}

/** A supported Wallapop market (for /markets). */
export interface WallapopMarket {
  /** Market code to pass as `market`, e.g. "es". */
  code: string;
  /** ISO country code, e.g. "ES". */
  country_code: string;
  /** Country name, e.g. "Spain". */
  name: string;
  /** Currency code, e.g. "EUR". */
  currency: string;
  /** Language that localises categories and filter labels, e.g. "es-ES". */
  language: string;
  /** Default search-centre latitude (the capital). */
  default_latitude: number;
  /** Default search-centre longitude (the capital). */
  default_longitude: number;
}

// =============================================================================
// Search
// =============================================================================

/** One listing in a search result. */
export interface WallapopSearchItem {
  /** Listing id, e.g. "nzxeknm5x562". */
  id: string;
  /** Seller's user id. */
  user_id: string | null;
  /** Listing title. */
  title: string | null;
  /** Listing description. */
  description: string | null;
  /** Asking price. */
  price: number | null;
  /** Currency code, e.g. "EUR". */
  currency: string | null;
  /** Top-level category id. */
  category_id: number | null;
  /** Category path, root first. */
  taxonomy: WallapopTaxonomyNode[];
  /** Item condition, e.g. "good" (from `attributes`). */
  condition: string | null;
  /** Brand (from `attributes`). */
  brand: string | null;
  /** Model (from `attributes`). */
  model: string | null;
  /** Vertical-specific attributes, flattened to values (cars: year, km, gearbox, horsepower...). */
  attributes: Record<string, unknown>;
  /** Listing images. */
  images: WallapopImage[];
  /** Listing location. */
  location: WallapopLocation | null;
  /** Whether the item can be shipped. */
  shippable: boolean | null;
  /** Whether the seller accepts shipping. */
  user_allows_shipping: boolean | null;
  /** Whether the listing is reserved. */
  reserved: boolean | null;
  /** Whether the listing is currently bumped (promoted). */
  bumped: boolean;
  /** Bump kind, e.g. "city"; null when not bumped. */
  bump_type: string | null;
  /** Whether the seller is a top profile. */
  is_top_profile: boolean | null;
  /** Whether the item is refurbished. */
  is_refurbished: boolean | null;
  /** Whether the item comes with a warranty. */
  has_warranty: boolean | null;
  /** Listing slug (last URL segment). */
  slug: string | null;
  /** Full listing URL. */
  url: string | null;
  /** Created time, Unix seconds. */
  created_utc: number | null;
  /** Created time, ISO 8601 UTC. */
  created_at: string | null;
  /** Last-modified time, Unix seconds. */
  modified_utc: number | null;
  /** Last-modified time, ISO 8601 UTC. */
  modified_at: string | null;
}

/** Response from /search. */
export interface WallapopSearchResponse {
  /** Matching listings (up to 40 per page). */
  items: WallapopSearchItem[];
  /** Number of listings on this page. */
  result_count: number;
  /** Wallapop's own estimate of matching listings. */
  total_results: number | null;
  /** Cursor for the next page — pass back as `nextPage`; null on the last page. */
  next_page: string | null;
  /** Sort order Wallapop applied. */
  order_by: string | null;
  /** Market code used. */
  market: string;
  /** Country Wallapop searched in. */
  country_code: string | null;
  /** Wallapop search id. */
  search_id: string | null;
}

// =============================================================================
// Items
// =============================================================================

/** Full listing detail (/items/{item_id}). */
export interface WallapopItemDetail {
  /** Listing id. */
  id: string;
  /** Seller's user id. */
  user_id: string | null;
  /** Listing title. */
  title: string | null;
  /** Listing description. */
  description: string | null;
  /** Vertical: consumer_goods, cars, real_estate... */
  vertical: string | null;
  /** Asking price. */
  price: number | null;
  /** Currency code, e.g. "EUR". */
  currency: string | null;
  /** Deepest category id. */
  category_id: number | null;
  /** Category path, root first. */
  taxonomy: WallapopTaxonomyNode[];
  /** Item condition, e.g. "good". */
  condition: string | null;
  /** Brand. */
  brand: string | null;
  /** Model. */
  model: string | null;
  /** Structured attributes keyed by attribute id, with localised labels. */
  attributes: Record<string, WallapopAttribute>;
  /** One-line summary of the attributes, e.g. "Buen estado · Apple · iPhone 14". */
  characteristics: string | null;
  /** Attribute label/value pairs, e.g. `{ attribute: "Color", value: "Negro" }`. */
  characteristics_details: Array<Record<string, string>>;
  /** Hashtags on the listing. */
  hashtags: string[];
  /** Listing images. */
  images: WallapopImage[];
  /** Listing location. */
  location: WallapopLocation | null;
  /** Whether the item can be shipped. */
  shippable: boolean | null;
  /** Whether the seller accepts shipping. */
  user_allows_shipping: boolean | null;
  /** Whether the category supports Wallapop shipping. */
  supports_shipping: boolean | null;
  /** Whether the listing is currently bumped (promoted). */
  bumped: boolean;
  /** Bump kind, e.g. "city"; null when not bumped. */
  bump_type: string | null;
  /** Whether the seller is a top profile. */
  is_top_profile: boolean | null;
  /** View count. */
  views: number | null;
  /** Favourite count. */
  favorites: number | null;
  /** Number of chats started about the listing. */
  conversations: number | null;
  /** Listing slug (last URL segment). */
  slug: string | null;
  /** Full listing URL. */
  url: string | null;
  /** Last-modified time, Unix seconds. */
  modified_utc: number | null;
  /** Last-modified time, ISO 8601 UTC. */
  modified_at: string | null;
}

// =============================================================================
// Users
// =============================================================================

/** Which verifications a user has completed. */
export interface WallapopUserValidations {
  /** Overall verification level, e.g. "partially_verified". */
  level: string | null;
  /** Email verified. */
  email: boolean | null;
  /** Mobile number verified. */
  mobile: boolean | null;
  /** Facebook linked. */
  facebook: boolean | null;
  /** Google linked. */
  google: boolean | null;
  /** Profile picture set. */
  picture: boolean | null;
  /** Location verified. */
  location: boolean | null;
  /** Birthday set. */
  birthday: boolean | null;
  /** Identity (KYC) verified. */
  kyc: boolean | null;
}

/** A Wallapop user / seller profile. */
export interface WallapopUserProfile {
  /** User id, e.g. "dqjwdd53wwzo". */
  id: string;
  /** Display name, e.g. "Alejandro C.". */
  name: string | null;
  /** Account type: normal | professional. */
  type: string | null;
  /** Seller type: Private | Professional. */
  seller_type: string | null;
  /** Whether the seller is verified. */
  verified: boolean | null;
  /** Whether the user is a top profile. */
  is_top_profile: boolean | null;
  /** Whether the profile is featured. */
  featured: boolean | null;
  /** Profile picture. */
  image: WallapopImage | null;
  /** User location. */
  location: WallapopLocation | null;
  /** Average rating, 0-5. */
  rating_average: number | null;
  /** Rating score, 0-100. */
  scoring_stars: number | null;
  /** Number of reviews received. */
  reviews_count: number | null;
  /** Number of live listings. */
  published_count: number | null;
  /** Number of items sold. */
  sold_count: number | null;
  /** Number of sales transactions. */
  sells_count: number | null;
  /** Number of purchases. */
  buys_count: number | null;
  /** Number of reports received. */
  reports_received_count: number | null;
  /** Typical reply time, e.g. "less_than_one_hour". */
  response_rate: string | null;
  /** Activity level, e.g. "unknown". */
  activity_level: string | null;
  /** Days within which deliveries ship on time. */
  deliveries_on_time_in_days: number | null;
  /** Completed verifications. */
  validations: WallapopUserValidations | null;
  /** Profile slug, e.g. "alexc-25115753". */
  slug: string | null;
  /** Full profile URL. */
  url: string | null;
  /** Registration time, Unix seconds. */
  registered_utc: number | null;
  /** Registration time, ISO 8601 UTC. */
  registered_at: string | null;
}

/** One listing in a user's listings. */
export interface WallapopUserItem {
  /** Listing id. */
  id: string;
  /** Listing title. */
  title: string | null;
  /** Listing description. */
  description: string | null;
  /** Asking price. */
  price: number | null;
  /** Currency code, e.g. "EUR". */
  currency: string | null;
  /** Category id. */
  category_id: number | null;
  /** Item condition, e.g. "good". */
  condition: string | null;
  /** Vertical-specific attributes, flattened to values. */
  attributes: Record<string, unknown>;
  /** Listing images. */
  images: WallapopImage[];
  /** Whether the item can be shipped. */
  shippable: boolean | null;
  /** Whether the seller accepts shipping. */
  user_allows_shipping: boolean | null;
  /** Whether the item is refurbished. */
  is_refurbished: boolean | null;
  /** Whether the item comes with a warranty. */
  has_warranty: boolean | null;
  /** Listing slug (last URL segment). */
  slug: string | null;
  /** Full listing URL. */
  url: string | null;
}

/** Response from /users/{user_id}/items. */
export interface WallapopUserItemsResponse {
  /** Resolved user id. */
  user_id: string;
  /** The seller's live listings (up to 40 per page). */
  items: WallapopUserItem[];
  /** Number of listings on this page. */
  result_count: number;
  /** Cursor for the next page — pass back as `nextPage`; null on the last page. */
  next_page: string | null;
  /** Market code used. */
  market: string;
}

/** The listing a review is about. */
export interface WallapopReviewItem {
  /** Listing id. */
  id: string | null;
  /** Listing title. */
  title: string | null;
  /** Category id. */
  category_id: number | null;
  /** Listing image URL. */
  image: string | null;
  /** Listing slug. */
  slug: string | null;
  /** Full listing URL. */
  url: string | null;
}

/** The user who left a review. */
export interface WallapopReviewer {
  /** Reviewer user id. */
  id: string | null;
  /** Reviewer display name. */
  name: string | null;
  /** Reviewer avatar URL. */
  image: string | null;
  /** Reviewer profile slug. */
  slug: string | null;
}

/** One review a user received. */
export interface WallapopReview {
  /** Review id. */
  id: string | null;
  /** Star rating, 1-5. */
  rating: number | null;
  /** Score, 0-100. */
  scoring: number | null;
  /** Review text. */
  comment: string | null;
  /** sell = the profile sold to the reviewer; buy = the profile bought from them. */
  type: string | null;
  /** Whether the deal used Wallapop shipping. */
  is_shipping_transaction: boolean | null;
  /** The listing the review is about. */
  item: WallapopReviewItem | null;
  /** Who left the review. */
  reviewer: WallapopReviewer | null;
  /** Review time, Unix seconds. */
  created_utc: number | null;
  /** Review time, ISO 8601 UTC. */
  created_at: string | null;
}

/** Response from /users/{user_id}/reviews. */
export interface WallapopReviewsResponse {
  /** Resolved user id. */
  user_id: string;
  /** Reviews, newest first (up to 40 per page). */
  reviews: WallapopReview[];
  /** Number of reviews on this page. */
  result_count: number;
  /** Cursor for the next page — pass back as `nextPage`; null on the last page. */
  next_page: string | null;
  /** Market code used. */
  market: string;
}

// =============================================================================
// Reference
// =============================================================================

/** One search-box suggestion. */
export interface WallapopSuggestion {
  /** Suggested search text. */
  text: string;
  /** Secondary line, e.g. a category hint. */
  subtitle: string | null;
  /** Upstream suggestion kind, e.g. "regular". */
  type: string | null;
}

/** Response from /autocomplete. */
export interface WallapopAutocompleteResponse {
  /** The partial query. */
  query: string;
  /** Suggestions in Wallapop's order. */
  suggestions: WallapopSuggestion[];
  /** Market code used. */
  market: string;
}

/** One category (recursive tree node). */
export interface WallapopCategory {
  /** Category id — usable as the search `categoryId`. */
  id: number;
  /** Localised category name. */
  name: string | null;
  /** Parent category id; null at the root. */
  parent_id: number | null;
  /** Vertical, e.g. "cars", "consumer_goods". */
  vertical: string | null;
  /** Icon name. */
  icon: string | null;
  /** Child categories. */
  subcategories: WallapopCategory[];
}

/** Response from /categories. */
export interface WallapopCategoriesResponse {
  /** Top-level categories with nested subcategories. */
  categories: WallapopCategory[];
  /** Market code used. */
  market: string;
}

/** One option of a search filter. */
export interface WallapopFilterOption {
  /** Option id to pass as the filter's search param. */
  id: string;
  /** Localised option label. */
  title: string | null;
}

/** One search filter Wallapop offers. */
export interface WallapopSearchFilter {
  /** Filter id, e.g. "brand", "condition". */
  id: string;
  /** Localised filter label. */
  title: string | null;
  /** Filter kind: list, toggle, slider, location, tree. */
  type: string | null;
  /** Wallapop search params this filter sets. */
  params: string[];
  /** Whether several options can be selected. */
  multi: boolean | null;
  /** Inline options (empty when `options_endpoint` is true). */
  options: WallapopFilterOption[];
  /** Options are long — fetch them from `listFilterOptions(id)`. */
  options_endpoint: boolean;
}

/** Response from /filters. */
export interface WallapopFiltersResponse {
  /** Filters available for the category/query. */
  filters: WallapopSearchFilter[];
  /** Market code used. */
  market: string;
}

/** Response from /filters/{filter_id}/options. */
export interface WallapopFilterOptionsResponse {
  /** Filter id the options belong to. */
  filter_id: string;
  /** The filter's options. */
  options: WallapopFilterOption[];
  /** Market code used. */
  market: string;
}

/** Response from /markets. */
export interface WallapopMarketsResponse {
  /** All supported markets. */
  markets: WallapopMarket[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Sort order for /search. */
export type WallapopOrderBy =
  "most_relevance" | "newest" | "closest" | "price_low_to_high" | "price_high_to_low";

/** Listing-age window for /search. */
export type WallapopTimeFilter = "today" | "lastWeek" | "lastMonth";

/** Options for the /search endpoint. Needs a query, a `categoryId`, or both. */
export interface WallapopSearchParams {
  /** Market code: es, it, pt (default: "es"). */
  market?: string;
  /** Search-centre latitude, -90 to 90 (defaults to the market capital). */
  latitude?: number;
  /** Search-centre longitude, -180 to 180 (defaults to the market capital). */
  longitude?: number;
  /** Radius around the search centre in km (1-500). */
  distanceKm?: number;
  /** Category id (see `listCategories`). */
  categoryId?: number;
  /** Minimum price (EUR). */
  minPrice?: number;
  /** Maximum price (EUR). */
  maxPrice?: number;
  /** Comma-separated: un_opened, in_box, new, as_good_as_new, good, fair, has_given_it_all. */
  condition?: string;
  /** Brand, e.g. "Apple" (see `listFilterOptions("brand")`). */
  brand?: string;
  /** Model, e.g. "iPhone 14". */
  model?: string;
  /** Colour id, e.g. "black". */
  color?: string;
  /** Only listings published within this window. */
  timeFilter?: WallapopTimeFilter;
  /** Only listings that ship. */
  shippable?: boolean;
  /** Only listings with a warranty. */
  hasWarranty?: boolean;
  /** Only refurbished listings. */
  refurbished?: boolean;
  /** Cars: earliest model year. */
  minYear?: number;
  /** Cars: latest model year. */
  maxYear?: number;
  /** Cars: minimum mileage (km). */
  minKm?: number;
  /** Cars: maximum mileage (km). */
  maxKm?: number;
  /** Cars: gearbox type. */
  gearbox?: "manual" | "automatic";
  /** Cars: minimum horsepower. */
  minHorsepower?: number;
  /** Cars: maximum horsepower. */
  maxHorsepower?: number;
  /** Sort order (default: "most_relevance"). */
  orderBy?: WallapopOrderBy;
  /** Cursor from the previous page's `next_page`; other parameters are then ignored. */
  nextPage?: string;
}

/** Options for the /items/{item_id} endpoint. */
export interface WallapopItemParams {
  /** Market code: es, it, pt (default: "es"). */
  market?: string;
}

/** Options for the /users/{user_id} endpoint. */
export interface WallapopUserParams {
  /** Market code: es, it, pt (default: "es"). */
  market?: string;
}

/** Options for the /users/{user_id}/items and /users/{user_id}/reviews endpoints. */
export interface WallapopUserPageParams {
  /** Market code: es, it, pt (default: "es"). */
  market?: string;
  /** Cursor from the previous page's `next_page`. */
  nextPage?: string;
}

/** Options for the /autocomplete and /categories endpoints. */
export interface WallapopMarketParams {
  /** Market code: es, it, pt (default: "es"). Localises names. */
  market?: string;
}

/** Options for the /filters and /filters/{filter_id}/options endpoints. */
export interface WallapopFiltersParams {
  /** Category the filters apply to. */
  categoryId?: number;
  /** Search text the filters apply to. */
  query?: string;
  /** Market code: es, it, pt (default: "es"). Localises labels. */
  market?: string;
}
