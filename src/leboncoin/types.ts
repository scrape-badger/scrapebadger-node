/**
 * TypeScript types for Leboncoin API responses.
 *
 * These interfaces mirror the backend `leboncoin_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 * Every datetime field ships in BOTH the raw Leboncoin form (`*_date`) and an
 * ISO-8601 UTC string (`*_at`).
 */

// =============================================================================
// Ad building blocks
// =============================================================================

/**
 * A category-specific spec (vehicle mileage, real-estate DPE, etc.).
 */
export interface Attribute {
  key: string;
  key_label: string | null;
  value: string | null;
  value_label: string | null;
  values: string[];
  values_label: string[];
  generic: boolean | null;
}

/**
 * The location attached to an ad or a seller.
 */
export interface Location {
  country_id: string | null;
  region_id: string | null;
  region_name: string | null;
  department_id: string | null;
  department_name: string | null;
  city: string | null;
  city_label: string | null;
  zipcode: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
  source: string | null;
  provider: string | null;
  is_shape: boolean | null;
}

/**
 * Seller stub embedded in each ad.
 */
export interface Owner {
  user_id: string | null;
  store_id: string | null;
  /** "private" | "pro" */
  type: string | null;
  name: string | null;
  siren: string | null;
  no_salesmen: boolean | null;
  activity_sector: string | null;
  online_store_id: string | null;
}

/**
 * An ad's image set.
 */
export interface Images {
  nb_images: number;
  thumb_url: string | null;
  small_url: string | null;
  urls: string[];
  urls_thumb: string[];
  urls_large: string[];
}

/**
 * A Leboncoin classified ad (search summary + detail share this shape).
 */
export interface Ad {
  list_id: number;
  subject: string;
  body: string | null;
  brand: string | null;
  /** "offer" | "demand" */
  ad_type: string | null;
  url: string | null;
  status: string | null;

  category_id: string | null;
  category_name: string | null;

  price: number[];
  price_cents: number | null;
  price_eur: number | null;
  currency: string;

  // Dates — raw + ISO
  first_publication_date: string | null;
  first_publication_at: string | null;
  index_date: string | null;
  index_at: string | null;
  expiration_date: string | null;
  expiration_at: string | null;

  has_phone: boolean | null;
  favorites: number | null;

  images: Images;
  attributes: Attribute[];
  location: Location;
  owner: Owner;

  /** Ad options / boosts (present in the web payload). */
  options: Record<string, unknown>;
}

// =============================================================================
// Seller / store
// =============================================================================

/**
 * A seller's aggregated feedback scores.
 */
export interface FeedbackScores {
  overall_score: number | null;
  received_count: number | null;
  category_scores: Record<string, unknown>;
}

/**
 * A single pro-store rating review.
 */
export interface StoreRatingReview {
  author_name: string | null;
  rating_value: number | null;
  text: string | null;
  review_time: string | null;
}

/**
 * A Leboncoin seller (private profile or pro store).
 */
export interface Seller {
  user_id: string;
  store_id: string | null;
  online_store_id: string | null;
  name: string | null;
  /** "private" | "pro" */
  account_type: string | null;
  registered_at: string | null;
  total_ads: number | null;
  description: string | null;
  profile_picture_url: string | null;
  location: Location;
  badges: Record<string, unknown>[];
  feedback: FeedbackScores | null;
  reply_rate: number | null;
  reply_time_text: string | null;
  presence_status: string | null;
  last_activity: string | null;

  // Pro store extras (present only when account_type == "pro")
  siren: string | null;
  siret: string | null;
  activity_sector: string | null;
  website_url: string | null;
  opening_hours: Record<string, unknown> | unknown[] | null;
  store_rating_value: number | null;
  store_ratings_total: number | null;
  store_reviews: StoreRatingReview[];
}

// =============================================================================
// Reference
// =============================================================================

/**
 * A reference category.
 */
export interface Category {
  category_id: string;
  key: string;
  label: string;
  parent_id: string | null;
}

/**
 * A reference region.
 */
export interface Region {
  region_id: string;
  key: string;
  name: string;
}

/**
 * A reference department.
 */
export interface Department {
  department_id: string;
  region_id: string;
  name: string;
}

/**
 * A location autocomplete suggestion.
 */
export interface LocationSuggestion {
  label: string;
  location_type: string | null;
  region_id: string | null;
  department_id: string | null;
  city: string | null;
  zipcode: string | null;
  lat: number | null;
  lng: number | null;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** Response from the /search endpoint. */
export interface SearchResponse {
  ads: Ad[];
  total: number | null;
  total_all: number | null;
  total_pro: number | null;
  total_private: number | null;
  total_shippable: number | null;
  max_pages: number | null;
  page: number;
  limit: number;
  /** "api" (finder) or "web" (rendered __NEXT_DATA__) */
  source: string;
}

/** Response from the /ads/{list_id} endpoint. */
export interface AdResponse {
  ad: Ad;
}

/** Response from the /ads/{list_id}/similar endpoint. */
export interface SimilarResponse {
  list_id: number;
  ads: Ad[];
}

/** Response from the /sellers/{user_id} endpoint. */
export interface SellerResponse {
  seller: Seller;
}

/** Response from the /sellers/{user_id}/listings endpoint. */
export interface SellerListingsResponse {
  user_id: string;
  ads: Ad[];
  total: number | null;
  page: number;
  limit: number;
}

/** Response from the /categories endpoint. */
export interface CategoriesResponse {
  categories: Category[];
}

/** Response from the /regions endpoint. */
export interface RegionsResponse {
  regions: Region[];
}

/** Response from the /departments endpoint. */
export interface DepartmentsResponse {
  departments: Department[];
}

/** Response from the /locations/search endpoint. */
export interface LocationSearchResponse {
  query: string;
  suggestions: LocationSuggestion[];
}

/** Response from the /markets endpoint. */
export interface MarketsResponse {
  markets: Record<string, unknown>[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Seller-type filter for search. */
export type LeboncoinOwnerType = "all" | "pro" | "private";

/** Ad-type filter for search. */
export type LeboncoinAdType = "offer" | "demand";

/** Sort order for search. */
export type LeboncoinSortBy =
  | "relevance"
  | "newest"
  | "oldest"
  | "price_low"
  | "price_high";

/** Parameters for searching Leboncoin ads. */
export interface LeboncoinSearchParams {
  /** Free-text query */
  text?: string;
  /** Category id (see reference.categories) */
  category?: string;
  /** Region id (see reference.regions) */
  region_id?: string;
  /** Department id, e.g. "75" (see reference.departments) */
  department_id?: string;
  /** City name */
  city?: string;
  /** Postal code */
  zipcode?: string;
  /** Minimum price filter */
  price_min?: number;
  /** Maximum price filter */
  price_max?: number;
  /** Seller-type filter (default: "all") */
  owner_type?: LeboncoinOwnerType;
  /** Ad-type filter (default: "offer") */
  ad_type?: LeboncoinAdType;
  /** Sort order (default: "relevance") */
  sort?: LeboncoinSortBy;
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (1-100; default 35) */
  limit?: number;
}

/** Options for the similar-ads endpoint. */
export interface LeboncoinSimilarParams {
  /** Number of similar ads to return (1-50; default 20) */
  limit?: number;
}

/** Options for the seller-listings endpoint. */
export interface LeboncoinSellerListingsParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (1-100; default 35) */
  limit?: number;
}

/** Options for the departments endpoint. */
export interface LeboncoinDepartmentsParams {
  /** Filter by region id */
  region_id?: string;
}
