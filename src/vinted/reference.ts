/**
 * Vinted Reference Data API client.
 *
 * Provides methods for fetching brands, colors, statuses, and markets.
 */

import type { BaseClient } from "../internal/client.js";
import type { BrandsResponse, ColorsResponse, StatusesResponse, MarketsResponse } from "./types.js";

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
   * @param options - Search parameters.
   * @param options.keyword - Brand name to search for. Required — the API
   * answers 422 without it, so this was never optional.
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
  async brands(options: {
    keyword: string;
    market?: string;
    per_page?: number;
  }): Promise<BrandsResponse> {
    return this.client.request<BrandsResponse>("/v1/vinted/brands", {
      params: {
        keyword: options.keyword,
        market: options.market,
        per_page: options.per_page,
      },
    });
  }

  /**
   * Get Vinted's A-Z directory of popular brands.
   *
   * Returns about 240 of the most popular brands whose name starts with
   * `letter`, with ID, slug and item count. Loop `letter` over A-Z and "0"
   * (digits) for a reference list of roughly 6,000 brand IDs. `brands()`
   * stops at 10 matches per keyword. 1 credit per call.
   *
   * @param options - Optional parameters.
   * @param options.letter - First letter of the brand name, "A"-"Z", or "0"
   * for digits. Omit for the most popular brands overall.
   * @param options.market - Market code (default: "fr").
   * @returns Brands for that letter (no pagination; one page per letter).
   *
   * @example
   * ```typescript
   * const ids = new Map<string, number>();
   * for (const letter of [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0"]) {
   *   const { brands } = await client.vinted.reference.popularBrands({ letter, market: "uk" });
   *   for (const brand of brands) ids.set(brand.title, brand.id);
   * }
   * ```
   */
  async popularBrands(options: { letter?: string; market?: string } = {}): Promise<BrandsResponse> {
    const response = await this.client.request<{ data: BrandsResponse }>(
      "/v1/vinted/mobile/popular-brands",
      {
        method: "POST",
        body: {
          market: options.market ?? "fr",
          parameters: options.letter ? { letter: options.letter } : {},
        },
      }
    );
    return { brands: response.data?.brands ?? [], pagination: null };
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
  async colors(options: { market?: string } = {}): Promise<ColorsResponse> {
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
  async statuses(options: { market?: string } = {}): Promise<StatusesResponse> {
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
