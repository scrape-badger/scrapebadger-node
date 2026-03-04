# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-03-05

### Added

- **Twitter Streams**: Real-time tweet monitoring via WebSocket and webhooks
  - `StreamClient` with full monitor CRUD: `createMonitor`, `listMonitors`, `getMonitor`, `updateMonitor`, `pauseMonitor`, `resumeMonitor`, `deleteMonitor`
  - WebSocket streaming via `connect()` (EventEmitter) and `connectIter()` (AsyncIterator) with auto-reconnect
  - `verifyWebhookSignature()` utility for HMAC-SHA256 webhook verification
  - Delivery log and billing log listing: `listDeliveryLogs`, `listBillingLogs`
  - Full TypeScript types: `StreamMonitor`, `StreamMonitorList`, `TweetEvent`, `ConnectedEvent`, `PingEvent`, `ErrorEvent`, `DeliveryLog`, `BillingLog`
  - `WebSocketStreamError` exception for stream connection failures
  - `ConflictError` exception for HTTP 409 responses (e.g. duplicate monitor name)

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
