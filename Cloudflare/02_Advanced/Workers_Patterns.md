---
title: Workers Patterns
aliases: [Cloudflare Worker Patterns, Edge Compute Patterns]
tags: [cloudflare, workers, patterns, api-gateway, middleware]
domain: Cloudflare
difficulty: Advanced
created: 2026-07-29
related: [Cloudflare_Workers, Durable_Objects, Workers_KV_and_R2, Cloudflare_Performance]
status: complete
---

# Workers Patterns

> [!abstract] TL;DR
> Workers shine as a programmable layer between users and origins — use them as API gateways with routing, JWT authentication middleware, A/B testing engines, geolocation routers, and caching proxies. All patterns follow the same structure: intercept the `Request`, apply logic, either return a new `Response` or `fetch()` to origin.

## Pattern 1: API Gateway with Routing

Route requests to different backend services based on path prefix — a single Worker replaces a load balancer or API gateway:

```typescript
// src/index.ts
interface Env {
  USER_SERVICE: string;   // "https://users.internal.example.com"
  ORDER_SERVICE: string;  // "https://orders.internal.example.com"
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route table
    const routes: [string, string][] = [
      ['/api/users', env.USER_SERVICE],
      ['/api/orders', env.ORDER_SERVICE],
    ];

    for (const [prefix, upstream] of routes) {
      if (url.pathname.startsWith(prefix)) {
        const upstreamUrl = url.pathname.replace(prefix, '') + url.search;
        return fetch(`${upstream}${upstreamUrl}`, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};
```

---

## Pattern 2: JWT Authentication Middleware

Verify JWTs at the edge — invalid tokens never reach your origin:

```typescript
import { decode, verify } from 'worktop/jwt'; // or use Web Crypto API

interface Env {
  JWT_SECRET: string;
}

async function verifyJWT(token: string, secret: string): Promise<{ sub: string; role: string } | null> {
  try {
    const [header, payload, signature] = token.split('.');
    const data = `${header}.${payload}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
    if (!valid) return null;

    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Skip auth for public routes
    const url = new URL(request.url);
    if (url.pathname.startsWith('/public/')) return fetch(request);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.slice(7);
    const claims = await verifyJWT(token, env.JWT_SECRET);
    if (!claims) return new Response('Invalid token', { status: 401 });

    // Inject user info as headers before forwarding to origin
    const modifiedRequest = new Request(request, {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        'X-User-Id': claims.sub,
        'X-User-Role': claims.role,
      }),
    });

    return fetch(modifiedRequest);
  },
};
```

---

## Pattern 3: A/B Testing

Assign users to variants at the edge — no client-side flicker:

```typescript
interface Env {
  VARIANT_KV: KVNamespace;
}

const VARIANTS = ['control', 'treatment'] as const;

function assignVariant(userId: string): 'control' | 'treatment' {
  // Deterministic hash — same user always gets same variant
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return VARIANTS[Math.abs(hash) % VARIANTS.length];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Get or assign variant
    let userId = request.headers.get('X-User-Id');
    let variant: string;

    if (userId) {
      // Logged-in user: deterministic assignment
      variant = assignVariant(userId);
    } else {
      // Anonymous user: check cookie
      const cookies = request.headers.get('Cookie') ?? '';
      const variantMatch = cookies.match(/ab_variant=(\w+)/);
      variant = variantMatch?.[1] ?? VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    }

    // Rewrite URL to variant origin
    const url = new URL(request.url);
    if (variant === 'treatment') {
      url.hostname = 'treatment.internal.example.com';
    }

    const response = await fetch(url.toString(), request);

    // Set variant cookie for anonymous users
    const newResponse = new Response(response.body, response);
    newResponse.headers.append('Set-Cookie', `ab_variant=${variant}; Path=/; Max-Age=86400`);
    newResponse.headers.set('X-Experiment-Variant', variant); // for analytics

    return newResponse;
  },
};
```

---

## Pattern 4: Geolocation Routing

Route users to the nearest regional origin based on their country:

```typescript
interface Env {
  US_ORIGIN: string;   // "https://us.api.example.com"
  EU_ORIGIN: string;   // "https://eu.api.example.com"
  AP_ORIGIN: string;   // "https://ap.api.example.com"
}

