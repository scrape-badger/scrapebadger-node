/**
 * Leboncoin API client.
 *
 * Provides access to all Leboncoin API endpoints through specialized
 * sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { AdsClient } from "./ads.js";
import { SellersClient } from "./sellers.js";
import { ReferenceClient } from "./reference.js";

/**
 * Leboncoin API client with access to all Leboncoin endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Ad search across the single France marketplace
 * - `ads` - Ad detail and similar ads
 * - `sellers` - Seller profile and their active listings
 * - `reference` - Reference data (categories, regions, departments,
 *   location autocomplete, markets)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search ads
 * const results = await client.leboncoin.search.search({ text: "velo" });
 *
 * // Get an ad
 * const ad = await client.leboncoin.ads.get(2934857123);
 *
 * // Similar ads
 * const similar = await client.leboncoin.ads.similar(2934857123);
 *
 * // Seller profile + listings
 * const seller = await client.leboncoin.sellers.get("a1b2c3d4-...");
 * const listings = await client.leboncoin.sellers.listings("a1b2c3d4-...");
 *
 * // Reference data
 * const { categories } = await client.leboncoin.reference.categories();
 * ```
 */
export class LeboncoinClient {
  /** Client for ad search */
  readonly search: SearchClient;

  /** Client for ad detail and similar ads */
  readonly ads: AdsClient;

  /** Client for seller profile and listings */
  readonly sellers: SellersClient;

  /** Client for reference data (categories, regions, departments, locations, markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Leboncoin client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.ads = new AdsClient(client);
    this.sellers = new SellersClient(client);
    this.reference = new ReferenceClient(client);
  }
}
