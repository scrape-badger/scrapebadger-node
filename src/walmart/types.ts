/**
 * TypeScript types for the Walmart API.
 *
 * These interfaces mirror the backend `walmart_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 *
 * Walmart is US-only (walmart.com). walmart.ca / walmart.com.mx run on
 * different platforms with different payload shapes, so there is no market or
 * country parameter anywhere in this module.
 */

/** An untyped JSON object passed through verbatim from Walmart's payload. */
export type WalmartRaw = Record<string, unknown>;

// =============================================================================
// Shared value objects
// =============================================================================

/** A single price point. Walmart nests several of these per item. */
export interface WalmartPrice {
  price: number | null;
  currency: string | null;
  price_string: string | null;
  price_display: string | null;
  support_text: string | null;
  variant_price_string: string | null;
}

/** A min/max price span, with gift-card denominations when applicable. */
export interface WalmartPriceRange {
  min_price: number | null;
  max_price: number | null;
  currency: string | null;
  price_string: string | null;
  denominations: number[];
}

/** The full price block — current, was/list, unit, savings and range. */
export interface WalmartPriceInfo {
  current_price: WalmartPrice | null;
  was_price: WalmartPrice | null;
  list_price: WalmartPrice | null;
  unit_price: WalmartPrice | null;
  comparison_price: WalmartPrice | null;
  subscription_price: WalmartPrice | null;
  shipping_price: WalmartPrice | null;
  price_range: WalmartPriceRange | null;
  savings_amount: number | null;
  savings_string: string | null;
  is_price_reduced: boolean | null;
  price_display_codes: WalmartRaw;
  additional_fees: WalmartRaw[];
  volume_price_tiers: WalmartRaw[];
}

/** A product image. */
export interface WalmartImage {
  id: string | null;
  url: string | null;
  zoomable: boolean | null;
}

/** A product video with its per-quality versions. */
export interface WalmartVideo {
  title: string | null;
  poster: string | null;
  versions: WalmartRaw;
  captions: WalmartRaw[];
}

/** One breadcrumb node in the category trail. */
export interface WalmartBreadcrumb {
  name: string | null;
  url: string | null;
}

/** Specification / highlight / warning / at-a-glance row. */
export interface WalmartNameValue {
  name: string | null;
  value: string | null;
  icon_url: string | null;
}

/** A named group of specification rows. */
export interface WalmartSpecificationGroup {
  group_name: string | null;
  specifications: WalmartNameValue[];
}

/** A merchandising badge (rollback, best seller, …). */
export interface WalmartBadge {
  id: string | null;
  text: string | null;
  type: string | null;
  key: string | null;
}

/** Shipping / pickup / delivery option with its live availability. */
export interface WalmartFulfillmentOption {
  type: string | null;
  availability_status: string | null;
  availability_type: string | null;
  inventory_status: string | null;
  available_quantity: number | null;
  is_low_in_stock: boolean | null;
  location_text: string | null;
  max_order_quantity: number | null;
  order_limit: number | null;
  restricted: boolean | null;
  selected: boolean | null;
  speed_details: WalmartRaw | null;
}

/** Per-method SLA and promised delivery dates. */
export interface WalmartFulfillmentSummary {
  fulfillment: string | null;
  fulfillment_badge: string | null;
  fulfillment_price: number | null;
  fulfillment_methods: string[];
  delivery_date: string | null;
  max_delivery_date: string | null;
  store_delivery_date: string | null;
  store_max_delivery_date: string | null;
  store_id: string | null;
  store_timezone: string | null;
  /**
   * Walmart returns SLA as a structured object
   * (`{unitOfMeasure, minimumValue, maximumValue, rank}`), not a string.
   */
  sla: WalmartRaw | null;
  regular_sla: WalmartRaw | null;
  calculated_sla_days: number | null;
  is_express: boolean | null;
  is_free_for_wplus: boolean | null;
}

