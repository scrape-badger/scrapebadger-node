import { afterEach, expect, it, vi } from "vitest";
import { ScrapeBadger } from "../src/client.js";

afterEach(() => vi.unstubAllGlobals());

it.each(["search", "light"] as const)("%s forwards deferred links", async (method) => {
  const fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ organic_results: [] }), {
      headers: { "Content-Type": "application/json" },
    })
  );
  vi.stubGlobal("fetch", fetch);
  const client = new ScrapeBadger({ apiKey: "test-key", maxRetries: 0 });
  await client.google.search[method]({ q: "cats", defer_links: true });
  const url = new URL(String(fetch.mock.calls[0][0]));
  expect(url.searchParams.get("defer_links")).toBe("true");
  expect(url.pathname).toBe(method === "light" ? "/v1/google/light/search" : "/v1/google/search");
});
