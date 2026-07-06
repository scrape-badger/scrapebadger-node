/**
 * Leboncoin Reference Data API client.
 *
 * Provides the static category / region / department lists, the market list,
 * and location autocomplete for building search filters.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  LeboncoinDepartmentsParams,
  CategoriesResponse,
  RegionsResponse,
  DepartmentsResponse,
  LocationSearchResponse,
  MarketsResponse,
} from "./types.js";

/**
 * Client for Leboncoin reference endpoints (categories, regions, departments,
 * location autocomplete, markets).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const { categories } = await client.leboncoin.reference.categories();
 * const { regions } = await client.leboncoin.reference.regions();
 * const { departments } = await client.leboncoin.reference.departments({ region_id: "12" });
 * const { suggestions } = await client.leboncoin.reference.locations("Paris");
 * const { markets } = await client.leboncoin.reference.markets();
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * List all Leboncoin categories.
   *
   * @returns Categories response.
   */
  async categories(): Promise<CategoriesResponse> {
    return this.client.request<CategoriesResponse>("/v1/leboncoin/categories");
  }

  /**
   * List all Leboncoin regions.
   *
   * @returns Regions response.
   */
  async regions(): Promise<RegionsResponse> {
    return this.client.request<RegionsResponse>("/v1/leboncoin/regions");
  }

  /**
   * List Leboncoin departments, optionally filtered by region.
   *
   * @param options - Optional parameters (region_id).
   * @returns Departments response.
   */
  async departments(
    options: LeboncoinDepartmentsParams = {}
  ): Promise<DepartmentsResponse> {
    return this.client.request<DepartmentsResponse>(
      "/v1/leboncoin/departments",
      { params: { region_id: options.region_id } }
    );
  }

  /**
   * Resolve a place name to Leboncoin location ids (for building filters).
   *
   * @param query - Place name to resolve.
   * @returns Location search response with suggestions.
   */
  async locations(query: string): Promise<LocationSearchResponse> {
    return this.client.request<LocationSearchResponse>(
      "/v1/leboncoin/locations/search",
      { params: { q: query } }
    );
  }

  /**
   * List the supported Leboncoin markets (France is the single market).
   *
   * @returns Markets response.
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/leboncoin/markets");
  }
}
