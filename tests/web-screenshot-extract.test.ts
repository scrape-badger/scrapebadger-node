import { describe, it, expect, vi } from "vitest";
import { WebClient } from "../src/web/client.js";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff]);

function clientResolving(body: unknown) {
  return { request: vi.fn().mockResolvedValue(body) };
}

describe("screenshot", () => {
  const response = {
    success: true,
    url: "https://www.example.com/",
    status_code: 200,
    content_type: "image/png",
    screenshot: Buffer.from(PNG).toString("base64"),
    engine_used: "cloakbrowser",
    credits_used: 6,
    duration_ms: 4210,
  };

  it("sends only the url by default and decodes the PNG", async () => {
    const inner = clientResolving(response);
    const web = new WebClient(inner as any);

    const result = await web.screenshot("https://example.com");

    expect(inner.request).toHaveBeenCalledWith("/v1/web/screenshot", {
      method: "POST",
      body: { url: "https://example.com" },
    });
    expect(Array.from(result.png)).toEqual(Array.from(PNG));
    expect(result.screenshot).toBe(response.screenshot);
    expect(result.credits_used).toBe(6);
  });

  it("maps options to the snake_case request body", async () => {
    const inner = clientResolving(response);
    const web = new WebClient(inner as any);

    await web.screenshot("https://example.com", {
      fullPage: true,
      width: 1280,
      height: 800,
      waitFor: "#main",
      country: "DE",
      proxyTier: "premium",
    });

    expect(inner.request.mock.calls[0]?.[1]).toEqual({
      method: "POST",
      body: {
        url: "https://example.com",
        full_page: true,
        width: 1280,
        height: 800,
        wait_for: "#main",
        country: "DE",
        proxy_tier: "premium",
      },
    });
  });
});

describe("extractData", () => {
  it("posts selector rules to /v1/web/extract", async () => {
    const inner = clientResolving({
      success: true,
      data: { top_story: "Hello", links: ["https://a", "https://b"] },
      ai_extraction: null,
    });
    const web = new WebClient(inner as any);
    const extractRules = {
      top_story: ".titleline a",
      links: { selector: ".titleline a::attr(href)", all: true },
    };

    const result = await web.extractData("https://news.ycombinator.com", { extractRules });

    expect(inner.request).toHaveBeenCalledWith("/v1/web/extract", {
      method: "POST",
      body: { url: "https://news.ycombinator.com", extract_rules: extractRules },
    });
    expect(result.data).toEqual({ top_story: "Hello", links: ["https://a", "https://b"] });
  });

  it("maps AI and fetch options", async () => {
    const inner = clientResolving({ success: true, ai_extraction: { answer: "yes" } });
    const web = new WebClient(inner as any);

    await web.extractData("https://example.com", {
      aiExtractRules: { price: "the product price" },
      aiQuery: "Is it in stock?",
      renderJs: true,
      waitFor: ".price",
      country: "US",
      proxyTier: "ultra",
    });

    expect(inner.request.mock.calls[0]?.[1]).toEqual({
      method: "POST",
      body: {
        url: "https://example.com",
        ai_extract_rules: { price: "the product price" },
        ai_query: "Is it in stock?",
        render_js: true,
        wait_for: ".price",
        country: "US",
        proxy_tier: "ultra",
      },
    });
  });

  it("throws before any request when nothing is asked for", async () => {
    const inner = clientResolving({});
    const web = new WebClient(inner as any);

    await expect(web.extractData("https://example.com", {})).rejects.toThrow(/at least one of/);
    expect(inner.request).not.toHaveBeenCalled();
  });
});

describe("scrape viewport options", () => {
  it("maps screenshotFullPage, windowWidth and windowHeight", async () => {
    const inner = clientResolving({ success: true });
    const web = new WebClient(inner as any);

    await web.scrape("https://example.com", {
      screenshot: true,
      screenshotFullPage: true,
      windowWidth: 1280,
      windowHeight: 720,
    });

    expect(inner.request.mock.calls[0]?.[1]).toEqual({
      method: "POST",
      body: {
        url: "https://example.com",
        screenshot: true,
        screenshot_full_page: true,
        window_width: 1280,
        window_height: 720,
      },
    });
  });
});

describe("batch (deprecated)", () => {
  it("warns that batch is gone, and still calls through", async () => {
    const inner = clientResolving({});
    const web = new WebClient(inner as any);
    const warn = vi.spyOn(process, "emitWarning").mockImplementation(() => {});

    await web.submitBatchScrapingJob({ urls: ["https://x.com"] });
    await web.getBatchJobStatus("job-1");

    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0]?.[0]).toMatch(/concurrent scrape\(\)/);
    expect(warn.mock.calls[0]?.[1]).toBe("DeprecationWarning");
    expect(inner.request).toHaveBeenLastCalledWith("/v1/web/batch/job-1", { params: {} });
    warn.mockRestore();
  });
});
