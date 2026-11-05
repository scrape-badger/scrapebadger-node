/**
 * Tests for the Perplexity API client: strictCountry maps to strict_country
 * and is sent only when true; location is sent as given, only when set.
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

function mockFetch(): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({}),
      text: () => Promise.resolve("{}"),
    })
  );
}

function capturedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return new URL(mock.mock.calls[0][0] as string);
}

describe("PerplexityClient strictCountry", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("omits strict_country by default", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({ prompt: "q", country: "DE" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/perplexity/ask");
    expect(url.searchParams.get("country")).toBe("DE");
    expect(url.searchParams.has("strict_country")).toBe(false);
    expect(url.searchParams.has("strictCountry")).toBe(false);
  });

  it("sends strict_country=true on ask", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({
      prompt: "q",
      country: "DE",
      strictCountry: true,
    });
    const url = capturedUrl();
    expect(url.searchParams.get("strict_country")).toBe("true");
    expect(url.searchParams.has("strictCountry")).toBe(false);
  });

  it("sends strict_country=true on brand visibility", async () => {
    await makeClient().perplexity.measureABrandSVisibilityInAPerplexityAnswer({
      prompt: "q",
      brand: "Nike",
      country: "JP",
      strictCountry: true,
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/perplexity/brand-visibility");
    expect(url.searchParams.get("strict_country")).toBe("true");
  });

  it("omits strict_country when false", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({ prompt: "q", strictCountry: false });
    expect(capturedUrl().searchParams.has("strict_country")).toBe(false);
  });
});

describe("PerplexityClient location", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("omits location by default", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({ prompt: "q", country: "JP" });
    expect(capturedUrl().searchParams.has("location")).toBe(false);
  });

  it("sends location on ask", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({
      prompt: "best dentist",
      country: "JP",
      strictCountry: true,
      location: "tokyo",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/perplexity/ask");
    expect(url.searchParams.get("location")).toBe("tokyo");
    expect(url.searchParams.get("country")).toBe("JP");
    expect(url.searchParams.get("strict_country")).toBe("true");
  });

  it("sends lat,lng as given", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({
      prompt: "q",
      location: "35.6812,139.7671",
    });
    expect(capturedUrl().searchParams.get("location")).toBe("35.6812,139.7671");
  });

  it("does not rewrite a city name (the API folds it)", async () => {
    await makeClient().perplexity.askPerplexityAQuestion({ prompt: "q", location: "New York" });
    expect(capturedUrl().searchParams.get("location")).toBe("New York");
  });

  it("sends location on brand visibility", async () => {
    await makeClient().perplexity.measureABrandSVisibilityInAPerplexityAnswer({
      prompt: "q",
      brand: "Nike",
      country: "JP",
      location: "osaka",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/perplexity/brand-visibility");
    expect(url.searchParams.get("location")).toBe("osaka");
  });

  it("omits location on brand visibility when unset", async () => {
    await makeClient().perplexity.measureABrandSVisibilityInAPerplexityAnswer({
      prompt: "q",
      brand: "Nike",
    });
    expect(capturedUrl().searchParams.has("location")).toBe(false);
  });
});
