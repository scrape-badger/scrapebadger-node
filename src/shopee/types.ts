/**
 * TypeScript types for Shopee API responses.
 *
 * These interfaces mirror the backend `shopee_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 * Every timestamp field ships in BOTH `*_utc` (number) and `*_at` (string) form.
 *
 * Supported markets: id, ph, vn, br, my, th, sg, tw, co, cl, mx.
 */

// =============================================================================
// Sub-models
// =============================================================================

/**
 * Per-star rating counts for a product.
 */
export interface RatingBreakdown {
  rating_star: number | null;
  /** Array of counts per star level [1★, 2★, 3★, 4★, 5★] */
  rating_count: number[];
  rcount_with_context: number | null;
  rcount_with_image: number | null;
}

/**
 * A product image with its CDN hash and resolved URL.
 */
export interface ProductImage {
  hash: string;
  url: string;
}

/**
 * A purchasable variation (SKU) of a product.
 */
export interface ProductModel {
  model_id: number | null;
  name: string | null;
  /** Normalised price in market currency */
  price: number | null;
  /** Raw Shopee-scaled integer price (×100000) */
  price_raw: number | null;
  price_before_discount: number | null;
  stock: number | null;
  sold: number | null;
  currency: string | null;
  sku: string | null;
}

/**
 * A name/value specification attribute of a product.
 */
export interface ProductAttribute {
  name: string | null;
  value: string | null;
  id: number | null;
}

// =============================================================================
// Product
// =============================================================================

/**
 * A Shopee product — covers both search-result and full PDP shapes.
 */
export interface ShopeeProduct {
  item_id: number;
  shop_id: number;
  name: string | null;
  /** Normalised price in market currency */
  price: number | null;
  /** Raw Shopee-scaled integer price (×100000) */
  price_raw: number | null;
  price_min: number | null;
  price_max: number | null;
  price_before_discount: number | null;
  discount: string | null;
  currency: string | null;
  rating_star: number | null;
  rating_count_total: number | null;
  rating: RatingBreakdown | null;
  stock: number | null;
  sold: number | null;
  historical_sold: number | null;
  liked_count: number | null;
  comment_count: number | null;
  view_count: number | null;
  image: string | null;
  images: ProductImage[];
  description: string | null;
  brand: string | null;
  categories: string[];
  attributes: ProductAttribute[];
  models: ProductModel[];
  tier_variations: Record<string, unknown>[];
  shop_location: string | null;
  shop_name: string | null;
  is_official_shop: boolean | null;
  is_preferred_plus_seller: boolean | null;
  item_status: string | null;
  is_adult: boolean | null;
  condition: number | null;
  /** Unix timestamp of item creation */
  ctime_utc: number | null;
  /** ISO-8601 UTC string of item creation */
  created_at: string | null;
  url: string | null;
}

// =============================================================================
// Search / Category listing
// =============================================================================

/**
 * A page of search/category results.
 */
export interface SearchResult {
  market: string;
  keyword: string | null;
  category_id: number | null;
  total_count: number | null;
  page: number;
  limit: number;
  has_more: boolean;
  next_offset: number | null;
  items: ShopeeProduct[];
}

// =============================================================================
// Reviews
// =============================================================================

/**
 * A seller's reply to a review.
 */
export interface ReviewReply {
  comment: string | null;
  ctime_utc: number | null;
  created_at: string | null;
}

/**
 * A single product rating/review.
 */
export interface ShopeeReview {
  comment_id: number | null;
  item_id: number | null;
  shop_id: number | null;
  order_id: number | null;
  rating_star: number | null;
  comment: string | null;
  author_username: string | null;
  author_shopid: number | null;
  author_portrait: string | null;
  anonymous: boolean | null;
  images: string[];
  videos: Record<string, unknown>[];
  product_variation: string | null;
  like_count: number | null;
  reply: ReviewReply | null;
  ctime_utc: number | null;
  created_at: string | null;
  editable: number | null;
  is_hidden: boolean | null;
}

/**
 * Aggregate rating summary returned alongside reviews.
 */
export interface ReviewSummary {
  rating_star: number | null;
  rating_total: number | null;
  /** Array of counts per star level */
  rating_count: number[];
  rcount_with_media: number | null;
  rcount_with_context: number | null;
}

/**
 * A page of reviews for a product.
 */
export interface ReviewsResult {
  market: string;
  item_id: number;
  shop_id: number;
  offset: number;
  limit: number;
  has_more: boolean;
  next_offset: number | null;
  summary: ReviewSummary | null;
  reviews: ShopeeReview[];
}

// =============================================================================
// Categories
// =============================================================================

/**
 * A node in the Shopee category tree.
 */
export interface CategoryNode {
  category_id: number;
  parent_id: number | null;
  name: string | null;
  display_name: string | null;
  image: string | null;
  no_sub: boolean | null;
  block_buyer_platform: number[];
  children: CategoryNode[];
}

/**
 * The full category tree for a market.
 */
export interface CategoryTree {
  market: string;
  categories: CategoryNode[];
}

// =============================================================================
// Markets
// =============================================================================

/**
 * A single supported Shopee marketplace.
 */
export interface ShopeeMarket {
  /** Market code (e.g. "sg", "my", "ph") */
  code: string;
  /** Shopee domain (e.g. "shopee.sg") */
  domain: string;
  /** Country name */
  country: string;
  /** Currency code (e.g. "SGD") */
  currency: string;
  /** Locale (e.g. "en") */
  locale: string;
  /** Market display name */
  name: string;
}

/**
 * Response from the /v1/shopee/markets endpoint.
 */
export interface MarketsResponse {
  markets: ShopeeMarket[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Parameters for searching Shopee products. */
export interface ShopeeSearchParams {
  /** Search keyword string */
  keyword: string;
  /** Shopee market code (default: "sg") */
  market?: string;
  /** Maximum number of results (default: 60) */
  limit?: number;
  /** Pagination offset (default: 0) */
  offset?: number;
  /** Sort order (default: "relevancy") */
  sort_by?: "relevancy" | "ctime" | "sales" | "price_low_to_high" | "price_high_to_low";
}

/** Parameters for category-items listing. */
export interface ShopeeCategoryItemsParams {
  /** Shopee market code (default: "sg") */
  market?: string;
  /** Maximum number of results (default: 60) */
  limit?: number;
  /** Pagination offset (default: 0) */
  offset?: number;
  /** Sort order (default: "relevancy") */
  sort_by?: "relevancy" | "ctime" | "sales" | "price_low_to_high" | "price_high_to_low";
}

/** Options for fetching product detail. */
export interface ShopeeProductParams {
  /** Shopee market code (default: "sg") */
  market?: string;
}

/** Options for fetching product reviews. */
export interface ShopeeReviewsParams {
  /** Shopee market code (default: "sg") */
  market?: string;
  /** Maximum number of reviews (default: 20) */
  limit?: number;
  /** Pagination offset (default: 0) */
  offset?: number;
  /** Star filter — 0=all, 1-5 for a specific star count (default: 0) */
  rating?: number;
  /** Content filter — 0=all, 1=comment, 2=media, 3=local (default: 0) */
  filter?: number;
}

/** Options for fetching the category tree. */
export interface ShopeeCategoriesParams {
  /** Shopee market code (default: "sg") */
  market?: string;
}
