/**
 * Realtor Properties API client.
 *
 * Provides a method for fetching full property detail.
 */

import type { BaseClient } from "../internal/client.js";
import type { RealtorPropertyOptions, PropertyDetail } from "./types.js";

/**
 * Client for the realtor property detail endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const detail = await client.realtor.properties.getProperty("1234567890");
 * console.log(detail.address?.line, detail.list_price);
 * ```
 */
export class PropertiesClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single property's full detail.
   *
   * @param propertyId - The property id.
   * @param options - Optional parameters (market).
   * @returns Property detail including details, amenities, and history.
   * @throws NotFoundError - If the property doesn't exist.
   */
  async getProperty(
    propertyId: string,
    options: RealtorPropertyOptions = {}
  ): Promise<PropertyDetail> {
    return this.client.request<PropertyDetail>(`/v1/realtor/properties/${propertyId}`, {
      params: { market: options.market },
    });
  }
}
