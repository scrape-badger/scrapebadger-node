/**
 * Google Lens API client (visual image search).
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, LensSearchParams } from "./types.js";

/**
 * Client for Google Lens visual search by image URL.
 */
export class LensClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: LensSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/lens/search", {
      params: { ...params },
    });
  }
}
