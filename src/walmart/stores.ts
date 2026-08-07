/**
 * Walmart Stores API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { WalmartStoreResponse } from "./types.js";

/**
 * Client for Walmart store endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const res = await client.walmart.stores.get("100");
 * console.log(res.store.address1, res.store.hours);
 * for (const svc of res.store.services) {
 *   console.log(svc.display_name, svc.phone);
 * }
 * ```
 */
export class StoresClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get store detail plus every store around it.
   *
   * @param storeId - Walmart store number, e.g. `"100"`.
   * @returns The store's address, geo, phone, opening hours and per-department
   *   services (each with its own hours and phone), plus ~30 nearby stores.
   */
  async get(storeId: string): Promise<WalmartStoreResponse> {
    return this.client.request<WalmartStoreResponse>(`/v1/walmart/stores/${storeId}`);
  }
}
