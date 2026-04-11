<p align="center">
  <img src="https://scrapebadger.com/logo-dark.png" alt="ScrapeBadger" width="400">
</p>

<h1 align="center">ScrapeBadger Node.js SDK</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/scrapebadger"><img src="https://img.shields.io/npm/v/scrapebadger.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/scrapebadger"><img src="https://img.shields.io/npm/dm/scrapebadger.svg" alt="npm downloads"></a>
  <a href="https://github.com/scrape-badger/scrapebadger-node/actions/workflows/test.yml"><img src="https://github.com/scrape-badger/scrapebadger-node/actions/workflows/test.yml/badge.svg" alt="Tests"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

The official Node.js/TypeScript client library for the [ScrapeBadger](https://scrapebadger.com) API — Twitter, Google, Vinted, and general web scraping.

## Features

- **Full TypeScript Support** - Complete type definitions for all API endpoints
- **Modern ESM & CommonJS** - Works with both module systems
- **Async Iterators** - Automatic pagination with `for await...of` syntax
- **Smart Rate Limiting** - Reads API headers and throttles pagination automatically
- **Resilient Retries** - Exponential backoff with colored console warnings
- **Typed Exceptions** - Distinct error classes for every failure scenario
- **37+ Twitter endpoints** - Tweets, users, lists, communities, trends, geo, real-time streams
- **19 Google product APIs** - Search (with optional deferred AI Overview follow-up), Maps, News, Hotels, Trends (incl. topic autocomplete), Jobs, Shopping (+ merchant URL enrichment), Patents, Scholar (search + profiles + author + author citation + cite formats), Images, Videos, Finance, AI Mode, Lens, **Local Pack**, **Shorts**, **Flights**, Products
- **Vinted scraping** - Search items, item details, user profiles, brands, colors, markets
- **Web scraping** - Anti-bot bypass, JS rendering, and AI data extraction

## Installation

```bash
npm install scrapebadger
```

```bash
yarn add scrapebadger
```

```bash
pnpm add scrapebadger
```

## Quick Start

```typescript
import { ScrapeBadger } from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Get a tweet
const tweet = await client.twitter.tweets.getById("1234567890");
console.log(`@${tweet.username}: ${tweet.text}`);

// Scrape a website
const result = await client.web.scrape("https://scrapebadger.com", { format: "markdown" });
console.log(result.content);

// Get a user profile
const user = await client.twitter.users.getByUsername("elonmusk");
console.log(`${user.name} has ${user.followers_count.toLocaleString()} followers`);
```

## Authentication

```typescript
// Pass API key directly
const client = new ScrapeBadger({ apiKey: "sb_live_xxxxxxxxxxxxx" });

// Or use environment variable SCRAPEBADGER_API_KEY
const client = new ScrapeBadger();
```

## Available APIs

| API | Description | Documentation |
|-----|-------------|---------------|
| **Web Scraping** | Scrape any website with JS rendering, anti-bot bypass, and AI extraction | [Web Scraping Guide](docs/web-scraping.md) |
| **Twitter** | 37+ endpoints for tweets, users, lists, communities, trends, and real-time streams | [Twitter Guide](docs/twitter.md) |
| **Google** | 19 products — Search, Maps, News, Hotels, Trends, Jobs, Shopping, Patents, Scholar, Images, Videos, Finance, AI Mode, Lens, Autocomplete, Local, Shorts, Flights, Products | [Google Guide](docs/google.md) |
| **Vinted** | Search items, get details, user profiles, and reference data across all Vinted markets | [Vinted Guide](docs/vinted.md) |

## Error Handling

```typescript
import {
  ScrapeBadger,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  InsufficientCreditsError,
} from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

try {
  const tweet = await client.twitter.tweets.getById("1234567890");
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after: ${error.retryAfter}`);
  } else if (error instanceof NotFoundError) {
    console.error("Tweet not found");
  } else if (error instanceof InsufficientCreditsError) {
    console.error("Out of credits");
  } else {
    throw error;
  }
}
```

## Configuration

```typescript
const client = new ScrapeBadger({
  // Required: Your API key (or use SCRAPEBADGER_API_KEY env var)
  apiKey: "your-api-key",

  // Optional: Custom base URL (default: https://scrapebadger.com)
  baseUrl: "https://scrapebadger.com",

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Maximum retry attempts (default: 10)
  maxRetries: 10,

  // Optional: Initial retry delay in milliseconds (default: 1000)
  retryDelay: 1000,
});
```

### Retry Behavior

The SDK automatically retries requests that fail with server errors (5xx) or rate
limits (429) using exponential backoff (1s, 2s, 4s, 8s, ...). Each retry prints a
colored warning:

```
⚠ ScrapeBadger: 503 Service Unavailable — retrying in 4s (attempt 3/10)
```

### Rate Limit Aware Pagination

When using `*All` pagination methods (e.g. `searchAll`, `getFollowersAll`), the SDK
reads `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers from each response.
When remaining requests drop below 20% of your tier's limit, pagination automatically
slows down to spread requests across the remaining window — preventing 429 errors:

```
⚠ ScrapeBadger: Rate limit: 25/300 remaining (resets in 42s), throttling pagination
```

This works transparently with all tier levels (Free: 60/min, Basic: 300/min,
Pro: 1000/min, Enterprise: 5000/min).

## Exceptions

- `ScrapeBadgerError` - Base exception class
- `AuthenticationError` - Invalid or missing API key
- `RateLimitError` - Rate limit exceeded
- `NotFoundError` - Resource not found
- `ValidationError` - Invalid request
- `ServerError` - Server error
- `TimeoutError` - Request timeout
- `InsufficientCreditsError` - Out of credits
- `AccountRestrictedError` - Account restricted
- `WebSocketStreamError` - WebSocket stream failure (auth, limit, or network)

## Requirements

- Node.js 18+ (for native `fetch` support)
- TypeScript 5.0+ (for best type inference)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [Documentation](https://docs.scrapebadger.com)
- [Discord](https://discord.com/invite/3WvwTyWVCx)
- [GitHub](https://github.com/scrape-badger/scrapebadger-node)
- [npm](https://www.npmjs.com/package/scrapebadger)
