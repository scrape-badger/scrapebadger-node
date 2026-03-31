/**
 * Vinted Items API client.
 *
 * Provides methods for fetching individual Vinted item details.
 */

import type { BaseClient } from "../internal/client.js";
import type { ItemDetailResponse } from "./types.js";

/**
 * Client for Vinted item endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const item = await client.vinted.items.get(123456789, { market: "fr" });
 * console.log(`${item.item.title} — ${item.item.price.amount} ${item.item.price.currency_code}`);
 * console.log(`Seller: ${item.item.seller.login}`);
 * ```
 */
export class ItemsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single item by ID.
   *
   * @param itemId - The Vinted item ID to fetch.
   * @param options - Optional parameters.
   * @param options.market - Market code (default: "fr").
   * @returns The item detail response including full item data.
   * @throws NotFoundError - If the item doesn't exist.
   * @throws AuthenticationError - If the API key is invalid.
   *
   * @example
   * ```typescript
   * const response = await client.vinted.items.get(123456789);
   * const { item } = response;
   * console.log(`${item.title}: ${item.description}`);
   * console.log(`Brand: ${item.brand_title}, Size: ${item.size_title}`);
   * console.log(`Photos: ${item.photos.length}`);
   * ```
   */
  async get(
    itemId: number,
    options: { market?: string } = {}
  ): Promise<ItemDetailResponse> {
    return this.client.request<ItemDetailResponse>(
      `/v1/vinted/items/${itemId}`,
      { params: { market: options.market } }
    );
  }
}
