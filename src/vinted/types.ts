/**
 * TypeScript types for Vinted API responses.
 *
 * This module contains all the data types used by the Vinted API client.
 */

// =============================================================================
// Common Types
// =============================================================================

/**
 * A price with amount and currency.
 */
export interface VintedPrice {
  /** Price amount as a string (e.g. "12.50") */
  amount: string;
  /** ISO currency code (e.g. "EUR") */
  currency_code: string;
}

/**
 * A photo attached to a Vinted item.
 */
export interface VintedPhoto {
  /** Unique photo identifier */
  id: number;
  /** Photo URL */
  url: string;
  /** Dominant color hex code */
  dominant_color: string | null;
  /** Whether this is the main/cover photo */
  is_main: boolean;
  /** Image width in pixels */
  width: number | null;
  /** Image height in pixels */
  height: number | null;
  /** Full resolution image URL */
  full_size_url: string | null;
}

/**
 * Brief user information shown on item listings.
 */
export interface VintedUserSummary {
  /** Unique user identifier */
  id: number;
  /** Username / login handle */
  login: string;
  /** Profile photo URL */
  photo_url: string | null;
  /** Whether the user is a business account */
  business: boolean;
}

/**
 * Seller summary with feedback and item stats.
 */
export interface VintedSellerSummary extends VintedUserSummary {
  /** Total number of feedback ratings */
  feedback_count: number;
  /** Overall feedback reputation score (0-1) */
  feedback_reputation: number;
  /** Number of items listed */
  item_count: number;
  /** Seller's location */
  location: string | null;
  /** Last activity timestamp (ISO format) */
  last_seen: string | null;
  /** Achievement badges */
  badges: string[];
}

// =============================================================================
// Item Types
// =============================================================================

/**
 * A Vinted item summary as returned in search results and listings.
 */
export interface VintedItemSummary {
  /** Unique item identifier */
  id: number;
  /** Item title */
  title: string;
  /** Item price */
  price: VintedPrice;
  /** Brand name */
  brand_title: string;
  /** Size label */
  size_title: string;
  /** Item condition status */
  status: string;
  /** Item URL on Vinted */
  url: string;
  /** Number of users who favorited this item */
  favourite_count: number;
  /** Number of views */
  view_count: number;
  /** Item owner summary */
  user: VintedUserSummary;
  /** Main photo */
  photo: VintedPhoto;
  /** All photos */
  photos: VintedPhoto[];
}

/**
 * Full item detail with all metadata.
 */
export interface VintedItemDetail extends VintedItemSummary {
  /** Item description */
  description: string;
  /** Catalog category identifier */
  catalog_id: number;
  /** Primary color */
  color1: string;
  /** Seller details */
  seller: VintedSellerSummary;
  /** Category name */
  category: string;
  /** Upload timestamp (ISO format) */
  upload_date: string;
  /** Whether the item can be purchased */
  can_buy: boolean;
  /** Whether instant buy is enabled */
  instant_buy: boolean;
  /** Whether the listing is closed */
  is_closed: boolean;
  /** Whether the item is reserved */
  is_reserved: boolean;
  /** Whether the item is hidden */
  is_hidden: boolean;
  /** Size identifier */
  size_id: number;
  /** Status identifier */
  status_id: number;
  /** Brand identifier */
  brand_id: number;
}

// =============================================================================
// User Types
// =============================================================================

/**
 * Full Vinted user profile.
 */
export interface VintedUserProfile {
  /** Unique user identifier */
  id: number;
  /** Username / login handle */
  login: string;
  /** Profile photo URL */
  photo_url: string | null;
  /** Whether the user is a business account */
  business: boolean;
  /** ISO country code */
  country_code: string;
  /** City name */
  city: string;
  /** Total feedback count */
  feedback_count: number;
  /** Overall feedback reputation (0-1) */
  feedback_reputation: number;
  /** Number of positive ratings */
  positive_feedback_count: number;
  /** Number of neutral ratings */
  neutral_feedback_count: number;
  /** Number of negative ratings */
  negative_feedback_count: number;
  /** Number of items listed */
  item_count: number;
  /** Number of followers */
  followers_count: number;
  /** Number of users this user follows */
  following_count: number;
  /** Whether the user is currently online */
  is_online: boolean;
  /** Whether the user is on holiday mode */
  is_on_holiday: boolean;
  /** Last login timestamp (Unix) */
  last_loged_on_ts: string;
  /** Full profile URL */
  profile_url: string;
  /** User locale */
  locale: string;
}

