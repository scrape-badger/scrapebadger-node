/**
 * Instagram Users API client.
 *
 * Fetches user profiles and their content: posts, videos, reels, tagged/pinned
 * media, followers, following, stories, and highlights.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  Highlight,
  Media,
  Paginated,
  User,
  UserAbout,
  UserShort,
} from "./types.js";

/**
 * Client for Instagram user endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.instagram.users.get("instagram");
 * console.log(`@${profile.username}: ${profile.follower_count.toLocaleString()} followers`);
 *
 * const posts = await client.instagram.users.posts("instagram", { amount: 12 });
 * for (const media of posts.items) {
 *   console.log(media.code, media.like_count);
 * }
 * ```
 */
export class UsersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /** Get a user's full profile. */
  async get(username: string): Promise<User> {
    return this.client.request<User>(`/v1/instagram/users/${username}`);
  }

  /** Get "About this account" metadata for a user. */
  async about(username: string): Promise<UserAbout> {
    return this.client.request<UserAbout>(
      `/v1/instagram/users/${username}/about`
    );
  }

  /** Get accounts related/suggested for a user. */
  async related(username: string): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      `/v1/instagram/users/${username}/related`
    );
  }

  /** Get a user's timeline posts. */
  async posts(
    username: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return this.media(`/v1/instagram/users/${username}/posts`, options);
  }

  /** Get a user's video posts (IGTV/feed videos). */
  async videos(
    username: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return this.media(`/v1/instagram/users/${username}/videos`, options);
  }

  /** Get a user's reels. */
  async reels(
    username: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return this.media(`/v1/instagram/users/${username}/reels`, options);
  }

  /** Get media a user is tagged in. */
  async tagged(
    username: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return this.media(`/v1/instagram/users/${username}/tagged`, options);
  }

  /** Get a user's pinned posts. */
  async pinned(username: string): Promise<Paginated<Media>> {
    return this.client.request<Paginated<Media>>(
      `/v1/instagram/users/${username}/pinned`
    );
  }

  /**
   * Get a user's followers.
   *
   * @param username - Instagram username.
   * @param options.amount - Number of followers to return.
   * @param options.cursor - Pagination cursor from a previous response.
   * @param options.order - Ordering hint (e.g. "default", "date_followed_earliest").
   */
  async followers(
    username: string,
    options: { amount?: number; cursor?: string; order?: string } = {}
  ): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      `/v1/instagram/users/${username}/followers`,
      {
        params: {
          amount: options.amount,
          cursor: options.cursor,
          order: options.order,
        },
      }
    );
  }

  /** Get the accounts a user follows. */
  async following(
    username: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      `/v1/instagram/users/${username}/following`,
      { params: { amount: options.amount, cursor: options.cursor } }
    );
  }

  /** Search within a user's followers by name/username. */
  async searchFollowers(
    username: string,
    query: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<UserShort>> {
    return this.client.request<Paginated<UserShort>>(
      `/v1/instagram/users/${username}/followers/search`,
      {
        params: { query, amount: options.amount, cursor: options.cursor },
      }
    );
  }

  /** Get a user's currently-live stories. */
  async stories(username: string): Promise<Paginated<Media>> {
    return this.client.request<Paginated<Media>>(
      `/v1/instagram/users/${username}/stories`
    );
  }

  /** Get a user's story highlights. */
  async highlights(username: string): Promise<Paginated<Highlight>> {
    return this.client.request<Paginated<Highlight>>(
      `/v1/instagram/users/${username}/highlights`
    );
  }

  private async media(
    path: string,
    options: { amount?: number; cursor?: string }
  ): Promise<Paginated<Media>> {
    return this.client.request<Paginated<Media>>(path, {
      params: { amount: options.amount, cursor: options.cursor },
    });
  }
}
