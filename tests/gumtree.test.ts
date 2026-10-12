/**
 * Tests for the Gumtree API client.
 *
 * Asserts URL + query-param wiring for all 9 endpoints (incl. `market`
 * pass-through), and that real API responses (tests/fixtures/gumtree_samples.json,
 * uk + au + za) come back through the client untouched. The fixtures are assigned to the response interfaces, so a
 * type-checked read of this file flags any interface field the API lacks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  GumtreeAutocompleteResponse,
  GumtreeFiltersResponse,
  GumtreeListingDetail,
  GumtreeLocationAutocompleteResponse,
  GumtreeMarketsResponse,
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
const MARKETS: GumtreeMarketsResponse = samples["GET /v1/gumtree/markets"];
const ZA_SEARCH: GumtreeSearchResponse =
  samples["GET /v1/gumtree/search?market=za&category=9077&location=3100003"];
const ZA_LISTING: GumtreeListingDetail =
  samples["GET /v1/gumtree/listings/10013681289561010209976109?market=za"];
const AU_SEARCH: GumtreeSearchResponse = samples["GET /v1/gumtree/search?market=au"];
const AU_LISTING: GumtreeListingDetail = samples["GET /v1/gumtree/listings/1339574407?market=au"];
const ZA_LISTING_ID = "10013681289561010209976109";

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
    expect(result.market).toBe("uk");
    expect(result.currency).toBe("GBP");
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

  it("search sends market with au/za numeric ids", async () => {
    mockFetch(ZA_SEARCH);
    const result = await makeClient().gumtree.search({
      market: "za",
      category: "9077",
      location: "3100003",
      filters: "ma:toyota",
    });
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      market: "za",
      category: "9077",
      location: "3100003",
      filters: "ma:toyota",
    });
    expect(result).toEqual(ZA_SEARCH);
    expect(result.market).toBe("za");
    expect(result.currency).toBe("ZAR");
    const car = result.listings[0];
    expect(car?.short_id).toBe("1368127981");
    expect(car?.price_type).toBe("FIXED");
    expect(car?.seller_name).toBe("Kevin Noel Ngandu");
    expect(result.listings[1]?.price_type).toBe("MAKE_OFFER");
  });

  it("au search responses carry facet ids and seller names", async () => {
    mockFetch(AU_SEARCH);
    const result = await makeClient().gumtree.search({ market: "au" });
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({ market: "au" });
    expect(result.currency).toBe("AUD");
    expect(result.listings[0]?.seller_name).toBe("Canning Vale Toyota");
    expect(result.category_facets[0]).toEqual({
      id: 9299,
      name: "Cars & Vehicles",
      slug: null,
      count: 450286,
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

  it("searchFilters forwards already-applied filters and market", async () => {
    mockFetch(FILTERS);
    await makeClient().gumtree.searchFilters({
      category: "9077",
      filters: "ma:toyota",
      market: "za",
    });
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      category: "9077",
      filters: "ma:toyota",
      market: "za",
    });
  });

  it("getListing puts the listing id in the path", async () => {
    mockFetch(LISTING);
    const result = await makeClient().gumtree.getListing("1803293391");
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/listings/1803293391");
    expect(url.searchParams.has("market")).toBe(false);
    expect(result).toEqual(LISTING);
    expect(result.seller?.verification?.status).toBe("VERIFIED");
    expect(result.seller?.rating?.breakdown["5"]).toBe(0);
  });

  it("getListing sends market and parses the za/au detail fields", async () => {
    mockFetch(ZA_LISTING);
    const za = await makeClient().gumtree.getListing(ZA_LISTING_ID, { market: "za" });
    const url = requestedUrl();
    expect(url.pathname).toBe(`/v1/gumtree/listings/${ZA_LISTING_ID}`);
    expect(url.searchParams.get("market")).toBe("za");
    expect(za).toEqual(ZA_LISTING);
    expect([za.market, za.price_type, za.status, za.view_count]).toEqual([
      "za",
      "FIXED",
      "ACTIVE",
      65,
    ]);
    expect(za.seller?.lifetime_listings).toBe(3100);
    expect(za.seller?.total_views).toBe(263430);

    vi.unstubAllGlobals();
    mockFetch(AU_LISTING);
    const au = await makeClient().gumtree.getListing("1339574407", { market: "au" });
    expect(requestedUrl().searchParams.get("market")).toBe("au");
    expect([au.currency, au.view_count, au.reply_count]).toEqual(["AUD", 88, 0]);
    expect(au.seller?.member_since_year).toBe(2025);
    expect(au.seller?.last_active_text).toBe("yesterday");
  });

  it("getSellerListings sends the page", async () => {
    mockFetch(SELLER_LISTINGS);
    const result = await makeClient().gumtree.getSellerListings("1803293391", 2);
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/listings/1803293391/seller-listings");
    expect(url.searchParams.get("page")).toBe("2");
    expect(result).toEqual(SELLER_LISTINGS);
  });

  it("getSellerListings takes { page, market } too", async () => {
    mockFetch(SELLER_LISTINGS);
    await makeClient().gumtree.getSellerListings(ZA_LISTING_ID, { page: 3, market: "za" });
    const url = requestedUrl();
    expect(url.pathname).toBe(`/v1/gumtree/listings/${ZA_LISTING_ID}/seller-listings`);
    expect(Object.fromEntries(url.searchParams)).toEqual({ page: "3", market: "za" });
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
    expect(url.searchParams.has("market")).toBe(false);
  });

  it("autocomplete and locationAutocomplete send market", async () => {
    mockFetch(AUTOCOMPLETE);
    await makeClient().gumtree.autocomplete("bik", { market: "au" });
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({ query: "bik", market: "au" });

    vi.unstubAllGlobals();
    mockFetch(LOCATION_AUTOCOMPLETE);
    await makeClient().gumtree.locationAutocomplete("pret", { market: "za" });
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      query: "pret",
      market: "za",
    });
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

  it("listLocations and listCategories take { parent_id, market }", async () => {
    mockFetch(LOCATIONS);
    await makeClient().gumtree.listLocations({ market: "au" });
    let url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/locations");
    expect(Object.fromEntries(url.searchParams)).toEqual({ market: "au" });

    vi.unstubAllGlobals();
    mockFetch(CATEGORIES);
    await makeClient().gumtree.listCategories({ parent_id: 9299, market: "au" });
    url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/categories");
    expect(Object.fromEntries(url.searchParams)).toEqual({ parent_id: "9299", market: "au" });
  });

  it("listMarkets returns every market", async () => {
    mockFetch(MARKETS);
    const result = await makeClient().gumtree.listMarkets();
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/gumtree/markets");
    expect([...url.searchParams.keys()]).toEqual([]);
    expect(result).toEqual(MARKETS);
    expect(result.markets.map((m) => m.market)).toEqual(["uk", "au", "za"]);
    expect(result.markets[2]).toMatchObject({
      domain: "www.gumtree.co.za",
      currency: "ZAR",
      distance_unit: null,
      page_size: 20,
    });
  });
});
