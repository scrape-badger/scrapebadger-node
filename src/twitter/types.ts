/**
 * TypeScript types for Twitter API responses.
 *
 * This module contains all the data types used by the Twitter API client.
 * Types mirror the Python SDK's Pydantic models.
 */

// =============================================================================
// Enums
// =============================================================================

/**
 * Search query type for tweet searches.
 */
export type QueryType = "Top" | "Latest" | "Media";

/**
 * Category for trending topics.
 */
export type TrendCategory = "trending" | "for_you" | "news" | "sports" | "entertainment";

/**
 * Tweet type filter for community tweets.
 */
export type CommunityTweetType = "Top" | "Latest" | "Media";

// =============================================================================
// Nested Types
// =============================================================================

/**
 * Media attachment on a tweet.
 *
 * Represents images, videos, or animated GIFs attached to tweets.
 */
export interface Media {
  /** Unique identifier for the media */
  media_key?: string;
  /** Media type ('photo', 'video', 'animated_gif') */
  type?: string;
  /** Direct URL to the media */
  url?: string;
  /** URL to a preview/thumbnail image */
  preview_image_url?: string;
  /** Media width in pixels */
  width?: number;
  /** Media height in pixels */
  height?: number;
  /** Duration in milliseconds (for videos) */
  duration_ms?: number;
  /** Number of views (for videos) */
  view_count?: number;
  /** Accessibility description */
  alt_text?: string;
}

/**
 * A single option in a poll.
 */
export interface PollOption {
  /** Option position (1-indexed) */
  position: number;
  /** Option text */
  label: string;
  /** Number of votes received */
  votes: number;
}

/**
 * A poll attached to a tweet.
 */
export interface Poll {
  /** Unique poll identifier */
  id?: string;
  /** Current status ('open' or 'closed') */
  voting_status?: string;
  /** When the poll ends/ended */
  end_datetime?: string;
  /** Total poll duration */
  duration_minutes?: number;
  /** List of poll options with vote counts */
  options: PollOption[];
}

/**
 * A URL entity in tweet text.
 */
export interface Url {
  /** The t.co shortened URL */
  url?: string;
  /** The fully expanded URL */
  expanded_url?: string;
  /** The display version of the URL */
  display_url?: string;
  /** Page title (if available) */
  title?: string;
  /** Page description (if available) */
  description?: string;
}

/**
 * A hashtag entity in tweet text.
 */
export interface Hashtag {
  /** The hashtag text (without #) */
  tag: string;
}

/**
 * A user mention entity in tweet text.
 */
export interface UserMention {
  /** User ID of mentioned user */
  id?: string;
  /** Username of mentioned user (without @) */
  username?: string;
  /** Display name of mentioned user */
  name?: string;
}

/**
 * Location information attached to a tweet.
 */
export interface TweetPlace {
  /** Place ID */
  id?: string;
  /** Full place name */
  full_name?: string;
  /** Short place name */
  name?: string;
  /** Country name */
  country?: string;
  /** ISO country code */
  country_code?: string;
  /** Type of place ('city', 'country', etc.) */
  place_type?: string;
}

// =============================================================================
// Core Types
// =============================================================================

/**
 * A Twitter tweet with all associated data.
 *
 * This is the primary type for tweet data, containing the tweet content,
 * engagement metrics, author information, and all entities.
 *
 * @example
 * ```typescript
 * const tweet = await client.twitter.tweets.getById("1234567890");
 * console.log(`@${tweet.username}: ${tweet.text}`);
 * console.log(`Likes: ${tweet.favorite_count}, Retweets: ${tweet.retweet_count}`);
 * ```
 */
export interface Tweet {
  // Core identifiers
  /** Unique tweet identifier */
  id: string;
  /** Tweet text content */
  text: string;
  /** Full tweet text (may differ from text for long tweets) */
  full_text?: string;
  /** Tweet creation timestamp (ISO format) */
  created_at?: string;
  /** Language code */
  lang?: string;

  // Author info
  /** Author's user ID */
  user_id?: string;
  /** Author's username */
  username?: string;
  /** Author's display name */
  user_name?: string;

