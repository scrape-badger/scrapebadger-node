/**
 * Google Local (Local Pack) API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, LocalSearchParams } from "./types.js";

/**
 * Client for Google Local Pack search.
 *
 * Distinct from the Maps API: driven by a query + location/uule rather
 * than a place_id, and ordered the way Google ranks local results in
 * the main SERP (via `tbm=lcl`). Use for local-SEO research, rank
 * tracking, and building directory datasets without going through the
 * Maps Protobuf API.
 *
 * @example
 * ```typescript
 * const local = await client.google.local.search({
 *   q: "coffee shops in brooklyn",
 *   uule: "w+CAIQICIRQnJvb2tseW4sIE5ZLCBVU0E",
 * });
 * for (const place of local.local_results) {
 *   console.log(place.title, place.rating, place.phone);
 * }
 * ```
 */
export class LocalClient {
  constructor(private readonly client: BaseClient) {}

  /** Return Google Local Pack business listings ranked for a SERP query. */
  async search(params: LocalSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/local/search", {
      params: { ...params },
    });
  }
}
