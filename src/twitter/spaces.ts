/**
 * Twitter Spaces API client.
 *
 * Provides methods for fetching Twitter Spaces and live broadcasts.
 */

import type { BaseClient } from "../internal/client.js";
import type { Space, Broadcast } from "./types.js";

/**
 * Client for Twitter Spaces endpoints.
 *
 * Provides async methods for fetching Space details and live broadcast data.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get Space details
 * const space = await client.twitter.spaces.getDetail("1eaKbrPPbPwKX");
 * console.log(`${space.title} — state: ${space.state}`);
 *
 * // Get broadcast details
 * const broadcast = await client.twitter.spaces.getBroadcast("broadcast123");
 * console.log(`${broadcast.title}: ${broadcast.total_viewers} viewers`);
 * ```
 */
export class SpacesClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get details for a specific Twitter Space.
   *
   * @param spaceId - The Space ID to fetch.
   * @returns The Space data.
   * @throws NotFoundError - If the Space doesn't exist.
   *
   * @example
   * ```typescript
   * const space = await client.twitter.spaces.getDetail("1eaKbrPPbPwKX");
   * console.log(`${space.title} — ${space.participant_count} participants`);
   * ```
   */
  async getDetail(spaceId: string): Promise<Space> {
    return this.client.request<Space>(`/v1/twitter/spaces/${spaceId}`);
  }

  /**
   * Get details for a live video broadcast.
   *
   * @param broadcastId - The broadcast ID to fetch.
   * @returns The broadcast data.
   * @throws NotFoundError - If the broadcast doesn't exist.
   *
   * @example
   * ```typescript
   * const broadcast = await client.twitter.spaces.getBroadcast("broadcast123");
   * console.log(`${broadcast.title}: ${broadcast.total_viewers} viewers`);
   * ```
   */
  async getBroadcast(broadcastId: string): Promise<Broadcast> {
    return this.client.request<Broadcast>(`/v1/twitter/spaces/broadcast/${broadcastId}`);
  }
}
