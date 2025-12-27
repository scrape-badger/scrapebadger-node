/**
 * Twitter Trends API client.
 *
 * Provides methods for fetching trending topics and trend locations.
 */

import type { BaseClient } from "../internal/client.js";
import type { PaginatedResponse } from "../internal/pagination.js";
import { createPaginatedResponse } from "../internal/pagination.js";
import type { Trend, TrendCategory, Location, PlaceTrends } from "./types.js";

/**
 * Client for Twitter trends endpoints.
 *
 * Provides async methods for fetching trending topics, place-specific trends,
 * and available trend locations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get global trends
 * const trends = await client.twitter.trends.getTrends();
 * for (const trend of trends.data) {
 *   console.log(`${trend.name}: ${trend.tweet_count || 'N/A'} tweets`);
 * }
 *
 * // Get trends for a specific location
 * const usTrends = await client.twitter.trends.getPlaceTrends(23424977);
 *
 * // Get available locations
 * const locations = await client.twitter.trends.getAvailableLocations();
 * ```
 */
export class TrendsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get trending topics.
   *
   * @param options - Options for filtering trends.
   * @returns Paginated response containing trending topics.
   *
   * @example
   * ```typescript
   * // Get general trending topics
   * const trends = await client.twitter.trends.getTrends();
   *
   * // Get news trends
   * const newsTrends = await client.twitter.trends.getTrends({
   *   category: "news"
   * });
   *
   * for (const trend of trends.data) {
   *   const count = trend.tweet_count?.toLocaleString() || "N/A";
   *   console.log(`${trend.name}: ${count} tweets`);
   * }
   * ```
   */
  async getTrends(
    options: { category?: TrendCategory; count?: number } = {}
  ): Promise<PaginatedResponse<Trend>> {
    const response = await this.client.request<{ data?: Trend[] }>("/v1/twitter/trends/", {
      params: {
        category: options.category ?? "trending",
        count: options.count ?? 20,
      },
    });
    return createPaginatedResponse(response.data ?? []);
  }

  /**
   * Get trends for a specific location.
   *
   * @param woeid - Where On Earth ID for the location.
   *   Common WOEIDs:
   *   - 1: Worldwide
   *   - 23424977: United States
   *   - 23424975: United Kingdom
   *   - 23424856: Japan
   *   - 23424829: Germany
   * @returns PlaceTrends containing location info and trends.
   * @throws NotFoundError - If the WOEID is invalid.
   *
   * @example
   * ```typescript
   * // Get US trends
   * const usTrends = await client.twitter.trends.getPlaceTrends(23424977);
   * console.log(`Trends in ${usTrends.name}:`);
   * for (const trend of usTrends.trends) {
   *   console.log(`  - ${trend.name}`);
   * }
   *
   * // Get worldwide trends
   * const globalTrends = await client.twitter.trends.getPlaceTrends(1);
   * ```
   */
  async getPlaceTrends(woeid: number): Promise<PlaceTrends> {
    return this.client.request<PlaceTrends>(`/v1/twitter/trends/place/${woeid}`);
  }

  /**
   * Get all locations where trends are available.
   *
   * @returns Paginated response containing available trend locations.
   *
   * @example
   * ```typescript
   * const locations = await client.twitter.trends.getAvailableLocations();
   *
   * // Filter by country
   * const usLocations = locations.data.filter(
   *   loc => loc.country_code === "US"
   * );
   * console.log(`Found ${usLocations.length} US locations`);
   *
   * // Get countries only
   * const countries = locations.data.filter(
   *   loc => loc.place_type === "Country"
   * );
   * ```
   */
  async getAvailableLocations(): Promise<PaginatedResponse<Location>> {
    const response = await this.client.request<{ data?: Location[] }>(
      "/v1/twitter/trends/locations"
    );
    return createPaginatedResponse(response.data ?? []);
  }
}
