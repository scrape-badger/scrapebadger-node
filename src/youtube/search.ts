/**
 * YouTube Search API client.
 *
 * Provides methods for full-matrix search and keyword autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubeSearchParams,
  YoutubeAutocompleteParams,
  SearchResponse,
  AutocompleteResponse,
} from "./types.js";

/**
 * Client for YouTube search and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.youtube.search.search({ query: "lofi beats" });
 * for (const r of results.results) {
 *   console.log(`${r.position}. ${r.title}`);
 * }
 *
 * const suggestions = await client.youtube.search.autocomplete("lofi");
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search YouTube videos / channels / playlists with the full filter matrix.
   *
   * @param params - Search parameters including query, filters, and continuation.
   * @returns A page of search results with chips, refinements, and a continuation token.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(params: YoutubeSearchParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/youtube/search", {
      params: {
        query: params.query,
        type: params.type,
        sort_by: params.sort_by,
        upload_date: params.upload_date,
        duration: params.duration,
        features: params.features,
        gl: params.gl,
        hl: params.hl,
        continuation: params.continuation,
      },
    });
  }

  /**
   * Get YouTube keyword autocomplete suggestions.
   *
   * @param query - Partial search query prefix.
   * @param options - Optional region parameters (gl, hl).
   * @returns Autocomplete suggestions.
   */
  async autocomplete(
    query: string,
    options: YoutubeAutocompleteParams = {}
  ): Promise<AutocompleteResponse> {
    return this.client.request<AutocompleteResponse>("/v1/youtube/autocomplete", {
      params: { query, gl: options.gl, hl: options.hl },
    });
  }
}
