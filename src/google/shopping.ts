/**
 * Google Shopping API client — search, product detail, click enrichment.
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
 * @example
 * ```typescript
 * const products = await client.google.shopping.search({ q: "laptop" });
 * const first = (products.results as any[])[0];
 *
 * // Resolve the real merchant URL for this product
 * const enriched = await client.google.shopping.click({
 *   title: first.title,
 *   source: first.source,
 * });
 * console.log("Merchant URL:", enriched.merchant_url);
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

  /** Get detailed product information by product ID. */
  async product(params: ShoppingProductParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/shopping/product", {
      params: { ...params },
    });
  }

  /**
   * Resolve the real merchant URL for a Shopping product.
   *
   * Google has removed merchant links from organic Shopping HTML, so this
   * per-product enrichment uses an "I'm Feeling Lucky" redirect (scoped to
   * the card's source merchant via `site:` operator when supplied) to
   * materialize the direct product page URL. Mirrors ScrapingDog's
   * `scrapingdog_immersive_product_link` pattern.
   */
  async click(params: ShoppingClickParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>(
      "/v1/google/shopping/product/click",
      { params: { ...params } }
    );
  }
}
