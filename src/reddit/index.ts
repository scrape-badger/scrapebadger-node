/**
 * Reddit API module.
 *
 * @module reddit
 */

export { RedditClient } from "./client.js";
export { SearchClient as RedditSearchClient } from "./search.js";
export { PostsClient as RedditPostsClient } from "./posts.js";
export { SubredditsClient as RedditSubredditsClient } from "./subreddits.js";
export { UsersClient as RedditUsersClient } from "./users.js";

// Export all types
export type {
  // Core entity types
  RedditPost,
  RedditComment,
  RedditSubreddit,
  RedditUser,
  RedditRule,
  RedditWikiPage,
  RedditTrophy,
  // Pagination
  RedditPagination,
  // Response types
  SearchPostsResponse,
  SubredditPostsResponse,
  PostDetailResponse,
  PostCommentsResponse,
  PostDuplicatesResponse,
  SubredditDetailResponse,
  SubredditRulesResponse,
  SubredditWikiPagesResponse,
  WikiPageResponse,
  UserProfileResponse as RedditUserProfileResponse,
  UserPostsResponse,
  UserCommentsResponse,
  UserModeratedResponse,
  UserTrophiesResponse,
  SearchSubredditsResponse,
  SearchUsersResponse,
  TrendingPostsResponse,
  PopularSubredditsResponse,
  DomainPostsResponse,
} from "./types.js";