/** Return eligibility, window and policy text. */
export interface WalmartReturnPolicy {
  returnable: boolean | null;
  returnable_to_store: boolean | null;
  free_returns: boolean | null;
  return_window: string | null;
  return_policy_type: string | null;
  return_policy_text: string | null;
  return_policy_condition: string | null;
  return_location: string | null;
  holiday_return_enabled: boolean | null;
}

/** One selectable variant (colour / size / capacity …). */
export interface WalmartVariant {
  id: string | null;
  us_item_id: string | null;
  name: string | null;
  variant_type: string | null;
  value: string | null;
  type_name: string | null;
  value_name: string | null;
  url: string | null;
  price: number | null;
  in_stock: boolean | null;
  available: boolean | null;
  selected: boolean | null;
  image_url: string | null;
  images: string[];
  swatch_image_url: string | null;
}

/** Refurbished / pre-owned / new alternative offer on the same product. */
export interface WalmartConditionOffer {
  offer_id: string | null;
  condition: string | null;
  is_condition_new: boolean | null;
  availability_status: string | null;
  price: number | null;
  price_string: string | null;
  /**
   * Walmart returns this as null, a bool, or a nested object depending on the
   * item — normalised to "are there other conditions on offer?".
   */
  more_conditions: boolean | null;
}

/** A promotion or offer attached to the product. */
export interface WalmartPromotion {
  id: string | null;
  type: string | null;
  description: string | null;
  terms: string | null;
}

/** Grocery items only — Walmart's structured nutrition block. */
export interface WalmartNutritionFacts {
  calorie_info: WalmartRaw | null;
  key_nutrients: WalmartRaw | null;
  vitamin_minerals: WalmartRaw | null;
  serving_info: WalmartRaw | null;
  additional_disclaimer: string | null;
}

/** Manufacturer warranty information. */
export interface WalmartWarranty {
  information: string | null;
  length: string | null;
  url: string | null;
}

/**
 * Which store/postcode Walmart resolved this response against.
 *
 * Walmart derives the assortment store from the exit IP's geography — it
 * cannot be pinned by cookie or query param. Prices and availability are
 * therefore store-specific whether the caller asked for it or not, so the
 * resolved location is returned explicitly rather than left implicit.
 */
export interface WalmartLocationContext {
  postal_code: string | null;
  city: string | null;
  state: string | null;
  store_id: string | null;
  intent: string | null;
}

/** Seller as it appears on a product — not the full seller profile. */
export interface WalmartEmbeddedSeller {
  seller_id: string | null;
  /** Use THIS as the id for `sellers.get()` — the 32-char hex `seller_id` 404s. */
  catalog_seller_id: string | null;
  seller_name: string | null;
  seller_display_name: string | null;
  seller_type: string | null;
  seller_logo_url: string | null;
  seller_storefront_url: string | null;
  seller_average_rating: number | null;
  seller_review_count: number | null;
  has_seller_badge: boolean | null;
  is_pro_seller: boolean | null;
  wfs_enabled: boolean | null;
  wfs_provider_name: string | null;
}

// =============================================================================
// Product
// =============================================================================

/** Full Walmart product detail (PDP). */
export interface WalmartProduct {
  // Identity
  us_item_id: string | null;
  item_id: string | null;
  product_id: string | null;
  primary_product_id: string | null;
  offer_id: string | null;
  upc: string | null;
  gtin: string | null;
  model: string | null;
  manufacturer_product_id: string | null;
  sku: string | null;

  // Descriptive
  name: string | null;
  brand: string | null;
  brand_url: string | null;
  short_description: string | null;
  long_description: string | null;
  /** Walmart's own generative-AI description, as an HTML `<ul>`. */
  ai_description_html: string | null;
  /** Walmart's own generative-AI concise summary, as a highlight list. */
  ai_highlights: WalmartNameValue[];
  url: string | null;
  canonical_url: string | null;
  item_type: string | null;
  product_type_id: string | null;
  class_type: string | null;
  sales_unit: string | null;
  gender: string | null;

