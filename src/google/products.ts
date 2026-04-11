/**
 * Google Products API client (immersive product detail).
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, ProductsDetailParams } from "./types.js";

/**
 * Client for Google's immersive product detail endpoint.
 */
export class ProductsClient {
  constructor(private readonly client: BaseClient) {}

  async detail(params: ProductsDetailParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/products/detail", {
      params: { ...params },
    });
  }
}
