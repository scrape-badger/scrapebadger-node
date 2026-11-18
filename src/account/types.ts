/**
 * TypeScript types for the account endpoints.
 */

/** The account's webhook signing secret (`GET /v1/account/webhook-secret`). */
export interface WebhookSecret {
  /** Signs every async-request and batch webhook of this account ("whsec_..."). */
  secret: string;
  /** "X-ScrapeBadger-Signature" */
  signature_header: string;
  /** "sha256=<hex HMAC-SHA256 of the raw request body>" */
  algorithm: string;
}

/** Options for {@link AccountClient.webhookDeliveries}. */
export interface WebhookDeliveriesOptions {
  /** Most recent deliveries to return (API default 50, max 200). */
  limit?: number;
}

/** One webhook delivery of the last 24 hours. */
export interface WebhookDelivery {
  request_id: string;
  /** Path of the call (its query is never kept). */
  endpoint: string;
  state: "pending" | "delivering" | "delivered" | "failed";
  attempts: number;
  /** HTTP status your endpoint answered on the last attempt. */
  last_status: number | null;
  /** Short error class of the last failed attempt, e.g. "timeout". */
  last_error: string | null;
  /** When the call was submitted (unix seconds). */
  created_at: number;
  /** When the webhook was delivered (unix seconds). */
  delivered_at: number | null;
  /** Host of the callback URL (its path and query are never kept). */
  callback_host: string;
}

/** Result of {@link AccountClient.webhookDeliveries}, newest first. */
export interface WebhookDeliveries {
  deliveries: WebhookDelivery[];
  /** How far back the log goes (24). */
  window_hours: number;
}
