/**
 * Google Scraper API aggregator — exposes all 16 Google product sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { AiModeClient } from "./ai-mode.js";
import { AutocompleteClient } from "./autocomplete.js";
import { FinanceClient } from "./finance.js";
import { FlightsClient } from "./flights.js";
import { HotelsClient } from "./hotels.js";
import { ImagesClient } from "./images.js";
import { JobsClient } from "./jobs.js";
import { LensClient } from "./lens.js";
import { MapsClient } from "./maps.js";
import { NewsClient } from "./news.js";
import { PatentsClient } from "./patents.js";
import { ProductsClient } from "./products.js";
import { ScholarClient } from "./scholar.js";
import { SearchClient } from "./search.js";
import { ShoppingClient } from "./shopping.js";
import { ShortsClient } from "./shorts.js";
import { TrendsClient } from "./trends.js";
import { VideosClient } from "./videos.js";

/**
 * Google Scraper API client with access to all 19 Google product APIs.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const serp = await client.google.search.search({ q: "python 3.13" });
 * const places = await client.google.maps.search({ q: "coffee shops sf" });
 * const products = await client.google.shopping.search({ q: "laptop" });
 *
 * // Per-product merchant URL enrichment
 * const enriched = await client.google.shopping.click({
 *   title: (products.results as any[])[0].title,
 *   source: (products.results as any[])[0].source,
 * });
 * console.log(enriched.merchant_url);
 *
 * // New in v0.3: Shorts, Flights, and Scholar depth
 * const shorts = await client.google.shorts.search({ q: "cooking hacks" });
 * const flights = await client.google.flights.search({
 *   departure_id: "JFK",
 *   arrival_id: "LHR",
 *   outbound_date: "2026-06-15",
 *   return_date: "2026-06-22",
 * });
 * const profiles = await client.google.scholar.profiles({
 *   mauthors: "Geoffrey Hinton",
 * });
 * ```
 */
export class GoogleClient {
  /** Google Web Search (SERP) — with optional deferred AI Overview follow-up. */
  readonly search: SearchClient;
  /** Google Maps — places, reviews, photos, posts. */
  readonly maps: MapsClient;
  /** Google News — articles, topics, trending. */
  readonly news: NewsClient;
  /** Google Hotels — search and property details. */
  readonly hotels: HotelsClient;
  /** Google Trends — interest, regions, related, trending, topic autocomplete. */
  readonly trends: TrendsClient;
  /** Google Jobs. */
  readonly jobs: JobsClient;
  /** Google Shopping — search, details, click enrichment. */
  readonly shopping: ShoppingClient;
  /** Google Patents — search and document details. */
  readonly patents: PatentsClient;
  /** Google Scholar — search, profiles, author, author citation, cite formats. */
  readonly scholar: ScholarClient;
  /** Google Autocomplete — search suggestions. */
  readonly autocomplete: AutocompleteClient;
  /** Google Images. */
  readonly images: ImagesClient;
  /** Google Videos. */
  readonly videos: VideosClient;
  /** Google Finance — stock and index quotes. */
  readonly finance: FinanceClient;
  /** Google AI Mode — generative answer responses. */
  readonly aiMode: AiModeClient;
  /** Google Lens — visual image search. */
  readonly lens: LensClient;
  /** Google Shorts — short-form vertical video results (udm=39). */
  readonly shorts: ShortsClient;
  /** Google Flights — one-way, round-trip, and multi-city itineraries. */
  readonly flights: FlightsClient;
  /** Google Products — immersive product detail. */
  readonly products: ProductsClient;

  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.maps = new MapsClient(client);
    this.news = new NewsClient(client);
    this.hotels = new HotelsClient(client);
    this.trends = new TrendsClient(client);
    this.jobs = new JobsClient(client);
    this.shopping = new ShoppingClient(client);
    this.patents = new PatentsClient(client);
    this.scholar = new ScholarClient(client);
    this.autocomplete = new AutocompleteClient(client);
    this.images = new ImagesClient(client);
    this.videos = new VideosClient(client);
    this.finance = new FinanceClient(client);
    this.aiMode = new AiModeClient(client);
    this.lens = new LensClient(client);
    this.shorts = new ShortsClient(client);
    this.flights = new FlightsClient(client);
    this.products = new ProductsClient(client);
  }
}
