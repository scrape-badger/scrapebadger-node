/**
 * Google Trends API client — interest, regions, related, trending.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  TrendsAutocompleteParams,
  TrendsInterestParams,
  TrendsRegionsParams,
  TrendsRelatedParams,
  TrendsTrendingParams,
} from "./types.js";

/**
 * Client for Google Trends endpoints.
 *
 * @example
 * ```typescript
 * const interest = await client.google.trends.interest({
 *   q: "python,javascript",
 *   date: "today 12-m",
 * });
 * ```
 */
export class TrendsClient {
  constructor(private readonly client: BaseClient) {}

  async interest(params: TrendsInterestParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/trends/interest", {
      params: { ...params },
    });
  }

  async regions(params: TrendsRegionsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/trends/regions", {
      params: { ...params },
    });
  }

  async related(params: TrendsRelatedParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/trends/related", {
      params: { ...params },
    });
  }

  async trending(params: TrendsTrendingParams = {}): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/trends/trending", {
      params: { ...params },
    });
  }

  /**
   * Return categorized Knowledge Graph topic entities (`mid`, `type`,
   * direct link into Trends explore) for a query prefix. Distinct from
   * Google Search autocomplete.
   */
  async autocomplete(params: TrendsAutocompleteParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/trends/autocomplete", {
      params: { ...params },
    });
  }
}
