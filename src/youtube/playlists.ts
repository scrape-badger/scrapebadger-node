/**
 * YouTube Playlists API client.
 *
 * Provides methods for playlist detail, playlist items pagination, and mixes.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubePlaylistParams,
  YoutubePlaylistItemsParams,
  Playlist,
  PlaylistItemsResponse,
} from "./types.js";

/**
 * Client for YouTube playlist and mix endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const playlist = await client.youtube.playlists.get("PL1234567890");
 * console.log(`${playlist.title} — ${playlist.video_count} videos`);
 *
 * const page = await client.youtube.playlists.items("PL1234567890", {
 *   continuation: playlist.continuation ?? undefined,
 * });
 *
 * const mix = await client.youtube.playlists.mix("RDQM1234567890");
 * ```
 */
export class PlaylistsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get full playlist detail plus the first page of items.
   *
   * @param playlistId - The playlist id.
   * @param options - Optional region parameters.
   * @returns Full playlist detail with a continuation token.
   * @throws NotFoundError - If the playlist doesn't exist.
   */
  async get(
    playlistId: string,
    options: YoutubePlaylistParams = {}
  ): Promise<Playlist> {
    return this.client.request<Playlist>(`/v1/youtube/playlists/${playlistId}`, {
      params: { gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get a continuation page of a playlist's items.
   *
   * @param playlistId - The playlist id.
   * @param options - Optional continuation token and region.
   * @returns A page of playlist items with a continuation token.
   */
  async items(
    playlistId: string,
    options: YoutubePlaylistItemsParams = {}
  ): Promise<PlaylistItemsResponse> {
    return this.client.request<PlaylistItemsResponse>(
      `/v1/youtube/playlists/${playlistId}/items`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Resolve an auto-generated mix / radio (RD…) queue.
   *
   * @param mixId - The mix / radio playlist id.
   * @param options - Optional region parameters.
   * @returns The mix as a playlist queue.
   */
  async mix(mixId: string, options: YoutubePlaylistParams = {}): Promise<Playlist> {
    return this.client.request<Playlist>(`/v1/youtube/mixes/${mixId}`, {
      params: { gl: options.gl, hl: options.hl },
    });
  }
}
