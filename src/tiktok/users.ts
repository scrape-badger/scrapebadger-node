/**
 * TikTok Users API client.
 *
 * Provides methods for user profiles and their cursor-paginated lists
 * (videos, followers, following, liked, reposts).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  TikTokUserParams,
  TikTokUserListParams,
  ProfileResponse,
  VideoListResponse,
  UserListResponse,
} from "./types.js";

/**
 * Client for TikTok user endpoints (profile, videos, followers, following, liked, reposts).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.tiktok.users.get("charlidamelio");
 * console.log(profile.user.stats.follower_count);
 *
 * const videos = await client.tiktok.users.videos("charlidamelio", { count: 30 });
 * ```
 */
export class UsersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a TikTok user's full profile.
   *
   * @param username - The user's @handle (without the leading '@').
   * @param options - Optional parameters (region).
   * @returns The user profile response.
   * @throws NotFoundError - If the user doesn't exist.
   */
  async get(username: string, options: TikTokUserParams = {}): Promise<ProfileResponse> {
    return this.client.request<ProfileResponse>(`/v1/tiktok/users/${username}`, {
      params: { region: options.region },
    });
  }

  /**
   * Get a TikTok user's posted videos.
   *
   * @param username - The user's @handle.
   * @param options - Optional parameters (region, count, cursor).
   * @returns A cursor-paginated list of videos.
   */
  async videos(username: string, options: TikTokUserListParams = {}): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>(`/v1/tiktok/users/${username}/videos`, {
      params: { region: options.region, count: options.count, cursor: options.cursor },
    });
  }

  /**
   * Get a TikTok user's followers (best-effort; often guest-gated).
   *
   * @deprecated Requires an authenticated session; currently returns 410.
   * Kept for forward-compatibility — the endpoint may be re-enabled when
   * session-based access is supported.
   *
   * @param username - The user's @handle.
   * @param options - Optional parameters (region, count, cursor).
   * @returns A cursor-paginated list of follower authors.
   */
  async followers(
    username: string,
    options: TikTokUserListParams = {}
  ): Promise<UserListResponse> {
    return this.client.request<UserListResponse>(`/v1/tiktok/users/${username}/followers`, {
      params: { region: options.region, count: options.count, cursor: options.cursor },
    });
  }

  /**
   * Get accounts a TikTok user follows (best-effort).
   *
   * @deprecated Requires an authenticated session; currently returns 410.
   * Kept for forward-compatibility — the endpoint may be re-enabled when
   * session-based access is supported.
   *
   * @param username - The user's @handle.
   * @param options - Optional parameters (region, count, cursor).
   * @returns A cursor-paginated list of followed authors.
   */
  async following(
    username: string,
    options: TikTokUserListParams = {}
  ): Promise<UserListResponse> {
    return this.client.request<UserListResponse>(`/v1/tiktok/users/${username}/following`, {
      params: { region: options.region, count: options.count, cursor: options.cursor },
    });
  }

  /**
   * Get a TikTok user's liked videos (only if their Liked tab is public).
   *
   * @deprecated Requires an authenticated session; currently returns 410.
   * Kept for forward-compatibility — the endpoint may be re-enabled when
   * session-based access is supported.
   *
   * @param username - The user's @handle.
   * @param options - Optional parameters (region, count).
   * @returns A cursor-paginated list of videos.
   */
  async liked(username: string, options: TikTokUserListParams = {}): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>(`/v1/tiktok/users/${username}/liked`, {
      params: { region: options.region, count: options.count },
    });
  }

  /**
   * Get videos a TikTok user has reposted.
   *
   * @param username - The user's @handle.
   * @param options - Optional parameters (region, count).
   * @returns A cursor-paginated list of videos.
   */
  async reposts(username: string, options: TikTokUserListParams = {}): Promise<VideoListResponse> {
    return this.client.request<VideoListResponse>(`/v1/tiktok/users/${username}/reposts`, {
      params: { region: options.region, count: options.count },
    });
  }
}
