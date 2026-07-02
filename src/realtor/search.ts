/**
 * Realtor Search API client.
 *
 * Provides methods for property search and location autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  RealtorSearchOptions,
  RealtorAutocompleteOptions,
  SearchResponse,
  AutocompleteResponse,
} from "./types.js";

/**
 * Client for realtor search and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.realtor.search.search("Austin, TX");
 * for (const p of results.results) {
 *   console.log(`${p.address?.line} — ${p.list_price_formatted}`);
 * }
 *
 * const suggestions = await client.realtor.search.autocomplete("Miami");
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search a market for properties.
   *
   * @param location - Freetext location ("Austin, TX" / ZIP / "Toronto, ON").
   *   Required unless a CA bounding box is provided.
   * @param options - Filters, sorting, and pagination.
   * @returns Search results with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(location?: string, options: RealtorSearchOptions = {}): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/realtor/search", {
      params: {
        location,
        market: options.market,
        status: options.status,
        price_min: options.priceMin,
        price_max: options.priceMax,
        beds_min: options.bedsMin,
        baths_min: options.bathsMin,
        sqft_min: options.sqftMin,
        sqft_max: options.sqftMax,
        property_type: options.propertyType,
        sort: options.sort,
        page: options.page,
        limit: options.limit,
        lat_min: options.latMin,
        lat_max: options.latMax,
        lng_min: options.lngMin,
        lng_max: options.lngMax,
      },
    });
  }

  /**
   * Get location autocomplete suggestions.
   *
   * @param query - Partial location query.
   * @param options - Optional parameters (market, limit).
   * @returns Autocomplete suggestions.
   */
  async autocomplete(
    query: string,
    options: RealtorAutocompleteOptions = {}
  ): Promise<AutocompleteResponse> {
    return this.client.request<AutocompleteResponse>("/v1/realtor/autocomplete", {
      params: { query, market: options.market, limit: options.limit },
    });
  }
}
