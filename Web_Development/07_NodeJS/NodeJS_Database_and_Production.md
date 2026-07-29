---
title: "Node.js Database and Production"
aliases: ["Node.js Production", "PM2", "Node Docker", "Prisma Node", "Node Logging", "Graceful Shutdown"]
tags: [WebDevelopment, NodeJS, production]
domain: Web_Development
difficulty: Intermediate
created: 2026-07-29
related: ["[[Express_Framework]]", "[[NodeJS_Fundamentals]]", "[[NodeJS_HTTP_and_REST]]"]
status: complete
---

# 🏭 Node.js Database and Production

> [!abstract] TL;DR
> Production Node.js apps connect to databases via driver libraries (pg, mysql2, mongoose) or ORMs (Prisma, TypeORM), always using a connection pool to reuse expensive TCP connections. Environment config goes in `.env` files loaded via `dotenv`. Structured logging with `winston` or `pino` replaces `console.log`. PM2 manages clustering across CPU cores, restarts crashed processes, and handles zero-downtime reloads. Graceful shutdown drains in-flight requests before closing the process.

## Intuition — analogy FIRST

A connection pool is like a fleet of taxis at an airport rank. Instead of summoning a new taxi for every passenger (expensive — new TCP handshake, auth), the rank maintains a fixed fleet (pool) of taxis (connections) that are always ready. When a passenger (query) arrives, they grab the first free taxi, ride, then return it to the rank for the next passenger. Without a pool, you'd hire and fire a new taxi for every single trip.

Graceful shutdown is like a flight announcement — "doors closing in 5 minutes." In-flight passengers finish their journeys, the gate closes to new arrivals, and then the plane departs cleanly. Abrupt kill is like the plane leaving mid-boarding.

---

## How It Works

```mermaid
graph TD
    App["Express App\n(multiple processes via cluster)"] --> Pool["Connection Pool\n(pg-pool, mongoose, Prisma)"]
    Pool --> PG["PostgreSQL"]
    Pool --> Mongo["MongoDB"]
    Pool --> Redis["Redis\n(cache, sessions)"]

    App --> Logger["Logger\n(pino/winston → stdout)"]
    Logger --> Collector["Log Aggregator\n(Datadog, CloudWatch, ELK)"]

    App --> Health["/health endpoint\n(liveness + readiness)"]

    subgraph PM2 Cluster
        Master["PM2 Master\nprocess manager"]
        W1["Worker 1"]
        W2["Worker 2"]
        W3["Worker 3"]
        W4["Worker 4"]
        Master --> W1
        Master --> W2
        Master --> W3
        Master --> W4
    end

    style Pool fill:#2563eb,color:#fff
    style Master fill:#7c3aed,color:#fff
```

---

## Key Concepts / Details

### PostgreSQL with pg and Connection Pooling

```javascript
// db/postgres.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                // maximum pool size (default: 10)
  idleTimeoutMillis: 30000,  // close idle clients after 30s
  connectionTimeoutMillis: 2000, // fail fast if no connection available
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

// Always release connections back to the pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle pg client:', err);
});

// Simple query wrapper
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn('Slow query:', { text, duration, rows: res.rowCount });
  }
  return res;
}

// Transaction wrapper
async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // always release back to pool
  }
}

// Usage
const { rows } = await query(
  'SELECT * FROM users WHERE email = $1',  // parameterized — prevents SQL injection
  [email]
);

const user = await withTransaction(async (client) => {
  const { rows: [newUser] } = await client.query(
    'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
    [name, email]
  );
  await client.query(
    'INSERT INTO audit_log(action, user_id) VALUES($1, $2)',
    ['user_created', newUser.id]
  );
  return newUser;
});

module.exports = { query, withTransaction, pool };
```

### Prisma ORM

```javascript
// schema.prisma
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }
// model User {
//   id        String   @id @default(uuid())
//   email     String   @unique
//   name      String
//   posts     Post[]
//   createdAt DateTime @default(now())
// }

// db/prisma.js — singleton client
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'warn', 'error']
    : ['warn', 'error'],
});

module.exports = prisma;

// Usage in route handler
const prisma = require('../db/prisma');

// CRUD operations
const users = await prisma.user.findMany({
  where: { name: { contains: 'alice', mode: 'insensitive' } },
  select: { id: true, email: true, name: true }, // only fetch needed fields
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
});

const user = await prisma.user.create({
  data: { email, name, password: hashedPassword },
});

const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: newName },
});

// Transaction
const [newUser, _log] = await prisma.$transaction([
  prisma.user.create({ data: { email, name } }),
  prisma.auditLog.create({ data: { action: 'user_created' } }),
]);
```

### Environment Configuration with dotenv

```javascript
// .env (never commit to git!)
// DATABASE_URL=postgresql://user:password@localhost:5432/mydb
// JWT_SECRET=super-secret-key-min-32-chars
// PORT=3000
// NODE_ENV=development
// REDIS_URL=redis://localhost:6379

// .env.example (commit this — shows required vars without values)
// DATABASE_URL=
// JWT_SECRET=
// PORT=3000
// NODE_ENV=development

// Load at the very top of your entry point (index.js)
require('dotenv').config(); // must be called before any code uses process.env

// Better: validate required env vars at startup
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnv(); // fail fast — crash at startup, not mid-request
```

### Structured Logging with Pino

```javascript
// logger.js
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // In development: pretty-print; in production: structured JSON
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  // Add base fields to every log line
  base: {
    pid: process.pid,
    service: 'user-service',
    env: process.env.NODE_ENV,
  },
  // Redact sensitive fields from logs
  redact: {
    paths: ['req.headers.authorization', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
  // ISO timestamp
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;

// Usage
const logger = require('./logger');

logger.info({ userId: req.user.id, route: req.path }, 'User request');
logger.warn({ attempt: 3, ip: req.ip }, 'Failed login attempt');
logger.error({ err, requestId: req.requestId }, 'Database query failed');

// Express request logger using pino-http
const pinoHttp = require('pino-http');
app.use(pinoHttp({ logger }));
// Automatically logs: method, url, status, responseTime
```

