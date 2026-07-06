/**
 * Zillow Properties API client.
 *
 * Provides a method for fetching full property detail.
 */

import type { BaseClient } from "../internal/client.js";
import type { PropertyResponse } from "./types.js";

/**
 * Client for the zillow property detail endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const { property } = await client.zillow.properties.getProperty("2078029085");
 * console.log(property.street_address, property.price);
 * ```
 */
export class PropertiesClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single Zillow property's full detail by its zpid.
   *
   * Returns price/valuation, specs, resoFacts (home_facts), price & tax
   * history, schools, listing agent, mortgage rates and photos.
   *
   * @param zpid - The Zillow property id.
   * @returns Property detail wrapped in `{ property }`.
   * @throws NotFoundError - If the property doesn't exist.
   */
  async getProperty(zpid: string): Promise<PropertyResponse> {
    return this.client.request<PropertyResponse>(`/v1/zillow/property/${zpid}`);
  }
}
