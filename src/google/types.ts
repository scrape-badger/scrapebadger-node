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
   * ~1s when the SERP actually defers the overview. Credit cost is
   * configured per-endpoint by admins — query `/public/pricing` for the
   * live rate.
   */
  ai_overview?: boolean;
}

// ===== Maps =====

export interface MapsSearchParams {
  /** Search query. Required unless `place_id` or `ludocid` is supplied. */
  q?: string;
  /** GPS coords as `@lat,lng,zoom` (e.g. `@40.745,-74.008,14z`). */
  ll?: string;
  gl?: string;
  hl?: string;
  start?: number;
  /** 1-indexed page number (alternative to `start`). */
  page?: number;
  /** Business-type slug (e.g. `restaurant`, `hotel`). */
  type?: string;
  /** Raw Google Maps `pb=` override for advanced queries. */
  data?: string;
  /** Google Place ID (`ChIJ...`) — direct-lookup a single place. */
  place_id?: string;
  /** Google Location Document ID (CID) — direct-lookup by CID. */
  ludocid?: string;
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
  /** Google Maps data ID (`0x...:0x...`). Required unless `place_id` is set. */
  data_id?: string;
  /** Google Place ID — alternative to `data_id`. */
  place_id?: string;
  hl?: string;
  gl?: string;
  next_page_token?: string;
}

// ===== News =====

export interface NewsSearchParams {
  /** Free-text keyword query. Pass this OR one of the token fields below. */
  q?: string;
  hl?: string;
  gl?: string;
  max_results?: number;
  /** Google News topic token (from a previous response's `topic_token`). */
  topic_token?: string;
  /** Google News publication token — scopes results to a single publisher. */
  publication_token?: string;
  /** Google News story token — scopes results to a single story cluster. */
  story_token?: string;
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

export type TrendsCategory =
  | "all"
  | "business"
  | "entertainment"
  | "health"
  | "sci_tech"
  | "sports"
  | "top_stories"
  | "b"
  | "e"
  | "m"
  | "t"
  | "s"
  | "h";

export type TrendsTrendingStatus = "all" | "active";

export type TrendsTrendingSort = "relevance" | "search_volume" | "title" | "recency";

export interface TrendsTrendingNowParams {
  /** Country code (e.g. "US", "LT", "GB"). */
  geo?: string;
  /** Look-back window in hours. Common: 4, 24, 48, 168. */
  hours?: number;
  /** Category filter. */
  category?: TrendsCategory;
  /** Trend state: "all" (default) or "active" (only non-zero search volume). */
  status?: TrendsTrendingStatus;
  /** Sort order: relevance / search_volume / title / recency. */
  sort?: TrendsTrendingSort;
  /** Language code (e.g. "en-US"). */
  hl?: string;
}

export type TrendsDataType =
  | "TIMESERIES"
  | "GEO_MAP"
  | "GEO_MAP_0"
  | "RELATED_TOPICS"
  | "RELATED_QUERIES";

export interface TrendsSearchParams {
  /** Search term(s). Comma-separated (max 5) for TIMESERIES / GEO_MAP. */
  q: string;
  data_type?: TrendsDataType;
  geo?: string;
  date?: string;
  cat?: number;
  gprop?: string;
  region?: "COUNTRY" | "REGION" | "DMA" | "CITY";
  language?: string;
  tz?: string;
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
  /**
   * Data source.
   * - `"rpc"` (default, ~1-2 s): Google Careers batchexecute RPC —
   *   structured JSON, scope = Google's own openings.
   * - `"serp"`: public Google Jobs SERP aggregator — 3rd-party listings
   *   (LinkedIn, Indeed, Built In, ZipRecruiter, …).
   */
  mode?: "rpc" | "serp";
  location?: string;
  gl?: string;
  /** Alias for gl. */
  country?: string;
  hl?: string;
  /** Alias for hl (accepts "en-US" etc). */
  language?: string;
  /** Google domain (google.com, google.co.uk, …). */
  domain?: string;
  job_type?: "FULLTIME" | "PARTTIME" | "CONTRACTOR" | "INTERN";
  date_posted?: "today" | "3days" | "week" | "month";
  /** Work arrangement — SERP mode only. */
  ltype?: "remote" | "hybrid" | "onsite" | "work_from_home";
  /** Raw Google chip filter string — SERP mode only. */
  chips?: string;
  /** Opaque Google filter token — SERP mode only. */
  uds?: string;
  /** UULE-encoded location — SERP mode only. */
  uule?: string;
  /** Search radius in miles — SERP mode only. */
  lrad?: string;
  /** Pagination token from prior response. */
  next_page_token?: string;
}

// ===== Shopping =====

export interface ShoppingSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  domain?: string;
  /** Zero-based page index (each page ≈ 60 tiles). */
  page?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: "price_low" | "price_high" | "rating" | "reviews";
  /** Free-shipping filter. */
  free_shipping?: boolean;
  /** On-sale filter. */
  on_sale?: boolean;
  safe?: "off" | "active";
  /** `1` disables auto-correction. */
  nfpr?: number;
  /** Language restrict (e.g. `lang_en`). */
  lr?: string;
  /** Raw Google tbs filter. */
  tbs?: string;
  /** Google internal shoprs helper token. */
  shoprs?: string;
}

/**
 * Params for `/v1/google/shopping/product` — Google Shopping product
 * detail page lookup.
 */
export interface ShoppingProductParams {
  product_id: string;
  gl?: string;
  hl?: string;
  domain?: string;
}

