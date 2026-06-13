/**
 * TypeScript types for TikTok API responses.
 *
 * These interfaces mirror the backend `tiktok_scraper` response schema
 * field-for-field. Optional / nullable backend fields are typed as
 * `Type | null`; backend list fields default to `[]` and are typed as arrays.
 * Every datetime field ships in BOTH `*_utc` (number) and `*_at` (string) form.
 */

// =============================================================================
// Shared Sub-models
// =============================================================================

/**
 * Author summary embedded in a video, comment, or search result.
 */
export interface TikTokAuthor {
  id: string;
  sec_uid?: string | null;
  /** @handle */
  unique_id: string;
  nickname?: string | null;
  avatar_thumb?: string | null;
  avatar_medium?: string | null;
  avatar_larger?: string | null;
  /** bio */
  signature?: string | null;
  verified: boolean;
  private_account?: boolean | null;
  follower_count?: number | null;
  following_count?: number | null;
  /** total likes received */
  heart_count?: number | null;
  video_count?: number | null;
  /** likes given */
  digg_count?: number | null;
  region?: string | null;
  sec_uid_present: boolean;
  short_id?: string | null;
  /** custom_verify / enterprise_verify_reason text */
  verify_reason?: string | null;
  verification_type?: number | null;
  account_region?: string | null;
  language?: string | null;
  original_musician?: boolean | null;
  /** featured / star creator */
  is_star?: boolean | null;
  ins_id?: string | null;
  twitter_name?: string | null;
  youtube_channel_title?: string | null;
  /** non-empty when live */
  room_id?: string | null;
  commerce_user_level?: number | null;
  with_shop_entry?: boolean | null;
}

/**
 * Engagement statistics for a video.
 */
export interface TikTokStats {
  /** views */
  play_count: number;
  /** likes */
  digg_count: number;
  comment_count: number;
  share_count: number;
  /** saves / bookmarks */
  collect_count: number;
  download_count?: number | null;
  forward_count?: number | null;
  whatsapp_share_count?: number | null;
  repost_count?: number | null;
}

/**
 * Playable-media metadata for a video.
 */
export interface TikTokVideoMeta {
  height?: number | null;
  width?: number | null;
  /** seconds */
  duration?: number | null;
  ratio?: string | null;
  format?: string | null;
  definition?: string | null;
  codec_type?: string | null;
  encoded_type?: string | null;
  bitrate?: number | null;
  cover?: string | null;
  origin_cover?: string | null;
  dynamic_cover?: string | null;
  animated_cover?: string | null;
  ai_dynamic_cover?: string | null;
  share_cover?: string | null;
  /** direct play URL */
  play_addr?: string | null;
  /** direct download URL (watermarked) */
  download_addr?: string | null;
  /** clean MP4 */
  download_no_watermark_addr?: string | null;
  has_watermark?: boolean | null;
  volume_loudness?: number | null;
  volume_peak?: number | null;
}

/**
 * Sound / music attached to a video, or a standalone music entity.
 */
export interface TikTokMusic {
  id: string;
  title?: string | null;
  author_name?: string | null;
  album?: string | null;
  /** seconds */
  duration?: number | null;
  play_url?: string | null;
  cover_thumb?: string | null;
  cover_medium?: string | null;
  cover_large?: string | null;
  original?: boolean | null;
  is_copyrighted?: boolean | null;
  mid?: string | null;
  owner_id?: string | null;
  owner_nickname?: string | null;
  is_commerce_music?: boolean | null;
  is_original_sound?: boolean | null;
  /** Present only on standalone music endpoints */
  video_count?: number | null;
  user_count?: number | null;
}

/**
 * A hashtag/challenge as referenced from a video.
 */
export interface TikTokChallenge {
  id: string;
  /** hashtag text, no '#' */
  title: string;
  desc?: string | null;
  cover?: string | null;
  is_commerce?: boolean | null;
}

/**
 * An effect / sticker applied to a video.
 */
export interface TikTokEffectSticker {
  id: string;
  name?: string | null;
  photo_url?: string | null;
}

/**
 * An entity (hashtag mention or @user mention) inside the caption.
 */
export interface TikTokTextExtra {
  /** "hashtag" | "mention" */
  type?: string | null;
  hashtag_name?: string | null;
  user_unique_id?: string | null;
  user_id?: string | null;
  start?: number | null;
  end?: number | null;
}

/**
 * A subtitle/caption track for a video.
 */
export interface TikTokSubtitle {
  language?: string | null;
  language_code?: string | null;
  url?: string | null;
  /** ASR vs creator */
  source?: string | null;
  version?: string | null;
  format?: string | null;
}

/**
 * Moderation / availability state of a post (mobile aweme `status` block).
 */
