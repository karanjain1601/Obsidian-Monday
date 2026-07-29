---
title: Redis Geospatial and Advanced Data Structures
aliases: [Redis Geo, Redis HyperLogLog, Redis Bitmap, Redis Bloom Filter]
tags: [Redis, Geospatial, HyperLogLog, Bitmap, BloomFilter, AdvancedTypes]
domain: Redis
difficulty: Advanced
created: 2026-07-29
related: [Redis_Data_Structures, Redis_Caching_Patterns, Redis_Performance_and_Monitoring]
status: complete
---

# Redis Geospatial and Advanced Data Structures

> [!abstract] TL;DR
> Beyond the core five data structures, Redis offers specialized types: Geospatial (lat/lon encoded as Sorted Set scores for proximity search), HyperLogLog (12KB approximate cardinality counting, ~0.81% error), Bitmaps (bit-level flags — 512MB = 4 billion bits), and Bloom Filters (probabilistic membership testing via RedisBloom module). Each trades exactness or generality for dramatic memory savings or speed.

---

## Geospatial

Geo commands store latitude/longitude as members of a Sorted Set, with the score being a 52-bit geohash of the coordinate. This allows range queries on geographical proximity using the Sorted Set's sorted properties.

### Commands

```bash
# GEOADD — add members with coordinates (lng, lat order!)
GEOADD stores 13.361389 38.115556 "Palermo"
GEOADD stores 15.087269 37.502669 "Catania"
GEOADD stores 2.349014 48.864716 "Paris"
GEOADD stores -87.629798 41.878114 "Chicago"

# Add multiple in one call
GEOADD drivers:available -73.935242 40.730610 "driver:42" -73.950000 40.720000 "driver:99"

# GEOPOS — retrieve stored coordinates
GEOPOS stores "Palermo"        # → [["13.36138933897018433", "38.11555639549629859"]]

# GEODIST — distance between two members
GEODIST stores Palermo Catania              # → "166274.1516" (meters, default)
GEODIST stores Palermo Catania km           # → "166.2742" (kilometers)
GEODIST stores Palermo Catania mi           # → "103.3182" (miles)
GEODIST stores Palermo Catania ft           # → distance in feet

# GEOSEARCH — find members within radius or box (Redis 6.2+, replaces deprecated GEORADIUS)
GEOSEARCH stores FROMMEMBER Palermo BYRADIUS 200 km ASC
GEOSEARCH stores FROMLONLAT 15.0 37.0 BYRADIUS 100 km ASC WITHCOORD WITHDIST COUNT 5
# BYBOX alternative: rectangular search area
GEOSEARCH stores FROMLONLAT 0.0 48.0 BYBOX 400 300 km ASC

# GEOSEARCHSTORE — store results in a new key
GEOSEARCHSTORE dest:nearby stores FROMLONLAT -73.9 40.7 BYRADIUS 5 km ASC COUNT 50

# GEOHASH — get geohash string (for external services / debugging)
GEOHASH stores Palermo Catania  # → ["sqc8b59zny0", "sqdtr74hyu0"]
```

### How Geospatial Works Internally

```
Coordinate → 52-bit Geohash → Stored as Sorted Set score

Bounding box search → score range query on Sorted Set
Radius search → multiple bounding boxes to cover the circle

Precision: ~0.6mm at the equator (52-bit encoding)
Max supported coordinates: -180 to 180 lon, -85.05 to 85.05 lat
```

### Nearby Driver / Store Locator Pattern

```bash
# Update driver location (every 5 seconds from mobile)
GEOADD drivers:available -73.935242 40.730610 "driver:42"

# Driver goes offline (remove from geo set)
ZREM drivers:available "driver:42"

# Find 5 nearest available drivers within 3km
GEOSEARCH drivers:available FROMLONLAT -73.940000 40.735000 BYRADIUS 3 km ASC WITHDIST COUNT 5
# → [["driver:42", "0.4231"], ["driver:99", "1.2341"], ...]

# Store nearby results for a passenger request (cache for 30s)
GEOSEARCHSTORE passenger:101:nearby drivers:available FROMLONLAT -73.940000 40.735000 BYRADIUS 5 km ASC COUNT 20 STOREDIST
EXPIRE passenger:101:nearby 30
```

