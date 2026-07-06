/**
 * Zillow API client.
 *
 * Provides access to all Zillow API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { PropertiesClient } from "./properties.js";
import { AgentClient } from "./agent.js";
import { ReferenceClient } from "./reference.js";

/**
 * Zillow API client with access to all Zillow endpoints.
 *
 * Maximal-coverage real-estate API over zillow.com (US + Canadian inventory,
 * all served from zillow.com behind a US IP).
 *
 * Provides sub-clients for different resource types:
 * - `search` - Property search and location autocomplete
 * - `properties` - Full property detail
 * - `agent` - Agent profile + their listings
 * - `reference` - Reference data (markets)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search properties
 * const results = await client.zillow.search.search("Austin, TX");
 *
 * // Location autocomplete
 * const suggestions = await client.zillow.search.autocomplete("Miami");
 *
 * // Get property detail
 * const { property } = await client.zillow.properties.getProperty("2078029085");
 *
 * // Get an agent profile
 * const { agent } = await client.zillow.agent.getAgent({ username: "some-agent" });
 *
 * // Reference data
 * const markets = await client.zillow.reference.listMarkets();
 * ```
 */
export class ZillowClient {
  /** Client for property search and location autocomplete */
  readonly search: SearchClient;

  /** Client for full property detail */
  readonly properties: PropertiesClient;

  /** Client for agent profile + listings */
  readonly agent: AgentClient;

  /** Client for reference data (markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Zillow client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.properties = new PropertiesClient(client);
    this.agent = new AgentClient(client);
    this.reference = new ReferenceClient(client);
  }
}
