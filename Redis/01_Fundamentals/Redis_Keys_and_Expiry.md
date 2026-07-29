---
title: Redis Keys and Expiry
aliases: [Redis Key Management, Redis TTL, Redis Eviction, Redis SCAN]
tags: [Redis, KeyManagement, Expiry, Eviction, SCAN]
domain: Redis
difficulty: Beginner
created: 2026-07-29
related: [Redis_Data_Structures, Redis_Overview, Redis_Performance_and_Monitoring, Redis_with_Python]
status: complete
---

# Redis Keys and Expiry

> [!abstract] TL;DR
> Redis key management involves naming conventions, TTL (time-to-live) mechanics, safe key enumeration with SCAN vs KEYS, and eviction policies that govern what happens when Redis hits `maxmemory`. Getting these right is the difference between a stable, memory-bounded Redis and one that quietly grows unbounded or evicts the wrong keys.

---

## Key Naming Conventions

Redis keys are arbitrary binary-safe strings. Convention is **hierarchical with colons** as separators:

```
<domain>:<type>:<identifier>[:<subtype>]
```

### Examples

```bash
# Entity objects
user:42:profile          # user with id=42, profile hash
user:42:session          # session for user 42
product:99:details       # product 99 full details
product:99:price         # product 99 current price (separate key for TTL control)

# Aggregations / lists
leaderboard:chess:global     # global chess leaderboard (sorted set)
queue:emails:pending         # email job queue (list)

# Rate limiting
ratelimit:user:42:api        # API rate limit for user 42 (counter or sorted set)
ratelimit:ip:10.0.0.1:login  # login rate limit for an IP

# Distributed locks
lock:job:nightly_billing     # distributed lock for nightly billing job
lock:resource:inventory:99   # lock on inventory item 99

# Cache versioning (bump prefix to invalidate without SCAN)
v2:user:42:profile           # v1 keys become dead weight and expire naturally

# Feature flags
flag:dark_mode               # global feature flag
flag:dark_mode:user:42       # per-user override
```

### Naming rules

| Rule | Reason |
|------|--------|
| Use `:` as separator | Consistent, renders as tree in RedisInsight |
| Use `domain:type:id` order | Easier wildcard patterns: `user:*` matches all user keys |
| Avoid spaces | Spaces require quoting in redis-cli |
| Keep keys ≤ 100 bytes | Each key is stored in a hash table; long keys waste memory |
| Avoid very short single-char keys | Hard to grep/debug; save bytes differently |
| Include version prefix for cacheability | `v2:...` allows instant full-cache invalidation without SCAN |

---

## Key Expiry (TTL)

### Setting expiry

```bash
# Set TTL at creation time (preferred — atomic)
SET session:abc "data" EX 3600        # expire in 3600 seconds
SET session:abc "data" PX 3600000     # expire in 3600000 milliseconds
SET session:abc "data" EXAT 1800000000  # expire at Unix timestamp (seconds)
SET session:abc "data" PXAT 1800000000000  # expire at Unix timestamp (ms)

# Set TTL after the fact
EXPIRE session:abc 3600               # set TTL in seconds (resets clock)
EXPIREAT session:abc 1800000000       # expire at Unix timestamp
PEXPIRE session:abc 3600000           # set TTL in milliseconds
PEXPIREAT session:abc 1800000000000   # expire at Unix timestamp in ms

# TTL options (Redis 7+) — control whether EXPIRE updates existing TTL
EXPIRE key 3600 NX    # Set TTL only if key has NO TTL
EXPIRE key 3600 XX    # Set TTL only if key HAS a TTL
EXPIRE key 3600 GT    # Set TTL only if new TTL > current TTL
EXPIRE key 3600 LT    # Set TTL only if new TTL < current TTL
```

### Reading and removing TTL

```bash
TTL session:abc         # → seconds remaining; -1 = no TTL; -2 = key doesn't exist
PTTL session:abc        # → milliseconds remaining
PERSIST session:abc     # → removes TTL (makes key permanent); returns 1 if TTL was removed
```

### How Redis expires keys

Redis uses **lazy expiration + active expiration** in combination:

1. **Lazy (on access):** When a command accesses a key, Redis checks if it's expired and deletes it before returning the result. Zero background work, but expired keys linger if never accessed.
2. **Active (background):** Every 100ms, Redis samples 20 random keys with a TTL. If more than 25% are expired, it runs again immediately. This ensures expired keys are eventually cleaned up even if never accessed.

```
Implication: TTL ≠ exact deletion time.
An expired key may occupy memory for up to a few hundred ms
after its TTL fires, until the lazy or active expiry path hits it.
```

