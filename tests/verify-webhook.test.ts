import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "../src/twitter/stream.js";

// ---------------------------------------------------------------------------
// Helper: generate a valid signature for testing
// ---------------------------------------------------------------------------

function sign(secret: string, body: string): string {
  const hmac = createHmac("sha256", secret).update(body, "utf-8").digest("hex");
  return `sha256=${hmac}`;
}

// ---------------------------------------------------------------------------
// verifyWebhookSignature
// ---------------------------------------------------------------------------

describe("verifyWebhookSignature", () => {
  it("returns true for a valid string body signature", () => {
    const secret = "my-webhook-secret";
    const body = '{"type":"tweet","monitor_id":"abc"}';
    const header = sign(secret, body);

    expect(verifyWebhookSignature(secret, body, header)).toBe(true);
  });

  it("returns true for a valid Buffer body signature", () => {
    const secret = "my-webhook-secret";
    const body = Buffer.from('{"type":"tweet"}', "utf-8");
    const header = sign(secret, body.toString());

    expect(verifyWebhookSignature(secret, body, header)).toBe(true);
  });

  it("returns false for a wrong signature", () => {
    const secret = "my-webhook-secret";
    const body = '{"type":"tweet"}';
    const header = "sha256=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";

    expect(verifyWebhookSignature(secret, body, header)).toBe(false);
  });

  it("returns false when header is missing sha256= prefix", () => {
    const secret = "my-webhook-secret";
    const body = '{"type":"tweet"}';
    const header = "notsha256=abc123";

    expect(verifyWebhookSignature(secret, body, header)).toBe(false);
  });

  it("returns false for an empty signature header", () => {
    const secret = "my-webhook-secret";
    const body = '{"type":"tweet"}';

    expect(verifyWebhookSignature(secret, body, "")).toBe(false);
  });

  it("returns false for a tampered body", () => {
    const secret = "my-webhook-secret";
    const originalBody = '{"type":"tweet","monitor_id":"abc"}';
    const tamperedBody = '{"type":"tweet","monitor_id":"HACKED"}';
    const header = sign(secret, originalBody);

    expect(verifyWebhookSignature(secret, tamperedBody, header)).toBe(false);
  });

  it("returns false for a wrong secret", () => {
    const correctSecret = "correct-secret";
    const wrongSecret = "wrong-secret";
    const body = '{"type":"tweet"}';
    const header = sign(correctSecret, body);

    expect(verifyWebhookSignature(wrongSecret, body, header)).toBe(false);
  });

  it("handles empty body correctly", () => {
    const secret = "my-secret";
    const body = "";
    const header = sign(secret, body);

    expect(verifyWebhookSignature(secret, body, header)).toBe(true);
  });

  it("does not throw on length mismatch (constant-time comparison)", () => {
    const secret = "my-secret";
    const body = '{"data":"test"}';
    // Provide a signature that would result in different hex length when decoded
    const shortHeader = "sha256=abc";

    expect(() => verifyWebhookSignature(secret, body, shortHeader)).not.toThrow();
    expect(verifyWebhookSignature(secret, body, shortHeader)).toBe(false);
  });

  it("handles Buffer body identical to string body", () => {
    const secret = "buffer-test-secret";
    const bodyStr = '{"event":"webhook_test"}';
    const bodyBuf = Buffer.from(bodyStr, "utf-8");
    const header = sign(secret, bodyStr);

    const resultStr = verifyWebhookSignature(secret, bodyStr, header);
    const resultBuf = verifyWebhookSignature(secret, bodyBuf, header);

    expect(resultStr).toBe(true);
    expect(resultBuf).toBe(true);
    expect(resultStr).toBe(resultBuf);
  });
});
