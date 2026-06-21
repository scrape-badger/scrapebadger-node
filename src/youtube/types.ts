/**
 * TypeScript types for YouTube API responses.
 *
 * These interfaces mirror the backend `youtube_scraper` response schema
 * field-for-field (see `scrapers/youtube/src/youtube_scraper/models/*.py`).
 * Optional / nullable backend fields are typed as `Type | null`; backend list
 * fields default to `[]` and are typed as arrays. Every datetime field ships in
 * BOTH `*_utc` (number) and `*_at` (string) form.
 *
 * All list endpoints paginate via an opaque `continuation` token (no page
 * numbers). Region is controlled by `gl` (content region) + `hl` (UI language).
 */

// =============================================================================
// Shared Types
// =============================================================================

/**
 * A single image variant.
 */
export interface Thumbnail {
  url: string;
  width: number | null;
  height: number | null;
}

/**
 * Result of resolving a handle / custom URL to canonical ids.
 */
export interface ResolveResult {
  input: string;
  /** "channel" | "video" | "playlist" */
  type: string | null;
  channel_id: string | null;
  channel_username: string | null;
  video_id: string | null;
  playlist_id: string | null;
  canonical_url: string | null;
}

/**
 * A reference lookup row (category / language / region).
 */
export interface ReferenceRow {
  id: string;
  title: string;
}

/**
 * YouTube public oEmbed response (https://www.youtube.com/oembed).
 */
export interface OEmbed {
  type: string | null;
  version: string | null;
  title: string | null;
  author_name: string | null;
  author_url: string | null;
  provider_name: string | null;
  provider_url: string | null;
  thumbnail_url: string | null;
  thumbnail_width: number | null;
  thumbnail_height: number | null;
  width: number | null;
  height: number | null;
  html: string | null;
}

// =============================================================================
// Video / Short / Streaming
// =============================================================================

/**
 * A video chapter (manual or auto).
 */
export interface Chapter {
  title: string | null;
  start_seconds: number | null;
  start_time_text: string | null;
  thumbnail: string | null;
}

/**
 * A most-replayed graph point.
 */
export interface HeatMarker {
  start_seconds: number | null;
  duration_seconds: number | null;
  /** 0.0-1.0 normalized score */
  intensity: number | null;
}

/**
 * A multi-language audio track (auto-dubbing / original).
 */
export interface AudioTrack {
  id: string | null;
  display_name: string | null;
  language: string | null;
  is_default: boolean | null;
  is_original: boolean | null;
}

/**
 * A single streaming format (muxed or adaptive).
 */
export interface Format {
  itag: number | null;
  mime_type: string | null;
  codecs: string | null;
  bitrate: number | null;
  average_bitrate: number | null;
  width: number | null;
  height: number | null;
  fps: number | null;
  quality: string | null;
  quality_label: string | null;
  audio_quality: string | null;
  audio_sample_rate: number | null;
  audio_channels: number | null;
  /** stable-volume (dynamic range compression) audio */
  is_drc: boolean | null;
  loudness_db: number | null;
  audio_track: AudioTrack | null;
  content_length: number | null;
  approx_duration_ms: number | null;
  /** may require a PO token (best-effort) */
  url: string | null;
  signature_cipher: string | null;
  projection_type: string | null;
}

/**
 * Streaming metadata from `player.streamingData` (best-effort URLs).
 */
export interface StreamingData {
  expires_in_seconds: number | null;
  hls_manifest_url: string | null;
  dash_manifest_url: string | null;
  formats: Format[];
  adaptive_formats: Format[];
}

/**
 * A product shelf entry attached to a video.
 */
export interface ShoppingResult {
  title: string | null;
  price: string | null;
  vendor: string | null;
  thumbnail: string | null;
  link: string | null;
}

/**
 * Live/premiere timing details.
 */
export interface LiveStreamingDetails {
  actual_start_at: string | null;
  actual_start_utc: number | null;
  actual_end_at: string | null;
  actual_end_utc: number | null;
  scheduled_start_at: string | null;
  scheduled_start_utc: number | null;
  scheduled_end_at: string | null;
  scheduled_end_utc: number | null;
  concurrent_viewers: number | null;
  active_live_chat_id: string | null;
}

/**
 * Region availability restrictions.
 */
export interface RegionRestriction {
  allowed: string[];
  blocked: string[];
}