---

## Key Operations

```bash
# Existence and type
EXISTS user:42:profile          # → 1 if exists, 0 if not (O(1))
EXISTS user:1 user:2 user:3     # → count of existing keys (multiple args, Redis 3.0.3+)
TYPE user:42:profile            # → "hash" | "string" | "list" | "set" | "zset" | "stream"

# Rename
RENAME old:key new:key          # O(1) — overwrites new:key if it exists
RENAMENX old:key new:key        # O(1) — rename only if new:key doesn't exist

# Delete
DEL user:42:profile             # O(N) synchronous delete — blocks event loop briefly for large objects
UNLINK user:42:profile          # O(1) call, O(N) async delete — unlinks key instantly, background GC
UNLINK user:1 user:2 user:3     # delete multiple keys asynchronously (preferred in production)

# Object encoding inspection (how Redis internally represents the type)
OBJECT ENCODING user:42:profile      # → "listpack" | "hashtable" | "ziplist" | ...
OBJECT IDLETIME user:42:profile      # → seconds since last access (LRU approximation)
OBJECT FREQ user:42:profile          # → access frequency (LFU mode only)
OBJECT REFCOUNT user:42:profile      # → internal reference count (usually 1)

# Debug
DEBUG OBJECT user:42:profile    # verbose internal representation info
```

### DEL vs UNLINK

`DEL` is synchronous: deleting a large key (e.g., a hash with 1M fields) blocks the event loop.
`UNLINK` detaches the key from the keyspace instantly (O(1)) and schedules the memory free in a background thread.

```bash
# Always prefer UNLINK for large keys
UNLINK large:sorted:set     # non-blocking — best practice
```

---

## OBJECT ENCODING — Internal Representations

Redis automatically uses compact encodings for small objects and switches to full data structures when they grow:

| Type | Small encoding | Threshold | Large encoding |
|------|----------------|-----------|----------------|
| String (integer) | `int` | value fits in long | `embstr` / `raw` |
| String (short) | `embstr` | ≤ 44 bytes | `raw` |
| List | `listpack` | ≤ 128 elements AND each ≤ 64 bytes | `quicklist` |
| Hash | `listpack` | ≤ 128 fields AND each ≤ 64 bytes | `hashtable` |
| Set (int members) | `intset` | all integers AND ≤ 128 members | `hashtable` |
| Set (mixed) | `listpack` | ≤ 128 members AND each ≤ 64 bytes | `hashtable` |
| Sorted Set | `listpack` | ≤ 128 members AND each ≤ 64 bytes | `skiplist` |

These thresholds are configurable:
```
hash-max-listpack-entries 128
hash-max-listpack-value 64
zset-max-listpack-entries 128
zset-max-listpack-value 64
set-max-intset-entries 128
list-max-listpack-size -2     # -2 = 8kb per node in quicklist
```

**Memory implication:** A hash with 127 fields uses `listpack` (very compact, sequential). Adding one more field switches it to `hashtable` (much more memory). Monitor object encodings if memory is tight.

---

## SCAN vs KEYS — Safe Key Enumeration

### Why KEYS is dangerous in production

```bash
KEYS user:*     # O(N) — blocks the entire event loop while scanning ALL keys
                # 10M keys = multiple seconds of Redis being unresponsive
                # Never use in production
```

### SCAN — cursor-based, non-blocking

`SCAN` returns a cursor + a batch of keys. Iterate until cursor returns 0.

```bash
# First call: cursor = 0
SCAN 0 MATCH "user:*" COUNT 100
# Returns: [<next_cursor>, ["user:1:profile", "user:2:profile", ...]]

# Continue with returned cursor
SCAN <next_cursor> MATCH "user:*" COUNT 100
# ... repeat until cursor = 0

# No MATCH filter (scan everything in batches)
SCAN 0 COUNT 1000

# Filter by type (Redis 6+)
SCAN 0 TYPE hash COUNT 100
```

`COUNT` is a **hint** to Redis (not a guarantee). Redis may return more or fewer than `COUNT` per call. The guarantee is: all keys matching the pattern will appear exactly once across a full cursor cycle.

### Type-specific scan commands

```bash
HSCAN myhash 0 MATCH "field:*" COUNT 20    # scan hash fields
SSCAN myset  0 MATCH "tag:*"   COUNT 20    # scan set members
ZSCAN myzset 0 MATCH "user:*"  COUNT 20    # scan sorted set (member + score pairs)
```

---

## Keyspace Notifications

Redis can publish events to Pub/Sub channels when keys are modified or expired. Requires enabling in config:

