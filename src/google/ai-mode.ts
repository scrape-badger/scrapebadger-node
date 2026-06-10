/**
 * Google AI Mode API client (udm=50 generative answers).
 */

import type { BaseClient } from "../internal/client.js";
import type { AiModeResponse, AiModeSearchParams } from "./types.js";

/**
 * Client for Google AI Mode.
 */
export class AiModeClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get an AI-generated answer from Google's AI Mode (udm=50).
   *
   * The response carries structured `text_blocks` (prose, headings,
   * comparison `table` blocks and lists), a flat `references` list, a
   * compact `markdown` rendering and — unless `include_html: false` —
   * the raw `answer_html` body.
   */
  async search(params: AiModeSearchParams): Promise<AiModeResponse> {
    return this.client.request<AiModeResponse>("/v1/google/ai-mode/search", {
      params: { ...params },
    });
  }
}