  // Taxonomy
  category_path: string | null;
  category_path_id: string | null;
  breadcrumbs: WalmartBreadcrumb[];
  department_name: string | null;

  // Media
  image_url: string | null;
  images: WalmartImage[];
  videos: WalmartVideo[];

  // Pricing
  price: number | null;
  currency: string | null;
  price_info: WalmartPriceInfo | null;
  promotions: WalmartPromotion[];
  promo_text: string | null;

  // Availability & fulfilment
  availability_status: string | null;
  in_stock: boolean | null;
  is_out_of_stock: boolean | null;
  fulfillment_type: string | null;
  fulfillment_options: WalmartFulfillmentOption[];
  fulfillment_summary: WalmartFulfillmentSummary[];
  shipping_option: string | null;
  pickup_option: string | null;
  order_limit: number | null;
  order_min_limit: number | null;
  is_preorder: boolean | null;
  is_blitz_item: boolean | null;
  aisle: string | null;
  location: WalmartLocationContext | null;
  add_on_services: WalmartRaw[];
  has_care_plans: boolean | null;

  // Ratings
  rating: number | null;
  review_count: number | null;

  // Seller
  seller: WalmartEmbeddedSeller | null;
  additional_offer_count: number | null;
  transactable_offer_count: number | null;
  condition_offers: WalmartConditionOffer[];

  // Condition
  condition: string | null;
  is_condition_new: boolean | null;
  is_preowned: boolean | null;
  preowned_condition: string | null;

  // Variants
  variants: WalmartVariant[];
  variant_criteria: WalmartRaw[];
  selected_variant_ids: string[];

  // Rich content
  specifications: WalmartNameValue[];
  specification_groups: WalmartSpecificationGroup[];
  highlights: WalmartNameValue[];
  warnings: WalmartNameValue[];
  warranty: WalmartWarranty | null;
  nutrition_facts: WalmartNutritionFacts | null;
  ingredients: string | null;
  badges: WalmartBadge[];
  trust_badges: WalmartRaw[];
  return_policy: WalmartReturnPolicy | null;
  product_disclaimers: WalmartRaw[];

  // Eligibility flags buyers actually filter on
  snap_eligible: boolean | null;
  fsa_eligible: boolean | null;
  subscription_eligible: boolean | null;
  is_customizable: boolean | null;
  free_shipping: boolean | null;
  buy_now_eligible: boolean | null;
  legal_restriction: string | null;

  // Reviews sample (saves a second call for shallow use cases)
  rating_distribution: WalmartRatingDistribution | null;
  top_reviews: WalmartReview[];
  review_aspects: WalmartRaw[];
  review_summary: string | null;
}

// =============================================================================
// Search / category
// =============================================================================

/** One product card in a search or category result set. */
export interface WalmartSearchItem {
  us_item_id: string | null;
  item_id: string | null;
  product_id: string | null;
  offer_id: string | null;
  name: string | null;
  brand: string | null;
  manufacturer_name: string | null;
  url: string | null;
  canonical_url: string | null;
  image_url: string | null;
  images: string[];
  description: string | null;
  short_description: string | null;

  price: number | null;
  currency: string | null;
  price_string: string | null;
  was_price: number | null;
  price_info: WalmartPriceInfo | null;
  price_per_unit: string | null;

  rating: number | null;
  review_count: number | null;

  in_stock: boolean | null;
  is_out_of_stock: boolean | null;
  availability_status: string | null;
  fulfillment_type: string | null;
  fulfillment_badges: string[];
  fulfillment_speed: string[];
  shipping_option: string | null;

  seller_id: string | null;
  seller_name: string | null;
  seller_type: string | null;