export interface TikTokVideoStatus {
  is_delete?: boolean | null;
  allow_share?: boolean | null;
  allow_comment?: boolean | null;
  /** 0 public, 1 friends, 2 private */
  private_status?: number | null;
  in_reviewing?: boolean | null;
  reviewed?: boolean | null;
  is_prohibited?: boolean | null;
  download_status?: number | null;
  self_see?: boolean | null;
}

/**
 * Per-post interaction permissions (mobile aweme `video_control` block).
 */
export interface TikTokVideoControl {
  allow_download?: boolean | null;
  allow_duet?: boolean | null;
  allow_stitch?: boolean | null;
  allow_react?: boolean | null;
  allow_comment?: boolean | null;
  share_type?: number | null;
  prevent_download?: boolean | null;
}

/**
 * A link/shopping/POI anchor attached to a post.
 */
export interface TikTokAnchor {
  id?: string | null;
  type?: number | null;
  keyword?: string | null;
  url?: string | null;
  icon?: string | null;
}

// =============================================================================
// Video / Post
// =============================================================================

/**
 * A TikTok post (video or photo slideshow) with full metadata.
 */
export interface TikTokVideo {
  id: string;
  /** caption text */
  description: string;
  text_language?: string | null;
  create_time_utc?: number | null;
  create_time_at?: string | null;
  /** locationCreated */
  region?: string | null;
  /** web video URL */
  url: string;
  /** canonical share link (mobile share_url) */
  share_url?: string | null;
  group_id?: string | null;
  /** 0 video, 150 photo/slideshow, … */
  aweme_type?: number | null;
  /** mobile content_type label */
  content_type?: string | null;
  author?: TikTokAuthor | null;
  music?: TikTokMusic | null;
  stats: TikTokStats;
  video?: TikTokVideoMeta | null;
  status?: TikTokVideoStatus | null;
  video_control?: TikTokVideoControl | null;
  anchors: TikTokAnchor[];

  // Caption entities
  hashtags: string[];
  mentions: string[];
  text_extra: TikTokTextExtra[];
  challenges: TikTokChallenge[];
  effect_stickers: TikTokEffectSticker[];

  // Photo / slideshow posts
  is_slideshow: boolean;
  image_urls: string[];

  // Flags & settings
  is_ad: boolean;
  is_aigc?: boolean | null;
  aigc_description?: string | null;
  is_pinned: boolean;
  is_muted?: boolean | null;
  secret?: boolean | null;
  private_item?: boolean | null;
  duet_enabled?: boolean | null;
  stitch_enabled?: boolean | null;
  share_enabled?: boolean | null;
  comment_status?: string | null;
  can_repost?: boolean | null;
  is_paid_content?: boolean | null;
  is_on_this_day?: boolean | null;
  /** supports bullet comments */
  support_danmaku?: boolean | null;

  // Transcript (only on the transcript endpoint, else empty)
  subtitles: TikTokSubtitle[];
  voice_to_text?: string | null;

  // Diversification / categorization
  diversification_labels: string[];
  suggested_words: string[];
}

// =============================================================================
// User / Profile
// =============================================================================

/**
 * Aggregate counts for a user profile.
 */
export interface TikTokUserStats {
  follower_count: number;
  following_count: number;
  /** total likes received */
  heart_count: number;
  video_count: number;
  /** likes given */
  digg_count: number;
  friend_count?: number | null;
}

/**
 * A full TikTok user profile.
 */
export interface TikTokUser {
  id: string;
  /** needed to call list endpoints */
  sec_uid: string;
  /** @handle */
  unique_id: string;
  nickname?: string | null;
  /** bio */
  signature?: string | null;
  bio_link?: string | null;
  verified: boolean;
  /** enterprise_verify_reason / custom_verify text */
  verify_reason?: string | null;
  verification_type?: number | null;
  private_account: boolean;
  is_commerce_account?: boolean | null;
  /** TikTok Shop seller */
  is_seller?: boolean | null;
  is_organization?: boolean | null;
  original_musician?: boolean | null;
  is_star?: boolean | null;
  region?: string | null;
  language?: string | null;
  ins_id?: string | null;
  twitter_name?: string | null;
  youtube_channel_title?: string | null;

  avatar_thumb?: string | null;
  avatar_medium?: string | null;
  avatar_larger?: string | null;

  stats: TikTokUserStats;

  // Privacy / interaction settings
  open_favorite?: boolean | null;
  comment_setting?: number | null;
  duet_setting?: number | null;
  stitch_setting?: number | null;
  download_setting?: number | null;
  following_visibility?: number | null;

  // Live
  is_live?: boolean | null;
  room_id?: string | null;