// =============================================================================
// Reference Types
// =============================================================================

/**
 * A Vinted brand.
 */
export interface VintedBrand {
  /** Unique brand identifier */
  id: number;
  /** Brand name */
  title: string;
  /** URL-friendly slug */
  slug: string;
  /** Number of items with this brand */
  item_count: number;
  /** Number of users who favorited this brand */
  favourite_count: number;
  /** Whether the brand is classified as luxury */
  is_luxury: boolean;
  /** Brand page URL */
  url: string;
}

/**
 * A Vinted color option.
 */
export interface VintedColor {
  /** Unique color identifier */
  id: number;
  /** Color display name */
  title: string;
  /** Hex color code */
  hex: string;
  /** Internal color code */
  code: string;
}

/**
 * A Vinted item condition status.
 */
export interface VintedStatus {
  /** Unique status identifier */
  id: number;
  /** Status display name */
  title: string;
}

/**
 * A Vinted marketplace/country.
 */
export interface VintedMarket {
  /** Market code (e.g. "fr", "de") */
  code: string;
  /** Vinted domain for this market */
  domain: string;
  /** Country name */
  country: string;
  /** Currency code */
  currency: string;
  /** Market display name */
  name: string;
}

// =============================================================================
// Pagination
// =============================================================================

/**
 * Pagination metadata for list responses.
 */
export interface VintedPagination {
  /** Current page number */
  current_page: number;
  /** Total number of pages */
  total_pages: number;
  /** Total number of entries */
  total_entries: number;
  /** Items per page */
  per_page: number;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Response from the search endpoint.
 */
export interface SearchResponse {
  /** List of matching items */
  items: VintedItemSummary[];
  /** Pagination metadata */
  pagination: VintedPagination;
  /** Market code used for this search */
  market: string;
}

/**
 * Response from the item detail endpoint.
 */
export interface ItemDetailResponse {
  /** Full item details */
  item: VintedItemDetail;
  /** Market code used */
  market: string;
}

/**
 * Response from the user profile endpoint.
 */
export interface UserProfileResponse {
  /** Full user profile */
  user: VintedUserProfile;
  /** Market code used */
  market: string;
}

/**
 * Response from the user items endpoint.
 */
export interface UserItemsResponse {
  /** List of user's items */
  items: VintedItemSummary[];
  /** Pagination metadata */
  pagination: VintedPagination;
  /** Market code used */
  market: string;
}

/**
 * Response from the brands endpoint.
 */
export interface BrandsResponse {
  /** List of brands */
  brands: VintedBrand[];
  /** Pagination metadata (null when no pagination) */
  pagination: VintedPagination | null;
}

/**
 * Response from the colors endpoint.
 */
export interface ColorsResponse {
  /** List of available colors */
  colors: VintedColor[];
}

/**
 * Response from the statuses endpoint.
 */
export interface StatusesResponse {
  /** List of item condition statuses */
  statuses: VintedStatus[];
}

/**
 * Response from the markets endpoint.
 */
export interface MarketsResponse {
  /** List of available markets */
  markets: VintedMarket[];
}

// =============================================================================
// Search Parameters
// =============================================================================

/**
 * Parameters for searching Vinted items.
 */
export interface VintedSearchParams {
  /** Search query string */
  query: string;
  /** Market code (default: "fr") */
  market?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  per_page?: number;
  /** Minimum price filter */
  price_from?: number;
  /** Maximum price filter */
  price_to?: number;
  /** Comma-separated brand IDs */
  brand_ids?: string;
  /** Comma-separated color IDs */
  color_ids?: string;
  /** Comma-separated status IDs */
  status_ids?: string;
  /** Sort order */
  order?: "relevance" | "newest_first" | "price_low_to_high" | "price_high_to_low";
}
