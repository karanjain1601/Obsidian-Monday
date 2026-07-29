---
title: Redis Distributed Patterns
aliases: [Redlock, Redis Rate Limiting, Redis Distributed Lock, Redis Session Store]
tags: [Redis, DistributedSystems, RateLimiting, DistributedLock, Redlock]
domain: Redis
difficulty: Advanced
created: 2026-07-29
related: [Redis_Caching_Patterns, Redis_Transactions_and_Scripting, Redis_Data_Structures, Redis_with_Python]
status: complete
---

# Redis Distributed Patterns

> [!abstract] TL;DR
> Redis's single-threaded atomicity enables distributed coordination patterns: locks, rate limiters, session stores, and queues. The basic SETNX lock is simple but has safety gaps (TTL expiry before release). Redlock addresses multi-node correctness. Rate limiters span fixed window (simple), sliding window (accurate), and token bucket (smooth bursts). Each pattern has concrete failure modes that must be understood before production use.

---

## Distributed Lock

### Problem
Multiple processes must not simultaneously execute a critical section (e.g., cron job, inventory reservation).

### Basic SETNX Lock

```bash
# Acquire: SET key uuid NX EX timeout
SET lock:nightly_billing "550e8400-e29b-41d4-a716-446655440000" NX EX 30
# → OK = acquired; nil = already held

# Release: compare-and-delete with Lua (atomic — prevents accidental release)
EVAL "
    if redis.call('GET', KEYS[1]) == ARGV[1] then
        return redis.call('DEL', KEYS[1])
    else
        return 0
    end
" 1 lock:nightly_billing "550e8400-e29b-41d4-a716-446655440000"
```

**Why UUID?** If your lock's TTL expires (slow process), another holder acquires it. When the first process finishes and calls DEL, it would delete the NEW holder's lock. UUID ensures you only delete what you own.

See [[Redis_with_Python]] for the full Python `DistributedLock` class implementation.

### Lock Safety Properties

| Property | Required | Basic SETNX | Redlock |
|----------|----------|-------------|---------|
| Mutual exclusion | Yes | Yes (single node) | Yes (quorum) |
| No deadlock | Yes | TTL-based | TTL-based |
| Fault tolerant | Yes | No (node failure loses lock) | Yes (quorum of 5) |
| UUID check on release | Yes | With Lua | With Lua |

### Lock Limitations

```
Problem 1: Process runs longer than TTL
  Process A acquires lock with EX 10
  Process A's GC pauses for 15 seconds (or network partition)
  Lock expires at t=10
  Process B acquires lock at t=10
  Process A resumes at t=15 — both are now in critical section!

Mitigation: Set TTL >> expected execution time; extend via watchdog thread
(Redisson in Java implements automatic lock renewal)
```

---

## Redlock — Multi-Node Distributed Lock

For high-stakes distributed locking, Redlock provides safety across Redis node failures by requiring a quorum (majority) of independent Redis instances.

### Architecture

```
5 independent Redis instances (not replicated — truly independent)

To acquire lock:
1. Record current time (t1)
2. Try to acquire lock on all 5 instances with same key + same UUID + EX ttl
3. Count successful acquisitions
4. Compute elapsed = now - t1
5. If count >= 3 (majority) AND elapsed < ttl → lock is valid
   Else → release all acquired locks and retry/fail
```

### Commands (per-node)

```bash
# On each of the 5 Redis nodes:
SET lock:critical_section "550e8400-e29b-41d4-a716-446655440000" NX EX 10
# → OK on majority required

# On each node when releasing:
EVAL "
    if redis.call('GET', KEYS[1]) == ARGV[1] then
        return redis.call('DEL', KEYS[1])
    else
        return 0
    end
" 1 lock:critical_section "550e8400-e29b-41d4-a716-446655440000"
```

### Redlock validity window

```
valid_time = TTL - elapsed - clock_drift_factor
```

Only use the lock if `valid_time > 0`.

### Controversy (Martin Kleppmann's critique)

Kleppmann argues Redlock is still unsafe under:
- Process pauses after acquiring quorum but before executing critical section
- Clock drift between nodes

The core issue: distributed locks cannot guarantee safety without fencing tokens (monotonically increasing version numbers checked by the resource). Use Redlock for efficiency (prevent duplicate work) but not for correctness-critical operations on external systems without a fencing token.

---

## Rate Limiting

### 1. Fixed Window Counter

Simplest. Count requests per time window using INCR + EXPIRE.

```bash
# Key: ratelimit:{user}:{window_start_minute}
INCR ratelimit:user:42:202607291430      # increment counter
EXPIRE ratelimit:user:42:202607291430 60  # expire after 60s

# Check: if INCR > limit → reject
```

