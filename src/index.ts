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
  ConflictError,
  WebSocketStreamError,
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

// Re-export Web module
export * from "./web/index.js";

// Re-export Vinted module
export * from "./vinted/index.js";

// Re-export Google module — GoogleClient is exposed directly; sub-clients
// are aliased with a Google* prefix to avoid collisions with other modules
// (e.g. Twitter also has a TrendsClient).
export {
  GoogleClient,
  SearchClient as GoogleSearchClient,
  MapsClient as GoogleMapsClient,
  NewsClient as GoogleNewsClient,
  HotelsClient as GoogleHotelsClient,
  TrendsClient as GoogleTrendsClient,
  JobsClient as GoogleJobsClient,
  ShoppingClient as GoogleShoppingClient,
  PatentsClient as GooglePatentsClient,
  ScholarClient as GoogleScholarClient,
  AutocompleteClient as GoogleAutocompleteClient,
  ImagesClient as GoogleImagesClient,
  VideosClient as GoogleVideosClient,
  FinanceClient as GoogleFinanceClient,
  AiModeClient as GoogleAiModeClient,
  LensClient as GoogleLensClient,
  ShortsClient as GoogleShortsClient,
  FlightsClient as GoogleFlightsClient,
  ProductsClient as GoogleProductsClient,
} from "./google/index.js";
export type {
  AiModeSearchParams,
  AutocompleteParams,
  FinanceQuoteParams,
  FlightsSearchParams,
  FlightsStopsFilter,
  FlightsTravelClass,
  FlightsTripType,
  GoogleResponse,
  GoogleSearchParams,
  HotelsDetailsParams,
  HotelsSearchParams,
  ImagesSearchParams,
  JobsSearchParams,
  LensSearchParams,
  MapsPhotosParams,
  MapsPlaceParams,
  MapsPostsParams,
  MapsReviewsParams,
  MapsSearchParams,
  NewsSearchParams,
  NewsTopicsParams,
  NewsTrendingParams,
  PatentsDetailParams,
  PatentsSearchParams,
  ProductsDetailParams,
  ScholarAuthorCitationParams,
  ScholarAuthorParams,
  ScholarCiteParams,
  ScholarProfilesParams,
  ScholarSearchParams,
  ShoppingClickParams,
  ShoppingProductParams,
  ShoppingSearchParams,
  ShortsSearchParams,
  TrendsAutocompleteParams,
  TrendsInterestParams,
  TrendsRegionsParams,
  TrendsRelatedParams,
  TrendsTrendingParams,
  VideosSearchParams,
} from "./google/index.js";
