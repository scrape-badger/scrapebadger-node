/**
 * Depop API client.
 *
 * Depop endpoints: search (product search), getProduct (full single-product
 * detail, by slug), getUser (shop / seller profile, by username),
 * getUserProducts (a seller's products), and listMarkets. Single host
 * (www.depop.com) localised by a `market` param → country + currency.
 *
 * Data is browser-rendered (cloakbrowser), so each call takes a few seconds
 * to return.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  DepopSearchParams,
  DepopProductParams,
  DepopUserParams,
  DepopUserProductsParams,
  DepopSearchResponse,
  DepopProductDetail,
  DepopShopProfile,
  DepopUserProductsResponse,
  DepopMarketsResponse,
} from "./types.js";

/**
 * Client for all Depop API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search products
 * const results = await client.depop.search("vintage denim jacket", { market: "gb" });
 * for (const product of results.products) {
 *   console.log(`${product.brand} — ${product.price} ${product.currency}`);
 * }
 *
 * // Full single-product detail
 * const detail = await client.depop.getProduct("some-product-slug");
 * console.log(detail.title);
 *
 * // Shop profile
 * const shop = await client.depop.getUser("someseller");
 *
 * // A seller's products
 * const items = await client.depop.getUserProducts("someseller");
 *
 * // Supported markets
 * const markets = await client.depop.listMarkets();
 * ```
 */
export class DepopClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Depop for products.
   *
   * Costs 10 credits.
   *
   * @param query - Search keywords (required).
   * @param options - Optional parameters (market, perPage, page, price/brand/
   *   size/colour/condition/gender filters, sort).
   * @returns Search response with matching product cards and pagination meta.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(query: string, options: DepopSearchParams = {}): Promise<DepopSearchResponse> {
    return this.client.request<DepopSearchResponse>("/v1/depop/search", {
      params: {
        query,
        market: options.market ?? "us",
        per_page: options.perPage,
        page: options.page,
        price_min: options.priceMin,
        price_max: options.priceMax,
        brands: options.brands,
        sizes: options.sizes,
        colours: options.colours,
        conditions: options.conditions,
        gender: options.gender,
        sort: options.sort,
      },
    });
  }

  /**
   * Get a single Depop product's full detail by slug.
   *
   * Costs 10 credits.
   *
   * @param slug - The Depop product slug.
   * @param options - Optional parameters (market).
   * @returns Full product detail.
   * @throws NotFoundError - If the product doesn't exist.
   */
  async getProduct(slug: string, options: DepopProductParams = {}): Promise<DepopProductDetail> {
    return this.client.request<DepopProductDetail>(`/v1/depop/products/${slug}`, {
      params: { market: options.market ?? "us" },
    });
  }

  /**
   * Get a Depop shop / seller profile by username.
   *
   * Costs 10 credits.
   *
   * @param username - The Depop seller username.
   * @param options - Optional parameters (market).
   * @returns Shop profile.
   * @throws NotFoundError - If the user doesn't exist.
   */
  async getUser(username: string, options: DepopUserParams = {}): Promise<DepopShopProfile> {
    return this.client.request<DepopShopProfile>(`/v1/depop/users/${username}`, {
      params: { market: options.market ?? "us" },
    });
  }

  /**
   * Get a Depop seller's products.
   *
   * Costs 10 credits.
   *
   * @param username - The Depop seller username.
   * @param options - Optional parameters (market, perPage, page).
   * @returns User products response with product cards and pagination meta.
   * @throws NotFoundError - If the user doesn't exist.
   */
  async getUserProducts(
    username: string,
    options: DepopUserProductsParams = {}
  ): Promise<DepopUserProductsResponse> {
    return this.client.request<DepopUserProductsResponse>(`/v1/depop/users/${username}/products`, {
      params: {
        market: options.market ?? "us",
        per_page: options.perPage,
        page: options.page,
      },
    });
  }

  /**
   * Get all supported Depop markets.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Markets response with all supported markets.
   */
  async listMarkets(): Promise<DepopMarketsResponse> {
    return this.client.request<DepopMarketsResponse>("/v1/depop/markets");
  }
}
