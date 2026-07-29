---
title: Cloudflare Pages and D1
aliases: [Cloudflare Pages, D1 Database, Pages Functions, Cloudflare AI]
tags: [cloudflare, pages, d1, database, sqlite, edge]
domain: Cloudflare
difficulty: Intermediate
created: 2026-07-29
related: [Cloudflare_Workers, Workers_KV_and_R2, Durable_Objects]
status: complete
---

# Cloudflare Pages and D1

> [!abstract] TL;DR
> Cloudflare Pages is a Git-connected static hosting platform with built-in full-stack support via Pages Functions (file-based routing). D1 is serverless SQLite at the edge — run SQL queries in Workers without managing a database server. Workers AI lets you run LLMs and image models at the edge via a simple binding.

## Cloudflare Pages

### Overview

Pages is Cloudflare's static site and full-stack hosting platform. Connect a GitHub/GitLab repo → Pages builds on every push → deployed to the global edge.

```
GitHub push → Cloudflare Pages build → deployed to 300+ PoPs
                                      ↓
                              Preview URL per branch
                              Production URL on main
```

### Key Features

| Feature | Description |
|---|---|
| Git integration | Auto-deploy on push (GitHub, GitLab) |
| Preview deployments | Every branch/PR gets a unique URL |
| Build commands | Run any Node.js/Hugo/Jekyll build |
| Custom domains | Connect your own domain with automatic SSL |
| Pages Functions | Serverless functions in `functions/` directory |
| `_routes.json` | Control which paths route to Functions vs static |

### Deployment Config (wrangler.toml or dashboard)

```toml
name = "my-site"
pages_build_output_dir = "./dist"  # or "out", "public", "_site"

[[kv_namespaces]]
binding = "MY_KV"
id = "abc123"

[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "def456"
```

---

## Pages Functions

Pages Functions bring serverless compute to Pages without a separate Workers project. Functions live in the `functions/` directory and use file-based routing.

### File-Based Routing

```
functions/
  api/
    hello.ts          →  GET/POST /api/hello
    users/
      [id].ts         →  GET /api/users/123 (dynamic param)
      index.ts        →  GET /api/users
  _middleware.ts      →  runs on every request (before route handlers)
```

### Function Handler

```typescript
// functions/api/users/[id].ts
import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { params, env, request } = context;
  const userId = params.id as string;

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userId)
    .first();

  if (!user) return new Response('Not found', { status: 404 });
  return Response.json(user);
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { params, env } = context;
  await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(params.id).run();
  return new Response(null, { status: 204 });
};
```

### Middleware (`_middleware.ts`)

```typescript
// functions/_middleware.ts — runs on ALL requests
export const onRequest: PagesFunction = async (context) => {
  // Auth check
  const token = context.request.headers.get('Authorization');
  if (!token || !validateToken(token)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Pass to next handler
  return context.next();
};
```

### `_routes.json` — Custom Routing

Control which paths invoke Functions vs serve static files:

```json
{
  "version": 1,
  "include": ["/api/*", "/auth/*"],
  "exclude": ["/static/*", "/images/*"]
}
```

Without this, Pages runs Functions on ALL paths — expensive. Add `_routes.json` to skip Functions for purely static paths.

---

## D1 — Serverless SQLite at the Edge

D1 is a managed SQLite database that runs inside Cloudflare's network. Each database is a SQLite file; queries run in the same PoP as your Worker for ultra-low latency.

### D1 API

```typescript
interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { DB } = env;

    // --- Single row ---
    const user = await DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(42)
      .first<{ id: number; name: string; email: string }>();

    // --- Multiple rows ---
    const users = await DB.prepare('SELECT * FROM users WHERE active = ?')
      .bind(1)
      .all<{ id: number; name: string }>();
    // users.results: array of row objects

    // --- Insert/Update/Delete ---
    const result = await DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    ).bind('Alice', 'alice@example.com').run();
    // result.meta.changes: rows affected
    // result.meta.last_row_id: auto-increment ID

    // --- Batch (atomic transaction) ---
    const [r1, r2] = await DB.batch([
      DB.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').bind(100, 1),
      DB.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').bind(100, 2),
    ]);

    // --- Raw query (returns column arrays, faster for analytics) ---
    const { results, columns } = await DB.raw<[number, string]>(
      'SELECT id, name FROM users LIMIT 10'
    );

    return Response.json({ user, users: users.results });
  },
};
```

### D1 Migrations with Wrangler

