/**
 * Web scraping API client for ScrapeBadger SDK.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  ScrapeOptions,
  ScrapeResult,
  DetectOptions,
  DetectResult,
  ScreenshotOptions,
  ScreenshotResult,
  ExtractDataOptions,
  ExtractResult,
} from "./types.js";

const BATCH_GONE =
  "Batch jobs are not available: the API answers 501. Send concurrent scrape() " +
  "calls instead; each one is billed and answered on its own.";

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
 * // Screenshot, saved straight to a PNG file
 * const shot = await client.web.screenshot("https://scrapebadger.com", { fullPage: true });
 * await writeFile("page.png", shot.png);
 *
 * // Selector + AI extraction via /v1/web/extract
 * const data = await client.web.extractData("https://news.ycombinator.com", {
 *   extractRules: { top_story: ".titleline a" },
 * });
 * console.log(data.data);
 *
 * // Detect anti-bot systems
 * const detection = await client.web.detect("https://scrapebadger.com");
 * console.log(detection.antibot_systems);
 * ```
 */
export class WebClient {
  private readonly _gen: BaseClient;

  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this._gen = client;
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
    if (options.screenshotFullPage !== undefined)
      body.screenshot_full_page = options.screenshotFullPage;
    if (options.windowWidth !== undefined) body.window_width = options.windowWidth;
    if (options.windowHeight !== undefined) body.window_height = options.windowHeight;

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

    const mediaType = ((headers.get("content-type") ?? "").split(";")[0] ?? "")
      .trim()
      .toLowerCase();
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
   * with the given prompt and defaults to markdown format. For CSS/XPath
   * selectors, or AI extraction by field, use {@link extractData}.
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

  /**
   * Render a page in the browser engine and capture a PNG screenshot.
   *
   * Billed like a browser scrape plus the proxy tier. A page that loads
   * without a screenshot is a `502` and costs nothing.
   *
   * @param url - The URL to capture
   * @param options - Viewport, wait and proxy options
   * @returns The base64 PNG in `screenshot`, and the decoded bytes in `png`
   */
  async screenshot(url: string, options: ScreenshotOptions = {}): Promise<ScreenshotResult> {
    const body: Record<string, unknown> = { url };

    if (options.fullPage !== undefined) body.full_page = options.fullPage;
    if (options.width !== undefined) body.width = options.width;
    if (options.height !== undefined) body.height = options.height;
    if (options.waitFor !== undefined) body.wait_for = options.waitFor;
    if (options.country !== undefined) body.country = options.country;
    if (options.proxyTier !== undefined) body.proxy_tier = options.proxyTier;

    const result = await this.client.request<Omit<ScreenshotResult, "png">>("/v1/web/screenshot", {
      method: "POST",
      body,
    });
    return { ...result, png: Buffer.from(result.screenshot ?? "", "base64") };
  }

  /**
   * Scrape a page and extract fields with CSS/XPath selectors, AI, or both.
   *
   * Billed like a scrape, plus the AI extraction credits when AI is asked for
   * and succeeds. Broken selectors are rejected with `422` before anything is
   * fetched.
   *
   * @param url - The URL to extract from
   * @param options - At least one of `extractRules`, `aiExtractRules` or `aiQuery`
   * @returns Selector results in `data` and the AI answer in `ai_extraction`
   */
  async extractData(url: string, options: ExtractDataOptions): Promise<ExtractResult> {
    if (!options.extractRules && !options.aiExtractRules && !options.aiQuery) {
      throw new Error("Provide at least one of extractRules, aiExtractRules or aiQuery");
    }
    const body: Record<string, unknown> = { url };

    if (options.extractRules !== undefined) body.extract_rules = options.extractRules;
    if (options.aiExtractRules !== undefined) body.ai_extract_rules = options.aiExtractRules;
    if (options.aiQuery !== undefined) body.ai_query = options.aiQuery;
    if (options.renderJs !== undefined) body.render_js = options.renderJs;
    if (options.waitFor !== undefined) body.wait_for = options.waitFor;
    if (options.country !== undefined) body.country = options.country;
    if (options.proxyTier !== undefined) body.proxy_tier = options.proxyTier;

    return this.client.request<ExtractResult>("/v1/web/extract", {
      method: "POST",
      body,
    });
  }

  /**
   * Submit batch scraping job.
   *
   * @deprecated Batch jobs are not available: the API answers `501` (not
   * billed). Send concurrent {@link scrape} calls instead.
   */
  async submitBatchScrapingJob(
    body?: unknown,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    process.emitWarning(BATCH_GONE, "DeprecationWarning");
    return this._gen.request("/v1/web/batch", { method: "POST", params, body });
  }

  /**
   * Get batch job status.
   *
   * @deprecated Batch jobs are not available: the API answers `501` (not
   * billed). Send concurrent {@link scrape} calls instead.
   */
  async getBatchJobStatus(
    jobId: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    process.emitWarning(BATCH_GONE, "DeprecationWarning");
    return this._gen.request(`/v1/web/batch/${jobId}`, { params });
  }

  // --- BEGIN generated by sdk/codegen/facade — do not edit ---

  /** Extract structured data. Generated from the OpenAPI spec; returns the raw response object. */
  async extractStructuredData(
    body?: unknown,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this._gen.request("/v1/web/extract", { method: "POST", params, body });
  }

  /** Take a screenshot. Generated from the OpenAPI spec; returns the raw response object. */
  async takeAScreenshot(
    body?: unknown,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this._gen.request("/v1/web/screenshot", { method: "POST", params, body });
  }

  /** Poll an auto-unblock discovery job. Generated from the OpenAPI spec; returns the raw response object. */
  async pollAnAutoUnblockDiscoveryJob(
    jobId: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<Record<string, unknown>> {
    return this._gen.request(`/v1/web/unblock/${jobId}`, { params });
  }
  // --- END generated by sdk/codegen/facade ---
}
