/**
 * Google AI Mode API client (udm=50 generative answers).
 */

import type { BaseClient } from "../internal/client.js";
import type { AiModeSearchParams, GoogleResponse } from "./types.js";

/**
 * Client for Google AI Mode.
 */
export class AiModeClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: AiModeSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/ai-mode/search", {
      params: { ...params },
    });
  }
}
