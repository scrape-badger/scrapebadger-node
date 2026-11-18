/**
 * Types of the webhooks ScrapeBadger sends.
 */

/**
 * Payload of the `request.completed` webhook, POSTed to the `X-Callback-URL`
 * (or batch `callback_url`) of an async call when it completes.
 *
 * Deliveries can repeat: deduplicate on `request_id`.
 */
export interface WebhookEvent<T = unknown> {
  /** The event type. Only "request.completed" is sent today. */
  event: "request.completed";
  request_id: string;
  /** The batch the call was part of, or null. */
  batch_id: string | null;
  /** HTTP status of the call itself, errors included. */
  status: number;
  /** The call's kept response headers, names lower-cased (e.g. `x-credits-used`). */
  headers: Record<string, string>;
  /**
   * The call's body, errors included: JSON-decoded when the call answered
   * JSON, otherwise text. null when `body_omitted` (over 1 MB): fetch it from
   * `result_url` within about 15 minutes.
   */
  body: T | null;
  /** true when the body was left out for its size. */
  body_omitted?: boolean;
  /** Size of the call's body in bytes. */
  body_size: number;
  /** Where to fetch the result (`GET /v1/requests/{request_id}`) while it is kept. */
  result_url: string;
  /** When the result stops being kept (unix seconds). */
  result_expires_at: number;
  /** Delivery attempt, from 1. */
  attempt: number;
  /** When this attempt was sent (unix seconds). Covered by the signature. */
  sent_at: number;
}

/** Options for {@link verifyWebhookSignature}. */
export interface VerifyWebhookSignatureOptions {
  /**
   * When the delivery was sent, in unix seconds: the payload's `sent_at`
   * (signed) or the `X-ScrapeBadger-Timestamp` header (not signed). When
   * given, a delivery more than `toleranceS` away from now is rejected, which
   * stops replays of old deliveries.
   */
  sentAt?: number | string | null;
  /** Largest accepted age of `sentAt`, in seconds (default 300). */
  toleranceS?: number;
}
