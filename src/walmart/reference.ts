/**
 * Walmart Reference Data API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { WalmartMarketsResponse } from "./types.js";

/**
 * Client for Walmart reference data endpoints (markets, health).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.walmart.reference.markets();
 * ```
 */
export class ReferenceClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get the supported Walmart markets.
   *
   * @remarks
   * Only walmart.com (US) is supported — walmart.ca and walmart.com.mx run on
   * different platforms with different payload shapes, so they are not claimed
   * here rather than shipped broken.
   */
  async markets(): Promise<WalmartMarketsResponse> {
    return this.client.request<WalmartMarketsResponse>("/v1/walmart/markets");
  }

  /**
   * Check the health of the Walmart scraper service.
   *
   * @returns The raw health payload from the scraper service.
   */
  async health(): Promise<unknown> {
    return this.client.request<unknown>("/v1/walmart/health");
  }
}
