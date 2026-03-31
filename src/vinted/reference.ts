/**
 * Vinted Reference Data API client.
 *
 * Provides methods for fetching brands, colors, statuses, and markets.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  BrandsResponse,
  ColorsResponse,
  StatusesResponse,
  MarketsResponse,
} from "./types.js";

/**
 * Client for Vinted reference data endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get available markets
 * const markets = await client.vinted.reference.markets();
 * for (const market of markets.markets) {
 *   console.log(`${market.name} (${market.code}) — ${market.currency}`);
 * }
 *
 * // Search brands
 * const brands = await client.vinted.reference.brands({ keyword: "nike" });
 * for (const brand of brands.brands) {
 *   console.log(`${brand.title}: ${brand.item_count} items`);
 * }
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search for brands by keyword.
   *
   * @param options - Optional parameters.
   * @param options.keyword - Brand name to search for.
   * @param options.market - Market code (default: "fr").
   * @param options.per_page - Number of results per page.
   * @returns Brands matching the keyword.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.reference.brands({
   *   keyword: "adidas",
   *   market: "de",
   *   per_page: 10,
   * });
   * for (const brand of response.brands) {
   *   console.log(`${brand.title} (${brand.slug}): ${brand.item_count} items`);
   * }
   * ```
   */
  async brands(
    options: { keyword?: string; market?: string; per_page?: number } = {}
  ): Promise<BrandsResponse> {
    return this.client.request<BrandsResponse>("/v1/vinted/brands", {
      params: {
        keyword: options.keyword,
        market: options.market,
        per_page: options.per_page,
      },
    });
  }

  /**
   * Get available colors for a market.
   *
   * @param options - Optional parameters.
   * @param options.market - Market code (default: "fr").
   * @returns List of available colors.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.reference.colors({ market: "fr" });
   * for (const color of response.colors) {
   *   console.log(`${color.title} (#${color.hex})`);
   * }
   * ```
   */
  async colors(
    options: { market?: string } = {}
  ): Promise<ColorsResponse> {
    return this.client.request<ColorsResponse>("/v1/vinted/colors", {
      params: { market: options.market },
    });
  }

  /**
   * Get available item condition statuses for a market.
   *
   * @param options - Optional parameters.
   * @param options.market - Market code (default: "fr").
   * @returns List of item condition statuses.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.reference.statuses({ market: "fr" });
   * for (const status of response.statuses) {
   *   console.log(`${status.id}: ${status.title}`);
   * }
   * ```
   */
  async statuses(
    options: { market?: string } = {}
  ): Promise<StatusesResponse> {
    return this.client.request<StatusesResponse>("/v1/vinted/statuses", {
      params: { market: options.market },
    });
  }

  /**
   * Get all available Vinted markets.
   *
   * @returns List of all supported Vinted markets/countries.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.reference.markets();
   * for (const market of response.markets) {
   *   console.log(`${market.name}: ${market.domain} (${market.currency})`);
   * }
   * ```
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/vinted/markets");
  }
}
