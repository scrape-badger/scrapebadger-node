/**
 * TypeScript types for web scraping API responses.
 */

export interface ScrapeOptions {
  /** Whether to render JavaScript */
  renderJs?: boolean;
  /** Output format (html, markdown, text, json) */
  outputFormat?: "html" | "markdown" | "text" | "json";
  /** Country code for proxy (e.g. "US") */
  proxyCountry?: string;
  /** Proxy type (datacenter, residential) */
  proxyType?: "datacenter" | "residential" | "mobile" | "isp";
  /** Reuse an existing session */
  sessionId?: string;
  /** Force a specific engine */
  engine?: string;
  /** Maximum credit cost */
  maxCost?: number;
  /** Custom HTTP headers */
  headers?: Record<string, string>;
  /** CSS selector to wait for */
  waitFor?: string;
  /** Request timeout in seconds */
  timeout?: number;
  /** JavaScript actions to execute */
  jsScenario?: Array<Record<string, unknown>>;
}

export interface ScreenshotOptions {
  /** Capture full page (not just viewport) */
  fullPage?: boolean;
  /** Viewport width in pixels */
  viewportWidth?: number;
  /** Viewport height in pixels */
  viewportHeight?: number;
  /** Image format (png, jpeg) */
  imageFormat?: "png" | "jpeg";
  /** CSS selector to wait for */
  waitFor?: string;
  /** Request timeout in seconds */
  timeout?: number;
}

export interface ExtractOptions {
  /** Extraction schema (CSS/XPath selectors) */
  schema?: Record<string, unknown>;
  /** Whether to render JavaScript */
  renderJs?: boolean;
  /** CSS selector to wait for */
  waitFor?: string;
  /** Request timeout in seconds */
  timeout?: number;
}

export interface BatchOptions {
  /** Whether to render JavaScript */
  renderJs?: boolean;
  /** Output format */
  outputFormat?: "html" | "markdown" | "text" | "json";
  /** Maximum concurrent requests */
  maxConcurrency?: number;
  /** Force a specific engine */
  engine?: string;
  /** Request timeout in seconds */
  timeout?: number;
}

export interface ScrapeResult {
  content: string;
  status_code: number;
  url: string;
  engine_used?: string;
  credits_used: number;
  processing_time_ms?: number;
  anti_bot_detected: boolean;
  anti_bot_provider?: string;
  captcha_solved: boolean;
  session_id?: string;
  session_reused: boolean;
}

export interface ScreenshotResult {
  image_data: string;
  format: string;
  url: string;
  credits_used: number;
}

export interface ExtractResult {
  data: Record<string, unknown>;
  url: string;
  credits_used: number;
}

export interface BatchResult {
  results: ScrapeResult[];
  total: number;
  successful: number;
  failed: number;
}

export interface SessionInfo {
  session_id: string;
  domain: string;
  reused: boolean;
  fingerprint_id?: string;
}
