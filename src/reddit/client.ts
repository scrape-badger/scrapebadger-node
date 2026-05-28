/**
 * Reddit API client.
 *
 * Provides access to all Reddit API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { PostsClient } from "./posts.js";
import { SubredditsClient } from "./subreddits.js";
import { UsersClient } from "./users.js";

/**
 * Reddit API client with access to all Reddit endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Search posts, subreddits, users, and domain posts
 * - `posts` - Trending posts, post details, comments, and cross-posts
 * - `subreddits` - Subreddit details, posts, rules, moderators, and wiki pages
 * - `users` - User profiles, posts, comments, moderated subreddits, and trophies
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search posts
 * const results = await client.reddit.search.posts({ query: "typescript tips" });
 *
 * // Get subreddit details
 * const sub = await client.reddit.subreddits.get("programming");
 *
 * // Get user profile
 * const user = await client.reddit.users.get("spez");
 *
 * // Get trending posts
 * const trending = await client.reddit.posts.trending({ sort: "hot" });
 * ```
 */
export class RedditClient {
  /** Client for search operations (posts, subreddits, users, domain posts) */
  readonly search: SearchClient;

  /** Client for post operations (trending, details, comments, duplicates) */
  readonly posts: PostsClient;

  /** Client for subreddit operations (details, posts, rules, moderators, wiki) */
  readonly subreddits: SubredditsClient;

  /** Client for user operations (profile, posts, comments, moderated, trophies) */
  readonly users: UsersClient;

  /**
   * Create a new Reddit client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.posts = new PostsClient(client);
    this.subreddits = new SubredditsClient(client);
    this.users = new UsersClient(client);
  }
}
