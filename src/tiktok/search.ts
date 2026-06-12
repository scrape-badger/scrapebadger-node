/**
 * TikTok Search API client.
 *
 * Provides keyword search across videos, users, and hashtags.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokSearchParams,
  VideoListResponse,
  UserSearchResponse,
  HashtagSearchResponse,
} from "./types.js";

/**
 * Client for TikTok search endpoints (general, videos, users, hashtags).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const top = await client.tiktok.search.search({ query: "skincare" });
 * const users = await client.tiktok.search.users({ query: "skincare" });
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * General TikTok search — video results from the Top feed.
   *
   * @param params - Search parameters including query, region, count.
   * @returns A cursor-paginated list of videos.
   */
  async search(params: TikTokSearchParams): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>("/v1/tiktok/search", {
      params: {
        query: params.query,
        region: params.region,
        count: params.count,
      },
    });
  }

  /**
   * Search TikTok videos by keyword.
   *
   * @param params - Search parameters including query, region, count.
   * @returns A cursor-paginated list of videos.
   */
  async videos(params: TikTokSearchParams): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>("/v1/tiktok/search/videos", {
      params: {
        query: params.query,
        region: params.region,
        count: params.count,
      },
    });
  }

  /**
   * Search TikTok users by keyword.
   *
   * @param params - Search parameters including query, region, count.
   * @returns A cursor-paginated list of matching users.
   */
  async users(params: TikTokSearchParams): Promise<UserSearchResponse> {
    return this.client.request<UserSearchResponse>("/v1/tiktok/search/users", {
      params: {
        query: params.query,
        region: params.region,
        count: params.count,
      },
    });
  }

  /**
   * Search TikTok hashtags by keyword.
   *
   * @param params - Search parameters including query, region, count.
   * @returns A cursor-paginated list of matching hashtags.
   */
  async hashtags(params: TikTokSearchParams): Promise<HashtagSearchResponse> {
    return this.client.request<HashtagSearchResponse>("/v1/tiktok/search/hashtags", {
      params: {
        query: params.query,
        region: params.region,
        count: params.count,
      },
    });
  }
}