/**
 * Full video detail — merged `player` + `next` (the flagship entity).
 */
export interface Video {
  // Core identity
  video_id: string;
  title: string | null;
  url: string | null;
  description: string | null;
  description_links: Record<string, unknown>[];
  length_seconds: number | null;
  /** HH:MM:SS */
  duration: string | null;

  // Engagement
  view_count: number | null;
  view_count_text: string | null;
  like_count: number | null;
  like_count_text: string | null;
  comment_count: number | null;
  /** private platform-wide since 2021 (null) */
  dislike_count: number | null;

  // Channel
  channel_id: string | null;
  channel_name: string | null;
  channel_username: string | null;
  channel_url: string | null;
  channel_thumbnail: string | null;
  channel_is_verified: boolean | null;
  is_official_artist: boolean | null;
  number_of_subscribers: number | null;
  subscriber_count_text: string | null;

  // Dates
  published_at: string | null;
  published_utc: number | null;
  upload_at: string | null;
  upload_utc: number | null;
  published_time_text: string | null;

  // Classification
  keywords: string[];
  tags: string[];
  hashtags: string[];
  category: string | null;
  category_id: string | null;
  topic_categories: string[];

  // Media
  thumbnails: Thumbnail[];
  thumbnail: string | null;
  storyboards: Record<string, unknown> | null;
  chapters: Chapter[];
  heatmap: HeatMarker[];

  // Live / premiere
  is_live_content: boolean | null;
  live_now: boolean | null;
  is_upcoming: boolean | null;
  is_post_live_dvr: boolean | null;
  premiere_utc: number | null;
  premiere_at: string | null;
  live_streaming_details: LiveStreamingDetails | null;

  // Status / safety
  is_family_safe: boolean | null;
  is_age_restricted: boolean | null;
  is_members_only: boolean | null;
  is_unlisted: boolean | null;
  is_private: boolean | null;
  is_crawlable: boolean | null;
  is_shorts_eligible: boolean | null;
  is_short: boolean | null;
  allow_ratings: boolean | null;
  is_monetized: boolean | null;
  comments_turned_off: boolean | null;
  has_paid_product_placement: boolean | null;
  available_countries: string[];
  region_restriction: RegionRestriction | null;
  playability_status: string | null;
  playability_reason: string | null;

  // Technical
  /** hd / sd */
  definition: string | null;
  /** 2d / 3d */
  dimension: string | null;
  /** rectangular / 360 */
  projection: string | null;
  captions_available: boolean | null;
  caption_languages: string[];

  // Rich shelves (from next)
  shopping_results: ShoppingResult[];
  additional_info: Record<string, unknown>[];
  game_info: Record<string, unknown> | null;
  end_screen_videos: Record<string, unknown>[];
  related_videos: Record<string, unknown>[];
  related_videos_continuation: string | null;

  // Sound (shorts)
  sound_id: string | null;
  sound_title: string | null;
  sound_artist: string | null;

  // Streams (only when requested)
  streams: StreamingData | null;
  embed_url: string | null;

  scraped_at: string | null;
  scraped_utc: number | null;
}

/**
 * A Shorts (vertical reel) — Video subtype with `is_short=true`.
 */
export interface Short extends Video {
  thumbnail_vertical: string | null;
}

/**
 * Response for POST /videos/batch.
 */
export interface BatchResponse {
  videos: Video[];
  errors: Record<string, unknown>[];
  count: number;
}

// =============================================================================
// Channel
// =============================================================================

/**
 * An external link from a channel's about page / header.
 */
export interface ChannelLink {
  title: string | null;
  url: string | null;
}

/**
 * Full channel detail (browse About tab + header).
 */
export interface Channel {
  channel_id: string;
  title: string | null;
  channel_name: string | null;
  /** @handle */
  channel_username: string | null;
  custom_url: string | null;
  channel_url: string | null;
  description: string | null;
  description_links: ChannelLink[];

  number_of_subscribers: number | null;
  subscriber_count_text: string | null;
  hidden_subscriber_count: boolean | null;
  channel_total_videos: number | null;
  channel_total_videos_text: string | null;
  channel_total_views: number | null;
  channel_total_views_text: string | null;

  joined_at: string | null;
  joined_utc: number | null;
  country: string | null;
  channel_location: string | null;

