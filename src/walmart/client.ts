/**
 * Walmart API client.
 *
 * Provides access to all Walmart API endpoints through specialized sub-clients.
 * US-only (walmart.com) — there is no market or country parameter.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ProductsClient } from "./products.js";
import { SellersClient } from "./sellers.js";
import { StoresClient } from "./stores.js";
import { ReferenceClient } from "./reference.js";

/**
 * Walmart API client with access to all Walmart endpoints.
 *
 * Sub-clients:
 * - `search` - Search, category browse, deals, autocomplete
 * - `products` - Product detail and reviews
 * - `sellers` - Marketplace seller profile and catalogue
 * - `stores` - Store detail and nearby stores
 * - `reference` - Reference data (markets) and service health
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.walmart.search.search("laptop");
 * const product = await client.walmart.products.get("5689919121");
 * const reviews = await client.walmart.products.reviews("5689919121");
 * const seller = await client.walmart.sellers.get("101040442");
 * const store = await client.walmart.stores.get("100");
 * const markets = await client.walmart.reference.markets();
 * ```
 */
export class WalmartClient {
  /** Client for search, category browse, deals and autocomplete */
  readonly search: SearchClient;

  /** Client for product detail and reviews */
  readonly products: ProductsClient;

  /** Client for marketplace seller profile and catalogue */
  readonly sellers: SellersClient;

  /** Client for store detail and nearby stores */
  readonly stores: StoresClient;

  /** Client for reference data (markets) and service health */
  readonly reference: ReferenceClient;

  /**
   * Create a new Walmart client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.products = new ProductsClient(client);
    this.sellers = new SellersClient(client);
    this.stores = new StoresClient(client);
    this.reference = new ReferenceClient(client);
  }
}
