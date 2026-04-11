/**
 * Google Patents API client — search, detail.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  PatentsDetailParams,
  PatentsSearchParams,
} from "./types.js";

/**
 * Client for Google Patents endpoints.
 *
 * @example
 * ```typescript
 * const results = await client.google.patents.search({
 *   q: "distributed lock",
 *   assignee: "Google",
 * });
 * ```
 */
export class PatentsClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: PatentsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/patents/search", {
      params: { ...params },
    });
  }

  async detail(params: PatentsDetailParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/patents/detail", {
      params: { ...params },
    });
  }
}
