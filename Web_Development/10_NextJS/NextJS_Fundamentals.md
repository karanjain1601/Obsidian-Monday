---
title: "Next.js Fundamentals"
aliases: ["NextJS Basics", "Next.js Framework", "Next.js Project Setup"]
tags: [NextJS, React, WebDevelopment, fundamentals]
domain: Web Development
difficulty: Intermediate
created: 2026-07-29
related: ["[[React_Fundamentals]]", "[[Hooks_in_React]]", "[[NextJS_App_Router]]"]
status: complete
---

# Next.js Fundamentals

> [!abstract] TL;DR
> Next.js is a production-ready React framework that solves the four problems pure React leaves to you: routing, data fetching strategy, rendering mode (SSR/SSG/ISR/CSR), and build-time optimization. The App Router (Next.js 13+) uses React Server Components by default — the `app/` directory replaces the old `pages/` directory and changes the default rendering model from client-first to server-first.

## Intuition — analogy FIRST

Pure React is like receiving a car engine — powerful, but you still need to assemble the chassis, wheels, and dashboard yourself. Next.js is the complete vehicle: the engine (React) is already installed, routing is the steering wheel, data fetching is the fuel injection system, and the build toolchain is the automatic transmission. You get in and drive — you don't bolt things together first.

---

## How It Works

```mermaid
graph TD
    NX["Next.js Framework"] --> Router["Routing System"]
    NX --> Rendering["Rendering Engine"]
    NX --> Toolchain["Build Toolchain"]

    Router --> App["App Router (13+)\napp/ directory — RSC default"]
    Router --> Pages["Pages Router (legacy)\npages/ directory — CSR default"]

    Rendering --> SSR["SSR — Server-Side\ncache: no-store"]
    Rendering --> SSG["SSG — Static\ngenerateStaticParams"]
    Rendering --> ISR["ISR — Incremental\nnext: revalidate: N"]
    Rendering --> CSR["CSR — Client\nuse client + hooks"]

    Toolchain --> Webpack["Webpack (stable)"]
    Toolchain --> Turbo["Turbopack (experimental)\n10× faster dev HMR"]

    style NX fill:#7c3aed,color:#fff
    style App fill:#2563eb,color:#fff
    style Pages fill:#6b7280,color:#fff
    style SSR fill:#dc2626,color:#fff
    style SSG fill:#059669,color:#fff
    style ISR fill:#d97706,color:#fff
    style CSR fill:#0891b2,color:#fff
```

---

## Key Concepts / Details

### Project Structure — App Router

```
my-app/
├── app/                    ← App Router (Next.js 13+)
│   ├── layout.tsx          ← root layout (wraps every page)
│   ├── page.tsx            ← home route (/)
│   ├── globals.css
│   ├── dashboard/
│   │   ├── layout.tsx      ← nested layout for /dashboard/*
│   │   ├── page.tsx        ← /dashboard
│   │   └── [id]/
│   │       └── page.tsx    ← /dashboard/42 (dynamic segment)
│   └── api/
│       └── users/
│           └── route.ts    ← GET /api/users handler
├── public/                 ← static assets (served at /)
├── components/             ← shared UI components
├── lib/                    ← shared utilities, db clients
├── middleware.ts            ← edge middleware (runs before routes)
├── next.config.js          ← Next.js configuration
├── tsconfig.json
└── package.json
```

### next.config.js — Key Options

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for highlighting potential issues
  reactStrictMode: true,

  // Image domains allowed for next/image remote images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },

  // Redirect /old-path to /new-path
  async redirects() {
    return [
      { source: '/old-about', destination: '/about', permanent: true },
    ];
  },

  // Rewrite /api/proxy/:path* to an external service
  async rewrites() {
    return [
      { source: '/api/proxy/:path*', destination: 'https://api.third-party.com/:path*' },
    ];
  },

  // Environment variables exposed to the browser (must be prefixed NEXT_PUBLIC_)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY, // server-only
  },

  // Experimental: Turbopack for faster local dev
  experimental: {
    turbo: {},
  },
};

