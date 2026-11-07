/**
 * Public GitHub compatibility adapter with repository detail.
 */

import type { BaseClient } from "../internal/client.js";

/** Public profile operations and repository detail. */
export class GithubClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /** Get public default-branch repository detail without query options. */
  async getRepository(owner: string, repo: string): Promise<Record<string, unknown>> {
    if ([owner, repo].some((value) => value === "." || value === "..")) {
      throw new TypeError("owner and repo must not be dot path segments");
    }
    return this.client.request<Record<string, unknown>>(
      `/v1/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
    );
  }

  /** Get profile. Generated from the OpenAPI spec; returns the raw response object. */
  async getProfile(
    username: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this.client.request(`/v1/github/profiles/${username}`, { params });
  }
}
