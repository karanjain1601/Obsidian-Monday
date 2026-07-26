---
title: Redis with Python
aliases: [redis-py, Python Redis, Redis Caching Python, Redis Pub/Sub Python]
tags: [python, redis, caching, pubsub, rate-limiting, backend]
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related:
  - REST_API_Design
  - Concurrency_in_Python
  - Cache_Stampede
  - Distributed_Locks
  - PubSub_Pattern
  - Rate_Limiting
  - Redis_vs_Memcached
  - Cache_Aside
status: complete
---

# Redis with Python

> [!abstract] TL;DR
> `redis-py` is the standard Python client for Redis; it gives you direct access to every Redis data structure and primitive — strings, hashes, sorted sets, streams, pub/sub, Lua scripts — letting you implement distributed caching, rate limiting, real-time messaging, and distributed locking in a few dozen lines of code.

---

## Intuition

**Analogy:** Redis is a lightning-fast whiteboard your entire fleet of servers can read and write at the same time. Python's `redis-py` is the marker. Unlike a database (a filing cabinet in the basement), the whiteboard is in the same room — access is nearly instant. You can write a counter, a ranked list, a queue, or a chat channel on it — and because Redis handles one command at a time on a single thread, everyone who writes "INCR counter" gets a correct result even if a thousand servers do it simultaneously.

When you need distributed state that survives a single process but does not need a full relational database, Redis is the whiteboard and `redis-py` is how Python talks to it.

---

## How It Works

### Data Structures Taxonomy

```mermaid
graph LR
    REDIS[Redis Keyspace]

    REDIS --> STRING[String\nmax 512 MB]
    REDIS --> HASH[Hash\nfield→value map]
    REDIS --> LIST[List\nordered, doubly-linked]
    REDIS --> SET[Set\nunordered, unique]
    REDIS --> ZSET[Sorted Set\nscore-ordered unique]
    REDIS --> STREAM[Stream\npersistent log]
    REDIS --> HLL[HyperLogLog\ncardinality estimate]

    STRING --> S_USE[Counters · simple cache\nsession token · feature flag]
    HASH --> H_USE[User profile · config object\nproduct attributes]
    LIST --> L_USE[Message queue · activity feed\nrecent-items ring buffer]
    SET --> SET_USE[Tag sets · unique visitors\nfriend graph membership]
    ZSET --> Z_USE[Leaderboard · rate limit window\ndelayed job queue]
    STREAM --> ST_USE[Event log · audit trail\ninter-service messaging]
    HLL --> HLL_USE[Unique page-view counts\ndistinct user approximation]
```

### Caching Layer Architecture

```mermaid
flowchart LR
    APP[Application]

    APP -->|"1. GET key"| CACHE[(Redis Cache)]
    CACHE -->|"2a. Cache HIT\nreturn value"| APP
    CACHE -->|"2b. Cache MISS\nnil"| APP

    APP -->|"3. Query DB"| DB[(Database)]
    DB -->|"4. Return row"| APP
    APP -->|"5. SET key value EX ttl"| CACHE

    APP -->|"Write-Through:\nupdate both atomically"| CACHE
    APP -->|"Write-Through:\nupdate both atomically"| DB
```

### Pub/Sub Message Flow

```mermaid
sequenceDiagram
    participant P as Publisher\n(redis-py)
    participant R as Redis Server
    participant S1 as Subscriber 1\n(pubsub.listen)
    participant S2 as Subscriber 2\n(pubsub.listen)

    S1->>R: SUBSCRIBE notifications
    S2->>R: SUBSCRIBE notifications
    P->>R: PUBLISH notifications "order:placed:42"
    R-->>S1: message {channel, data}
    R-->>S2: message {channel, data}
    Note over P,S2: At-most-once delivery\nMessages lost if subscriber is offline
```

### Rate Limiter — Sliding Window with Sorted Set

