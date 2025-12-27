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

The official Node.js/TypeScript client library for the [ScrapeBadger](https://scrapebadger.com) API.

## Features

- **Full TypeScript Support** - Complete type definitions for all API endpoints
- **Modern ESM & CommonJS** - Works with both module systems
- **Async Iterators** - Automatic pagination with `for await...of` syntax
- **Retry Logic** - Built-in exponential backoff for reliability
- **Error Handling** - Typed exceptions for different error scenarios
- **Tree Shakeable** - Import only what you need

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

// Create client with API key
const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Or use environment variable (SCRAPEBADGER_API_KEY)
const client = new ScrapeBadger();

// Get a tweet
const tweet = await client.twitter.tweets.getById("1234567890");
console.log(`@${tweet.username}: ${tweet.text}`);

// Get a user profile
const user = await client.twitter.users.getByUsername("elonmusk");
console.log(`${user.name} has ${user.followers_count.toLocaleString()} followers`);
```

## Usage Examples

### Search Tweets

```typescript
import { ScrapeBadger } from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Basic search (returns first page)
const results = await client.twitter.tweets.search("python programming");
for (const tweet of results.data) {
  console.log(`@${tweet.username}: ${tweet.text}`);
}

// Paginate manually
if (results.hasMore) {
  const nextPage = await client.twitter.tweets.search("python programming", {
    cursor: results.nextCursor,
  });
}

// Automatic pagination with async iterators
for await (const tweet of client.twitter.tweets.searchAll("python", { maxItems: 100 })) {
  console.log(tweet.text);
}

// Collect all results into an array
import { collectAll } from "scrapebadger";

const tweets = await collectAll(
  client.twitter.tweets.searchAll("python", { maxItems: 100 })
);
console.log(`Fetched ${tweets.length} tweets`);
```

### User Operations

```typescript
// Get user by username
const user = await client.twitter.users.getByUsername("elonmusk");

// Get user by ID
const userById = await client.twitter.users.getById("44196397");

// Get extended profile info
const about = await client.twitter.users.getAbout("elonmusk");
console.log(`Account based in: ${about.account_based_in}`);
console.log(`Username changes: ${about.username_changes}`);

// Get followers
const followers = await client.twitter.users.getFollowers("elonmusk");
for (const follower of followers.data) {
  console.log(`@${follower.username}`);
}

// Iterate through all followers
for await (const follower of client.twitter.users.getFollowersAll("elonmusk", {
  maxItems: 1000,
})) {
  console.log(follower.username);
}

// Search users
const users = await client.twitter.users.search("python developer");
```

### Lists

```typescript
// Get list details
const list = await client.twitter.lists.getDetail("123456");
console.log(`${list.name}: ${list.member_count} members`);

// Get list tweets
const tweets = await client.twitter.lists.getTweets("123456");

// Get list members
const members = await client.twitter.lists.getMembers("123456");

// Search for lists
const lists = await client.twitter.lists.search("tech leaders");
```

### Communities

```typescript
// Get community details
const community = await client.twitter.communities.getDetail("123456");
console.log(`${community.name}: ${community.member_count} members`);

// Get community tweets
const tweets = await client.twitter.communities.getTweets("123456", {
  tweetType: "Latest",
});

// Search communities
const communities = await client.twitter.communities.search("python developers");
```

### Trends

```typescript
// Get trending topics
const trends = await client.twitter.trends.getTrends();
for (const trend of trends.data) {
  console.log(`${trend.name}: ${trend.tweet_count || "N/A"} tweets`);
}

// Get trends by category
const newsTrends = await client.twitter.trends.getTrends({
  category: "news",
});

// Get trends for a specific location
const usTrends = await client.twitter.trends.getPlaceTrends(23424977); // US WOEID
console.log(`Trends in ${usTrends.name}:`);
for (const trend of usTrends.trends) {
  console.log(`  - ${trend.name}`);
}

// Get available locations
const locations = await client.twitter.trends.getAvailableLocations();
```

### Geographic Places

```typescript
// Search for places
const places = await client.twitter.geo.search({ query: "San Francisco" });
for (const place of places.data) {
  console.log(`${place.full_name} (${place.place_type})`);
}

// Search by coordinates
const nearby = await client.twitter.geo.search({
  lat: 37.7749,
  long: -122.4194,
  granularity: "city",
});

// Get place details
const place = await client.twitter.geo.getDetail("5a110d312052166f");
```

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

  // Optional: Custom base URL (default: https://api.scrapebadger.com)
  baseUrl: "https://api.scrapebadger.com",

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Maximum retry attempts (default: 3)
  maxRetries: 3,

  // Optional: Initial retry delay in milliseconds (default: 1000)
  retryDelay: 1000,
});
```

## API Reference

### Client

- `ScrapeBadger` - Main client class

### Twitter Module

- `client.twitter.tweets` - Tweet operations
- `client.twitter.users` - User operations
- `client.twitter.lists` - List operations
- `client.twitter.communities` - Community operations
- `client.twitter.trends` - Trend operations
- `client.twitter.geo` - Geographic place operations

### Utilities

- `collectAll(asyncIterator)` - Collect async iterator results into an array

### Exceptions

- `ScrapeBadgerError` - Base exception class
- `AuthenticationError` - Invalid or missing API key
- `RateLimitError` - Rate limit exceeded
- `NotFoundError` - Resource not found
- `ValidationError` - Invalid request
- `ServerError` - Server error
- `TimeoutError` - Request timeout
- `InsufficientCreditsError` - Out of credits
- `AccountRestrictedError` - Account restricted

## Requirements

- Node.js 18+ (for native `fetch` support)
- TypeScript 5.0+ (for best type inference)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [Documentation](https://scrapebadger.com/docs)
- [GitHub](https://github.com/scrape-badger/scrapebadger-node)
- [npm](https://www.npmjs.com/package/scrapebadger)
