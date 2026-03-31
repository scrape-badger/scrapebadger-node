/**
 * Vinted Search API client.
 *
 * Provides methods for searching Vinted item listings.
 */

import type { BaseClient } from "../internal/client.js";
import type { VintedSearchParams, SearchResponse } from "./types.js";

/**
 * Client for Vinted search endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Basic search
 * const results = await client.vinted.search.search({ query: "nike air max" });
 * for (const item of results.items) {
 *   console.log(`${item.title} — ${item.price.amount} ${item.price.currency_code}`);
 * }
 *
 * // Search with filters
 * const filtered = await client.vinted.search.search({
 *   query: "adidas",
 *   market: "de",
 *   price_from: 10,
 *   price_to: 50,
 *   order: "price_low_to_high",
 * });
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search for Vinted items.
   *
   * @param params - Search parameters including query, filters, and pagination.
   * @returns Search results with items and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the search parameters are invalid.
   *
   * @example
   * ```typescript
   * const results = await client.vinted.search.search({
   *   query: "vintage jacket",
   *   market: "fr",
   *   page: 1,
   *   per_page: 20,
   *   order: "newest_first",
   * });
   * console.log(`Found ${results.pagination.total_entries} items`);
   * ```
   */
  async search(params: VintedSearchParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/vinted/search", {
      params: {
        query: params.query,
        market: params.market,
        page: params.page,
        per_page: params.per_page,
        price_from: params.price_from,
        price_to: params.price_to,
        brand_ids: params.brand_ids,
        color_ids: params.color_ids,
        status_ids: params.status_ids,
        order: params.order,
      },
    });
  }
}