```mermaid
flowchart LR
    REQ[Incoming Request]
    REQ --> ZADD["ZADD ratelimit:user:42\nnow_ms as score+member"]
    ZADD --> ZREM["ZREMRANGEBYSCORE\nremove entries older than window"]
    ZREM --> COUNT["ZCARD\ncount requests in window"]
    COUNT --> CHECK{count > limit?}
    CHECK -->|Yes| REJECT[429 Too Many Requests]
    CHECK -->|No| ALLOW[Process Request]
```

---

## Core Concepts

### 1. Connection Setup

```python
import redis

# Basic connection — decode_responses=True returns str instead of bytes
r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# Connection pool (share connections across threads — do this in production)
pool = redis.ConnectionPool(host="localhost", port=6379, db=0, decode_responses=True)
r = redis.Redis(connection_pool=pool)

# URL form — cleanest for twelve-factor apps
r = redis.from_url("redis://:password@localhost:6379/0", decode_responses=True)

# TLS (Redis Cloud, ElastiCache in-transit encryption)
r = redis.from_url("rediss://user:pass@host:6380/0", ssl_cert_reqs="required")

# Async client (use inside async def / FastAPI lifespan)
import redis.asyncio as aioredis
async_r = await aioredis.from_url("redis://localhost", decode_responses=True)

# Redis Sentinel — automatic failover client
from redis.sentinel import Sentinel
sentinel = Sentinel([("sentinel-host", 26379)], socket_timeout=0.1)
r = sentinel.master_for("mymaster", decode_responses=True)

# Redis Cluster
from redis.cluster import RedisCluster
rc = RedisCluster(host="cluster-node", port=7000, decode_responses=True)
```

### 2. Data Structures in Python

```python
# ── STRING ────────────────────────────────────────────────────────────────────
r.set("user:1:name", "Alice")
r.get("user:1:name")                       # "Alice"
r.mset({"user:1:age": "30", "user:2:age": "25"})
r.mget(["user:1:age", "user:2:age"])        # ["30", "25"]
r.incr("page:views")                        # atomic increment → 1
r.incrby("page:views", 10)                  # → 11
r.decr("inventory:item:99")
r.setnx("lock:job", "1")                    # SET if Not eXists → bool
r.setex("session:abc", 3600, "user-data")   # set with TTL seconds
r.set("token:xyz", "data", ex=300)          # same, modern form

# ── HASH ─────────────────────────────────────────────────────────────────────
r.hset("user:1", mapping={"name": "Alice", "email": "a@x.com", "age": "30"})
r.hget("user:1", "name")                    # "Alice"
r.hmget("user:1", ["name", "email"])        # ["Alice", "a@x.com"]
r.hgetall("user:1")                         # {"name": "Alice", "email": "a@x.com", "age": "30"}
r.hdel("user:1", "age")
r.hkeys("user:1")                           # ["name", "email"]
r.hvals("user:1")                           # ["Alice", "a@x.com"]
r.hincrby("user:1", "login_count", 1)       # atomic field increment

# ── LIST ─────────────────────────────────────────────────────────────────────
r.rpush("queue:emails", "job1", "job2")     # right-push (enqueue)
r.lpop("queue:emails")                      # left-pop (dequeue) → "job1"
r.brpop(["queue:emails"], timeout=5)        # blocking pop — wait up to 5s
r.lrange("queue:emails", 0, -1)             # all elements
r.llen("queue:emails")                      # length

# ── SET ──────────────────────────────────────────────────────────────────────
r.sadd("product:42:tags", "electronics", "sale", "new")
r.smembers("product:42:tags")               # {"electronics", "sale", "new"}
r.sismember("product:42:tags", "sale")      # True
r.sunion("product:42:tags", "product:43:tags")   # union
r.sinter("product:42:tags", "product:43:tags")   # intersection
r.sdiff("product:42:tags", "product:43:tags")    # difference
r.srandmember("product:42:tags", 2)         # 2 random members

# ── SORTED SET ────────────────────────────────────────────────────────────────
r.zadd("leaderboard", {"Alice": 9500, "Bob": 8200, "Carol": 9800})
r.zrange("leaderboard", 0, -1, withscores=True)  # [(name, score), ...] asc
r.zrange("leaderboard", 0, 2, rev=True, withscores=True)  # top-3 desc
r.zrangebyscore("leaderboard", 9000, "+inf")       # score range
r.zrank("leaderboard", "Alice")             # 0-based rank ascending
r.zincrby("leaderboard", 100, "Alice")      # atomic score increment
r.zrem("leaderboard", "Bob")
r.zcard("leaderboard")                      # count

# ── EXPIRY ────────────────────────────────────────────────────────────────────
r.expire("user:1", 86400)                   # set TTL in seconds
r.ttl("user:1")                             # remaining seconds (-2 = gone)
r.pttl("user:1")                            # remaining milliseconds
r.persist("user:1")                         # remove TTL (make permanent)
r.expireat("user:1", 1800000000)            # expire at Unix timestamp
```

