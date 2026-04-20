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
 * Search results carry doc `id`, `type` badge, wrapped `inline_links`
 * (versions + cited_by + related), PDF `resources`, and author objects
 * with `author_id` for pipe-through into {@link ScholarClient.author}.
 * The author endpoint returns structured `interests_detailed`,
 * publications with per-article `citation_id` + nested `cited_by`, and
 * lifetime + since-year citation stats.
 *
 * @example
 * ```typescript
 * const papers = await client.google.scholar.search({
 *   q: "transformer neural networks",
 *   as_ylo: 2020,
 * });
 * const first = papers.scholar_results[0];
 * // Pipe a profiled author into the author endpoint:
 * if (first.authors[0].author_id) {
 *   const profile = await client.google.scholar.author({
 *     author_id: first.authors[0].author_id,
 *   });
 * }
 * ```
 */
export class ScholarClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Google Scholar. Returns each result with doc `id`, `type`
   * badge, wrapped `inline_links`, PDF `resources`, and structured
   * authors. Envelope includes `scholar_results` alias,
   * `related_searches`, and matched `profiles` cards.
   */
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

  /**
   * Full Scholar author profile: structured `interests_detailed`,
   * publications (with per-article `citation_id` + nested
   * `cited_by{value, link, citation_id}`), stats, and co-authors.
   */
  async author(params: ScholarAuthorParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/scholar/author", {
      params: { ...params },
    });
  }

  /** Citations-per-year chart for a Scholar author. */
  async authorCitation(params: ScholarAuthorCitationParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/scholar/author/citation", {
      params: { ...params },
    });
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
