---
title: Redis Security and Configuration
aliases: [Redis ACL, Redis Authentication, Redis TLS, Redis Config]
tags: [Redis, Security, ACL, Authentication, TLS, Configuration, Operations]
domain: Redis
difficulty: Intermediate
created: 2026-07-29
related: [Redis_Overview, Redis_Replication, Redis_Cluster, Redis_Persistence]
status: complete
---

# Redis Security and Configuration

> [!abstract] TL;DR
> Redis security relies on ACL users (fine-grained permissions per user/command/key), TLS for encrypted connections, network binding, protected-mode for default-safe configuration, and disabling/renaming dangerous commands. Production Redis must never be exposed to the public internet without authentication, TLS, and proper network isolation.

---

## Authentication

### Legacy `requirepass` (deprecated but still works)

```bash
# redis.conf
requirepass <strong-password>

# Client authentication
AUTH <password>
redis-cli -a <password>
```

### ACL Users (Redis 6+ — preferred)

ACL users provide per-user authentication + command permissions + key permissions.

```bash
# View current ACL list
ACL LIST
# → ["user default on nopass ~* &* +@all", ...]

# Create a read-only user
ACL SETUSER readonly_user on ><password> ~* +@read -@write -@admin
#     on         = enabled account
#     ><password> = set password (> prefix)
#     ~*          = access to all keys (can restrict to ~product:* etc.)
#     +@read      = allow all read category commands
#     -@write     = deny write commands
#     -@admin     = deny admin commands

# Create a restricted application user
ACL SETUSER app:service on >p@ssw0rd ~user:* ~session:* +SET +GET +HSET +HGET +HGETALL +EXPIRE +DEL
# Only: specific key patterns AND only specific commands

# Pub/Sub channel permissions (Redis 7+)
ACL SETUSER pubsub_user on >pw &notifications:* +SUBSCRIBE +PUBLISH
# &notifications:* = can access pub/sub channels matching this pattern

# Create admin user (replaces requirepass pattern)
ACL SETUSER admin on >adminpassword ~* &* +@all
# Disable default user (no-password access)
ACL SETUSER default off

# Show a user's permissions
ACL GETUSER readonly_user

# Delete a user
ACL DELUSER readonly_user

# Reload ACL from file (after external edit)
ACL LOAD

# Save current ACL to aclfile
ACL SAVE

# Test what a user can do
ACL WHOAMI          # current user
ACL CAT             # list all command categories
ACL CAT read        # list commands in 'read' category
ACL LOG             # recent ACL violations
ACL LOG RESET       # clear log
```

### ACL in redis.conf

```bash
# redis.conf
aclfile /etc/redis/users.acl    # external ACL file (recommended for prod)

# Or inline in redis.conf:
user readonly on >password ~* +@read
user default off                # disable anonymous access
```

### ACL file format

```
user readonly on >password ~user:* ~product:* +GET +MGET +HGET +HGETALL +LRANGE
user writer on >w-password ~user:* +SET +HSET +LPUSH +RPUSH +INCR +EXPIRE +DEL
user admin on >admin-password ~* &* +@all
user default off
```

---

## TLS (Transport Layer Security)

### Enabling TLS

```bash
# redis.conf
tls-port 6380               # TLS port (use alongside or instead of 6379)
port 0                      # disable non-TLS port for TLS-only operation

tls-cert-file /etc/redis/tls/redis.crt
tls-key-file /etc/redis/tls/redis.key
tls-ca-cert-file /etc/redis/tls/ca.crt

tls-auth-clients yes        # require client certificates (mutual TLS)
tls-auth-clients optional   # accept but don't require client certs

tls-replication yes         # encrypt master-replica traffic
tls-cluster yes             # encrypt cluster node communication

# TLS version restrictions
tls-protocols "TLSv1.2 TLSv1.3"
tls-ciphers "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256"
```

```bash
# Connecting with TLS via redis-cli
redis-cli -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt
```

---

## Network Security

### Binding and protected-mode

```bash
# redis.conf
bind 127.0.0.1              # only accept connections from localhost (secure default)
bind 0.0.0.0                # accept from all interfaces (use with firewall)
bind 10.0.0.5 127.0.0.1    # specific interfaces

protected-mode yes          # default: if no auth + bind 0.0.0.0 → refuse external connections
                            # disable only when you have proper auth + network controls
```

### Firewall rules (example)

