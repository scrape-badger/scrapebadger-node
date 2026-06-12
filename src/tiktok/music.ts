/**
 * TikTok Music API client.
 *
 * Provides sound/music detail and the videos using a given sound.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokMusicParams,
  TikTokListVideosParams,
  MusicResponse,
  VideoListResponse,
} from "./types.js";

/**
 * Client for TikTok music endpoints (detail, videos).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const music = await client.tiktok.music.get("6975...");
 * const videos = await client.tiktok.music.videos("6975...");
 * ```
 */
export class MusicClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get TikTok sound/music detail.
   *
   * @param musicId - The sound/music id.
   * @param options - Optional parameters (region).
   * @returns The music detail response.
   * @throws NotFoundError - If the music doesn't exist.
   */
  async get(musicId: string, options: TikTokMusicParams = {}): Promise<MusicResponse> {
    return this.client.request<MusicResponse>(`/v1/tiktok/music/${musicId}`, {
      params: { region: options.region },
    });
  }

  /**
   * Get videos using a given TikTok sound.
   *
   * @param musicId - The sound/music id.
   * @param options - Optional parameters (region, count).
   * @returns A cursor-paginated list of videos.
   */
  async videos(musicId: string, options: TikTokListVideosParams = {}): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>(`/v1/tiktok/music/${musicId}/videos`, {
      params: { region: options.region, count: options.count },
    });
  }
}
