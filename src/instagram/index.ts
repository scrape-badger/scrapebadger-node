/**
 * Instagram API module.
 *
 * @module instagram
 */

export { InstagramClient } from "./client.js";
export { UsersClient as InstagramUsersClient } from "./users.js";
export { MediaClient as InstagramMediaClient } from "./media.js";
export { SearchClient as InstagramSearchClient } from "./search.js";
export {
  HashtagsClient as InstagramHashtagsClient,
  LocationsClient as InstagramLocationsClient,
  AudioClient as InstagramAudioClient,
} from "./reference.js";

// Types are exported with an `Instagram` prefix to avoid collisions with the
// generic names (User, Media, Comment, Location, Hashtag, ...) exported by
// other scraper modules from the top-level barrel.
export type {
  BioLink as InstagramBioLink,
  UserShort as InstagramUserShort,
  Hashtag as InstagramHashtag,
  Location as InstagramLocation,
  Audio as InstagramAudio,
  Resource as InstagramResource,
  Highlight as InstagramHighlight,
  Oembed as InstagramOembed,
  User as InstagramUser,
  UserAbout as InstagramUserAbout,
  Media as InstagramMedia,
  Comment as InstagramComment,
  Paginated as InstagramPaginated,
  SearchTopResponse as InstagramSearchTopResponse,
} from "./types.js";
