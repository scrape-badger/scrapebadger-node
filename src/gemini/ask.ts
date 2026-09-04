/**
 * Gemini Ask API client.
 *
 * Sends a prompt to the real gemini.google.com and returns the answer as
 * structured JSON, including the web sources Gemini cited.
 */

import type { BaseClient } from "../internal/client.js";
import type { GeminiAskParams, GeminiAskResponse } from "./types.js";

/**
 * Client for the Gemini ask endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const result = await client.gemini.ask.ask({
 *   prompt: "best running shoes 2026",
 * });
 * console.log(result.answer);
 * for (const citation of result.citations) {
 *   console.log(`${citation.domain}: ${citation.url}`);
 * }
 * ```
 */
export class AskClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Ask Gemini a question and get the answer with its sources.
   *
   * @param params - Ask parameters.
   * @param params.prompt - The prompt to send (max 4096 characters).
   * @param params.country - ISO-3166 alpha-2 egress country (default: "US").
   * @param params.web_search - "auto", "force", or "off" (default: "auto").
   * @param params.image_url - Public image URL to attach; Gemini answers about
   *   the picture. It will NOT generate one — anonymous gemini.google.com requires a login
   *   for that. Allow 90-150s for an image ask.
   * @returns The answer, its citations, and the full retrieved search set.
   *
   * @example
   * ```typescript
   * const result = await client.gemini.ask.ask({
   *   prompt: "what is the best CRM for a 10-person startup?",
   *   country: "GB",
   *   web_search: "force",
   * });
   * console.log(result.web_search_triggered, result.model);
   * for (const source of result.search_results) {
   *   console.log(`${source.cited ? "*" : " "} ${source.url}`);
   * }
   * ```
   */
  async ask(params: GeminiAskParams): Promise<GeminiAskResponse> {
    return this.client.request<GeminiAskResponse>("/v1/gemini/ask", {
      params: {
        prompt: params.prompt,
        country: params.country,
        web_search: params.web_search,
        image_url: params.image_url,
      },
    });
  }
}
