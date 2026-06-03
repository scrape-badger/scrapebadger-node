/**
 * Amazon Reference Data API client.
 *
 * Provides methods for fetching the static marketplace and category lists.
 */

import type { BaseClient } from "../internal/client.js";
import type { MarketsResponse, CategoriesResponse } from "./types.js";

/**
 * Client for Amazon reference data endpoints (markets, categories).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.amazon.reference.markets();
 * for (const m of markets.markets) {
 *   console.log(`${m.code}: ${m.domain} (${m.currency})`);
 * }
 *
 * const categories = await client.amazon.reference.categories();
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get all supported Amazon marketplaces.
   *
   * @returns Markets response with all supported marketplaces.
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/amazon/markets");
  }

  /**
   * Get the reference department / category aliases.
   *
   * @returns Categories response with all category aliases.
   */
  async categories(): Promise<CategoriesResponse> {
    return this.client.request<CategoriesResponse>("/v1/amazon/categories");
  }
}