```bash
# redis.conf
notify-keyspace-events "KEA"    # K=keyspace, E=keyevent, A=all events

# Or enable at runtime
CONFIG SET notify-keyspace-events KEA
```

Subscribe to events:
```bash
# All events on key "user:42:session"
SUBSCRIBE __keyspace@0__:user:42:session

# All expire events on db 0
SUBSCRIBE __keyevent@0__:expired

# All SET commands on db 0
SUBSCRIBE __keyevent@0__:set
```

Use cases: trigger webhooks on key expiry, invalidate downstream caches, audit key modifications.

---

## Key Eviction Policies

When Redis reaches `maxmemory`, it uses the configured eviction policy to decide which keys to delete:

```bash
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru    # or any policy below
```

| Policy | What gets evicted | Use case |
|--------|------------------|----------|
| `noeviction` | Nothing — new writes return OOM error | When Redis must not lose data (use with Sentinel/Cluster) |
| `allkeys-lru` | Least recently used key (any key) | General-purpose cache |
| `volatile-lru` | Least recently used key with TTL set | Mixed cache + persistent data |
| `allkeys-lfu` | Least frequently used key (any key) | Cache with hot-spot skew |
| `volatile-lfu` | Least frequently used key with TTL | Mixed cache + persistent data (LFU version) |
| `allkeys-random` | Random key | When access pattern is truly uniform |
| `volatile-random` | Random key with TTL | Mixed — random among expirable keys |
| `volatile-ttl` | Key with shortest TTL | When you want explicit TTL to control eviction priority |

### LRU vs LFU

- **LRU (Least Recently Used):** Evicts the key not accessed for the longest time. Good for recency-based workloads (recent requests are hotter).
- **LFU (Least Frequently Used):** Evicts keys accessed fewest times over a period. Better for skewed workloads where a small set of keys are always hot.

Redis LRU/LFU is **approximate** (samples `maxmemory-samples` keys, default 5). Increase `maxmemory-samples` for more accuracy at slight CPU cost.

---

## Common Pitfalls

- **KEYS * in production** — Blocks Redis for seconds on large keyspaces. Absolute rule: use SCAN with MATCH + COUNT.
- **No maxmemory configured** — Redis consumes all RAM; OS kills the process. Always set `maxmemory` and `maxmemory-policy`.
- **DEL on large objects** — `DEL` a hash with 500K fields blocks the event loop. Use `UNLINK` always; or unlink progressively with `HSCAN` + `HDEL` in batches.
- **Forgetting PERSIST after EXPIRE** — If you set a TTL and later want the key to be permanent, `PERSIST` removes it. Forgetting this means persistent data silently expires.
- **TTL resets on RENAME** — `RENAME oldkey newkey` transfers the TTL. If `newkey` already existed with its own TTL, the old TTL is preserved from `oldkey`. Verify with `TTL` after rename.
- **Keyspace notifications overhead** — Enabling `notify-keyspace-events` adds CPU overhead for every command. Use specific event types (e.g., `Ex` for expired events only) rather than `A` (all).

---

## Review Questions

1. **Expiry mechanics** — A key's TTL fired 3 minutes ago but it still shows up in `SCAN` results. Explain Redis's dual expiry mechanism (lazy + active) and under what conditions an expired key persists in memory.
2. **SCAN guarantees** — What does Redis guarantee about `SCAN` cursor iteration? What does it NOT guarantee? Give a scenario where `SCAN` could return duplicate keys.
3. **Eviction policy selection** — Your Redis instance is a session store: it holds user sessions (all with 30-minute TTLs) plus some permanent configuration keys (no TTL). `maxmemory` is reached. Which eviction policy do you choose, and why does `allkeys-lru` risk data loss in this scenario?
4. **UNLINK vs DEL** — A sorted set has 2 million members and you need to delete it. Explain what happens at the OS level when you call `DEL` vs `UNLINK`, and why `UNLINK` is non-blocking from the event-loop's perspective.

---

## Related

- [[Redis_Data_Structures]] — data types whose encodings are described in OBJECT ENCODING
- [[Redis_Performance_and_Monitoring]] — SLOWLOG, INFO memory, fragmentation ratio
- [[Redis_Security_and_Config]] — maxmemory, maxmemory-policy, and other redis.conf settings
- [[Redis_with_Python]] — Python `r.scan()` cursor iteration, `r.expire()`, `r.persist()`
- [[_MOC_Database_Master]] — database storage and memory management context

---

#Redis #KeyManagement #Expiry #Eviction #SCAN
