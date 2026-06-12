/**
 * TikTok API module.
 *
 * @module tiktok
 */

export { TikTokClient } from "./client.js";
export { UsersClient as TikTokUsersClient } from "./users.js";
export { VideosClient as TikTokVideosClient } from "./videos.js";
export { SearchClient as TikTokSearchClient } from "./search.js";
export { MusicClient as TikTokMusicClient } from "./music.js";
export { HashtagsClient as TikTokHashtagsClient } from "./hashtags.js";
export { TrendingClient as TikTokTrendingClient } from "./trending.js";
export { AdsClient as TikTokAdsClient } from "./ads.js";
export { ReferenceClient as TikTokReferenceClient } from "./reference.js";

// Export all types
export type {
  // Shared sub-models
  TikTokAuthor,
  TikTokStats,
  TikTokVideoMeta,
  TikTokMusic,
  TikTokChallenge,
  TikTokEffectSticker,
  TikTokTextExtra,
  TikTokSubtitle,
  TikTokVideoStatus,
  TikTokVideoControl,
  TikTokAnchor,
  // Video / Post
  TikTokVideo,
  // User / Profile
  TikTokUserStats,
  TikTokUser,
  // Comment
  TikTokComment,
  // Hashtag
  TikTokHashtag,
  // Trending
  TikTokTrendingHashtag,
  TikTokTrendingSong,
  // oEmbed
  TikTokOEmbed,
  // Pagination
  TikTokCursorPage,
  // Ad Library
  TikTokAdVideo,
  TikTokAd,
  AdLibraryPage as TikTokAdLibraryPage,
  RegionInfo as TikTokRegionInfo,
  // Response envelopes
  ProfileResponse as TikTokProfileResponse,
  VideoResponse as TikTokVideoResponse,
  VideoListResponse as TikTokVideoListResponse,
  CommentListResponse as TikTokCommentListResponse,
  UserListResponse as TikTokUserListResponse,
  HashtagResponse as TikTokHashtagResponse,
  MusicResponse as TikTokMusicResponse,
  UserSearchResponse as TikTokUserSearchResponse,
  HashtagSearchResponse as TikTokHashtagSearchResponse,
  TranscriptResponse as TikTokTranscriptResponse,
  TrendingHashtagsResponse as TikTokTrendingHashtagsResponse,
  TrendingSongsResponse as TikTokTrendingSongsResponse,
  AdLibrarySearchResponse as TikTokAdLibrarySearchResponse,
  RegionsResponse as TikTokRegionsResponse,
  // Request params
  TikTokUserParams,
  TikTokUserListParams,
  TikTokVideoParams,
  TikTokCommentsParams,
  TikTokCommentRepliesParams,
  TikTokRelatedParams,
  TikTokTranscriptParams,
  TikTokOEmbedParams,
  TikTokHashtagParams,
  TikTokListVideosParams,
  TikTokMusicParams,
  TikTokSearchParams,
  TikTokTrendingVideosParams,
  TikTokTrendingParams,
  TikTokAdSearchParams,
} from "./types.js";
