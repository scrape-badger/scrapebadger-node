/**
 * Vinted Users API client.
 *
 * Provides methods for fetching Vinted user profiles and their item listings.
 */

import type { BaseClient } from "../internal/client.js";
import type { UserProfileResponse, UserItemsResponse } from "./types.js";

/**
 * Client for Vinted user endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get user profile
 * const profile = await client.vinted.users.getProfile(12345);
 * console.log(`${profile.user.login} — ${profile.user.item_count} items`);
 *
 * // Get user's items
 * const items = await client.vinted.users.getItems(12345);
 * for (const item of items.items) {
 *   console.log(`${item.title} — ${item.price.amount} ${item.price.currency_code}`);
 * }
 * ```
 */
export class UsersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a user's profile.
   *
   * @param userId - The Vinted user ID.
   * @param options - Optional parameters.
   * @param options.market - Market code (default: "fr").
   * @returns The user profile response.
   * @throws NotFoundError - If the user doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.users.getProfile(12345);
   * const { user } = response;
   * console.log(`${user.login} from ${user.city}, ${user.country_code}`);
   * console.log(`Reputation: ${user.feedback_reputation}`);
   * console.log(`Items: ${user.item_count}, Followers: ${user.followers_count}`);
   * ```
   */
  async getProfile(
    userId: number,
    options: { market?: string } = {}
  ): Promise<UserProfileResponse> {
    return this.client.request<UserProfileResponse>(
      `/v1/vinted/users/${userId}`,
      { params: { market: options.market } }
    );
  }

  /**
   * Get items listed by a user.
   *
   * @param userId - The Vinted user ID.
   * @param options - Optional parameters for pagination and market.
   * @param options.market - Market code (default: "fr").
   * @param options.page - Page number.
   * @param options.per_page - Items per page.
   * @returns The user's items with pagination metadata.
   * @throws NotFoundError - If the user doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.users.getItems(12345, {
   *   market: "de",
   *   page: 1,
   *   per_page: 20,
   * });
   * console.log(`Page ${response.pagination.current_page} of ${response.pagination.total_pages}`);
   * for (const item of response.items) {
   *   console.log(`${item.title} — ${item.price.amount} ${item.price.currency_code}`);
   * }
   * ```
   */
  async getItems(
    userId: number,
    options: { market?: string; page?: number; per_page?: number } = {}
  ): Promise<UserItemsResponse> {
    return this.client.request<UserItemsResponse>(
      `/v1/vinted/users/${userId}/items`,
      {
        params: {
          market: options.market,
          page: options.page,
          per_page: options.per_page,
        },
      }
    );
  }
}
