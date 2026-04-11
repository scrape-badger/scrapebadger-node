/**
 * Google Videos API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, VideosSearchParams } from "./types.js";

/**
 * Client for Google Videos search.
 */
export class VideosClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: VideosSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/videos/search", {
      params: { ...params },
    });
  }
}
