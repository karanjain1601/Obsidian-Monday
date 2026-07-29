---
title: Redis Performance and Monitoring
aliases: [Redis Pipelining, Redis Benchmarking, Redis Monitoring, Redis Slow Log]
tags: [Redis, Performance, Monitoring, Pipelining, Optimization]
domain: Redis
difficulty: Intermediate
created: 2026-07-29
related: [Redis_Overview, Redis_Keys_and_Expiry, Redis_Security_and_Config, Redis_Persistence]
status: complete
---

# Redis Performance and Monitoring

> [!abstract] TL;DR
> Redis performance bottlenecks are almost always: (1) too many round trips (fix: pipelining), (2) blocking commands (`KEYS`, large `DEL`, `SMEMBERS`) (fix: `SCAN`, `UNLINK`), (3) memory fragmentation or incorrect eviction policy, or (4) slow Lua scripts. The monitoring toolkit is `SLOWLOG`, `INFO`, `redis-benchmark`, `redis-cli --latency`, and MONITOR (debug-only).

---

## Memory Optimization

### Check current memory usage

```bash
INFO memory
# Key fields:
# used_memory: bytes allocated by Redis (including data structures)
# used_memory_rss: bytes allocated from OS (includes fragmentation)
# mem_fragmentation_ratio: rss/used_memory (ideal: 1.0–1.5; >2.0 = fragmentation problem)
# maxmemory: configured limit (0 = unlimited)
# maxmemory_human: human-readable maxmemory
# mem_allocator: jemalloc/libc/tcmalloc
# active_defrag_running: 1 if active defragmentation is running
```

### Memory fragmentation

```bash
# If fragmentation ratio > 2.0, enable active defragmentation
CONFIG SET activedefrag yes
CONFIG SET active-defrag-ignore-bytes 100mb   # start when fragmented bytes > 100MB
CONFIG SET active-defrag-enabled yes

# Or restart Redis to reclaim fragmented memory (data is reloaded from RDB/AOF)
```

### Choose right data structure

```bash
# Check how a key is encoded internally
OBJECT ENCODING user:42         # → "listpack", "hashtable", "ziplist", "intset", etc.
OBJECT IDLETIME user:42         # → seconds since last access
OBJECT FREQ user:42             # → access frequency (LFU mode)

# Small hash uses listpack (compact sequential array)
# Larger hash switches to hashtable (more memory per entry)
# Tune the threshold
CONFIG SET hash-max-listpack-entries 128   # below this → listpack
CONFIG SET hash-max-listpack-value 64      # max field value bytes for listpack

# Same for sorted sets and lists
CONFIG SET zset-max-listpack-entries 128
CONFIG SET set-max-intset-entries 128
```

### Lazy freeing

Large objects (a list with 1M entries) deleted with `DEL` block the event loop. Enable lazy freeing:

```bash
# redis.conf
lazyfree-lazy-eviction yes       # eviction uses async unlink
lazyfree-lazy-expire yes         # key expiry uses async delete
lazyfree-lazy-server-del yes     # implicit DEL (e.g., SET overwrites) uses async delete
replica-lazy-flush yes           # replica FLUSHALL on full sync is async
```

Or explicitly:
```bash
UNLINK large:key        # async delete (preferred over DEL for large objects)
```

---

## Pipelining

By default each Redis command is a round trip: send command → wait for reply. With pipelining, multiple commands are sent in one batch and responses received together.

### Without pipeline
```
RTT = 1ms per command
1000 commands = 1000ms total
```

### With pipeline
```
RTT = 1ms (once, for the whole batch)
1000 commands in pipeline = ~1ms total
```

```bash
# redis-cli pipe mode for bulk loading
redis-cli --pipe < commands.txt

# commands.txt format (inline protocol):
SET key1 value1
SET key2 value2
INCR counter
```

In Python (`redis-py`):
```python
with r.pipeline() as pipe:
    for i in range(1000):
        pipe.set(f"key:{i}", f"value:{i}")
    pipe.execute()  # one round trip for all 1000 commands
```

### Pipeline vs Transaction

| | Pipeline | MULTI/EXEC |
|--|----------|------------|
| Round trips | 1 (for the batch) | 1 (for the batch) |
| Atomicity | No | Yes (all-or-nothing) |
| Intermediate reads | Possible between commands | Not possible (queued) |
| Error handling | Commands run independently | EXECABORT on syntax error |
| Use for | Batch non-dependent reads/writes | Atomic multi-command operations |

---

## redis-benchmark

Built-in load testing tool:

