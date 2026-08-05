/**
 * Instagram Search API client.
 *
 * Searches users, hashtags, places, the "top" blended results, reels, and
 * music, plus a lightweight autocomplete/typeahead.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  Audio,
  Hashtag,
  Location,
  Media,
  Paginated,
  SearchTopResponse,
  UserShort,
} from "./types.js";

/**
 * Client for Instagram search endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const users = await client.instagram.search.users("nike");
 * for (const user of users.items) {
 *   console.log(`@${user.username}: ${user.full_name}`);
 * }
 *
 * const tags = await client.instagram.search.hashtags("running");
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /** Search accounts by name/username. */
  async users(query: string): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      "/v1/instagram/search/users",
      { params: { query } }
    );
  }

  /** Search hashtags. */
  async hashtags(query: string): Promise<Paginated<Hashtag>> {
    return this.client.request<Paginated<Hashtag>>(
      "/v1/instagram/search/hashtags",
      { params: { query } }
    );
  }

  /** Search places/locations. */
  async places(query: string): Promise<Paginated<Location>> {
    return this.client.request<Paginated<Location>>(
      "/v1/instagram/search/places",
      { params: { query } }
    );
  }

  /** Search reels. */
  async reels(query: string): Promise<Paginated<Media>> {
    return this.client.request<Paginated<Media>>(
      "/v1/instagram/search/reels",
      { params: { query } }
    );
  }

  /** Search music/audio tracks. */
  async music(query: string): Promise<Paginated<Audio>> {
    return this.client.request<Paginated<Audio>>(
      "/v1/instagram/search/music",
      { params: { query } }
    );
  }

  /** Get blended "top" results (users, hashtags, and places). */
  async top(query: string): Promise<SearchTopResponse> {
    return this.client.request<SearchTopResponse>("/v1/instagram/search/top", {
      params: { query },
    });
  }

  /** Get typeahead/autocomplete suggestions (mixed entity types). */
  async autocomplete(query: string): Promise<SearchTopResponse> {
    return this.client.request<SearchTopResponse>(
      "/v1/instagram/search/autocomplete",
      { params: { query } }
    );
  }
}
