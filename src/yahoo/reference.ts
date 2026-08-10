/**
 * Yahoo Reference Data API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { YahooMarketsResponse } from "./types.js";

/**
 * Client for Yahoo reference data endpoints (markets).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.yahoo.reference.markets();
 * ```
 */
export class ReferenceClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get the supported Yahoo markets.
   *
   * Yahoo Japan (`search.yahoo.co.jp`) is a separate engine and is not
   * covered by this API.
   *
   * @returns Every Yahoo market code, name, country and regional search host.
   */
  async markets(): Promise<YahooMarketsResponse> {
    return this.client.request<YahooMarketsResponse>("/v1/yahoo/markets");
  }
}