### 3. Pipeline and Transactions

```python
# Pipeline — batch multiple commands into one round-trip (NOT atomic)
with r.pipeline() as pipe:
    pipe.hset("user:1", mapping={"name": "Alice"})
    pipe.expire("user:1", 3600)
    pipe.incr("stats:user:1:logins")
    results = pipe.execute()  # [True, True, 1] — one network round-trip

# MULTI/EXEC — atomic transaction (all commands run together or not at all)
with r.pipeline() as pipe:
    pipe.multi()
    pipe.decr("inventory:item:99")
    pipe.rpush("orders:pending", "order:42")
    results = pipe.execute()

# WATCH — optimistic locking (compare-and-set pattern)
# Retry loop: if watched key changes between WATCH and EXECUTE, tx is aborted
import redis.exceptions

def transfer_credits(r, from_user, to_user, amount, retries=3):
    from_key = f"credits:{from_user}"
    to_key   = f"credits:{to_user}"
    for _ in range(retries):
        try:
            with r.pipeline() as pipe:
                pipe.watch(from_key)
                balance = int(pipe.get(from_key) or 0)
                if balance < amount:
                    raise ValueError("Insufficient credits")
                pipe.multi()
                pipe.decrby(from_key, amount)
                pipe.incrby(to_key, amount)
                pipe.execute()       # raises WatchError if from_key changed
                return True
        except redis.exceptions.WatchError:
            continue   # retry — another client modified from_key
    raise RuntimeError("Transfer failed after retries")
```

---

## Code Demo

### 1. Cache-Aside with Stampede Prevention (SETNX Lock)

```python
import json
import time
import redis

r = redis.from_url("redis://localhost", decode_responses=True)

CACHE_TTL    = 300   # 5 minutes
LOCK_TTL     = 10    # lock expires after 10 s even if holder crashes
LOCK_TIMEOUT = 5     # how long to wait for the lock before giving up

def get_user_profile(user_id: int) -> dict:
    """Cache-aside with a distributed lock to prevent stampede."""
    cache_key = f"user:{user_id}:profile"
    lock_key  = f"lock:{cache_key}"

    # 1. Check cache first (the fast path — >99 % of requests end here)
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)

    # 2. Cache miss — try to acquire the lock (SETNX + EX is atomic)
    lock_acquired = r.set(lock_key, "1", nx=True, ex=LOCK_TTL)

    if lock_acquired:
        try:
            # 3. Double-check: another holder may have populated cache while
            #    we were acquiring the lock
            cached = r.get(cache_key)
            if cached:
                return json.loads(cached)

            # 4. Fetch from the real data source
            profile = fetch_user_from_db(user_id)   # your DB call here

            # 5. Populate cache
            r.set(cache_key, json.dumps(profile), ex=CACHE_TTL)
            return profile
        finally:
            r.delete(lock_key)   # always release the lock
    else:
        # 6. Another thread holds the lock — poll briefly then serve stale/miss
        deadline = time.monotonic() + LOCK_TIMEOUT
        while time.monotonic() < deadline:
            time.sleep(0.05)
            cached = r.get(cache_key)
            if cached:
                return json.loads(cached)
        # Fallback: hit DB directly rather than returning nothing
        return fetch_user_from_db(user_id)


def fetch_user_from_db(user_id: int) -> dict:
    """Simulated DB call — replace with your ORM/SQL query."""
    return {"id": user_id, "name": "Alice", "email": "alice@example.com"}
```

