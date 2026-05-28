/**
 * Reddit Subreddits API client.
 *
 * Provides methods for fetching subreddit details, posts, rules, and wiki pages.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  SubredditDetailResponse,
  SubredditPostsResponse,
  SubredditRulesResponse,
  SubredditWikiPagesResponse,
  WikiPageResponse,
  PopularSubredditsResponse,
} from "./types.js";

/**
 * Client for Reddit subreddit endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get subreddit details
 * const sub = await client.reddit.subreddits.get("programming");
 * console.log(`r/programming: ${sub.subreddit.subscribers.toLocaleString()} subscribers`);
 *
 * // Get subreddit posts
 * const posts = await client.reddit.subreddits.posts("programming", { sort: "top" });
 *
 * // Get subreddit rules
 * const rules = await client.reddit.subreddits.rules("programming");
 * ```
 */
export class SubredditsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a subreddit's full details and metadata.
   *
   * @param subreddit - Subreddit name (without r/ prefix).
   * @returns Full subreddit details.
   * @throws NotFoundError - If the subreddit doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.get("javascript");
   * const { subreddit } = response;
   * console.log(`${subreddit.title}: ${subreddit.subscribers.toLocaleString()} members`);
   * console.log(`Description: ${subreddit.public_description}`);
   * ```
   */
  async get(subreddit: string): Promise<SubredditDetailResponse> {
    return this.client.request<SubredditDetailResponse>(`/v1/reddit/subreddits/${subreddit}`);
  }

  /**
   * Get posts from a subreddit.
   *
   * @param subreddit - Subreddit name (without r/ prefix).
   * @param options - Optional parameters.
   * @param options.sort - Sort order (hot, new, top, rising, controversial).
   * @param options.time - Time filter for top/controversial (hour, day, week, month, year, all).
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Subreddit posts with pagination metadata.
   * @throws NotFoundError - If the subreddit doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.posts("typescript", {
   *   sort: "top",
   *   time: "week",
   *   limit: 25,
   * });
   * for (const post of response.posts) {
   *   console.log(`${post.title} — ${post.score} pts`);
   * }
   * ```
   */
  async posts(
    subreddit: string,
    options: {
      sort?: "hot" | "new" | "top" | "rising" | "controversial";
      time?: "hour" | "day" | "week" | "month" | "year" | "all";
      after?: string;
      limit?: number;
    } = {}
  ): Promise<SubredditPostsResponse> {
    return this.client.request<SubredditPostsResponse>(`/v1/reddit/subreddits/${subreddit}/posts`, {
      params: {
        sort: options.sort,
        time: options.time,
        after: options.after,
        limit: options.limit,
      },
    });
  }

  /**
   * Get the rules for a subreddit.
   *
   * @param subreddit - Subreddit name (without r/ prefix).
   * @returns List of subreddit rules.
   * @throws NotFoundError - If the subreddit doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.rules("AskReddit");
   * for (const rule of response.rules) {
   *   console.log(`${rule.priority}. ${rule.short_name}`);
   *   console.log(`   ${rule.description}`);
   * }
   * ```
   */
  async rules(subreddit: string): Promise<SubredditRulesResponse> {
    return this.client.request<SubredditRulesResponse>(`/v1/reddit/subreddits/${subreddit}/rules`);
  }

  /**
   * List all wiki pages in a subreddit.
   *
   * @param subreddit - Subreddit name (without r/ prefix).
   * @returns List of wiki page slugs.
   * @throws NotFoundError - If the subreddit doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.wikiPages("rust");
   * for (const page of response.pages) {
   *   console.log(`/r/rust/wiki/${page}`);
   * }
   * ```
   */
  async wikiPages(subreddit: string): Promise<SubredditWikiPagesResponse> {
    return this.client.request<SubredditWikiPagesResponse>(
      `/v1/reddit/subreddits/${subreddit}/wiki`
    );
  }

  /**
   * Get the content of a specific wiki page in a subreddit.
   *
   * @param subreddit - Subreddit name (without r/ prefix).
   * @param page - Wiki page slug (e.g. "index", "faq").
   * @returns Wiki page content and metadata.
   * @throws NotFoundError - If the subreddit or wiki page doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.wikiPage("learnprogramming", "faq");
   * console.log(`Last edited by: u/${response.page.revision_by}`);
   * console.log(response.page.content_md);
   * ```
   */
  async wikiPage(subreddit: string, page: string): Promise<WikiPageResponse> {
    return this.client.request<WikiPageResponse>(`/v1/reddit/subreddits/${subreddit}/wiki/${page}`);
  }

  /**
   * Get the most popular subreddits on Reddit.
   *
   * @param options - Optional parameters.
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns Popular subreddits with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.popular({ limit: 20 });
   * for (const sub of response.subreddits) {
   *   console.log(`r/${sub.display_name}: ${sub.subscribers.toLocaleString()} subscribers`);
   * }
   * ```
   */
  async popular(
    options: {
      after?: string;
      limit?: number;
    } = {}
  ): Promise<PopularSubredditsResponse> {
    return this.client.request<PopularSubredditsResponse>("/v1/reddit/subreddits/popular", {
      params: {
        after: options.after,
        limit: options.limit,
      },
    });
  }

  /**
   * Get newly created subreddits on Reddit.
   *
   * @param options - Optional parameters.
   * @param options.after - Pagination cursor for the next page.
   * @param options.limit - Number of results to return (max 100).
   * @returns New subreddits with pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.reddit.subreddits.newSubreddits({ limit: 20 });
   * for (const sub of response.subreddits) {
   *   console.log(`r/${sub.display_name} (created: ${new Date(sub.created_utc * 1000).toLocaleDateString()})`);
   * }
   * ```
   */
  async newSubreddits(
    options: {
      after?: string;
      limit?: number;
    } = {}
  ): Promise<PopularSubredditsResponse> {
    return this.client.request<PopularSubredditsResponse>("/v1/reddit/subreddits/new", {
      params: {
        after: options.after,
        limit: options.limit,
      },
    });
  }
}
