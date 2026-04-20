/**
 * Google Autocomplete API client.
 *
 * Returns up to 10 search suggestions. Suggestions that resolve to
 * Knowledge-Graph entities (companies, people, movies, stocks, local
 * businesses, …) additionally carry `entity_name` and `thumbnail` —
 * the same enrichment Google's own search-box surfaces.
 */

import type { BaseClient } from "../internal/client.js";
import type { AutocompleteParams, GoogleResponse } from "./types.js";

/**
 * Client for Google Autocomplete (search suggestions).
 */
export class AutocompleteClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get Google autocomplete suggestions for a query.
   *
   * @example
   * ```typescript
   * const res = await client.google.autocomplete.get({ q: "apple" });
   * for (const s of res.suggestions) {
   *   console.log(s.value, s.entity_name, s.thumbnail);
   * }
   * ```
   */
  async get(params: AutocompleteParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/autocomplete", {
      params: { ...params },
    });
  }
}