### 2. Sliding Window Rate Limiter (Sorted Set)

```python
import time
import redis

r = redis.from_url("redis://localhost", decode_responses=True)

def is_rate_limited(user_id: str, limit: int = 100, window_seconds: int = 60) -> bool:
    """
    Sliding window rate limiter using a sorted set.
    Score = timestamp in ms; member = timestamp:random_suffix for uniqueness.
    Returns True if the request should be rejected.
    """
    key        = f"ratelimit:{user_id}"
    now_ms     = int(time.time() * 1000)
    window_ms  = window_seconds * 1000
    cutoff_ms  = now_ms - window_ms
    member     = f"{now_ms}:{id(object())}"  # unique member per request

    with r.pipeline() as pipe:
        pipe.zremrangebyscore(key, 0, cutoff_ms)   # remove old entries
        pipe.zadd(key, {member: now_ms})            # add this request
        pipe.zcard(key)                             # count in window
        pipe.expire(key, window_seconds + 1)        # auto-clean the key
        _, _, count, _ = pipe.execute()

    return count > limit


# Usage in a FastAPI endpoint
from fastapi import FastAPI, HTTPException, Request

app = FastAPI()

@app.get("/api/data")
async def get_data(request: Request):
    user_id = request.headers.get("X-User-ID", "anonymous")
    if is_rate_limited(user_id, limit=60, window_seconds=60):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    return {"data": "ok"}
```

### 3. Pub/Sub Real-Time Notification System

```python
import threading
import redis
import json

r_pub = redis.from_url("redis://localhost", decode_responses=True)
r_sub = redis.from_url("redis://localhost", decode_responses=True)

CHANNEL = "notifications"

# ── PUBLISHER ─────────────────────────────────────────────────────────────────
def publish_notification(user_id: int, event_type: str, payload: dict) -> int:
    """Returns the number of subscribers that received the message."""
    message = json.dumps({"user_id": user_id, "event": event_type, **payload})
    return r_pub.publish(CHANNEL, message)


# ── SUBSCRIBER (runs in its own thread / process) ─────────────────────────────
def start_subscriber():
    pubsub = r_sub.pubsub(ignore_subscribe_messages=True)
    pubsub.subscribe(CHANNEL)
    print(f"Subscribed to '{CHANNEL}'")

    for raw_msg in pubsub.listen():     # blocks — yields each message as dict
        if raw_msg["type"] == "message":
            data = json.loads(raw_msg["data"])
            handle_notification(data)


def handle_notification(data: dict):
    print(f"[Notification] user={data['user_id']}  event={data['event']}")
    # Fan-out to WebSocket, push notification service, etc.


# ── PATTERN SUBSCRIBE (wildcard) ──────────────────────────────────────────────
def start_pattern_subscriber():
    pubsub = r_sub.pubsub(ignore_subscribe_messages=True)
    pubsub.psubscribe("notifications:*")   # matches notifications:orders, etc.

    for raw_msg in pubsub.listen():
        if raw_msg["type"] == "pmessage":
            channel = raw_msg["channel"]
            data    = json.loads(raw_msg["data"])
            print(f"[{channel}] {data}")


# Start subscriber in background thread
sub_thread = threading.Thread(target=start_subscriber, daemon=True)
sub_thread.start()

# Publish from the main thread
publish_notification(42, "order_shipped", {"order_id": 9001, "tracking": "1Z999"})
```

