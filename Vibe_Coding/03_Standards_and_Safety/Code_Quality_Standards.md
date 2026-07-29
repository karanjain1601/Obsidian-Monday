---
title: Code Quality Standards
aliases: [AI Code Quality, Vibe Coding Standards, Code Review AI]
tags: [VibeCoding, StandardsAndSafety]
domain: Vibe Coding
difficulty: Intermediate
created: 2026-07-29
related: [Maintaining_AI_Codebases, Testing_Strategy, Vibe_Coding_Anti_Patterns, Planning_with_AI, Context_Management]
status: complete
---

# Code Quality Standards

> [!abstract] TL;DR
> AI reinforces whatever patterns it finds in your codebase — establish good patterns early and AI will perpetuate them. The critical habits are: modular files under 300 lines, regular refactoring sessions, and critically reviewing AI's initial architectural decisions before they become your foundation.

## Why Patterns Established Early Are Hard to Change

AI coding tools are pattern-matchers trained on your codebase. If the first 20 files in your project use one pattern, AI will apply that pattern to files 21-200. This is a double-edged sword:

- **Good:** If you establish clean, consistent patterns early, AI will replicate them automatically
- **Bad:** If you accept mediocre initial choices, they compound — AI will produce more of the same

The first week of a project is the highest-leverage time to enforce standards. Fight hard for quality in the foundation; it pays dividends on every subsequent AI interaction.

## Establishing Coding Patterns Early

Define your patterns explicitly and put them in CLAUDE.md. Examples:

```markdown
## Code Patterns (CLAUDE.md section)

### Component Pattern
- All components are functional with TypeScript props interface
- Props interface named `ComponentNameProps`
- Export default at bottom of file
- No more than one component per file

### API Route Pattern  
- Returns `{ data: T | null, error: string | null }`
- Input validation using zod before any logic
- All DB operations in try/catch
- HTTP status codes: 200 (success), 400 (validation), 401 (auth), 500 (server)

### State Management
- Prefer server state (React Query / SWR) over local state for data
- Local state only for UI-only concerns (modal open, form inputs)
- No Context API for data — use React Query cache
```

When these patterns are explicit in CLAUDE.md, AI follows them consistently. Without them, AI invents its own patterns per file.

## Regular Refactoring Sessions

Schedule deliberate refactoring sessions separate from feature development. Trying to refactor and add features simultaneously produces confused AI output.

**Refactoring session prompt:**
> "Review the files in /components/tasks. Identify:
> 1. Any file over 300 lines that should be split
> 2. Duplicated logic that should be extracted to a shared utility
> 3. Inconsistent naming that doesn't follow our conventions
> 4. Components that are doing too much (business logic in UI components)
> 
> List the issues first. Wait for my approval before making changes."

Run this after every major feature completion. See it as a quality gate before the next phase.

```mermaid
flowchart LR
    A[Feature complete] --> B[Tests pass]
    B --> C[Commit feature]
    C --> D[Refactoring session]
    D --> E[AI identifies issues]
    E --> F[Review + approve]
    F --> G[AI refactors]
    G --> H[Tests pass again]
    H --> I[Commit refactor]
    I --> J[Next feature]
```

## Modular Files: The 300-Line Rule

AI-generated code tends toward monolithic files. Large files degrade AI output quality because the relevant context gets diluted across hundreds of lines of unrelated logic.

**The 300-line rule:** No file should exceed ~300 lines. When a file approaches this limit:
- Extract pure utility functions to `/lib/utils.ts`
- Extract type definitions to `/types/`
- Split large components into subcomponents
- Extract business logic from UI components into hooks

> "The file `/components/TaskBoard.tsx` is 450 lines. Identify natural split points and propose how to break it into smaller modules."

## Removing Dead Code

AI accumulates dead code: commented-out experiments, unused imports, functions that were superseded. This is noise that degrades future AI context quality.

> "Audit the /components directory for:
> - Unused imports
> - Commented-out code
> - Functions or variables defined but never called
> - Deprecated components that have been replaced
> 
> List everything you find."

Run this audit monthly. Dead code isn't just a style issue — it confuses AI about what's actually in use.

## Reviewing AI's Initial Architectural Decisions

The most important review moment is the **initial scaffold**. When AI designs the first version of a component hierarchy, data model, or module structure, review it critically before building on it:

**Questions to ask:**
- Does this data model support the features I'll need in Phase 2?
- Is this component hierarchy logical, or will it become a prop-drilling nightmare?
- Is the state management approach consistent with the rest of the app?
- Are the file and folder names clear enough that a new developer would understand the structure?

If the scaffold is wrong at this stage, fix it before writing 20 more files that depend on it.

## The Code Review Habit

Treat every AI PR as you would a junior developer's PR:

| Review Focus | What to Check |
|---|---|
| Correctness | Does it do what was asked? Any edge cases missed? |
| Security | Input validation, auth checks, no hardcoded secrets |
| Performance | No N+1 queries, no unnecessary re-renders |
| Maintainability | Clear naming, no magic numbers, not too clever |
| Tests | Are tests present? Do they test the right things? |
| Consistency | Does it follow established patterns in the codebase? |

Even a 2-minute glance at these dimensions before committing catches the majority of quality issues.

## Linting and Formatting as Quality Anchors

Automated tools enforce standards without mental overhead:

```json
// package.json scripts
{
  "lint": "eslint . --ext .ts,.tsx",
  "type-check": "tsc --noEmit",
  "format": "prettier --write ."
}
```

Ask AI to fix lint errors before committing:
> "Run the lint check and fix all issues. If any require judgment calls, list them for my review."

TypeScript strict mode + ESLint catches a large class of AI errors automatically. See [[Vibe_Coding_Stack]] for why TypeScript strict mode is worth the overhead.

## Common Pitfalls
1. **Not establishing patterns in CLAUDE.md** — AI invents inconsistent patterns per file
2. **Skipping refactoring sessions** — technical debt accumulates faster with AI than with humans
3. **Accepting the initial scaffold without critique** — the wrong foundation is extremely expensive to fix later
4. **Using lint errors as optional** — treat lint errors as build failures; don't ship code that doesn't pass

## Review Questions
1. **Why does establishing patterns early matter more in AI development than traditional development?** *Answer: AI reinforces whatever patterns it finds — good patterns early means 200 files that follow them; bad patterns early means 200 files that perpetuate the mistakes.*
2. **What is the 300-line rule and why does it improve AI output?** *Answer: Files over 300 lines should be split; large files dilute relevant context with unrelated code, degrading AI's ability to reason about the specific part you're working on.*
3. **What is the most important architectural review moment in a project?** *Answer: The initial scaffold — before building on it, verify the data model, component hierarchy, and module structure are correct; fixing a wrong foundation later is very expensive.*

## See Also
- [[Maintaining_AI_Codebases]] — preventing quality degradation over time
- [[Testing_Strategy]] — tests as a quality gate
- [[Vibe_Coding_Anti_Patterns]] — monolithic files and inconsistent patterns as anti-patterns
- [[Context_Management]] — how CLAUDE.md enforces standards across sessions
