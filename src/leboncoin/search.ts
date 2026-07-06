/**
 * Leboncoin Search API client.
 *
 * Provides ad search across the single France marketplace, scoped by
 * category, geography, price, seller type, and ad type.
 */

import type { BaseClient } from "../internal/client.js";
import type { LeboncoinSearchParams, SearchResponse } from "./types.js";

/**
 * Client for the Leboncoin search endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.leboncoin.search.search({ text: "velo" });
 * for (const ad of results.ads) {
 *   console.log(`${ad.subject} — ${ad.price_eur} EUR`);
 * }
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Leboncoin classified ads.
   *
   * France is a single market; scope results with `region_id` /
   * `department_id` / `city` (DOM-TOM are region values).
   *
   * @param params - Search parameters including text, filters, and pagination.
   * @returns Search results with ads, totals, and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(params: LeboncoinSearchParams = {}): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/leboncoin/search", {
      params: {
        text: params.text,
        category: params.category,
        region_id: params.region_id,
        department_id: params.department_id,
        city: params.city,
        zipcode: params.zipcode,
        price_min: params.price_min,
        price_max: params.price_max,
        owner_type: params.owner_type,
        ad_type: params.ad_type,
        sort: params.sort,
        page: params.page,
        limit: params.limit,
      },
    });
  }
}
