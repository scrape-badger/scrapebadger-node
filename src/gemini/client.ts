/**
 * Gemini API client.
 *
 * Provides access to all Gemini API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { AskClient } from "./ask.js";
import { BrandClient } from "./brand.js";

/**
 * Gemini API client with access to all Gemini endpoints.
 *
 * Prompts the real gemini.google.com — not the Gemini API — anonymously, and
 * returns the answer as structured JSON including the web sources Gemini
 * cited.
 *
 * Sub-clients:
 * - `ask` - Send a prompt and get the answer with its sources
 * - `brand` - AEO/GEO brand-visibility analysis
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Ask a question
 * const result = await client.gemini.ask.ask({ prompt: "best running shoes 2026" });
 *
 * // Brand visibility
 * const brand = await client.gemini.brand.visibility({
 *   prompt: "best web scraping API",
 *   brand: "ScrapeBadger",
 *   competitors: ["Bright Data"],
 * });
 * ```
 */
export class GeminiClient {
  /** Client for asking Gemini a question */
  readonly ask: AskClient;

  /** Client for AEO/GEO brand-visibility analysis */
  readonly brand: BrandClient;

  /**
   * Create a new Gemini client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.ask = new AskClient(client);
    this.brand = new BrandClient(client);
  }
}