### Clustering and PM2

```javascript
// cluster.js — manual clustering (built-in)
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} spawning ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.pid} died (${signal || code}). Restarting...`);
    cluster.fork(); // auto-restart crashed workers
  });

} else {
  require('./server'); // each worker runs the full app
  console.log(`Worker ${process.pid} started`);
}
```

```bash
# PM2 — production process manager (simpler than manual clustering)
npm install -g pm2

# Start with cluster mode (uses all CPU cores)
pm2 start server.js -i max --name "my-api"

# ecosystem.config.js — version-controlled config
# pm2 start ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-api',
    script: 'src/server.js',
    instances: 'max',           // one per CPU core
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '500M', // restart if memory exceeds 500MB
    env: { NODE_ENV: 'development' },
    env_production: { NODE_ENV: 'production', PORT: 8080 },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
```

### Graceful Shutdown and Health Checks

```javascript
// server.js — complete graceful shutdown pattern
const express = require('express');
const { pool } = require('./db/postgres');
const logger = require('./logger');

const app = express();
let isShuttingDown = false;

// Health/readiness endpoint
app.get('/health', (req, res) => {
  if (isShuttingDown) {
    return res.status(503).json({ status: 'shutting_down' });
  }
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

// Liveness vs readiness probes (Kubernetes)
app.get('/health/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1'); // verify DB connection
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not_ready', error: err.message });
  }
});

const server = app.listen(process.env.PORT || 3000);

// Graceful shutdown
async function shutdown(signal) {
  logger.info({ signal }, 'Shutdown signal received');
  isShuttingDown = true;

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await pool.end(); // wait for in-flight DB queries to complete
      logger.info('DB pool closed');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  });

  // Force exit after 30s if shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM')); // Docker stop, k8s pod termination
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C in development
```

### Dockerizing a Node.js App

```dockerfile
# Dockerfile — multi-stage build for minimal image size
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Change ownership and switch user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 3000
ENV NODE_ENV=production

# Use dumb-init to properly handle signals (PID 1 problem)
RUN apk add --no-cache dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
```

---

## Key Concepts Table

| Tool/Pattern | Purpose |
|-------------|---------|
| `pg` / `pg-pool` | PostgreSQL native driver with connection pooling |
| `mysql2` | MySQL/MariaDB driver with Promise support |
| `mongoose` | MongoDB ODM with schema validation |
| `Prisma` | Type-safe ORM with auto-generated client from schema |
| `TypeORM` | TypeScript-first ORM with decorators |
| `dotenv` | Load `.env` file into `process.env` at startup |
| `pino` | JSON structured logger — fastest Node.js logger |
| `winston` | Flexible logger with multiple transports |
| `PM2` | Process manager: clustering, restarts, monitoring |
| `dumb-init` | PID 1 signal handler for Docker containers |

---

## Real-World Notes

- **Always use parameterized queries** — `$1`, `?`, or ORM methods prevent SQL injection. Never concatenate user input into SQL strings.
- **Connection pool size = (cores × 2) + effective_spindle_count** — a common rule of thumb. Too many connections overwhelm the DB server; too few create a bottleneck.
- **Log to stdout, not files** — in containers, write structured JSON to stdout and let the orchestrator (Docker/k8s) collect and forward logs to your aggregator.
- **Validate `process.env` at startup** — missing a required env var at boot is far better than a cryptic error mid-request in production.
- **Use `dumb-init` or `tini` as PID 1 in Docker** — Node.js does not reap zombie processes and does not forward signals when running as PID 1. Use a minimal init process.

---

## Common Pitfalls

1. **Not releasing DB clients from the pool** — calling `pool.connect()` without `client.release()` in a `finally` block exhausts the pool and causes request hangs.
2. **Using `console.log` in production** — synchronous, unstructured, no log levels. Replace with pino or winston from day one.
3. **Committing `.env` files** — add `.env` to `.gitignore`. Use `.env.example` with empty values for documentation.
4. **Not handling `SIGTERM` in Docker** — without a graceful shutdown handler, `docker stop` sends SIGTERM and then SIGKILL after 10s, killing in-flight requests mid-response.
5. **Running Node as root in Docker** — creates a security vulnerability. Always create a non-root user and `USER nodeuser` in the Dockerfile.

---

## Related Concepts

- [[_MOC_NodeJS|↑ Section MOC]]
- [[Express_Framework]] — Route handlers that call into the database layer
- [[NodeJS_Async_and_Streams]] — Streaming large database result sets
- [[NodeJS_HTTP_and_REST]] — Health check endpoints and graceful shutdown

---

## Review Questions

1. What is a connection pool, and why is it essential for database-backed Node.js applications?
2. Why should you use parameterized queries (`$1`, `?`) instead of string concatenation in SQL?
3. What is the difference between PM2's cluster mode and the Node.js built-in `cluster` module?
4. Explain the graceful shutdown sequence. What happens to in-flight requests during shutdown?
5. Why is running Node.js as PID 1 inside a Docker container problematic? How do you fix it?

---

## Sources

- node-postgres (pg) docs — https://node-postgres.com/
- Prisma docs — https://www.prisma.io/docs
- PM2 docs — https://pm2.keymetrics.io/docs/usage/quick-start/
- pino logging — https://getpino.io/
- Node.js Docker best practices — https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

#WebDevelopment #NodeJS #database #production #pm2 #docker #logging
