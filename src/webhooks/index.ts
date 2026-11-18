/**
 * Webhooks module: verify and parse the webhooks ScrapeBadger sends.
 *
 * @module webhooks
 */

export { verifyWebhookSignature, parseWebhookEvent } from "./signature.js";
export type { RawWebhookBody } from "./signature.js";
export type { WebhookEvent, VerifyWebhookSignatureOptions } from "./types.js";
