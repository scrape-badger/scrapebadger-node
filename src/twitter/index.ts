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
  // Response types
  ApiResponse,
  ListResponse,
} from "./types.js";
