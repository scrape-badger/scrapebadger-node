/**
 * TypeScript types for Twitter Streams API.
 */

// =============================================================================
// Monitor Types
// =============================================================================

/**
 * Lifecycle status of a stream monitor.
 */
export type MonitorStatus = "active" | "paused" | "error";

/**
 * A stream monitor watching a set of Twitter accounts.
 */
export interface StreamMonitor {
  /** UUID of the monitor */
  id: string;
  /** Human-readable label */
  name: string;
  /** Lowercased Twitter handles being monitored */
  usernames: string[];
  /** How often the monitor polls in seconds */
  poll_interval_seconds: number;
  /** Current lifecycle state */
  status: MonitorStatus;
  /** Human-readable reason for non-active status */
  status_reason: string | null;
  /** HTTPS delivery URL, or null */
  webhook_url: string | null;
  /** Whether a signing secret is configured */
  webhook_secret_set: boolean;
  /** Projected credit burn rate */
  estimated_credits_per_hour: number;
  /** Tier label (Ultra, High, Standard, Low, Minimal) */
  pricing_tier: string;
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last modification */
  updated_at: string;
}

/**
 * Paginated list of stream monitors.
 */
export interface StreamMonitorList {
  /** The monitors on this page */
  monitors: StreamMonitor[];
  /** Total count across all pages */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  page_size: number;
}

/**
 * Create monitor request parameters.
 */
export interface CreateMonitorParams {
  /** Display name (1-100 chars) */
  name: string;
  /** Twitter handles to monitor (1-100 items) */
  usernames: string[];
  /** Polling interval in seconds (>= 0.1) */
  pollIntervalSeconds: number;
  /** Optional HTTPS webhook URL */
  webhookUrl?: string;
  /** Optional signing secret */
  webhookSecret?: string;
}

/**
 * Update monitor request parameters (all fields optional).
 */
export interface UpdateMonitorParams {
  /** New display name */
  name?: string;
  /** Replacement list of Twitter handles */
  usernames?: string[];
  /** New polling interval */
  pollIntervalSeconds?: number;
  /** New status ("active" or "paused") */
  status?: "active" | "paused";
  /** New webhook URL (empty string clears it) */
  webhookUrl?: string;
  /** New signing secret */
  webhookSecret?: string;
}

// =============================================================================
// WebSocket Event Types
// =============================================================================

/**
 * Type discriminator for WebSocket events.
 */
export type StreamEventType = "connected" | "ping" | "tweet" | "error";

/**
 * A tweet payload embedded in a TweetEvent.
 */
export interface StreamTweet {
  /** Snowflake tweet ID */
  id: string;
  /** Tweet text content */
  text: string;
  /** Raw created_at string from Twikit */
  created_at?: string;
  /** Author numeric ID as string */
  user_id?: string;
  /** Author handle (without @) */
  username?: string;
  /** Author display name */
  user_name?: string;
  /** Like count at detection time */
  favorite_count: number;
  /** Retweet count at detection time */
  retweet_count: number;
  /** Reply count at detection time */
  reply_count: number;
  /** Attached media */
  media: Record<string, unknown>[];
  /** URL entities */
  urls: Record<string, unknown>[];
  /** Hashtag entities */
  hashtags: Record<string, unknown>[];
}

/**
 * Emitted immediately after a successful WebSocket upgrade.
 */
export interface ConnectedEvent {
  type: "connected";
  /** Server-assigned UUID for this connection */
  connectionId: string;
  /** The API key identifier used */
  apiKeyId: string;
}

/**
 * Server keepalive ping. SDK responds with pong automatically.
 */
export interface PingEvent {
  type: "ping";
  /** Server timestamp in ISO format */
  timestamp: string;
}

/**
 * A new tweet detected by one of the caller's monitors.
 */
export interface TweetEvent {
  type: "tweet";
  /** UUID of the monitor that detected this tweet */
  monitorId: string;
  /** Snowflake tweet ID as string */
  tweetId: string;
  /** Lowercased Twitter handle of the author */
  authorUsername: string;
  /** ISO timestamp decoded from Snowflake */
  tweetPublishedAt: string;
  /** ISO timestamp of server-side detection */
  detectedAt: string;
  /** Milliseconds between tweet publish and detection */
  latencyMs: number;
  /** Full tweet data snapshot */
  tweet: StreamTweet;
}

/**
 * Server-side error event (sent before connection close on auth failure).
 */
export interface ErrorEvent {
  type: "error";
  /** Numeric error code (4001 = auth, 4003 = connection limit) */
  code: number;
  /** Human-readable description */
  message: string;
}

/**
 * Union of all possible WebSocket event types.
 */
export type StreamEvent = ConnectedEvent | PingEvent | TweetEvent | ErrorEvent;

// =============================================================================
// Log Types
// =============================================================================

/**
 * A tweet delivery log entry.
 *
 * Field names match the JSON wire format (snake_case) from the server.
 */
export interface DeliveryLog {
  id: string;
  monitor_id: string;
  monitor_name: string;
  tweet_id: string;
  author_username: string;
  tweet_text_preview: string | null;
  tweet_url: string;
  tweet_published_at: string;
  detected_at: string;
  /** Detection latency in milliseconds */
  latency_ms: number;
  /** "green" | "yellow" | "red" */
  latency_badge: string;
  /** "websocket_delivered" | "webhook_delivered" | "webhook_failed" */
  delivery_status: string;
  webhook_status_code: number | null;
  webhook_attempts: number;
}

