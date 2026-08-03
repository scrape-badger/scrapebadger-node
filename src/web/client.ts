/**
 * Web scraping API client for ScrapeBadger SDK.
 */

import type { BaseClient } from "../internal/client.js";
import type { ScrapeOptions, ScrapeResult, DetectOptions, DetectResult } from "./types.js";

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
    if (options.rawContent !== undefined) body.raw_content = options.rawContent;
    if (options.skipBotDetection !== undefined) body.skip_bot_detection = options.skipBotDetection;

    if (options.rawContent) {
      return this.scrapeRaw(body);
    }

    return this.client.request<ScrapeResult>("/v1/web/scrape", {
      method: "POST",
      body,
    });
  }

  /**
   * Run a `rawContent` scrape, whose response is not JSON.
   *
   * The normal path funnels a non-JSON response into `{ detail: text }`, so a
   * raw scrape returned a result with no content — and for a binary target,
   * `response.text()` decoded the bytes as UTF-8 and destroyed them. Read the
   * body as bytes and rebuild the metadata from the `X-Scrape-*` headers the
   * server sends in this mode.
   */
  private async scrapeRaw(body: Record<string, unknown>): Promise<ScrapeResult> {
    const { bytes, headers, status } = await this.client.postBinary("/v1/web/scrape", {
      body,
    });

    const int = (name: string): number => {
      const parsed = Number.parseInt(headers.get(name) ?? "", 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const mediaType = ((headers.get("content-type") ?? "").split(";")[0] ?? "").trim().toLowerCase();
    // Only decode when the payload is genuinely text — decoding an image or a
    // PDF is the very corruption this mode exists to avoid.
    const isText =
      mediaType.startsWith("text/") ||
      ["application/json", "application/xml", "image/svg+xml"].includes(mediaType);

    return {
      success: headers.get("x-scrape-success") !== "0",
      url: headers.get("x-scrape-url") ?? (typeof body.url === "string" ? body.url : ""),
      status_code: int("x-scrape-status-code") || status,
      content: isText ? new TextDecoder().decode(bytes) : null,
      content_bytes: bytes,
      content_base64: null,
      is_binary: !isText,
      content_type: mediaType || null,
      format: headers.get("x-scrape-format") ?? "html",
      engine_used: headers.get("x-scrape-engine") ?? "",
      credits_used: int("x-credits-used"),
      duration_ms: int("x-scrape-duration-ms"),
      retries_used: int("x-scrape-retries"),
      content_length: int("x-scrape-content-length") || bytes.length,
      screenshot_url: null,
      video_url: null,
      headers: {},
      blocking_detected: false,
    } as ScrapeResult;
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
  async extract(url: string, prompt: string, options: ScrapeOptions = {}): Promise<ScrapeResult> {
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
