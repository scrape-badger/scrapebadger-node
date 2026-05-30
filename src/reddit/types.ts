/**
 * TypeScript types for Reddit API responses.
 *
 * This module contains all the data types used by the Reddit API client.
 *
 * Fields mirror what Reddit's authenticated `.json` API returns for each entity.
 * Per-viewer-session fields (tied to the scraping account) and moderator-only
 * fields are deliberately omitted, as are flair richtext arrays (in favour of
 * the resolved scalar flair fields).
 */

// =============================================================================
// Core Entity Types
// =============================================================================

/**
 * An award attached to a post/comment (element of `all_awardings`).
 */
export interface RedditAward {
  /** Award identifier */
  id: string | null;
  /** Award name */
  name: string;
  /** Number of times this award was given */
  count: number;
  /** Coin price of the award */
  coin_price: number;
  /** Coin reward granted by the award */
  coin_reward: number;
  /** Award description */
  description: string | null;
  /** Award icon URL */
  icon_url: string | null;
  /** Award type */
  award_type: string | null;
}

/**
 * A Reddit post (link or self post).
 */
export interface RedditPost {
  // Identity
  /** Unique post identifier (without t3_ prefix) */
  id: string;
  /** Fullname with t3_ prefix */
  fullname: string;
  /** Post title */
  title: string;
  /** Author username */
  author: string;
  /** Author fullname (t2_ prefixed) */
  author_fullname: string | null;
  // Body
  /** Self post text body */
  selftext: string;
  /** Self post text as HTML */
  selftext_html: string | null;
  // Link
  /** External or self URL */
  url: string;
  /** Permalink to post on Reddit */
  permalink: string;
  /** Post domain */
  domain: string;
  // Subreddit
  /** Subreddit name (without r/ prefix) */
  subreddit: string;
  /** Subreddit fullname (t5_ prefixed) */
  subreddit_id: string | null;
  /** Subreddit with r/ prefix */
  subreddit_name_prefixed: string | null;
  /** Subreddit type (public, private, restricted, etc.) */
  subreddit_type: string | null;
  /** Subreddit subscriber count */
  subreddit_subscribers: number;
  // Score / engagement
  /** Post score (upvotes minus downvotes) */
  score: number;
  /** Number of upvotes */
  ups: number;
  /** Number of downvotes */
  downs: number;
  /** Ratio of upvotes to total votes */
  upvote_ratio: number;
  /** Number of comments */
  num_comments: number;
  /** Number of crossposts */
  num_crossposts: number;
  /** Total number of awards received */
  total_awards_received: number;
  /** View count (null if unavailable) */
  view_count: number | null;
  /** Number of gildings */
  gilded: number;
  // Timestamps
  /** Post creation timestamp (Unix) */
  created_utc: number;
  /** Post creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Edit timestamp (Unix) if edited, otherwise false */
  edited: boolean | number;
  // Content flags / state
  /** Whether the post is a self (text) post */
  is_self: boolean;
  /** Whether the post is a video */
  is_video: boolean;
  /** Whether the post is a gallery */
  is_gallery: boolean;
  /** Whether the post is a meta post */
  is_meta: boolean;
  /** Whether the post is original content */
  is_original_content: boolean;
  /** Whether the post is indexable by robots */
  is_robot_indexable: boolean;
  /** Whether the post can be crossposted */
  is_crosspostable: boolean;
  /** Whether the post links to a Reddit media domain */
  is_reddit_media_domain: boolean;
  /** Whether the post is media only */
  media_only: boolean;
  /** Whether the post is marked NSFW */
  is_nsfw: boolean;
  /** Whether the post is marked as a spoiler */
  is_spoiler: boolean;
  /** Whether the post is stickied */
  is_stickied: boolean;
  /** Whether the post is locked */
  locked: boolean;
  /** Whether the post is archived */
  archived: boolean;
  /** Whether the post is pinned */
  pinned: boolean;
  /** Whether the post is quarantined */
  quarantine: boolean;
  /** Whether the score is hidden */
  hide_score: boolean;
  /** Whether the post is in contest mode */
  contest_mode: boolean;
  /** Whether live comments are allowed */
  allow_live_comments: boolean;
  /** Whether reply notifications are enabled */
  send_replies: boolean;
  /** Distinguished status (moderator, admin, etc.) */
  distinguished: string | null;
  /** Category the post was removed by, if any */
  removed_by_category: string | null;
  /** Suggested sort for comments */
  suggested_sort: string | null;
  /** Discussion type */
  discussion_type: string | null;
  /** Top awarded type */
  top_awarded_type: string | null;
  // Post flair
  /** Post flair text (null if no flair) */
  link_flair_text: string | null;
  /** Post flair type */
  link_flair_type: string | null;
  /** Post flair CSS class */
  link_flair_css_class: string | null;
  /** Post flair template ID */
  link_flair_template_id: string | null;
  /** Post flair background color */
  link_flair_background_color: string | null;
  /** Post flair text color */
  link_flair_text_color: string | null;
  // Author flair / meta
  /** Author flair text */
  author_flair_text: string | null;
  /** Author flair type */
  author_flair_type: string | null;
  /** Author flair CSS class */
  author_flair_css_class: string | null;
  /** Author flair template ID */
  author_flair_template_id: string | null;
  /** Author flair background color */
  author_flair_background_color: string | null;
  /** Author flair text color */
  author_flair_text_color: string | null;
  /** Whether the author has Reddit Premium */
  author_premium: boolean;
  /** Whether the author has Patreon flair */
  author_patreon_flair: boolean;
  // Media
  /** Thumbnail URL */
  thumbnail: string | null;
  /** Thumbnail width in pixels */
  thumbnail_width: number | null;
  /** Thumbnail height in pixels */
  thumbnail_height: number | null;
  /** Media metadata */
  media: Record<string, unknown> | null;
  /** Media embed metadata */
  media_embed: Record<string, unknown> | null;
  /** Secure media metadata */
  secure_media: Record<string, unknown> | null;
  /** Secure media embed metadata */
  secure_media_embed: Record<string, unknown> | null;
  // Awards
  /** All awards received by the post */
  all_awardings: RedditAward[];
  /** Gildings metadata */
  gildings: Record<string, unknown>;
}