---

## HyperLogLog

HyperLogLog (HLL) is a probabilistic algorithm for counting unique elements (cardinality estimation) using fixed memory (~12KB) regardless of the number of unique elements, with ~0.81% standard error.

### Commands

```bash
# PFADD — add elements (returns 1 if internal state changed, 0 if no change)
PFADD visitors:2026-07-29 "user:42" "user:99" "user:42"   # → 1 (state changed)
PFADD visitors:2026-07-29 "user:42"                       # → 0 (no change — already counted)
PFADD visitors:2026-07-29 "user:101" "user:202"           # → 1

# PFCOUNT — approximate cardinality
PFCOUNT visitors:2026-07-29                   # → ~3 (approximately 3 unique visitors)
PFCOUNT visitors:2026-07-28 visitors:2026-07-29   # → union count across multiple HLLs

# PFMERGE — merge multiple HLLs into one
PFMERGE visitors:week visitors:2026-07-23 visitors:2026-07-24 visitors:2026-07-25 visitors:2026-07-26 visitors:2026-07-27 visitors:2026-07-28 visitors:2026-07-29
PFCOUNT visitors:week    # → weekly unique visitors
```

### HyperLogLog Properties

| Property | Value |
|----------|-------|
| Memory | 12KB per HLL (fixed, regardless of cardinality) |
| Standard error | ~0.81% |
| Max cardinality | 2^64 (18 quintillion) |
| Operations | PFADD O(1), PFCOUNT O(1) for single, O(N) for merge |
| Supports deletion | No — cannot remove individual elements |
| Exact count | No — probabilistic estimate only |

### Use Cases

```bash
# Daily unique page views per URL
PFADD pageviews:home:2026-07-29 "user:42" "ip:10.0.0.1"
PFCOUNT pageviews:home:2026-07-29    # → ~daily unique visitors

# Weekly/monthly rollup by merging daily HLLs
PFMERGE pageviews:home:2026-07 pageviews:home:2026-07-01 ... pageviews:home:2026-07-29

# A/B test unique exposure counting
PFADD experiment:checkout_v2:exposed "user:42" "user:99"
PFCOUNT experiment:checkout_v2:exposed   # approximate exposure count

# Real-time dashboard: unique active users in last 5 minutes
# (Use sliding window: maintain one HLL per minute, PFMERGE last 5)
```

### HLL vs Set for unique counting

| | HyperLogLog | Set |
|--|-------------|-----|
| Memory for 1M uniques | ~12KB | ~64MB |
| Exact count | No (~0.81% error) | Yes |
| Supports deletion | No | Yes |
| Merge across time windows | PFMERGE O(N) | SUNIONSTORE O(N×M) |
| Best for | Dashboards, analytics, approximate counters | Small sets where exact count is required |

---

## Bitmaps

Bitmaps use String type internally (a Redis string is a byte array). `SETBIT`/`GETBIT` operate on individual bits. A 512MB string represents 4 billion bits.

### Commands

```bash
# SETBIT — set bit at offset to 0 or 1
SETBIT user:42:active_days 0   1   # bit 0 = day 0 (Jan 1) → user was active
SETBIT user:42:active_days 1   0   # bit 1 = day 1 (Jan 2) → not active
SETBIT user:42:active_days 364 1   # bit 364 = Dec 31 → active
# Key grows to accommodate highest offset set

# GETBIT — read a specific bit
GETBIT user:42:active_days 0   # → 1

# BITCOUNT — count set bits (ones)
BITCOUNT user:42:active_days              # total active days this year
BITCOUNT user:42:active_days 0 3          # bits 0–31 (byte range, not bit range!)
# Note: byte range [0, N] = bits [0, (N+1)*8 - 1]

# BITPOS — find first set or clear bit
BITPOS user:42:active_days 1              # → first day user was active
BITPOS user:42:active_days 0              # → first day user was NOT active
BITPOS user:42:active_days 1 10 20        # search within bytes 10–20

# BITOP — bitwise operations between multiple keys (result stored in destkey)
BITOP AND active_both user:42:active_days user:99:active_days   # days both active
BITOP OR  active_either user:42:active_days user:99:active_days # days either active
BITOP XOR active_diff user:42:active_days user:99:active_days   # days one but not both
BITOP NOT active_42_inverted user:42:active_days                # days NOT active
```

