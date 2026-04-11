/**
 * Google Scholar API client.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  ScholarAuthorCitationParams,
  ScholarAuthorParams,
  ScholarCiteParams,
  ScholarProfilesParams,
  ScholarSearchParams,
} from "./types.js";

/**
 * Client for Google Scholar — search, author profiles, citation charts,
 * and citation formats.
 *
 * @example
 * ```typescript
 * const papers = await client.google.scholar.search({
 *   q: "transformer neural networks",
 *   as_ylo: 2020,
 * });
 *
 * const profiles = await client.google.scholar.profiles({
 *   mauthors: "Geoffrey Hinton",
 * });
 *
 * const author = await client.google.scholar.author({
 *   author_id: profiles.profiles[0].author_id,
 * });
 * ```
 */
export class ScholarClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: ScholarSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/scholar/search", {
      params: { ...params },
    });
  }

  /** Search Google Scholar for author profiles by name. */
  async profiles(params: ScholarProfilesParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/scholar/profiles", {
      params: { ...params },
    });
  }

  /** Get a full Scholar author profile (articles, stats, co-authors). */
  async author(params: ScholarAuthorParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/scholar/author", {
      params: { ...params },
    });
  }

  /** Citations-per-year chart for a Scholar author. */
  async authorCitation(
    params: ScholarAuthorCitationParams,
  ): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>(
      "/v1/google/scholar/author/citation",
      { params: { ...params } },
    );
  }

  /**
   * MLA / APA / Chicago / Harvard / Vancouver citation formats plus
   * BibTeX / RIS / EndNote / RefWorks export links for a paper.
   */
  async cite(params: ScholarCiteParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/scholar/cite", {
      params: { ...params },
    });
  }
}
