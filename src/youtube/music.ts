/**
 * YouTube Music API client.
 *
 * Provides a method for searching YouTube Music (WEB_REMIX client).
 */

import type { BaseClient } from "../internal/client.js";
import type { YoutubeMusicSearchParams, SearchResponse } from "./types.js";

/**
 * Client for YouTube Music endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.youtube.music.search({ query: "daft punk" });
 * for (const r of results.results) {
 *   console.log(r.title);
 * }
 * ```
 */
export class MusicClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search YouTube Music (songs / albums / artists / playlists).
   *
   * @param params - The required query plus optional continuation and region.
   * @returns A page of search results with a continuation token.
   */
  async search(params: YoutubeMusicSearchParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/youtube/music/search", {
      params: {
        query: params.query,
        continuation: params.continuation,
        gl: params.gl,
        hl: params.hl,
      },
    });
  }
}
