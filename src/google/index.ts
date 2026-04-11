/**
 * Google Scraper API module exports.
 */

export { GoogleClient } from "./client.js";
export { SearchClient } from "./search.js";
export { MapsClient } from "./maps.js";
export { NewsClient } from "./news.js";
export { HotelsClient } from "./hotels.js";
export { TrendsClient } from "./trends.js";
export { JobsClient } from "./jobs.js";
export { ShoppingClient } from "./shopping.js";
export { PatentsClient } from "./patents.js";
export { ScholarClient } from "./scholar.js";
export { AutocompleteClient } from "./autocomplete.js";
export { ImagesClient } from "./images.js";
export { VideosClient } from "./videos.js";
export { FinanceClient } from "./finance.js";
export { AiModeClient } from "./ai-mode.js";
export { LensClient } from "./lens.js";
export { LocalClient } from "./local.js";
export { ShortsClient } from "./shorts.js";
export { FlightsClient } from "./flights.js";
export { ProductsClient } from "./products.js";

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
  LocalSearchParams,
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
} from "./types.js";
