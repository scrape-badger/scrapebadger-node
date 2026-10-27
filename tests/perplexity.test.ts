/**
 * Tests for the Perplexity API client: strictCountry maps to strict_country
 * and is sent only when true.
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