### Bitmap Use Cases

```bash
# Daily active user (DAU) tracking — per user-per day
SETBIT dau:2026-07-29 42  1   # user_id=42 was active today
SETBIT dau:2026-07-29 99  1   # user_id=99 was active today
BITCOUNT dau:2026-07-29       # → count of DAU

# Feature flag rollout — bit per user (offset = user_id)
SETBIT feature:dark_mode 42  1   # user 42 gets dark mode
GETBIT feature:dark_mode 42      # → 1 (enabled for this user)
BITCOUNT feature:dark_mode       # count users with this flag

# Memory: 1 bit per user
# For 100M users: 100M bits = 12.5 MB (extremely efficient!)

# User login streak
SETBIT streak:user:42 <day_of_year> 1
BITCOUNT streak:user:42 <start_byte> <end_byte>   # days in streak window

# Real-time concurrent connections bitmap (one bit per connection ID)
SETBIT connections:active <connection_id> 1
BITCOUNT connections:active   # total active connections
```

### Memory Efficiency

```
Regular SET per user: "user:42:active" → ~50 bytes per key
Bitmap at offset 42: ~6 bytes of string (enough to hold bit 42)
For 1 billion users: 1 byte × (1B/8) = 125 MB for a full bitmap

vs. Set: SADD dau:today user_id → ~40 bytes per member × 1M DAU = 40 MB
```

Bitmaps win when:
- User IDs are dense (sequential integers with no large gaps)
- Operations involve counting across all users

Sets win when:
- User IDs are sparse (UUID/random → huge bitmap with mostly zeros)
- You need membership check (SISMEMBER) not just count

---

## Bloom Filter (RedisBloom Module)

A Bloom filter is a probabilistic data structure that answers "definitely not in set" or "probably in set" — false negatives impossible, false positives possible.

> [!note] Module Required
> Bloom Filters require the **RedisBloom** module. Available via `redis-stack-server`, Redis Cloud, or compiled separately.

### Commands (RedisBloom)

```bash
# Create with explicit capacity and error rate
BF.RESERVE email:blacklist 0.001 1000000
# error_rate=0.1%, initial_capacity=1M items

# Add items
BF.ADD email:blacklist "spam@badactor.com"     # → 1 (added)
BF.ADD email:blacklist "spam@badactor.com"     # → 0 (may already exist — probabilistic)

# Add multiple
BF.MADD email:blacklist "spam1@x.com" "spam2@x.com" "spam3@x.com"

# Check existence
BF.EXISTS email:blacklist "spam@badactor.com"  # → 1 (probably in set)
BF.EXISTS email:blacklist "legit@gmail.com"    # → 0 (definitely not in set)

# Check multiple
BF.MEXISTS email:blacklist "spam@badactor.com" "legit@gmail.com"
# → [1, 0]

# Info
BF.INFO email:blacklist    # → capacity, size, filter count, insertion count, expansion rate

# Scalable Bloom filter (grows automatically as it fills)
BF.RESERVE expandable:bloom 0.001 100000 EXPANSION 2 NONSCALING
# EXPANSION 2 = each overflow filter is 2x size of previous
```

### Bloom Filter Properties

| Property | Value |
|----------|-------|
| False negative | Impossible — "not in set" is always correct |
| False positive | Possible — "probably in set" may be wrong |
| Deletion | Not supported (standard Bloom) |
| Memory | O(1) per item (configured at creation) |
| Lookup | O(k) — k = number of hash functions |

### Error Rate and Size Trade-offs

```
For 1M items at 1% error rate: ~1.2 MB
For 1M items at 0.1% error rate: ~1.8 MB
For 10M items at 1% error rate: ~12 MB

Formula: m = -n * ln(p) / (ln(2))^2
  m = bits needed
  n = expected items
  p = false positive rate
```

