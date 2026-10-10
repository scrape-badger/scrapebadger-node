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
  /**
   * Capture a PNG screenshot (forces the browser engine). Returned in
   * `screenshot_url` as a `data:image/png;base64,` URI. Captures the viewport
   * unless `screenshotFullPage` is set. For a screenshot-only call,
   * {@link WebClient.screenshot} returns the bare PNG.
   */
  screenshot?: boolean;
  /** With `screenshot: true`, capture the whole scrollable page instead of the viewport */
  screenshotFullPage?: boolean;
  /** Browser viewport width in pixels (320-3840) */
  windowWidth?: number;
  /** Browser viewport height in pixels (240-4320) */
  windowHeight?: number;
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
  /**
   * Base64 body for a binary target (image/PDF/archive). Set instead of
   * `content`, which is null there — binary bytes have no text form.
   * Null when the body exceeded the 25 MB base64 ceiling.
   */
  content_base64: string | null;
  /** Whether the target returned a binary (non-text) body. */
  is_binary: boolean;
  /** The target's response Content-Type, as a bare media type. */
  content_type: string | null;
  /**
   * Undecoded response body. Only set when `rawContent: true` — that mode
   * returns the body itself rather than a JSON envelope. Write it straight to
   * a file; do not decode it, the payload may be an image or a PDF.
   */
  content_bytes?: Uint8Array;
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
  /**
   * Whether the `wait_for` selector appeared within `wait_timeout`. Null when
   * no `wait_for` was requested. A miss never arrives as a success — the API
   * answers `422 wait_for_timeout` and nothing is charged.
   */
  wait_for_found?: boolean | null;
  /**
   * One entry per executed `js_scenario` step, in order: `step`, `action`,
   * `selector`, `ok`, `error`, `url` (the page URL right after the step).
   * Execution stops at the first failed step; a failed step is a free
   * `422 js_scenario_failed`. Null when no scenario ran.
   */
  js_scenario_report?: JsScenarioStepReport[] | null;
}

export interface JsScenarioStepReport {
  step: number;
  action: string;
  selector: string | null;
  ok: boolean;
  error: string | null;
  url: string | null;
}

/** Proxy pool for a fetch. Same pricing as on `/v1/web/scrape`. */
export type ProxyTier = "simple" | "premium" | "ultra";

export interface ScreenshotOptions {
  /** Capture the whole scrollable page instead of the viewport */
  fullPage?: boolean;
  /** Viewport width in pixels (320-3840) */
  width?: number;
  /** Viewport height in pixels (240-4320) */
  height?: number;
  /** CSS selector to wait for before capturing */
  waitFor?: string;
  /** ISO country code for proxy geo-targeting */
  country?: string;
  /** Proxy pool (default "simple") */
  proxyTier?: ProxyTier;
}

export interface ScreenshotResult {
  success: boolean;
  url: string;
  status_code: number;
  /** Always `image/png`. */
  content_type: string;
  /** The PNG, base64-encoded (no `data:` prefix). */
  screenshot: string;
  /**
   * The PNG decoded to bytes — write it straight to a file, e.g.
   * `await writeFile("page.png", result.png)`.
   */
  png: Uint8Array;
  engine_used: string | null;
  credits_used: number;
  duration_ms: number;
}

/** One `extractRules` field in its long form. */
export interface ExtractRule {
  /** CSS or XPath selector. */
  selector: string;
  /** Selector language; inferred from the selector when unset. */
  type?: "css" | "xpath";
  /** Return every match as a list, not just the first. */
  all?: boolean;
  /** An element's text content (default), or its outer HTML. */
  output?: "text" | "html";
}

export interface ExtractDataOptions {
  /**
   * Field -> selector. A selector starting with `/` or `(` is XPath, anything
   * else CSS (`::text` and `::attr(name)` supported). Results land in `data`.
   */
  extractRules?: Record<string, string | ExtractRule>;
  /** Field -> plain-language description; the AI returns exactly these keys. */
  aiExtractRules?: Record<string, string>;
  /**
   * Freeform question about the page. With `aiExtractRules` the answer is
   * added under an `answer` key.
   */
  aiQuery?: string;
  /** Render the page in a browser before extracting */
  renderJs?: boolean;
  /** CSS selector to wait for before extracting (browser render) */
  waitFor?: string;
  /** ISO country code for proxy geo-targeting */
  country?: string;
  /** Proxy pool (default "simple") */
  proxyTier?: ProxyTier;
}

export interface ExtractResult {
  success: boolean;
  url: string;
  status_code: number;
  /**
   * One key per `extractRules` field: the first match, a list with
   * `all: true`, or null when nothing matched. Null when no `extractRules`
   * were given.
   */
  data: Record<string, string | string[] | null> | null;
  /** The AI's JSON answer. Null when no AI was requested. */
  ai_extraction: Record<string, unknown> | string | unknown[] | null;
  ai_model: string | null;
  /** Why AI extraction failed, when it did. Selector results in `data` are still returned. */
  ai_error: string | null;
  engine_used: string | null;
  credits_used: number;
  duration_ms: number;
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