```bash
# Create a migration file
wrangler d1 migrations create my-database "create users table"
# Creates: migrations/0001_create_users_table.sql

# Edit the migration file
cat migrations/0001_create_users_table.sql
# CREATE TABLE users (
#   id INTEGER PRIMARY KEY AUTOINCREMENT,
#   name TEXT NOT NULL,
#   email TEXT UNIQUE NOT NULL,
#   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
# );

# Apply locally
wrangler d1 migrations apply my-database --local

# Apply to production
wrangler d1 migrations apply my-database

# Check migration status
wrangler d1 migrations list my-database
```

### D1 vs Other Edge Databases

| Database | Type | Consistency | Good For |
|---|---|---|---|
| **D1** | SQLite (edge) | Strong | Relational data, Workers-native |
| **Turso** | libSQL (SQLite) | Strong + replication | Multi-region SQLite, more features |
| **PlanetScale** | MySQL-compatible | Strong | Larger relational workloads |
| **Neon** | PostgreSQL | Strong | PostgreSQL features, serverless |
| **Supabase** | PostgreSQL | Strong | Full backend (auth, storage) |
| **Workers KV** | Key-value | Eventual | Config, sessions, read-heavy |

**D1 sweet spot:** medium-complexity relational data (hundreds of MB, not terabytes) accessed from Workers with SQL. It's not Postgres — SQLite lacks some features (no `RETURNING` until D1 v2, limited `ALTER TABLE`).

---

## Workers AI — LLMs at the Edge

Run machine learning models inside Cloudflare's network via the `AI` binding:

```typescript
interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { AI } = env;

    // --- Text generation (LLM) ---
    const response = await AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Explain CDN caching in one sentence.' },
      ],
      max_tokens: 200,
    });
    // response.response: "A CDN caches copies of content..."

    // --- Text embeddings ---
    const embedding = await AI.run('@cf/baai/bge-base-en-v1.5', {
      text: 'Cloudflare Workers are serverless functions',
    });
    // embedding.data: [0.024, -0.118, ...]  (768-dim vector)

    // --- Image classification ---
    const imageBuffer = await fetch('https://example.com/cat.jpg')
      .then(r => r.arrayBuffer());
    const classification = await AI.run('@cf/microsoft/resnet-50', {
      image: [...new Uint8Array(imageBuffer)],
    });
    // classification: [{ label: 'cat', score: 0.94 }]

    // --- Automatic speech recognition ---
    const transcript = await AI.run('@cf/openai/whisper', {
      audio: [...new Uint8Array(audioBuffer)],
    });
    // transcript.text: "Hello world"

    return Response.json({ response: response.response });
  },
};
```

### Available Model Categories

| Category | Example Models |
|---|---|
| Text generation | `@cf/meta/llama-3-8b-instruct`, `@cf/mistral/mistral-7b-instruct-v0.1` |
| Text embeddings | `@cf/baai/bge-base-en-v1.5`, `@cf/baai/bge-small-en-v1.5` |
| Image classification | `@cf/microsoft/resnet-50` |
| Object detection | `@cf/facebook/detr-resnet-50` |
| Text-to-image | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |
| Speech-to-text | `@cf/openai/whisper` |
| Translation | `@cf/meta/m2m100-1.2b` |

---

## Common Pitfalls

- **D1 is not Postgres.** SQLite has quirks: dynamic typing, limited `ALTER TABLE` (can't drop columns), no `RETURNING` clause in older versions. Test your queries against SQLite specifically.
- **Pages Functions cold start on first request.** Unlike Cloudflare Workers (always warm via isolates), Pages Functions may have a slight first-invoke delay per PoP.
- **`_routes.json` is easy to forget.** Without it, every request (even `favicon.ico`) invokes a Function. Add an `exclude` for static assets to avoid bill shock.
- **D1 `batch()` is atomic but limited.** All statements in a batch run in a transaction and must succeed together. But very large batches can time out — chunk them.
- **Workers AI costs accumulate fast.** Each AI model run charges neurons (Cloudflare's unit). LLaMA-3 8B at $0.000315/neuron can add up for high-traffic apps.

---

## Review Questions

1. What is the difference between a Cloudflare Worker and a Pages Function? When would you use each?
2. How does file-based routing work in Pages Functions? What file would handle `GET /api/products/123`?
3. What does `DB.batch([...])` guarantee that sequential `DB.prepare().run()` calls do not?
4. You have a Pages site that serves static files and a `functions/api/` directory. How do you prevent the Functions from running for requests to `/images/*`?
5. Compare D1 with PlanetScale. When would you choose D1 over PlanetScale?
