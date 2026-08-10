/**
 * DuckDuckGo Reference API client.
 *
 * Autocomplete, the Instant Answer API, and the list of supported regions.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  DuckDuckGoAutocompleteParams,
  DuckDuckGoAutocompleteResponse,
  DuckDuckGoInstantResponse,
  DuckDuckGoRegionsResponse,
} from "./types.js";

/**
 * Client for DuckDuckGo autocomplete, instant answers and regions.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const suggestions = await client.duckduckgo.reference.autocomplete("weath");
 * const instant = await client.duckduckgo.reference.instant("python");
 * const regions = await client.duckduckgo.reference.regions();
 * ```
 */
export class ReferenceClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search-box suggestions for a partial query.
   *
   * @param query - Partial search term, e.g. `"weath"`.
   * @param params - Optional region.
   */
  async autocomplete(
    query: string,
    params: DuckDuckGoAutocompleteParams = {}
  ): Promise<DuckDuckGoAutocompleteResponse> {
    return this.client.request<DuckDuckGoAutocompleteResponse>("/v1/duckduckgo/autocomplete", {
      params: {
        query,
        region: params.region,
      },
    });
  }

  /**
   * DuckDuckGo Instant Answer (zero-click info) for a query.
   *
   * @param query - The query, e.g. `"python"`.
   */
  async instant(query: string): Promise<DuckDuckGoInstantResponse> {
    return this.client.request<DuckDuckGoInstantResponse>("/v1/duckduckgo/instant", {
      params: { query },
    });
  }

  /**
   * Get the supported DuckDuckGo search regions.
   */
  async regions(): Promise<DuckDuckGoRegionsResponse> {
    return this.client.request<DuckDuckGoRegionsResponse>("/v1/duckduckgo/regions");
  }
}