/**
 * Params for `/v1/google/shopping/product/click` — resolve the direct
 * merchant URL for a Shopping product tile. Uses Google's "I'm Feeling
 * Lucky" redirect scoped to the card's `source` merchant via the
 * `site:` operator.
 */
export interface ShoppingClickParams {
  title: string;
  source: string;
  q: string;
  product_id?: string;
}

// ===== Patents =====

/**
 * Params for `/v1/google/patents/search`. Backed by Google Patents'
 * `/xhr/query` JSON RPC — ~1 s regardless of filter complexity.
 */
export interface PatentsSearchParams {
  /** Query string — supports Boolean logic (e.g. "quantum AND compute"). */
  q: string;
  page?: number;
  num?: number;
  sort?: "new" | "old";
  /** Comma-separated inventor names. */
  inventor?: string;
  /** Comma-separated assignee / company names. */
  assignee?: string;
  /** Patent-office country code (US, EP, WO, …). */
  country?: string;
  language?: "ENGLISH" | "GERMAN" | "CHINESE" | "FRENCH" | "JAPANESE" | "KOREAN" | "SPANISH";
  status?: "GRANT" | "APPLICATION";
  patent_type?: "PATENT" | "DESIGN";
  /** Filing/priority-date upper bound (YYYYMMDD). */
  before?: string;
  /** Filing/priority-date lower bound (YYYYMMDD). */
  after?: string;
}

export interface PatentsDetailParams {
  /** Publication number (e.g. "US10000000B2", "EP3097156B1"). */
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
  /** Zero-based page index (each page ≈ 100 tiles). */
  page?: number;
  /** Max tiles to return (1-500, client-side cap). */
  results?: number;
  safe?: "off" | "active";
  /** Raw Google tbs filter (e.g. `qdr:d`). */
  tbs?: string;
  /** Size: `l`, `m`, `i`, `xXl`, `xxl`, `xxxl`. */
  imgsz?: string;
  /** Colour: `color`, `gray`, `transparent`, `red`, `orange`, … */
  imgcolor?: string;
  /** Type: `face`, `photo`, `clipart`, `lineart`, `animated`. */
  imgtype?: string;
}

// ===== Videos =====

export interface VideosSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  /** Zero-based page index (each page ≈ 10 tiles). */
  page?: number;
  /** Google domain (`google.com`, `google.co.uk`, …). */
  domain?: string;
  /** City-level geo-targeting. */
  location?: string;
  /** Language restrict (e.g. `lang_en`). */
  lr?: string;
  /** UULE-encoded location. */
  uule?: string;
  /** `1` disables auto-correction. */
  nfpr?: number;
  safe?: "off" | "active";
  /** Time/duration chip: `qdr:d/w/m`, `dur:s/m/l`. */
  tbs?: string;
}

// ===== Finance =====

export interface FinanceQuoteParams {
  /** Ticker, optionally with exchange — `AAPL`, `AAPL:NASDAQ`, `BTC-USD`, `EURUSD`. */
  q: string;
  hl?: string;
  gl?: string;
}

// ===== AI Mode =====

export interface AiModeSearchParams {
  q: string;
  gl?: string;
  hl?: string;
}

// ===== Lens =====

/**
 * Params for `/v1/google/lens/search`. Response carries `lens_results`
 * (Scrapingdog parity — each item has `title`, `source`,
 * `source_favicon`, `thumbnail`, optional `tag` price chip and
 * `in_stock`) plus `related_searches` chips. Legacy `results` alias
 * retained for backwards compat.
 */
export interface LensSearchParams {
  /** Public URL of the image to search visually. */
  url: string;
  /** Optional text refinement (e.g. `"pizza"`) to bias Lens. */
  query?: string;
  /** ISO country code — Scrapingdog-parity alias for `gl`. */
  country?: string;
  /** Language code — Scrapingdog-parity alias for `hl`. */
  language?: string;
  gl?: string;
  hl?: string;
  /** Bias towards shoppable product matches. */
  product?: boolean;
  /** Include the visual-matches carousel (default: true). */
  visual_matches?: boolean;
  /** Restrict to exact-match results only. */
  exact_matches?: boolean;
}

// ===== Products =====

/**
 * Params for `/v1/google/products/detail`. Backed by Google's
 * `/async/oapv` RPC — full product payload (title, brand, price, rating,
 * specs) in ~2s via warm-session curl_cffi.
 */
export interface ProductsDetailParams {
  /** Google Shopping `gpcid`. Search results expose this on each tile. */
  product_id: string;
  /** Original search query — required, used to build the oapv context blob. */
  q: string;
  gl?: string;
  hl?: string;
  /** Extra IDs Google surfaces on Shopping tiles. Improves routing accuracy. */
  catalog_id?: string;
  image_docid?: string;
  headline_offer_docid?: string;
  mid?: string;
  /** When true, also fetches `/async/piu_ps` for the merchant offers list. */
  include_offers?: boolean;
  /** When true, also fetches `/async/toy_v` for size/colour variants. */
  include_variants?: boolean;
}

// ===== Shorts =====

export interface ShortsSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  domain?: string;
  /** Max tiles to return (1-60 cap). */
  num?: number;
  /** Pagination offset. */
  start?: number;
  safe?: "off" | "active";
  /** `1` disables auto-correction. */
  nfpr?: number;
  /** Raw Google tbs filter (e.g. `qdr:d`). */
  tbs?: string;
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
