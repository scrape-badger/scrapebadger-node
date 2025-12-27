# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-01

### Added

- Initial release of the ScrapeBadger Node.js SDK
- Full TypeScript support with complete type definitions
- Twitter API client with sub-clients for:
  - Tweets (get, search, replies, retweeters, favoriters, similar)
  - Users (profiles, followers, following, search)
  - Lists (details, tweets, members, subscribers, search)
  - Communities (details, tweets, members, moderators, search)
  - Trends (trending topics, place trends, locations)
  - Geo (place details, search)
- Automatic pagination with async iterators
- Built-in retry logic with exponential backoff
- Typed exceptions for error handling
- ESM and CommonJS module support
- `collectAll` utility for collecting paginated results