  keywords: string[];
  tags: string[];
  is_verified: boolean | null;
  is_age_restricted: boolean | null;
  is_family_safe: boolean | null;
  is_monetized: boolean | null;
  is_auto_generated: boolean | null;
  made_for_kids: boolean | null;

  avatar: string | null;
  banner: string | null;
  tv_banner: string | null;
  mobile_banner: string | null;
  avatar_thumbnails: Thumbnail[];
  banner_thumbnails: Thumbnail[];

  external_links: ChannelLink[];
  tabs: string[];
  available_countries: string[];

  related_channels: Record<string, unknown>[];
  latest_videos: Record<string, unknown>[];

  scraped_at: string | null;
  scraped_utc: number | null;
}

/**
 * Lightweight channel about payload.
 */
export interface ChannelAbout {
  channel_id: string;
  description: string | null;
  links: ChannelLink[];
  number_of_subscribers: number | null;
  subscriber_count_text: string | null;
  channel_total_views: number | null;
  channel_total_videos: number | null;
  joined_at: string | null;
  joined_utc: number | null;
  country: string | null;
}

/**
 * Fast subscriber-count-only response.
 */
export interface SubscriberCount {
  channel_id: string;
  number_of_subscribers: number | null;
  subscriber_count_text: string | null;
}

// =============================================================================
// Playlist
// =============================================================================

/**
 * A single entry in a playlist.
 */
export interface PlaylistItem {
  position: number | null;
  video_id: string;
  title: string | null;
  url: string | null;
  length_seconds: number | null;
  duration: string | null;
  channel_id: string | null;
  channel_name: string | null;
  channel_url: string | null;
  thumbnails: Thumbnail[];
  thumbnail: string | null;
  view_count: number | null;
  view_count_text: string | null;
  published_time_text: string | null;
  is_playable: boolean | null;
  /** per-playlist-entry id */
  set_video_id: string | null;
}

/**
 * Full playlist detail + first page of items.
 */
export interface Playlist {
  playlist_id: string;
  title: string | null;
  description: string | null;
  playlist_url: string | null;
  video_count: number | null;
  view_count: number | null;
  view_count_text: string | null;
  last_updated_text: string | null;
  channel_id: string | null;
  channel_name: string | null;
  channel_url: string | null;
  channel_is_verified: boolean | null;
  thumbnails: Thumbnail[];
  thumbnail: string | null;
  privacy_status: string | null;
  is_mix: boolean | null;
  videos: PlaylistItem[];
  continuation: string | null;
  scraped_at: string | null;
  scraped_utc: number | null;
}

/**
 * A continuation page of playlist items.
 */
export interface PlaylistItemsResponse {
  playlist_id: string | null;
  items: PlaylistItem[];
  continuation: string | null;
}

// =============================================================================
// Comment
// =============================================================================

/**
 * A single comment or reply.
 */
export interface Comment {
  comment_id: string;
  text: string | null;
  published_time_text: string | null;
  published_utc: number | null;
  author: string | null;
  author_channel_id: string | null;
  author_channel_url: string | null;
  author_thumbnail: string | null;
  author_is_verified: boolean | null;
  author_is_artist: boolean | null;
  author_is_channel_owner: boolean | null;
  author_badges: string[];
  like_count: number | null;
  reply_count: number | null;
  has_creator_heart: boolean | null;
  is_pinned: boolean | null;
  is_reply: boolean | null;
  reply_to_cid: string | null;
  replies_continuation: string | null;
  /** Super Thanks purchase amount */
  paid_comment_amount: string | null;
  video_id: string | null;
}

/**
 * A page of top-level comments.
 */
export interface CommentsResponse {
  video_id: string | null;
  comments: Comment[];
  comment_count: number | null;
  sorting_tokens: Record<string, unknown>[];
  continuation: string | null;
}

/**
 * A page of replies to a comment.
 */
export interface RepliesResponse {
  comment_id: string | null;
  replies: Comment[];
  continuation: string | null;
}

// =============================================================================
// Search / Feed
// =============================================================================

/**
 * A polymorphic search/feed result (keyed by `type`).
 */
export interface SearchResult {
  /** "video" | "channel" | "playlist" | "movie" | "short" */
  type: string;
  position: number | null;

