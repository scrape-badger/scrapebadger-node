/**
 * Shopee API client.
 *
 * Provides access to all Shopee API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ProductsClient } from "./products.js";
import { ReviewsClient } from "./reviews.js";
import { ReferenceClient } from "./reference.js";

/**
 * Shopee API client with access to all Shopee endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Keyword search and category-item listing
 * - `products` - Full product detail pages (PDP)
 * - `reviews` - Product reviews and rating summaries
 * - `reference` - Reference data (markets, category tree)
 *
 * Supported markets: id, ph, vn, br, my, th, sg, tw, co, cl, mx.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search products
 * const results = await client.shopee.search.search({
 *   keyword: "wireless headphones",
 *   market: "sg",
 * });
 *
 * // Get product detail
 * const product = await client.shopee.products.get(12345, 67890, { market: "sg" });
 *
 * // Get reviews
 * const reviews = await client.shopee.reviews.get(12345, 67890, { rating: 5 });
 *
 * // Get reference data
 * const markets = await client.shopee.reference.markets();
 * const tree = await client.shopee.reference.categories({ market: "sg" });
 * ```
 */
export class ShopeeClient {
  /** Client for keyword search and category-item listing */
  readonly search: SearchClient;

  /** Client for full product detail pages */
  readonly products: ProductsClient;

  /** Client for product reviews and rating summaries */
  readonly reviews: ReviewsClient;

  /** Client for reference data (markets, category tree) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Shopee client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.products = new ProductsClient(client);
    this.reviews = new ReviewsClient(client);
    this.reference = new ReferenceClient(client);
  }
}
