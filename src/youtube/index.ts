/**
 * YouTube API module.
 *
 * @module youtube
 */

export { YoutubeClient } from "./client.js";
export { SearchClient as YoutubeSearchClient } from "./search.js";
export { VideosClient as YoutubeVideosClient } from "./videos.js";
export { ChannelsClient as YoutubeChannelsClient } from "./channels.js";
export { PlaylistsClient as YoutubePlaylistsClient } from "./playlists.js";
export { CommunityClient as YoutubeCommunityClient } from "./community.js";
export { ShortsClient as YoutubeShortsClient } from "./shorts.js";
export { TrendingClient as YoutubeTrendingClient } from "./trending.js";
export { MusicClient as YoutubeMusicClient } from "./music.js";
export { ReferenceClient as YoutubeReferenceClient } from "./reference.js";

// Export all types
export type {
  // Shared
  Thumbnail as YoutubeThumbnail,
  ResolveResult as YoutubeResolveResult,
  ReferenceRow as YoutubeReferenceRow,
  OEmbed as YoutubeOEmbed,
  // Video / Short / streaming
  Chapter as YoutubeChapter,
  HeatMarker as YoutubeHeatMarker,
  AudioTrack as YoutubeAudioTrack,
  Format as YoutubeFormat,
  StreamingData as YoutubeStreamingData,
  ShoppingResult as YoutubeShoppingResult,
  LiveStreamingDetails as YoutubeLiveStreamingDetails,
  RegionRestriction as YoutubeRegionRestriction,
  Video as YoutubeVideo,
  Short as YoutubeShort,
  BatchResponse as YoutubeBatchResponse,
  // Channel
  ChannelLink as YoutubeChannelLink,
  Channel as YoutubeChannel,
  ChannelAbout as YoutubeChannelAbout,
  SubscriberCount as YoutubeSubscriberCount,
  // Playlist
  PlaylistItem as YoutubePlaylistItem,
  Playlist as YoutubePlaylist,
  PlaylistItemsResponse as YoutubePlaylistItemsResponse,
  // Comment
  Comment as YoutubeComment,
  CommentsResponse as YoutubeCommentsResponse,
  RepliesResponse as YoutubeRepliesResponse,
  // Search / feed
  SearchResult as YoutubeSearchResult,
  SearchChip as YoutubeSearchChip,
  SearchResponse as YoutubeSearchResponse,
  AutocompleteResponse as YoutubeAutocompleteResponse,
  RelatedResponse as YoutubeRelatedResponse,
  HashtagResponse as YoutubeHashtagResponse,
  HomeResponse as YoutubeHomeResponse,
  ChannelVideosResponse as YoutubeChannelVideosResponse,
  ChannelTabResponse as YoutubeChannelTabResponse,
  // Transcript / captions
  TranscriptSegment as YoutubeTranscriptSegment,
  Transcript as YoutubeTranscript,
  CaptionTrack as YoutubeCaptionTrack,
  CaptionsResponse as YoutubeCaptionsResponse,
  // Trending
  TrendingItem as YoutubeTrendingItem,
  TrendingResponse as YoutubeTrendingResponse,
  // Community / live chat
  PollChoice as YoutubePollChoice,
  CommunityPost as YoutubeCommunityPost,
  CommunityResponse as YoutubeCommunityResponse,
  LiveChatMessage as YoutubeLiveChatMessage,
  LiveChatResponse as YoutubeLiveChatResponse,
  // Reference
  CategoriesResponse as YoutubeCategoriesResponse,
  LanguagesResponse as YoutubeLanguagesResponse,
  RegionsResponse as YoutubeRegionsResponse,
  MarketInfo as YoutubeMarketInfo,
  MarketsResponse as YoutubeMarketsResponse,
  // Param enums
  YoutubeSearchType,
  YoutubeSearchSort,
  YoutubeUploadDate,
  YoutubeDuration,
  YoutubeCommentSort,
  YoutubeTrendingType,
  YoutubeStreamsClient,
  // Request params
  YoutubeRegionParams,
  YoutubeSearchParams,
  YoutubeAutocompleteParams,
  YoutubeVideoParams,
  YoutubeRelatedParams,
  YoutubeCommentsParams,
  YoutubeRepliesParams,
  YoutubeTranscriptParams,
  YoutubeCaptionsParams,
  YoutubeStreamsParams,
  YoutubeLiveChatParams,
  YoutubeBatchParams,
  YoutubeOEmbedParams,
  YoutubeChannelParams,
  YoutubeChannelTabParams,
  YoutubeChannelSearchParams,
  YoutubeResolveParams,
  YoutubePlaylistParams,
  YoutubePlaylistItemsParams,
  YoutubePostParams,
  YoutubePostCommentsParams,
  YoutubeShortParams,
  YoutubeShortsBySoundParams,
  YoutubeTrendingParams,
  YoutubeTrendingShortsParams,
  YoutubeHashtagParams,
  YoutubeHomeParams,
  YoutubeMusicSearchParams,
  YoutubeCategoriesParams,
} from "./types.js";
