/**
 * Reddit Search API client.
 *
 * Provides methods for searching Reddit posts, subreddits, users, and domain posts.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  SearchPostsResponse,
  SearchSubredditsResponse,
  SearchUsersResponse,
  DomainPostsResponse,
} from "./types.js";

/**
 * Client for Reddit search endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search posts
 * const results = await client.reddit.search.posts({ query: "typescript tips" });
 * for (const post of results.posts) {
 *   console.log(`${post.title} — ${post.score} points`);
 * }
 *
 * // Search subreddits
 * const subs = await client.reddit.search.subreddits({ query: "programming" });
 *
 * // Get posts from a domain
 * const domainPosts = await client.reddit.search.domainPosts({ domain: "github.com" });
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Reddit posts.
   *
   * @param options - Search parameters.
   * @param options.query - Search query string.
   * @param options.subreddit - Restrict search to a specific subreddit.
   * @param options.sort - Sort order (relevance, hot, top, new, comments).
   * @param options.time - Time filter (hour, day, week, month, year, all).
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Search results with posts and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the search parameters are invalid.
   *
   * @example
   * ```typescript
   * const results = await client.reddit.search.posts({
   *   query: "best practices",
   *   subreddit: "programming",
   *   sort: "top",
   *   time: "month",
   *   limit: 25,
   * });
   * console.log(`Found ${results.posts.length} posts`);
   * ```
   */
  async posts(options: {
    query: string;
    subreddit?: string;
    sort?: "relevance" | "hot" | "top" | "new" | "comments";
    time?: "hour" | "day" | "week" | "month" | "year" | "all";
    after?: string;
    limit?: number;
  }): Promise<SearchPostsResponse> {
    return this.client.request<SearchPostsResponse>("/v1/reddit/search/posts", {
      params: {
        query: options.query,
        subreddit: options.subreddit,
        sort: options.sort,
        time: options.time,
        after: options.after,
        limit: options.limit,
      },
    });
  }

  /**
   * Search Reddit subreddits.
   *
   * @param options - Search parameters.
   * @param options.query - Search query string.
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Matching subreddits with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the search parameters are invalid.
   *
   * @example
   * ```typescript
   * const results = await client.reddit.search.subreddits({
   *   query: "javascript",
   *   limit: 10,
   * });
   * for (const sub of results.subreddits) {
   *   console.log(`r/${sub.display_name}: ${sub.subscribers.toLocaleString()} subscribers`);
   * }
   * ```
   */
  async subreddits(options: {
    query: string;
    after?: string;
    limit?: number;
  }): Promise<SearchSubredditsResponse> {
    return this.client.request<SearchSubredditsResponse>(
      "/v1/reddit/search/subreddits",
      {
        params: {
          query: options.query,
          after: options.after,
          limit: options.limit,
        },
      }
    );
  }

  /**
   * Search Reddit users.
   *
   * @param options - Search parameters.
   * @param options.query - Search query string.
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Matching users with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the search parameters are invalid.
   *
   * @example
   * ```typescript
   * const results = await client.reddit.search.users({
   *   query: "john",
   *   limit: 20,
   * });
   * for (const user of results.users) {
   *   console.log(`u/${user.name}: ${user.total_karma.toLocaleString()} karma`);
   * }
   * ```
   */
  async users(options: {
    query: string;
    after?: string;
    limit?: number;
  }): Promise<SearchUsersResponse> {
    return this.client.request<SearchUsersResponse>(
      "/v1/reddit/search/users",
      {
        params: {
          query: options.query,
          after: options.after,
          limit: options.limit,
        },
      }
    );
  }

  /**
   * Get Reddit posts linking to a specific domain.
   *
   * @param options - Request parameters.
   * @param options.domain - Domain name to search for (e.g. "github.com").
   * @param options.sort - Sort order (hot, new, top, rising).
   * @param options.time - Time filter for top sort (hour, day, week, month, year, all).
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Posts linking to the domain with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   *
   * @example
   * ```typescript
   * const results = await client.reddit.search.domainPosts({
   *   domain: "github.com",
   *   sort: "top",
   *   time: "week",
   *   limit: 25,
   * });
   * for (const post of results.posts) {
   *   console.log(`r/${post.subreddit}: ${post.title}`);
   * }
   * ```
   */
  async domainPosts(options: {
    domain: string;
    sort?: "hot" | "new" | "top" | "rising";
    time?: "hour" | "day" | "week" | "month" | "year" | "all";
    after?: string;
    limit?: number;
  }): Promise<DomainPostsResponse> {
    return this.client.request<DomainPostsResponse>(
      "/v1/reddit/search/domain",
      {
        params: {
          domain: options.domain,
          sort: options.sort,
          time: options.time,
          after: options.after,
          limit: options.limit,
        },
      }
    );
  }
}
