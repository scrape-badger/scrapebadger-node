/**
 * Twitter API client.
 *
 * Provides access to all Twitter API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { TweetsClient } from "./tweets.js";
import { UsersClient } from "./users.js";
import { ListsClient } from "./lists.js";
import { CommunitiesClient } from "./communities.js";
import { TrendsClient } from "./trends.js";
import { GeoClient } from "./geo.js";

/**
 * Twitter API client with access to all Twitter endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `tweets` - Tweet operations (get, search, replies, retweeters, etc.)
 * - `users` - User operations (profiles, followers, following, search, etc.)
 * - `lists` - List operations (details, members, tweets, search, etc.)
 * - `communities` - Community operations (details, members, tweets, search, etc.)
 * - `trends` - Trending topics and locations
 * - `geo` - Geographic place information
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Access tweets
 * const tweet = await client.twitter.tweets.getById("1234567890");
 *
 * // Access users
 * const user = await client.twitter.users.getByUsername("elonmusk");
 *
 * // Access trends
 * const trends = await client.twitter.trends.getTrends();
 *
 * // Search with automatic pagination
 * for await (const tweet of client.twitter.tweets.searchAll("python")) {
 *   console.log(tweet.text);
 * }
 * ```
 */
export class TwitterClient {
  /** Client for tweet operations */
  readonly tweets: TweetsClient;

  /** Client for user operations */
  readonly users: UsersClient;

  /** Client for list operations */
  readonly lists: ListsClient;

  /** Client for community operations */
  readonly communities: CommunitiesClient;

  /** Client for trends operations */
  readonly trends: TrendsClient;

  /** Client for geo/places operations */
  readonly geo: GeoClient;

  /**
   * Create a new Twitter client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.tweets = new TweetsClient(client);
    this.users = new UsersClient(client);
    this.lists = new ListsClient(client);
    this.communities = new CommunitiesClient(client);
    this.trends = new TrendsClient(client);
    this.geo = new GeoClient(client);
  }
}