/**
 * A Reddit comment.
 */
export interface RedditComment {
  /** Unique comment identifier (without t1_ prefix) */
  id: string;
  /** Fullname with t1_ prefix */
  fullname: string;
  /** Comment body text */
  body: string;
  /** Comment body as HTML */
  body_html: string | null;
  /** Author username */
  author: string;
  /** Author fullname (t2_ prefixed) */
  author_fullname: string | null;
  /** Subreddit name (without r/ prefix) */
  subreddit: string;
  /** Subreddit fullname (t5_ prefixed) */
  subreddit_id: string | null;
  /** Subreddit with r/ prefix */
  subreddit_name_prefixed: string | null;
  /** Subreddit type (public, private, restricted, etc.) */
  subreddit_type: string | null;
  /** Post ID this comment belongs to (link_id) */
  post_id: string | null;
  /** Parent fullname this comment replies to */
  parent_id: string | null;
  /** Permalink to comment */
  permalink: string;
  // Score / engagement
  /** Comment score (upvotes minus downvotes) */
  score: number;
  /** Number of upvotes */
  ups: number;
  /** Number of downvotes */
  downs: number;
  /** Controversiality score */
  controversiality: number;
  /** Total number of awards received */
  total_awards_received: number;
  /** Number of gildings */
  gilded: number;
  /** Whether the score is hidden */
  score_hidden: boolean;
  /** Depth level (0 for top-level comments) */
  depth: number;
  // Timestamps
  /** Comment creation timestamp (Unix) */
  created_utc: number;
  /** Comment creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Edit timestamp (Unix) if edited, otherwise false */
  edited: boolean | number;
  // Flags / state
  /** Whether the comment author is the post submitter */
  is_submitter: boolean;
  /** Whether the comment is stickied */
  is_stickied: boolean;
  /** Whether the comment is locked */
  locked: boolean;
  /** Whether the comment is archived */
  archived: boolean;
  /** Whether the comment is collapsed */
  collapsed: boolean;
  /** Reason the comment was collapsed */
  collapsed_reason: string | null;
  /** Whether reply notifications are enabled */
  send_replies: boolean;
  /** Distinguished status (moderator, admin, etc.) */
  distinguished: string | null;
  /** Comment type */
  comment_type: string | null;
  // Author flair / meta
  /** Author flair text */
  author_flair_text: string | null;
  /** Author flair type */
  author_flair_type: string | null;
  /** Author flair CSS class */
  author_flair_css_class: string | null;
  /** Author flair template ID */
  author_flair_template_id: string | null;
  /** Author flair background color */
  author_flair_background_color: string | null;
  /** Author flair text color */
  author_flair_text_color: string | null;
  /** Whether the author has Reddit Premium */
  author_premium: boolean;
  // Awards
  /** All awards received by the comment */
  all_awardings: RedditAward[];
  /** Gildings metadata */
  gildings: Record<string, unknown>;
  /** Nested replies (empty array if none) */
  replies: RedditComment[];
}

