/**
 * Gumtree API client.
 *
 * Gumtree endpoints: search (listings with category, location/postcode radius,
 * price, seller-type and category-specific filters), searchFilters (the
 * filters, sort orders and radius options a category offers, with live
 * counts), getListing (full detail incl. vehicle spec and seller),
 * getSellerListings, keyword autocomplete, locationAutocomplete, the location
 * and category trees, and listMarkets.
 *
 * Three markets, chosen per call with `market`: `"uk"` (gumtree.com, GBP — the
 * server default), `"au"` (gumtree.com.au, AUD) and `"za"` (gumtree.co.za,
 * ZAR). They are separate sites: uk takes slugs for category and location,
 * au takes numeric ids and za takes refs (`"p6dnh"`) from `listCategories` /
 * `listLocations` of the same market.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GumtreeAutocompleteResponse,
  GumtreeFiltersResponse,
  GumtreeListingDetail,
  GumtreeLocationAutocompleteResponse,
  GumtreeMarketParams,
  GumtreeMarketsResponse,
  GumtreeSearchFiltersParams,
  GumtreeSearchParams,
  GumtreeSearchResponse,
  GumtreeSellerListingsParams,
  GumtreeSellerListingsResponse,
  GumtreeTreeParams,
  GumtreeTreeResponse,
} from "./types.js";

/**
 * Client for all Gumtree API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search used BMWs within 25 miles of a UK postcode
 * const results = await client.gumtree.search({
 *   category: "cars",
 *   location: "SW1A 1AA",
 *   distance: 25,
 *   filters: "vehicle_make:bmw,vehicle_fuel_type:petrol",
 * });
 * for (const listing of results.listings) {
 *   console.log(listing.title, listing.price_text, listing.distance_text);
 * }
 *
 * // Australia: numeric ids — cars (18320) within 10 km of Sydney
 * const au = await client.gumtree.search({
 *   market: "au",
 *   category: "18320",
 *   location: "3003435",
 *   distance: 10,
 * });
 *
 * // South Africa: refs — Cars & Bakkies (p6dnh) in Gauteng (dkp8y)
 * const za = await client.gumtree.search({
 *   market: "za",
 *   category: "p6dnh",
 *   location: "dkp8y",
 *   filters: "make:toyota",
 * });
 * const detail = await client.gumtree.getListing("ls26bvmcpnsqmz7l9jz", { market: "za" });
 * console.log(detail.seller?.name);
 *
 * // Browse a market's category tree
 * const tree = await client.gumtree.listCategories({ market: "au" });
 * ```
 */
