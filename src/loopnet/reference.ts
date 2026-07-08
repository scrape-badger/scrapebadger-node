/**
 * LoopNet Reference Data API client.
 *
 * Provides the static coverage-market and property-type lists.
 */

import type { BaseClient } from "../internal/client.js";
import type { MarketsResponse, PropertyTypesResponse } from "./types.js";

/**
 * Client for LoopNet reference endpoints (markets, property types).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.loopnet.reference.markets();
 * const types = await client.loopnet.reference.propertyTypes();
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * List LoopNet coverage markets (us, ca, uk, fr, es).
   *
   * Free — costs 0 credits.
   *
   * @returns Markets response with all supported coverage markets.
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/loopnet/markets");
  }

  /**
   * List LoopNet property-type facets (Office, Retail, Industrial, …).
   *
   * Free — costs 0 credits.
   *
   * @returns Property-types response with all searchable property-type slugs.
   */
  async propertyTypes(): Promise<PropertyTypesResponse> {
    return this.client.request<PropertyTypesResponse>("/v1/loopnet/property-types");
  }
}
