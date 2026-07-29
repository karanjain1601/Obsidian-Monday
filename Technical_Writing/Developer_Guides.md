---
title: Developer Guides
aliases: [Developer Documentation, Tutorials, How-to Guides, README]
tags: [technical-writing, developer-docs, tutorials, readme, diataxis]
domain: Technical Writing
difficulty: Intermediate
created: 2026-07-29
related: [Technical_Writing_Overview, API_Documentation, Documentation_Tools]
status: complete
---

# Developer Guides

> [!abstract] TL;DR
> Developer guides apply the Diátaxis framework in practice: tutorials guide learning by doing (must always work, always teach), how-to guides solve specific problems (steps only, no teaching), and READMEs are the product's front door (install → quickstart → configuration → contribute). Developer portals bring all content together with search, versioning, and feedback loops.

## Writing a Good Tutorial

A tutorial is a **learning experience** — you're teaching a skill, not solving a user's specific problem. The user is a beginner who trusts you to guide them.

### Tutorial Principles

1. **It must always work.** Test tutorials on every release. A tutorial that fails partway through destroys trust immediately.
2. **Teach by doing, not explaining.** Keep theory minimal. Get the user to *do* things — type commands, see results — rather than read theory.
3. **Linear path only.** No branching decisions ("you can either use X or Y"). Pick one path and walk through it.
4. **Celebrate progress.** Every step should produce a visible result the user can see. "You should see: Hello World!"
5. **Never ask the user to understand.** "Run this command. Don't worry about what it does yet — we'll explain it in the next section." Explanation can come after doing.

### Tutorial Structure

```markdown
# Build a Todo API in 10 Minutes

## What you'll build
A REST API with three endpoints: create, list, and complete todos.
By the end, you'll have a running API you can call with cURL.

## Prerequisites
- Node.js 18+ installed (`node --version` should return v18 or higher)
- An API key from your [dashboard](https://dashboard.example.com)

## Step 1: Install the SDK

```bash
npm install @example/sdk
```

Expected output:
```
added 3 packages in 2.1s
```

## Step 2: Create your first todo

Create a file called `create-todo.js`:

```javascript
import { Client } from '@example/sdk';

const client = new Client({ apiKey: 'YOUR_API_KEY' });

const todo = await client.todos.create({
  title: 'Buy groceries',
  dueDate: '2026-08-01',
});

console.log(`Created todo: ${todo.id}`);
```

Run it:
```bash
node create-todo.js
```

You should see:
```
Created todo: todo_abc123
```

## Step 3: ...
```

**Tutorial anti-patterns:**
- "As you can see, this uses the factory pattern..." → stop teaching patterns, keep building
- "There are several ways to do this..." → pick one and go
- Prerequisites that are hard to set up → reduce friction or provide a sandbox

---

## Writing How-To Guides

A how-to guide solves a **specific real-world problem**. The user already knows the basics and needs to accomplish a task.

### How-To Principles

1. **Problem-oriented title:** "How to set up webhook delivery retries" not "Webhooks"
2. **Steps only, no teaching.** Users skip explanations. Get to the steps.
3. **Assume knowledge.** Don't explain basic concepts — link to explanations if needed.
4. **The goal is the title.** Start by stating what the user will accomplish.

### How-To Guide Structure

```markdown
# How to Migrate from API v1 to v2

This guide walks through the breaking changes in v2 and how to update your code.

## Overview of breaking changes

| v1 | v2 | Notes |
|----|-----|-------|
| `user.enabled` | `user.status === 'active'` | Boolean → enum |
| `GET /user` | `GET /users/me` | Endpoint renamed |
| `api_key` header | `Authorization: Bearer` | Auth scheme changed |

## Step 1: Update authentication

**v1:**
```bash
curl -H "api_key: YOUR_KEY" https://api.example.com/v1/user
```

**v2:**
```bash
curl -H "Authorization: Bearer YOUR_KEY" https://api.example.com/v2/users/me
```

## Step 2: Update status checks

**v1:**
```javascript
if (user.enabled) { ... }
```

**v2:**
```javascript
if (user.status === 'active') { ... }
```

## Step 3: Update endpoint URLs

[Full list of renamed endpoints...]

## Verify your migration

Run your test suite. All API calls should succeed with status 200.

If you see `401 Unauthorized`, re-check Step 1.
```

