---
title: Vibe Coding Stack
aliases: [AI-Compatible Tech Stack, TypeScript React Node Stack, Vibe Stack]
tags: [VibeCoding, Foundations]
domain: Vibe Coding
difficulty: Beginner
created: 2026-07-29
related: [AI_Tools_Comparison, Frontend_AI_Tools, Planning_with_AI, Code_Quality_Standards, Vibe_Coding_Overview]
status: complete
---

# Vibe Coding Stack

> [!abstract] TL;DR
> AI coding tools perform dramatically better on popular, well-documented stacks. TypeScript + React + Node.js (+ PostgreSQL + Prisma) is the dominant vibe coding stack because AI training data is saturated with it. Niche or custom frameworks degrade output quality significantly.

## Why Stack Choice Matters More in Vibe Coding

When you write code manually, your personal knowledge fills gaps in documentation. When AI writes code, it draws exclusively from training data — code examples, Stack Overflow answers, GitHub repositories, documentation. **Popular stacks have orders of magnitude more training coverage**, which means:

- Higher correctness rate on first attempt
- Better awareness of common pitfalls and best practices
- More accurate library version compatibility
- Faster debugging sessions (AI has seen the error message before)

Choosing a niche or company-internal framework for AI-assisted development is like hiring an intern who's only read one book. The output is technically possible but requires far more correction and review.

## The Default Vibe Coding Stack

```
Frontend:  TypeScript + React + Next.js + Tailwind CSS + shadcn/ui
Backend:   TypeScript + Node.js (Express or Next.js API routes)
Database:  PostgreSQL + Prisma ORM
Auth:      Clerk or NextAuth.js
Hosting:   Vercel (frontend) + Railway / Supabase (backend/DB)
Testing:   Vitest + React Testing Library + Playwright
```

This stack is dominant because:
1. **TypeScript** — static types give AI precise schema knowledge; reduces hallucinated property names
2. **React/Next.js** — most-trained frontend framework by a wide margin
3. **Tailwind** — utility-class CSS that AI writes well; no fighting with specificity
4. **Prisma** — ORM with outstanding TypeScript types; AI generates correct queries reliably
5. **Vercel** — frictionless deploy that AI knows how to configure

## Stack Selection Framework

```mermaid
quadrantChart
    title AI Output Quality vs. Developer Familiarity
    x-axis Low AI Coverage --> High AI Coverage
    y-axis Low Familiarity --> High Familiarity
    quadrant-1 Sweet Spot
    quadrant-2 Learn as you go (risky)
    quadrant-3 Avoid
    quadrant-4 Use your expertise, less AI benefit
    TypeScript+React: [0.9, 0.8]
    Next.js: [0.85, 0.75]
    Python+FastAPI: [0.75, 0.6]
    Go+Gin: [0.6, 0.5]
    Svelte+SvelteKit: [0.55, 0.4]
    Internal Framework: [0.1, 0.2]
    COBOL: [0.1, 0.1]
    Elixir+Phoenix: [0.4, 0.35]
```

## When to Deviate from the Default Stack

The default is not always right. Deviate when:

**Your team has deep expertise in another stack:** If your team has 10 years of Python/Django experience, the AI quality penalty of using Python is outweighed by your ability to review output effectively.

**The domain demands a specific stack:** Data science (Python + pandas/numpy), mobile (Swift/Kotlin/React Native), embedded systems (C/Rust) — these are non-negotiable.

**Organizational standards:** Enterprise environments often mandate specific languages (Java, .NET). AI still adds value here; the output just requires more review.

## TypeScript Over JavaScript

If you choose nothing else from this note, choose TypeScript over JavaScript for vibe coding:

| Factor | JavaScript | TypeScript |
|---|---|---|
| AI hallucination rate | Higher (no type feedback) | Lower (types constrain output) |
| Bug detection | Runtime | Compile time |
| AI autocomplete accuracy | Good | Excellent (types guide suggestions) |
| Refactoring safety | Manual checking | Compiler-checked |
| Onboarding AI to existing code | Hard (no schema) | Easy (types document intent) |

TypeScript's type system acts as a contract that the AI must satisfy. This dramatically reduces hallucinated property names, wrong function signatures, and incorrect API usage.

## Database: Prefer an ORM with Strong Types

Raw SQL is fine for manual development but introduces risk in AI-generated code:
- AI gets table/column names wrong without schema context
- SQL injection risk is higher without ORM parameterisation
- Schema changes require hunting down all raw queries

**Prisma** is the top recommendation because:
- Schema-first: the `schema.prisma` file is read by the AI to generate correct queries
- TypeScript types auto-generated from schema — zero room for AI to misname a field
- Migration system produces reviewable, incremental changes

## Avoiding Niche Framework Trap

Signs your stack is too niche for effective vibe coding:
- AI generates import paths for a library that doesn't exist (hallucination)
- Correct output requires specifying the exact version in every prompt
- AI says "I'm not familiar with this framework" or produces generic, non-idiomatic code
- You spend more time correcting framework-specific errors than you save with AI

**If you're stuck with a niche stack**, maximise AI value by:
1. Including library documentation snippets in your context/CLAUDE.md
2. Providing example code patterns in each prompt
3. Using AI for algorithm logic and writing the framework-specific wiring manually
4. See [[Context_Management]] for how to compensate with a rich CLAUDE.md

## Stack for Different Project Types

| Project Type | Recommended Stack |
|---|---|
| SaaS web app | Next.js + Prisma + PostgreSQL + Clerk |
| API service | Node.js + Express + Prisma |
| Data pipeline | Python + pandas + SQLAlchemy |
| Mobile app | React Native (most AI coverage) or Flutter |
| CLI tool | TypeScript + Node.js |
| Realtime app | Next.js + Supabase Realtime |

## Common Pitfalls
1. **Using the latest unstable version** — AI training data lags releases; prefer N-1 stable versions
2. **Mixing too many ORMs/libraries** — inconsistency confuses AI context, produces mismatched patterns
3. **Over-engineering the stack** — more layers = more places for AI to get something wrong
4. **Ignoring TypeScript errors** — `any` casts and `@ts-ignore` comments undermine the type safety that makes AI output reliable

## Review Questions
1. **Why does TypeScript specifically improve AI output quality?** *Answer: Type definitions act as contracts that constrain AI output, reducing hallucinated property names and incorrect function signatures.*
2. **When is it acceptable to deviate from the TypeScript+React default stack?** *Answer: When your team has deep expertise in another stack, when the domain demands a specific technology, or when organizational standards mandate a different language.*
3. **Why is Prisma preferred over raw SQL for AI-generated database code?** *Answer: Prisma's schema file gives AI precise table/column knowledge, TypeScript types prevent field name errors, and the ORM prevents SQL injection risks.*

## See Also
- [[AI_Tools_Comparison]] — which tools work best with which stacks
- [[Frontend_AI_Tools]] — how v0/Lovable use shadcn/Tailwind (the default UI layer)
- [[Context_Management]] — compensating for niche stacks via CLAUDE.md
- [[Code_Quality_Standards]] — enforcing consistent patterns across AI-generated code
