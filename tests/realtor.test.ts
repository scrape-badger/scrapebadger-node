/**
 * Tests for the Realtor API client.
 *
 * Uses vitest and a fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { RealtorClient } from "../src/realtor/client.js";
import type {
  RealtorSearchResponse,
  RealtorPropertyDetail,
  RealtorAutocompleteResponse,
  RealtorMarketsResponse,
} from "../src/realtor/index.js";

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown, status = 200): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

function capturedUrl(): string {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return (mock.mock.calls[0] as [string, RequestInit])[0];
}

describe("RealtorClient", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("is wired onto the top-level client", () => {
    expect(makeClient().realtor).toBeInstanceOf(RealtorClient);
  });

  it("search() routes to /v1/realtor/search with params", async () => {
    mockFetch({ market: "us", results: [{ property_id: "1", list_price: 500000 }] });
    const res: RealtorSearchResponse = await makeClient().realtor.search.search("Austin, TX", {
      market: "us",
      bedsMin: 3,
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/realtor/search");
    expect(url).toContain("location=Austin");
    expect(res.market).toBe("us");
  });

  it("autocomplete() routes to /v1/realtor/autocomplete", async () => {
    mockFetch({ market: "ca", query: "toronto", suggestions: [] });
    const res: RealtorAutocompleteResponse = await makeClient().realtor.search.autocomplete(
      "toronto",
      { market: "ca" }
    );
    expect(capturedUrl()).toContain("/v1/realtor/autocomplete");
    expect(res.query).toBe("toronto");
  });

  it("getProperty() routes to /v1/realtor/properties/{id}", async () => {
    mockFetch({ property_id: "42" });
    const res: RealtorPropertyDetail = await makeClient().realtor.properties.getProperty("42", {
      market: "us",
    });
    expect(capturedUrl()).toContain("/v1/realtor/properties/42");
    expect(res.property_id).toBe("42");
  });

  it("listMarkets() routes to /v1/realtor/markets", async () => {
    mockFetch({ markets: [] });
    const res: RealtorMarketsResponse = await makeClient().realtor.reference.listMarkets();
    expect(capturedUrl()).toContain("/v1/realtor/markets");
    expect(res.markets).toEqual([]);
  });
});
