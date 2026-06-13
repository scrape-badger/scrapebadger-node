/**
 * Shopee Products API client.
 *
 * Provides methods for fetching full product detail pages (PDP).
 */

import type { BaseClient } from "../internal/client.js";
import type { ShopeeProductParams, ShopeeProduct } from "./types.js";

/**
 * Client for the Shopee product detail endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const product = await client.shopee.products.get(12345, 67890, { market: "sg" });
 * console.log(`${product.name}: ${product.price} ${product.currency}`);
 *
 * for (const model of product.models) {
 *   console.log(`  Variant: ${model.name} — ${model.price}`);
 * }
 * ```
 */
export class ProductsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get full product detail (PDP) for a Shopee item.
   *
   * @param shopId - The Shopee shop identifier.
   * @param itemId - The Shopee item identifier.
   * @param options - Optional parameters (market).
   * @returns Full product detail including pricing, ratings, images, and variations.
   * @throws NotFoundError - If the product doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the market code is invalid.
   */
  async get(
    shopId: number,
    itemId: number,
    options: ShopeeProductParams = {}
  ): Promise<ShopeeProduct> {
    return this.client.request<ShopeeProduct>(
      `/v1/shopee/product/${shopId}/${itemId}`,
      { params: { market: options.market } }
    );
  }
}
