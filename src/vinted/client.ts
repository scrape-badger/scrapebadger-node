/**
 * Vinted API client.
 *
 * Provides access to all Vinted API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ItemsClient } from "./items.js";
import { UsersClient } from "./users.js";
import { ReferenceClient } from "./reference.js";

/**
 * Vinted API client with access to all Vinted endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Search for items across Vinted marketplaces
 * - `items` - Get individual item details
 * - `users` - User profiles and their item listings
 * - `reference` - Reference data (brands, colors, statuses, markets)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search items
 * const results = await client.vinted.search.search({ query: "nike air max" });
 *
 * // Get item details
 * const item = await client.vinted.items.get(123456789);
 *
 * // Get user profile
 * const user = await client.vinted.users.getProfile(12345);
 *
 * // Get reference data
 * const markets = await client.vinted.reference.markets();
 * ```
 */
export class VintedClient {
  /** Client for item search operations */
  readonly search: SearchClient;

  /** Client for individual item operations */
  readonly items: ItemsClient;

  /** Client for user operations */
  readonly users: UsersClient;

  /** Client for reference data (brands, colors, statuses, markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Vinted client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.items = new ItemsClient(client);
    this.users = new UsersClient(client);
    this.reference = new ReferenceClient(client);
  }
}