/**
 * A Reddit subreddit.
 */
export interface RedditSubreddit {
  /** Unique subreddit identifier */
  id: string;
  /** Fullname with t5_ prefix */
  fullname: string;
  /** Subreddit name (display_name, without r/ prefix) */
  name: string;
  /** Subreddit with r/ prefix */
  display_name_prefixed: string | null;
  /** Subreddit title */
  title: string;
  /** Full sidebar description (markdown) */
  description: string;
  /** Full sidebar description as HTML */
  description_html: string | null;
  /** Short public description */
  public_description: string;
  /** Short public description as HTML */
  public_description_html: string | null;
  /** Subreddit URL path */
  url: string;
  /** Subscriber count */
  subscribers: number;
  /** Creation timestamp (Unix) */
  created_utc: number;
  /** Creation time as ISO 8601 UTC string */
  created_at: string | null;
  // Type / flags
  /** Subreddit type (public, private, restricted, etc.) */
  subreddit_type: string | null;
  /** Primary language */
  lang: string | null;
  /** Whether the subreddit is marked NSFW */
  is_nsfw: boolean;
  /** Whether the subreddit is quarantined */
  quarantine: boolean;
  /** Whether the wiki is enabled */
  wiki_enabled: boolean;
  /** Whether the subreddit is over 18 */
  over18: boolean;
  // Submission settings
  /** Allowed submission type */
  submission_type: string | null;
  /** Submission guidelines text */
  submit_text: string;
  /** Submission guidelines text as HTML */
  submit_text_html: string | null;
  /** Label for the submit text button */
  submit_text_label: string | null;
  /** Label for the submit link button */
  submit_link_label: string | null;
  /** Whether image submissions are allowed */
  allow_images: boolean;
  /** Whether video submissions are allowed */
  allow_videos: boolean;
  /** Whether gallery submissions are allowed */
  allow_galleries: boolean;
  /** Whether poll submissions are allowed */
  allow_polls: boolean;
  /** Whether spoiler tagging is enabled */
  spoilers_enabled: boolean;
  /** Whether the original content tag is enabled */
  original_content_tag_enabled: boolean;
  /** Whether all content is original content */
  all_original_content: boolean;
  /** Whether posting is restricted */
  restrict_posting: boolean;
  /** Whether commenting is restricted */
  restrict_commenting: boolean;
  /** Whether free-form reports are allowed */
  free_form_reports: boolean;
  /** Whether media is shown */
  show_media: boolean;
  /** Whether followers are accepted */
  accept_followers: boolean;
  /** Whether link flair is enabled */
  link_flair_enabled: boolean;
  /** Link flair position */
  link_flair_position: string | null;
  /** Minutes for which comment scores are hidden */
  comment_score_hide_mins: number;
  /** Suggested comment sort */
  suggested_comment_sort: string | null;
  /** Advertiser category */
  advertiser_category: string | null;
  // Branding
  /** Community icon URL */
  community_icon: string | null;
  /** Icon image URL */
  icon_img: string | null;
  /** Banner image URL */
  banner_img: string | null;
  /** Banner background image URL */
  banner_background_image: string | null;
  /** Header image URL */
  header_img: string | null;
  /** Header title */
  header_title: string | null;
  /** Primary color */
  primary_color: string | null;
  /** Key color */
  key_color: string | null;
  /** Banner background color */
  banner_background_color: string | null;
}

/**
 * The profile subreddit (u/<name>) embedded in a user's `about` payload.
 */
export interface RedditUserSubreddit {
  /** Display name */
  display_name: string;
  /** Display name with prefix */
  display_name_prefixed: string | null;
  /** Title */
  title: string;
  /** Short public description */
  public_description: string;
  /** Subscriber count */
  subscribers: number;
  /** URL path */
  url: string;
  /** Subreddit type */
  subreddit_type: string | null;
  /** Whether the profile subreddit is over 18 */
  over_18: boolean;
  /** Icon image URL */
  icon_img: string | null;
  /** Banner image URL */
  banner_img: string | null;
  /** Community icon URL */
  community_icon: string | null;
  /** Primary color */
  primary_color: string | null;
}

