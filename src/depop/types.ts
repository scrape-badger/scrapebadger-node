/**
 * TypeScript types for Depop API responses.
 *
 * These interfaces mirror the backend `depop_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises
 * them (`seller_username`, `original_price`, `is_sold`); optional / nullable
 * backend fields are typed as `Type | null` or left `?`-optional.
 *
 * Depop is a single-host target (www.depop.com) localised by a `market`
 * param → country + currency. Data is browser-rendered, so responses carry
 * the raw parsed cards/detail rather than an underlying JSON API shape.
 */

// =============================================================================
// Shared
// =============================================================================

/** One Depop product card (search / user-products result element). */
export interface DepopCard {
  /** Product slug (last URL segment). */
  slug: string;
  /** Full product URL. */
  url: string;
  /** Seller's Depop username. */
  seller_username?: string;
  /** Brand name. */
  brand?: string;
  /** Item size label. */
  size?: string;
  /** Current price (as displayed). */
  price?: string;
  /** Original price before markdown. */
  original_price?: string;
  /** Currency code / symbol for the price. */
  currency?: string;
  /** Primary product image URL. */
  image?: string;
  /** Whether the item is marked sold. */
  is_sold: boolean;
}

/** Result-set metadata for a paginated listing. */
export interface SearchMeta {
  result_count: number;
  page: number;
  has_more: boolean;
}

/** A supported Depop market (for /markets). */
export interface DepopMarket {
  code: string;
  country_code: string;
  currency: string;
  name: string;
}

// =============================================================================
// Response Envelopes
// =============================================================================

export interface DepopSearchResponse {
  products: DepopCard[];
  meta: SearchMeta;
  market: string;
  query: string;
}

/** Full Depop product detail. */
export interface DepopProductDetail {
  id?: number;
  slug: string;
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  condition?: string | null;
  price?: string | null;
  currency?: string | null;
  availability?: string | null;
  seller_username?: string | null;
  images: string[];
  url: string;
}

/** A Depop shop / seller profile. */
export interface DepopShopProfile {
  username: string;
  name?: string | null;
  description?: string | null;
  rating_value?: string | null;
  rating_count?: number | null;
  follower_count?: number | null;
  url: string;
}

export interface DepopUserProductsResponse {
  username: string;
  products: DepopCard[];
  meta: SearchMeta;
  market: string;
}

export interface DepopMarketsResponse {
  markets: DepopMarket[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Options for the /search endpoint. */
export interface DepopSearchParams {
  /** Market code (default: "us"). Localises country + currency. */
  market?: string;
  /** Results per page (1-24, default: 24). */
  perPage?: number;
  /** Page number (default: 1). */
  page?: number;
  /** Minimum price filter. */
  priceMin?: number;
  /** Maximum price filter. */
  priceMax?: number;
  /** Brand filter(s). */
  brands?: string;
  /** Size filter(s). */
  sizes?: string;
  /** Colour filter(s). */
  colours?: string;
  /** Condition filter(s). */
  conditions?: string;
  /** Gender filter. */
  gender?: string;
  /** Sort order. */
  sort?: string;
}

/** Options for the /products/{slug} endpoint. */
export interface DepopProductParams {
  /** Market code (default: "us"). */
  market?: string;
}

/** Options for the /users/{username} endpoint. */
export interface DepopUserParams {
  /** Market code (default: "us"). */
  market?: string;
}

/** Options for the /users/{username}/products endpoint. */
export interface DepopUserProductsParams {
  /** Market code (default: "us"). */
  market?: string;
  /** Results per page (1-24, default: 24). */
  perPage?: number;
  /** Page number (default: 1). */
  page?: number;
}
