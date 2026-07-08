/**
 * LoopNet Search API client.
 *
 * Provides commercial-listing search for for-lease / for-sale / auction
 * listings across 5 markets (us, ca, uk, fr, es).
 */

import type { BaseClient } from "../internal/client.js";
import type { LoopNetSearchParams, SearchResponse } from "./types.js";

/**
 * Client for the LoopNet listing search endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.loopnet.search.search({ location: "Houston, TX" });
 * for (const listing of results.results) {
 *   console.log(`${listing.position}. ${listing.address} — ${listing.price_text}`);
 * }
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search LoopNet for for-lease / for-sale / auction commercial listings.
   *
   * Costs 10 credits.
   *
   * @param params - Search parameters including location, filters, and pagination.
   * @returns Search results with listing cards and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(params: LoopNetSearchParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/loopnet/search", {
      params: {
        location: params.location,
        market: params.market,
        listing_type: params.listing_type,
        property_type: params.property_type,
        page: params.page,
        min_price: params.min_price,
        max_price: params.max_price,
        price_type: params.price_type,
        min_size: params.min_size,
        max_size: params.max_size,
      },
    });
  }
}
