/**
 * Naver Products API client.
 *
 * Full commerce product detail (SmartStore / brand storefronts).
 */

import type { BaseClient } from "../internal/client.js";
import type { NaverProductDetailParams, NaverResponse } from "./types.js";

/**
 * Client for Naver commerce product detail.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Brand store (default host)
 * const product = await client.naver.products.get("55667788", { store_url: "drbrian" });
 *
 * // SmartStore resolved by channel uid
 * const ss = await client.naver.products.get("55667788", {
 *   host: "smartstore",
 *   channel_uid: "2sx…",
 * });
 * ```
 */
export class ProductsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get commerce product detail.
   *
   * @param productNo - `channelProductNo` (the storefront `/products/{no}` id).
   * @param params - Optional host, `store_url` (required when `channel_uid` is
   *   omitted), `channel_uid`, and SmartStore partial-enrich hints.
   */
  async get(productNo: string, params: NaverProductDetailParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/products/${productNo}`, {
      params: {
        host: params.host,
        store_url: params.store_url,
        channel_uid: params.channel_uid,
        broadcast_id: params.broadcast_id,
        live_channel_id: params.live_channel_id,
        query: params.query,
      },
    });
  }
}
