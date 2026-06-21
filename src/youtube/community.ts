/**
 * YouTube Community API client.
 *
 * Provides methods for community post detail and post comments.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubePostParams,
  YoutubePostCommentsParams,
  CommunityPost,
  CommentsResponse,
} from "./types.js";

/**
 * Client for YouTube community post endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const post = await client.youtube.community.get("Ugkx1234567890");
 * console.log(post.text);
 *
 * const comments = await client.youtube.community.comments("Ugkx1234567890");
 * ```
 */
export class CommunityClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single community post's detail.
   *
   * @param postId - The community post id.
   * @param options - Optional region parameters.
   * @returns The community post.
   * @throws NotFoundError - If the post doesn't exist.
   */
  async get(postId: string, options: YoutubePostParams = {}): Promise<CommunityPost> {
    return this.client.request<CommunityPost>(`/v1/youtube/posts/${postId}`, {
      params: { gl: options.gl, hl: options.hl },
    });
  }

  /**
   * Get a page of comments on a community post.
   *
   * @param postId - The community post id.
   * @param options - Optional continuation token and region.
   * @returns A page of comments with a continuation token.
   */
  async comments(
    postId: string,
    options: YoutubePostCommentsParams = {}
  ): Promise<CommentsResponse> {
    return this.client.request<CommentsResponse>(
      `/v1/youtube/posts/${postId}/comments`,
      { params: { continuation: options.continuation, gl: options.gl, hl: options.hl } }
    );
  }
}
