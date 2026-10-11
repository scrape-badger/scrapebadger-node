/**
 * Gumtree API client.
 *
 * Gumtree endpoints: search (listings with category, location/postcode radius,
 * price, seller-type and category-specific filters), searchFilters (the
 * filters, sort orders and radius options a category offers, with live
 * counts), getListing (full detail incl. vehicle spec and seller),
 * getSellerListings, keyword autocomplete, locationAutocomplete, and the
 * location and category trees. UK-only: gumtree.com is the single supported
 * market, prices are in GBP.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GumtreeAutocompleteResponse,
  GumtreeFiltersResponse,
  GumtreeListingDetail,
  GumtreeLocationAutocompleteResponse,
  GumtreeSearchFiltersParams,
  GumtreeSearchParams,
  GumtreeSearchResponse,
  GumtreeSellerListingsResponse,
  GumtreeTreeResponse,
} from "./types.js";

/**
 * Client for all Gumtree API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search used BMWs within 25 miles of a postcode
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
 * // Full listing detail with vehicle spec and seller
 * const detail = await client.gumtree.getListing("1803293391");
 * console.log(detail.seller?.name);
 *
 * // Browse the category tree
 * const tree = await client.gumtree.listCategories();
 * ```
 */
export class GumtreeClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search gumtree.com listings.
   *
   * @param params - Optional query, category, location (+ distance radius),
   *   price, sort, seller type, urgent/photo flags, category-specific filters
   *   and page (1-50).
   * @returns ~25-30 listings per page. Gumtree pins up to 5 paid featured ads
   *   (`is_featured`) above the chosen sort order.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
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
      },
    });
  }

  /**
   * The filters, sort orders and radius options Gumtree offers for a category.
   *
   * Each filter lists its values with live result counts. Feed a `key` and a
   * `value` back into {@link search} as `filters: "key:value"`.
   *
   * @param params - Optional category (default `"all"`), location (default
   *   `"uk"`) and query to scope the counts.
   */
  async searchFilters(params: GumtreeSearchFiltersParams = {}): Promise<GumtreeFiltersResponse> {
    return this.client.request<GumtreeFiltersResponse>("/v1/gumtree/search/filters", {
      params: {
        category: params.category,
        location: params.location,
        query: params.query,
      },
    });
  }

  /**
   * Full listing: description, every attribute, images, location, seller and
   * similar ads. Motors listings carry the full vehicle spec.
   *
   * @param listingId - Gumtree listing id — the number at the end of a
   *   `gumtree.com/p/...` URL.
   * @throws NotFoundError - If the listing does not exist or has expired.
   */
  async getListing(listingId: string): Promise<GumtreeListingDetail> {
    return this.client.request<GumtreeListingDetail>(`/v1/gumtree/listings/${listingId}`);
  }

  /**
   * Every live listing by the seller of `listingId`. Gumtree keys a seller's
   * ad list by one of their ads, so any listing id of theirs works.
   *
   * @param listingId - Any Gumtree listing id belonging to the seller.
   * @param page - Page number, 1-50.
   */
  async getSellerListings(
    listingId: string,
    page?: number
  ): Promise<GumtreeSellerListingsResponse> {
    return this.client.request<GumtreeSellerListingsResponse>(
      `/v1/gumtree/listings/${listingId}/seller-listings`,
      { params: { page } }
    );
  }

  /**
   * Gumtree search-box keyword suggestions, each with the category it maps to.
   *
   * @param query - Partial search term, e.g. `"iph"`.
   */
  async autocomplete(query: string): Promise<GumtreeAutocompleteResponse> {
    return this.client.request<GumtreeAutocompleteResponse>("/v1/gumtree/autocomplete", {
      params: { query },
    });
  }

  /**
   * Resolve a place name or postcode prefix to Gumtree locations with coordinates.
   *
   * @param query - Town, area or postcode prefix (min 2 chars), e.g. `"manch"` or `"SW1A"`.
   */
  async locationAutocomplete(query: string): Promise<GumtreeLocationAutocompleteResponse> {
    return this.client.request<GumtreeLocationAutocompleteResponse>(
      "/v1/gumtree/locations/autocomplete",
      { params: { query } }
    );
  }

  /**
   * Browse Gumtree's location tree: UK -> nations -> counties -> towns.
   *
   * @param parentId - Location id to list the children of. Defaults to the
   *   United Kingdom (`10000392`) server-side.
   */
  async listLocations(parentId?: number): Promise<GumtreeTreeResponse> {
    return this.client.request<GumtreeTreeResponse>("/v1/gumtree/locations", {
      params: { parent_id: parentId },
    });
  }

  /**
   * Browse Gumtree's category tree. A node's `slug` is the {@link search} category.
   *
   * @param parentId - Category id to list the children of. Defaults to all
   *   categories (`1`) server-side.
   */
  async listCategories(parentId?: number): Promise<GumtreeTreeResponse> {
    return this.client.request<GumtreeTreeResponse>("/v1/gumtree/categories", {
      params: { parent_id: parentId },
    });
  }
}
