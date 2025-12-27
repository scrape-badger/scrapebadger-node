/**
 * Pagination utilities for the ScrapeBadger SDK.
 */

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

/**
 * Async generator for paginating through API results.
 *
 * @param fetchPage - Function to fetch a single page
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
  fetchPage: (cursor?: string) => Promise<PaginatedResponse<T>>,
  options: IteratorOptions = {}
): AsyncGenerator<T, void, undefined> {
  const { maxItems } = options;
  let cursor: string | undefined;
  let totalYielded = 0;

  do {
    const response = await fetchPage(cursor);

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