/**
 * Paginated tweet delivery logs.
 */
export interface DeliveryLogList {
  logs: DeliveryLog[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * A billing activity log entry.
 */
export interface BillingLog {
  id: string;
  monitor_id: string;
  monitor_name: string;
  billed_at: string;
  num_accounts: number;
  credits_deducted: number;
  tier_label: string;
  rate_applied: number;
}

/**
 * Paginated billing activity logs.
 */
export interface BillingLogList {
  logs: BillingLog[];
  total: number;
  page: number;
  page_size: number;
}

// =============================================================================
// Filter Rule Types
// =============================================================================

/**
 * Lifecycle status of a filter rule.
 */
export type FilterRuleStatus = "active" | "paused" | "error" | "inactive";

/**
 * A filter rule that watches Twitter for tweets matching a search query.
 */
export interface FilterRuleResponse {
  /** UUID of the filter rule */
  id: string;
  /** Short human-readable tag for the rule */
  tag: string;
  /** Twitter search query string */
  query: string;
  /** How often the rule polls in seconds */
  interval_seconds: number;
  /** Current lifecycle state */
  status: FilterRuleStatus;
  /** Human-readable reason for non-active status */
  status_reason: string | null;
  /** HTTPS delivery URL, or null */
  webhook_url: string | null;
  /** Whether a signing secret is configured */
  webhook_secret_set: boolean;
  /** Maximum tweet results fetched per poll */
  max_results_per_poll: number;
  /** Credits burned per rule per day */
  credits_per_rule_per_day: number;
  /** Tier label (e.g. Ultra, High, Standard) */
  pricing_tier: string;
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last modification */
  updated_at: string;
}

/**
 * Request body for creating a filter rule.
 */
export interface FilterRuleCreate {
  /** Short tag identifying this rule */
  tag: string;
  /** Twitter search query string */
  query: string;
  /** Polling interval in seconds */
  interval_seconds: number;
  /** Optional HTTPS webhook URL */
  webhook_url?: string | null;
  /** Optional webhook signing secret */
  webhook_secret?: string | null;
  /** Maximum results per poll (server default applies if omitted) */
  max_results_per_poll?: number;
}

/**
 * Request body for updating a filter rule (all fields optional).
 */
export interface FilterRuleUpdate {
  /** New tag */
  tag?: string;
  /** New search query */
  query?: string;
  /** New polling interval in seconds */
  interval_seconds?: number;
  /** New lifecycle status */
  status?: "active" | "paused" | "inactive";
  /** New webhook URL (null clears it) */
  webhook_url?: string | null;
  /** New webhook signing secret */
  webhook_secret?: string | null;
  /** New max results per poll */
  max_results_per_poll?: number;
}

/**
 * A pricing tier for filter rules.
 */
export interface FilterRulePricingTier {
  /** UUID of the pricing tier */
  id: string;
  /** Human-readable tier label */
  tier_label: string;
  /** Maximum polling interval in seconds for this tier */
  max_interval_seconds: number;
  /** Credits deducted per rule per day at this tier */
  credits_per_rule_per_day: number;
  /** Ordering value for display */
  display_order: number;
}

/**
 * Paginated list of filter rules.
 */
export interface FilterRuleListResponse {
  /** The rules on this page */
  rules: FilterRuleResponse[];
  /** Total count across all pages */
  total: number;
  /** Requested limit */
  limit: number;
  /** Requested offset */
  offset: number;
}

/**
 * Response from the filter rule query validation endpoint.
 */
export interface FilterRuleValidateResponse {
  /** Whether the query is valid */
  valid: boolean;
  /** Human-readable error if query is invalid */
  error?: string;
  /** Number of sample results found */
  sample_results: number;
}

/**
 * A single tweet delivery log entry for a filter rule.
 *
 * Field names match the JSON wire format (snake_case) from the server.
 */
export interface FilterRuleDeliveryLog {
  id: string;
  rule_id: string;
  tweet_id: string;
  author_username: string;
  tweet_text: string | null;
  tweet_published_at: string;
  detected_at: string;
  /** Detection latency in milliseconds */
  latency_ms: number;
  delivery_status: string;
  webhook_status_code: number | null;
  webhook_attempts: number;
  tweet_type: string | null;
}

/**
 * Paginated filter rule delivery logs.
 */
export interface FilterRuleDeliveryLogListResponse {
  logs: FilterRuleDeliveryLog[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Response from the filter rule pricing tiers endpoint.
 */
export interface FilterRulePricingTiersResponse {
  tiers: FilterRulePricingTier[];
}

// =============================================================================
// StreamClient Configuration
// =============================================================================

/**
 * Options for StreamClient.connect() and StreamClient.connectIter().
 */
export interface ConnectOptions {
  /**
   * Automatically reconnect on unexpected disconnect.
   * Default: false.
   */
  reconnect?: boolean;
  /**
   * Minimum seconds between reconnect attempts.
   * Enforced floor of 5 seconds. Default: 90.
   */
  reconnectDelaySeconds?: number;
  /**
   * Maximum reconnect attempts. undefined means unlimited.
   */
  maxReconnects?: number;
}
