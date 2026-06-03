/**
 * TypeScript types for Amazon API responses.
 *
 * These interfaces mirror the backend `amazon_scraper` response schema
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
export interface AmazonPrice {
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
 * Page-number pagination (Amazon listings use 1-based page numbers).
 */
export interface Pagination {
  /** Current page number (1-indexed) */
  current_page: number;
  /** Total number of pages, if known */
  total_pages: number | null;
  /** Total number of results, if known */
  total_results: number | null;
}

/**
 * A single supported marketplace (for /markets).
 */
export interface MarketInfo {
  /** Market code (e.g. "US", "UK", "DE") */
  code: string;
  /** Amazon domain suffix (e.g. "com", "co.uk") */
  domain: string;
  /** Country name */
  country: string;
  /** Currency code (e.g. "USD") */
  currency: string;
  /** Locale (e.g. "en-US") */
  locale: string;
  /** Market display name */
  name: string;
}

/**
 * A reference category / department alias (for /categories).
 */
export interface CategoryInfo {
  /** Category display name */
  name: string;
  /** Category alias */
  alias: string;
  /** Search alias used in /search `category` param */
  search_alias: string | null;
  /** Bestsellers browse-node ID */
  bestseller_node: string | null;
}

// =============================================================================
// Product Types (/products/{asin})
// =============================================================================

/**
 * Per-star rating distribution (percentages 0-100).
 */
export interface RatingBreakdown {
  five_star: number | null;
  four_star: number | null;
  three_star: number | null;
  two_star: number | null;
  one_star: number | null;
}

/**
 * A single bestsellers-rank entry for a product.
 */
export interface BestsellersRankEntry {
  rank: number | null;
  category: string | null;
  link: string | null;
}

/**
 * A buying option / variation of a product.
 */
export interface ProductVariant {
  asin: string;
  attributes: Record<string, string>;
  price: AmazonPrice | null;
  is_current: boolean;
}

/**
 * The featured-offer (buybox) winner shown on the product page.
 */
export interface Buybox {
  seller_name: string | null;
  seller_id: string | null;
  price: AmazonPrice | null;
  fulfillment: string | null;
}

/**
 * Promotional badges attached to a product.
 */
export interface ProductBadges {
  amazons_choice: boolean;
  amazons_choice_keyword: string | null;
  best_seller: boolean;
  prime: boolean;
  climate_pledge_friendly: boolean;
}

/**
 * A clippable coupon on the product page.
 */
export interface Coupon {
  text: string | null;
  discount: string | null;
}

/**
 * A deal active on the product page.
 */
export interface ProductDeal {
  type: string | null;
  price: AmazonPrice | null;
  ends_at: string | null;
}

/**
 * Delivery information shown on the product page.
 */
export interface Delivery {
  message: string | null;
  date: string | null;
  is_free: boolean | null;
}

/**
 * A related product (frequently-bought-together / also-bought).
 */
export interface RelatedProduct {
  asin: string;
  title: string | null;
  link: string | null;
  image: string | null;
  price: AmazonPrice | null;
}

/**
 * Full product detail (PDP).
 */
export interface Product {
  asin: string;
  parent_asin: string | null;
  title: string | null;
  link: string | null;
  brand: string | null;
  brand_url: string | null;
  manufacturer: string | null;
  model_number: string | null;
  price: AmazonPrice | null;
  list_price: AmazonPrice | null;
  savings_amount: AmazonPrice | null;
  discount_percent: number | null;
  rating: number | null;
  ratings_total: number | null;
  rating_breakdown: RatingBreakdown | null;
  bought_past_month: string | null;
  in_stock: boolean | null;
  availability: string | null;
  feature_bullets: string[];
  description: string | null;
  main_image: string | null;
  images: string[];
  images_count: number;
  videos: string[];
  videos_count: number;
  has_aplus_content: boolean;
  variants: ProductVariant[];
  variant_asins: string[];
  categories: string[];
  bestsellers_rank: BestsellersRankEntry[];
  attributes: Record<string, string>;
  specifications: Record<string, string>;
  dimensions: string | null;
  weight: string | null;
  first_available: string | null;
  country_of_origin: string | null;
  buybox: Buybox | null;
  sold_by: string | null;
  ships_from: string | null;
  fulfilled_by: string | null;
  is_amazon_seller: boolean | null;
  badges: ProductBadges;
  coupon: Coupon | null;
  deal: ProductDeal | null;
  delivery: Delivery | null;
  frequently_bought_together: RelatedProduct[];
  also_bought: RelatedProduct[];
  answered_questions: number | null;
  /** The product page's embedded featured reviews (max 8). */
  top_reviews: Review[];
  scraped_utc: number | null;
  scraped_at: string | null;
}