### 4. Distributed Lock with UUID Verification and Auto-Release

```python
import uuid
import time
import redis

r = redis.from_url("redis://localhost", decode_responses=True)

# Lua script: release lock ONLY if we own it (atomic compare-and-delete)
RELEASE_SCRIPT = """
if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
else
    return 0
end
"""

class DistributedLock:
    """Simple distributed lock backed by Redis SET NX EX."""

    def __init__(self, redis_client, name: str, timeout: int = 10):
        self.r       = redis_client
        self.key     = f"dlock:{name}"
        self.timeout = timeout          # lock TTL in seconds
        self.token   = str(uuid.uuid4())  # unique owner token
        self._release = redis_client.register_script(RELEASE_SCRIPT)

    def acquire(self, blocking: bool = True, retry_interval: float = 0.1) -> bool:
        """Returns True when the lock is acquired."""
        deadline = time.monotonic() + self.timeout
        while True:
            # SET key token NX EX timeout — atomic, no race condition
            acquired = self.r.set(self.key, self.token, nx=True, ex=self.timeout)
            if acquired:
                return True
            if not blocking:
                return False
            if time.monotonic() >= deadline:
                return False
            time.sleep(retry_interval)

    def release(self) -> bool:
        """Release only if we still own the lock (prevents accidental release)."""
        result = self._release(keys=[self.key], args=[self.token])
        return bool(result)

    def __enter__(self):
        if not self.acquire():
            raise TimeoutError(f"Could not acquire lock '{self.key}'")
        return self

    def __exit__(self, *_):
        self.release()


# Usage
def run_nightly_billing():
    with DistributedLock(r, name="nightly_billing", timeout=300) as lock:
        print("Lock acquired — running billing job")
        # ... billing logic ...
        print("Billing complete — lock released on exit")


# Non-context-manager usage (manual acquire/release)
lock = DistributedLock(r, "inventory:item:99", timeout=5)
if lock.acquire(blocking=False):
    try:
        # critical section
        pass
    finally:
        lock.release()
```

---

## Caching Patterns Deep Dive

### Cache Key Naming Conventions

```python
# Hierarchical, colon-separated, entity-typed keys
# Pattern:  <entity>:<id>:<attribute>
# Examples:
"user:42:profile"
"user:42:session"
"product:99:details"
"rate:user:42:api"          # rate limit counter for user 42 on the api scope
"leaderboard:game:chess"

# Cache versioning — bump v prefix to invalidate all keys without SCAN
"v2:user:42:profile"        # v1 keys become dead weight and expire naturally

# Tag-based invalidation — store a set of keys per tag
r.sadd("tag:user:42", "user:42:profile", "user:42:orders")
r.expire("tag:user:42", 86400)

def invalidate_user_cache(user_id: int):
    tag_key = f"tag:user:{user_id}"
    keys    = r.smembers(tag_key)
    if keys:
        r.delete(*keys)
    r.delete(tag_key)
```

### Safe Bulk Deletion with SCAN (Never KEYS * in Production)

```python
def delete_keys_by_pattern(r: redis.Redis, pattern: str, batch: int = 100):
    """
    Iteratively scan and delete keys matching pattern.
    SCAN is non-blocking — cursor-based, O(1) per call.
    KEYS * is O(N) and blocks the entire server during execution.
    """
    cursor = 0
    deleted = 0
    while True:
        cursor, keys = r.scan(cursor=cursor, match=pattern, count=batch)
        if keys:
            r.delete(*keys)
            deleted += len(keys)
        if cursor == 0:
            break
    return deleted

# Example: invalidate all v1 cache entries
delete_keys_by_pattern(r, "v1:*")
```

### Lua Script for Atomic Rate Limit (Token Bucket)