/**
 * A Reddit user profile.
 */
export interface RedditUser {
  /** User identifier (without t2_ prefix) */
  id: string | null;
  /** Username (without u/ prefix) */
  name: string;
  /** Username with u/ prefix */
  display_name_prefixed: string | null;
  // Karma
  /** Post karma */
  link_karma: number;
  /** Comment karma */
  comment_karma: number;
  /** Awardee karma */
  awardee_karma: number;
  /** Awarder karma */
  awarder_karma: number;
  /** Combined total karma */
  total_karma: number;
  // Timestamps
  /** Account creation timestamp (Unix) */
  created_utc: number;
  /** Account creation time as ISO 8601 UTC string */
  created_at: string | null;
  // Flags
  /** Whether the account has Reddit Premium */
  is_gold: boolean;
  /** Whether the user is a Reddit employee */
  is_employee: boolean;
  /** Whether the user is a moderator */
  is_mod: boolean;
  /** Whether the user is a friend */
  is_friend: boolean;
  /** Whether the account is verified */
  verified: boolean;
  /** Whether the account has a verified email */
  has_verified_email: boolean;
  /** Whether the profile is hidden from robots */
  hide_from_robots: boolean;
  /** Whether the user accepts followers */
  accept_followers: boolean;
  // Avatar
  /** Avatar icon URL */
  icon_img: string | null;
  /** Snoovatar image URL */
  snoovatar_img: string | null;
  // Profile subreddit
  /** The user's profile subreddit */
  subreddit: RedditUserSubreddit | null;
}

/**
 * A subreddit rule.
 */
export interface RedditRule {
  /** Rule priority order */
  priority: number;
  /** Short name / title of the rule */
  short_name: string;
  /** Full rule description (markdown) */
  description: string;
  /** Full rule description as HTML */
  description_html: string | null;
  /** Violation reason */
  violation_reason: string | null;
  /** Rule creation timestamp (Unix) */
  created_utc: number;
  /** Rule kind */
  kind: string | null;
}

/**
 * A subreddit wiki page.
 */
export interface RedditWikiPage {
  /** Wiki page title/slug */
  title: string;
  /** Page content (markdown) */
  content_md: string;
  /** Page content as HTML */
  content_html: string | null;
  /** Author of latest revision */
  revision_by: string | null;
  /** Revision timestamp (Unix), null if unknown */
  revision_date: number | null;
  /** Revision identifier */
  revision_id: string | null;
  /** Whether the page may be revised */
  may_revise: boolean;
  /** Reason associated with the page */
  reason: string | null;
}

/**
 * A Reddit user trophy.
 */
export interface RedditTrophy {
  /** Trophy identifier */
  id: string | null;
  /** Award identifier */
  award_id: string | null;
  /** Trophy name */
  name: string;
  /** Trophy description */
  description: string | null;
  /** Trophy icon URL (icon_70) */
  icon_url: string | null;
  /** 40px icon URL */
  icon_40: string | null;
  /** 70px icon URL */
  icon_70: string | null;
  /** URL associated with the trophy */
  url: string | null;
  /** Timestamp the trophy was granted (Unix) */
  granted_at: number | null;
}

/**
 * A subreddit a user moderates (from `/user/{u}/moderated_subreddits`).
 */
export interface RedditModeratedSubreddit {
  /** Subreddit fullname (t5_ prefixed) */
  fullname: string | null;
  /** Subreddit id */
  sr: string | null;
  /** Subreddit display name */
  name: string;
  /** Subreddit with r/ prefix */
  display_name_prefixed: string | null;
  /** Subreddit display name with r/ prefix (from sr field) */
  sr_display_name_prefixed: string | null;
  /** Subreddit title */
  title: string;
  /** Subreddit URL path */
  url: string;
  /** Subscriber count */
  subscribers: number;
  /** Subreddit type */
  subreddit_type: string | null;
  /** Whether the subreddit is over 18 */
  over_18: boolean;
  /** Community icon URL */
  community_icon: string | null;
  /** Icon image URL */
  icon_img: string | null;
  /** Banner image URL */
  banner_img: string | null;
  /** Primary color */
  primary_color: string | null;
  /** Key color */
  key_color: string | null;
  /** Creation timestamp (Unix) */
  created_utc: number;
  /** Creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Moderator permissions held by the user */
  mod_permissions: string[];
}

