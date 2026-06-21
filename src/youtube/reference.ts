/**
 * YouTube Reference Data API client.
 *
 * Provides methods for the static categories, languages, regions, and the
 * geo-targeted scraper market list (all zero-credit).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YoutubeCategoriesParams,
  CategoriesResponse,
  LanguagesResponse,
  RegionsResponse,
  MarketsResponse,
} from "./types.js";

/**
 * Client for YouTube reference data endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const categories = await client.youtube.reference.categories({ gl: "US" });
 * const languages = await client.youtube.reference.languages();
 * const regions = await client.youtube.reference.regions();
 * const markets = await client.youtube.reference.markets();
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * List YouTube video categories (Data-API parity).
   *
   * @param options - Optional content region (default: "US").
   * @returns The categories for the region.
   */
  async categories(
    options: YoutubeCategoriesParams = {}
  ): Promise<CategoriesResponse> {
    return this.client.request<CategoriesResponse>("/v1/youtube/categories", {
      params: { gl: options.gl },
    });
  }

  /**
   * List supported UI languages (hl codes).
   *
   * @returns The supported UI languages.
   */
  async languages(): Promise<LanguagesResponse> {
    return this.client.request<LanguagesResponse>("/v1/youtube/languages");
  }

  /**
   * List supported content regions (gl codes).
   *
   * @returns The supported content regions.
   */
  async regions(): Promise<RegionsResponse> {
    return this.client.request<RegionsResponse>("/v1/youtube/regions");
  }

  /**
   * List the regions the scraper explicitly geo-targets (proxy-pinned).
   *
   * @returns The supported scraper markets.
   */
  async markets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/youtube/markets");
  }
}
