import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrapeBadger } from "../src/client.js";

afterEach(() => vi.unstubAllGlobals());

describe("Reddit search wire contract", () => {
  it.each(["posts", "subreddits", "users"] as const)(
    "%s sends the API query name and passes the opaque cursor unchanged",
    async (kind) => {
      const fetch = vi.fn(
        async () =>
          new Response(
            JSON.stringify({ [kind]: [], pagination: { after: "rs1.next", count: 0, limit: 4 } }),
            { status: 200, headers: { "content-type": "application/json" } }
          )
      );
      vi.stubGlobal("fetch", fetch);
      const client = new ScrapeBadger({ apiKey: "test-api-key", maxRetries: 0 });
      const response = await client.reddit.search[kind]({
        query: "machine learning & AI",
        after: "rs1.previous",
        limit: 4,
      });
      const url = new URL(String(fetch.mock.calls[0]![0]));
      expect(url.pathname).toBe(`/v1/reddit/search/${kind}`);
      expect(url.searchParams.get("q")).toBe("machine learning & AI");
      expect(url.searchParams.has("query")).toBe(false);
      expect(url.searchParams.get("after")).toBe("rs1.previous");
      expect(response.pagination.after).toBe("rs1.next");
    }
  );

  it("post sort, time filter and scope use the gateway's actual parameter names", async () => {
    const fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ posts: [], pagination: { after: null } }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetch);
    const client = new ScrapeBadger({ apiKey: "test-api-key", maxRetries: 0 });
    await client.reddit.search.posts({
      query: "asyncio",
      subreddit: "python",
      sort: "new",
      time: "week",
    });
    const url = new URL(String(fetch.mock.calls[0]![0]));
    expect(url.searchParams.get("t")).toBe("week");
    expect(url.searchParams.has("time")).toBe(false);
    expect(url.searchParams.get("sort")).toBe("new");
    expect(url.searchParams.get("subreddit")).toBe("python");
  });
});
