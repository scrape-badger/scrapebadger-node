/**
 * LoopNet API client.
 *
 * Provides access to all LoopNet API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ListingsClient } from "./listings.js";
import { BrokersClient } from "./brokers.js";
import { ReferenceClient } from "./reference.js";

/**
 * LoopNet API client with access to all LoopNet endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - For-lease / for-sale / auction commercial-listing search
 * - `listings` - Listing detail (by listing id)
 * - `brokers` - Broker profile and their active listings
 * - `reference` - Reference data (markets, property types)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search listings
 * const results = await client.loopnet.search.search({ location: "Houston, TX" });
 *
 * // Get listing detail
 * const detail = await client.loopnet.listings.get("12345678");
 *
 * // Get a broker profile
 * const broker = await client.loopnet.brokers.get("jane-doe", "w7x2k9");
 *
 * // Reference data
 * const markets = await client.loopnet.reference.markets();
 * ```
 */
export class LoopNetClient {
  /** Client for for-lease / for-sale / auction commercial-listing search */
  readonly search: SearchClient;

  /** Client for listing detail (by listing id) */
  readonly listings: ListingsClient;

  /** Client for broker profile and their active listings */
  readonly brokers: BrokersClient;

  /** Client for reference data (markets, property types) */
  readonly reference: ReferenceClient;

  /**
   * Create a new LoopNet client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.listings = new ListingsClient(client);
    this.brokers = new BrokersClient(client);
    this.reference = new ReferenceClient(client);
  }
}