  // Commerce
  commerce_category?: string | null;
  commerce_user_level?: number | null;
  with_shop_entry?: boolean | null;

  create_time_utc?: number | null;
  create_time_at?: string | null;

  profile_url: string;
}

// =============================================================================
// Comment
// =============================================================================

/**
 * A comment (or reply) on a video.
 */
export interface TikTokComment {
  /** cid */
  id: string;
  text: string;
  /** parent video id */
  aweme_id?: string | null;
  parent_comment_id?: string | null;
  digg_count: number;
  reply_count: number;
  create_time_utc?: number | null;
  create_time_at?: string | null;
  liked_by_author?: boolean | null;
  pinned_by_author?: boolean | null;
  comment_language?: string | null;
  status?: number | null;
  /** @users in the comment */
  mentions: string[];
  text_extra: TikTokTextExtra[];
  /** comment sticker/images */
  image_urls: string[];
  author?: TikTokAuthor | null;
  replies: TikTokComment[];
}

// =============================================================================
// Hashtag detail
// =============================================================================

/**
 * A hashtag / challenge detail.
 */
export interface TikTokHashtag {
  id: string;
  /** name without '#' */
  title: string;
  description?: string | null;
  cover?: string | null;
  profile_larger?: string | null;
  video_count?: number | null;
  view_count?: number | null;
  is_commerce?: boolean | null;
  url: string;
}

// =============================================================================
// Trending
// =============================================================================

export interface TikTokTrendingHashtag {
  name: string;
  id?: string | null;
  rank?: number | null;
  rank_diff?: number | null;
  country_code?: string | null;
  industry?: string | null;
  /** videos using it */
  publish_count?: number | null;
  view_count?: number | null;
  /** distinct creators using it (mobile source) */
  user_count?: number | null;
  is_promoted?: boolean | null;
  is_new?: boolean | null;
  url?: string | null;
}

export interface TikTokTrendingSong {
  title: string;
  id?: string | null;
  author?: string | null;
  rank?: number | null;
  rank_diff?: number | null;
  country_code?: string | null;
  duration?: number | null;
  /** videos using this sound (mobile trending metric) */
  user_count?: number | null;
  cover?: string | null;
  play_url?: string | null;
  is_new?: boolean | null;
  link?: string | null;
}

// =============================================================================
// oEmbed
// =============================================================================

export interface TikTokOEmbed {
  version: string;
  type: string;
  title?: string | null;
  author_name?: string | null;
  author_url?: string | null;
  provider_name: string;
  provider_url: string;
  html?: string | null;
  thumbnail_url?: string | null;
  thumbnail_width?: number | null;
  thumbnail_height?: number | null;
  embed_product_id?: string | null;
  embed_type?: string | null;
}

// =============================================================================
// Pagination + Response Envelopes
// =============================================================================

/**
 * Cursor pagination metadata shared by all list endpoints.
 */
export interface TikTokCursorPage {
  has_more: boolean;
  /** opaque; pass back as ?cursor= */
  cursor?: string | null;
  /** number of items in THIS page */
  count: number;
  /** search endpoints chain rid → search_id */
  search_id?: string | null;
}

/** Response from the /users/{username} endpoint. */
export interface ProfileResponse {
  user: TikTokUser;
  region: string;
}

/** Response from the /videos/{video_id} endpoint. */
export interface VideoResponse {
  video: TikTokVideo;
  region: string;
}

/** Response wrapping a cursor-paginated list of videos. */
export interface VideoListResponse {
  videos: TikTokVideo[];
  pagination: TikTokCursorPage;
  region: string;
}

/** Response from the /videos/{video_id}/comments endpoint. */
export interface CommentListResponse {
  comments: TikTokComment[];
  pagination: TikTokCursorPage;
  region: string;
}

/** Followers / following lists. */
export interface UserListResponse {
  users: TikTokAuthor[];
  pagination: TikTokCursorPage;
  region: string;
}

/** Response from the /hashtags/{name} endpoint. */
export interface HashtagResponse {
  hashtag: TikTokHashtag;
  region: string;
}

/** Response from the /music/{music_id} endpoint. */
export interface MusicResponse {
  music: TikTokMusic;
  region: string;
}

/** Response from the /search/users endpoint. */
export interface UserSearchResponse {
  users: TikTokAuthor[];
  pagination: TikTokCursorPage;
  region: string;
}

/** Response from the /search/hashtags endpoint. */
export interface HashtagSearchResponse {
  hashtags: TikTokHashtag[];
  pagination: TikTokCursorPage;
  region: string;
}

/** Response from the /videos/{video_id}/transcript endpoint. */
export interface TranscriptResponse {
  video_id: string;
  subtitles: TikTokSubtitle[];
  voice_to_text?: string | null;
  region: string;
}