const EU_COUNTRIES = new Set(['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'SE', 'NO', 'DK']);
const AP_COUNTRIES = new Set(['JP', 'KR', 'CN', 'AU', 'IN', 'SG', 'TH', 'ID']);

function getOrigin(country: string | null, env: Env): string {
  if (!country) return env.US_ORIGIN;
  if (EU_COUNTRIES.has(country)) return env.EU_ORIGIN;
  if (AP_COUNTRIES.has(country)) return env.AP_ORIGIN;
  return env.US_ORIGIN;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const country = request.cf?.country ?? null;
    const origin = getOrigin(country, env);

    const url = new URL(request.url);
    const targetUrl = `${origin}${url.pathname}${url.search}`;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Add diagnostic header
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Routed-To', origin);
    newResponse.headers.set('X-Country', country ?? 'unknown');

    return newResponse;
  },
};
```

---

## Pattern 5: Request Transformation

Modify request headers before forwarding — add auth, transform paths, normalize headers:

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Add API key to outbound request
    const headers = new Headers(request.headers);
    headers.set('X-API-Key', env.BACKEND_API_KEY);
    headers.set('X-Request-Id', crypto.randomUUID());
    headers.delete('Cookie'); // strip cookies before forwarding

    // 2. URL rewriting (/v1/users → /users in origin)
    url.pathname = url.pathname.replace('/v1/', '/');

    // 3. Add CORS headers to response
    const response = await fetch(url.toString(), { ...request, headers });

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const newResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([k, v]) => newResponse.headers.set(k, v));

    return newResponse;
  },
};
```

---

## Pattern 6: API Response Caching

Cache API responses at the edge with manual Cache API control:

```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    // Only cache GET requests
    if (request.method !== 'GET') return fetch(request);

    const cache = caches.default;
    const cacheKey = new Request(request.url, request);

    // Check cache
    let response = await cache.match(cacheKey);
    if (response) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('X-Cache', 'HIT');
      return newResponse;
    }

    // Cache miss — fetch from origin
    response = await fetch(request);

    // Only cache successful responses
    if (response.status === 200) {
      const responseToCache = new Response(response.clone().body, {
        status: response.status,
        headers: response.headers,
      });
      // Add cache duration
      responseToCache.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes

      // Store in cache (don't await — background operation)
      cache.put(cacheKey, responseToCache);
    }

    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Cache', 'MISS');
    return newResponse;
  },
};
```

---

## Pattern 7: Rate Limiting with KV Counters

Exact-count rate limiting using KV (for approximate limiting) or Durable Objects (for exact):

```typescript
interface Env {
  RATE_LIMIT_KV: KVNamespace;
}

async function checkRateLimit(
  env: Env,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const windowKey = Math.floor(Date.now() / (windowSeconds * 1000));
  const kvKey = `rate:${key}:${windowKey}`;

  const current = parseInt((await env.RATE_LIMIT_KV.get(kvKey)) ?? '0');
  const resetAt = (windowKey + 1) * windowSeconds * 1000;

  if (current >= limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  // Increment (KV eventual consistency means this is approximate for high concurrency)
  await env.RATE_LIMIT_KV.put(kvKey, String(current + 1), {
    expirationTtl: windowSeconds * 2,
  });

  return { allowed: true, remaining: limit - current - 1, resetAt };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { allowed, remaining, resetAt } = await checkRateLimit(
      env, `ip:${ip}`, 100, 60  // 100 requests per 60 seconds
    );

    if (!allowed) {
      return new Response('Rate limit exceeded', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
        },
      });
    }

    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-RateLimit-Remaining', String(remaining));
    return newResponse;
  },
};
```

> [!note] For exact rate limiting
> The KV approach is approximate under high concurrency (eventual consistency means increments can race). Use [[Durable_Objects]] for exact rate limiting with serialized counter access.

---

## Pattern 8: Edge-Side Rendering (ESR)

Combine cached static HTML with dynamic fragments at the edge:

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Fetch base HTML (cached at edge)
    const baseHtml = await caches.default.match(new Request(`${url.origin}/base-template`))
      ?? await fetch(`${url.origin}/base-template`);

    // Fetch user-specific data (dynamic, not cached)
    const userId = getUserFromCookie(request);
    const userJson = userId
      ? await env.USERS_KV.get(userId, 'json')
      : null;

    // Inject user data into HTML using HTMLRewriter
    return new HTMLRewriter()
      .on('#user-name', {
        element(el) {
          el.setInnerContent(userJson?.name ?? 'Guest');
        },
      })
      .on('#user-avatar', {
        element(el) {
          el.setAttribute('src', userJson?.avatarUrl ?? '/default-avatar.png');
        },
      })
      .transform(new Response(baseHtml.body, baseHtml));
  },
};
```

---

## Common Pitfalls

- **`new Request(request, { headers })` doesn't work as expected.** When creating a modified request, pass headers explicitly — the `headers` option replaces (not merges) the original headers.
- **`fetch()` in a Worker is a subrequest billed separately.** Each `fetch()` inside a Worker counts as a subrequest (max 50 per Worker invocation on free plan, 1000 on paid).
- **`caches.default.put()` only works for GET requests.** The Cache API uses the full request (method + URL + headers) as key. Non-GET requests won't be stored.
- **Geolocation data (`request.cf`) is only available in production** — `wrangler dev` returns a stub `cf` object without real geo data. Use `wrangler dev --remote` to test geo-routing.
- **A/B cookie inconsistency across subdomains.** Set `Domain=.example.com` in the Set-Cookie header to share the variant cookie across subdomains.

---

## Review Questions

1. You want to add an `X-Request-Id` header to every request before forwarding to origin. Write the pattern.
2. An A/B test should assign the same variant to the same logged-in user across sessions without cookies. What technique do you use?
3. `caches.default.put()` is called inside a Worker. Under what condition will the cached response be served by `caches.default.match()` on the next request?
4. The rate limiter using KV allows more than 100 requests per window. What causes this, and what's the correct fix?
5. A Worker needs to add CORS headers to origin responses and handle `OPTIONS` preflight requests. What are the required headers for the `OPTIONS` response?
