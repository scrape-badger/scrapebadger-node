/**
 * eBay API client.
 *
 * Provides access to all eBay API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ItemsClient } from "./items.js";
import { SellersClient } from "./sellers.js";
import { CategoriesClient } from "./categories.js";
import { ReferenceClient } from "./reference.js";

/**
 * eBay API client with access to all eBay endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Active search, completed/sold search, and autocomplete
 * - `items` - Item detail and catalog product reviews
 * - `sellers` - Seller profile, storefront items, and feedback
 * - `categories` - Category browse and reference category list
 * - `reference` - Reference data (markets)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search active listings
 * const results = await client.ebay.search.search({ query: "nintendo switch" });
 *
 * // Sold-price history
 * const sold = await client.ebay.search.completed({ query: "nintendo switch" });
 *
 * // Get item detail
 * const item = await client.ebay.items.get("123456789012");
 *
 * // Get item reviews
 * const reviews = await client.ebay.items.reviews("123456789012");
 *
 * // Get a seller profile
 * const seller = await client.ebay.sellers.get("musicmagpie");
 *
 * // Browse a category
 * const listings = await client.ebay.categories.browse("9355");
 *
 * // Reference data
 * const markets = await client.ebay.reference.markets();
 * ```
 */
export class EbayClient {
  /** Client for active search, completed/sold search, and autocomplete */
  readonly search: SearchClient;

  /** Client for item detail and catalog product reviews */
  readonly items: ItemsClient;

  /** Client for seller profile, items, and feedback */
  readonly sellers: SellersClient;

  /** Client for category browse and the reference category list */
  readonly categories: CategoriesClient;

  /** Client for reference data (markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new eBay client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.items = new ItemsClient(client);
    this.sellers = new SellersClient(client);
    this.categories = new CategoriesClient(client);
    this.reference = new ReferenceClient(client);
  }
}
