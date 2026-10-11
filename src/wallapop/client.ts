/**
 * Wallapop API client.
 *
 * Wallapop endpoints: search (listing search with Wallapop's own filters,
 * including the cars vertical), getItem (full listing detail), getUser
 * (seller profile with ratings and verifications), getUserItems and
 * getUserReviews (cursor-paginated), autocomplete, listCategories,
 * listFilters, listFilterOptions and listMarkets. One API for Spain, Italy
 * and Portugal, picked by a `market` param (es, it, pt).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  WallapopSearchParams,
  WallapopItemParams,
  WallapopUserParams,
  WallapopUserPageParams,
  WallapopMarketParams,
  WallapopFiltersParams,
  WallapopSearchResponse,
  WallapopItemDetail,
  WallapopUserProfile,
  WallapopUserItemsResponse,
  WallapopReviewsResponse,
  WallapopAutocompleteResponse,
  WallapopCategoriesResponse,
  WallapopFiltersResponse,
  WallapopFilterOptionsResponse,
  WallapopMarketsResponse,
} from "./types.js";

/** `true` when set, otherwise omitted — the API only filters on `true`. */
const onlyTrue = (value: boolean | undefined): true | undefined => (value ? true : undefined);

/**
 * Client for all Wallapop API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search listings
 * const results = await client.wallapop.search("iphone 14", { maxPrice: 400, shippable: true });
 * for (const item of results.items) {
 *   console.log(`${item.title} — ${item.price} ${item.currency}`);
 * }
 *
 * // Next page
 * if (results.next_page) {
 *   const more = await client.wallapop.search(undefined, { nextPage: results.next_page });
 * }
 *
 * // Full listing detail, seller profile, listings and reviews
 * const item = await client.wallapop.getItem("nzxeknm5x562");
 * const seller = await client.wallapop.getUser(item.user_id!);
 * const listings = await client.wallapop.getUserItems(seller.id);
 * const reviews = await client.wallapop.getUserReviews(seller.id);
 *
 * // Reference data
 * const categories = await client.wallapop.listCategories({ market: "it" });
 * const brands = await client.wallapop.listFilterOptions("brand", { query: "iphone" });
 * ```
 */
