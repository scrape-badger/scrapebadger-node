/**
 * TikTok Trending API client.
 *
 * Provides trending videos, hashtags, and songs.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokTrendingVideosParams,
  TikTokTrendingParams,
  VideoListResponse,
  TrendingHashtagsResponse,
  TrendingSongsResponse,
} from "./types.js";

/**
 * Client for TikTok trending endpoints (videos, hashtags, songs).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const videos = await client.tiktok.trending.videos({ region: "US" });
 * const hashtags = await client.tiktok.trending.hashtags({ region: "US", period: 7 });
 * const songs = await client.tiktok.trending.songs({ region: "US" });
 * ```
 */
export class TrendingClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get trending videos from the TikTok Explore feed.
   *
   * @param options - Optional parameters (region, count).
   * @returns A cursor-paginated list of trending videos.
   */
  async videos(
    options: TikTokTrendingVideosParams = {}
  ): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>("/v1/tiktok/trending/videos", {
      params: { region: options.region, count: options.count },
    });
  }

  /**
   * Get trending hashtags (mobile Discover surface — view_count + creators).
   *
   * @param options - Optional parameters (region, period, count).
   * @returns The trending hashtags response.
   */
  async hashtags(
    options: TikTokTrendingParams = {}
  ): Promise<TrendingHashtagsResponse> {
    return this.client.request<TrendingHashtagsResponse>(
      "/v1/tiktok/trending/hashtags",
      { params: { region: options.region, period: options.period, count: options.count } }
    );
  }

  /**
   * Get trending songs/sounds (mobile hot-music feed — ranked by usage).
   *
   * @param options - Optional parameters (region, period, count).
   * @returns The trending songs response.
   */
  async songs(
    options: TikTokTrendingParams = {}
  ): Promise<TrendingSongsResponse> {
    return this.client.request<TrendingSongsResponse>(
      "/v1/tiktok/trending/songs",
      { params: { region: options.region, period: options.period, count: options.count } }
    );
  }
}
