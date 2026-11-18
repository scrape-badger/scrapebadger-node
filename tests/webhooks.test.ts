/**
 * Tests for webhook signature verification and parsing (SCR-652).
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import { parseWebhookEvent, verifyWebhookSignature } from "../src/index.js";
import { verifyWebhookSignature as twitterVerify } from "../src/twitter/index.js";
import type { WebhookEvent } from "../src/index.js";

const SECRET = "whsec_test-secret";
const NOW_S = 1793138851;

const EVENT: WebhookEvent<{ answer: string }> = {
  event: "request.completed",
  request_id: "6ca4ab7a-1",
  batch_id: null,
  status: 200,
  headers: { "content-type": "application/json", "x-credits-used": "20" },
  body: { answer: "HubSpot" },
  body_size: 21,
  result_url: "https://scrapebadger.com/v1/requests/6ca4ab7a-1",
  result_expires_at: NOW_S + 900,
  attempt: 1,
  sent_at: NOW_S,
};
const RAW = JSON.stringify(EVENT);

function sign(body: string | Buffer, secret = SECRET): string {
  return "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyWebhookSignature()", () => {
  afterEach(() => vi.useRealTimers());

  it("accepts a valid signature over the raw body in every byte form", () => {
    const sig = sign(RAW);
    const buf = Buffer.from(RAW, "utf-8");
    expect(verifyWebhookSignature(SECRET, RAW, sig)).toBe(true);
    expect(verifyWebhookSignature(SECRET, buf, sig)).toBe(true);
    expect(verifyWebhookSignature(SECRET, new Uint8Array(buf), sig)).toBe(true);
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    expect(verifyWebhookSignature(SECRET, ab, sig)).toBe(true);
  });

  it("accepts an upper-case hex digest", () => {
    const sig = sign(RAW);
    expect(verifyWebhookSignature(SECRET, RAW, "sha256=" + sig.slice(7).toUpperCase())).toBe(true);
  });

  it("rejects a wrong secret, a tampered body and malformed or missing headers", () => {
    const sig = sign(RAW);
    expect(verifyWebhookSignature("whsec_other", RAW, sig)).toBe(false);
    expect(verifyWebhookSignature(SECRET, RAW.replace("HubSpot", "Hacked"), sig)).toBe(false);
    expect(verifyWebhookSignature(SECRET, RAW, sig.slice(7))).toBe(false); // no sha256= prefix
    expect(verifyWebhookSignature(SECRET, RAW, sig + "00")).toBe(false); // too long
    expect(verifyWebhookSignature(SECRET, RAW, sig.slice(0, -2))).toBe(false); // too short
    expect(verifyWebhookSignature(SECRET, RAW, sig.slice(0, -1) + "z")).toBe(false); // not hex
    expect(verifyWebhookSignature(SECRET, RAW, "")).toBe(false);
    expect(verifyWebhookSignature(SECRET, RAW, undefined)).toBe(false);
    expect(verifyWebhookSignature(SECRET, RAW, null)).toBe(false);
    expect(verifyWebhookSignature("", RAW, sign(RAW, ""))).toBe(false); // no secret configured
  });

  it("rejects a re-serialised body", () => {
    const pretty = JSON.stringify(JSON.parse(RAW), null, 2);
    expect(verifyWebhookSignature(SECRET, pretty, sign(RAW))).toBe(false);
  });

  it("refuses a parsed object instead of the raw body", () => {
    expect(() => verifyWebhookSignature(SECRET, EVENT as unknown as string, sign(RAW))).toThrow(
      TypeError
    );
  });

  it("accepts a fresh sentAt and rejects a stale one", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW_S * 1000);
    const sig = sign(RAW);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S })).toBe(true);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S - 300 })).toBe(true);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S - 301 })).toBe(false);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S + 301 })).toBe(false);
    // The X-ScrapeBadger-Timestamp header form.
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: String(NOW_S - 10) })).toBe(true);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: "yesterday" })).toBe(false);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: "" })).toBe(false);
    // null / undefined: no freshness check.
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: null })).toBe(true);
  });

  it("honours toleranceS", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW_S * 1000);
    const sig = sign(RAW);
    expect(verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S - 60, toleranceS: 30 })).toBe(
      false
    );
    expect(
      verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S - 3600, toleranceS: 7200 })
    ).toBe(true);
    expect(
      verifyWebhookSignature(SECRET, RAW, sig, { sentAt: NOW_S, toleranceS: Number.NaN })
    ).toBe(false);
  });

  it("checks the signature before freshness", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW_S * 1000);
    expect(verifyWebhookSignature(SECRET, RAW, sign("other"), { sentAt: NOW_S })).toBe(false);
  });

  it("is the same function as the scrapebadger/twitter export", () => {
    expect(twitterVerify).toBe(verifyWebhookSignature);
  });
});

describe("parseWebhookEvent()", () => {
  it("parses a request.completed payload from a string or bytes", () => {
    const fromString = parseWebhookEvent<{ answer: string }>(RAW);
    expect(fromString).toEqual(EVENT);
    expect(fromString.body?.answer).toBe("HubSpot");
    expect(parseWebhookEvent(Buffer.from(RAW))).toEqual(EVENT);
    expect(parseWebhookEvent(new TextEncoder().encode(RAW))).toEqual(EVENT);
  });

  it("keeps an omitted body as null", () => {
    const omitted = { ...EVENT, body: null, body_omitted: true, body_size: 2_000_000 };
    const event = parseWebhookEvent(JSON.stringify(omitted));
    expect(event.body).toBeNull();
    expect(event.body_omitted).toBe(true);
  });

  it("keeps an error status and text body", () => {
    const failed = { ...EVENT, status: 502, body: "upstream failed" };
    const event = parseWebhookEvent<string>(JSON.stringify(failed));
    expect(event.status).toBe(502);
    expect(event.body).toBe("upstream failed");
  });

  it("throws SyntaxError on a non-JSON body", () => {
    expect(() => parseWebhookEvent("not json")).toThrow(SyntaxError);
  });

  it("throws TypeError on JSON that is not a webhook event", () => {
    expect(() => parseWebhookEvent("[]")).toThrow(TypeError);
    expect(() => parseWebhookEvent("null")).toThrow(TypeError);
    expect(() => parseWebhookEvent('{"type":"tweet","monitor_id":"m-1"}')).toThrow(TypeError);
    expect(() => parseWebhookEvent('{"event":"request.completed"}')).toThrow(TypeError);
  });
});