export class WallapopClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Wallapop listings (40 per page).
   *
   * Needs a query, a `categoryId`, or both — unless `nextPage` is given, in
   * which case every other parameter is ignored.
   *
   * Costs 5 credits.
   *
   * @param query - Search text, e.g. "iphone 14" (optional with `categoryId` or `nextPage`).
   * @param options - Optional parameters (market, location/radius, category,
   *   price, condition, brand/model/colour, cars filters, sort, cursor).
   * @returns Search response with matching listings and the next-page cursor.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If neither a query nor a category is given.
   */
  async search(
    query?: string,
    options: WallapopSearchParams = {}
  ): Promise<WallapopSearchResponse> {
    return this.client.request<WallapopSearchResponse>("/v1/wallapop/search", {
      params: {
        query,
        market: options.market,
        latitude: options.latitude,
        longitude: options.longitude,
        distance_km: options.distanceKm,
        category_id: options.categoryId,
        min_price: options.minPrice,
        max_price: options.maxPrice,
        condition: options.condition,
        brand: options.brand,
        model: options.model,
        color: options.color,
        time_filter: options.timeFilter,
        shippable: onlyTrue(options.shippable),
        has_warranty: onlyTrue(options.hasWarranty),
        refurbished: onlyTrue(options.refurbished),
        min_year: options.minYear,
        max_year: options.maxYear,
        min_km: options.minKm,
        max_km: options.maxKm,
        gearbox: options.gearbox,
        min_horsepower: options.minHorsepower,
        max_horsepower: options.maxHorsepower,
        order_by: options.orderBy,
        next_page: options.nextPage,
      },
    });
  }

  /**
   * Get a single listing's full detail.
   *
   * Costs 5 credits.
   *
   * @param itemId - Listing id (e.g. "nzxeknm5x562") or listing slug.
   * @param options - Optional parameters (market).
   * @returns Full listing detail with attributes, counters and location.
   * @throws NotFoundError - If the listing doesn't exist.
   */
  async getItem(itemId: string, options: WallapopItemParams = {}): Promise<WallapopItemDetail> {
    return this.client.request<WallapopItemDetail>(
      `/v1/wallapop/items/${encodeURIComponent(itemId)}`,
      { params: { market: options.market } }
    );
  }

  /**
   * Get a seller's profile with ratings, sales counters, response rate and
   * verifications.
   *
   * Costs 5 credits.
   *
   * @param userId - User id (e.g. "dqjwdd53wwzo") or profile slug (e.g. "alexc-25115753").
   * @param options - Optional parameters (market).
   * @returns User profile.
   * @throws NotFoundError - If the user doesn't exist.
   */
  async getUser(userId: string, options: WallapopUserParams = {}): Promise<WallapopUserProfile> {
    return this.client.request<WallapopUserProfile>(
      `/v1/wallapop/users/${encodeURIComponent(userId)}`,
      { params: { market: options.market } }
    );
  }

  /**
   * Get a seller's live listings (40 per page).
   *
   * Costs 5 credits.
   *
   * @param userId - User id or profile slug.
   * @param options - Optional parameters (market, nextPage).
   * @returns The seller's listings and the next-page cursor.
   * @throws NotFoundError - If the user doesn't exist.
   */
  async getUserItems(
    userId: string,
    options: WallapopUserPageParams = {}
  ): Promise<WallapopUserItemsResponse> {
    return this.client.request<WallapopUserItemsResponse>(
      `/v1/wallapop/users/${encodeURIComponent(userId)}/items`,
      { params: { market: options.market, next_page: options.nextPage } }
    );
  }

  /**
   * Get the reviews a seller received, newest first (40 per page).
   *
   * Costs 5 credits.
   *
   * @param userId - User id or profile slug.
   * @param options - Optional parameters (market, nextPage).
   * @returns Reviews and the next-page cursor.
   * @throws NotFoundError - If the user doesn't exist.
   */
  async getUserReviews(
    userId: string,
    options: WallapopUserPageParams = {}
  ): Promise<WallapopReviewsResponse> {
    return this.client.request<WallapopReviewsResponse>(
      `/v1/wallapop/users/${encodeURIComponent(userId)}/reviews`,
      { params: { market: options.market, next_page: options.nextPage } }
    );
  }

  /**
   * Get Wallapop's search-box suggestions for a partial query.
   *
   * Costs 1 credit.
   *
   * @param query - Partial search text, e.g. "bici".
   * @param options - Optional parameters (market).
   * @returns Autocomplete suggestions.
   */
  async autocomplete(
    query: string,
    options: WallapopMarketParams = {}
  ): Promise<WallapopAutocompleteResponse> {
    return this.client.request<WallapopAutocompleteResponse>("/v1/wallapop/autocomplete", {
      params: { query, market: options.market },
    });
  }

  /**
   * Get the full category tree; ids are usable as the search `categoryId`.
   *
   * Costs 1 credit.
   *
   * @param options - Optional parameters (market — localises names).
   * @returns Category tree.
   */
  async listCategories(options: WallapopMarketParams = {}): Promise<WallapopCategoriesResponse> {
    return this.client.request<WallapopCategoriesResponse>("/v1/wallapop/categories", {
      params: { market: options.market },
    });
  }

  /**
   * Get the search filters Wallapop offers for a category and/or query,
   * with their option ids.
   *
   * Costs 2 credits.
   *
   * @param options - Optional parameters (categoryId, query, market).
   * @returns Available filters.
   */
  async listFilters(options: WallapopFiltersParams = {}): Promise<WallapopFiltersResponse> {
    return this.client.request<WallapopFiltersResponse>("/v1/wallapop/filters", {
      params: {
        category_id: options.categoryId,
        query: options.query,
        market: options.market,
      },
    });
  }

  /**
   * Get a filter's long option list (brands, models) that Wallapop serves
   * separately — filters flagged `options_endpoint` in `listFilters`.
   *
   * Costs 2 credits.
   *
   * @param filterId - Filter id, e.g. "brand".
   * @param options - Optional parameters (categoryId, query, market).
   * @returns The filter's options.
   * @throws ValidationError - If the filter id is invalid.
   */
  async listFilterOptions(
    filterId: string,
    options: WallapopFiltersParams = {}
  ): Promise<WallapopFilterOptionsResponse> {
    return this.client.request<WallapopFilterOptionsResponse>(
      `/v1/wallapop/filters/${encodeURIComponent(filterId)}/options`,
      {
        params: {
          category_id: options.categoryId,
          query: options.query,
          market: options.market,
        },
      }
    );
  }

  /**
   * Get all supported Wallapop markets and their default search location.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Markets response with all supported markets.
   */
  async listMarkets(): Promise<WallapopMarketsResponse> {
    return this.client.request<WallapopMarketsResponse>("/v1/wallapop/markets");
  }
}
