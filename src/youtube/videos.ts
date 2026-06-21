/**
 * YouTube Videos API client.
 *
 * Provides methods for video detail, related videos, comments, replies,
 * transcript, captions, stream formats, live chat, batch detail, and oEmbed.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubeVideoParams,
  YoutubeRelatedParams,
  YoutubeCommentsParams,
  YoutubeRepliesParams,
  YoutubeTranscriptParams,
  YoutubeCaptionsParams,
  YoutubeStreamsParams,
  YoutubeLiveChatParams,
  YoutubeBatchParams,
  YoutubeOEmbedParams,
  Video,
  RelatedResponse,
  CommentsResponse,
  RepliesResponse,
  Transcript,
  CaptionsResponse,
  StreamingData,
  LiveChatResponse,
  BatchResponse,
  OEmbed,
} from "./types.js";

/**
 * Client for YouTube video endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const video = await client.youtube.videos.get("dQw4w9WgXcQ");
 * console.log(`${video.title} — ${video.view_count} views`);
 *
 * const comments = await client.youtube.videos.comments("dQw4w9WgXcQ");
 * const transcript = await client.youtube.videos.transcript("dQw4w9WgXcQ");
 * ```
 */
export class VideosClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single video's full detail (merged `player` + `next`).
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional region parameters (gl, hl).
   * @returns Full video detail including engagement, channel, chapters, and heatmap.
   * @throws NotFoundError - If the video doesn't exist or is unavailable.
   */
  async get(videoId: string, options: YoutubeVideoParams = {}): Promise<Video> {
    return this.client.request<Video>(`/v1/youtube/videos/${videoId}`, {
      params: { gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get related / recommended videos for a video.
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional region parameters and a continuation token.
   * @returns Related results with a continuation token.
   */
  async related(
    videoId: string,
    options: YoutubeRelatedParams = {}
  ): Promise<RelatedResponse> {
    return this.client.request<RelatedResponse>(
      `/v1/youtube/videos/${videoId}/related`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a page of top-level comments for a video.
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional sort order, continuation token, and region.
   * @returns A page of comments with sorting tokens and a continuation token.
   */
  async comments(
    videoId: string,
    options: YoutubeCommentsParams = {}
  ): Promise<CommentsResponse> {
    return this.client.request<CommentsResponse>(
      `/v1/youtube/videos/${videoId}/comments`,
      {
        params: {
          sort_by: options.sort_by,
          continuation: options.continuation,
          gl: options.gl,
          hl: options.hl,
        },
      }
    );
  }

  /**
   * Get a page of replies to a single comment.
   *
   * @param videoId - The YouTube video id.
   * @param commentId - The comment id whose replies to fetch.
   * @param options - The required replies continuation token plus region.
   * @returns A page of replies with a continuation token.
   */
  async replies(
    videoId: string,
    commentId: string,
    options: YoutubeRepliesParams
  ): Promise<RepliesResponse> {
    return this.client.request<RepliesResponse>(
      `/v1/youtube/videos/${videoId}/comments/${commentId}/replies`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a video's transcript in the selected language.
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional language and region parameters.
   * @returns The transcript with timed segments and full text.
   */
  async transcript(
    videoId: string,
    options: YoutubeTranscriptParams = {}
  ): Promise<Transcript> {
    return this.client.request<Transcript>(
      `/v1/youtube/videos/${videoId}/transcript`,
      { params: { language: options.language, gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * List a video's available caption tracks.
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional region parameters.
   * @returns The available caption tracks and translation languages.
   */
  async captions(
    videoId: string,
    options: YoutubeCaptionsParams = {}
  ): Promise<CaptionsResponse> {
    return this.client.request<CaptionsResponse>(
      `/v1/youtube/videos/${videoId}/captions`,
      { params: { gl: options.gl, hl: options.hl } }
    );
  }

  /**
   * Get a video's stream / format metadata (best-effort; URLs may be PO-token gated).
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional content region and player client.
   * @returns Streaming metadata with muxed and adaptive formats.
   */
  async streams(
    videoId: string,
    options: YoutubeStreamsParams = {}
  ): Promise<StreamingData> {
    return this.client.request<StreamingData>(
      `/v1/youtube/videos/${videoId}/streams`,
      { params: { gl: options.gl, client: options.client } }
    );
  }

  /**
   * Get a page of live-chat (or chat-replay) messages for a video.
   *
   * @param videoId - The YouTube video id.
   * @param options - Optional continuation token, replay flag, and region.
   * @returns A page of live-chat messages with a continuation token.
   */
  async liveChat(
    videoId: string,
    options: YoutubeLiveChatParams = {}
  ): Promise<LiveChatResponse> {
    return this.client.request<LiveChatResponse>(
      `/v1/youtube/videos/${videoId}/live_chat`,
      {
        params: {
          continuation: options.continuation,
          replay: options.replay,
          gl: options.gl,
          hl: options.hl,
        },
      }
    );
  }

  /**
   * Fetch detail for up to 50 videos concurrently.
   *
   * @param params - The video ids (≤50) plus optional region parameters.
   * @returns Successfully fetched videos plus per-id errors.
   */
  async batch(params: YoutubeBatchParams): Promise<BatchResponse> {
    return this.client.request<BatchResponse>("/v1/youtube/videos/batch", {
      method: "POST",
      body: { video_ids: params.video_ids, gl: params.gl, hl: params.hl },
    });
  }

  /**
   * Get public oEmbed metadata for a YouTube URL (no proxy/InnerTube needed).
   *
   * @param url - A YouTube video/playlist/channel URL.
   * @returns The oEmbed metadata.
   */
  async oembed(url: string): Promise<OEmbed>;
  async oembed(params: YoutubeOEmbedParams): Promise<OEmbed>;
  async oembed(arg: string | YoutubeOEmbedParams): Promise<OEmbed> {
    const url = typeof arg === "string" ? arg : arg.url;
    return this.client.request<OEmbed>("/v1/youtube/oembed", { params: { url } });
  }
}
