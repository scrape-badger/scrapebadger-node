# Web Scraping API

The ScrapeBadger Web Scraping API lets you scrape any website with JavaScript rendering, anti-bot bypass, and AI-powered data extraction. All methods are available under `client.web`.

## Usage Examples

### Basic Scrape

```typescript
const result = await client.web.scrape("https://scrapebadger.com", {
  format: "markdown",
});
console.log(result.content);
console.log(`Credits used: ${result.credits_used}`);
```

### JavaScript Rendering

```typescript
const result = await client.web.scrape("https://spa-website.com", {
  renderJs: true,
  waitFor: "#dynamic-content",
  waitTimeout: 10000,
});
```

### Anti-Bot Bypass with Escalation

```typescript
const result = await client.web.scrape("https://protected-site.com", {
  escalate: true,
  antiBot: true,
  country: "US",
  maxCost: 20,
});
```

### AI Data Extraction

```typescript
const result = await client.web.extract(
  "https://scrapebadger.com/pricing",
  "Extract all pricing plan names and prices as a JSON array",
  { format: "markdown" },
);
console.log(result.ai_extraction); // Structured data from LLM
```

### Screenshots

```typescript
import { writeFile } from "node:fs/promises";

const shot = await client.web.screenshot("https://scrapebadger.com", {
  fullPage: true, // whole scrollable page, not just the viewport
  width: 1280,
});
await writeFile("page.png", shot.png); // shot.screenshot is the base64 string
```

`scrape(url, { screenshot: true })` takes the equivalent `screenshotFullPage`,
`windowWidth` and `windowHeight` options and returns the PNG as a `data:` URI in
`screenshot_url`.

### Selector and AI Extraction

```typescript
const result = await client.web.extractData("https://news.ycombinator.com", {
  extractRules: {
    top_story: ".titleline a",
    links: { selector: ".titleline a::attr(href)", all: true },
  },
  aiQuery: "What is the top story about, in one sentence?",
});
console.log(result.data); // { top_story: "...", links: [...] }
console.log(result.ai_extraction); // { answer: "..." }
```

A selector starting with `/` or `(` is XPath; anything else is CSS. Pass
`aiExtractRules: { field: "description" }` to have the AI return exactly those
keys.

### Detect Anti-Bot Protection

```typescript
const detection = await client.web.detect("https://protected-site.com");
for (const system of detection.antibot_systems) {
  console.log(`${system.system}: confidence ${system.confidence}`);
}
console.log(`Recommendation: ${detection.recommendation}`);
```

### Browser Automation

```typescript
const result = await client.web.scrape("https://scrapebadger.com", {
  renderJs: true,
  jsScenario: [
    { type: "click", selector: "#load-more" },
    { type: "wait", milliseconds: 2000 },
    { type: "scroll", direction: "down", amount: 1000 },
  ],
});
```

## API Reference

| Method | Description |
|--------|-------------|
| `scrape(url, options?)` | Scrape a URL with optional JS rendering, anti-bot bypass, screenshots, video, and AI extraction |
| `extract(url, prompt, options?)` | Convenience wrapper — scrapes with AI extraction enabled |
| `screenshot(url, options?)` | Render a URL in the browser and return a PNG (`fullPage`, `width`, `height`) |
| `extractData(url, options)` | Extract fields with CSS/XPath `extractRules`, `aiExtractRules` and/or `aiQuery` |
| `detect(url, options?)` | Detect anti-bot and CAPTCHA systems on a URL |
| `submitBatchScrapingJob`, `getBatchJobStatus` | **Deprecated** — batch is not available (`501`); send concurrent `scrape` calls |

## Types

### ScrapeOptions

| Option | Type | Description |
|--------|------|-------------|
| `format` | `string` | Output format (`"markdown"`, `"html"`, `"text"`) |
| `renderJs` | `boolean` | Enable JavaScript rendering |
| `waitFor` | `string` | CSS selector to wait for before capturing |
| `waitTimeout` | `number` | Timeout in ms for `waitFor` |
| `escalate` | `boolean` | Enable automatic escalation through proxy tiers |
| `antiBot` | `boolean` | Enable anti-bot bypass |
| `country` | `string` | Geo-target country code |
| `maxCost` | `number` | Maximum credit cost |
| `jsScenario` | `array` | Browser automation steps |
| `screenshot` | `boolean` | Capture a PNG of the viewport (in `screenshot_url`) |
| `screenshotFullPage` | `boolean` | With `screenshot`, capture the whole scrollable page |
| `windowWidth` / `windowHeight` | `number` | Browser viewport size in pixels |

### ScrapeResult

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Scraped page content |
| `credits_used` | `number` | Credits consumed |
| `ai_extraction` | `any` | AI-extracted structured data (when using `extract`) |

### ScreenshotResult

| Field | Type | Description |
|-------|------|-------------|
| `screenshot` | `string` | The PNG, base64-encoded |
| `png` | `Uint8Array` | The decoded PNG bytes |
| `credits_used` | `number` | Credits consumed |

### ExtractResult

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object \| null` | One key per `extractRules` field (first match, a list with `all`, or `null`) |
| `ai_extraction` | `any` | The AI's JSON answer to `aiExtractRules` / `aiQuery` |
| `ai_error` | `string \| null` | Why AI extraction failed, when it did |
| `credits_used` | `number` | Credits consumed |

### DetectOptions

| Option | Type | Description |
|--------|------|-------------|
| `url` | `string` | URL to analyze |

### DetectResult

| Field | Type | Description |
|-------|------|-------------|
| `antibot_systems` | `array` | Detected anti-bot systems with confidence scores |
| `recommendation` | `string` | Recommended scraping approach |

---

[Back to main README](../README.md)