  // Engagement metrics
  /** Number of likes */
  favorite_count: number;
  /** Number of retweets */
  retweet_count: number;
  /** Number of replies */
  reply_count: number;
  /** Number of quote tweets */
  quote_count: number;
  /** Number of views */
  view_count?: number;
  /** Number of bookmarks */
  bookmark_count?: number;

  // User interaction states
  /** Whether the authenticated user liked this */
  favorited: boolean;
  /** Whether the authenticated user retweeted this */
  retweeted: boolean;
  /** Whether the authenticated user bookmarked this */
  bookmarked: boolean;

  // Tweet properties
  /** Whether the tweet is marked as sensitive (may be null/undefined) */
  possibly_sensitive?: boolean;
  /** Whether this is a quote tweet */
  is_quote_status: boolean;
  /** Whether this is a retweet */
  is_retweet: boolean;
  /** ID of the conversation thread */
  conversation_id?: string;
  /** ID of the tweet being replied to */
  in_reply_to_status_id?: string;
  /** ID of the user being replied to */
  in_reply_to_user_id?: string;

  // Rich content
  /** List of attached media */
  media: Media[];
  /** List of URLs in the tweet */
  urls: Url[];
  /** List of hashtags */
  hashtags: Hashtag[];
  /** List of user mentions */
  user_mentions: UserMention[];
  /** Poll data if present */
  poll?: Poll;
  /** Location data if present */
  place?: TweetPlace;

  // Referenced tweets
  /** ID of the quoted tweet */
  quoted_status_id?: string;
  /** ID of the original retweeted tweet */
  retweeted_status_id?: string;

  // Edit information
  /** IDs of edit history */
  edit_tweet_ids?: string[];
  /** Edit deadline timestamp */
  editable_until_msecs?: number;
  /** Remaining edit count */
  edits_remaining?: number;
  /** Whether the tweet can be edited */
  is_edit_eligible?: boolean;

  // Card/preview
  /** Whether the tweet has a link preview card */
  has_card?: boolean;
  /** Card thumbnail URL */
  thumbnail_url?: string;
  /** Card title */
  thumbnail_title?: string;

  // Community notes
  /** Whether the tweet has community notes */
  has_community_notes?: boolean;

  // Source
  /** Client used to post the tweet */
  source?: string;
}

/**
 * A Twitter user profile.
 *
 * Contains all publicly available information about a Twitter user,
 * including profile details, metrics, and relationship status.
 *
 * @example
 * ```typescript
 * const user = await client.twitter.users.getByUsername("elonmusk");
 * console.log(`${user.name} (@${user.username})`);
 * console.log(`Followers: ${user.followers_count.toLocaleString()}`);
 * console.log(`Bio: ${user.description}`);
 * ```
 */
export interface User {
  // Core identifiers
  /** Unique user identifier */
  id: string;
  /** User's handle (without @) */
  username: string;
  /** Display name */
  name: string;

  // Profile information
  /** User's bio */
  description?: string;
  /** User-provided location */
  location?: string;
  /** User's website URL */
  url?: string;
  /** Profile picture URL */
  profile_image_url?: string;
  /** Banner image URL */
  profile_banner_url?: string;

  // Account metrics
  /** Number of followers */
  followers_count: number;
  /** Number of accounts followed */
  following_count: number;
  /** Total tweets posted */
  tweet_count: number;
  /** Number of lists the user is on */
  listed_count: number;
  /** Number of tweets liked */
  favourites_count?: number;
  /** Number of media posts */
  media_count?: number;

  // Verification and account type
  /** Whether the user is verified (legacy) */
  verified: boolean;
  /** Type of verification */
  verified_type?: string;
  /** Whether the user has Twitter Blue */
  is_blue_verified?: boolean;

  // Account dates
  /** Account creation timestamp */
  created_at?: string;

  // Account settings
  /** Default profile */
  default_profile?: boolean;
  /** Default profile image */
  default_profile_image?: boolean;
  /** Whether the account is protected/private */
  protected?: boolean;
  /** Whether content may be sensitive */
  possibly_sensitive?: boolean;

