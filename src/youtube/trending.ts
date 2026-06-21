/**
 * YouTube Trending API client.
 *
 * Provides methods for the trending feed, trending shorts, hashtag feed, and
 * the guest home feed.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubeTrendingParams,
  YoutubeTrendingShortsParams,
  YoutubeHashtagParams,
  YoutubeHomeParams,
  TrendingResponse,
  HashtagResponse,
  HomeResponse,
} from "./types.js";

/**
 * Client for YouTube trending, hashtag, and home-feed endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const trending = await client.youtube.trending.get({ gl: "US", type: "music" });
 * const shorts = await client.youtube.trending.shorts({ gl: "US" });
 * const tagged = await client.youtube.trending.hashtag("minecraft");
 * const home = await client.youtube.trending.home();
 * ```
 */
export class TrendingClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a page of the trending feed.
   *
   * @param options - Optional feed type, continuation token, and region.
   * @returns A page of trending items with a continuation token.
   */
  async get(options: YoutubeTrendingParams = {}): Promise<TrendingResponse> {
    return this.client.request<TrendingResponse>("/v1/youtube/trending", {
      params: {
        type: options.type,
        continuation: options.continuation,
        gl: options.gl,
        hl: options.hl,
      },
    });
  }

  /**
   * Get a page of trending Shorts.
   *
   * @param options - Optional continuation token and region.
   * @returns A page of trending Shorts with a continuation token.
   */
  async shorts(
    options: YoutubeTrendingShortsParams = {}
  ): Promise<TrendingResponse> {
    return this.client.request<TrendingResponse>("/v1/youtube/trending/shorts", {
      params: { continuation: options.continuation, gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get a page of videos under a hashtag.
   *
   * @param tag - The hashtag (with or without a leading `#`).
   * @param options - Optional continuation token and region.
   * @returns A page of hashtag results with a continuation token.
   */
  async hashtag(
    tag: string,
    options: YoutubeHashtagParams = {}
  ): Promise<HashtagResponse> {
    return this.client.request<HashtagResponse>(`/v1/youtube/hashtags/${tag}`, {
      params: { continuation: options.continuation, gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get a page of the guest home / recommendations feed (best-effort).
   *
   * @param options - Optional continuation token and region.
   * @returns A page of home-feed results with a continuation token.
   */
  async home(options: YoutubeHomeParams = {}): Promise<HomeResponse> {
    return this.client.request<HomeResponse>("/v1/youtube/home", {
      params: { continuation: options.continuation, gl: options.gl, hl: options.hl },
    });
  }
}
