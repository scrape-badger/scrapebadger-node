/**
 * TikTok Hashtags API client.
 *
 * Provides hashtag/challenge detail and the videos tagged with a hashtag.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokHashtagParams,
  TikTokListVideosParams,
  HashtagResponse,
  VideoListResponse,
} from "./types.js";

/**
 * Client for TikTok hashtag endpoints (detail, videos).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const tag = await client.tiktok.hashtags.get("fyp");
 * const videos = await client.tiktok.hashtags.videos("fyp");
 * ```
 */
export class HashtagsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get TikTok hashtag/challenge detail.
   *
   * @param name - The hashtag name (without the leading '#').
   * @param options - Optional parameters (region).
   * @returns The hashtag detail response.
   * @throws NotFoundError - If the hashtag doesn't exist.
   */
  async get(name: string, options: TikTokHashtagParams = {}): Promise<HashtagResponse> {
    return this.client.request<HashtagResponse>(`/v1/tiktok/hashtags/${name}`, {
      params: { region: options.region },
    });
  }

  /**
   * Get videos tagged with a TikTok hashtag.
   *
   * @param name - The hashtag name (without the leading '#').
   * @param options - Optional parameters (region, count).
   * @returns A cursor-paginated list of videos.
   */
  async videos(name: string, options: TikTokListVideosParams = {}): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>(`/v1/tiktok/hashtags/${name}/videos`, {
      params: { region: options.region, count: options.count },
    });
  }
}
