/**
 * Reddit Users API client.
 *
 * Provides methods for fetching Reddit user profiles, posts, comments, moderated subreddits, and trophies.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  UserProfileResponse,
  UserPostsResponse,
  UserCommentsResponse,
  UserModeratedResponse,
  UserTrophiesResponse,
} from "./types.js";

/**
 * Client for Reddit user endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get user profile
 * const profile = await client.reddit.users.get("spez");
 * console.log(`u/${profile.user.name}: ${profile.user.total_karma.toLocaleString()} karma`);
 *
 * // Get user's recent posts
 * const posts = await client.reddit.users.posts("spez", { sort: "top", limit: 10 });
 *
 * // Get user's comments
 * const comments = await client.reddit.users.comments("spez", { sort: "new" });
 * ```
 */
export class UsersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a Reddit user's profile.
   *
   * @param username - The Reddit username (without u/ prefix).
   * @returns The user profile response.
   * @throws NotFoundError - If the user doesn't exist or is suspended.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.users.get("spez");
   * const { user } = response;
   * console.log(`u/${user.name}`);
   * console.log(`Karma: ${user.total_karma.toLocaleString()} (${user.link_karma} post, ${user.comment_karma} comment)`);
   * console.log(`Account age: ${new Date(user.created_utc * 1000).toLocaleDateString()}`);
   * ```
   */
  async get(username: string): Promise<UserProfileResponse> {
    return this.client.request<UserProfileResponse>(
      `/v1/reddit/users/${username}`
    );
  }

  /**
   * Get posts submitted by a Reddit user.
   *
   * @param username - The Reddit username (without u/ prefix).
   * @param options - Optional parameters.
   * @param options.sort - Sort order (hot, new, top, controversial).
   * @param options.time - Time filter for top/controversial (hour, day, week, month, year, all).
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns The user's posts with pagination metadata.
   * @throws NotFoundError - If the user doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.users.posts("spez", {
   *   sort: "top",
   *   time: "all",
   *   limit: 25,
   * });
   * for (const post of response.posts) {
   *   console.log(`r/${post.subreddit}: ${post.title} (${post.score} pts)`);
   * }
   * ```
   */
  async posts(
    username: string,
    options: {
      sort?: "hot" | "new" | "top" | "controversial";
      time?: "hour" | "day" | "week" | "month" | "year" | "all";
      after?: string;
      limit?: number;
    } = {}
  ): Promise<UserPostsResponse> {
    return this.client.request<UserPostsResponse>(
      `/v1/reddit/users/${username}/posts`,
      {
        params: {
          sort: options.sort,
          time: options.time,
          after: options.after,
          limit: options.limit,
        },
      }
    );
  }

  /**
   * Get comments made by a Reddit user.
   *
   * @param username - The Reddit username (without u/ prefix).
   * @param options - Optional parameters.
   * @param options.sort - Sort order (hot, new, top, controversial).
   * @param options.time - Time filter for top/controversial (hour, day, week, month, year, all).
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns The user's comments with pagination metadata.
   * @throws NotFoundError - If the user doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.users.comments("spez", {
   *   sort: "new",
   *   limit: 50,
   * });
   * for (const comment of response.comments) {
   *   console.log(`r/${comment.subreddit}: ${comment.body.slice(0, 80)}`);
   * }
   * ```
   */
  async comments(
    username: string,
    options: {
      sort?: "hot" | "new" | "top" | "controversial";
      time?: "hour" | "day" | "week" | "month" | "year" | "all";
      after?: string;
      limit?: number;
    } = {}
  ): Promise<UserCommentsResponse> {
    return this.client.request<UserCommentsResponse>(
      `/v1/reddit/users/${username}/comments`,
      {
        params: {
          sort: options.sort,
          time: options.time,
          after: options.after,
          limit: options.limit,
        },
      }
    );
  }

  /**
   * Get subreddits moderated by a Reddit user.
   *
   * @param username - The Reddit username (without u/ prefix).
   * @returns Subreddits moderated by the user.
   * @throws NotFoundError - If the user doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.users.moderated("spez");
   * for (const sub of response.subreddits) {
   *   console.log(`r/${sub.display_name}: ${sub.subscribers.toLocaleString()} subscribers`);
   * }
   * ```
   */
  async moderated(username: string): Promise<UserModeratedResponse> {
    return this.client.request<UserModeratedResponse>(
      `/v1/reddit/users/${username}/moderated`
    );
  }

  /**
   * Get trophies awarded to a Reddit user.
   *
   * @param username - The Reddit username (without u/ prefix).
   * @returns List of trophies awarded to the user.
   * @throws NotFoundError - If the user doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.users.trophies("spez");
   * for (const trophy of response.trophies) {
   *   console.log(`${trophy.name}${trophy.description ? `: ${trophy.description}` : ""}`);
   * }
   * ```
   */
  async trophies(username: string): Promise<UserTrophiesResponse> {
    return this.client.request<UserTrophiesResponse>(
      `/v1/reddit/users/${username}/trophies`
    );
  }
}
