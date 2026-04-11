/**
 * Google Web Search (SERP) API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, GoogleSearchParams } from "./types.js";

/**
 * Client for Google Web Search.
 *
 * @example
 * ```typescript
 * const serp = await client.google.search.search({ q: "python 3.13" });
 * for (const r of serp.organic_results as any[]) {
 *   console.log(r.title, r.link);
 * }
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Google and get a structured SERP response with organic results,
   * knowledge graph, People Also Ask, related searches, AI overview, and
   * pagination.
   */
  async search(params: GoogleSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/search", { params: { ...params } });
  }
}
