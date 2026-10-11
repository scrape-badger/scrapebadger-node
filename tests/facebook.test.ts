/**
 * Tests for the Facebook API client: group feed sort and cursor reach the query.
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

function mockFetch(body: unknown): void {
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

function capturedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return new URL(mock.mock.calls[0][0] as string);
}

describe("facebook.getGroupPosts", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch({ posts: [], count: 0, end_cursor: null, has_next_page: false });
  });

  it("passes sort and the cursor through", async () => {
    await makeClient().facebook.getGroupPosts("rentasenplayadelcarmen", {
      sort: "relevance",
      after: "CUR",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/facebook/groups/rentasenplayadelcarmen/posts");
    expect(url.searchParams.get("sort")).toBe("relevance");
    expect(url.searchParams.get("after")).toBe("CUR");
  });

  it("leaves the newest-first default to the API", async () => {
    await makeClient().facebook.getGroupPosts("123");
    expect(capturedUrl().searchParams.has("sort")).toBe(false);
  });
});