// =============================================================================
// Search Types (/search)
// =============================================================================

/**
 * A single search / category-browse result row.
 */
export interface SearchResult {
  position: number;
  asin: string;
  title: string | null;
  link: string | null;
  image: string | null;
  price: AmazonPrice | null;
  list_price: AmazonPrice | null;
  unit_price: string | null;
  rating: number | null;
  ratings_total: number | null;
  is_prime: boolean;
  is_sponsored: boolean;
  is_amazons_choice: boolean;
  is_best_seller: boolean;
  bought_past_month: string | null;
  coupon: string | null;
  availability: string | null;
}

// =============================================================================
// Offer Types (/products/{asin}/offers)
// =============================================================================

/**
 * The seller behind a specific offer.
 */
export interface OfferSeller {
  name: string | null;
  id: string | null;
  link: string | null;
  rating: number | null;
  ratings_total: number | null;
  ratings_percentage_positive: number | null;
}

/**
 * The condition of an offered item.
 */
export interface OfferCondition {
  is_new: boolean | null;
  title: string | null;
  comments: string | null;
}

/**
 * Delivery terms for a specific offer.
 */
export interface OfferDelivery {
  is_free: boolean | null;
  fulfilled_by_amazon: boolean | null;
  date: string | null;
  price: AmazonPrice | null;
}

/**
 * A single seller offer for a product.
 */
export interface Offer {
  position: number;
  seller: OfferSeller | null;
  price: AmazonPrice | null;
  condition: OfferCondition | null;
  delivery: OfferDelivery | null;
  buybox_winner: boolean;
  is_prime: boolean;
  minimum_order_quantity: number | null;
  maximum_order_quantity: number | null;
}

// =============================================================================
// Review Types (/products/{asin}/reviews)
// =============================================================================

/**
 * The reviewer's public profile.
 */
export interface ReviewProfile {
  name: string | null;
  link: string | null;
  id: string | null;
  image: string | null;
}

/**
 * A single product review.
 */
export interface Review {
  id: string | null;
  title: string | null;
  body: string | null;
  rating: number | null;
  date_raw: string | null;
  date_utc: number | null;
  date_at: string | null;
  review_country: string | null;
  is_global_review: boolean;
  profile: ReviewProfile | null;
  verified_purchase: boolean;
  vine_program: boolean;
  helpful_votes: number | null;
  variant: string | null;
  images: string[];
}

// =============================================================================
// Bestseller / New-release Types (/bestsellers, /new-releases)
// =============================================================================

/**
 * A single bestseller / new-release row.
 */
export interface Bestseller {
  rank: number | null;
  position: number;
  asin: string;
  title: string | null;
  link: string | null;
  image: string | null;
  rating: number | null;
  ratings_total: number | null;
  price: AmazonPrice | null;
}

// =============================================================================
// Deal Types (/deals)
// =============================================================================

/**
 * A single deal row.
 */
export interface Deal {
  position: number;
  asin: string;
  title: string | null;
  link: string | null;
  image: string | null;
  deal_price: AmazonPrice | null;
  list_price: AmazonPrice | null;
  discount_percent: number | null;
  deal_type: string | null;
  is_lightning_deal: boolean;
  badge: string | null;
  ends_at_utc: number | null;
  ends_at: string | null;
}

// =============================================================================
// Seller Types (/sellers/{seller_id})
// =============================================================================

/**
 * Feedback counts for a single rolling window.
 */
export interface FeedbackWindow {
  positive: number | null;
  neutral: number | null;
  negative: number | null;
  count: number | null;
}

/**
 * Seller feedback summary across rolling windows.
 *
 * Note: the 12-month / 90-day / 30-day windows ship on the wire under the
 * keys `12mo`, `90d` and `30d`.
 */
export interface SellerFeedbackSummary {
  lifetime: FeedbackWindow | null;
  /** 12-month feedback window */
  "12mo": FeedbackWindow | null;
  /** 90-day feedback window */
  "90d": FeedbackWindow | null;
  /** 30-day feedback window */
  "30d": FeedbackWindow | null;
}

/**
 * A seller profile.
 */
export interface Seller {
  seller_id: string;
  name: string | null;
  link: string | null;
  rating: number | null;
  ratings_total: number | null;
  ratings_percentage_positive: number | null;
  feedback: SellerFeedbackSummary | null;
  business_name: string | null;
  business_address: string | null;
  member_since: string | null;
}

