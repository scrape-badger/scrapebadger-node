/**
 * ChatGPT Ask API client.
 *
 * Sends a prompt to the real chatgpt.com and returns the answer as structured
 * JSON, including the web sources ChatGPT cited.
 */

import type { BaseClient } from "../internal/client.js";
import type { ChatGPTAskParams, ChatGPTAskResponse } from "./types.js";

/**
 * Client for the ChatGPT ask endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const result = await client.chatgpt.ask.ask({
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
   * Ask ChatGPT a question and get the answer with its sources.
   *
   * Costs 20 credits. Typical latency is 21-30 seconds.
   *
   * @param params - Ask parameters.
   * @param params.prompt - The prompt to send (max 4096 characters).
   * @param params.country - ISO-3166 alpha-2 egress country (default: "US").
   * @param params.web_search - "auto", "force", or "off" (default: "auto").
   * @returns The answer, its citations, and the full retrieved search set.
   *
   * @example
   * ```typescript
   * const result = await client.chatgpt.ask.ask({
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
  async ask(params: ChatGPTAskParams): Promise<ChatGPTAskResponse> {
    return this.client.request<ChatGPTAskResponse>("/v1/chatgpt/ask", {
      params: {
        prompt: params.prompt,
        country: params.country,
        web_search: params.web_search,
      },
    });
  }
}
