/**
 * Google Images API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, ImagesSearchParams } from "./types.js";

/**
 * Client for Google Images search.
 */
export class ImagesClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: ImagesSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/images/search", {
      params: { ...params },
    });
  }
}