```bash
# Basic benchmark (default: 50 clients, 100K requests, GET/SET)
redis-benchmark

# Test specific commands
redis-benchmark -t get,set -n 100000 -c 50

# Test with specific payload size
redis-benchmark -t set -n 100000 -d 1024   # 1KB values

# Pipeline mode (N commands per pipeline batch)
redis-benchmark -t set -n 100000 -P 16     # 16 commands per pipeline

# Quiet mode (only throughput summary)
redis-benchmark -q

# Against remote server
redis-benchmark -h redis-host -p 6379 -a password

# CSV output
redis-benchmark --csv -t set,get

# Latency percentiles
redis-benchmark -t set -n 100000 --latency-history
```

### Sample output interpretation

```
SET: throughput summary: 150000 requests per second
GET: throughput summary: 180000 requests per second
     avg_latency (msec): 0.323
     min_latency (msec): 0.048
     p50_latency (msec): 0.311
     p99_latency (msec): 0.599
     p99.9_latency (msec): 1.247
```

---

## Slow Log Analysis

Redis logs commands that exceed a configurable execution time threshold.

```bash
# Configure threshold (in microseconds; 0 = log everything; -1 = disable)
CONFIG SET slowlog-log-slower-than 10000   # log commands > 10ms
CONFIG SET slowlog-max-len 128             # keep last 128 slow entries

# View slow log
SLOWLOG GET              # most recent slow entries
SLOWLOG GET 10           # last 10 entries
SLOWLOG LEN              # count of entries in log
SLOWLOG RESET            # clear the log

# Entry format:
# [id, timestamp, execution_time_microseconds, [command, arg1, arg2, ...], client_ip, client_name]
```

### Common slow command patterns

| Slow command | Problem | Fix |
|-------------|---------|-----|
| `KEYS *` | O(N) full scan | Use `SCAN` with cursor |
| `SMEMBERS large_set` | O(N) full set read | Use `SSCAN` or rethink data model |
| `HGETALL large_hash` | O(N) full hash read | Use `HSCAN` or reduce hash size |
| `DEL large_key` | Synchronous large free | Use `UNLINK` |
| `SORT large_list` | O(N+M log M) sort | Pre-sort with Sorted Set |
| Long Lua script | Blocks event loop | Break into smaller scripts |

---

## INFO Command

`INFO` returns server statistics. Query by section:

```bash
INFO                    # all sections
INFO server             # version, uptime, OS, config file
INFO clients            # connected clients, blocked clients
INFO memory             # memory usage, fragmentation, eviction
INFO stats              # commands/sec, keyspace hits/misses, evictions
INFO replication        # master/replica status, lag
INFO cpu                # user/sys CPU time
INFO keyspace           # per-db key count and TTL stats
INFO commandstats       # per-command call count, latency, total time
INFO all                # everything including latency histograms
INFO everything         # alias for all

# Key metrics to monitor
INFO stats | grep -E "total_commands_processed|instantaneous_ops_per_sec|keyspace_hits|keyspace_misses|evicted_keys|expired_keys"
INFO memory | grep -E "used_memory_human|mem_fragmentation_ratio|maxmemory_human"
INFO replication | grep -E "role|master_last_io_seconds_ago|master_repl_offset|connected_slaves"
```

### Cache hit rate

```bash
INFO stats
# keyspace_hits: total successful key lookups
# keyspace_misses: total failed key lookups
# hit_rate = keyspace_hits / (keyspace_hits + keyspace_misses)
# Target: > 90% for a healthy cache
```

### Eviction monitoring

```bash
INFO stats | grep evicted_keys
# evicted_keys > 0 means Redis is deleting keys to stay under maxmemory
# If evicted_keys is growing rapidly, your maxmemory is too small or eviction policy is wrong
```

---

## MONITOR (Debug Only)

`MONITOR` streams every command processed by Redis in real-time.

```bash
redis-cli MONITOR
# → Output: timestamp [db client:port] "COMMAND" "arg1" "arg2" ...
# → 1722211200.123456 [0 127.0.0.1:54321] "GET" "user:42"
# → 1722211200.123789 [0 127.0.0.1:54321] "HSET" "session:abc" "user_id" "42"
```

> [!danger] MONITOR Performance Warning
> `MONITOR` doubles Redis's CPU usage and reduces throughput by up to 50%. NEVER leave running in production. Use only for short debugging sessions. Disconnect immediately after use.

---

## redis-cli Latency Tools

