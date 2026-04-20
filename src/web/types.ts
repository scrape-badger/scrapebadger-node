/**
 * TypeScript types for web scraping API responses.
 */

export interface ScrapeOptions {
  /** Output format */
  format?: "html" | "markdown" | "text";
  /** Whether to render JavaScript */
  renderJs?: boolean;
  /** Force a specific engine (auto, browser) */
  engine?: "auto" | "browser";
  /** CSS selector or XPath to wait for */
  waitFor?: string;
  /** Timeout in ms for waitFor selector (1000-120000) */
  waitTimeout?: number;
  /** Additional ms to wait after page load (0-30000) */
  waitAfterLoad?: number;
  /** Browser actions to perform before extracting */
  jsScenario?: Array<Record<string, unknown>>;
  /** Session ID for persistent cookies/state */
  sessionId?: string;
  /** Max retry attempts on blocking (0-10) */
  retryCount?: number;
  /** Auto-retry on blocking detection */
  retryOnBlock?: boolean;
  /** ISO country code for proxy geo-targeting */
  country?: string;
  /** Custom HTTP headers */
  customHeaders?: Record<string, string>;
  /** Capture full-page screenshot */
  screenshot?: boolean;
  /** Record browser session as video (+3 credits) */
  video?: boolean;
  /** Attempt anti-bot bypass */
  antiBot?: boolean;
  /** Allow auto-escalation to stronger engines */
  escalate?: boolean;
  /** Maximum credits budget */
  maxCost?: number;
  /** Run AI extraction on content */
  aiExtract?: boolean;
  /** Natural language prompt for AI extraction (max 2000 chars) */
  aiPrompt?: string;
  /**
   * When true, the server streams the raw body as `text/html` with
   * metadata in `X-Scrape-*` response headers instead of JSON-wrapping
   * the content. Saves 300–1000 ms on large (>1 MB) pages. Incompatible
   * with `aiExtract`, `screenshot`, `video`.
   */
  rawContent?: boolean;
  /**
   * When true, the server skips the generic blocking-page + anti-bot /
   * CAPTCHA regex scans on the response body. Saves ~1.3 s on large
   * responses. Only safe for origins known not to use consumer WAFs
   * (Cloudflare, DataDome, Akamai, Kasada). Default false — keep
   * disabled for general-purpose scraping.
   */
  skipBotDetection?: boolean;
}

export interface ScrapeResult {
  success: boolean;
  url: string;
  status_code: number;
  content: string | null;
  format: string;
  engine_used: string;
  credits_used: number;
  duration_ms: number;
  retries_used: number;
  content_length: number;
  screenshot_url: string | null;
  video_url: string | null;
  headers: Record<string, string>;
  blocking_detected: boolean;
  blocking_details: Record<string, unknown> | null;
  antibot_systems: Array<Record<string, unknown>>;
  captcha_systems: Array<Record<string, unknown>>;
  anti_bot_solved: boolean;
  solver_used: string | null;
  ai_extraction: Record<string, unknown> | string | unknown[] | null;
  ai_model: string | null;
  ai_error: string | null;
}

export interface DetectOptions {
  /** Request timeout in ms (1000-60000) */
  timeout?: number;
  /** ISO country code for proxy geo-targeting */
  country?: string;
}

export interface DetectResult {
  url: string;
  antibot_systems: Array<Record<string, unknown>>;
  captcha_systems: Array<Record<string, unknown>>;
  is_blocked: boolean;
  blocking_type: string | null;
  recommendation: string | null;
  credits_used: number;
  duration_ms: number;
}
