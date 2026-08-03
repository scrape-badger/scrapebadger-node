import { describe, it, expect, vi } from "vitest";
import { WebClient } from "../src/web/client.js";

/**
 * `rawContent: true` makes the server answer with the body itself rather than a
 * JSON envelope. The shared response handler funnels a non-JSON response into
 * `{ detail: await response.text() }` — which lost the result, and for a binary
 * payload actively corrupted it, because `text()` decodes bytes as UTF-8.
 */

function clientReturning(bytes: Uint8Array, headers: Record<string, string>) {
  return {
    postBinary: vi.fn().mockResolvedValue({
      bytes,
      headers: new Headers(headers),
      status: 200,
    }),
    request: vi.fn(),
  };
}

describe("scrape with rawContent", () => {
  it("returns binary bytes undecoded", async () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0xfe]);
    const inner = clientReturning(png, {
      "content-type": "image/png",
      "x-scrape-status-code": "200",
      "x-credits-used": "2",
      "x-scrape-engine": "httpcloak",
    });
    const web = new WebClient(inner as any);

    const result = await web.scrape("https://x.com/a.png", { rawContent: true });

    expect(result.content_bytes).toEqual(png);
    expect(result.content).toBeNull();
    expect(result.is_binary).toBe(true);
    expect(result.content_type).toBe("image/png");
    expect(result.credits_used).toBe(2);
    expect(inner.request).not.toHaveBeenCalled();
  });

  it("decodes a text body", async () => {
    const html = new TextEncoder().encode("<html>hi</html>");
    const inner = clientReturning(html, {
      "content-type": "text/html; charset=utf-8",
      "x-scrape-status-code": "200",
    });
    const web = new WebClient(inner as any);

    const result = await web.scrape("https://x.com", { rawContent: true });

    expect(result.content).toBe("<html>hi</html>");
    expect(result.is_binary).toBe(false);
  });

  it("uses the JSON path when rawContent is not set", async () => {
    const inner = clientReturning(new Uint8Array(), {});
    inner.request.mockResolvedValue({ success: true, content: "<html/>" });
    const web = new WebClient(inner as any);

    const result = await web.scrape("https://x.com");

    expect(result.content).toBe("<html/>");
    expect(inner.postBinary).not.toHaveBeenCalled();
  });
});
