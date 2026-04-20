/**
 * Google Patents API client — search, detail.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, PatentsDetailParams, PatentsSearchParams } from "./types.js";

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

  /**
   * Get rich patent document details by patent number.
   *
   * Response includes full abstract + every claim + complete description,
   * plus structured `cpc_classifications` (code + description), split
   * `backward_citations` / `forward_citations` (with `primary_examiner`
   * flag), `non_patent_citations`, `concepts` (research fields),
   * `legal_events` (prosecution history), `figures` (full-res URLs),
   * every `inventor`, and the full `assignees_original` history.
   */
  async detail(params: PatentsDetailParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/patents/detail", {
      params: { ...params },
    });
  }
}
