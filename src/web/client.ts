/**
 * Web scraping API client for ScrapeBadger SDK.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  ScrapeOptions,
  ScrapeResult,
  ScreenshotOptions,
  ScreenshotResult,
  ExtractOptions,
  ExtractResult,
  BatchOptions,
  BatchResult,
  SessionInfo,
} from "./types.js";

/**
 * Client for web scraping operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Simple scrape
 * const result = await client.web.scrape("https://example.com");
 * console.log(result.content);
 *
 * // Screenshot
 * const screenshot = await client.web.screenshot("https://example.com");
 *
 * // Extract structured data
 * const data = await client.web.extract("https://example.com", {
 *   schema: { title: "css:h1" }
 * });
 *
 * // Batch scrape
 * const batch = await client.web.batch(["https://a.com", "https://b.com"]);
 * ```
 */
export class WebClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Scrape a web page.
   */
  async scrape(url: string, options: ScrapeOptions = {}): Promise<ScrapeResult> {
    const body: Record<string, unknown> = { url };
    if (options.renderJs) body.render_js = true;
    if (options.outputFormat && options.outputFormat !== "html")
      body.output_format = options.outputFormat;
    if (options.proxyCountry) body.proxy_country = options.proxyCountry;
    if (options.proxyType) body.proxy_type = options.proxyType;
    if (options.sessionId) body.session_id = options.sessionId;
    if (options.engine) body.engine = options.engine;
    if (options.maxCost !== undefined) body.max_cost = options.maxCost;
    if (options.headers) body.headers = options.headers;
    if (options.waitFor) body.wait_for = options.waitFor;
    if (options.timeout !== undefined) body.timeout = options.timeout;
    if (options.jsScenario) body.js_scenario = options.jsScenario;

    return this.client.request<ScrapeResult>("/v1/web/scrape", {
      method: "POST",
      body,
    });
  }

  /**
   * Take a screenshot of a web page.
   */
  async screenshot(
    url: string,
    options: ScreenshotOptions = {}
  ): Promise<ScreenshotResult> {
    const body: Record<string, unknown> = { url };
    if (options.fullPage) body.full_page = true;
    if (options.viewportWidth && options.viewportWidth !== 1280)
      body.viewport_width = options.viewportWidth;
    if (options.viewportHeight && options.viewportHeight !== 720)
      body.viewport_height = options.viewportHeight;
    if (options.imageFormat && options.imageFormat !== "png")
      body.image_format = options.imageFormat;
    if (options.waitFor) body.wait_for = options.waitFor;
    if (options.timeout !== undefined) body.timeout = options.timeout;

    return this.client.request<ScreenshotResult>("/v1/web/screenshot", {
      method: "POST",
      body,
    });
  }

  /**
   * Extract structured data from a web page.
   */
  async extract(
    url: string,
    options: ExtractOptions = {}
  ): Promise<ExtractResult> {
    const body: Record<string, unknown> = { url };
    if (options.schema) body.extraction_schema = options.schema;
    if (options.renderJs) body.render_js = true;
    if (options.waitFor) body.wait_for = options.waitFor;
    if (options.timeout !== undefined) body.timeout = options.timeout;

    return this.client.request<ExtractResult>("/v1/web/extract", {
      method: "POST",
      body,
    });
  }

  /**
   * Scrape multiple URLs in a batch.
   */
  async batch(
    urls: string[],
    options: BatchOptions = {}
  ): Promise<BatchResult> {
    const body: Record<string, unknown> = { urls };
    if (options.renderJs) body.render_js = true;
    if (options.outputFormat && options.outputFormat !== "html")
      body.output_format = options.outputFormat;
    if (options.maxConcurrency && options.maxConcurrency !== 5)
      body.max_concurrency = options.maxConcurrency;
    if (options.engine) body.engine = options.engine;
    if (options.timeout !== undefined) body.timeout = options.timeout;

    return this.client.request<BatchResult>("/v1/web/batch", {
      method: "POST",
      body,
    });
  }

  /**
   * Create a new scraping session for a domain.
   */
  async createSession(domain: string, persist = true): Promise<SessionInfo> {
    return this.client.request<SessionInfo>("/v1/web/sessions", {
      method: "POST",
      body: {
        domain,
        new_session: true,
        persist_session: persist,
      },
    });
  }

  /**
   * Scrape using an existing session.
   */
  async reuseSession(
    url: string,
    sessionId: string,
    options: ScrapeOptions = {}
  ): Promise<ScrapeResult> {
    return this.scrape(url, { ...options, sessionId });
  }
}