```bash
# Allow Redis only from app servers, block all else
iptables -A INPUT -p tcp --dport 6379 -s 10.0.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 6379 -j DROP
```

---

## Dangerous Commands

These commands can destroy data or expose sensitive information. Disable or rename them in production:

```bash
# redis.conf — rename to empty string to disable
rename-command FLUSHALL ""        # prevents wiping all data
rename-command FLUSHDB ""         # prevents wiping current DB
rename-command CONFIG ""          # prevents config reads/writes
rename-command DEBUG ""           # prevents debug operations
rename-command KEYS ""            # force use of SCAN instead
rename-command MONITOR ""         # prevents real-time command sniffing
rename-command SHUTDOWN ""        # prevents remote shutdown (use OS-level management)
rename-command SLAVEOF ""         # prevents replication reconfiguration
rename-command REPLICAOF ""       # same as SLAVEOF

# Or rename to a hard-to-guess string (allows admin use with secret name)
rename-command CONFIG "CONFIG_a3f9b2d1"
rename-command FLUSHALL "FLUSHALL_99f2e8d4"

# Note: rename-command is deprecated in Redis 7 for ACL-based restrictions
# Modern equivalent: deny dangerous commands in ACL rules
ACL SETUSER default off
ACL SETUSER app on >password ~* +@all -FLUSHALL -FLUSHDB -DEBUG -KEYS -MONITOR -SHUTDOWN
```

---

## Key redis.conf Settings

```bash
# ─── Network ───────────────────────────────────────────────────────────────────
bind 127.0.0.1
port 6379
protected-mode yes
tcp-backlog 511
timeout 300                 # close idle client connections after 300s (0 = never)
tcp-keepalive 300           # OS-level TCP keepalive

# ─── General ───────────────────────────────────────────────────────────────────
daemonize yes               # run as background daemon
loglevel notice             # debug | verbose | notice | warning
logfile /var/log/redis/redis.log
databases 16                # number of databases (0–15); use 0 in production

# ─── Memory ────────────────────────────────────────────────────────────────────
maxmemory 2gb               # MUST be set in production
maxmemory-policy allkeys-lru    # eviction policy
maxmemory-samples 5         # LRU/LFU approximation sample size
lazyfree-lazy-eviction yes
lazyfree-lazy-expire yes
lazyfree-lazy-server-del yes
activedefrag yes             # enable active defragmentation

# ─── Persistence ───────────────────────────────────────────────────────────────
save 900 1
save 300 10
save 60 10000
# save ""                    # for pure cache — disable
dbfilename dump.rdb
dir /var/lib/redis
appendonly yes
appendfsync everysec
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-use-rdb-preamble yes

# ─── Security ──────────────────────────────────────────────────────────────────
aclfile /etc/redis/users.acl
# requirepass <password>     # legacy; prefer ACL users

# ─── Performance ───────────────────────────────────────────────────────────────
hz 10                       # background task frequency (10–100)
slowlog-log-slower-than 10000   # log commands > 10ms (microseconds)
slowlog-max-len 128
latency-tracking yes        # enable latency monitoring
latency-tracking-info-percentiles "50 99 99.9"

# ─── Replication ───────────────────────────────────────────────────────────────
repl-backlog-size 1mb
repl-backlog-ttl 3600
min-replicas-to-write 1
min-replicas-max-lag 10
replica-lazy-flush yes

# ─── Cluster ───────────────────────────────────────────────────────────────────
# cluster-enabled yes
# cluster-config-file nodes.conf
# cluster-node-timeout 15000
```

---

## Docker Redis Setup

```yaml
# docker-compose.yml
version: "3.9"
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  redis-data:
```

```bash
# Run standalone Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v $(pwd)/redis.conf:/usr/local/etc/redis/redis.conf \
  -v redis-data:/data \
  redis:7-alpine redis-server /usr/local/etc/redis/redis.conf

# Connect
docker exec -it redis redis-cli -a <password>
```

---

## Redis on Kubernetes

```yaml
# StatefulSet (preserves identity and storage on restart)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
          command: ["redis-server", "/etc/redis/redis.conf"]
          volumeMounts:
            - name: config
              mountPath: /etc/redis
            - name: data
              mountPath: /data
      volumes:
        - name: config
          configMap:
            name: redis-config
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  clusterIP: None    # headless service for StatefulSet DNS
```

---

## Managed Services (Cloud Redis)

### AWS ElastiCache for Redis