  // Relationship with authenticated user
  /** Whether they follow the authenticated user */
  followed_by?: boolean;
  /** Whether the authenticated user follows them */
  following?: boolean;
  /** Whether a follow request was sent */
  follow_request_sent?: boolean;
  /** Whether the authenticated user blocks them */
  blocking?: boolean;
  /** Whether they block the authenticated user */
  blocked_by?: boolean;
  /** Whether the authenticated user mutes them */
  muting?: boolean;
  /** Notifications enabled */
  notifications?: boolean;
  /** Whether DMs are allowed */
  can_dm?: boolean;

  // Extended profile features
  /** Has custom timelines */
  has_custom_timelines?: boolean;
  /** Has extended profile */
  has_extended_profile?: boolean;
  /** Is translator */
  is_translator?: boolean;
  /** Is translation enabled */
  is_translation_enabled?: boolean;
  /** Professional type */
  professional_type?: string;
  /** Advertiser account type */
  advertiser_account_type?: string;

  // Engagement
  /** IDs of pinned tweets */
  pinned_tweet_ids?: string[];
  /** Countries where withheld */
  withheld_in_countries?: string[];
}

/**
 * Extended "About" information for a user.
 *
 * Contains additional metadata about a user's account, including
 * account location, username change history, and verification details.
 *
 * @example
 * ```typescript
 * const about = await client.twitter.users.getAbout("elonmusk");
 * console.log(`Account based in: ${about.account_based_in}`);
 * console.log(`Username changes: ${about.username_changes}`);
 * ```
 */
export interface UserAbout {
  /** User ID */
  id: string;
  /** REST API user ID */
  rest_id?: string;
  /** Username */
  screen_name?: string;
  /** Display name */
  name?: string;

  // Location and source information
  /** Region Twitter believes the account is based in */
  account_based_in?: string;
  /** Whether the location is verified */
  location_accurate?: boolean;
  /** Linked affiliate account */
  affiliate_username?: string;
  /** How the source was determined */
  source?: string;

  // Username change history
  /** Number of username changes */
  username_changes?: number;
  /** Last change timestamp (ms) */
  username_last_changed_at?: number;
  /** Last change as datetime string */
  username_last_changed_at_datetime?: string;

  // Verification information
  /** Whether identity is verified */
  is_identity_verified?: boolean;
  /** Verification timestamp (ms) */
  verified_since_msec?: number;
  /** Verification as datetime string */
  verified_since_datetime?: string;
}

/**
 * Response containing a list of user IDs.
 *
 * Used for endpoints that return ID lists without full user data,
 * such as follower_ids and following_ids endpoints.
 *
 * @example
 * ```typescript
 * const ids = await client.twitter.users.getFollowerIds("elonmusk");
 * console.log(`Found ${ids.ids.length.toLocaleString()} follower IDs`);
 * ```
 */
export interface UserIds {
  /** List of user IDs */
  ids: number[];
  /** Cursor for pagination */
  next_cursor?: string;
}

/**
 * A Twitter list.
 *
 * Represents a curated list of Twitter users.
 *
 * @example
 * ```typescript
 * const lists = await client.twitter.lists.search("tech leaders");
 * for (const list of lists.data) {
 *   console.log(`${list.name}: ${list.member_count} members`);
 * }
 * ```
 */
export interface List {
  /** Unique list identifier */
  id: string;
  /** List name */
  name: string;
  /** List description */
  description?: string;
  /** List creation timestamp */
  created_at?: string;
  /** Number of members */
  member_count?: number;
  /** Number of subscribers */
  subscriber_count?: number;
  /** 'public' or 'private' */
  mode?: string;
  /** Owner's user ID */
  user_id?: string;
  /** Owner's username */
  username?: string;
}

/**
 * Banner image for a community.
 */
export interface CommunityBanner {
  /** Banner image URL */
  url?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
}

/**
 * A rule for a community.
 */
export interface CommunityRule {
  /** Rule identifier */
  id?: string;
  /** Rule name/title */
  name?: string;
  /** Rule description */
  description?: string;
}

/**
 * A Twitter community.
 *
 * Represents a community with its members, rules, and settings.
 *
 * @example
 * ```typescript
 * const community = await client.twitter.communities.getDetail("123456");
 * console.log(`${community.name}: ${community.member_count?.toLocaleString()} members`);
 * for (const rule of community.rules || []) {
 *   console.log(`  - ${rule.name}`);
 * }
 * ```
 */
