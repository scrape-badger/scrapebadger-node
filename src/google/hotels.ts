/**
 * Google Hotels API client — search, property details.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  HotelsDetailsParams,
  HotelsSearchParams,
} from "./types.js";

/**
 * Client for Google Hotels endpoints.
 *
 * @example
 * ```typescript
 * const hotels = await client.google.hotels.search({
 *   q: "Paris",
 *   check_in: "2026-05-01",
 *   check_out: "2026-05-05",
 *   adults: 2,
 * });
 * ```
 */
export class HotelsClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: HotelsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/hotels/search", {
      params: { ...params },
    });
  }

  async details(params: HotelsDetailsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/hotels/details", {
      params: { ...params },
    });
  }
}