export class GumtreeClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Gumtree listings in the UK, Australia or South Africa.
   *
   * @param params - Optional query, category, location (+ distance radius),
   *   price, sort, seller type, urgent/photo flags (uk only),
   *   category-specific filters, page (1-50) and market.
   * @returns uk ~25-30 listings per page (Gumtree pins up to 5 paid featured
   *   ads, `is_featured`, above the chosen sort order), au 24, za 20. Prices
   *   are in `currency`.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid, or not supported
   *   by the market.
   */
  async search(params: GumtreeSearchParams = {}): Promise<GumtreeSearchResponse> {
    return this.client.request<GumtreeSearchResponse>("/v1/gumtree/search", {
      params: {
        query: params.query,
        category: params.category,
        location: params.location,
        distance: params.distance,
        min_price: params.min_price,
        max_price: params.max_price,
        sort: params.sort,
        seller_type: params.seller_type,
        urgent_only: params.urgent_only,
        with_photos: params.with_photos,
        filters: params.filters,
        page: params.page,
        market: params.market,
      },
    });
  }

  /**
   * The filters, sort orders and radius options Gumtree offers for a category.
   *
   * Each filter lists its values with live result counts. Feed a `key` and a
   * `value` back into {@link search} as `filters: "key:value"`.
   *
   * @param params - Optional category (default `"all"`), location (default:
   *   the whole country), query to scope the counts, already-applied
   *   `filters` (za only) and market.
   */
  async searchFilters(params: GumtreeSearchFiltersParams = {}): Promise<GumtreeFiltersResponse> {
    return this.client.request<GumtreeFiltersResponse>("/v1/gumtree/search/filters", {
      params: {
        category: params.category,
        location: params.location,
        query: params.query,
        filters: params.filters,
        market: params.market,
      },
    });
  }

  /**
   * Full listing: description, every attribute, images, location, seller and
   * similar ads. Motors listings carry the full vehicle spec.
   *
   * @param listingId - Gumtree listing id from the end of the listing URL
   *   (uk/au: ~10 digits; za: the listing ref, e.g. `"ls26bvmcpnsqmz7l9jz"`).
   * @param options - Optional parameters (market).
   * @throws NotFoundError - If the listing does not exist or has expired.
   */
  async getListing(
    listingId: string,
    options: GumtreeMarketParams = {}
  ): Promise<GumtreeListingDetail> {
    return this.client.request<GumtreeListingDetail>(`/v1/gumtree/listings/${listingId}`, {
      params: { market: options.market },
    });
  }

  /**
   * Every live listing by the seller of `listingId`. Gumtree keys a seller's
   * ad list by one of their ads, so any listing id of theirs works.
   *
   * @param listingId - Any Gumtree listing id belonging to the seller (za: a
   *   listing ref, e.g. `"ls26bvmcpnsqmz7l9jz"`).
   * @param options - Page number (1-50), or `{ page, market }`.
   */
  async getSellerListings(
    listingId: string,
    options: number | GumtreeSellerListingsParams = {}
  ): Promise<GumtreeSellerListingsResponse> {
    const { page, market }: GumtreeSellerListingsParams =
      typeof options === "number" ? { page: options } : options;
    return this.client.request<GumtreeSellerListingsResponse>(
      `/v1/gumtree/listings/${listingId}/seller-listings`,
      { params: { page, market } }
    );
  }

  /**
   * Gumtree search-box keyword suggestions, each with the category it maps to.
   *
   * @param query - Partial search term, e.g. `"iph"`.
   * @param options - Optional parameters (market).
   */
  async autocomplete(
    query: string,
    options: GumtreeMarketParams = {}
  ): Promise<GumtreeAutocompleteResponse> {
    return this.client.request<GumtreeAutocompleteResponse>("/v1/gumtree/autocomplete", {
      params: { query, market: options.market },
    });
  }

  /**
   * Resolve a place name or postcode prefix to Gumtree locations. The `id`
   * (au: a number; za: a ref such as `"pfw8k"`) or `name` (uk) is what
   * {@link search} takes as `location`.
   *
   * @param query - Town, area or postcode prefix (min 2 chars), e.g. `"manch"` or `"SW1A"`.
   * @param options - Optional parameters (market).
   */
  async locationAutocomplete(
    query: string,
    options: GumtreeMarketParams = {}
  ): Promise<GumtreeLocationAutocompleteResponse> {
    return this.client.request<GumtreeLocationAutocompleteResponse>(
      "/v1/gumtree/locations/autocomplete",
      { params: { query, market: options.market } }
    );
  }

  /**
   * Browse Gumtree's location tree. uk: UK -> nations -> counties -> towns;
   * au: states -> regions -> areas; za: provinces -> towns and suburbs.
   *
   * @param options - Location id (uk/au: a number; za: a ref such as
   *   `"dkp8y"` for Gauteng) to list the children of, or
   *   `{ parent_id, market }`. Unset = the market's root (the whole country).
   */
  async listLocations(
    options: number | string | GumtreeTreeParams = {}
  ): Promise<GumtreeTreeResponse> {
    return this.client.request<GumtreeTreeResponse>("/v1/gumtree/locations", {
      params: treeParams(options),
    });
  }

  /**
   * Browse Gumtree's category tree. A node's `slug` (uk) or `id` (au: a
   * number; za: a ref such as `"p6dnh"`) is the {@link search} category.
   *
   * @param options - Category id (uk/au: a number; za: a ref such as
   *   `"l4dq6"` for Vehicles) to list the children of, or
   *   `{ parent_id, market }`. Unset = the market's root (all categories).
   */
  async listCategories(
    options: number | string | GumtreeTreeParams = {}
  ): Promise<GumtreeTreeResponse> {
    return this.client.request<GumtreeTreeResponse>("/v1/gumtree/categories", {
      params: treeParams(options),
    });
  }

  /**
   * The Gumtree sites this API covers (`uk`, `au`, `za`), with their domain,
   * currency, distance unit, page size and id format.
   */
  async listMarkets(): Promise<GumtreeMarketsResponse> {
    return this.client.request<GumtreeMarketsResponse>("/v1/gumtree/markets");
  }

  // --- BEGIN generated by sdk/codegen/facade — do not edit ---

  /** Search suggestions. Generated from the OpenAPI spec; returns the raw response object. */
  async searchSuggestions(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/autocomplete", { params });
  }

  /** List categories. Generated from the OpenAPI spec; returns the raw response object. */
  async getListcategories(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/categories", { params });
  }

  /** Get listing. Generated from the OpenAPI spec; returns the raw response object. */
  async getGetlisting(
    listingId: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request(`/v1/gumtree/listings/${listingId}`, { params });
  }

  /** Get seller listings. Generated from the OpenAPI spec; returns the raw response object. */
  async getGetsellerlistings(
    listingId: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request(`/v1/gumtree/listings/${listingId}/seller-listings`, { params });
  }

  /** List locations. Generated from the OpenAPI spec; returns the raw response object. */
  async getListlocations(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/locations", { params });
  }

  /** Location suggestions. Generated from the OpenAPI spec; returns the raw response object. */
  async locationSuggestions(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/locations/autocomplete", { params });
  }

  /** List markets. Generated from the OpenAPI spec; returns the raw response object. */
  async getListmarkets(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/markets", { params });
  }

  /** Search listings. Generated from the OpenAPI spec; returns the raw response object. */
  async searchListings(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/search", { params });
  }

  /** Get search filters. Generated from the OpenAPI spec; returns the raw response object. */
  async getSearchFilters(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request("/v1/gumtree/search/filters", { params });
  }
  // --- END generated by sdk/codegen/facade ---
}

/**
 * `listLocations` / `listCategories` take a bare parent id (a number on uk/au,
 * a ref string on za) or `{ parent_id, market }`.
 */
function treeParams(options: number | string | GumtreeTreeParams) {
  const { parent_id, market }: GumtreeTreeParams =
    typeof options === "object" ? options : { parent_id: options };
  return { parent_id, market };
}
