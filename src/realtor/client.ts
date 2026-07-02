/**
 * Realtor API client.
 *
 * Provides access to all Realtor API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { PropertiesClient } from "./properties.js";
import { ReferenceClient } from "./reference.js";

/**
 * Realtor API client with access to all Realtor endpoints.
 *
 * Unified real-estate API over realtor.com (US) + realtor.ca (Canada).
 *
 * Provides sub-clients for different resource types:
 * - `search` - Property search and location autocomplete
 * - `properties` - Full property detail
 * - `reference` - Reference data (markets)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search properties
 * const results = await client.realtor.search.search("Austin, TX");
 *
 * // Location autocomplete
 * const suggestions = await client.realtor.search.autocomplete("Miami");
 *
 * // Get property detail
 * const detail = await client.realtor.properties.getProperty("1234567890");
 *
 * // Reference data
 * const markets = await client.realtor.reference.listMarkets();
 * ```
 */
export class RealtorClient {
  /** Client for property search and location autocomplete */
  readonly search: SearchClient;

  /** Client for full property detail */
  readonly properties: PropertiesClient;

  /** Client for reference data (markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Realtor client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.properties = new PropertiesClient(client);
    this.reference = new ReferenceClient(client);
  }
}