```
- Managed Redis with automatic failover, backups, patch management
- Supports Cluster Mode Enabled (sharding) and Cluster Mode Disabled (single shard)
- Parameter groups for redis.conf settings
- Encryption at rest (KMS) and in transit (TLS)
- Multi-AZ with automatic failover via Sentinel
- Redis AUTH with token (not full ACL)
- Enhanced monitoring via CloudWatch
- Global Datastore for multi-region replication
```

### Google Cloud Memorystore for Redis

```
- Fully managed Redis with automated failover
- Standard tier: master + replica with automatic failover
- Basic tier: single-node (no HA)
- VPC-native (no public IP exposed)
- Supports Redis 7+, AUTH, TLS
- Import/export from Cloud Storage
```

### Redis Cloud (Redis Ltd.)

```
- Multi-cloud (AWS, GCP, Azure)
- Active-Active Geo-distribution (CRDTs for multi-region writes)
- RedisBloom, RedisJSON, RedisTimeSeries, RediSearch modules
- Serverless and dedicated pricing
- Full ACL support
```

---

## Security Hardening Checklist

```
Authentication:
  [ ] ACL users configured — default user disabled
  [ ] Strong passwords (> 16 chars, random)
  [ ] Separate users per service/role (principle of least privilege)
  [ ] ACL log monitored for violations

Network:
  [ ] bind to specific interface (not 0.0.0.0 without firewall)
  [ ] protected-mode yes (or firewall rules in place)
  [ ] TLS enabled for client connections
  [ ] TLS enabled for replication
  [ ] Redis port (6379, 26379) not exposed to internet

Dangerous commands:
  [ ] FLUSHALL/FLUSHDB renamed or disabled
  [ ] CONFIG renamed or restricted to admin ACL only
  [ ] MONITOR restricted to admin ACL only
  [ ] KEYS renamed or disabled (force SCAN usage)

Config:
  [ ] maxmemory set with appropriate policy
  [ ] Persistence configured (RDB/AOF/hybrid)
  [ ] Slow log enabled (slowlog-log-slower-than 1000)
  [ ] Replication secured with masterauth
```

---

## Common Pitfalls

- **Default user with no password** — Redis's default user has no password. In public cloud deployments, this exposes your Redis to the internet. Always disable the default user and create ACL users.
- **CONFIG accessible in production** — `CONFIG SET` can change `requirepass`, `bind`, `maxmemory-policy`, and anything else at runtime. Restrict or rename it in production.
- **`rename-command` doesn't work with ACL** — If you use ACL to restrict commands but have `rename-command CONFIG ""`, ACL SETUSER won't protect the original name. Use ACL `-CONFIG` instead of `rename-command`.
- **TLS without client certificate validation** — `tls-auth-clients no` allows any client with the CA cert to connect. Use `tls-auth-clients yes` for mutual TLS in sensitive environments.
- **Kubernetes Redis without PVC** — A Redis pod without a PersistentVolumeClaim loses all data on pod restart. Always use StatefulSet + PVC for production Kubernetes Redis.

---

## Review Questions

1. **ACL design** — You have three services: API Gateway (needs GET, EXISTS, TTL), Session Service (needs HSET, HGET, HGETALL, EXPIRE, DEL on `session:*` keys only), and Analytics (needs INCR, PFADD, PFCOUNT on `analytics:*` keys). Write the ACL SETUSER commands for each.
2. **Command renaming vs ACL** — What is the difference between `rename-command CONFIG ""` and `ACL SETUSER default off nocommands +@all -CONFIG`? Which is more flexible, and why is `rename-command` deprecated in Redis 7+?
3. **Protected-mode bypass** — A Redis instance is deployed with `bind 0.0.0.0`, no password, and `protected-mode yes`. Can an external attacker connect? What if `protected-mode no`? What minimal set of changes makes this secure for a cloud environment?
4. **TLS key rotation** — Your Redis TLS certificate is expiring in 2 weeks. Describe the process to rotate it on a master + 2 replicas with Sentinel, minimizing connection interruptions.

---

## Related

- [[Redis_Overview]] — Redis architecture and use cases
- [[Redis_Replication]] — masterauth, replication security
- [[Redis_Cluster]] — cluster-enabled, TLS in cluster mode
- [[Redis_Persistence]] — secure backup and config file
- [[_MOC_Database_Master]] — database security patterns

---

#Redis #Security #ACL #Authentication #TLS #Configuration #Operations
