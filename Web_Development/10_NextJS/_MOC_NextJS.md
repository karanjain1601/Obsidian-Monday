---
title: "Next.js — Map of Content"
aliases: [MOC NextJS, Next.js Vault Home]
tags: [MOC, WebDevelopment, NextJS, React]
domain: Web Development
created: 2026-07-29
status: complete
---

# Next.js — Map of Content

> [!abstract] What This Section Covers
> 6 notes covering Next.js App Router, rendering strategies, optimization, authentication, and fullstack patterns. Next.js is the production-ready React framework that solves routing, rendering strategy (SSR/SSG/ISR/CSR), data fetching, and build-time optimization. This section covers the App Router (Next.js 13+) as the primary paradigm — from project setup through fullstack patterns using Server Actions, tRPC, and Prisma.

## Concept Map

```mermaid
graph TD
    CENTER["Next.js"]

    CENTER --> Fund["[[NextJS_Fundamentals]]\nproject setup · App Router vs Pages\nnext.config.js · env vars · CLI"]
    CENTER --> Router["[[NextJS_App_Router]]\nfile-based routing · special files\nRSC · Client Components · Server Actions"]
    CENTER --> Data["[[NextJS_Data_Fetching]]\nSSR · SSG · ISR · CSR\nRoute Handlers · Suspense · caching"]
    CENTER --> Opt["[[NextJS_Optimization]]\nnext/image · next/font · next/script\ndynamic() · code splitting · PPR"]
    CENTER --> Auth["[[NextJS_Authentication_and_Deployment]]\nAuth.js · middleware · JWT vs DB sessions\nVercel · Docker · static export"]
    CENTER --> Full["[[NextJS_Fullstack_Patterns]]\nServer Actions · tRPC · Prisma\nnext-intl · testing · useOptimistic"]

    Fund -->|"foundation for"| Router
    Router -->|"data in"| Data
    Data -->|"optimize with"| Opt
    Router -->|"protect with"| Auth
    Data -->|"mutations via"| Full

    style CENTER fill:#7c3aed,color:#fff
    style Fund fill:#2563eb,color:#fff
    style Router fill:#0891b2,color:#fff
    style Data fill:#059669,color:#fff
    style Opt fill:#d97706,color:#fff
    style Auth fill:#dc2626,color:#fff
    style Full fill:#7c3aed,color:#fff
```

## Learning Path

1. [[NextJS_Fundamentals]] — What Next.js is, project structure, App vs Pages Router, `next.config.js`, and CLI commands.
2. [[NextJS_App_Router]] — File-based routing, special files (`layout.tsx`, `loading.tsx`, `error.tsx`), Server vs Client Components, and Server Actions.
3. [[NextJS_Data_Fetching]] — The four rendering strategies (SSG/ISR/SSR/CSR), Route Handlers, Suspense streaming, and cache invalidation.
4. [[NextJS_Optimization]] — `next/image`, `next/font`, `next/script`, `dynamic()` lazy loading, and bundle analysis.
5. [[NextJS_Authentication_and_Deployment]] — Auth.js setup, route protection with middleware, Vercel zero-config deploy, and Docker standalone output.
6. [[NextJS_Fullstack_Patterns]] — Server Actions with form state, optimistic updates, tRPC, Prisma with Server Components, i18n, and E2E testing.

## All Notes at a Glance

| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[NextJS_Fundamentals]] | Intermediate | Framework overview, project structure, App vs Pages Router, env vars, CLI |
| [[NextJS_App_Router]] | Intermediate | File-based routing, special files, RSC vs Client Components, Server Actions |
| [[NextJS_Data_Fetching]] | Intermediate | SSG/ISR/SSR/CSR, Route Handlers, Suspense streaming, revalidation |
| [[NextJS_Optimization]] | Intermediate | next/image, next/font, next/script, dynamic imports, Middleware |
| [[NextJS_Authentication_and_Deployment]] | Advanced | Auth.js, JWT/DB sessions, middleware auth, Vercel, Docker, static export |
| [[NextJS_Fullstack_Patterns]] | Advanced | Server Actions, useOptimistic, tRPC, Prisma patterns, testing, i18n |

## Key Questions This Section Answers

- When should you use SSG vs ISR vs SSR vs CSR for a given route?
- What is the component composition rule between Server Components and Client Components?
- How does `next/image` improve Core Web Vitals vs a plain `<img>` tag?
- How do you protect routes at the edge without a server-side check on every component?
- What is the end-to-end type safety benefit of tRPC over a REST API?
- How do Server Actions eliminate the need for API routes for form mutations?

## Related Sections

- [[_MOC_WebDev_Master|↑ Web Dev Master MOC]]
- [[_MOC_React|← React]] — React fundamentals, hooks, and state management that Next.js builds on
- [[Next_js]] — Overview note in the React section (entry point to App Router concepts)
- [[_MOC_TypeScript|← TypeScript]] — Next.js is TypeScript-first; generics and utility types used throughout

#MOC #WebDevelopment #NextJS #React
