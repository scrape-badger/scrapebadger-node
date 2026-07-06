/**
 * Tests for the Zillow API client.
 *
 * Uses vitest and a fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { ZillowClient } from "../src/zillow/client.js";
import type {
  ZillowSearchResponse,
  ZillowPropertyResponse,
  ZillowAgentResponse,
  ZillowAutocompleteResponse,
  ZillowMarketsResponse,
} from "../src/zillow/index.js";

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

describe("ZillowClient", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("is wired onto the top-level client", () => {
    expect(makeClient().zillow).toBeInstanceOf(ZillowClient);
  });

  it("search() routes to /v1/zillow/search with params", async () => {
    mockFetch({ status: "for_sale", results: [{ position: 1, zpid: "1" }] });
    const res: ZillowSearchResponse = await makeClient().zillow.search.search("Austin, TX", {
      bedsMin: 3,
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/zillow/search");
    expect(url).toContain("location=Austin");
    expect(url).toContain("beds_min=3");
    expect(res.status).toBe("for_sale");
  });

  it("autocomplete() routes to /v1/zillow/autocomplete", async () => {
    mockFetch({ query: "miami", results: [] });
    const res: ZillowAutocompleteResponse = await makeClient().zillow.search.autocomplete("miami");
    expect(capturedUrl()).toContain("/v1/zillow/autocomplete");
    expect(res.query).toBe("miami");
  });

  it("getProperty() routes to /v1/zillow/property/{zpid}", async () => {
    mockFetch({ property: { zpid: "42" } });
    const res: ZillowPropertyResponse = await makeClient().zillow.properties.getProperty("42");
    expect(capturedUrl()).toContain("/v1/zillow/property/42");
    expect(res.property.zpid).toBe("42");
  });

  it("getAgent() routes to /v1/zillow/agent with params", async () => {
    mockFetch({ agent: { username: "some-agent" } });
    const res: ZillowAgentResponse = await makeClient().zillow.agent.getAgent({
      username: "some-agent",
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/zillow/agent");
    expect(url).toContain("username=some-agent");
    expect(res.agent.username).toBe("some-agent");
  });

  it("listMarkets() routes to /v1/zillow/markets", async () => {
    mockFetch({ markets: [] });
    const res: ZillowMarketsResponse = await makeClient().zillow.reference.listMarkets();
    expect(capturedUrl()).toContain("/v1/zillow/markets");
    expect(res.markets).toEqual([]);
  });
});
