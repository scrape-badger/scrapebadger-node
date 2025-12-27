/**
 * Twitter Users API client.
 *
 * Provides methods for fetching user profiles, followers, following, and related data.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  PaginatedResponse,
  PaginationOptions,
  IteratorOptions,
} from "../internal/pagination.js";
import { createPaginatedResponse, paginate } from "../internal/pagination.js";
import type { User, UserAbout, UserIds, Tweet } from "./types.js";

/**
 * Client for Twitter users endpoints.
 *
 * Provides async methods for fetching user profiles, followers, following,
 * and other user-related data.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get user profile
 * const user = await client.twitter.users.getByUsername("elonmusk");
 * console.log(`${user.name}: ${user.followers_count.toLocaleString()} followers`);
 *
 * // Get followers
 * const followers = await client.twitter.users.getFollowers("elonmusk");
 *
 * // Iterate through all followers
 * for await (const follower of client.twitter.users.getFollowersAll("elonmusk")) {
 *   console.log(follower.username);
 * }
 * ```
 */
export class UsersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a user by their numeric ID.
   *
   * @param userId - The user's numeric ID.
   * @returns The user profile.
   * @throws NotFoundError - If the user doesn't exist.
   *
   * @example
   * ```typescript
   * const user = await client.twitter.users.getById("44196397");
   * console.log(`@${user.username}`);
   * ```
   */
  async getById(userId: string): Promise<User> {
    return this.client.request<User>(`/v1/twitter/users/${userId}/by_id`);
  }

  /**
   * Get a user by their username.
   *
   * @param username - The user's username (without @).
   * @returns The user profile.
   * @throws NotFoundError - If the user doesn't exist.
   *
   * @example
   * ```typescript
   * const user = await client.twitter.users.getByUsername("elonmusk");
   * console.log(`${user.name} has ${user.followers_count.toLocaleString()} followers`);
   * ```
   */
  async getByUsername(username: string): Promise<User> {
    return this.client.request<User>(`/v1/twitter/users/${username}/by_username`);
  }

  /**
   * Get extended "About" information for a user.
   *
   * Returns additional metadata including account location,
   * username change history, and verification details.
   *
   * @param username - The user's username (without @).
   * @returns Extended user information.
   *
   * @example
   * ```typescript
   * const about = await client.twitter.users.getAbout("elonmusk");
   * console.log(`Account based in: ${about.account_based_in}`);
   * console.log(`Username changes: ${about.username_changes}`);
   * ```
   */
  async getAbout(username: string): Promise<UserAbout> {
    return this.client.request<UserAbout>(`/v1/twitter/users/${username}/about`);
  }

  /**
   * Get a user's followers.
   *
   * @param username - The user's username (without @).
   * @param options - Pagination options.
   * @returns Paginated response containing follower users.
   *
   * @example
   * ```typescript
   * const followers = await client.twitter.users.getFollowers("elonmusk");
   * for (const user of followers.data) {
   *   console.log(`@${user.username}`);
   * }
   *
   * // Get next page
   * if (followers.hasMore) {
   *   const more = await client.twitter.users.getFollowers("elonmusk", {
   *     cursor: followers.nextCursor
   *   });
   * }
   * ```
   */
  async getFollowers(
    username: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${username}/followers`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all followers with automatic pagination.
   *
   * @param username - The user's username (without @).
   * @param options - Iteration options.
   * @yields User objects for each follower.
   *
   * @example
   * ```typescript
   * for await (const follower of client.twitter.users.getFollowersAll("elonmusk", {
   *   maxItems: 1000
   * })) {
   *   console.log(follower.username);
   * }
   * ```
   */
  async *getFollowersAll(
    username: string,
    options: IteratorOptions = {}
  ): AsyncGenerator<User, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.getFollowers(username, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }

  /**
   * Get users that a user is following.
   *
   * @param username - The user's username (without @).
   * @param options - Pagination options.
   * @returns Paginated response containing followed users.
   *
   * @example
   * ```typescript
   * const following = await client.twitter.users.getFollowing("elonmusk");
   * for (const user of following.data) {
   *   console.log(`Follows @${user.username}`);
   * }
   * ```
   */
  async getFollowing(
    username: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${username}/followings`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all following with automatic pagination.
   *
   * @param username - The user's username (without @).
   * @param options - Iteration options.
   * @yields User objects for each followed account.
   */
  async *getFollowingAll(
    username: string,
    options: IteratorOptions = {}
  ): AsyncGenerator<User, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.getFollowing(username, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }

  /**
   * Get a user's most recent followers.
   *
   * @param username - The user's username (without @).
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing recent followers.
   */
  async getLatestFollowers(
    username: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${username}/latest_followers`,
      { params: { count: options.count ?? 200, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get accounts a user most recently followed.
   *
   * @param username - The user's username (without @).
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing recently followed users.
   */
  async getLatestFollowing(
    username: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${username}/latest_following`,
      { params: { count: options.count ?? 200, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get follower IDs for a user.
   *
   * More efficient than getFollowers when you only need IDs.
   *
   * @param username - The user's username (without @).
   * @param options - Pagination options with optional count.
   * @returns UserIds containing list of follower IDs.
   *
   * @example
   * ```typescript
   * const ids = await client.twitter.users.getFollowerIds("elonmusk");
   * console.log(`Found ${ids.ids.length.toLocaleString()} follower IDs`);
   * ```
   */
  async getFollowerIds(
    username: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<UserIds> {
    const response = await this.client.request<{ data?: { ids?: number[]; next_cursor?: string } }>(
      `/v1/twitter/users/${username}/follower_ids`,
      { params: { count: options.count ?? 5000, cursor: options.cursor } }
    );
    return {
      ids: response.data?.ids ?? [],
      next_cursor: response.data?.next_cursor,
    };
  }

  /**
   * Get following IDs for a user.
   *
   * More efficient than getFollowing when you only need IDs.
   *
   * @param username - The user's username (without @).
   * @param options - Pagination options with optional count.
   * @returns UserIds containing list of following IDs.
   */
  async getFollowingIds(
    username: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<UserIds> {
    const response = await this.client.request<{ data?: { ids?: number[]; next_cursor?: string } }>(
      `/v1/twitter/users/${username}/following_ids`,
      { params: { count: options.count ?? 5000, cursor: options.cursor } }
    );
    return {
      ids: response.data?.ids ?? [],
      next_cursor: response.data?.next_cursor,
    };
  }

  /**
   * Get verified followers for a user.
   *
   * @param userId - The user's numeric ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing verified followers.
   */
  async getVerifiedFollowers(
    userId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${userId}/verified_followers`,
      { params: { count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get followers that the authenticated user also follows.
   *
   * @param userId - The user's numeric ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing mutual connections.
   */
  async getFollowersYouKnow(
    userId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${userId}/followers_you_know`,
      { params: { count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get premium accounts that a user subscribes to.
   *
   * @param userId - The user's numeric ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing subscribed accounts.
   */
  async getSubscriptions(
    userId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/users/${userId}/subscriptions`,
      { params: { count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get a user's highlighted tweets.
   *
   * @param userId - The user's numeric ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing highlighted tweets.
   */
  async getHighlights(
    userId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/users/${userId}/highlights`,
      { params: { count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Search for users.
   *
   * @param query - Search query string.
   * @param options - Pagination options.
   * @returns Paginated response containing matching users.
   *
   * @example
   * ```typescript
   * const results = await client.twitter.users.search("python developer");
   * for (const user of results.data) {
   *   console.log(`@${user.username}: ${user.description}`);
   * }
   * ```
   */
  async search(
    query: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      "/v1/twitter/users/search_users",
      { params: { query, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all search results with automatic pagination.
   *
   * @param query - Search query string.
   * @param options - Iteration options.
   * @yields User objects matching the search query.
   */
  async *searchAll(
    query: string,
    options: IteratorOptions = {}
  ): AsyncGenerator<User, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.search(query, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }
}