  is_sponsored: boolean | null;
  is_two_day_shipping: boolean | null;
  badges: WalmartBadge[];
  variants: WalmartVariant[];
  category: string | null;
  department_name: string | null;
  item_type: string | null;
  condition: string | null;
  is_preowned: boolean | null;
  snap_eligible: boolean | null;
  /** 1-based rank across the merged organic result set. */
  position: number | null;
  /** Walmart's raw itemStackPosition — the index of the STACK the item came
   *  from, shared by every item in that stack. Not a rank. */
  stack_position: number | null;
  product_location: string | null;
  additional_offer_count: number | null;
}

/** A page of search, category, deals or seller-catalogue results. */
export interface WalmartSearchResponse {
  query: string | null;
  url: string | null;
  page: number;
  /**
   * Walmart's OWN claimed total. Deliberately NOT called `total_results`: it
   * reports ~14,700 for a query that stops returning products after page 10.
   * It moves correctly when a filter is applied, so it is a useful relative
   * signal — just not a reachable count. Use `max_page` to bound a crawl.
   */
  total_results_reported: number | null;
  /** The measured page ceiling for this surface (10 search / 11 browse). */
  max_page: number | null;
  result_count: number;
  has_more_pages: boolean | null;
  sort: string | null;
  title: string | null;
  breadcrumbs: WalmartBreadcrumb[];
  related_searches: string[];
  spelling_correction: string | null;
  items: WalmartSearchItem[];
}

// =============================================================================
// Reviews
// =============================================================================

/** The star histogram and its aggregate counts. */
export interface WalmartRatingDistribution {
  average_rating: number | null;
  rounded_average_rating: number | null;
  total_review_count: number | null;
  reviews_with_text_count: number | null;
  recommended_percentage: number | null;
  total_media_count: number | null;
  one_star: number | null;
  two_star: number | null;
  three_star: number | null;
  four_star: number | null;
  five_star: number | null;
  one_star_percent: number | null;
  two_star_percent: number | null;
  three_star_percent: number | null;
  four_star_percent: number | null;
  five_star_percent: number | null;
}

/** A single customer review. */
export interface WalmartReview {
  review_id: string | null;
  rating: number | null;
  title: string | null;
  text: string | null;
  author: string | null;
  /** ISO 8601 UTC string. */
  submitted_at: string | null;
  /** Unix seconds. */
  submitted_utc: number | null;
  verified_purchase: boolean | null;
  helpful_count: number | null;
  not_helpful_count: number | null;
  photos: string[];
  media: WalmartRaw[];
  badges: WalmartBadge[];
  user_badges: WalmartBadge[];
  seller_name: string | null;
  fulfilled_by: string | null;
  condition: string | null;
  syndication_source: string | null;
  original_language: string | null;
  aspects: WalmartRaw[];
  client_responses: WalmartRaw[];
}

/** A page of reviews (10 per page — Walmart's size, not adjustable). */
export interface WalmartReviewsResponse {
  item_id: string | null;
  url: string | null;
  page: number;
  sort: string | null;
  result_count: number;
  distribution: WalmartRatingDistribution | null;
  aspects: WalmartRaw[];
  review_summary: string | null;
  top_positive_review: WalmartReview | null;
  top_negative_review: WalmartReview | null;
  reviews: WalmartReview[];
}

// =============================================================================
// Seller
// =============================================================================

/** A marketplace seller's public profile. */
export interface WalmartSeller {
  seller_id: string | null;
  catalog_seller_id: string | null;
  name: string | null;
  display_name: string | null;
  seller_type: string | null;
  url: string | null;
  logo_url: string | null;
  banner_url: string | null;
  about: string | null;
  email: string | null;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  country_code: string | null;
  rating: number | null;
  review_count: number | null;
  has_seller_badge: boolean | null;
  is_pro_seller: boolean | null;
  is_alcohol_seller: boolean | null;
  deactivation_status: string | null;
  tax_policy: string | null;
}

/**
 * Seller profile.
 *
 * No product list: `/seller/{id}` renders its catalogue client-side. Use
 * `sellers.products()` — it goes through search with a `retailer_id` facet.
 */
export interface WalmartSellerResponse {
  seller: WalmartSeller;
  featured_items: WalmartSearchItem[];
}

