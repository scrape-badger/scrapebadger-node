/**
 * ChatGPT Reference Data API client.
 *
 * Provides the list of models chatgpt.com currently offers.
 */

import type { BaseClient } from "../internal/client.js";
import type { ChatGPTModelsParams, ChatGPTModelsResponse } from "./types.js";

/**
 * Client for ChatGPT reference data endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const result = await client.chatgpt.reference.models();
 * for (const model of result.models) {
 *   console.log(`${model.slug}: ${model.title}`);
 * }
 * ```
 */
export class ReferenceClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get the models chatgpt.com currently offers.
   *
   * Costs 1 credit.
   *
   * @param params - Optional parameters.
   * @param params.country - ISO-3166 alpha-2 egress country (default: "US").
   * @returns The available models.
   *
   * @example
   * ```typescript
   * const result = await client.chatgpt.reference.models({ country: "GB" });
   * console.log(`${result.count} models`);
   * for (const model of result.models) {
   *   console.log(`${model.slug}: ${model.max_tokens} tokens`);
   * }
   * ```
   */
  async models(params: ChatGPTModelsParams = {}): Promise<ChatGPTModelsResponse> {
    return this.client.request<ChatGPTModelsResponse>("/v1/chatgpt/models", {
      params: { country: params.country },
    });
  }
}
