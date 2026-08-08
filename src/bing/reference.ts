/**
 * Bing Reference Data API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { BingMarketsResponse } from "./types.js";

/**
 * Client for Bing reference data endpoints (markets).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.bing.reference.markets();
 * ```
 */
export class ReferenceClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get the supported Bing markets.
   *
   * @returns Every Bing market code, name and country.
   */
  async markets(): Promise<BingMarketsResponse> {
    return this.client.request<BingMarketsResponse>("/v1/bing/markets");
  }
}
