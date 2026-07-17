/**
 * TypeScript types for eBay API responses.
 *
 * These interfaces mirror the backend `ebay_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 * Every datetime field ships in BOTH `*_utc` (number) and `*_at` (string) form.
 */

// =============================================================================
// Shared Types
// =============================================================================

/**
 * A parsed price with both the numeric value and its raw rendering.
 */
export interface EbayPrice {
  /** Numeric price value */
  value: number | null;
  /** ISO currency code (e.g. "USD") */
  currency: string | null;
  /** Currency symbol (e.g. "$") */
  symbol: string | null;
  /** Raw rendered price string (e.g. "$29.99") */
  raw: string | null;
}

/**
 * Page-number pagination (eBay listings use 1-based `_pgn` numbers).
 */
export interface Pagination {
  /** Current page number (1-indexed) */
  current_page: number;
  /** Results per page, if known */
  per_page: number | null;
  /** Total number of pages, if known */
  total_pages: number | null;
  /** Total number of results, if known */
  total_results: number | null;
}

/**
 * A single supported marketplace (for /markets).
 */
export interface MarketInfo {
  /** Market code (e.g. "US", "GB", "DE") */
  code: string;
  /** eBay domain suffix (e.g. "com", "co.uk") */
  domain: string;
  /** Country name */
  country: string;
  /** Currency code (e.g. "USD") */
  currency: string;
  /** Locale (e.g. "en-US") */
  locale: string;
  /** Market display name */
  name: string;
  /** eBay site id */
  site_id: number;
}

/**
 * A reference category alias (for /categories).
 */
export interface CategoryInfo {
  /** Category display name */
  name: string;
  /** Category id */
  category_id: string;
  /** Parent category name, if any */
  parent: string | null;
}

/**
 * A single image with optional dimensions.
 */
export interface Image {
  url: string;
  width: number | null;
  height: number | null;
}

/**
 * A single shipping option (per-destination rate from JSON-LD or DOM).
 */
export interface ShippingOption {
  cost: EbayPrice | null;
  is_free: boolean | null;
  service: string | null;
  destination_country: string | null;
  delivery_estimate: string | null;
}

// =============================================================================
// Search / Listings (cards)
// =============================================================================

/**
 * One eBay search/listing card (search, seller items, category, sold).
 */
export interface SearchResult {
  position: number;
  item_id: string | null;
  product_id: string | null;
  title: string | null;
  url: string | null;
  image: string | null;
  price: EbayPrice | null;
  original_price: EbayPrice | null;
  discount_percent: number | null;
  currency: string | null;
  condition: string | null;
  brand: string | null;
  /** "Buy It Now" | "Auction" | "Best Offer" */
  buying_format: string | null;
  is_auction: boolean;
  bids: number | null;
  time_left: string | null;
  /** Auctions: the current high bid (mirrors `price`); null for non-auctions */
  current_bid: EbayPrice | null;
  shipping: string | null;
  shipping_cost: EbayPrice | null;
  free_shipping: boolean | null;
  location: string | null;
  returns: string | null;
  sold_count: number | null;
  /** Sale date text as rendered by eBay, e.g. "2 Jul 2026" (completed/sold cards; localized on non-English markets) */
  sold_date: string | null;
  /** Best-effort ISO date, e.g. "2026-07-02"; null when the market's format isn't English */
  sold_date_at: string | null;
  watchers: number | null;
  coupon: string | null;
  rating: number | null;
  ratings_total: number | null;
  seller_name: string | null;
  seller_feedback_percent: number | null;
  seller_feedback_score: number | null;
  /** e.g. "eBay Refurbished" */
  program_badge: string | null;
  is_sponsored: boolean;
}

// =============================================================================
// Item Detail (/items/{item_id})
// =============================================================================

/**
 * The seller summary attached to an item.
 */
export interface ItemSeller {
  username: string | null;
  url: string | null;
  feedback_score: number | null;
  feedback_percent: number | null;
  store_name: string | null;
  store_url: string | null;
}

/**
 * The returns policy for an item.
 */