```python
TOKEN_BUCKET_SCRIPT = """
local key       = KEYS[1]
local capacity  = tonumber(ARGV[1])
local rate      = tonumber(ARGV[2])   -- tokens per second
local now       = tonumber(ARGV[3])   -- current time in ms

local data      = redis.call('hmget', key, 'tokens', 'last_refill')
local tokens    = tonumber(data[1]) or capacity
local last      = tonumber(data[2]) or now

local elapsed   = math.max(0, now - last)
local refill    = math.floor(elapsed * rate / 1000)
tokens          = math.min(capacity, tokens + refill)

if tokens >= 1 then
    tokens = tokens - 1
    redis.call('hmset', key, 'tokens', tokens, 'last_refill', now)
    redis.call('expire', key, math.ceil(capacity / rate) + 1)
    return 1   -- allowed
else
    redis.call('hmset', key, 'tokens', tokens, 'last_refill', now)
    return 0   -- rejected
end
"""

token_bucket = r.register_script(TOKEN_BUCKET_SCRIPT)

def check_token_bucket(user_id: str, capacity: int = 10, rate: float = 1.0) -> bool:
    """Returns True if request is allowed (token consumed)."""
    now_ms = int(time.time() * 1000)
    result = token_bucket(
        keys=[f"bucket:{user_id}"],
        args=[capacity, rate, now_ms]
    )
    return bool(result)
```

---

## Redis Streams (at-least-once messaging)

```python
import redis
import time

r = redis.from_url("redis://localhost", decode_responses=True)

STREAM = "events:orders"
GROUP  = "order-processors"
CONSUMER = "worker-1"

# ── PRODUCER ──────────────────────────────────────────────────────────────────
def produce_order_event(order_id: int, status: str):
    # XADD — '*' auto-generates the stream ID (timestamp-sequence)
    # maxlen trims the stream to ~1000 entries (approximate, efficient)
    entry_id = r.xadd(
        STREAM,
        {"order_id": str(order_id), "status": status, "ts": str(time.time())},
        maxlen=1000,
        approximate=True,
    )
    return entry_id


# ── CONSUMER GROUP SETUP (run once) ──────────────────────────────────────────
def create_consumer_group():
    try:
        r.xgroup_create(STREAM, GROUP, id="0", mkstream=True)
    except redis.exceptions.ResponseError as e:
        if "BUSYGROUP" not in str(e):
            raise


# ── CONSUMER (runs in worker process) ────────────────────────────────────────
def consume_events(batch: int = 10, block_ms: int = 2000):
    create_consumer_group()
    while True:
        # XREADGROUP: read up to `batch` new messages (> means "new since last ack")
        entries = r.xreadgroup(
            GROUP, CONSUMER,
            streams={STREAM: ">"},
            count=batch,
            block=block_ms,
        )
        if not entries:
            continue
        for stream_name, messages in entries:
            for entry_id, fields in messages:
                try:
                    process_order(fields)
                    r.xack(STREAM, GROUP, entry_id)   # acknowledge — removes from PEL
                except Exception as e:
                    print(f"Failed {entry_id}: {e}")  # stays in PEL for retry/reclaim


def process_order(fields: dict):
    print(f"Processing order {fields['order_id']} → {fields['status']}")
```

---

## Real-World Example

> **Example — Instagram's feed ranking cache:** Instagram stores pre-computed feed scores for each user in a Redis Sorted Set (`ZADD user:{id}:feed post_score post_id`). On login, the top-N posts are fetched with a single `ZRANGE ... REV LIMIT 0 50` command — one network hop, sub-millisecond latency. New posts trigger a `ZINCRBY` or `ZADD` to update the set. A TTL ensures cold accounts don't accumulate memory. The same pattern is used by Twitter/X for timeline caching, Airbnb for search result scoring, and Stack Overflow for question hot-score ordering. The Sorted Set's atomic `ZINCRBY` means thousands of concurrent upvote events can increment scores without a single race condition.

---

## Trade-offs