  // video / short / movie
  video_id: string | null;
  title: string | null;
  url: string | null;
  thumbnails: Thumbnail[];
  thumbnail: string | null;
  duration: string | null;
  length_seconds: number | null;
  view_count: number | null;
  view_count_text: string | null;
  short_view_count_text: string | null;
  published_time_text: string | null;
  published_at: string | null;
  published_utc: number | null;
  description_snippet: string | null;
  badges: string[];
  extensions: string[];
  is_live: boolean | null;
  is_short: boolean | null;
  is_members_only: boolean | null;

  // channel association (for video/playlist results)
  channel_id: string | null;
  channel_name: string | null;
  channel_url: string | null;
  channel_thumbnail: string | null;
  channel_is_verified: boolean | null;

  // channel result
  subscriber_count_text: string | null;
  number_of_subscribers: number | null;
  video_count_text: string | null;
  channel_username: string | null;
  is_verified: boolean | null;

  // playlist result
  playlist_id: string | null;
  video_count: number | null;
  first_video_id: string | null;
}

/**
 * A search filter chip / refinement.
 */
export interface SearchChip {
  title: string | null;
  is_selected: boolean | null;
  continuation: string | null;
}

/**
 * A page of search results.
 */
export interface SearchResponse {
  query: string | null;
  results: SearchResult[];
  total_results: number | null;
  estimated_results: number | null;
  chips: SearchChip[];
  did_you_mean: string | null;
  showing_results_for: string | null;
  refinements: string[];
  related_searches: Record<string, unknown>[];
  continuation: string | null;
}

/**
 * Keyword suggestions for a query prefix.
 */
export interface AutocompleteResponse {
  query: string;
  suggestions: string[];
}

/**
 * Related videos for a video (secondaryResults).
 */
export interface RelatedResponse {
  video_id: string | null;
  results: SearchResult[];
  continuation: string | null;
}

/**
 * Videos under a hashtag.
 */
export interface HashtagResponse {
  tag: string;
  results: SearchResult[];
  continuation: string | null;
}

/**
 * Guest home / recommendations feed (non-deterministic, best-effort).
 */
export interface HomeResponse {
  results: SearchResult[];
  continuation: string | null;
}

/**
 * A page of a channel's videos / shorts / streams.
 */
export interface ChannelVideosResponse {
  channel_id: string | null;
  videos: SearchResult[];
  continuation: string | null;
}

/**
 * A generic page of a channel tab (videos/shorts/streams/playlists).
 */
export interface ChannelTabResponse {
  channel_id: string | null;
  tab: string | null;
  items: SearchResult[];
  continuation: string | null;
}

// =============================================================================
// Transcript / Captions
// =============================================================================

/**
 * A single timed transcript line.
 */
export interface TranscriptSegment {
  start_ms: number | null;
  end_ms: number | null;
  duration_ms: number | null;
  start_time_text: string | null;
  text: string | null;
}

/**
 * A full video transcript in the selected language.
 */
export interface Transcript {
  video_id: string;
  language: string | null;
  language_name: string | null;
  /** asr | manual */
  type: string | null;
  is_translatable: boolean | null;
  available_transcripts: Record<string, unknown>[];
  translation_languages: Record<string, unknown>[];
  segments: TranscriptSegment[];
  full_text: string | null;
  srt: string | null;
  vtt: string | null;
}

/**
 * An available caption track (from player captions tracklist).
 */
export interface CaptionTrack {
  language: string | null;
  language_name: string | null;
  /** asr | manual */
  type: string | null;
  is_translatable: boolean | null;
  base_url: string | null;
}

/**
 * The list of available caption tracks for a video.
 */
export interface CaptionsResponse {
  video_id: string;
  tracks: CaptionTrack[];
  translation_languages: Record<string, unknown>[];
}

// =============================================================================
// Trending
// =============================================================================

/**
 * A trending video / short.
 */
export interface TrendingItem {
  position: number | null;
  /** Now | Music | Gaming | Movies */
  category: string | null;
  video_id: string | null;
  title: string | null;
  url: string | null;
  thumbnails: Thumbnail[];
  thumbnail: string | null;
  duration: string | null;
  length_seconds: number | null;
  view_count: number | null;
  view_count_text: string | null;
  published_time_text: string | null;
  description_snippet: string | null;
  channel_id: string | null;
  channel_name: string | null;
  channel_url: string | null;
  channel_thumbnail: string | null;
  channel_is_verified: boolean | null;
  badges: string[];
  is_live: boolean | null;
  is_short: boolean | null;
}