export interface ReturnsPolicy {
  accepted: boolean | null;
  /** e.g. "30 days" */
  period: string | null;
  /** "buyer" | "seller" */
  cost_paid_by: string | null;
  raw: string | null;
}

/**
 * Full item detail (PDP).
 */
export interface Item {
  item_id: string;
  product_id: string | null;
  legacy_item_id: string | null;
  title: string | null;
  subtitle: string | null;
  url: string | null;
  condition: string | null;
  condition_id: string | null;
  condition_description: string | null;
  price: EbayPrice | null;
  original_price: EbayPrice | null;
  discount_percent: number | null;
  currency: string | null;
  availability: string | null;
  quantity_available: number | null;
  quantity_sold: number | null;
  watchers: number | null;
  buying_format: string | null;
  is_auction: boolean;
  bids: number | null;
  time_left: string | null;
  /** Auctions: the current high bid (mirrors `price`); null for non-auctions */
  current_bid: EbayPrice | null;
  /** Absolute auction end time, Unix timestamp (float seconds); null for non-auctions */
  end_time_utc: number | null;
  /** Absolute auction end time, ISO-8601 Z string; null for non-auctions */
  end_time_at: string | null;
  /** BIN price: fixed-price listings (== price) or auction-with-Buy-It-Now; null for pure auctions */
  buy_it_now_price: EbayPrice | null;
  best_offer_enabled: boolean | null;
  brand: string | null;
  mpn: string | null;
  model: string | null;
  color: string | null;
  gtin: string | null;
  main_image: string | null;
  images: Image[];
  images_count: number;
  description: string | null;
  seller_notes: string | null;
  item_specifics: Record<string, string>;
  categories: string[];
  category_id: string | null;
  shipping_options: ShippingOption[];
  shipping_cost: EbayPrice | null;
  free_shipping: boolean | null;
  item_location: string | null;
  ships_to: string[];
  returns: ReturnsPolicy | null;
  seller: ItemSeller | null;
  rating: number | null;
  ratings_total: number | null;
  date_modified_utc: number | null;
  date_modified_at: string | null;
  scraped_utc: number | null;
  scraped_at: string | null;
}

// =============================================================================
// Seller Profile (/sellers/{username})
// =============================================================================

/**
 * Positive / neutral / negative feedback counts for a window.
 */
export interface FeedbackBreakdown {
  positive: number | null;
  neutral: number | null;
  negative: number | null;
}

/**
 * A seller profile.
 */