export interface Community {
  /** Unique community identifier */
  id: string;
  /** Community name */
  name: string;
  /** Community description */
  description?: string;

  // Membership information
  /** Number of members */
  member_count?: number;
  /** Whether the authenticated user is a member */
  is_member?: boolean;
  /** User's role ('member', 'moderator', 'admin', 'non_member') */
  role?: string;

  // Community settings
  /** Whether the community contains adult content */
  is_nsfw?: boolean;
  /** How users can join ('Open', 'Closed') */
  join_policy?: string;
  /** Who can invite members */
  invites_policy?: string;
  /** Whether the community is pinned */
  is_pinned?: boolean;

  // Metadata
  /** Creation timestamp (Unix) */
  created_at?: number;
  /** Creation timestamp (ISO) */
  created_at_datetime?: string;

  // Rich content
  /** Community banner image */
  banner?: CommunityBanner;
  /** Profile images of some members */
  members_facepile_results?: string[];

  // Administration
  /** Creator's user ID */
  creator_id?: string;
  /** Creator's username */
  creator_username?: string;
  /** Creator's display name */
  creator_name?: string;
  /** Primary admin's user ID */
  admin_id?: string;
  /** Primary admin's username */
  admin_username?: string;
  /** Primary admin's display name */
  admin_name?: string;

  // Rules
  /** List of community rules */
  rules?: CommunityRule[];
}

/**
 * A member of a community.
 *
 * Extends User with community-specific information.
 */
export interface CommunityMember {
  /** The user data */
  user: User;
  /** Member's role in the community */
  role?: string;
  /** When they joined */
  joined_at?: string;
}

/**
 * A trending topic.
 *
 * @example
 * ```typescript
 * const trends = await client.twitter.trends.getTrends();
 * for (const trend of trends.data) {
 *   console.log(`${trend.name}: ${trend.tweet_count || 'N/A'} tweets`);
 * }
 * ```
 */
export interface Trend {
  /** Trend name/hashtag */
  name: string;
  /** Twitter search URL for the trend */
  url?: string;
  /** Search query to find tweets */
  query?: string;
  /** Number of tweets (if available) */
  tweet_count?: number;
  /** Category context */
  domain_context?: string;
}

/**
 * A location for trends.
 *
 * @example
 * ```typescript
 * const locations = await client.twitter.trends.getAvailableLocations();
 * const usLocations = locations.data.filter(loc => loc.country_code === "US");
 * ```
 */
export interface Location {
  /** Where On Earth ID */
  woeid: number;
  /** Location name */
  name: string;
  /** Country name */
  country?: string;
  /** ISO country code */
  country_code?: string;
  /** Type of place */
  place_type?: string;
}

/**
 * Trends for a specific location.
 *
 * @example
 * ```typescript
 * const placeTrends = await client.twitter.trends.getPlaceTrends(23424977);  // US
 * console.log(`Trends in ${placeTrends.name}:`);
 * for (const trend of placeTrends.trends) {
 *   console.log(`  - ${trend.name}`);
 * }
 * ```
 */
export interface PlaceTrends {
  /** Where On Earth ID */
  woeid: number;
  /** Location name */
  name?: string;
  /** Country name */
  country?: string;
  /** List of trends for this location */
  trends: Trend[];
}

/**
 * A geographic place.
 *
 * @example
 * ```typescript
 * const places = await client.twitter.geo.search({ query: "San Francisco" });
 * for (const place of places.data) {
 *   console.log(`${place.full_name} (${place.place_type})`);
 * }
 * ```
 */
export interface Place {
  /** Place ID */
  id: string;
  /** Short place name */
  name: string;
  /** Full place name */
  full_name?: string;
  /** Country name */
  country?: string;
  /** ISO country code */
  country_code?: string;
  /** Type of place ('city', 'country', etc.) */
  place_type?: string;
  /** Twitter place URL */
  url?: string;
  /** Geographic bounding box */
  bounding_box?: Record<string, unknown>;
  /** Additional place attributes */
  attributes?: Record<string, string>;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Generic API response with data and optional cursor.
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Cursor for next page (if paginated) */
  cursor?: string;
}

/**
 * Paginated list response.
 */
export interface ListResponse<T> {
  /** Array of items */
  data: T[];
  /** Cursor for next page */
  cursor?: string;
}
