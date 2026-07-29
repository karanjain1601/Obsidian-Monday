---
title: Maintaining AI Codebases
aliases: [AI Codebase Maintenance, Long-term Vibe Coding, AI Technical Debt]
tags: [VibeCoding, StandardsAndSafety]
domain: Vibe Coding
difficulty: Advanced
created: 2026-07-29
related: [Code_Quality_Standards, Vibe_Coding_Anti_Patterns, Security_for_Vibe_Coders, Testing_Strategy, Context_Management]
status: complete
---

# Maintaining AI Codebases

> [!abstract] TL;DR
> AI-generated codebases accumulate technical debt faster than hand-written ones because AI optimises locally, not globally. Prevention requires scheduled architectural reviews, living documentation, and an ownership mindset — you are responsible for understanding the code even if you didn't write every line.

## The AI Slop Problem

"AI slop" is the accumulation of technically functional but architecturally degraded code produced when AI is used without quality review. It builds up gradually:

- **Duplicated logic** — AI re-implements a utility function it "forgot" exists elsewhere
- **Inconsistent patterns** — different components handle the same concern differently
- **Dead code** — experiments, superseded components, and commented-out attempts
- **Monolithic files** — AI extends the current file rather than creating appropriate modules
- **Magic numbers and unexplained decisions** — AI makes decisions without documenting why

Individually, each item is minor. Cumulatively, they make the codebase harder to understand, harder for AI to reason about accurately, and harder to onboard new developers.

**Prevention is 10x cheaper than remediation.** The habits in [[Code_Quality_Standards]] prevent slop accumulation; this note covers what to do when it has accumulated and how to sustain quality long-term.

## Forcing Architectural Reviews

Schedule regular architectural review sessions — separate from feature development:

**Monthly review prompt:**
> "Review the overall architecture of this codebase. Identify:
> 1. Modules that have grown beyond their original scope
> 2. Duplicate logic across multiple files
> 3. Architectural decisions from early in the project that no longer fit our current scale
> 4. Files that should be split or merged
> 5. Patterns that are inconsistent across the codebase
> 
> Produce a prioritised list. Do not make changes yet."

This produces a **refactoring backlog** you can address in dedicated sessions.

```mermaid
flowchart LR
    A[Monthly Architectural Review] --> B[Prioritised Refactor List]
    B --> C[Refactor Session 1: File structure]
    C --> D[Refactor Session 2: Duplicate logic]
    D --> E[Refactor Session 3: Pattern consistency]
    E --> F[Update CLAUDE.md with new patterns]
    F --> G[Next month...]
    G --> A
```

## Keeping Documentation Current

AI-generated code is well-structured but often lacks the "why" behind decisions. Documentation debt compounds:

- CLAUDE.md becomes stale as architecture evolves
- Complex functions lack comments explaining non-obvious logic
- API endpoints have no documentation for future maintainers
- Decisions made in session (not in code) disappear

**Documentation as a regular habit:**

After each significant feature:
> "Update the CLAUDE.md to reflect the current project state, tech decisions, and active constraints. Mark Phase 2 as complete and Phase 3 as starting."

After each refactoring session:
> "Add JSDoc comments to the functions in /lib/tasks.ts explaining what they do, their parameters, and any non-obvious behaviour."

## Code Ownership Mindset

The most important long-term maintenance principle: **you own the code, even if AI wrote it.** This means:

- You are responsible for knowing what the code does at a high level
- You are accountable for security vulnerabilities, even those you didn't author
- You are the one who fields questions from teammates and stakeholders
- "The AI wrote it and I don't know why" is not an acceptable answer in production

**Building ownership without writing every line:**
1. Read AI-generated code before committing it (not every line, but the logical structure)
2. Write the tests yourself occasionally, even when AI would write them — tests are how you verify your understanding
3. Do manual debugging sessions periodically to stay familiar with the codebase
4. Can you explain, at a high level, what each major module does? If not, spend time reading it.

## Onboarding Others to AI-Generated Code

When a new developer joins a project built with AI, they face a specific challenge: AI code is often locally clean but globally opaque. No single developer holds the full mental model.

**Onboarding documentation should include:**
- An architecture diagram (generate with AI, review carefully)
- A "why we chose X" document for major decisions
- A tour of the key data models and how they relate
- The CLAUDE.md as an always-up-to-date reference

> "Generate an architecture overview for this codebase suitable for a new developer joining the team. Include: the main data models and their relationships, the key API routes and what they do, how auth works, and the major third-party integrations."

Then review and annotate the AI's output — it will be accurate on structure but may miss context only you know.

## Preventing "Zombie Code"

Zombie code is code that exists in the repo but is no longer part of any user flow — it's dead but not cleaned up. AI accumulates it because:
- Prototyping prompts generate code that gets superseded
- Debug logging gets left in
- Old component versions stick around when new ones are created

**Quarterly zombie hunt:**
> "Identify files in /components and /lib that are not imported anywhere in the codebase. List them — do not delete yet."

Then review the list: some may be used indirectly (dynamic imports, route-based loading). Delete the confirmed zombies, then run tests to confirm nothing broke.

## Dependency Hygiene

AI installs packages freely. Over time, the `package.json` becomes a graveyard:
- Packages installed for experiments that weren't needed
- Multiple packages solving the same problem
- Outdated packages with known vulnerabilities

**Quarterly dependency audit:**
```bash
# Find unused dependencies
npx depcheck

# Check for security vulnerabilities  
npm audit

# Check for outdated packages
npm outdated
```

> "Review the output of `npx depcheck`. For each unused dependency listed, confirm whether it's truly unused or used indirectly, then remove the confirmed unused ones."

## Technical Debt Register

Maintain a small technical debt register in your CLAUDE.md or a dedicated note:

```markdown
## Known Technical Debt

### High Priority
- TaskBoard.tsx is 480 lines — needs splitting (sprint 4)
- Auth token refresh logic is incomplete — edge case when token expires mid-request

### Medium Priority  
- Project list component fetches all projects with no pagination
- User settings form has duplicated validation logic vs. API route

### Low Priority / Won't Fix Soon
- Console.log statements left from debugging in /lib/utils.ts (harmless but noisy)
```

This externalises the debt from your memory so it doesn't get forgotten, and gives AI context to avoid making decisions that conflict with planned refactors.

## Common Pitfalls
1. **Treating "it works" as sufficient** — functional and maintainable are different standards
2. **No architecture review cadence** — debt accumulates silently between reviews
3. **CLAUDE.md last updated three months ago** — stale context produces inconsistent new code
4. **No sense of code ownership** — "AI wrote it" is an explanation, not an excuse

## Review Questions
1. **What is "AI slop" and what causes it?** *Answer: Accumulated technically functional but architecturally degraded code; caused by AI optimising locally (per task) without a global architectural view.*
2. **What should the monthly architectural review produce?** *Answer: A prioritised refactoring backlog of modules that have grown beyond scope, duplicated logic, inconsistent patterns, and outdated architectural decisions.*
3. **What does "code ownership mindset" mean for a vibe coder?** *Answer: You are responsible for understanding the code at a high level, accountable for its security and correctness, and able to explain it to others — even if AI wrote most of the lines.*

## See Also
- [[Code_Quality_Standards]] — habits that prevent debt accumulation
- [[Vibe_Coding_Anti_Patterns]] — specific failure modes leading to unmaintainable code
- [[Security_for_Vibe_Coders]] — security posture maintenance over time
- [[Context_Management]] — keeping CLAUDE.md current to prevent context drift