### Use Cases

```bash
# Cache penetration prevention
# Check bloom filter before hitting cache/DB
BF.EXISTS known:user:ids <user_id>
# → 0: definitely doesn't exist → return 404 immediately (skip cache + DB)
# → 1: might exist → proceed to cache/DB lookup

# Email deduplication (newsletters)
BF.EXISTS sent:emails:campaign:42 "user@example.com"
# → 0: send email + BF.ADD
# → 1: skip (probably already sent)

# URL visited tracking (web crawler)
BF.EXISTS crawled:urls "https://example.com/page"
# → 0: crawl it + BF.ADD
# → 1: skip

# Password breach check (Have I Been Pwned style)
# Store known breached password hashes in bloom filter
BF.EXISTS breached:password:hashes <sha1_of_password>
# → 1: probably breached → warn user
```

---

## Comparison: Advanced Structures

| Structure | Memory | Exact | Deletion | Best For |
|-----------|--------|-------|----------|----------|
| HyperLogLog | 12KB fixed | No (~0.81%) | No | Unique cardinality at scale |
| Bitmap | O(max_id/8) | Yes | SETBIT 0 | Binary flags per integer ID |
| Bloom Filter | ~1.2MB/1M items | No (FP possible) | No | Membership pre-filter |
| Set | O(N) members | Yes | SREM | Exact membership, set ops |

---

## Common Pitfalls

- **Bitmap with sparse/non-integer IDs** — Setting bit at offset 1,000,000,000 allocates ~125MB immediately. Use bitmaps only for dense sequential integer IDs.
- **GEORADIUSBYMEMBER deprecated** — Use `GEOSEARCH FROMMEMBER` instead. `GEORADIUS`/`GEORADIUSBYMEMBER` are deprecated in Redis 6.2.
- **HyperLogLog merging accuracy** — `PFMERGE` is accurate but merging many HLLs with similar cardinalities can have higher error than individual HLLs. Test with your data.
- **Bloom filter capacity planning** — If you insert more items than the configured capacity, the error rate rises above the configured threshold. Use `BF.RESERVE` with headroom (2x expected items) or use scalable Bloom filters with `EXPANSION`.
- **Bloom filter false positives in cache penetration** — A 1% false positive rate means 1% of non-existent IDs still hit your DB. This is fine for DoS protection but account for it in capacity planning.
- **BITCOUNT byte range vs bit range** — `BITCOUNT key 0 3` counts bits in bytes 0–3 (bits 0–31), not bits 0–3. This is a common source of off-by-8 bugs. Use `BITCOUNT key 0 0` for the first byte (bits 0–7).

---

## Review Questions

1. **Geospatial internals** — `GEOADD` stores coordinates as a Sorted Set score. Explain how a geohash encodes two-dimensional coordinates into a single integer, and why this encoding allows efficient radius searches using Sorted Set range queries.
2. **HyperLogLog design** — You need to count unique visitors to your website. With 10M daily uniques, compare the memory cost of HyperLogLog vs a Redis Set. When would you choose the Set despite its higher memory cost?
3. **Bloom filter false positives** — Your Bloom filter has a 1% false positive rate for cache penetration protection. An attacker sends 10,000 requests for known-bad user IDs. How many DB queries does the attacker force through? Compare with no bloom filter. Is 1% the right error rate threshold?
4. **Bitmap vs HyperLogLog for DAU** — You want to track Daily Active Users (DAU). User IDs are 64-bit integers but sequentially assigned (1, 2, 3, ...). Compare using a Bitmap (SETBIT dau:{date} user_id 1) vs HyperLogLog (PFADD dau:{date} user_id) for 100M users. Which uses less memory? Which gives exact counts?

---

## Related

- [[Redis_Data_Structures]] — core data structures and their time complexities
- [[Redis_Caching_Patterns]] — Bloom filter for cache penetration prevention
- [[Redis_Performance_and_Monitoring]] — memory usage monitoring for advanced structures
- [[_MOC_Database_Master]] — probabilistic data structures in database engineering

---

#Redis #Geospatial #HyperLogLog #Bitmap #BloomFilter #AdvancedTypes
