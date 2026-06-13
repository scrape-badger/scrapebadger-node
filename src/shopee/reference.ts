/**
 * Shopee Reference Data API client.
 *
 * Provides methods for fetching the static category tree and markets list.
 */

import type { BaseClient } from "../internal/client.js";
import type { ShopeeCategoriesParams, MarketsResponse, CategoryTree } from "./types.js";

/**
 * Client for Shopee reference data endpoints (markets, categories).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.shopee.reference.markets();
 * for (const m of markets.markets) {
 *   console.log(`${m.code}: ${m.domain} (${m.currency})`);
 * }
 *
 * const tree = await client.shopee.reference.categories({ market: "sg" });
 * for (const cat of tree.categories) {
 *   console.log(`${cat.category_id}: ${cat.display_name}`);
 * }
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get all supported Shopee marketplaces.
   *
   * @returns Markets response with all supported Shopee markets (0 credits).
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/shopee/markets");
  }

  /**
   * Get the full category tree for a Shopee market.
   *
   * @param options - Optional parameters (market).
   * @returns Category tree with all top-level and nested category nodes.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the market code is invalid.
   */
  async categories(options: ShopeeCategoriesParams = {}): Promise<CategoryTree> {
    return this.client.request<CategoryTree>("/v1/shopee/categories", {
      params: { market: options.market },
    });
  }
}