---

## README Best Practices

The README is the **front door** of any project. First impressions matter.

### README Structure

```markdown
# Project Name

One sentence: what this does and who it's for.
"A TypeScript SDK for the Example API, supporting Node.js 18+."

## Install

```bash
npm install @example/sdk
```

## Quickstart

The minimum working example — should work by copy-pasting:

```typescript
import { Client } from '@example/sdk';

const client = new Client({ apiKey: process.env.API_KEY });
const users = await client.users.list();
console.log(users.data);
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | required | Your API key from the dashboard |
| `baseUrl` | string | `https://api.example.com` | Override for staging |
| `timeout` | number | `30000` | Request timeout in milliseconds |

## Examples

- [Create a user](examples/create-user.ts)
- [Paginate results](examples/pagination.ts)
- [Error handling](examples/error-handling.ts)

## Contributing

1. Fork the repo
2. `npm install`
3. `npm test` (must pass before submitting PR)
4. Submit a PR with a description of the change

## License

MIT
```

**README length:** a README should be scannable in 2 minutes. Long READMEs bury the quickstart under walls of text. Use headings liberally so users can jump to what they need.

---

## Developer Portals

A **developer portal** is the centralized home for everything a developer needs to use your product:

```
developer.example.com/
  /docs          ← Documentation (tutorials, how-to guides, reference)
  /reference     ← API reference (OpenAPI)
  /sdks          ← Official SDKs with install instructions
  /changelog     ← What changed in each release
  /status        ← API status page (uptime, incidents)
  /dashboard     ← API keys, usage metrics
```

### Content Strategy for Developer Portals

**Information architecture:** organize by user journey, not by internal product teams:

```
Bad organization (internal):
  Authentication Service → User Service → Payment Service

Good organization (user goal):
  Getting Started → Core Concepts → How-to Guides → API Reference → SDKs
```

**Search is essential.** 70% of returning users go directly to search. Set up Algolia DocSearch or a built-in search index.

**Versioning:** when you ship v2, old v1 docs must remain accessible:
```
/docs/v2/   ← current
/docs/v1/   ← archived (with banner: "This is v1 docs. See v2 →")
```

### Feedback Loops

Every documentation page should have a feedback mechanism:

```markdown
---
Was this page helpful?
[👍 Yes] [👎 No]
[Leave feedback →]
---
```

Analyze feedback to find:
- Pages with high "no" rates (needs rewriting)
- Search terms with no results (needs new page)
- High exit rates after certain steps (that step is failing)

---

## Common Pitfalls

- **Tutorial that requires 30 minutes of prerequisites.** If setting up the environment is harder than the tutorial itself, you've lost the user. Use online sandboxes (CodeSandbox, Replit, StackBlitz) to skip local setup.
- **How-to guide that teaches concepts.** "How to use webhooks" that starts with "What is a webhook?" and 500 words of background. Link to an explanation instead; keep the how-to as steps.
- **README with no quickstart.** A README that only describes the project architecture but doesn't show a working code example in 5 lines has failed its most important job.
- **Developer portal with no search.** Without search, every visit that doesn't land on the exact right page is a failure. Prioritize search before launch.
- **Undated or unversioned tutorials.** A tutorial from 2021 with deprecated APIs is actively harmful. Add last-updated dates and keep tutorials tested in CI.

---

## Review Questions

1. What is the key difference between a tutorial and a how-to guide according to Diátaxis?
2. A developer opens your README. What are the three sections they expect to find in the first screen?
3. Your tutorial step 3 consistently fails for users. What are three changes you would make to improve it?
4. How should you organize a developer portal: by internal product team, or by user goal? Explain why.
5. Write a problem-oriented title for a how-to guide about enabling two-factor authentication on user accounts.
