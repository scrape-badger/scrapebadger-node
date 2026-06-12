/**
 * TikTok Videos API client.
 *
 * Provides methods for video detail, comments, comment replies, related
 * videos, transcript, and oEmbed metadata.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokVideoParams,
  TikTokCommentsParams,
  TikTokCommentRepliesParams,
  TikTokRelatedParams,
  TikTokTranscriptParams,
  TikTokOEmbedParams,
  VideoResponse,
  CommentListResponse,
  VideoListResponse,
  TranscriptResponse,
  TikTokOEmbed,
} from "./types.js";

/**
 * Client for TikTok video endpoints (detail, comments, replies, related, transcript, oEmbed).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const video = await client.tiktok.videos.get("7372...");
 * console.log(video.video.stats.play_count);
 *
 * const comments = await client.tiktok.videos.comments("7372...");
 * ```
 */
export class VideosClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get full metadata for a single TikTok video/post.
   *
   * @param videoId - The video/post id.
   * @param options - Optional parameters (region, username).
   * @returns The video detail response.
   * @throws NotFoundError - If the video doesn't exist.
   */
  async get(videoId: string, options: TikTokVideoParams = {}): Promise<VideoResponse> {
    return this.client.request<VideoResponse>(`/v1/tiktok/videos/${videoId}`, {
      params: { region: options.region, username: options.username },
    });
  }

  /**
   * Get top-level comments on a TikTok video.
   *
   * @param videoId - The video/post id.
   * @param options - Optional parameters (region, count, cursor).
   * @returns A cursor-paginated list of comments.
   */
  async comments(
    videoId: string,
    options: TikTokCommentsParams = {}
  ): Promise<CommentListResponse> {
    return this.client.request<CommentListResponse>(`/v1/tiktok/videos/${videoId}/comments`, {
      params: { region: options.region, count: options.count },
    });
  }

  /**
   * Get replies to a TikTok comment (best-effort).
   *
   * @param commentId - The comment id.
   * @param options - Parameters including the required `videoId` (region, count).
   * @returns A cursor-paginated list of reply comments.
   */
  async commentReplies(
    commentId: string,
    options: TikTokCommentRepliesParams
  ): Promise<CommentListResponse> {
    return this.client.request<CommentListResponse>(`/v1/tiktok/comments/${commentId}/replies`, {
      params: {
        video_id: options.videoId,
        region: options.region,
        count: options.count,
      },
    });
  }

  /**
   * Get TikTok's related videos for a given video.
   *
   * @param videoId - The video/post id.
   * @param options - Optional parameters (region, count).
   * @returns A cursor-paginated list of related videos.
   */
  async related(videoId: string, options: TikTokRelatedParams = {}): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>(`/v1/tiktok/videos/${videoId}/related`, {
      params: { region: options.region, count: options.count },
    });
  }

  /**
   * Get subtitle/caption tracks for a TikTok video.
   *
   * @param videoId - The video/post id.
   * @param options - Optional parameters (region).
   * @returns The transcript response with subtitle tracks and voice-to-text.
   */
  async transcript(
    videoId: string,
    options: TikTokTranscriptParams = {}
  ): Promise<TranscriptResponse> {
    return this.client.request<TranscriptResponse>(`/v1/tiktok/videos/${videoId}/transcript`, {
      params: { region: options.region },
    });
  }

  /**
   * Get cheap unauthenticated oEmbed metadata for a TikTok URL.
   *
   * @param url - Full TikTok video or profile URL.
   * @param options - Optional parameters (region).
   * @returns The oEmbed metadata.
   */
  async oembed(url: string, options: TikTokOEmbedParams = {}): Promise<TikTokOEmbed> {
    return this.client.request<TikTokOEmbed>("/v1/tiktok/oembed", {
      params: { url, region: options.region },
    });
  }
}
