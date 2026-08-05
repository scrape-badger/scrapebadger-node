/**
 * Apartments.com API client.
 *
 * Endpoints: search (rental listings by location, 40 cards a page) and
 * getProperty (one property with full per-unit pricing and availability, by
 * URL or by slug + id). Single market: apartments.com (US, USD, en-US).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  ApartmentsPropertyParams,
  ApartmentsSearchParams,
  Property,
  SearchResponse,
} from "./types.js";

/**
 * Client for all Apartments.com API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search a location
 * const page = await client.apartments.search("kansas-city-mo", { beds: 1 });
 * console.log(`${page.total_results} rentals`);
 *
 * // Drill into one card for unit-level pricing
 * const prop = await client.apartments.getProperty(page.results[0].url!);
 * for (const unit of prop.units) {
 *   console.log(unit.unit_number, unit.rent, unit.available_text);
 * }
 * ```
 */
export class ApartmentsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search rental listings in a location.
   *
   * @param location - apartments.com slug (`"kansas-city-mo"`) or a ZIP.
   * @param params - Optional page and bed/price filters.
   *
   * @remarks
   * Cards are summaries with a rent/bed rollup. For per-unit rent and
   * availability, pass a card's `url` to {@link getProperty}.
   */
  async search(location: string, params: ApartmentsSearchParams = {}): Promise<SearchResponse> {
    const query: Record<string, string | number> = {
      location,
      page: params.page ?? 1,
    };
    if (params.beds !== undefined) query.beds = params.beds;
    if (params.minPrice !== undefined) query.min_price = params.minPrice;
    if (params.maxPrice !== undefined) query.max_price = params.maxPrice;
    return this.client.request<SearchResponse>("/v1/apartments/search", { params: query });
  }

  /**
   * Get one property with floor plans and per-unit inventory.
   *
   * @param url - Full property URL. Omit to look up by `slug` + `propertyId`.
   * @param params - `slug` and `propertyId` alternative to a URL.
   *
   * @remarks
   * Use `unit.rent` (the advertised price), not `unit.max_term_rent` — the
   * latter is the site's raw `data-maxrent`, roughly double the advertised
   * rent.
   */
  async getProperty(
    url?: string,
    params: ApartmentsPropertyParams = {},
  ): Promise<Property> {
    if (url) {
      return this.client.request<Property>("/v1/apartments/property", { params: { url } });
    }
    if (params.slug && params.propertyId) {
      return this.client.request<Property>(
        `/v1/apartments/properties/${params.slug}/${params.propertyId}`,
      );
    }
    throw new Error("Provide either url, or both slug and propertyId");
  }
}
