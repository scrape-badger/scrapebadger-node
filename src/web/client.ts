/**
 * Web scraping API client for ScrapeBadger SDK.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  ScrapeOptions,
  ScrapeResult,
  DetectOptions,
  DetectResult,
} from "./types.js";

/**
 * Client for web scraping operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Simple scrape
 * const result = await client.web.scrape("https://scrapebadger.com");
 * console.log(result.content);
 *
 * // Scrape with JavaScript rendering
 * const rendered = await client.web.scrape("https://scrapebadger.com", {
 *   renderJs: true,
 *   format: "markdown",
 * });
 *
 * // AI extraction
 * const extracted = await client.web.extract(
 *   "https://scrapebadger.com/pricing",
 *   "Extract all pricing plans with their features"
 * );
 *
 * // Detect anti-bot systems
 * const detection = await client.web.detect("https://scrapebadger.com");
 * console.log(detection.antibot_systems);
 * ```
 */
export class WebClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Scrape a web page.
   *
   * @param url - The URL to scrape
   * @param options - Scrape configuration options
   * @returns The scrape result including content, metadata, and credit usage
   */
  async scrape(url: string, options: ScrapeOptions = {}): Promise<ScrapeResult> {
    const body: Record<string, unknown> = { url };

    if (options.format !== undefined) body.format = options.format;
    if (options.renderJs !== undefined) body.render_js = options.renderJs;
    if (options.engine !== undefined) body.engine = options.engine;
    if (options.waitFor !== undefined) body.wait_for = options.waitFor;
    if (options.waitTimeout !== undefined) body.wait_timeout = options.waitTimeout;
    if (options.waitAfterLoad !== undefined) body.wait_after_load = options.waitAfterLoad;
    if (options.jsScenario !== undefined) body.js_scenario = options.jsScenario;
    if (options.sessionId !== undefined) body.session_id = options.sessionId;
    if (options.retryCount !== undefined) body.retry_count = options.retryCount;
    if (options.retryOnBlock !== undefined) body.retry_on_block = options.retryOnBlock;
    if (options.country !== undefined) body.country = options.country;
    if (options.customHeaders !== undefined) body.custom_headers = options.customHeaders;
    if (options.screenshot !== undefined) body.screenshot = options.screenshot;
    if (options.video !== undefined) body.video = options.video;
    if (options.antiBot !== undefined) body.anti_bot = options.antiBot;
    if (options.escalate !== undefined) body.escalate = options.escalate;
    if (options.maxCost !== undefined) body.max_cost = options.maxCost;
    if (options.aiExtract !== undefined) body.ai_extract = options.aiExtract;
    if (options.aiPrompt !== undefined) body.ai_prompt = options.aiPrompt;

    return this.client.request<ScrapeResult>("/v1/web/scrape", {
      method: "POST",
      body,
    });
  }

  /**
   * Extract structured data from a web page using AI.
   *
   * Convenience wrapper around {@link scrape} that enables AI extraction
   * with the given prompt and defaults to markdown format.
   *
   * @param url - The URL to extract data from
   * @param prompt - Natural language prompt describing what to extract (max 2000 chars)
   * @param options - Additional scrape options (aiExtract and aiPrompt are set automatically)
   * @returns The scrape result with ai_extraction populated
   */
  async extract(
    url: string,
    prompt: string,
    options: ScrapeOptions = {}
  ): Promise<ScrapeResult> {
    return this.scrape(url, {
      format: "markdown",
      ...options,
      aiExtract: true,
      aiPrompt: prompt,
    });
  }

  /**
   * Detect anti-bot systems on a URL.
   *
   * @param url - The URL to analyze
   * @param options - Detection options
   * @returns Detection results including identified anti-bot and captcha systems
   */
  async detect(url: string, options: DetectOptions = {}): Promise<DetectResult> {
    const body: Record<string, unknown> = { url };

    if (options.timeout !== undefined) body.timeout = options.timeout;
    if (options.country !== undefined) body.country = options.country;

    return this.client.request<DetectResult>("/v1/web/detect", {
      method: "POST",
      body,
    });
  }
}