/**
 * A single buyer-feedback entry for a seller.
 */
export interface SellerFeedbackEntry {
  rating: number | null;
  comment: string | null;
  rater: string | null;
  date_raw: string | null;
  date_utc: number | null;
  date_at: string | null;
}

// =============================================================================
// Autocomplete Types (/autocomplete)
// =============================================================================

/**
 * A single keyword suggestion.
 */
export interface AutocompleteSuggestion {
  value: string;
  alias: string | null;
}

// =============================================================================
// Response Envelopes
// =============================================================================

/** Response from the /search endpoint. */
export interface SearchResponse {
  query: string;
  domain: string;
  results: SearchResult[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /products/{asin} endpoint. */
export interface ProductDetailResponse {
  domain: string;
  product: Product;
}

/** Response from the /products/{asin}/offers endpoint. */
export interface OffersResponse {
  asin: string;
  domain: string;
  buybox: Offer | null;
  offers: Offer[];
  total_offers: number | null;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /products/{asin}/reviews endpoint. */
export interface ReviewsResponse {
  asin: string;
  domain: string;
  reviews: Review[];
  rating: number | null;
  ratings_total: number | null;
  rating_breakdown: RatingBreakdown | null;
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /bestsellers endpoint. */
export interface BestsellersResponse {
  domain: string;
  category: string | null;
  bestsellers: Bestseller[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /new-releases endpoint. */
export interface NewReleasesResponse {
  domain: string;
  category: string | null;
  new_releases: Bestseller[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /deals endpoint. */
export interface DealsResponse {
  domain: string;
  category: string | null;
  deals: Deal[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /category endpoint. */
export interface CategoryResponse {
  domain: string;
  node: string;
  results: SearchResult[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /sellers/{seller_id} endpoint. */
export interface SellerProfileResponse {
  domain: string;
  seller: Seller;
}

/** Response from the /sellers/{seller_id}/products endpoint. */
export interface SellerProductsResponse {
  domain: string;
  seller_id: string;
  products: SearchResult[];
  pagination: Pagination;
  scraped_utc: number | null;
  scraped_at: string | null;
}

/** Response from the /sellers/{seller_id}/feedback endpoint. */
export interface SellerFeedbackResponse {
  domain: string;
  seller_id: string;
  feedback: SellerFeedbackEntry[];
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

/** Parameters for searching Amazon products. */
export interface AmazonSearchParams {
  /** Search query string */
  query: string;
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Sort order (e.g. "price_low_to_high", "featured", "review_rank") */
  sort_by?: string;
  /** Category / department alias to scope the search */
  category?: string;
  /** Minimum price filter */
  min_price?: number;
  /** Maximum price filter */
  max_price?: number;
  /** Delivery ZIP / postal code for localized price & availability */
  zip?: string;
  /** Preferred content language / locale (e.g. "en_US") */
  language?: string;
}

/** Options for fetching product detail. */
export interface AmazonProductParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Delivery ZIP / postal code */
  zip?: string;
  /** Preferred content language (e.g. "en_US") */
  language?: string;
}

/** Options for fetching product offers. */
export interface AmazonOffersParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Delivery ZIP / postal code */
  zip?: string;
}

/** Options for fetching product reviews. */
export interface AmazonReviewsParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Sort order ("helpful" or "recent") */
  sort_by?: "helpful" | "recent";
  /** Filter by star rating (e.g. "five_star", "one_star") */
  star?: string;
  /** Restrict to verified-purchase reviews */
  verified_only?: boolean;
  /** Restrict to reviews containing images / video */
  media_only?: boolean;
}

/** Options for the bestsellers / new-releases endpoints. */
export interface AmazonListingsParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Bestsellers / new-releases node or category alias */
  category?: string;
  /** Page number (1-indexed) */
  page?: number;
}

/** Options for the deals endpoint. */
export interface AmazonDealsParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Deals category filter */
  category?: string;
  /** Page number (1-indexed) */
  page?: number;
}

/** Options for the category-browse endpoint. */
export interface AmazonCategoryParams {
  /** Browse-node ID (required) */
  node: string;
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Sort order */
  sort_by?: string;
}

/** Options for seller storefront products / feedback endpoints. */
export interface AmazonSellerListParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
  /** Page number (1-indexed) */
  page?: number;
}

/** Options for the seller profile endpoint. */
export interface AmazonSellerParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
}

/** Options for the autocomplete endpoint. */
export interface AmazonAutocompleteParams {
  /** Amazon marketplace domain (default: "com") */
  domain?: string;
}
