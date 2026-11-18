/**
 * Verify and parse the webhooks ScrapeBadger sends: async-request callbacks
 * (`request.completed`) and Twitter stream monitor deliveries.
 *
 * Every delivery carries `X-ScrapeBadger-Signature: sha256=<hex>`, the
 * HMAC-SHA256 of the raw request body under your webhook secret
 * (`account.webhookSecret()` for async requests, the monitor's secret for
 * stream monitors).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { VerifyWebhookSignatureOptions, WebhookEvent } from "./types.js";

/** Default largest accepted age of `sentAt`, in seconds. */
const DEFAULT_TOLERANCE_S = 300;

const SIGNATURE_RE = /^sha256=([0-9a-fA-F]{64})$/;

/** A raw webhook body: exactly the bytes received, before any JSON parsing. */
export type RawWebhookBody = string | Uint8Array | ArrayBuffer;

function rawBytes(rawBody: RawWebhookBody, fn: string): Buffer {
  if (typeof rawBody === "string") return Buffer.from(rawBody, "utf-8");
  if (rawBody instanceof Uint8Array) {
    return Buffer.from(rawBody.buffer, rawBody.byteOffset, rawBody.byteLength);
  }
  if (rawBody instanceof ArrayBuffer) return Buffer.from(rawBody);
  throw new TypeError(
    `${fn} needs the raw request body (a string or Buffer) exactly as received, not a ` +
      'parsed object: read it with express.raw({ type: "application/json" }) or equivalent.'
  );
}

/**
 * Verify the signature of a ScrapeBadger webhook. Constant-time.
 *
 * Compares `X-ScrapeBadger-Signature` (`sha256=<hex>`) with the HMAC-SHA256
 * of the raw body under `secret`. Pass the body exactly as received: a body
 * parsed and re-serialised will not match. With `sentAt`, a delivery sent
 * more than `toleranceS` seconds (default 300) from now is rejected too.
 *
 * @param secret - Your webhook secret (`account.webhookSecret()`, or the stream monitor's).
 * @param rawBody - The raw request body (string, Buffer, Uint8Array or ArrayBuffer).
 * @param signature - The `X-ScrapeBadger-Signature` header value.
 * @param options - `sentAt` (unix seconds; the payload's signed `sent_at`), `toleranceS`.
 * @returns true when the signature matches (and `sentAt` is fresh, when given).
 *
 * @example
 * ```typescript
 * import express from "express";
 * import { parseWebhookEvent, verifyWebhookSignature } from "scrapebadger";
 *
 * app.post("/scrapebadger/webhook", express.raw({ type: "application/json" }), (req, res) => {
 *   const event = parseWebhookEvent(req.body);
 *   const ok = verifyWebhookSignature(secret, req.body, req.get("X-ScrapeBadger-Signature"), {
 *     sentAt: event.sent_at,
 *   });
 *   if (!ok) return res.sendStatus(401);
 *   // ... deduplicate on event.request_id, then handle event.status / event.body
 *   res.sendStatus(204);
 * });
 * ```
 */
export function verifyWebhookSignature(
  secret: string,
  rawBody: RawWebhookBody,
  signature: string | null | undefined,
  options: VerifyWebhookSignatureOptions = {}
): boolean {
  const body = rawBytes(rawBody, "verifyWebhookSignature");
  if (!secret || typeof signature !== "string") return false;
  const match = SIGNATURE_RE.exec(signature.trim());
  if (!match?.[1]) return false;

  const expected = createHmac("sha256", secret).update(body).digest();
  // Both are 32 bytes (the pattern fixes the length), so this never throws.
  if (!timingSafeEqual(expected, Buffer.from(match[1], "hex"))) return false;

  const { sentAt, toleranceS = DEFAULT_TOLERANCE_S } = options;
  if (sentAt === undefined || sentAt === null) return true;
  const sentAtS = typeof sentAt === "number" ? sentAt : Number(sentAt.trim() || Number.NaN);
  // Written so that a NaN anywhere rejects.
  return Math.abs(Date.now() / 1000 - sentAtS) <= toleranceS;
}

/**
 * Parse the raw body of a `request.completed` webhook.
 *
 * Verify the signature with {@link verifyWebhookSignature} before acting on
 * the event. Deliveries can repeat: deduplicate on `request_id`.
 *
 * @param rawBody - The raw request body (string, Buffer, Uint8Array or ArrayBuffer).
 * @returns The event; `body` is the call's own body (JSON-decoded when JSON).
 * @throws SyntaxError - The body is not JSON.
 * @throws TypeError - The body is not a ScrapeBadger webhook event.
 */
export function parseWebhookEvent<T = unknown>(rawBody: RawWebhookBody): WebhookEvent<T> {
  const text =
    typeof rawBody === "string"
      ? rawBody
      : rawBytes(rawBody, "parseWebhookEvent").toString("utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new SyntaxError(`Webhook body is not JSON: ${(error as Error).message}`);
  }
  const event = parsed as Partial<Record<keyof WebhookEvent, unknown>> | null;
  if (
    typeof event !== "object" ||
    event === null ||
    Array.isArray(event) ||
    typeof event.event !== "string" ||
    typeof event.request_id !== "string"
  ) {
    throw new TypeError(
      "Not a ScrapeBadger webhook event: expected a JSON object with string `event` and `request_id`."
    );
  }
  return event as WebhookEvent<T>;
}
