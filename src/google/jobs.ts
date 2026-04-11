/**
 * Google Jobs API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, JobsSearchParams } from "./types.js";

/**
 * Client for Google Jobs search.
 *
 * @example
 * ```typescript
 * const jobs = await client.google.jobs.search({
 *   q: "software engineer",
 *   location: "San Francisco, CA",
 *   job_type: "FULLTIME",
 * });
 * ```
 */
export class JobsClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: JobsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/jobs/search", {
      params: { ...params },
    });
  }
}
