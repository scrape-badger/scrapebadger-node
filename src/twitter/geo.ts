/**
 * Twitter Geo API client.
 *
 * Provides methods for fetching geographic place information.
 */

import type { BaseClient } from "../internal/client.js";
import type { PaginatedResponse } from "../internal/pagination.js";
import { createPaginatedResponse } from "../internal/pagination.js";
import type { Place } from "./types.js";

/**
 * Options for searching places.
 */
export interface GeoSearchOptions {
  /** Latitude coordinate */
  lat?: number;
  /** Longitude coordinate */
  long?: number;
  /** Free-form text search query (e.g., "San Francisco") */
  query?: string;
  /** IP address for location lookup */
  ip?: string;
  /** Result granularity ("neighborhood", "city", "admin", "country") */
  granularity?: string;
  /** Maximum number of results (1-100) */
  maxResults?: number;
}

/**
 * Client for Twitter geo/places endpoints.
 *
 * Provides async methods for fetching place details and searching
 * for geographic locations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search for places
 * const places = await client.twitter.geo.search({ query: "San Francisco" });
 *
 * // Search by coordinates
 * const nearby = await client.twitter.geo.search({ lat: 37.7749, long: -122.4194 });
 *
 * // Get place details
 * const place = await client.twitter.geo.getDetail("5a110d312052166f");
 * ```
 */
export class GeoClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get details for a specific place.
   *
   * @param placeId - The Twitter place ID.
   * @returns The place details.
   * @throws NotFoundError - If the place doesn't exist.
   *
   * @example
   * ```typescript
   * const place = await client.twitter.geo.getDetail("5a110d312052166f");
   * console.log(`${place.full_name}`);
   * console.log(`Type: ${place.place_type}`);
   * console.log(`Country: ${place.country}`);
   * ```
   */
  async getDetail(placeId: string): Promise<Place> {
    return this.client.request<Place>(`/v1/twitter/geo/places/${placeId}`);
  }

  /**
   * Search for geographic places.
   *
   * At least one of lat/long, query, or ip must be provided.
   *
   * @param options - Search options.
   * @returns Paginated response containing matching places.
   * @throws ValidationError - If no search parameters are provided.
   *
   * @example
   * ```typescript
   * // Search by name
   * const places = await client.twitter.geo.search({ query: "San Francisco" });
   * for (const place of places.data) {
   *   console.log(`${place.full_name} (${place.place_type})`);
   * }
   *
   * // Search by coordinates
   * const nearby = await client.twitter.geo.search({
   *   lat: 37.7749,
   *   long: -122.4194,
   *   granularity: "city"
   * });
   *
   * // Search by IP
   * const ipPlaces = await client.twitter.geo.search({ ip: "8.8.8.8" });
   * ```
   */
  async search(options: GeoSearchOptions = {}): Promise<PaginatedResponse<Place>> {
    const response = await this.client.request<{ data?: Place[] }>("/v1/twitter/geo/search", {
      params: {
        lat: options.lat,
        long: options.long,
        query: options.query,
        ip: options.ip,
        granularity: options.granularity,
        max_results: options.maxResults,
      },
    });
    return createPaginatedResponse(response.data ?? []);
  }
}
