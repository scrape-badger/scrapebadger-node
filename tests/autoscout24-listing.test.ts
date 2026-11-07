import { afterEach, expect, it, vi } from "vitest";
import { ScrapeBadger } from "../src/client.js";

afterEach(() => vi.unstubAllGlobals());

const LISTING_ID = "3124825e-43e6-45d4-8987-775b827fb166";
const LISTING_URL = `https://www.autoscout24.be/fr/offres/volkswagen-golf-${LISTING_ID}`;

it.each([[{ url: LISTING_URL }], [{ listing_id: LISTING_ID, market: "be" }]])(
  "listing handoff sends %o and keeps native vehicle data",
  async (lookup) => {
    // Native vehicle/equipment groups are raw: false, zero and empty values must
    // survive without a typed model dropping or coercing them.
    const payload = {
      market: "be",
      source_url: LISTING_URL,
      listing: {
        id: LISTING_ID,
        title: "Volkswagen Golf",
        price: 10850,
        currency: "EUR",
        vehicle: { rawPowerInKw: 81, isDamaged: false, previousOwners: 0 },
        equipment: { comfortAndConvenience: [{ categoryName: "Confort" }], safety: [] },
      },
      latency_ms: 1397,
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json", "X-Credits-Used": "10" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ScrapeBadger({ apiKey: "offline-key", maxRetries: 0 });

    const result = await client.autoscout24.getListing(lookup);

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [rawUrl, init] = fetchMock.mock.calls[0]! as [string, RequestInit];
    const url = new URL(rawUrl);
    expect(url.pathname).toBe("/v1/autoscout24/listing");
    expect(Object.fromEntries(url.searchParams)).toEqual(lookup);
    expect((init.headers as Record<string, string>)["X-API-Key"]).toBe("offline-key");
  }
);
