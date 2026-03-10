/**
 * Pagination utilities for the ScrapeBadger SDK.
 */

import type { RateLimit } from "./client.js";

/**
 * Response wrapper for paginated API responses.
 */
export interface PaginatedResponse<T> {
  /** Array of items in the current page */
  data: T[];
  /** Cursor for the next page, if available */
  nextCursor?: string;
  /** Whether there are more pages available */
  hasMore: boolean;
}

/**
 * Options for paginated requests.
 */
export interface PaginationOptions {
  /** Maximum number of items to fetch per request (default: 20) */
  count?: number;
  /** Cursor for pagination */
  cursor?: string;
}

/**
 * Options for async iteration.
 */
export interface IteratorOptions extends PaginationOptions {
  /** Maximum total number of items to fetch (default: unlimited) */
  maxItems?: number;
}

/**
 * Page result returned by fetchPage callbacks passed to paginate().
 */
export interface PageResult<T> {
  response: PaginatedResponse<T>;
  rateLimit?: RateLimit;
}

/**
 * Create a paginated response from API response data.
 */
export function createPaginatedResponse<T>(
  data: T[],
  cursor?: string
): PaginatedResponse<T> {
  return {
    data,
    nextCursor: cursor,
    hasMore: !!cursor,
  };
}

const RATE_LIMIT_WARN_THRESHOLD = 0.2;

/**
 * Async generator for paginating through API results.
 *
 * Automatically throttles when fewer than 20% of rate limit requests remain,
 * spreading requests across the remaining reset window.
 *
 * @param fetchPage - Function to fetch a single page; returns response + optional rate limit info
 * @param options - Pagination options
 * @yields Individual items from each page
 *
 * @example
 * ```typescript
 * // Iterate through all results
 * for await (const tweet of client.twitter.tweets.searchAll("query")) {
 *   console.log(tweet.text);
 * }
 *
 * // With max items limit
 * for await (const tweet of client.twitter.tweets.searchAll("query", { maxItems: 100 })) {
 *   console.log(tweet.text);
 * }
 * ```
 */
export async function* paginate<T>(
  fetchPage: (cursor?: string) => Promise<PageResult<T>>,
  options: IteratorOptions = {}
): AsyncGenerator<T, void, undefined> {
  const { maxItems } = options;
  let cursor: string | undefined;
  let totalYielded = 0;

  do {
    const { response, rateLimit } = await fetchPage(cursor);

    // Throttle pagination when approaching rate limit
    if (rateLimit) {
      const { limit, remaining, reset } = rateLimit;
      if (limit > 0 && remaining / limit < RATE_LIMIT_WARN_THRESHOLD) {
        const nowSec = Date.now() / 1000;
        const windowRemainingSec = Math.max(reset - nowSec, 1);
        const delayMs = remaining > 0 ? (windowRemainingSec / remaining) * 1000 : windowRemainingSec * 1000;
        const resetInSec = Math.round(windowRemainingSec);
        console.warn(
          `\x1b[33m⚠ ScrapeBadger: Rate limit: ${remaining}/${limit} remaining (resets in ${resetInSec}s), throttling pagination\x1b[0m`
        );
        await sleep(delayMs);
      }
    }

    for (const item of response.data) {
      yield item;
      totalYielded++;

      if (maxItems !== undefined && totalYielded >= maxItems) {
        return;
      }
    }

    cursor = response.nextCursor;
  } while (cursor);
}

/**
 * Collect all items from an async generator into an array.
 *
 * @param generator - Async generator to collect from
 * @returns Array of all yielded items
 *
 * @example
 * ```typescript
 * const tweets = await collectAll(client.twitter.tweets.searchAll("query", { maxItems: 100 }));
 * console.log(`Fetched ${tweets.length} tweets`);
 * ```
 */
export async function collectAll<T>(generator: AsyncGenerator<T, void, undefined>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of generator) {
    items.push(item);
  }
  return items;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
