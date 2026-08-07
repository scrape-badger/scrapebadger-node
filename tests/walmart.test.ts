/**
 * Tests for the Walmart API client.
 *
 * The only non-trivial logic in this module is URL + query-param wiring, so
 * that is what is asserted: every endpoint's path, and the params each one
 * forwards (notably: /category takes no sort, and seller products requires a
 * query term).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";

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
  return new URL(mock.mock.calls[0][0] as string);
}

describe("WalmartClient", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("is wired onto the main client with every sub-client", () => {
    const client = makeClient();
    expect(client.walmart.search).toBeDefined();
    expect(client.walmart.products).toBeDefined();
    expect(client.walmart.sellers).toBeDefined();
    expect(client.walmart.stores).toBeDefined();
    expect(client.walmart.reference).toBeDefined();
  });

  it("search forwards query, page, sort and filters", async () => {
    await makeClient().walmart.search.search("laptop", {
      page: 2,
      sort: "price_low",
      min_price: 100,
      max_price: 500,
      facet: "brand:HP",
    });
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/walmart/search");
    expect(url.searchParams.get("query")).toBe("laptop");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("sort")).toBe("price_low");
    expect(url.searchParams.get("min_price")).toBe("100");
    expect(url.searchParams.get("max_price")).toBe("500");
    expect(url.searchParams.get("facet")).toBe("brand:HP");
  });

  it("category sends path and never a sort (browse ignores it)", async () => {
    await makeClient().walmart.search.category("electronics/3944", { page: 3 });
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/walmart/category");
    expect(url.searchParams.get("path")).toBe("electronics/3944");
    expect(url.searchParams.get("page")).toBe("3");
    expect(url.searchParams.has("sort")).toBe(false);
  });

  it("deals and autocomplete hit their endpoints", async () => {
    await makeClient().walmart.search.deals({ page: 2 });
    expect(requestedUrl().pathname).toBe("/v1/walmart/deals");

    vi.unstubAllGlobals();
    mockFetch();
    await makeClient().walmart.search.autocomplete("lapt");
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/walmart/autocomplete");
    expect(url.searchParams.get("query")).toBe("lapt");
  });

  it("product detail and reviews use the item id in the path", async () => {
    await makeClient().walmart.products.get("5689919121");
    expect(requestedUrl().pathname).toBe("/v1/walmart/products/5689919121");

    vi.unstubAllGlobals();
    mockFetch();
    await makeClient().walmart.products.reviews("5689919121", {
      page: 4,
      sort: "helpful",
    });
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/walmart/products/5689919121/reviews");
    expect(url.searchParams.get("page")).toBe("4");
    expect(url.searchParams.get("sort")).toBe("helpful");
  });

  it("seller products always sends the required query term", async () => {
    await makeClient().walmart.sellers.products("101040442", "headphones");
    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/walmart/sellers/101040442/products");
    expect(url.searchParams.get("query")).toBe("headphones");
  });

  it("seller profile, store and markets hit their endpoints", async () => {
    await makeClient().walmart.sellers.get("101040442");
    expect(requestedUrl().pathname).toBe("/v1/walmart/sellers/101040442");

    vi.unstubAllGlobals();
    mockFetch();
    await makeClient().walmart.stores.get("100");
    expect(requestedUrl().pathname).toBe("/v1/walmart/stores/100");

    vi.unstubAllGlobals();
    mockFetch();
    await makeClient().walmart.reference.markets();
    expect(requestedUrl().pathname).toBe("/v1/walmart/markets");

    vi.unstubAllGlobals();
    mockFetch();
    await makeClient().walmart.reference.health();
    expect(requestedUrl().pathname).toBe("/v1/walmart/health");
  });
});
