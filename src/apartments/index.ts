/**
 * Apartments.com API module.
 *
 * @module apartments
 */

export { ApartmentsClient } from "./client.js";

export type {
  Unit as ApartmentsUnit,
  FloorPlan as ApartmentsFloorPlan,
  Property as ApartmentsProperty,
  SearchResult as ApartmentsSearchResult,
  SearchResponse as ApartmentsSearchResponse,
  ApartmentsSearchParams,
  ApartmentsPropertyParams,
} from "./types.js";
