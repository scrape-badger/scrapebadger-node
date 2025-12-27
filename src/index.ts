/**
 * ScrapeBadger Node.js SDK
 *
 * A TypeScript/JavaScript client library for the ScrapeBadger API.
 *
 * @packageDocumentation
 * @module scrapebadger
 *
 * @example
 * ```typescript
 * import { ScrapeBadger, collectAll } from "scrapebadger";
 *
 * const client = new ScrapeBadger({ apiKey: "your-api-key" });
 *
 * // Get a single tweet
 * const tweet = await client.twitter.tweets.getById("1234567890");
 * console.log(tweet.text);
 *
 * // Get a user profile
 * const user = await client.twitter.users.getByUsername("elonmusk");
 * console.log(`${user.name} has ${user.followers_count} followers`);
 *
 * // Search tweets with automatic pagination
 * for await (const tweet of client.twitter.tweets.searchAll("python")) {
 *   console.log(tweet.text);
 * }
 *
 * // Collect all results into an array
 * const tweets = await collectAll(
 *   client.twitter.tweets.searchAll("python", { maxItems: 100 })
 * );
 * ```
 */

// Main client
export { ScrapeBadger } from "./client.js";

// Configuration types
export type { ScrapeBadgerConfig, ResolvedConfig } from "./internal/config.js";

// Exceptions
export {
  ScrapeBadgerError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  ServerError,
  TimeoutError,
  InsufficientCreditsError,
  AccountRestrictedError,
} from "./internal/exceptions.js";

// Pagination utilities
export type {
  PaginatedResponse,
  PaginationOptions,
  IteratorOptions,
} from "./internal/pagination.js";
export { collectAll } from "./internal/pagination.js";

// Re-export Twitter module
export * from "./twitter/index.js";
