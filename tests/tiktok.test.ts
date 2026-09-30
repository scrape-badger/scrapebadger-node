import { describe, it, expect, vi, afterEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";

afterEach(() => vi.unstubAllGlobals());
function client() {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok:true,status:200,
    headers:{get:()=>"application/json"},json:async()=>({}),text:async()=>"{}"}));
  return new ScrapeBadger({apiKey:"test-key",maxRetries:0});
}
describe("TikTok guest continuations", () => {
  it.each(["followers", "following", "liked", "reposts"] as const)("forwards %s cursor", async (method) => {
    await client().tiktok.users[method]("tiktok", {cursor:"tw1_test"});
    const url = new URL(String(vi.mocked(fetch).mock.calls[0][0]));
    expect(url.pathname).toBe(`/v1/tiktok/users/tiktok/${method}`);
    expect(url.searchParams.get("cursor")).toBe("tw1_test");
  });
  it("omits historical window by default", async () => {
    await client().tiktok.trending.songs();
    const url = new URL(String(vi.mocked(fetch).mock.calls[0][0]));
    expect(url.searchParams.has("period")).toBe(false);
  });
});