/** Response from the /trending/hashtags endpoint. */
export interface TrendingHashtagsResponse {
  hashtags: TikTokTrendingHashtag[];
  region: string;
}

/** Response from the /trending/songs endpoint. */
export interface TrendingSongsResponse {
  songs: TikTokTrendingSong[];
  region: string;
}

// =============================================================================
// Ad Library (library.tiktok.com Commercial Content Library, EU-DSA transparency)
// =============================================================================

export interface TikTokAdVideo {
  video_url?: string | null;
  cover_img?: string | null;
}

export interface TikTokAd {
  id: string;
  /** advertiser name */
  name?: string | null;
  audit_status?: string | null;
  type?: string | null;
  /** epoch ms */
  first_shown_date?: number | null;
  /** epoch ms */
  last_shown_date?: number | null;
  videos: TikTokAdVideo[];
}

export interface AdLibraryPage {
  has_more: boolean;
  total?: number | null;
  /** pass to the next page request */
  search_id?: string | null;
  offset: number;
}

/** Response from the /ads/search endpoint. */
export interface AdLibrarySearchResponse {
  ads: TikTokAd[];
  pagination: AdLibraryPage;
  region: string;
}

export interface RegionInfo {
  code: string;
  country_code: string;
  locale: string;
  name: string;
}

/** Response from the /regions endpoint. */
export interface RegionsResponse {
  regions: RegionInfo[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Options for the user profile endpoint. */
export interface TikTokUserParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
}

/** Options for cursor-paginated user list endpoints (videos/followers/following/liked/reposts). */
export interface TikTokUserListParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50) */
  count?: number;
  /**
   * Opaque cursor from a previous page.
   * Only accepted by: user videos, followers, following.
   * Reposts and liked ignore this param — remove before sending.
   */
  cursor?: string;
}

/** Options for the video detail endpoint. */
export interface TikTokVideoParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Author handle (skips oEmbed lookup) */
  username?: string;
}

/** Options for the video comments endpoint. */
export interface TikTokCommentsParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50) */
  count?: number;
  /**
   * Pagination cursor from a prior response's pagination.cursor; omit for the first page.
   */
  cursor?: string;
}

/** Options for the comment replies endpoint. */
export interface TikTokCommentRepliesParams {
  /** Parent video id (required) */
  videoId: string;
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50, default 20) */
  count?: number;
  /**
   * Pagination cursor from a prior response's pagination.cursor; omit for the first page.
   */
  cursor?: string;
}

/** Options for the related-videos endpoint. */
export interface TikTokRelatedParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50) */
  count?: number;
}

/** Options for the transcript endpoint. */
export interface TikTokTranscriptParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
}

/** Options for the oEmbed endpoint. */
export interface TikTokOEmbedParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
}

/** Options for the hashtag detail endpoint. */
export interface TikTokHashtagParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
}

/** Options for hashtag/music video listings. */
export interface TikTokListVideosParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50) */
  count?: number;
  /**
   * Pagination cursor from a prior response's pagination.cursor; omit for the first page.
   */
  cursor?: string;
}

/** Options for the music detail endpoint. */
export interface TikTokMusicParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
}

/** Options for the keyword search endpoints (general/videos/users/hashtags). */
export interface TikTokSearchParams {
  /** Search keyword (required) */
  query: string;
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50) */
  count?: number;
  /**
   * Pagination cursor from a prior response's pagination.cursor; omit for the first page.
   */
  cursor?: string;
}

/** Options for the trending videos endpoint. */
export interface TikTokTrendingVideosParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Number of items to return (1-50) */
  count?: number;
}

/** Options for the trending hashtags / songs endpoints. */
export interface TikTokTrendingParams {
  /** Content region (ISO 3166-1 alpha-2, default "US") */
  region?: string;
  /** Trailing window in days (default 7) */
  period?: number;
  /** Number of items to return (1-50) */
  count?: number;
}

/** Options for the Ad Library search endpoint. */
export interface TikTokAdSearchParams {
  /** Keyword (ignored when advertiserId is set) */
  query?: string;
  /** Advertiser business id(s) for advertiser search */
  advertiser_id?: string;
  /** EU region code (the Ad Library is EU-only, default "DE") */
  region?: string;
  /** Trailing window in days (1-365, default 30) */
  days?: number;
  /** Sort order (default "last_shown_date,desc") */
  sort?: string;
  /** Result offset for pagination */
  offset?: number;
  /** Opaque search id chained from a previous page */
  search_id?: string;
  /** Number of items to return (1-50) */
  count?: number;
}
