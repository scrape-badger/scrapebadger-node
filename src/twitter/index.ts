/**
 * Twitter API module.
 *
 * @module twitter
 */

export { TwitterClient } from "./client.js";
export { TweetsClient } from "./tweets.js";
export { UsersClient } from "./users.js";
export { ListsClient } from "./lists.js";
export { CommunitiesClient } from "./communities.js";
export { TrendsClient } from "./trends.js";
export { GeoClient, type GeoSearchOptions } from "./geo.js";
export { StreamClient, verifyWebhookSignature } from "./stream.js";
export type { StreamEmitter } from "./stream.js";
export { SpacesClient } from "./spaces.js";

// Export all types
export type {
  // Enums
  QueryType,
  TrendCategory,
  CommunityTweetType,
  // Nested types
  Media,
  PollOption,
  Poll,
  Url,
  Hashtag,
  UserMention,
  TweetPlace,
  // Core types
  Tweet,
  User,
  UserAbout,
  UserIds,
  List,
  CommunityBanner,
  CommunityRule,
  Community,
  CommunityMember,
  Trend,
  Location,
  PlaceTrends,
  Place,
  Article,
  CommunityNote,
  Space,
  Broadcast,
  // Response types
  ApiResponse,
  ListResponse,
} from "./types.js";

// Stream types
export type {
  MonitorStatus,
  StreamMonitor,
  StreamMonitorList,
  CreateMonitorParams,
  UpdateMonitorParams,
  StreamTweet,
  ConnectedEvent,
  PingEvent,
  TweetEvent,
  ErrorEvent,
  StreamEvent,
  StreamEventType,
  DeliveryLog,
  DeliveryLogList,
  BillingLog,
  BillingLogList,
  ConnectOptions,
  // Filter rule types
  FilterRuleStatus,
  FilterRuleResponse,
  FilterRuleCreate,
  FilterRuleUpdate,
  FilterRulePricingTier,
  FilterRuleListResponse,
  FilterRuleValidateResponse,
  FilterRuleDeliveryLog,
  FilterRuleDeliveryLogListResponse,
  FilterRulePricingTiersResponse,
} from "./stream-types.js";
