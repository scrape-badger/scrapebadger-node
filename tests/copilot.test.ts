/**
 * Tests for the Copilot API client: strictCountry maps to strict_country
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

describe("CopilotClient", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("omits strict_country by default", async () => {
    await makeClient().copilot.askCopilotAQuestion({ prompt: "q", country: "JP" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/copilot/ask");
    expect(url.searchParams.get("country")).toBe("JP");
    expect(url.searchParams.has("strict_country")).toBe(false);
  });

  it("sends market and strict_country=true on ask", async () => {
    await makeClient().copilot.askCopilotAQuestion({
      prompt: "q",
      country: "JP",
      market: "ja-JP",
      strictCountry: true,
    });
    const url = capturedUrl();
    expect(url.searchParams.get("market")).toBe("ja-JP");
    expect(url.searchParams.get("strict_country")).toBe("true");
    expect(url.searchParams.has("strictCountry")).toBe(false);
  });

  it("sends strict_country=true on brand visibility", async () => {
    await makeClient().copilot.measureABrandSVisibilityInACopilotAnswer({
      prompt: "q",
      brand: "freee",
      country: "JP",
      strictCountry: true,
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/copilot/brand-visibility");
    expect(url.searchParams.get("strict_country")).toBe("true");
  });

  it("lists markets", async () => {
    await makeClient().copilot.listCopilotMarkets();
    expect(capturedUrl().pathname).toBe("/v1/copilot/markets");
  });
});
