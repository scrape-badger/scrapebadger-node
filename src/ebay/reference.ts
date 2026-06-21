/**
 * eBay Reference Data API client.
 *
 * Provides methods for fetching the static marketplace list.
 */

import type { BaseClient } from "../internal/client.js";
import type { MarketsResponse } from "./types.js";

/**
 * Client for eBay reference data endpoints (markets).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.ebay.reference.markets();
 * for (const m of markets.markets) {
 *   console.log(`${m.code}: ${m.domain} (${m.currency})`);
 * }
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get all supported eBay marketplaces.
   *
   * @returns Markets response with all supported marketplaces.
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/ebay/markets");
  }
}
