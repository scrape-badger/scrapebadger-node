/**
 * YouTube Channels API client.
 *
 * Provides methods for channel detail, tab feeds (videos/shorts/streams/
 * playlists/community), about, subscriber count, in-channel search, and resolve.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubeChannelParams,
  YoutubeChannelTabParams,
  YoutubeChannelSearchParams,
  YoutubeResolveParams,
  Channel,
  ChannelAbout,
  ChannelTabResponse,
  CommunityResponse,
  SubscriberCount,
  SearchResponse,
  ResolveResult,
} from "./types.js";

/**
 * Client for YouTube channel endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const channel = await client.youtube.channels.get("@MrBeast");
 * console.log(`${channel.title} — ${channel.number_of_subscribers} subs`);
 *
 * const videos = await client.youtube.channels.videos("@MrBeast");
 * const id = await client.youtube.channels.resolve({ handle: "@MrBeast" });
 * ```
 */
export class ChannelsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get full channel detail (accepts a UC id, @handle, or custom URL).
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional region parameters.
   * @returns Full channel detail.
   * @throws NotFoundError - If the channel doesn't exist.
   */
  async get(channelId: string, options: YoutubeChannelParams = {}): Promise<Channel> {
    return this.client.request<Channel>(`/v1/youtube/channels/${channelId}`, {
      params: { gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get a page of a channel's long-form videos.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional continuation token and region.
   * @returns A page of video cards with a continuation token.
   */
  async videos(
    channelId: string,
    options: YoutubeChannelTabParams = {}
  ): Promise<ChannelTabResponse> {
    return this.client.request<ChannelTabResponse>(
      `/v1/youtube/channels/${channelId}/videos`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a page of a channel's Shorts.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional continuation token and region.
   * @returns A page of Shorts cards with a continuation token.
   */
  async shorts(
    channelId: string,
    options: YoutubeChannelTabParams = {}
  ): Promise<ChannelTabResponse> {
    return this.client.request<ChannelTabResponse>(
      `/v1/youtube/channels/${channelId}/shorts`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a page of a channel's live streams.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional continuation token and region.
   * @returns A page of stream cards with a continuation token.
   */
  async streams(
    channelId: string,
    options: YoutubeChannelTabParams = {}
  ): Promise<ChannelTabResponse> {
    return this.client.request<ChannelTabResponse>(
      `/v1/youtube/channels/${channelId}/streams`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a page of a channel's playlists.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional continuation token and region.
   * @returns A page of playlist cards with a continuation token.
   */
  async playlists(
    channelId: string,
    options: YoutubeChannelTabParams = {}
  ): Promise<ChannelTabResponse> {
    return this.client.request<ChannelTabResponse>(
      `/v1/youtube/channels/${channelId}/playlists`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a page of a channel's community posts.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional continuation token and region.
   * @returns A page of community posts with a continuation token.
   */
  async community(
    channelId: string,
    options: YoutubeChannelTabParams = {}
  ): Promise<CommunityResponse> {
    return this.client.request<CommunityResponse>(
      `/v1/youtube/channels/${channelId}/community`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a channel's lightweight about payload.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional region parameters.
   * @returns The channel about payload.
   */
  async about(
    channelId: string,
    options: YoutubeChannelParams = {}
  ): Promise<ChannelAbout> {
    return this.client.request<ChannelAbout>(
      `/v1/youtube/channels/${channelId}/about`,
      { params: { gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a channel's subscriber count (fast).
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - Optional region parameters.
   * @returns The subscriber count.
   */
  async subscriberCount(
    channelId: string,
    options: YoutubeChannelParams = {}
  ): Promise<SubscriberCount> {
    return this.client.request<SubscriberCount>(
      `/v1/youtube/channels/${channelId}/subscriber_count`,
      { params: { gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Search within a single channel.
   *
   * @param channelId - The channel id, @handle, or custom URL.
   * @param options - The required query plus optional continuation and region.
   * @returns A page of search results scoped to the channel.
   */
  async search(
    channelId: string,
    options: YoutubeChannelSearchParams
  ): Promise<SearchResponse> {
    return this.client.request<SearchResponse>(
      `/v1/youtube/channels/${channelId}/search`,
      {
        params: {
          query: options.query,
          continuation: options.continuation,
          gl: options.gl,
          hl: options.hl,
        },
      }
    );
  }

  /**
   * Resolve a @handle or URL to canonical YouTube ids.
   *
   * @param options - A `handle` or `url` (one is required) plus optional region.
   * @returns The resolved channel / video / playlist ids.
   */
  async resolve(options: YoutubeResolveParams = {}): Promise<ResolveResult> {
    return this.client.request<ResolveResult>("/v1/youtube/channels/resolve", {
      params: { handle: options.handle, url: options.url, gl: options.gl, hl: options.hl },
    });
  }
}
