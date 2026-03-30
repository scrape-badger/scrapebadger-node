# Twitter API

The ScrapeBadger Twitter API provides 37+ endpoints for tweets, users, lists, communities, trends, geographic places, and real-time stream monitoring. All methods are available under `client.twitter`.

## Usage Examples

### Search Tweets

```typescript
import { ScrapeBadger } from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Basic search (returns first page)
const results = await client.twitter.tweets.search("python programming");
for (const tweet of results.data) {
  console.log(`@${tweet.username}: ${tweet.text}`);
}

// Paginate manually
if (results.hasMore) {
  const nextPage = await client.twitter.tweets.search("python programming", {
    cursor: results.nextCursor,
  });
}

// Automatic pagination with async iterators
for await (const tweet of client.twitter.tweets.searchAll("python", { maxItems: 100 })) {
  console.log(tweet.text);
}

// Collect all results into an array
import { collectAll } from "scrapebadger";

const tweets = await collectAll(
  client.twitter.tweets.searchAll("python", { maxItems: 100 })
);
console.log(`Fetched ${tweets.length} tweets`);
```

### User Operations

```typescript
// Get user by username
const user = await client.twitter.users.getByUsername("elonmusk");

// Get user by ID
const userById = await client.twitter.users.getById("44196397");

// Get extended profile info
const about = await client.twitter.users.getAbout("elonmusk");
console.log(`Account based in: ${about.account_based_in}`);
console.log(`Username changes: ${about.username_changes}`);

// Get followers
const followers = await client.twitter.users.getFollowers("elonmusk");
for (const follower of followers.data) {
  console.log(`@${follower.username}`);
}

// Iterate through all followers
for await (const follower of client.twitter.users.getFollowersAll("elonmusk", {
  maxItems: 1000,
})) {
  console.log(follower.username);
}

// Search users
const users = await client.twitter.users.search("python developer");
```

### Lists

```typescript
// Get list details
const list = await client.twitter.lists.getDetail("123456");
console.log(`${list.name}: ${list.member_count} members`);

// Get list tweets
const tweets = await client.twitter.lists.getTweets("123456");

// Get list members
const members = await client.twitter.lists.getMembers("123456");

// Search for lists
const lists = await client.twitter.lists.search("tech leaders");
```

### Communities

```typescript
// Get community details
const community = await client.twitter.communities.getDetail("123456");
console.log(`${community.name}: ${community.member_count} members`);

// Get community tweets
const tweets = await client.twitter.communities.getTweets("123456", {
  tweetType: "Latest",
});

// Search communities
const communities = await client.twitter.communities.search("python developers");
```

### Trends

```typescript
// Get trending topics
const trends = await client.twitter.trends.getTrends();
for (const trend of trends.data) {
  console.log(`${trend.name}: ${trend.tweet_count || "N/A"} tweets`);
}

// Get trends by category
const newsTrends = await client.twitter.trends.getTrends({
  category: "news",
});

// Get trends for a specific location
const usTrends = await client.twitter.trends.getPlaceTrends(23424977); // US WOEID
console.log(`Trends in ${usTrends.name}:`);
for (const trend of usTrends.trends) {
  console.log(`  - ${trend.name}`);
}

// Get available locations
const locations = await client.twitter.trends.getAvailableLocations();
```

### Geographic Places

```typescript
// Search for places
const places = await client.twitter.geo.search({ query: "San Francisco" });
for (const place of places.data) {
  console.log(`${place.full_name} (${place.place_type})`);
}

// Search by coordinates
const nearby = await client.twitter.geo.search({
  lat: 37.7749,
  long: -122.4194,
  granularity: "city",
});

// Get place details
const place = await client.twitter.geo.getDetail("5a110d312052166f");
```

### Stream Monitoring

Real-time tweet monitoring with WebSocket streaming and webhook delivery.

