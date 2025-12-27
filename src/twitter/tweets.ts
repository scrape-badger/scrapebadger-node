/**
 * Twitter Tweets API client.
 *
 * Provides methods for fetching tweets, searching, and getting tweet metadata.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  PaginatedResponse,
  PaginationOptions,
  IteratorOptions,
} from "../internal/pagination.js";
import { createPaginatedResponse, paginate } from "../internal/pagination.js";
import type { Tweet, User, QueryType } from "./types.js";

/**
 * Client for Twitter tweets endpoints.
 *
 * Provides async methods for fetching individual tweets, searching tweets,
 * and getting tweet engagement data (retweeters, favoriters, replies).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get single tweet
 * const tweet = await client.twitter.tweets.getById("1234567890");
 *
 * // Search tweets
 * const results = await client.twitter.tweets.search("python programming");
 * for (const tweet of results.data) {
 *   console.log(tweet.text);
 * }
 *
 * // Iterate through all results
 * for await (const tweet of client.twitter.tweets.searchAll("python")) {
 *   console.log(tweet.text);
 * }
 * ```
 */
export class TweetsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single tweet by ID.
   *
   * @param tweetId - The tweet ID to fetch.
   * @returns The tweet data.
   * @throws NotFoundError - If the tweet doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const tweet = await client.twitter.tweets.getById("1234567890");
   * console.log(`@${tweet.username}: ${tweet.text}`);
   * ```
   */
  async getById(tweetId: string): Promise<Tweet> {
    return this.client.request<Tweet>(`/v1/twitter/tweets/tweet/${tweetId}`);
  }

  /**
   * Get multiple tweets by their IDs.
   *
   * @param tweetIds - List of tweet IDs to fetch.
   * @returns Paginated response containing the tweets.
   *
   * @example
   * ```typescript
   * const tweets = await client.twitter.tweets.getByIds([
   *   "1234567890",
   *   "0987654321"
   * ]);
   * for (const tweet of tweets.data) {
   *   console.log(tweet.text);
   * }
   * ```
   */
  async getByIds(tweetIds: string[]): Promise<PaginatedResponse<Tweet>> {
    const tweetsParam = tweetIds.join(",");
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      "/v1/twitter/tweets/",
      { params: { tweets: tweetsParam } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get replies to a tweet.
   *
   * @param tweetId - The tweet ID to get replies for.
   * @param options - Pagination options.
   * @returns Paginated response containing reply tweets.
   *
   * @example
   * ```typescript
   * const replies = await client.twitter.tweets.getReplies("1234567890");
   * for (const reply of replies.data) {
   *   console.log(`@${reply.username}: ${reply.text}`);
   * }
   *
   * // Get next page
   * if (replies.hasMore) {
   *   const more = await client.twitter.tweets.getReplies("1234567890", {
   *     cursor: replies.nextCursor
   *   });
   * }
   * ```
   */
  async getReplies(
    tweetId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/tweets/tweet/${tweetId}/replies`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get users who retweeted a tweet.
   *
   * @param tweetId - The tweet ID to get retweeters for.
   * @param options - Pagination options.
   * @returns Paginated response containing users who retweeted.
   *
   * @example
   * ```typescript
   * const retweeters = await client.twitter.tweets.getRetweeters("1234567890");
   * for (const user of retweeters.data) {
   *   console.log(`@${user.username} retweeted`);
   * }
   * ```
   */
  async getRetweeters(
    tweetId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/tweets/tweet/${tweetId}/retweeters`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get users who liked/favorited a tweet.
   *
   * @param tweetId - The tweet ID to get favoriters for.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing users who liked.
   *
   * @example
   * ```typescript
   * const likers = await client.twitter.tweets.getFavoriters("1234567890");
   * console.log(`${likers.data.length} users liked this tweet`);
   * ```
   */
  async getFavoriters(
    tweetId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/tweets/tweet/${tweetId}/favoriters`,
      { params: { count: options.count ?? 40, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get tweets similar to a given tweet.
   *
   * @param tweetId - The tweet ID to find similar tweets for.
   * @returns Paginated response containing similar tweets.
   *
   * @example
   * ```typescript
   * const similar = await client.twitter.tweets.getSimilar("1234567890");
   * for (const tweet of similar.data) {
   *   console.log(`Similar: ${tweet.text.slice(0, 100)}...`);
   * }
   * ```
   */
  async getSimilar(tweetId: string): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/tweets/tweet/${tweetId}/similar`
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Search for tweets.
   *
   * @param query - Search query string. Supports Twitter advanced search operators.
   * @param options - Search options including query type and pagination.
   * @returns Paginated response containing matching tweets.
   *
   * @example
   * ```typescript
   * // Basic search
   * const results = await client.twitter.tweets.search("python programming");
   *
   * // Latest tweets only
   * const latest = await client.twitter.tweets.search("python", {
   *   queryType: "Latest"
   * });
   *
   * // Advanced search operators
   * const fromUser = await client.twitter.tweets.search("from:elonmusk lang:en");
   * ```
   */
  async search(
    query: string,
    options: PaginationOptions & { queryType?: QueryType } = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      "/v1/twitter/tweets/advanced_search",
      {
        params: {
          query,
          query_type: options.queryType ?? "Top",
          cursor: options.cursor,
        },
      }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all search results with automatic pagination.
   *
   * This is a convenience method that automatically handles pagination,
   * yielding tweets one at a time.
   *
   * @param query - Search query string.
   * @param options - Search and iteration options.
   * @yields Tweet objects matching the search query.
   *
   * @example
   * ```typescript
   * // Get up to 1000 tweets
   * for await (const tweet of client.twitter.tweets.searchAll("python", {
   *   maxItems: 1000
   * })) {
   *   console.log(tweet.text);
   * }
   *
   * // Collect into an array
   * import { collectAll } from "scrapebadger";
   * const tweets = await collectAll(
   *   client.twitter.tweets.searchAll("python", { maxItems: 100 })
   * );
   * ```
   */
  async *searchAll(
    query: string,
    options: IteratorOptions & { queryType?: QueryType } = {}
  ): AsyncGenerator<Tweet, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.search(query, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }

  /**
   * Get tweets from a user's timeline.
   *
   * @param username - Twitter username (without @).
   * @param options - Pagination options.
   * @returns Paginated response containing the user's tweets.
   *
   * @example
   * ```typescript
   * const tweets = await client.twitter.tweets.getUserTweets("elonmusk");
   * for (const tweet of tweets.data) {
   *   console.log(`${tweet.created_at}: ${tweet.text.slice(0, 100)}...`);
   * }
   * ```
   */
  async getUserTweets(
    username: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/users/${username}/latest_tweets`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all tweets from a user with automatic pagination.
   *
   * @param username - Twitter username (without @).
   * @param options - Iteration options.
   * @yields Tweet objects from the user's timeline.
   *
   * @example
   * ```typescript
   * for await (const tweet of client.twitter.tweets.getUserTweetsAll("elonmusk", {
   *   maxItems: 500
   * })) {
   *   console.log(tweet.text);
   * }
   * ```
   */
  async *getUserTweetsAll(
    username: string,
    options: IteratorOptions = {}
  ): AsyncGenerator<Tweet, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.getUserTweets(username, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }
}