// =============================================================================
// Pagination
// =============================================================================

/**
 * Pagination metadata for list responses.
 */
export interface RedditPagination {
  /** Cursor for fetching the next page (null if no more pages) */
  after: string | null;
  /** Cursor for fetching the previous page (null if on first page) */
  before: string | null;
  /** Total number of items fetched so far */
  count: number;
  /** Maximum number of items per page */
  limit: number;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Response from the post search endpoint.
 */
export interface SearchPostsResponse {
  /** List of matching posts */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Search query string */
  query: string;
  /** Sort method used */
  sort: string;
}

/**
 * Response from the subreddit posts endpoint.
 */
export interface SubredditPostsResponse {
  /** List of posts in the subreddit */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Subreddit name */
  subreddit: string;
  /** Sort method used */
  sort: string;
}

/**
 * Response from the post detail endpoint.
 */
export interface PostDetailResponse {
  /** Full post details */
  post: RedditPost;
}

/**
 * Response from the post comments endpoint.
 */
export interface PostCommentsResponse {
  /** Post details */
  post: RedditPost;
  /** Top-level comments with nested replies */
  comments: RedditComment[];
  /** Pagination metadata */
  pagination: RedditPagination;
}

/**
 * Response from the post duplicates endpoint.
 */
export interface PostDuplicatesResponse {
  /** The original post */
  original: RedditPost;
  /** Cross-posts and duplicate submissions */
  duplicates: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
}

/**
 * Response from the subreddit detail endpoint.
 */
export interface SubredditDetailResponse {
  /** Full subreddit details */
  subreddit: RedditSubreddit;
}

/**
 * Response from the subreddit rules endpoint.
 */
export interface SubredditRulesResponse {
  /** List of subreddit rules */
  rules: RedditRule[];
  /** Subreddit name */
  subreddit: string;
  /** Site-wide rules */
  site_rules: string[];
}

/**
 * Response from the subreddit wiki pages list endpoint.
 */
export interface SubredditWikiPagesResponse {
  /** List of wiki page slugs */
  pages: string[];
  /** Subreddit name */
  subreddit: string;
}

/**
 * Response from the wiki page endpoint.
 */
export interface WikiPageResponse {
  /** The wiki page content */
  page: RedditWikiPage;
  /** Subreddit name */
  subreddit: string;
}

/**
 * Response from the user profile endpoint.
 */
export interface UserProfileResponse {
  /** Full user profile */
  user: RedditUser;
}

/**
 * Response from the user posts endpoint.
 */
export interface UserPostsResponse {
  /** List of user's posts */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Username */
  username: string;
}

/**
 * Response from the user comments endpoint.
 */
export interface UserCommentsResponse {
  /** List of user's comments */
  comments: RedditComment[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Username */
  username: string;
}

/**
 * Response from the user moderated subreddits endpoint.
 */
export interface UserModeratedResponse {
  /** Subreddits moderated by the user */
  subreddits: RedditModeratedSubreddit[];
  /** Username */
  username: string;
}

/**
 * Response from the user trophies endpoint.
 */
export interface UserTrophiesResponse {
  /** List of trophies awarded to the user */
  trophies: RedditTrophy[];
  /** Username */
  username: string;
}

/**
 * Response from the subreddit search endpoint.
 */
export interface SearchSubredditsResponse {
  /** List of matching subreddits */
  subreddits: RedditSubreddit[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Search query string */
  query: string;
}

/**
 * Response from the user search endpoint.
 */
export interface SearchUsersResponse {
  /** List of matching users */
  users: RedditUser[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Search query string */
  query: string;
}

/**
 * Response from the trending posts endpoint.
 */
export interface TrendingPostsResponse {
  /** List of trending posts */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Sort method used */
  sort: string;
}

/**
 * Response from the popular subreddits endpoint.
 */
export interface PopularSubredditsResponse {
  /** List of popular subreddits */
  subreddits: RedditSubreddit[];
  /** Pagination metadata */
  pagination: RedditPagination;
}

/**
 * Response from the domain posts endpoint.
 */
export interface DomainPostsResponse {
  /** List of posts linking to the domain */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Domain name */
  domain: string;
}
