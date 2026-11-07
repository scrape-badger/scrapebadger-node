import { afterEach, expect, it, vi } from "vitest";
import { ScrapeBadger } from "../src/client.js";
afterEach(() => vi.unstubAllGlobals());
it("repository encodes each path segment and preserves the complete payload", async () => {
  const payload = {
    repository: {
      name: "project",
      full_name: "owner/project",
      link: "https://github.com/owner/project",
      owner: { login: "owner" },
      is_empty: false,
      watchers: 0,
    },
    files: [],
    metadata_available: false,
    additive: { ready: false },
  };
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => payload,
      text: async () => JSON.stringify(payload),
    })
  );
  const client = new ScrapeBadger({ apiKey: "offline-key", maxRetries: 0 });
  const result = await client.github.getRepository("owner/a", "project+?#");
  expect(result).toEqual(payload);
  const url = new URL(vi.mocked(fetch).mock.calls[0]![0] as string);
  expect(url.pathname).toBe("/v1/github/repositories/owner%2Fa/project%2B%3F%23");
  expect(url.search).toBe("");
});
it.each([
  [".", "project"],
  ["..", "project"],
  ["owner", "."],
  ["owner", ".."],
])("rejects dot path segments without HTTP", async (owner, repo) => {
  vi.stubGlobal("fetch", vi.fn());
  const client = new ScrapeBadger({ apiKey: "offline-key", maxRetries: 0 });
  await expect(client.github.getRepository(owner, repo)).rejects.toThrow("dot path");
  expect(fetch).not.toHaveBeenCalled();
});
