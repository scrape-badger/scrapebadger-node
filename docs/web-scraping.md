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
| `detect(url, options?)` | Detect anti-bot and CAPTCHA systems on a URL |

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

### ScrapeResult

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Scraped page content |
| `credits_used` | `number` | Credits consumed |
| `ai_extraction` | `any` | AI-extracted structured data (when using `extract`) |

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
