/**
 * Zillow Agent API client.
 *
 * Provides a method for fetching an agent profile and their listings.
 */

import type { BaseClient } from "../internal/client.js";
import type { ZillowAgentOptions, AgentResponse } from "./types.js";

/**
 * Client for the zillow agent profile endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const { agent } = await client.zillow.agent.getAgent({ username: "some-agent" });
 * console.log(agent.name, agent.review_count, agent.listings.length);
 * ```
 */
export class AgentClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a Zillow real-estate professional's profile and their active listings.
   *
   * Provide either a `username` (screen name) or a full `url`.
   *
   * @param options - The agent `username` or profile `url`.
   * @returns Agent profile wrapped in `{ agent }`.
   * @throws NotFoundError - If the agent doesn't exist.
   * @throws ValidationError - If neither username nor url is provided.
   */
  async getAgent(options: ZillowAgentOptions = {}): Promise<AgentResponse> {
    return this.client.request<AgentResponse>("/v1/zillow/agent", {
      params: { username: options.username, url: options.url },
    });
  }
}
