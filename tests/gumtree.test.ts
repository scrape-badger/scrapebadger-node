/**
 * Tests for the Gumtree API client.
 *
 * Asserts URL + query-param wiring for all 8 endpoints, and that real API
 * responses (tests/fixtures/gumtree_samples.json) come back through the client
 * untouched. The fixtures are assigned to the response interfaces, so a
 * type-checked read of this file flags any interface field the API lacks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  GumtreeAutocompleteResponse,
  GumtreeFiltersResponse,
  GumtreeListingDetail,
  GumtreeLocationAutocompleteResponse,
  GumtreeSearchResponse,
  GumtreeSellerListingsResponse,
  GumtreeTreeResponse,
} from "../src/index.js";
import samples from "./fixtures/gumtree_samples.json";

const SEARCH: GumtreeSearchResponse = samples["GET /v1/gumtree/search?category=cars"];
const LISTING: GumtreeListingDetail = samples["GET /v1/gumtree/listings/1803293391"];
const FILTERS: GumtreeFiltersResponse = samples["GET /v1/gumtree/search/filters?category=cars"];
const SELLER_LISTINGS: GumtreeSellerListingsResponse =
  samples["GET /v1/gumtree/listings/1803293391/seller-listings"];
const AUTOCOMPLETE: GumtreeAutocompleteResponse =
  samples["GET /v1/gumtree/autocomplete?query=sofa"];
const LOCATION_AUTOCOMPLETE: GumtreeLocationAutocompleteResponse =
  samples["GET /v1/gumtree/locations/autocomplete?query=leed"];
const CATEGORIES: GumtreeTreeResponse = samples["GET /v1/gumtree/categories?parent_id=2551"];
const LOCATIONS: GumtreeTreeResponse = samples["GET /v1/gumtree/locations?parent_id=10000393"];

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown = {}): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

function requestedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return new URL(mock.mock.calls[0]?.[0] as string);
}

describe("GumtreeClient", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("is wired onto the main client", () => {
    const client = makeClient();
    expect(client.gumtree).toBeDefined();
    expect(typeof client.gumtree.getListing).toBe("function");
  });

  it("search with no params sends nothing but lets the server defaults apply", async () => {
    mockFetch(SEARCH);
    const result = await makeClient().gumtree.search();
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/search");
    expect([...url.searchParams.keys()]).toEqual([]);
    expect(result).toEqual(SEARCH);
    expect(result.listings[0]?.currency).toBe("GBP");
  });

  it("search forwards every param under its API name", async () => {
    mockFetch(SEARCH);
    await makeClient().gumtree.search({
      query: "bmw 3 series",
      category: "cars",
      location: "SW1A 1AA",
      distance: 25,
      min_price: 1000,
      max_price: 9000,
      sort: "price_asc",
      seller_type: "private",
      urgent_only: true,
      with_photos: true,
      filters: "vehicle_make:bmw,vehicle_fuel_type:petrol",
      page: 3,
    });
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/search");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      query: "bmw 3 series",
      category: "cars",
      location: "SW1A 1AA",
      distance: "25",
      min_price: "1000",
      max_price: "9000",
      sort: "price_asc",
      seller_type: "private",
      urgent_only: "true",
      with_photos: "true",
      filters: "vehicle_make:bmw,vehicle_fuel_type:petrol",
      page: "3",
    });
  });

  it("searchFilters forwards category, location and query", async () => {
    mockFetch(FILTERS);
    const result = await makeClient().gumtree.searchFilters({
      category: "cars",
      location: "leeds",
      query: "diesel",
    });
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/search/filters");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      category: "cars",
      location: "leeds",
      query: "diesel",
    });
    expect(result.filters[0]?.key).toBe("vehicle_make");
  });

  it("getListing puts the listing id in the path", async () => {
    mockFetch(LISTING);
    const result = await makeClient().gumtree.getListing("1803293391");
    expect(requestedUrl().pathname).toBe("/v1/gumtree/listings/1803293391");
    expect(result).toEqual(LISTING);
    expect(result.seller?.verification?.status).toBe("VERIFIED");
    expect(result.seller?.rating?.breakdown["5"]).toBe(0);
  });

  it("getSellerListings sends the page", async () => {
    mockFetch(SELLER_LISTINGS);
    const result = await makeClient().gumtree.getSellerListings("1803293391", 2);
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/listings/1803293391/seller-listings");
    expect(url.searchParams.get("page")).toBe("2");
    expect(result).toEqual(SELLER_LISTINGS);
  });

  it("autocomplete and locationAutocomplete send the query", async () => {
    mockFetch(AUTOCOMPLETE);
    expect(await makeClient().gumtree.autocomplete("sofa")).toEqual(AUTOCOMPLETE);
    let url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/autocomplete");
    expect(url.searchParams.get("query")).toBe("sofa");

    vi.unstubAllGlobals();
    mockFetch(LOCATION_AUTOCOMPLETE);
    expect(await makeClient().gumtree.locationAutocomplete("leed")).toEqual(LOCATION_AUTOCOMPLETE);
    url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/locations/autocomplete");
    expect(url.searchParams.get("query")).toBe("leed");
  });

  it("listLocations and listCategories send parent_id only when given", async () => {
    mockFetch(LOCATIONS);
    expect(await makeClient().gumtree.listLocations(10000393)).toEqual(LOCATIONS);
    let url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/locations");
    expect(url.searchParams.get("parent_id")).toBe("10000393");

    vi.unstubAllGlobals();
    mockFetch(CATEGORIES);
    expect(await makeClient().gumtree.listCategories()).toEqual(CATEGORIES);
    url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/categories");
    expect(url.searchParams.has("parent_id")).toBe(false);
  });
});
