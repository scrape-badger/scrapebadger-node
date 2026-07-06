/**
 * Zillow Search API client.
 *
 * Provides methods for property search and location autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type { ZillowSearchOptions, SearchResponse, AutocompleteResponse } from "./types.js";

/**
 * Client for zillow search and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.zillow.search.search("Austin, TX", { bedsMin: 3 });
 * for (const l of results.results) {
 *   console.log(`${l.address} — ${l.price_raw}`);
 * }
 *
 * const suggestions = await client.zillow.search.autocomplete("Miami");
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Zillow for properties.
   *
   * Beat the ~820-result (20-page) cap by re-issuing the search over
   * subdivided `north/south/east/west` map-bound boxes returned in
   * `map_bounds`.
   *
   * @param location - City/state, ZIP, address, or neighborhood ("Austin, TX").
   * @param options - Filters, sorting, pagination, and map bounds.
   * @returns Search results with pagination and map metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(location: string, options: ZillowSearchOptions = {}): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/zillow/search", {
      params: {
        location,
        status: options.status,
        page: options.page,
        sort: options.sort,
        price_min: options.priceMin,
        price_max: options.priceMax,
        beds_min: options.bedsMin,
        baths_min: options.bathsMin,
        home_type: options.homeType,
        sqft_min: options.sqftMin,
        sqft_max: options.sqftMax,
        lot_min: options.lotMin,
        lot_max: options.lotMax,
        year_built_min: options.yearBuiltMin,
        year_built_max: options.yearBuiltMax,
        hoa_max: options.hoaMax,
        keywords: options.keywords,
        days_on: options.daysOn,
        north: options.north,
        south: options.south,
        east: options.east,
        west: options.west,
      },
    });
  }

  /**
   * Resolve a search term to Zillow regions/addresses (regionId, lat/lng).
   *
   * @param query - Partial location — city, ZIP, address, or neighborhood.
   * @returns Autocomplete suggestions.
   */
  async autocomplete(query: string): Promise<AutocompleteResponse> {
    return this.client.request<AutocompleteResponse>("/v1/zillow/autocomplete", {
      params: { query },
    });
  }
}
