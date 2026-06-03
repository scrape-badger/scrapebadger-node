/**
 * Amazon API client.
 *
 * Provides access to all Amazon API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ProductsClient } from "./products.js";
import { ListingsClient } from "./listings.js";
import { SellersClient } from "./sellers.js";
import { ReferenceClient } from "./reference.js";

/**
 * Amazon API client with access to all Amazon endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Keyword search and autocomplete
 * - `products` - Product detail, offers, and reviews
 * - `listings` - Bestsellers, new releases, deals, and category browse
 * - `sellers` - Seller profile, storefront products, and feedback
 * - `reference` - Reference data (markets, categories)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search products
 * const results = await client.amazon.search.search({ query: "wireless headphones" });
 *
 * // Get product detail
 * const detail = await client.amazon.products.get("B08N5WRWNW");
 *
 * // Get bestsellers
 * const top = await client.amazon.listings.bestsellers({ category: "electronics" });
 *
 * // Get a seller profile
 * const seller = await client.amazon.sellers.get("A2L77EE7U53NWQ");
 *
 * // Get reference data
 * const markets = await client.amazon.reference.markets();
 * ```
 */
export class AmazonClient {
  /** Client for keyword search and autocomplete */
  readonly search: SearchClient;

  /** Client for product detail, offers, and reviews */
  readonly products: ProductsClient;

  /** Client for bestsellers, new releases, deals, and category browse */
  readonly listings: ListingsClient;

  /** Client for seller profile, products, and feedback */
  readonly sellers: SellersClient;

  /** Client for reference data (markets, categories) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Amazon client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.products = new ProductsClient(client);
    this.listings = new ListingsClient(client);
    this.sellers = new SellersClient(client);
    this.reference = new ReferenceClient(client);
  }
}