/**
 * A page of trending items.
 */
export interface TrendingResponse {
  gl: string | null;
  type: string | null;
  items: TrendingItem[];
  continuation: string | null;
}

// =============================================================================
// Community / Live Chat
// =============================================================================

/**
 * A single poll option on a community post.
 */
export interface PollChoice {
  text: string | null;
  percentage: number | null;
  votes: number | null;
  image: string | null;
}

/**
 * A channel community / posts-tab entry.
 */
export interface CommunityPost {
  post_id: string;
  post_url: string | null;
  /** text | poll | image | video | shared */
  post_type: string | null;
  text: string | null;
  text_links: Record<string, unknown>[];
  channel_id: string | null;
  channel_name: string | null;
  channel_url: string | null;
  channel_thumbnail: string | null;
  published_time_text: string | null;
  published_utc: number | null;
  like_count: number | null;
  like_count_text: string | null;
  comment_count: number | null;
  poll_choices: PollChoice[];
  poll_total_votes: number | null;
  images: Thumbnail[];
  attached_video: Record<string, unknown> | null;
  shared_post: Record<string, unknown> | null;
  scraped_at: string | null;
  scraped_utc: number | null;
}

/**
 * A page of community posts.
 */
export interface CommunityResponse {
  channel_id: string | null;
  posts: CommunityPost[];
  continuation: string | null;
}

/**
 * A single live-chat / chat-replay message.
 */
export interface LiveChatMessage {
  message_id: string | null;
  /** text | super_chat | super_sticker | membership */
  message_type: string | null;
  text: string | null;
  author: string | null;
  author_channel_id: string | null;
  author_thumbnail: string | null;
  author_badges: string[];
  is_moderator: boolean | null;
  is_member: boolean | null;
  is_verified: boolean | null;
  timestamp_usec: number | null;
  timestamp_text: string | null;
  video_offset_time_msec: number | null;
  /** super chat / sticker amount */
  purchase_amount: string | null;
  body_background_color: string | null;
}

/**
 * A page of live-chat messages.
 */
export interface LiveChatResponse {
  video_id: string | null;
  messages: LiveChatMessage[];
  continuation: string | null;
  is_replay: boolean | null;
}

// =============================================================================
// Reference (zero-credit)
// =============================================================================

/**
 * Response from the /categories endpoint.
 */
export interface CategoriesResponse {
  gl: string;
  categories: ReferenceRow[];
}

/**
 * Response from the /languages endpoint.
 */
export interface LanguagesResponse {
  languages: ReferenceRow[];
}

/**
 * Response from the /regions endpoint.
 */
export interface RegionsResponse {
  regions: ReferenceRow[];
}

/**
 * A single geo-targeted scraper market (for /markets).
 */
export interface MarketInfo {
  /** Content region code (e.g. "US") */
  gl: string;
  /** UI language code (e.g. "en") */
  hl: string;
  /** Market display name */
  name: string;
}

/**
 * Response from the /markets endpoint.
 */
export interface MarketsResponse {
  markets: MarketInfo[];
}

// =============================================================================
// Param Enums
// =============================================================================

/** Result-type filter for search. */
export type YoutubeSearchType = "video" | "channel" | "playlist" | "movie" | "all";

/** Sort order for search. */
export type YoutubeSearchSort = "relevance" | "date" | "views" | "rating";

/** Upload-date filter for search. */
export type YoutubeUploadDate = "hour" | "today" | "week" | "month" | "year";

/** Duration filter for search. */
export type YoutubeDuration = "short" | "medium" | "long";

/** Comment sort order. */
export type YoutubeCommentSort = "top" | "newest";

/** Trending feed type. */
export type YoutubeTrendingType = "now" | "music" | "gaming" | "movies";

/** Player client for the streams endpoint. */
export type YoutubeStreamsClient = "IOS" | "ANDROID" | "WEB";

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Region parameters shared by most endpoints. */
export interface YoutubeRegionParams {
  /** Content region (US, GB, DE…) */
  gl?: string;
  /** UI language */
  hl?: string;
}