// =============================================================================
// Stores
// =============================================================================

/** One day of opening hours. */
export interface WalmartStoreHours {
  day: string | null;
  start: string | null;
  end: string | null;
  closed: boolean | null;
}

/**
 * An in-store department (pharmacy, deli, auto centre …).
 *
 * Each carries its OWN phone and opening hours, which differ from the store's.
 */
export interface WalmartStoreService {
  name: string | null;
  display_name: string | null;
  phone: string | null;
  open_24_hours: boolean | null;
  hours: WalmartStoreHours[];
}

/** A physical Walmart store. */
export interface WalmartStore {
  store_id: string | null;
  name: string | null;
  display_name: string | null;
  store_type: string | null;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_miles: number | null;
  timezone: string | null;
  open_24_hours: boolean | null;
  is_spark_store: boolean | null;
  is_glass_eligible: boolean | null;
  hours: WalmartStoreHours[];
  services: WalmartStoreService[];
  access_types: string[];
}

/** A store plus the stores around it — one fetch, several answers. */
export interface WalmartStoreResponse {
  store: WalmartStore;
  departments: string[];
  /** Populated only for stores with a fuel station. */
  fuel_prices: WalmartRaw[];
  nearby_count: number;
  nearby_stores: WalmartStore[];
}

// =============================================================================
// Autocomplete
// =============================================================================

/** One search-box suggestion. */
export interface WalmartSuggestion {
  query: string | null;
  type: string | null;
  image_url: string | null;
  url: string | null;
  department_id: string | null;
  department_name: string | null;
}

/** Search-box suggestions for a partial term. */
export interface WalmartAutocompleteResponse {
  query: string;
  result_count: number;
  suggestions: WalmartSuggestion[];
}

// =============================================================================
// Reference
// =============================================================================

/** A supported Walmart market. Only `US` / walmart.com is supported. */
export interface WalmartMarket {
  code: string;
  name: string;
  domain: string;
  currency: string;
  language: string;
}

/** The supported-markets list. */
export interface WalmartMarketsResponse {
  result_count: number;
  markets: WalmartMarket[];
}

// =============================================================================
// Request parameter types
// =============================================================================

/**
 * Result ordering for `/search` and `/sellers/{id}/products`.
 *
 * Not available on `/category` — Walmart's browse pages ignore sort.
 */
export type WalmartSortBy =
  "best_match" | "best_seller" | "price_low" | "price_high" | "rating_high" | "new";

/** Review ordering for `/products/{id}/reviews`. */
export type WalmartReviewSort =
  "relevancy" | "submission-desc" | "submission-asc" | "rating-desc" | "rating-asc" | "helpful";

/** Options for the search endpoint. */
export interface WalmartSearchParams {
  /** Page number, 1-10. Results dry up past page 10 whatever the total says. */
  page?: number;
  sort?: WalmartSortBy;
  min_price?: number;
  max_price?: number;
  /**
   * Facet filter, e.g. `"brand:HP"`. Facets can be APPLIED but not enumerated —
   * Walmart renders the filter rail client-side.
   */
  facet?: string;
}

/** Options for the category-browse endpoint (no `sort` — browse ignores it). */
export interface WalmartCategoryParams {
  /** Page number, 1-11. */
  page?: number;
  min_price?: number;
  max_price?: number;
  /** Facet filter, e.g. `"brand:HP"`. */
  facet?: string;
}

/** Options for the deals endpoint. */
export interface WalmartDealsParams {
  /** Page number, 1-11. */
  page?: number;
  min_price?: number;
  max_price?: number;
}

/** Options for the product-reviews endpoint. */
export interface WalmartReviewsParams {
  /** Page number, 1-100. 10 reviews per page. */
  page?: number;
  sort?: WalmartReviewSort;
}

/** Options for the seller-catalogue endpoint. */
export interface WalmartSellerProductsParams {
  /** Page number, 1-10. */
  page?: number;
  sort?: WalmartSortBy;
}
