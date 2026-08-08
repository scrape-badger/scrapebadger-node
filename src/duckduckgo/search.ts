/**
 * DuckDuckGo Search API client.
 *
 * Web search with the optional Instant-Answer abstract.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  DuckDuckGoSearchParams,
  DuckDuckGoSearchResponse,
} from "./types.js";

/**
 * Client for the DuckDuckGo web-search endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.duckduckgo.search.search("privacy", { region: "us-en" });
 * for (const item of results.results) {
 *   console.log(`${item.title} — ${item.url}`);
 * }
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search duckduckgo.com.
   *
   * @param query - Search keywords, e.g. `"privacy"`.
   * @param params - Optional region, safesearch, timelimit and page.
   * @returns A page of web results plus the optional abstract.
   */
  async search(
    query: string,
    params: DuckDuckGoSearchParams = {},
  ): Promise<DuckDuckGoSearchResponse> {
    return this.client.request<DuckDuckGoSearchResponse>("/v1/duckduckgo/search", {
      params: {
        query,
        region: params.region,
        safesearch: params.safesearch,
        timelimit: params.timelimit,
        page: params.page,
      },
    });
  }
}
