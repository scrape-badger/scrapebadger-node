# Amazon API

The ScrapeBadger Amazon API provides access to Amazon product data across 14 endpoints: keyword search, autocomplete, product detail, offers, reviews, bestsellers, new releases, deals, category browse, seller profile/products/feedback, and reference data (markets, categories). All methods are available via `client.amazon`.

[Back to main README](../README.md)

## Sub-clients

| Sub-client | Methods | Endpoints |
|------------|---------|-----------|
| `client.amazon.search` | `search`, `autocomplete` | `/v1/amazon/search`, `/v1/amazon/autocomplete` |
| `client.amazon.products` | `get`, `offers`, `reviews` | `/v1/amazon/products/{asin}`, `.../offers`, `.../reviews` |
| `client.amazon.listings` | `bestsellers`, `newReleases`, `deals`, `category` | `/v1/amazon/bestsellers`, `/new-releases`, `/deals`, `/category` |
| `client.amazon.sellers` | `get`, `products`, `feedback` | `/v1/amazon/sellers/{id}`, `.../products`, `.../feedback` |
| `client.amazon.reference` | `markets`, `categories` | `/v1/amazon/markets`, `/v1/amazon/categories` |

## Usage Examples

### Search

```typescript
const client = new ScrapeBadger({ apiKey: "your-key" });

const results = await client.amazon.search.search({
  query: "wireless headphones",
  domain: "com",
  min_price: 20,
  max_price: 200,
  sort_by: "price_low_to_high",
});
for (const item of results.results) {
  console.log(`${item.position}. ${item.title} - ${item.price?.raw ?? "N/A"}`);
}

// Autocomplete
const suggestions = await client.amazon.search.autocomplete("lapt");
```

### Product Detail / Offers / Reviews

```typescript
const detail = await client.amazon.products.get("B08N5WRWNW", { domain: "com" });
console.log(`${detail.product.title} by ${detail.product.brand}`);

const offers = await client.amazon.products.offers("B08N5WRWNW");
console.log(`${offers.total_offers} offers`);

const reviews = await client.amazon.products.reviews("B08N5WRWNW", {
  sort_by: "recent",
  verified_only: true,
});
```

### Listings (bestsellers / new releases / deals / category)

```typescript
const top = await client.amazon.listings.bestsellers({ category: "electronics" });
const newReleases = await client.amazon.listings.newReleases({ category: "books" });
const deals = await client.amazon.listings.deals();
const category = await client.amazon.listings.category({ node: "172282", sort_by: "featured" });
```

### Sellers

```typescript
const profile = await client.amazon.sellers.get("A2L77EE7U53NWQ");
console.log(`${profile.seller.name}: ${profile.seller.rating}*`);

const products = await client.amazon.sellers.products("A2L77EE7U53NWQ", { page: 1 });
const feedback = await client.amazon.sellers.feedback("A2L77EE7U53NWQ");
```

### Reference Data

```typescript
const markets = await client.amazon.reference.markets();
for (const m of markets.markets) {
  console.log(`${m.code}: ${m.domain} (${m.currency})`);
}

const categories = await client.amazon.reference.categories();
```