```typescript
import { ScrapeBadger, WebSocketStreamError } from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Create a monitor
const monitor = await client.twitter.stream.createMonitor({
  name: "Tech Leaders",
  usernames: ["elonmusk", "naval", "sama"],
  pollIntervalSeconds: 10,
  webhookUrl: "https://example.com/webhook",
});
console.log(`Created: ${monitor.id}, tier: ${monitor.pricing_tier}`);
console.log(`Credits/hr: ${monitor.estimated_credits_per_hour}`);

// List monitors
const { monitors, total } = await client.twitter.stream.listMonitors({ status: "active" });
console.log(`${total} active monitors`);

// Pause / resume
await client.twitter.stream.pauseMonitor(monitor.id);
await client.twitter.stream.resumeMonitor(monitor.id);

// Delete
await client.twitter.stream.deleteMonitor(monitor.id);
```

#### EventEmitter Streaming

```typescript
const stream = client.twitter.stream.connect({
  reconnect: true,
  reconnectDelaySeconds: 90,
});

stream.on("connected", (e) => {
  console.log("Connected, connection ID:", e.connectionId);
});

stream.on("tweet", (event) => {
  console.log(`@${event.authorUsername}: ${event.tweet.text}`);
  console.log(`  latency: ${event.latencyMs}ms`);
});

stream.on("error", (err) => {
  if (err instanceof WebSocketStreamError && err.code === 4001) {
    console.error("API key rejected");
  } else {
    console.error("Stream error:", err.message);
  }
});

stream.on("close", () => console.log("Stream closed"));

// Later: graceful disconnect
stream.close();
```

#### AsyncIterator Streaming

```typescript
import { WebSocketStreamError } from "scrapebadger";

try {
  for await (const event of client.twitter.stream.connectIter({
    reconnect: true,
    reconnectDelaySeconds: 90,
  })) {
    if (event.type === "tweet") {
      console.log(`@${event.authorUsername}: ${event.latencyMs}ms latency`);
    }
  }
} catch (err) {
  if (err instanceof WebSocketStreamError) {
    console.error("Stream failed:", err.message, err.code);
  }
}
```

#### Webhook Signature Verification

```typescript
import { verifyWebhookSignature } from "scrapebadger/twitter";
import express from "express";

const app = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["x-scrapebadger-signature"] as string;
    if (!verifyWebhookSignature("my-webhook-secret", req.body, sig)) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    const event = JSON.parse(req.body.toString());
    console.log("Received tweet:", event.tweet_id);
    res.sendStatus(200);
  }
);
```

## API Reference

### Twitter Modules

| Module | Description |
|--------|-------------|
| `client.twitter.tweets` | Tweet operations |
| `client.twitter.users` | User operations |
| `client.twitter.lists` | List operations |
| `client.twitter.communities` | Community operations |
| `client.twitter.trends` | Trend operations |
| `client.twitter.geo` | Geographic place operations |
| `client.twitter.stream` | Real-time stream monitor management and WebSocket streaming |

### Stream Client Methods

| Method | Description |
|--------|-------------|
| `createMonitor(params)` | Create a stream monitor |
| `listMonitors(options?)` | List monitors with optional status filter |
| `getMonitor(id)` | Get a monitor by ID |
| `updateMonitor(id, params)` | Partially update a monitor |
| `pauseMonitor(id)` | Pause an active monitor |
| `resumeMonitor(id)` | Resume a paused monitor |
| `deleteMonitor(id)` | Delete a monitor (irreversible) |
| `listDeliveryLogs(options?)` | List tweet delivery logs |
| `listBillingLogs(options?)` | List billing activity logs |
| `connect(options?)` | Connect via EventEmitter (`.on("tweet", handler)`) |
| `connectIter(options?)` | Connect via AsyncIterator (`for await`) |

### Utilities

| Function | Description |
|----------|-------------|
| `collectAll(asyncIterator)` | Collect async iterator results into an array |
| `verifyWebhookSignature(secret, body, header)` | Verify incoming webhook HMAC signature |

---

[Back to main README](../README.md)
