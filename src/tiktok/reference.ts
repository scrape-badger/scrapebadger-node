/**
 * TikTok Reference Data API client.
 *
 * Provides the supported-regions list and a service health check.
 */

import type { BaseClient } from "../internal/client.js";
import type { RegionsResponse } from "./types.js";

/**
 * Client for TikTok reference data endpoints (regions, health).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const regions = await client.tiktok.reference.regions();
 * for (const r of regions.regions) {
 *   console.log(`${r.code}: ${r.name} (${r.locale})`);
 * }
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * List supported TikTok content regions.
   *
   * @returns The regions response with all supported content regions.
   */
  async regions(): Promise<RegionsResponse> {
    return this.client.request<RegionsResponse>("/v1/tiktok/regions");
  }

  /**
   * Check the health of the TikTok scraper service.
   *
   * @returns The raw health payload from the scraper service.
   */
  async health(): Promise<unknown> {
    return this.client.request<unknown>("/v1/tiktok/health");
  }
}
