/**
 * noCache sends `Cache-Control: no-cache`, which makes the API skip its
 * 60-second duplicate-request cache. Off by default; withOptions sets it for
 * one call without touching the parent client. (SCR-396)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type { ScrapeBadgerConfig } from "../src/internal/config.js";

function makeClient(config: Partial<ScrapeBadgerConfig> = {}): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
    ...config,
  });
}

function mockFetch(): void {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })
        )
      )
  );
}

/** The headers and method of each fetch call, in order. */
function calls(): Array<{ url: URL; method: string; headers: Record<string, string> }> {
  return vi.mocked(fetch).mock.calls.map(([url, init]) => ({
    url: new URL(url as string),
    method: (init?.method ?? "GET") as string,
    headers: (init?.headers ?? {}) as Record<string, string>,
  }));
}

describe("noCache", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("sends no Cache-Control header by default", async () => {
    await makeClient().perplexity.askPerplexityAQuestionPost({ prompt: "q" });
    const [call] = calls();
    expect(call.method).toBe("POST");
    expect(call.headers).not.toHaveProperty("Cache-Control");
  });

  it("sends Cache-Control: no-cache on a POST when enabled", async () => {
    await makeClient({ noCache: true }).perplexity.askPerplexityAQuestionPost({ prompt: "q" });
    const [call] = calls();
    expect(call.url.pathname).toBe("/v1/perplexity/ask");
    expect(call.method).toBe("POST");
    expect(call.headers["Cache-Control"]).toBe("no-cache");
    expect(call.headers["X-API-Key"]).toBe("test-api-key");
  });

  it("sends Cache-Control: no-cache on a GET when enabled", async () => {
    await makeClient({ noCache: true }).yelp.listMarkets();
    const [call] = calls();
    expect(call.method).toBe("GET");
    expect(call.headers["Cache-Control"]).toBe("no-cache");
  });

  it("sends it on a raw-content scrape too", async () => {
    await makeClient({ noCache: true }).web.scrape("https://example.com", { rawContent: true });
    const [call] = calls();
    expect(call.url.pathname).toBe("/v1/web/scrape");
    expect(call.headers["Cache-Control"]).toBe("no-cache");
  });

  it("does not add the query parameter or touch the body", async () => {
    await makeClient({ noCache: true }).perplexity.askPerplexityAQuestionPost({ prompt: "q" });
    const [call] = calls();
    expect(call.url.searchParams.has("no_cache")).toBe(false);
    const init = vi.mocked(fetch).mock.calls[0][1];
    expect(JSON.parse(init?.body as string)).toEqual({ prompt: "q" });
  });
});

describe("withOptions", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("bypasses the cache for one call and leaves the parent alone", async () => {
    const client = makeClient();
    const fresh = client.withOptions({ noCache: true });

    expect(fresh).toBeInstanceOf(ScrapeBadger);
    expect(fresh).not.toBe(client);

    await fresh.perplexity.askPerplexityAQuestionPost({ prompt: "q" });
    await client.perplexity.askPerplexityAQuestionPost({ prompt: "q" });
    await fresh.perplexity.askPerplexityAQuestion({ prompt: "q" });

    const [first, second, third] = calls();
    expect(first.headers["Cache-Control"]).toBe("no-cache");
    expect(second.headers).not.toHaveProperty("Cache-Control");
    expect(third.method).toBe("GET");
    expect(third.headers["Cache-Control"]).toBe("no-cache");
  });

  it("can turn noCache back off", async () => {
    const client = makeClient({ noCache: true });
    await client.withOptions({ noCache: false }).yelp.listMarkets();
    await client.yelp.listMarkets();
    const [off, on] = calls();
    expect(off.headers).not.toHaveProperty("Cache-Control");
    expect(on.headers["Cache-Control"]).toBe("no-cache");
  });

  it("keeps the parent's other options and ignores undefined overrides", async () => {
    const client = makeClient({ baseUrl: "https://custom.example", headers: { "X-Team": "a" } });
    await client.withOptions({ noCache: true, baseUrl: undefined }).yelp.listMarkets();
    const [call] = calls();
    expect(call.url.origin).toBe("https://custom.example");
    expect(call.headers["X-API-Key"]).toBe("test-api-key");
    expect(call.headers["X-Team"]).toBe("a");
  });

  it("merges headers with the parent's", async () => {
    const client = makeClient({ headers: { "X-Team": "a" } });
    await client.withOptions({ headers: { "X-Trace": "t1" } }).yelp.listMarkets();
    await client.yelp.listMarkets();
    const [child, parent] = calls();
    expect(child.headers["X-Team"]).toBe("a");
    expect(child.headers["X-Trace"]).toBe("t1");
    expect(parent.headers).not.toHaveProperty("X-Trace");
  });

  it("overrides timeout and maxRetries", async () => {
    vi.unstubAllGlobals();
    // A fresh Response per call: a body can be read only once.
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ detail: "boom" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const client = makeClient({ maxRetries: 0 });
    await expect(
      client.withOptions({ maxRetries: 2, retryDelay: 1, timeout: 5000 }).yelp.listMarkets()
    ).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(3);

    fetchMock.mockClear();
    await expect(client.yelp.listMarkets()).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