```bash
# Continuous latency sampling (ping interval in ms)
redis-cli --latency
# → Output: min: 0.05, max: 1.23, avg: 0.07 (1000 samples)

# Latency history (one sample per second for N seconds)
redis-cli --latency-history -i 1

# Latency distribution (histogram)
redis-cli --latency-dist

# Intrinsic latency (OS/hardware baseline — no Redis)
redis-cli --intrinsic-latency 30   # sample for 30 seconds
# Useful to check if high latency is Redis vs the underlying host
```

---

## CONFIG Commands (Runtime Tuning)

```bash
# Read config
CONFIG GET maxmemory
CONFIG GET maxmemory-policy
CONFIG GET save
CONFIG GET *             # all config parameters

# Write config (hot reload — no restart needed)
CONFIG SET maxmemory 2gb
CONFIG SET maxmemory-policy allkeys-lru
CONFIG SET hz 20              # background task frequency (default 10)
CONFIG SET slowlog-log-slower-than 5000

# Persist in-memory CONFIG SET changes to redis.conf
CONFIG REWRITE            # rewrites redis.conf with current settings

# Reset statistics
CONFIG RESETSTAT          # resets INFO stats (keyspace hits/misses, evictions, etc.)

# DEBUG SLEEP — simulate latency (testing only)
DEBUG SLEEP 0.5           # sleep 500ms (blocks event loop)
```

---

## Production Monitoring Checklist

```
Memory:
  [ ] used_memory < maxmemory * 0.85 (leave headroom for fragmentation)
  [ ] mem_fragmentation_ratio < 1.5
  [ ] evicted_keys rate is low or zero

Performance:
  [ ] instantaneous_ops_per_sec within expected range
  [ ] keyspace_hits / (hits + misses) > 90%
  [ ] SLOWLOG has no recurring commands (check every hour)
  [ ] No KEYS, SORT, SMEMBERS on large sets in application code

Replication:
  [ ] master_repl_offset - replica_repl_offset (lag) < 1MB
  [ ] master_last_io_seconds_ago < 5 seconds
  [ ] connected_slaves = expected number

Connections:
  [ ] connected_clients < maxclients * 0.8
  [ ] blocked_clients = 0 (or expected for BLPOP-based queues)

Persistence:
  [ ] rdb_last_bgsave_status = ok
  [ ] aof_last_write_status = ok
  [ ] rdb_changes_since_last_save within SLA window
```

---

## Common Pitfalls

- **MONITOR in production** — Leaving `MONITOR` running halves throughput. Use `redis-cli MONITOR` only briefly and disconnect immediately.
- **Not setting hz** — Default `hz 10` means background tasks (expiry, lazy free) run 10 times/second. For high-throughput Redis, increase to `hz 20` or `hz 100` (at CPU cost).
- **Not monitoring fragmentation** — Memory fragmentation ratio > 2 means Redis uses 2x the RAM it actually needs. Enable `activedefrag` or plan a rolling restart.
- **Pipeline batch size too large** — Pipelining 100K commands in one batch buffers all responses in memory. Use batch sizes of 1K–10K commands.
- **Confusing used_memory with RSS** — `used_memory` is what Redis allocated. `used_memory_rss` is what the OS reports. RSS > used_memory = fragmentation. RSS < used_memory is impossible normally.
- **Not setting `slowlog-log-slower-than`** — Default is 10,000 microseconds (10ms). Set to 1,000 (1ms) in production to catch slow commands early.

---

## Review Questions

1. **Pipelining latency math** — Your Redis server is 5ms round-trip from your application. Without pipelining, how long do 1000 individual SET commands take? With pipelining in batches of 100, how long? Show your math.
2. **Fragmentation diagnosis** — `INFO memory` shows `used_memory = 2GB` and `used_memory_rss = 5GB`. What does this mean? What is the fragmentation ratio, and what two actions can you take to recover the memory?
3. **Slow log investigation** — Your slow log shows `HGETALL user:session_data` taking 50ms repeatedly. The hash has 500,000 fields. What is wrong, and how would you restructure the key and command usage?
4. **Hit rate degradation** — Your cache hit rate drops from 95% to 60% after a deployment. `INFO stats` shows `evicted_keys` climbing rapidly. What is happening, and what are three possible causes and fixes?

---

## Related

- [[Redis_Keys_and_Expiry]] — SCAN, DEL vs UNLINK, eviction policies
- [[Redis_Security_and_Config]] — redis.conf settings for maxmemory, hz, lazyfree
- [[Redis_Persistence]] — BGSAVE, AOF write overhead
- [[Redis_Replication]] — replication lag monitoring
- [[_MOC_Database_Master]] — database performance tuning context

---

#Redis #Performance #Monitoring #Pipelining #Optimization