/** Parameters for the search endpoint. */
export interface YoutubeSearchParams extends YoutubeRegionParams {
  /** Search keywords (required) */
  query: string;
  /** Result-type filter */
  type?: YoutubeSearchType;
  /** Sort order */
  sort_by?: YoutubeSearchSort;
  /** Upload-date filter */
  upload_date?: YoutubeUploadDate;
  /** Duration filter */
  duration?: YoutubeDuration;
  /** Comma list: hd,4k,360,vr180,3d,hdr,cc,subtitles,live,location */
  features?: string;
  /** Pagination token */
  continuation?: string;
}

/** Options for the autocomplete endpoint. */
export interface YoutubeAutocompleteParams extends YoutubeRegionParams {}

/** Options for the video detail endpoint. */
export interface YoutubeVideoParams extends YoutubeRegionParams {}

/** Options for the related-videos endpoint. */
export interface YoutubeRelatedParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the video comments endpoint. */
export interface YoutubeCommentsParams extends YoutubeRegionParams {
  /** Comment sort order (default: "top") */
  sort_by?: YoutubeCommentSort;
  /** Pagination token */
  continuation?: string;
}

/** Options for the comment replies endpoint. */
export interface YoutubeRepliesParams extends YoutubeRegionParams {
  /** Replies continuation token (from a comment; required) */
  continuation: string;
}

/** Options for the transcript endpoint. */
export interface YoutubeTranscriptParams extends YoutubeRegionParams {
  /** BCP-47 language code */
  language?: string;
}

/** Options for the captions endpoint. */
export interface YoutubeCaptionsParams extends YoutubeRegionParams {}

/** Options for the streams endpoint. */
export interface YoutubeStreamsParams {
  /** Content region */
  gl?: string;
  /** Player client (default: "IOS") */
  client?: YoutubeStreamsClient;
}

/** Options for the live-chat endpoint. */
export interface YoutubeLiveChatParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
  /** Fetch chat replay for a finished stream */
  replay?: boolean;
}

/** Parameters for the batch video endpoint. */
export interface YoutubeBatchParams extends YoutubeRegionParams {
  /** Video ids to fetch (≤50, required) */
  video_ids: string[];
}

/** Options for the oEmbed endpoint. */
export interface YoutubeOEmbedParams {
  /** A YouTube video/playlist/channel URL (required) */
  url: string;
}

/** Options for the channel detail / about / subscriber_count endpoints. */
export interface YoutubeChannelParams extends YoutubeRegionParams {}

/** Options for a channel tab (videos/shorts/streams/playlists/community) endpoint. */
export interface YoutubeChannelTabParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the in-channel search endpoint. */
export interface YoutubeChannelSearchParams extends YoutubeRegionParams {
  /** Search keywords (required) */
  query: string;
  /** Pagination token */
  continuation?: string;
}

/** Options for the channel resolve endpoint. */
export interface YoutubeResolveParams extends YoutubeRegionParams {
  /** @handle or custom name */
  handle?: string;
  /** Full channel/video/playlist URL */
  url?: string;
}

/** Options for the playlist detail / mix endpoints. */
export interface YoutubePlaylistParams extends YoutubeRegionParams {}

/** Options for the playlist items endpoint. */
export interface YoutubePlaylistItemsParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the community post detail endpoint. */
export interface YoutubePostParams extends YoutubeRegionParams {}

/** Options for the community post comments endpoint. */
export interface YoutubePostCommentsParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the single-short endpoint. */
export interface YoutubeShortParams extends YoutubeRegionParams {}

/** Options for the shorts-by-sound endpoint. */
export interface YoutubeShortsBySoundParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the trending endpoint. */
export interface YoutubeTrendingParams extends YoutubeRegionParams {
  /** Trending feed type (default: "now") */
  type?: YoutubeTrendingType;
  /** Pagination token */
  continuation?: string;
}

/** Options for the trending-shorts endpoint. */
export interface YoutubeTrendingShortsParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the hashtag endpoint. */
export interface YoutubeHashtagParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the home-feed endpoint. */
export interface YoutubeHomeParams extends YoutubeRegionParams {
  /** Pagination token */
  continuation?: string;
}

/** Options for the music-search endpoint. */
export interface YoutubeMusicSearchParams extends YoutubeRegionParams {
  /** Search keywords (required) */
  query: string;
  /** Pagination token */
  continuation?: string;
}

/** Options for the categories reference endpoint. */
export interface YoutubeCategoriesParams {
  /** Content region (default: "US") */
  gl?: string;
}
