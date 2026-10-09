/**
 * Naver Stores API client.
 *
 * SmartStore / brand-store profile, category tree, product listing and
 * bestsellers.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  NaverResponse,
  NaverStoreBestsellersParams,
  NaverStoreParams,
  NaverStoreProductsParams,
} from "./types.js";

/**
 * Client for Naver store endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.naver.stores.get("plusink");
 * const categories = await client.naver.stores.categories("plusink");
 * const products = await client.naver.stores.products("plusink", { page: 2 });
 * const best = await client.naver.stores.bestsellers("plusink", { period: "WEEKLY" });
 * ```
 */
export class StoresClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Store / seller profile.
   *
   * @param storeUrl - Store URL slug, e.g. `"plusink"`.
   * @param params - Optional `host` (`smartstore` | `brand`).
   */
  async get(storeUrl: string, params: NaverStoreParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/stores/${storeUrl}`, {
      params: { host: params.host },
    });
  }

  /**
   * Store category tree (recursive display categories).
   *
   * @param storeUrl - Store URL slug.
   * @param params - Optional `host`.
   */
  async categories(storeUrl: string, params: NaverStoreParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/stores/${storeUrl}/categories`, {
      params: { host: params.host },
    });
  }

  /**
   * Store product listing (listing-card union, not full detail).
   *
   * @param storeUrl - Store URL slug.
   * @param params - Optional host, category, paging, sort and `channel_uid`.
   */
  async products(storeUrl: string, params: NaverStoreProductsParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/stores/${storeUrl}/products`, {
      params: {
        host: params.host,
        category_id: params.category_id,
        page: params.page,
        size: params.size,
        sort: params.sort,
        channel_uid: params.channel_uid,
      },
    });
  }

  /**
   * Store bestseller list.
   *
   * @param storeUrl - Store URL slug.
   * @param params - Optional host and `period`.
   */
  async bestsellers(
    storeUrl: string,
    params: NaverStoreBestsellersParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/stores/${storeUrl}/bestsellers`, {
      params: { host: params.host, period: params.period },
    });
  }
}
