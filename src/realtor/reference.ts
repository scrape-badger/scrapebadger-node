/**
 * Realtor Reference Data API client.
 *
 * Provides a method for fetching the static market list.
 */

import type { BaseClient } from "../internal/client.js";
import type { MarketsResponse } from "./types.js";

/**
 * Client for realtor reference data endpoints (markets).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.realtor.reference.listMarkets();
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
   * Get all supported realtor markets.
   *
   * @returns Markets response with all supported markets.
   */
  async listMarkets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/realtor/markets");
  }
}