export interface Seller {
  username: string;
  url: string | null;
  store_name: string | null;
  store_url: string | null;
  feedback_score: number | null;
  feedback_percent: number | null;
  member_since: string | null;
  location: string | null;
  items_for_sale: number | null;
  feedback_12mo: FeedbackBreakdown | null;
  top_rated: boolean | null;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/**
 * A single seller feedback entry.
 */
export interface FeedbackEntry {
  /** "positive" | "neutral" | "negative" */
  rating: string | null;
  comment: string | null;
  rater: string | null;
  item: string | null;
  date_raw: string | null;
  date_utc: number | null;
  date_at: string | null;
}

// =============================================================================
// Reviews (/items/{item_id}/reviews)
// =============================================================================

/**
 * Per-star rating distribution.
 */
export interface RatingHistogram {
  five_star: number | null;
  four_star: number | null;
  three_star: number | null;
  two_star: number | null;
  one_star: number | null;
}

/**
 * A single catalog product review.
 */
export interface Review {
  title: string | null;
  body: string | null;
  rating: number | null;
  author: string | null;
  date_raw: string | null;
  date_utc: number | null;
  date_at: string | null;
  helpful_votes: number | null;
  verified_purchase: boolean;
}

// =============================================================================
// Autocomplete (/autocomplete)
// =============================================================================

/**
 * A single keyword suggestion.
 */
export interface AutocompleteSuggestion {
  value: string;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** Response from the /search and /completed endpoints. */
export interface SearchResponse {
  query: string | null;
  domain: string;
  category_id: string | null;
  sold: boolean;
  results: SearchResult[];
  facets: Record<string, string[]>;
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /items/{item_id} endpoint. */
export interface ItemDetailResponse {
  domain: string;
  item: Item;
}

/** Response from the /sellers/{username} endpoint. */
export interface SellerProfileResponse {
  domain: string;
  seller: Seller;
}

/** Response from the /sellers/{username}/items endpoint. */
export interface SellerItemsResponse {
  domain: string;
  username: string;
  results: SearchResult[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /sellers/{username}/feedback endpoint. */
export interface SellerFeedbackResponse {
  domain: string;
  username: string;
  feedback: FeedbackEntry[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /items/{item_id}/reviews endpoint. */
export interface ReviewsResponse {
  domain: string;
  item_id: string | null;
  product_id: string | null;
  rating: number | null;
  ratings_total: number | null;
  histogram: RatingHistogram | null;
  reviews: Review[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /categories/{category_id}/items endpoint. */
export interface CategoryResponse {
  domain: string;
  category_id: string;
  results: SearchResult[];
  facets: Record<string, string[]>;
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /autocomplete endpoint. */
export interface AutocompleteResponse {
  query: string;
  domain: string;
  suggestions: AutocompleteSuggestion[];
}

/** Response from the /markets endpoint. */
export interface MarketsResponse {
  markets: MarketInfo[];
}

/** Response from the /categories endpoint. */
export interface CategoriesResponse {
  categories: CategoryInfo[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Sort order for search / listing endpoints. */
export type EbaySortBy =
  | "best_match"
  | "ending_soonest"
  | "newly_listed"
  | "price_low_to_high"
  | "price_high_to_low";

/** Item condition filter. */
export type EbayCondition = "new" | "open_box" | "refurbished" | "used" | "for_parts";

/** Buying-format filter. */
export type EbayBuyingFormat = "auction" | "buy_it_now" | "best_offer";

/** Parameters for searching active eBay listings. */
export interface EbaySearchParams {
  /** Search keywords (required) */
  query: string;
  /** Marketplace domain (default: "com") */
  domain?: string;
  /** Restrict to a category id */
  category_id?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (60, 120 or 240; clamped) */
  per_page?: number;
  /** Sort order */
  sort_by?: EbaySortBy;
  /** Item condition filter */
  condition?: EbayCondition;
  /** Buying-format filter */
  buying_format?: EbayBuyingFormat;
  /** Minimum price filter */
  min_price?: number;
  /** Maximum price filter */
  max_price?: number;
  /** Restrict to free-shipping listings */
  free_shipping?: boolean;
}

/** Parameters for searching completed / sold eBay listings. */
export interface EbayCompletedParams {
  /** Search keywords (required) */
  query: string;
  /** Marketplace domain (default: "com") */
  domain?: string;
  /** Restrict to a category id */
  category_id?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (60, 120 or 240; clamped) */
  per_page?: number;
  /** Sort order */
  sort_by?: EbaySortBy;
  /** Item condition filter */
  condition?: EbayCondition;
  /** Minimum price filter */
  min_price?: number;
  /** Maximum price filter */
  max_price?: number;
}

/** Options for the item detail endpoint. */
export interface EbayItemParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
}

/** Options for the item reviews endpoint. */
export interface EbayReviewsParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Fetch reviews by catalog product id instead of item id */
  productId?: string;
}

/** Options for the seller profile endpoint. */
export interface EbaySellerParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
}

/** Options for the seller items endpoint. */
export interface EbaySellerItemsParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
  /** Filter the seller's listings by keyword */
  query?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (60, 120 or 240; clamped) */
  per_page?: number;
}

/** Options for the seller feedback endpoint. */
export interface EbaySellerFeedbackParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
}

/** Options for the category-browse endpoint. */
export interface EbayCategoryParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Results per page (60, 120 or 240; clamped) */
  per_page?: number;
  /** Sort order */
  sort_by?: EbaySortBy;
  /** Minimum price filter */
  min_price?: number;
  /** Maximum price filter */
  max_price?: number;
}

/** Options for the autocomplete endpoint. */
export interface EbayAutocompleteParams {
  /** Marketplace domain (default: "com") */
  domain?: string;
}
