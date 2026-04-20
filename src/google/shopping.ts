/**
 * Google Shopping API client — search and product detail.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  ShoppingClickParams,
  ShoppingProductParams,
  ShoppingSearchParams,
} from "./types.js";

/**
 * Client for Google Shopping endpoints.
 *
 * Each search tile now carries Google's native `gpcid`, `catalog_id`,
 * `headline_offer_docid`, `image_docid`, and `mid`, so callers can pipe a
 * tile directly into `client.google.products.detail()` for full specs
 * plus merchant offers via the fast `/async/oapv` RPC (~2s).
 *
 * @example
 * ```typescript
 * const products = await client.google.shopping.search({ q: "laptop" });
 * const first = (products.results as any[])[0];
 * const detail = await client.google.products.detail({
 *   product_id: first.gpcid,
 *   q: "laptop",
 *   include_offers: true, // real merchant URLs from /async/piu_ps
 * });
 * ```
 */
export class ShoppingClient {
  constructor(private readonly client: BaseClient) {}

  /** Search Google Shopping for products. */
  async search(params: ShoppingSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/shopping/search", {
      params: { ...params },
    });
  }

  /** Fetch the Google Shopping product detail page by `product_id`. */
  async product(params: ShoppingProductParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/shopping/product", {
      params: { ...params },
    });
  }

  /**
   * Resolve the direct merchant URL for a Shopping product tile via
   * Google's "I'm Feeling Lucky" redirect (scoped to the card's `source`
   * merchant via the `site:` operator). You only pay for the call when
   * you actually want the merchant link — no bulk enrichment of every
   * tile.
   */
  async click(params: ShoppingClickParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/shopping/product/click", {
      params: { ...params },
    });
  }
}
