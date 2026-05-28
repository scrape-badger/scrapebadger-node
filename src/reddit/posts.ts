/**
 * Reddit Posts API client.
 *
 * Provides methods for fetching trending posts, post details, comments, and duplicates.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TrendingPostsResponse,
  PostDetailResponse,
  PostCommentsResponse,
  PostDuplicatesResponse,
} from "./types.js";

/**
 * Client for Reddit post endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get trending posts
 * const trending = await client.reddit.posts.trending({ subreddit: "programming" });
 *
 * // Get post details
 * const post = await client.reddit.posts.get("t3_abc123");
 *
 * // Get post comments
 * const { comments } = await client.reddit.posts.comments("abc123", { subreddit: "programming" });
 * ```
 */
export class PostsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get trending/hot posts from Reddit or a specific subreddit.
   *
   * @param options - Request parameters.
   * @param options.subreddit - Subreddit name (without r/). If omitted, returns site-wide posts.
   * @param options.sort - Sort order (hot, new, top, rising, controversial).
   * @param options.time - Time filter for top/controversial (hour, day, week, month, year, all).
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Trending posts with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const results = await client.reddit.posts.trending({
   *   subreddit: "worldnews",
   *   sort: "hot",
   *   limit: 25,
   * });
   * for (const post of results.posts) {
   *   console.log(`${post.title} (${post.num_comments} comments)`);
   * }
   * ```
   */
  async trending(options: {
    subreddit?: string;
    sort?: "hot" | "new" | "top" | "rising" | "controversial";
    time?: "hour" | "day" | "week" | "month" | "year" | "all";
    after?: string;
    limit?: number;
  } = {}): Promise<TrendingPostsResponse> {
    return this.client.request<TrendingPostsResponse>("/v1/reddit/posts", {
      params: {
        subreddit: options.subreddit,
        sort: options.sort,
        time: options.time,
        after: options.after,
        limit: options.limit,
      },
    });
  }

  /**
   * Get full details of a single Reddit post.
   *
   * @param postId - The Reddit post ID (e.g. "abc123" or "t3_abc123").
   * @param options - Optional parameters.
   * @param options.subreddit - Subreddit name (helps resolve the post URL).
   * @returns Full post details.
   * @throws NotFoundError - If the post doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.posts.get("abc123", { subreddit: "programming" });
   * const { post } = response;
   * console.log(`${post.title} by u/${post.author}`);
   * console.log(`Score: ${post.score}, Comments: ${post.num_comments}`);
   * ```
   */
  async get(
    postId: string,
    options: { subreddit?: string } = {}
  ): Promise<PostDetailResponse> {
    return this.client.request<PostDetailResponse>(
      `/v1/reddit/posts/${postId}`,
      { params: { subreddit: options.subreddit } }
    );
  }

  /**
   * Get comments for a Reddit post.
   *
   * @param postId - The Reddit post ID (e.g. "abc123" or "t3_abc123").
   * @param options - Optional parameters.
   * @param options.subreddit - Subreddit name (helps resolve the post URL).
   * @param options.sort - Comment sort order (confidence, top, new, controversial, old, qa).
   * @param options.depth - Maximum comment tree depth.
   * @param options.limit - Number of top-level comments to return.
   * @returns Post details and nested comment tree.
   * @throws NotFoundError - If the post doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.posts.comments("abc123", {
   *   subreddit: "programming",
   *   sort: "top",
   *   limit: 50,
   * });
   * for (const comment of response.comments) {
   *   console.log(`u/${comment.author}: ${comment.body.slice(0, 100)}`);
   * }
   * ```
   */
  async comments(
    postId: string,
    options: {
      subreddit?: string;
      sort?: "confidence" | "top" | "new" | "controversial" | "old" | "qa";
      depth?: number;
      limit?: number;
    } = {}
  ): Promise<PostCommentsResponse> {
    return this.client.request<PostCommentsResponse>(
      `/v1/reddit/posts/${postId}/comments`,
      {
        params: {
          subreddit: options.subreddit,
          sort: options.sort,
          depth: options.depth,
          limit: options.limit,
        },
      }
    );
  }

  /**
   * Get cross-posts and duplicate submissions of a Reddit post.
   *
   * @param postId - The Reddit post ID (e.g. "abc123" or "t3_abc123").
   * @param options - Optional parameters.
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns The original post and its duplicate submissions.
   * @throws NotFoundError - If the post doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.posts.duplicates("abc123");
   * console.log(`Original: ${response.post.title}`);
   * console.log(`Cross-posted ${response.duplicates.length} times`);
   * for (const dupe of response.duplicates) {
   *   console.log(`  r/${dupe.subreddit}: ${dupe.score} points`);
   * }
   * ```
   */
  async duplicates(
    postId: string,
    options: {
      after?: string;
      limit?: number;
    } = {}
  ): Promise<PostDuplicatesResponse> {
    return this.client.request<PostDuplicatesResponse>(
      `/v1/reddit/posts/${postId}/duplicates`,
      {
        params: {
          after: options.after,
          limit: options.limit,
        },
      }
    );
  }
}