| Aspect | Redis | Memcached |
|--------|-------|-----------|
| Data structures | Strings, Hashes, Lists, Sets, Sorted Sets, Streams | String/bytes only |
| Persistence | RDB snapshots + AOF (optional) | None — volatile only |
| Pub/Sub | Native PUBLISH/SUBSCRIBE + Streams | Not supported |
| Clustering | Redis Cluster (hash slots) + Sentinel | Client-side sharding only |
| Memory efficiency | Slightly higher (structure metadata) | Lower overhead for pure string cache |
| Lua scripting | Full support | Not supported |
| Best for | Feature-rich, multi-pattern use cases | Pure high-throughput key-value cache |

| Aspect | Cache-Aside | Write-Through | Write-Behind |
|--------|-------------|---------------|--------------|
| Consistency | Eventual (read misses populate cache) | Strong (cache and DB updated together) | Eventual (async DB write) |
| Cache hit rate on start | Low — warms up lazily | High — every write lands in cache | High — every write lands in cache |
| Write latency | Low (only DB write) | Higher (two writes per operation) | Lowest (only cache write) |
| Complexity | Simple | Moderate | High (async flush, failure handling) |
| Data loss risk | None | None | Yes — if cache fails before flush |
| Best for | Read-heavy, tolerable staleness | Financial, inventory (strong consistency) | Write-heavy, bulk ETL pipelines |

| Aspect | Redis Streams | Celery | Kafka |
|--------|---------------|--------|-------|
| Delivery guarantee | At-least-once (with consumer groups) | At-least-once | At-least-once / exactly-once (transactions) |
| Persistence | In-memory + optional AOF | Broker-dependent (Redis, RabbitMQ) | Durable disk log (configurable retention) |
| Throughput | Hundreds of thousands msg/s | Moderate (task overhead) | Millions msg/s |
| Replay old events | Yes (from stream start) | No | Yes (configurable offset) |
| Operational complexity | Low — already have Redis | Moderate | High — ZooKeeper/KRaft, clusters |
| Best for | Lightweight inter-service events, small teams | Task queues, scheduled jobs, retries | High-volume event streaming, multi-consumer fan-out |

---

## When to Use vs Avoid

**Use Redis + redis-py when:**
- You need distributed caching that multiple app servers share (process-local `lru_cache` does not suffice).
- You need atomic counters, rate limiters, or leaderboards across processes.
- You want lightweight pub/sub or a simple job queue without deploying Kafka.
- Distributed locking is required to prevent duplicate processing across nodes.
- You need sub-millisecond latency for session storage or feature flags.

**Avoid (or supplement) when:**
- You need strong durability guarantees for critical financial data — Redis AOF + `appendfsync always` adds latency; consider Postgres for the system of record.
- Event replay across many consumer groups at scale — Kafka's disk-based log and consumer group offsets are purpose-built for this.
- The keyspace is enormous and unpredictable — Redis is RAM-bound; Memcached may be cheaper for pure string caching at large scale.
- You need transactions across multiple keys on a Redis Cluster — Lua scripts and transactions only work atomically when all keys hash to the same slot.

---

## Common Pitfalls

- **`KEYS *` in production** — `KEYS` is O(N) and blocks Redis's single-threaded event loop during execution, freezing all other clients. Always use `SCAN` with a cursor and reasonable `count` batch size.

- **No TTL on cached keys** — Forgetting to set an expiry causes unbounded memory growth until Redis evicts data under the configured `maxmemory-policy` (often randomly, breaking your app). Every cache entry must have a TTL.

- **Cache stampede on cold start or mass expiry** — When a popular key expires and hundreds of requests miss simultaneously, all hit the database. Use `SETNX`-based locking (as shown above), probabilistic early expiration (`XFetch` algorithm), or stale-while-revalidate.

- **Lua scripts and Redis Cluster key-slot mismatch** — A Lua script must touch only keys that hash to the same slot. If your script does `redis.call('get', 'user:1')` and `redis.call('get', 'order:1')`, they may be on different nodes. Use hash tags (`{user:1}:profile` and `{user:1}:orders` both hash slot on `user:1`) to co-locate related keys.