**Flaw:** At the window boundary, a user can fire `limit` requests at 14:29:59 and `limit` more at 14:30:00 — effectively `2×limit` in 1 second.

### 2. Sliding Window (Sorted Set)

More accurate. Store each request's timestamp as a sorted set score.

```bash
# key = ratelimit:{user}
# score = timestamp in ms
# member = unique request ID (e.g. timestamp:uuid)

MULTI
  ZREMRANGEBYSCORE ratelimit:user:42 0 <now_ms - window_ms>  # remove old
  ZADD ratelimit:user:42 <now_ms> "<now_ms>:<uuid>"          # add current
  ZCARD ratelimit:user:42                                     # count in window
  EXPIRE ratelimit:user:42 <window_seconds + 1>              # auto-cleanup
EXEC
# → count = number of requests in sliding window
# Reject if count > limit
```

See [[Redis_with_Python]] for the Python pipeline implementation.

### 3. Token Bucket (Lua — Smooth Bursts)

```bash
EVAL "
    local key      = KEYS[1]
    local capacity = tonumber(ARGV[1])   -- max tokens
    local rate     = tonumber(ARGV[2])   -- tokens/second refill rate
    local now      = tonumber(ARGV[3])   -- current timestamp in ms

    local data     = redis.call('hmget', key, 'tokens', 'last_refill')
    local tokens   = tonumber(data[1]) or capacity
    local last     = tonumber(data[2]) or now

    -- Refill based on elapsed time
    local elapsed  = math.max(0, now - last)
    local refill   = math.floor(elapsed * rate / 1000)
    tokens         = math.min(capacity, tokens + refill)

    if tokens >= 1 then
        tokens = tokens - 1
        redis.call('hmset', key, 'tokens', tokens, 'last_refill', now)
        redis.call('expire', key, math.ceil(capacity / rate) + 1)
        return 1   -- allowed
    else
        redis.call('hmset', key, 'tokens', tokens, 'last_refill', now)
        return 0   -- rejected
    end
" 1 bucket:user:42 10 1 <now_ms>
```

### 4. Leaky Bucket

Requests enter a queue (RPUSH); a background consumer processes at fixed rate (BLPOP with sleep). Smooths output rate regardless of input bursts.

### Rate Limiter Comparison

| Algorithm | Accuracy | Burst handling | Memory | Atomicity |
|-----------|----------|----------------|--------|-----------|
| Fixed window | Low (boundary spike) | Allows 2x burst at boundary | O(1) | INCR+EXPIRE (near-atomic) |
| Sliding window | High | Accurate per-window | O(N) requests in window | Pipeline (approximate) |
| Token bucket | High | Allows controlled bursts | O(1) | Lua script required |
| Leaky bucket | High | Smooths all bursts | O(N) queue | Queue-based |

---

## Session Store Pattern

Redis is ideal for distributed session storage — any app server can access any session with one Redis hop.

```bash
# Store session as hash (individual field access without deserializing whole blob)
HSET session:abc123 user_id 42 role "admin" created_at 1722211200 ip "10.0.0.1"
EXPIRE session:abc123 3600   # 1 hour session TTL

# Read session
HGETALL session:abc123       # → full session dict
HGET session:abc123 user_id  # → "42" (single-field read for auth check)

# Extend session on activity (sliding expiry)
EXPIRE session:abc123 3600   # reset TTL on each request

# Update single field without re-reading whole session
HSET session:abc123 last_seen 1722214800
HINCRBY session:abc123 request_count 1

# Invalidate session (logout)
DEL session:abc123

# List all sessions for a user (for "logout all devices")
SADD user:42:sessions "session:abc123" "session:xyz789"
# On logout-all: SMEMBERS user:42:sessions → DEL each + DEL the set
```

### Session sharding note
In Redis Cluster, session keys (`session:{token}`) are distributed across slots automatically. Each token is an independent key — no multi-key atomicity needed for normal session operations.

---

## Distributed Queue Patterns

### Simple Queue (List)

```bash
# Enqueue (producer)
RPUSH queue:emails "job1" "job2" "job3"   # right-push

# Dequeue (consumer — non-blocking)
LPOP queue:emails                         # left-pop → "job1"

# Dequeue (consumer — blocking, wait up to 10s)
BLPOP queue:emails 10                     # → [queue_name, "job1"] or nil on timeout

# Queue with priority (multiple lists, BLPOP from highest first)
BLPOP queue:urgent queue:normal queue:low 10   # pops from first non-empty
```

### Reliable Queue (LMOVE)

Classic pattern: move job to processing list atomically; only remove after success.

