/**
 * TypeScript parameter types for Google Scraper API sub-clients.
 *
 * Response types use `Record<string, unknown>` rather than strict interfaces
 * because the Google API returns rich nested data that mirrors the server-side
 * Pydantic models; users can cast to their own typed shapes as needed. All
 * parameter types are strictly typed.
 */

// ===== Shared =====

export type GoogleResponse = Record<string, unknown>;

// ===== Search =====

export interface GoogleSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  num?: number;
  start?: number;
  domain?: string;
  device?: "desktop" | "mobile";
  location?: string;
  lr?: string;
  tbs?: string;
  safe?: "off" | "medium" | "high";
  uule?: string;
  filter?: number;
  nfpr?: number;
  cr?: string;
  ludocid?: string;
  lsig?: string;
  kgmid?: string;
  si?: string;
  ibp?: string;
  uds?: string;
  /**
   * When true, chase Google's deferred AI Overview `page_token` with a
   * follow-up fetch and merge the result back into `ai_overview`. Adds
   * ~1s and 1 credit only when the SERP actually defers the overview.
   */
  ai_overview?: boolean;
}

// ===== Maps =====

export interface MapsSearchParams {
  q: string;
  ll?: string;
  gl?: string;
  hl?: string;
  start?: number;
}

export interface MapsPlaceParams {
  place_id?: string;
  data_id?: string;
  hl?: string;
  gl?: string;
}

export interface MapsReviewsParams {
  data_id: string;
  sort_by?: "qualityScore" | "newestFirst" | "ratingHigh" | "ratingLow";
  hl?: string;
  next_page_token?: string;
  results?: number;
}

export interface MapsPhotosParams {
  data_id: string;
  hl?: string;
  next_page_token?: string;
}

export interface MapsPostsParams {
  data_id: string;
  next_page_token?: string;
}

// ===== News =====

export interface NewsSearchParams {
  q: string;
  hl?: string;
  gl?: string;
  max_results?: number;
}

/**
 * Canonical Google News topic codes. Any string is accepted at runtime —
 * use `NewsTopic` for IDE autocomplete on the standard topics and fall
 * back to a plain `string` when you know the topic code out-of-band.
 */
export type NewsTopic =
  | "WORLD"
  | "BUSINESS"
  | "TECHNOLOGY"
  | "ENTERTAINMENT"
  | "SPORTS"
  | "SCIENCE"
  | "HEALTH";

export interface NewsTopicsParams {
  // Accept the canonical codes as a `NewsTopic` union, but also allow any
  // string at runtime because Google adds/renames topic codes periodically.
  topic: NewsTopic | (string & {});
  hl?: string;
  gl?: string;
  max_results?: number;
}

export interface NewsTrendingParams {
  hl?: string;
  gl?: string;
  max_results?: number;
}

// ===== Hotels =====

export interface HotelsSearchParams {
  q: string;
  check_in: string;
  check_out: string;
  adults?: number;
  currency?: string;
  gl?: string;
}

export interface HotelsDetailsParams {
  property_token: string;
  check_in: string;
  check_out: string;
}

// ===== Trends =====

export interface TrendsInterestParams {
  q: string;
  geo?: string;
  date?: string;
}

export interface TrendsRegionsParams {
  q: string;
  geo?: string;
}

export interface TrendsRelatedParams {
  q: string;
  geo?: string;
}

export interface TrendsTrendingParams {
  geo?: string;
}

export interface TrendsAutocompleteParams {
  /** Query prefix to resolve into Trends topics. */
  q: string;
  /** Language code (e.g. "en-US"). */
  hl?: string;
  /** Timezone offset in minutes. */
  tz?: string;
}

// ===== Jobs =====

export interface JobsSearchParams {
  q: string;
  location?: string;
  gl?: string;
  job_type?: "FULLTIME" | "PARTTIME" | "CONTRACTOR" | "INTERN";
  date_posted?: "today" | "3days" | "week" | "month";
}

// ===== Shopping =====

export interface ShoppingSearchParams {
  q: string;
  gl?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "price_low" | "price_high" | "rating" | "reviews";
}

export interface ShoppingProductParams {
  product_id: string;
  gl?: string;
}

