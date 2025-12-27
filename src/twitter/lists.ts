/**
 * Twitter Lists API client.
 *
 * Provides methods for fetching Twitter lists, list members, and list tweets.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  PaginatedResponse,
  PaginationOptions,
  IteratorOptions,
} from "../internal/pagination.js";
import { createPaginatedResponse, paginate } from "../internal/pagination.js";
import type { List, Tweet, User } from "./types.js";

/**
 * Client for Twitter lists endpoints.
 *
 * Provides async methods for fetching list details, members, subscribers,
 * and tweets from lists.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search for lists
 * const lists = await client.twitter.lists.search("tech leaders");
 *
 * // Get list details
 * const list = await client.twitter.lists.getDetail("123456");
 * console.log(`${list.name}: ${list.member_count} members`);
 *
 * // Get list tweets
 * const tweets = await client.twitter.lists.getTweets("123456");
 * ```
 */
export class ListsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get details for a specific list.
   *
   * @param listId - The list ID.
   * @returns The list details.
   * @throws NotFoundError - If the list doesn't exist.
   *
   * @example
   * ```typescript
   * const list = await client.twitter.lists.getDetail("123456");
   * console.log(`${list.name} by @${list.username}`);
   * console.log(`${list.member_count} members, ${list.subscriber_count} subscribers`);
   * ```
   */
  async getDetail(listId: string): Promise<List> {
    return this.client.request<List>(`/v1/twitter/lists/${listId}/detail`);
  }

  /**
   * Get tweets from a list's timeline.
   *
   * @param listId - The list ID.
   * @param options - Pagination options.
   * @returns Paginated response containing tweets from list members.
   *
   * @example
   * ```typescript
   * const tweets = await client.twitter.lists.getTweets("123456");
   * for (const tweet of tweets.data) {
   *   console.log(`@${tweet.username}: ${tweet.text.slice(0, 100)}...`);
   * }
   * ```
   */
  async getTweets(
    listId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/lists/${listId}/tweets`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all list tweets with automatic pagination.
   *
   * @param listId - The list ID.
   * @param options - Iteration options.
   * @yields Tweet objects from the list timeline.
   */
  async *getTweetsAll(
    listId: string,
    options: IteratorOptions = {}
  ): AsyncGenerator<Tweet, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.getTweets(listId, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }

  /**
   * Get members of a list.
   *
   * @param listId - The list ID.
   * @param options - Pagination options.
   * @returns Paginated response containing list members.
   *
   * @example
   * ```typescript
   * const members = await client.twitter.lists.getMembers("123456");
   * for (const user of members.data) {
   *   console.log(`@${user.username}`);
   * }
   * ```
   */
  async getMembers(
    listId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/lists/${listId}/members`,
      { params: { cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all list members with automatic pagination.
   *
   * @param listId - The list ID.
   * @param options - Iteration options.
   * @yields User objects for each list member.
   */
  async *getMembersAll(
    listId: string,
    options: IteratorOptions = {}
  ): AsyncGenerator<User, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.getMembers(listId, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }

  /**
   * Get subscribers of a list.
   *
   * @param listId - The list ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing list subscribers.
   */
  async getSubscribers(
    listId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.request<{ data?: User[]; next_cursor?: string }>(
      `/v1/twitter/lists/${listId}/subscribers`,
      { params: { count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Search for lists.
   *
   * @param query - Search query string.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing matching lists.
   *
   * @example
   * ```typescript
   * const results = await client.twitter.lists.search("tech leaders");
   * for (const list of results.data) {
   *   console.log(`${list.name}: ${list.member_count} members`);
   * }
   * ```
   */
  async search(
    query: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<List>> {
    const response = await this.client.request<{ data?: List[]; next_cursor?: string }>(
      "/v1/twitter/lists/search",
      { params: { query, count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get lists owned by the authenticated user.
   *
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing the user's lists.
   */
  async getMyLists(
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<List>> {
    const response = await this.client.request<{ data?: List[]; next_cursor?: string }>(
      "/v1/twitter/lists/my_lists",
      { params: { count: options.count ?? 100, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }
}
