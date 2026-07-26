---
title: "React — Map of Content"
aliases: [MOC React]
tags: [MOC, WebDevelopment, React]
domain: Web Development
created: 2026-07-26
status: complete
---

# ⚛️ React — Map of Content

> [!abstract] What This Section Covers
> Meta's declarative, intentionally unopinionated UI library — the virtual DOM and Fiber reconciler, the hooks model, context, React Server Components, and Next.js. React gives you the component model and the rendering engine; you compose the ecosystem (routing, state, data fetching) to fit the problem. This section covers: the React element model and JSX, hooks deep-dive, state management patterns, performance optimization, and the Next.js full-stack framework.

## Concept Map

```mermaid
graph TD
    CENTER["⚛️ React"]

    CENTER --> Fund["[[React_Fundamentals]]\nJSX · Fiber · reconciliation\nkeys · StrictMode · rendering"]
    CENTER --> Hooks["[[Hooks_in_React]]\nuseState · useEffect · useRef\nuseReducer · useMemo · useCallback"]
    CENTER --> State["[[State_Management_Redux]]\nContext · Zustand · Redux Toolkit\nReact Query · useSyncExternalStore"]
    CENTER --> Perf["[[React_Performance]]\nReact Profiler · memo · transitions\nvirtualization · Web Vitals"]
    CENTER --> Next["[[Next_js]]\nApp Router · RSC · SSG/SSR/ISR\nSuspense streaming · Edge middleware"]

    Fund -->|"hooks build on"| Hooks
    Hooks -->|"state in"| State
    State -->|"optimize with"| Perf
    Hooks -->|"Next uses"| Next

    style CENTER fill:#7c3aed,color:#fff
    style Fund fill:#0891b2,color:#fff
    style Hooks fill:#2563eb,color:#fff
    style State fill:#059669,color:#fff
    style Perf fill:#d97706,color:#fff
    style Next fill:#dc2626,color:#fff
```

## Learning Path

1. [[React_Fundamentals]] — JSX, the React element model, the Fiber reconciler (render vs commit phases), and `key`s.
2. [[Hooks_in_React]] — The two rules of hooks, `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, and concurrent hooks.
3. [[State_Management_Redux]] — Context re-renders, Zustand/Jotai external stores, Redux Toolkit, and React Query.
4. [[React_Performance]] — The React Profiler, `memo`/`useMemo`/`useCallback`, `useTransition`, list virtualization, and Web Vitals.
5. [[Next_js]] — App Router, React Server Components, rendering strategies (SSG/SSR/ISR/CSR), Suspense streaming, and Edge middleware.

## All Notes at a Glance

| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[React_Fundamentals]] | Intermediate | JSX compilation, Fiber render/commit, reconciliation, key diffing, StrictMode double-invoke |
| [[Hooks_in_React]] | Intermediate | Rules of hooks, useState batching, useEffect timing, useRef, concurrent hooks |
| [[State_Management_Redux]] | Intermediate | Context splits, Zustand, Redux Toolkit, createSlice, RTK Query, React Query |
| [[React_Performance]] | Advanced | Profiler, memo, useMemo cost/benefit, useTransition, virtualization, LCP/CLS/INP |
| [[Next_js]] | Advanced | App Router, RSC zero-JS, use client boundary, SSG/ISR/SSR, streaming, middleware |

## Key Questions This Section Answers

- How does the Fiber reconciler work, and why do `key`s matter in list diffing?
- Why can't you call hooks conditionally? What is the positional linked list?
- When does `useEffect` run relative to paint? How does it differ from `useLayoutEffect`?
- When does `useMemo`/`useCallback` actually help vs add overhead?
- What is the difference between React Server Components and Client Components?
- What are the four Next.js rendering strategies and when do you use each?

## Related Sections

- [[_MOC_WebDev_Master|↑ Web Dev Master MOC]]
- [[_MOC_TypeScript|← TypeScript]] — [[TypeScript_with_React]]
- [[_MOC_Angular|← Angular]] (alternative framework)

#MOC #WebDevelopment #React