- **Pub/Sub messages lost if subscriber is offline** — Redis pub/sub is fire-and-forget with no persistence. A subscriber that restarts after a publisher sends messages receives nothing. If durability matters, use Redis Streams with consumer groups (messages stay in the Pending Entries List until acknowledged).

- **Not verifying UUID on lock release** — Without checking that the lock value matches your UUID before deleting, a slow holder whose TTL expired can delete a lock acquired by a different process. Always use the Lua compare-and-delete pattern.

- **`decode_responses=False` surprises** — Without `decode_responses=True`, `r.get("key")` returns `b"value"` (bytes). Mixing bytes and strings in JSON serialization causes `TypeError`. Set it at connection time and treat it as a convention across the codebase.

---

## Related Concepts

- [[REST_API_Design]] — rate limiting and idempotency keys are Redis-backed patterns used directly in REST API design
- [[Concurrency_in_Python]] — async redis-py (`redis.asyncio`) integrates with Python's async/await model; connection pools map to thread-pool concurrency patterns
- [[Cache_Stampede]] — the thundering herd problem that the SETNX lock pattern in this note directly solves
- [[Distributed_Locks]] — deeper treatment of Redlock, ZooKeeper alternatives, and correctness guarantees beyond single-node Redis
- [[PubSub_Pattern]] — architectural context for when pub/sub fits vs event-driven alternatives; Redis pub/sub is the simplest implementation
- [[Rate_Limiting]] — system-design-level treatment of fixed window, sliding window, and token bucket algorithms; this note provides the Python implementation
- [[Redis_vs_Memcached]] — detailed comparison of the two dominant caching backends, including persistence, data structures, and clustering trade-offs
- [[Cache_Aside]] — the cache-aside (read-through) strategy implemented in Code Demo 1 above

---

## Review Questions

1. **Cache Stampede Prevention** — A Redis key holding a heavily-read product catalog expires at midnight. You have 500 app servers. Describe what happens without any protection, then explain how the `SET NX EX` lock pattern prevents the stampede. What is the "double-check" step inside the lock holder for, and why can you still get a cache miss rate spike even with the lock?

2. **Pipeline vs MULTI/EXEC** — A pipeline batches commands into one round-trip. `MULTI/EXEC` also batches commands. What is the critical operational difference between the two? Give a scenario where a pipeline is correct and one where only `MULTI/EXEC` (or a Lua script) is correct.

3. **Redis Streams vs Pub/Sub — Persistence Guarantee** — You are building an order confirmation notification system. An order is placed while the notification worker is restarting. Compare what happens with (a) Redis pub/sub `PUBLISH/SUBSCRIBE` and (b) Redis Streams with a consumer group. Which guarantees the notification is eventually sent, and why?

4. **Distributed Lock UUID Requirement** — A distributed lock is acquired with `SET lock unique-uuid NX EX 5`. The process acquires the lock, but the operation takes 8 seconds (longer than the TTL). Another process acquires the lock after TTL expiry. Now the first process finishes and calls `DEL lock`. What goes wrong, and exactly what does the Lua compare-and-delete script prevent?

---

## Sources

- [redis-py Official Documentation](https://redis-py.readthedocs.io/en/stable/)
- [Redis Commands Reference](https://redis.io/commands/)
- [Redis Streams Introduction](https://redis.io/docs/latest/develop/data-types/streams/)
- [Redlock Algorithm — Distributed Locks with Redis](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/)
- [Martin Kleppmann — How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- [Redis Pub/Sub Documentation](https://redis.io/docs/latest/develop/interact/pubsub/)
- [Salvatore Sanfilippo — Redis Data Structures](https://redis.io/blog/5-key-takeaways-for-developing-with-redis/)

---

#python #redis #caching #pubsub #rate-limiting #backend