module.exports = nextConfig;
```

### Environment Variables

```bash
# .env.local — never committed, gitignored by default
DATABASE_URL="postgresql://user:pass@localhost/mydb"   # server-only
STRIPE_SECRET_KEY="sk_test_..."                        # server-only
NEXT_PUBLIC_API_URL="https://api.example.com"          # exposed to browser
NEXT_PUBLIC_ANALYTICS_ID="GA-XXXXX"                   # exposed to browser
```

```typescript
// Accessing env vars in code
// Server-only (Server Components, API routes, middleware)
const dbUrl = process.env.DATABASE_URL;       // ✅ works on server
const secret = process.env.STRIPE_SECRET_KEY; // ✅ works on server

// Client-accessible (NEXT_PUBLIC_ prefix required)
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ works anywhere
// process.env.DATABASE_URL in a Client Component → undefined at runtime
```

### CLI Commands

```bash
# Development server (default port 3000)
next dev                      # Webpack bundler
next dev --turbo              # Turbopack bundler (10× faster HMR)
next dev --port 3001          # custom port

# Production build (outputs to .next/)
next build                    # type-checks, lints, compiles, tree-shakes

# Start production server (requires next build first)
next start                    # serves from .next/
next start --port 8080

# Export as static HTML (pure SSG only — no SSR/ISR/API routes)
next export                   # outputs to out/

# Lint all files
next lint
```

### App Router vs Pages Router

| Feature | App Router (`app/`) | Pages Router (`pages/`) |
|---------|---------------------|------------------------|
| Default component type | Server Component | Client Component |
| Data fetching | `async`/`await` in component | `getServerSideProps`, `getStaticProps` |
| Layouts | Nested `layout.tsx` files | `_app.tsx` + custom layout components |
| Streaming | Built-in with `<Suspense>` | Limited |
| Server Actions | Yes (`"use server"`) | No |
| Route handlers | `route.ts` in `app/api/` | Files in `pages/api/` |
| Status | Recommended (stable) | Maintained (legacy) |

---

## Real-World Notes

- **Start every new project with the App Router** — it's stable, recommended, and unlocks Server Components and Server Actions.
- **`NEXT_PUBLIC_` variables are baked at build time** — if you change them, you must rebuild. They're not dynamically injected at runtime.
- **`next build` validates types** — TypeScript errors fail the build. This is intentional: production deploys are type-safe by default.
- **Turbopack is opt-in for dev only** — it's not yet used for `next build`. Use it locally for faster HMR but keep Webpack for production builds.

---

## Common Pitfalls

1. **Using `pages/` and `app/` simultaneously** — they can coexist during migration, but mixing route types causes confusion. Migrate fully when ready.
2. **`process.env` in client components** — non-`NEXT_PUBLIC_` variables resolve to `undefined` in the browser bundle. Use `NEXT_PUBLIC_` prefix or pass via props from a Server Component.
3. **Forgetting `export default`** — every `page.tsx` must have a default export. Named exports won't be recognized as a page.
4. **Committing `.env.local`** — Next.js generates a `.gitignore` entry, but double-check. Use `.env.example` with dummy values for documentation.
5. **`next export` breaks ISR/SSR** — static export (`output: 'export'`) incompatible with routes that use `cache: 'no-store'` or `revalidate`.

---

## Related Concepts

- [[_MOC_NextJS|↑ Section MOC]]
- [[NextJS_App_Router]] — Deep dive into file-based routing and special files
- [[NextJS_Data_Fetching]] — Rendering strategies and data fetching patterns
- [[React_Fundamentals]] — React component model that Next.js builds on

---

## Review Questions

1. What are the four rendering strategies Next.js supports? When would you pick each one?
2. What is the difference between `NEXT_PUBLIC_API_URL` and `API_SECRET` in terms of browser accessibility?
3. What happens when you run `next build`? What does it check beyond bundling?
4. What is the key architectural difference between App Router and Pages Router default component types?
5. When would you use `next export` and what are its limitations?

---

## Sources

- Next.js docs: Getting Started — https://nextjs.org/docs/getting-started
- Next.js docs: Project Structure — https://nextjs.org/docs/getting-started/project-structure
- Next.js docs: Environment Variables — https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

#NextJS #React #WebDevelopment #framework #routing
