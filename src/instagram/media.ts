/**
 * Instagram Media API client.
 *
 * Fetches media details, oEmbed metadata, comments, comment replies, and the
 * users who liked a media or a comment.
 */

import type { BaseClient } from "../internal/client.js";
import type { Comment, Media, Oembed, Paginated, UserShort } from "./types.js";

/**
 * Client for Instagram media endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const media = await client.instagram.media.get("C1abcdEfGhI");
 * console.log(media.caption_text, media.like_count);
 *
 * const comments = await client.instagram.media.comments(media.code, { amount: 20 });
 * for (const comment of comments.items) {
 *   console.log(`@${comment.user?.username}: ${comment.text}`);
 * }
 * ```
 */
export class MediaClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a media's full details.
   *
   * @param code - The media shortcode (from the `/p/<code>/` URL).
   */
  async get(code: string): Promise<Media> {
    return this.client.request<Media>(`/v1/instagram/media/${code}`);
  }

  /** Get oEmbed metadata for a media permalink. */
  async oembed(code: string): Promise<Oembed> {
    return this.client.request<Oembed>(`/v1/instagram/media/${code}/oembed`);
  }

  /** Get top-level comments on a media. */
  async comments(
    code: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Comment>> {
    return this.client.request<Paginated<Comment>>(
      `/v1/instagram/media/${code}/comments`,
      { params: { amount: options.amount, cursor: options.cursor } }
    );
  }

  /** Get the users who liked a media. */
  async likers(code: string): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      `/v1/instagram/media/${code}/likers`
    );
  }

  /** Get replies to a comment. */
  async replies(
    code: string,
    commentId: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Comment>> {
    return this.client.request<Paginated<Comment>>(
      `/v1/instagram/media/${code}/comments/${commentId}/replies`,
      { params: { amount: options.amount, cursor: options.cursor } }
    );
  }

  /** Get the users who liked a comment. */
  async commentLikers(
    code: string,
    commentId: string
  ): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      `/v1/instagram/media/${code}/comments/${commentId}/likers`
    );
  }
}
