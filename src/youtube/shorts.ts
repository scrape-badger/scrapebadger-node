/**
 * YouTube Shorts API client.
 *
 * Provides methods for a single Short's detail and Shorts attributed to a sound.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubeShortParams,
  YoutubeShortsBySoundParams,
  Short,
  ChannelTabResponse,
} from "./types.js";

/**
 * Client for YouTube Shorts endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const short = await client.youtube.shorts.get("abc123XYZ");
 * console.log(`${short.title} — ${short.sound_title}`);
 *
 * const bySound = await client.youtube.shorts.bySound("sound-id-123");
 * ```
 */
export class ShortsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single Short's detail.
   *
   * @param videoId - The Short's video id.
   * @param options - Optional region parameters.
   * @returns The Short detail.
   * @throws NotFoundError - If the Short doesn't exist or is unavailable.
   */
  async get(videoId: string, options: YoutubeShortParams = {}): Promise<Short> {
    return this.client.request<Short>(`/v1/youtube/shorts/${videoId}`, {
      params: { gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get a page of Shorts attributed to a given sound / music id (best-effort).
   *
   * @param soundId - The sound / music id.
   * @param options - Optional continuation token and region.
   * @returns A page of Shorts cards with a continuation token.
   */
  async bySound(
    soundId: string,
    options: YoutubeShortsBySoundParams = {}
  ): Promise<ChannelTabResponse> {
    return this.client.request<ChannelTabResponse>(
      `/v1/youtube/shorts/by_sound/${soundId}`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }
}
