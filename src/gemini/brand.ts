/**
 * Gemini Brand Visibility API client.
 *
 * Answer-engine-optimisation (AEO/GEO) analysis: ask Gemini a prompt and get
 * back how a brand fares in the answer, next to its competitors.
 */

import type { BaseClient } from "../internal/client.js";
import type { GeminiBrandVisibilityParams, GeminiBrandVisibilityResponse } from "./types.js";

/**
 * Client for the Gemini brand-visibility endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const result = await client.gemini.brand.visibility({
 *   prompt: "best web scraping API",
 *   brand: "ScrapeBadger",
 *   domain: "scrapebadger.com",
 *   competitors: ["Bright Data", "Apify"],
 * });
 * console.log(result.mentioned, result.share_of_voice_pct);
 * ```
 */
export class BrandClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Analyse how a brand shows up in Gemini's answer to a prompt.
   *
   * @param params - Brand-visibility parameters.
   * @param params.prompt - The prompt to send (max 4096 characters).
   * @param params.brand - The brand name to look for in the answer.
   * @param params.domain - The brand's domain, used to detect brand citations.
   * @param params.aliases - Other spellings that should count as mentions.
   * @param params.competitors - Competitors to measure share of voice against.
   * @param params.country - ISO-3166 alpha-2 egress country (default: "US").
   * @param params.web_search - "auto", "force", or "off" (default: "force").
   * @returns The brand analysis plus the answer and its citations.
   *
   * @example
   * ```typescript
   * const result = await client.gemini.brand.visibility({
   *   prompt: "which proxy provider should I use?",
   *   brand: "ScrapeBadger",
   *   domain: "scrapebadger.com",
   *   aliases: ["Scrape Badger"],
   *   competitors: ["Bright Data", "Oxylabs"],
   *   country: "DE",
   * });
   * console.log(`position score: ${result.position_score}`);
   * for (const competitor of result.competitors) {
   *   console.log(`${competitor.name}: ${competitor.mention_count}`);
   * }
   * ```
   */
  async visibility(params: GeminiBrandVisibilityParams): Promise<GeminiBrandVisibilityResponse> {
    return this.client.request<GeminiBrandVisibilityResponse>("/v1/gemini/brand-visibility", {
      params: {
        prompt: params.prompt,
        brand: params.brand,
        domain: params.domain,
        aliases: params.aliases?.length ? params.aliases.join(",") : undefined,
        competitors: params.competitors?.length ? params.competitors.join(",") : undefined,
        country: params.country,
        web_search: params.web_search,
      },
    });
  }
}
