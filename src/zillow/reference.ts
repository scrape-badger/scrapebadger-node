/**
 * Zillow Reference Data API client.
 *
 * Provides a method for fetching the coverage market list.
 */

import type { BaseClient } from "../internal/client.js";
import type { MarketsResponse } from "./types.js";

/**
 * Client for zillow reference data endpoints (markets).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.zillow.reference.listMarkets();
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
   * List Zillow coverage regions (US + Canada, all served via zillow.com).
   *
   * @returns Markets response with all supported markets.
   */
  async listMarkets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/zillow/markets");
  }
}