export interface ShoppingClickParams {
  /** Exact product title from a search result. */
  title: string;
  /** Merchant source name (e.g. "Walmart", "Best Buy") — scopes the lookup. */
  source?: string;
  /** Original search query (improves disambiguation). */
  q?: string;
  /** Stable product_id from the search result. */
  product_id?: string;
  gl?: string;
  hl?: string;
}

// ===== Patents =====

export interface PatentsSearchParams {
  q: string;
  page?: number;
  num?: number;
  sort?: "new" | "old";
  inventor?: string;
  assignee?: string;
}

export interface PatentsDetailParams {
  patent_id: string;
}

// ===== Scholar =====

export interface ScholarSearchParams {
  q: string;
  hl?: string;
  as_ylo?: number;
  as_yhi?: number;
  as_sdt?: string;
  page?: number;
  num?: number;
}

export interface ScholarProfilesParams {
  /** Author name query (e.g. "Geoffrey Hinton"). */
  mauthors: string;
  hl?: string;
  /** Next-page pagination token from a previous response. */
  after_author?: string;
  /** Previous-page pagination token. */
  before_author?: string;
}

export interface ScholarAuthorParams {
  /** Scholar user ID (the `user` query parameter on a profile URL). */
  author_id: string;
  hl?: string;
  /** Articles pagination offset. */
  cstart?: number;
  /** Articles per page. */
  pagesize?: number;
}

export interface ScholarAuthorCitationParams {
  author_id: string;
  hl?: string;
}

export interface ScholarCiteParams {
  /** Cluster ID from a Scholar search result. */
  q: string;
  hl?: string;
}

// ===== Autocomplete =====

export interface AutocompleteParams {
  q: string;
  hl?: string;
  gl?: string;
}

// ===== Images =====

export interface ImagesSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  tbs?: string;
  imgsz?: string;
  imgcolor?: string;
  imgtype?: string;
  safe?: "off" | "medium" | "high";
  page?: number;
}

// ===== Videos =====

export interface VideosSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  tbs?: string;
  safe?: "off" | "medium" | "high";
  page?: number;
}

// ===== Finance =====

export interface FinanceQuoteParams {
  q: string;
  hl?: string;
}

// ===== AI Mode =====

export interface AiModeSearchParams {
  q: string;
  gl?: string;
  hl?: string;
}

// ===== Lens =====

export interface LensSearchParams {
  url: string;
  gl?: string;
  hl?: string;
}

// ===== Products =====

export interface ProductsDetailParams {
  product_id: string;
  gl?: string;
  hl?: string;
}

// ===== Local Pack =====

export interface LocalSearchParams {
  /** Search query with local intent (e.g. "pizza in brooklyn"). */
  q: string;
  gl?: string;
  hl?: string;
  domain?: string;
  /** City-level geo-targeting string (e.g. "New York, USA"). */
  location?: string;
  /** UULE-encoded location parameter. */
  uule?: string;
  num?: number;
  start?: number;
}

// ===== Shorts =====

export interface ShortsSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  domain?: string;
  num?: number;
  start?: number;
}

// ===== Flights =====

export type FlightsTripType = "round_trip" | "one_way" | "multi_city";
export type FlightsTravelClass = "economy" | "premium_economy" | "business" | "first";
export type FlightsStopsFilter = "any" | "nonstop" | "one_stop" | "two_stops";

export interface FlightsSearchParams {
  /** Departure airport IATA code (e.g. "JFK") or location ID. */
  departure_id: string;
  /** Arrival airport IATA code (e.g. "LHR") or location ID. */
  arrival_id: string;
  /** Outbound date in YYYY-MM-DD format. */
  outbound_date: string;
  /** Return date (required for round_trip). */
  return_date?: string;
  trip_type?: FlightsTripType;
  /** Adult passengers (1-9). */
  adults?: number;
  /** Children passengers (0-8). */
  children?: number;
  /** Infants in seat (0-4). */
  infants_in_seat?: number;
  /** Infants on lap (0-4). */
  infants_on_lap?: number;
  travel_class?: FlightsTravelClass;
  /** ISO-4217 currency code (default "USD"). */
  currency?: string;
  gl?: string;
  hl?: string;
  stops?: FlightsStopsFilter;
  /** Upper price filter. */
  max_price?: number;
}
