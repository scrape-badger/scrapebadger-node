/**
 * Twitter Communities API client.
 *
 * Provides methods for fetching Twitter communities, members, and tweets.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  PaginatedResponse,
  PaginationOptions,
  IteratorOptions,
} from "../internal/pagination.js";
import { createPaginatedResponse, paginate } from "../internal/pagination.js";
import type { Community, CommunityMember, CommunityTweetType, Tweet, User } from "./types.js";

/**
 * Client for Twitter communities endpoints.
 *
 * Provides async methods for fetching community details, members,
 * moderators, and tweets.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search communities
 * const communities = await client.twitter.communities.search("python");
 *
 * // Get community details
 * const community = await client.twitter.communities.getDetail("123456");
 * console.log(`${community.name}: ${community.member_count} members`);
 *
 * // Get community tweets
 * const tweets = await client.twitter.communities.getTweets("123456");
 * ```
 */
export class CommunitiesClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get details for a specific community.
   *
   * @param communityId - The community ID.
   * @returns The community details including rules and admin info.
   * @throws NotFoundError - If the community doesn't exist.
   *
   * @example
   * ```typescript
   * const community = await client.twitter.communities.getDetail("123456");
   * console.log(`${community.name}`);
   * console.log(`Members: ${community.member_count?.toLocaleString()}`);
   * console.log(`Join policy: ${community.join_policy}`);
   *
   * if (community.rules) {
   *   console.log("Rules:");
   *   for (const rule of community.rules) {
   *     console.log(`  - ${rule.name}`);
   *   }
   * }
   * ```
   */
  async getDetail(communityId: string): Promise<Community> {
    return this.client.request<Community>(`/v1/twitter/communities/${communityId}`);
  }

  /**
   * Get tweets from a community.
   *
   * @param communityId - The community ID.
   * @param options - Options including tweet type, count, and pagination.
   * @returns Paginated response containing community tweets.
   *
   * @example
   * ```typescript
   * // Get top tweets
   * const tweets = await client.twitter.communities.getTweets("123456");
   *
   * // Get latest tweets
   * const latest = await client.twitter.communities.getTweets("123456", {
   *   tweetType: "Latest"
   * });
   * ```
   */
  async getTweets(
    communityId: string,
    options: PaginationOptions & { tweetType?: CommunityTweetType; count?: number } = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/communities/${communityId}/tweets`,
      {
        params: {
          tweet_type: options.tweetType ?? "Top",
          count: options.count ?? 40,
          cursor: options.cursor,
        },
      }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Iterate through all community tweets with automatic pagination.
   *
   * @param communityId - The community ID.
   * @param options - Options including tweet type and iteration limits.
   * @yields Tweet objects from the community.
   */
  async *getTweetsAll(
    communityId: string,
    options: IteratorOptions & { tweetType?: CommunityTweetType } = {}
  ): AsyncGenerator<Tweet, void, undefined> {
    const fetchPage = async (cursor?: string) => {
      return this.getTweets(communityId, { ...options, cursor });
    };
    yield* paginate(fetchPage, options);
  }

  /**
   * Get members of a community.
   *
   * @param communityId - The community ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing community members.
   *
   * @example
   * ```typescript
   * const members = await client.twitter.communities.getMembers("123456");
   * for (const member of members.data) {
   *   console.log(`@${member.user.username} (${member.role})`);
   * }
   * ```
   */
  async getMembers(
    communityId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<CommunityMember>> {
    const response = await this.client.request<{
      data?: (CommunityMember | User)[];
      next_cursor?: string;
    }>(`/v1/twitter/communities/${communityId}/members`, {
      params: { count: options.count ?? 20, cursor: options.cursor },
    });

    // Handle both nested and direct user structures
    const data: CommunityMember[] = (response.data ?? []).map((item) => {
      if ("user" in item && item.user) {
        return item as CommunityMember;
      }
      // Wrap User in CommunityMember
      const userItem = item as User & { role?: string; joined_at?: string };
      return {
        user: item as User,
        role: userItem.role,
        joined_at: userItem.joined_at,
      };
    });

    return createPaginatedResponse(data, response.next_cursor);
  }

  /**
   * Get moderators of a community.
   *
   * @param communityId - The community ID.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing community moderators.
   */
  async getModerators(
    communityId: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<CommunityMember>> {
    const response = await this.client.request<{
      data?: (CommunityMember | User)[];
      next_cursor?: string;
    }>(`/v1/twitter/communities/${communityId}/moderators`, {
      params: { count: options.count ?? 20, cursor: options.cursor },
    });

    // Handle both nested and direct user structures
    const data: CommunityMember[] = (response.data ?? []).map((item) => {
      if ("user" in item && item.user) {
        return item as CommunityMember;
      }
      // Wrap User in CommunityMember
      const userItem = item as User & { joined_at?: string };
      return {
        user: item as User,
        role: "moderator",
        joined_at: userItem.joined_at,
      };
    });

    return createPaginatedResponse(data, response.next_cursor);
  }

  /**
   * Search for communities.
   *
   * @param query - Search query string.
   * @param options - Pagination options.
   * @returns Paginated response containing matching communities.
   *
   * @example
   * ```typescript
   * const results = await client.twitter.communities.search("python developers");
   * for (const community of results.data) {
   *   console.log(`${community.name}: ${community.member_count} members`);
   * }
   * ```
   */
  async search(
    query: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Community>> {
    const response = await this.client.request<{ data?: Community[]; next_cursor?: string }>(
      "/v1/twitter/communities/search",
      { params: { query, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Search for tweets within a community.
   *
   * @param communityId - The community ID.
   * @param query - Search query string.
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing matching tweets.
   */
  async searchTweets(
    communityId: string,
    query: string,
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      `/v1/twitter/communities/${communityId}/search_tweets`,
      { params: { query, count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }

  /**
   * Get the community timeline (tweets from communities you're in).
   *
   * @param options - Pagination options with optional count.
   * @returns Paginated response containing community timeline tweets.
   */
  async getTimeline(
    options: PaginationOptions & { count?: number } = {}
  ): Promise<PaginatedResponse<Tweet>> {
    const response = await this.client.request<{ data?: Tweet[]; next_cursor?: string }>(
      "/v1/twitter/communities/timeline",
      { params: { count: options.count ?? 20, cursor: options.cursor } }
    );
    return createPaginatedResponse(response.data ?? [], response.next_cursor);
  }
}
