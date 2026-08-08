/**
 * Tests for the Baidu API client.
 *
 * The only non-trivial logic in this module is URL + query-param wiring
 * (including the camelCase → snake_case rename of timeFrom / timeTo), so that
 * is what is asserted: every endpoint's path and the params each forwards.
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

describe("BaiduClient", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("is wired onto the main client with every endpoint", () => {
    const client = makeClient();
    expect(client.baidu.search).toBeDefined();
    expect(client.baidu.news).toBeDefined();
    expect(client.baidu.images).toBeDefined();
    expect(client.baidu.autocomplete).toBeDefined();
  });

  it("search sends only the query when no options are given", async () => {
    await makeClient().baidu.search("咖啡机");

    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/baidu/search");
    expect(url.searchParams.get("query")).toBe("咖啡机");
    expect(url.searchParams.get("page")).toBeNull();
    expect(url.searchParams.get("num")).toBeNull();
    expect(url.searchParams.get("language")).toBeNull();
  });

  it("search forwards page, num, language and the date window as snake_case", async () => {
    await makeClient().baidu.search("咖啡机", {
      page: 3,
      num: 50,
      language: "zh-tw",
      timeFrom: 1754000000,
      timeTo: 1754400000,
    });

    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/baidu/search");
    expect(url.searchParams.get("page")).toBe("3");
    expect(url.searchParams.get("num")).toBe("50");
    expect(url.searchParams.get("language")).toBe("zh-tw");
    expect(url.searchParams.get("time_from")).toBe("1754000000");
    expect(url.searchParams.get("time_to")).toBe("1754400000");
  });

  it("news forwards page and sort", async () => {
    await makeClient().baidu.news("人工智能", { page: 2, sort: "time" });

    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/baidu/news");
    expect(url.searchParams.get("query")).toBe("人工智能");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("sort")).toBe("time");
  });

  it("images forwards page", async () => {
    await makeClient().baidu.images("猫", { page: 2 });

    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/baidu/images");
    expect(url.searchParams.get("query")).toBe("猫");
    expect(url.searchParams.get("page")).toBe("2");
  });

  it("autocomplete sends the partial term", async () => {
    await makeClient().baidu.autocomplete("咖啡");

    const url = requestedUrl();
    expect(url.pathname).toBe("/v1/baidu/autocomplete");
    expect(url.searchParams.get("query")).toBe("咖啡");
  });

  it("returns the response body unchanged, real URL and tracking URL apart", async () => {
    mockFetch({
      query: "咖啡机",
      page: 1,
      num: 10,
      total_results: 4820000,
      results: [
        {
          position: 1,
          title: "专业咖啡机价格 - 阿里巴巴",
          url: "https://www.1688.com/jiage/-D7A8D2B5BFA7B7C8BBFA.html",
          baidu_url: "http://www.baidu.com/link?url=m4_ZyR",
          date: "2026年7月27日",
          date_at: "2026-07-27",
          tpl: "www_index",
        },
      ],
      related_searches: [{ query: "咖啡机厂家", url: "https://www.baidu.com/s?wd=x" }],
      url: "https://www.baidu.com/s?wd=%E5%92%96%E5%95%A1%E6%9C%BA&ie=utf-8",
    });

    const result = await makeClient().baidu.search("咖啡机");

    expect(result.total_results).toBe(4820000);
    expect(result.results[0].url).not.toContain("baidu.com");
    expect(result.results[0].baidu_url).toContain("baidu.com/link?url=");
    expect(result.results[0].date_at).toBe("2026-07-27");
    expect(result.related_searches[0].query).toBe("咖啡机厂家");
  });
});
