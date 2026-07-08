/**
 * Immobiliare API client.
 *
 * Immobiliare endpoints: autocomplete (resolve a free-text place to geography
 * ids), search (list listings by location or explicit ids), getListing (full
 * single-listing detail), getAgency / getAgencyListings (agency profile +
 * active listings), priceStats (€/m² time series per area), markets, and
 * reference (filter enums). Markets: it, es, gr, lu (the Immobiliare Group).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  ImmobiliareAutocompleteParams,
  ImmobiliareSearchParams,
  ImmobiliareListingParams,
  ImmobiliareAgencyParams,
  ImmobiliareAgencyListingsParams,
  ImmobiliarePriceStatsParams,
  SuggestResponse,
  SearchResponse,
  Listing,
  AgencyProfile,
  AgencyListingsResponse,
  PriceStatsResponse,
  MarketsResponse,
  ReferenceResponse,
} from "./types.js";

/**
 * Client for all Immobiliare API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Resolve a place name to geography ids
 * const hits = await client.immobiliare.autocomplete("Milano");
 * const city = hits.suggestions[0];
 *
 * // Search listings
 * const results = await client.immobiliare.search({
 *   city_id: city.city_id ?? undefined,
 *   price_max: 500000,
 * });
 * for (const listing of results.listings) {
 *   console.log(`${listing.id}: ${listing.title}`);
 * }
 *
 * // Full single-listing detail
 * const detail = await client.immobiliare.getListing(123456789);
 * console.log(detail.price?.formatted);
 *
 * // Supported markets
 * const markets = await client.immobiliare.markets();
 * ```
 */
export class ImmobiliareClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Resolve a free-text place name into geography ids for search.
   *
   * @param query - Free-text place name, e.g. "Milano".
   * @param options - Optional parameters (market).
   * @returns Suggest response with region/province/city/zone id candidates.
   */
  async autocomplete(
    query: string,
    options: ImmobiliareAutocompleteParams = {}
  ): Promise<SuggestResponse> {
    return this.client.request<SuggestResponse>("/v1/immobiliare/autocomplete", {
      params: { query, market: options.market },
    });
  }

  /**
   * Search Immobiliare-group listings.
   *
   * Scope the search by `location` (free text, auto-resolved) OR explicit
   * `region_id` / `province_id` / `city_id` from {@link autocomplete}.
   *
   * @param options - Search parameters (market, location/ids, contract,
   *   category, price/surface/room/bathroom filters, sort, page).
   * @returns Search response with `listings` and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(options: ImmobiliareSearchParams = {}): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/immobiliare/search", {
      params: {
        market: options.market,
        location: options.location,
        region_id: options.region_id,
        province_id: options.province_id,
        city_id: options.city_id,
        contract: options.contract,
        category: options.category,
        price_min: options.price_min,
        price_max: options.price_max,
        surface_min: options.surface_min,
        surface_max: options.surface_max,
        rooms_min: options.rooms_min,
        rooms_max: options.rooms_max,
        bathrooms_min: options.bathrooms_min,
        sort: options.sort,
        page: options.page,
      },
    });
  }

  /**
   * Get the full detail for a single Immobiliare listing.
   *
   * @param listingId - The Immobiliare listing id.
   * @param options - Optional parameters (market).
   * @returns The full listing detail.
   * @throws NotFoundError - If the listing doesn't exist.
   */
  async getListing(listingId: number, options: ImmobiliareListingParams = {}): Promise<Listing> {
    return this.client.request<Listing>(`/v1/immobiliare/listings/${listingId}`, {
      params: { market: options.market },
    });
  }

  /**
   * Get an agency/advertiser profile.
   *
   * @param agencyId - The Immobiliare agency id.
   * @param options - Optional parameters (market).
   * @returns The full agency profile.
   * @throws NotFoundError - If the agency doesn't exist.
   */
  async getAgency(agencyId: number, options: ImmobiliareAgencyParams = {}): Promise<AgencyProfile> {
    return this.client.request<AgencyProfile>(`/v1/immobiliare/agencies/${agencyId}`, {
      params: { market: options.market },
    });
  }

  /**
   * Get an agency's active listings (25 per page).
   *
   * @param agencyId - The Immobiliare agency id.
   * @param options - Optional parameters (market, page).
   * @returns Agency-listings response with `listings` and pagination.
   */
  async getAgencyListings(
    agencyId: number,
    options: ImmobiliareAgencyListingsParams = {}
  ): Promise<AgencyListingsResponse> {
    return this.client.request<AgencyListingsResponse>(
      `/v1/immobiliare/agencies/${agencyId}/listings`,
      {
        params: { market: options.market, page: options.page },
      }
    );
  }

  /**
   * Get the historical average €/m² time series for an area.
   *
   * @param regionId - Region id, e.g. "lom" (required).
   * @param options - Optional parameters (province_id, city_id, market, contract).
   * @returns Price-stats response with monthly `points` (label + EUR/m² value).
   */
  async priceStats(
    regionId: string,
    options: ImmobiliarePriceStatsParams = {}
  ): Promise<PriceStatsResponse> {
    return this.client.request<PriceStatsResponse>("/v1/immobiliare/market-insights/prices", {
      params: {
        market: options.market,
        region_id: regionId,
        province_id: options.province_id,
        city_id: options.city_id,
        contract: options.contract,
      },
    });
  }

  /**
   * Get all supported Immobiliare-group markets (it, es, gr, lu).
   *
   * @returns A bare array of supported markets (code, domain, country,
   *   locale, currency, name).
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/immobiliare/markets");
  }

  /**
   * Get the filter enums accepted by {@link search}.
   *
   * @returns Reference response with `contracts`, `categories`, and `sorts`.
   */
  async reference(): Promise<ReferenceResponse> {
    return this.client.request<ReferenceResponse>("/v1/immobiliare/reference");
  }
}