```bash
# Enqueue
RPUSH queue:jobs "job1" "job2"

# Worker: atomically move head of queue to processing list
LMOVE queue:jobs queue:processing LEFT LEFT
# → "job1" is now in queue:processing (visible to monitors)

# After successful processing: remove from processing
LREM queue:processing 1 "job1"

# On crash/restart: inspect queue:processing for stuck jobs
LRANGE queue:processing 0 -1   # → find jobs stuck longer than threshold
LMOVE queue:processing queue:jobs RIGHT LEFT   # requeue oldest
```

**Modern alternative:** Redis Streams with consumer groups handles all of this natively with automatic PEL tracking.

### Delayed Queue (Sorted Set)

```bash
# Schedule job to run at Unix timestamp
ZADD delayed:jobs <run_at_timestamp> "job:42"

# Worker: poll for jobs ready to run
ZRANGEBYSCORE delayed:jobs 0 <current_time> LIMIT 0 10   # get due jobs
ZREM delayed:jobs "job:42"                                # remove after claiming
# (ideally these two are wrapped in WATCH or Lua for atomicity)

# Atomic claim with Lua
EVAL "
    local jobs = redis.call('ZRANGEBYSCORE', KEYS[1], '0', ARGV[1], 'LIMIT', 0, tonumber(ARGV[2]))
    if #jobs > 0 then
        redis.call('ZREM', KEYS[1], unpack(jobs))
    end
    return jobs
" 1 delayed:jobs <current_time> 10
```

---

## Distributed Counter

```bash
# Atomic global counter (INCR is atomic — safe across all clients)
INCR global:page:views          # → 1, 2, 3, ... (atomic)
INCRBY global:page:views 10     # bulk increment

# Distributed counter with per-shard approach (reduce hot key)
# Shard key = random(0, NUM_SHARDS)
INCR counter:page:views:shard:3
# To read total: MGET all shards and sum in application
MGET counter:page:views:shard:0 counter:page:views:shard:1 ... :shard:N

# HyperLogLog for approximate unique counts (see Redis_Geospatial_and_Advanced)
PFADD visitors:today "user:42" "user:99" "user:42"   # duplicates handled
PFCOUNT visitors:today    # → ~2 (unique count, ~0.81% error)
```

---

## Common Pitfalls

- **No UUID on lock release** — DEL without comparing UUID can release a lock owned by another process (your TTL expired). Always use the Lua compare-and-delete.
- **BLPOP timeout = 0 in production** — Infinite blocking can cause connections to pile up during Redis restarts. Use a reasonable timeout (10–30s) and loop on nil.
- **Fixed window rate limit boundary burst** — Users learn they can burst 2x limit at window boundaries. Use sliding window or token bucket for accurate rate limiting.
- **Redlock on replicated Redis** — Redlock requires 5 **independent** (not replicated) Redis instances. If you run Redlock against 5 replicas of the same master, you have no quorum safety — a single master crash loses all 5 locks simultaneously.
- **Session store without eviction policy** — Session store should use `volatile-lru` or `volatile-ttl` so Redis evicts old sessions under memory pressure rather than stopping writes (`noeviction`).
- **Reliable queue without monitoring** — Jobs stuck in `queue:processing` after worker crashes are invisible unless you have a background sweeper checking for idle jobs in the processing list.

---

## Review Questions

1. **Lock UUID correctness** — Process A acquires `SET lock:job uuid-A NX EX 5`. A GC pause makes it run for 7 seconds. At t=5, process B acquires the lock. At t=7, process A calls `DEL lock:job`. Without UUID check, what happens? With the Lua compare-and-delete, what happens instead?
2. **Rate limiter accuracy** — A fixed-window counter resets at minute boundaries. Describe a sequence of 200 requests (limit=100 per minute) that exploits the boundary and effectively sends 200 requests in 2 seconds. Then explain how a sliding window sorted set prevents this.
3. **Redlock safety** — You run Redlock across 5 Redis Sentinel pairs (each pair is a master+replica). Is this equivalent to 5 independent Redis instances? What failure scenario violates Redlock's safety guarantee in this setup?
4. **Session scaling** — Your application has 10M active sessions stored in Redis. A single Redis node is hitting 80% memory. Describe two strategies to scale (Redis Cluster sharding vs session TTL reduction) and their trade-offs on session expiry UX.

---

## Related

- [[Redis_Caching_Patterns]] — stampede prevention lock, cache invalidation
- [[Redis_Transactions_and_Scripting]] — Lua scripts for atomic rate limiting, lock release
- [[Redis_Data_Structures]] — List, Sorted Set, Hash internals for queues, rate limiters, sessions
- [[Redis_Replication]] — Sentinel failover and its effect on distributed locks
- [[Redis_with_Python]] — Python `DistributedLock` class, rate limiter, sliding window implementation

---

#Redis #DistributedSystems #RateLimiting #DistributedLock #Redlock
