/**
 * Zillow Properties API client.
 *
 * Provides a method for fetching full property detail.
 */

import type { BaseClient } from "../internal/client.js";
import type { BuildingResponse, PropertyResponse } from "./types.js";

/**
 * Client for the zillow property- and building-detail endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const { property } = await client.zillow.properties.getProperty("2078029085");
 * console.log(property.street_address, property.price);
 *
 * const { building } = await client.zillow.properties.getBuilding(
 *   "https://www.zillow.com/apartments/kansas-city-mo/brookside-51/CkBJqt/",
 * );
 * console.log(building.name, building.rent_min, building.units?.length);
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

  /**
   * Get a Zillow multifamily building (apartment community) by its URL.
   *
   * Zillow serves multi-unit rentals on `/apartments/...` and `/b/...` pages,
   * which {@link getProperty} cannot read. Pass the `detail_url` of a search
   * result whose `home_type` is `"BUILDING"`.
   *
   * Returns floor plans and every available unit with rent, base rent,
   * required monthly fees, sqft, beds/baths and move-in date, plus amenities,
   * unit features, policies, special offers, office hours, pet policy,
   * schools, photos and walk/transit/bike scores.
   *
   * @param url - Full Zillow building URL.
   * @returns Building detail wrapped in `{ building }`.
   * @throws NotFoundError - If the building doesn't exist.
   */
  async getBuilding(url: string): Promise<BuildingResponse> {
    return this.client.request<BuildingResponse>("/v1/zillow/building", {
      params: { url },
    });
  }
}
