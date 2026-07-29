---
title: Code Review Best Practices
aliases: [PR Best Practices, Code Review Guidelines]
tags: [engineering-leadership, code-review, collaboration, quality]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Code_Review_Tools, Code_Review_Culture, Technical_Leadership, Team_Building_and_Culture]
status: complete
---

# Code Review Best Practices

> [!abstract] TL;DR
> Code review is a knowledge-sharing and quality tool — not a gatekeeping mechanism. Effective reviews combine a respectful author-reviewer relationship, PRs small enough to review thoroughly (< 400 lines of diff), clear PR descriptions, and structured comment types that distinguish must-fix issues from suggestions. Both author and reviewer share responsibility for making the review productive.

## The Purpose of Code Review

Code review serves three goals, in this order:

1. **Knowledge sharing** — reviewers learn the new code; authors learn from reviewer perspectives; team maintains shared understanding of the codebase
2. **Defect detection** — catch logic bugs, edge cases, security issues, and missing tests before merge
3. **Standards maintenance** — ensure code fits the team's style, architecture patterns, and design principles

> [!warning] What code review is NOT
> Code review is **not gatekeeping** — the reviewer is not the final authority on whether the author's approach is "correct." If you find yourself blocking PRs to enforce personal preferences, you've shifted from collaboration to gatekeeping.

---

## Reviewer Mindset

### Assume Positive Intent

The author did their best with the context they had. Start from that assumption.

```
❌ "This is wrong."
✅ "I'm not sure this handles the case where X is null — could you add a null check?"

❌ "Why would you do it this way?"
✅ "I'm curious about the design choice here — what were the trade-offs you considered vs Y approach?"
```

### Ask Questions, Not Demands

Frame feedback as curiosity, not commands. Questions invite dialogue; demands create defensiveness.

```
❌ "Use a HashMap here."
✅ "Would a HashMap give us O(1) lookup here vs the O(n) linear scan? Or is there a reason you kept the list?"
```

### Nitpick vs Blocking Issue

Every comment should signal its importance. A nit shouldn't block a merge:

| Label | Meaning | Blocks merge? |
|---|---|---|
| **[must-fix]** or **[blocking]** | Correctness, security, data loss risk | Yes |
| **[suggestion]** | Better approach exists but current is acceptable | No |
| **[nit]** | Style preference, minor cleanup | No |
| **[question]** | Reviewer seeking understanding, not requesting change | No |
| **[FYI]** | Sharing context, no action needed | No |

---

## PR Size

**The single most important practice: keep PRs small.**

| Diff size | Review quality | Time to review |
|---|---|---|
| < 200 lines | Thorough, focused | 10–20 min |
| 200–400 lines | Good, but reviewer fatigue begins | 20–45 min |
| 400–800 lines | Reviewers skim, miss details | 45–90 min |
| > 800 lines | Reviews are rubber-stamped | Hours or days |

**Strategies for smaller PRs:**
- One logical change per PR (not "feature + refactor + bug fix")
- Stack PRs: PR1 is the refactor, PR2 is the feature on top
- Feature flags: merge incomplete features behind a flag
- Split migrations from application code changes

---

## PR Description Quality

A good PR description answers three questions:

1. **What changed?** — a concise summary of the change
2. **Why?** — the motivation: bug fix, user need, tech debt, performance
3. **How to test?** — steps to verify the change works

### PR Description Template

```markdown
## What
Replace linear scan with HashMap lookup in user lookup service.

## Why
User lookup is called ~500x/sec at peak. The O(n) scan over 10k users 
was contributing 40ms to p99 response time (profiler trace in #1234).

## How to test
1. Run `./gradlew test` — all existing tests should pass
2. Load test with `k6 run scripts/load-test-users.js`
3. Check p99 latency in Grafana drops from ~40ms to < 5ms

## Screenshots / evidence
[attach profiler trace]

## Checklist
- [x] Tests added/updated
- [x] No hardcoded secrets
- [x] Backwards compatible
```

---

## Review Checklist

Go through these categories when reviewing:

### Correctness
- [ ] Does it handle all edge cases (null, empty, boundary values, concurrent access)?
- [ ] Is error handling complete (exceptions caught, error responses returned)?
- [ ] Are there off-by-one errors in loops or array indexing?
- [ ] Does it handle the failure case (network timeout, database error)?

### Tests
- [ ] Are new code paths covered by tests?
- [ ] Are existing tests still passing (no regression)?
- [ ] Are test cases meaningful (not just testing the happy path)?
- [ ] Are test names descriptive (`should return 404 when user not found` > `testGetUser`)?

### Security
- [ ] Is user input validated and sanitized?
- [ ] Are there SQL injection, XSS, or SSRF risks?
- [ ] Are secrets/credentials handled via env vars (never hardcoded)?
- [ ] Is authorization checked (not just authentication)?

### Performance
- [ ] Any N+1 query problems (loading related data in a loop)?
- [ ] Any unnecessary memory allocations in hot paths?
- [ ] Are database queries indexed?
- [ ] Any missing caching opportunities?

### Readability
- [ ] Are variables, functions, and classes named clearly?
- [ ] Are complex blocks accompanied by a comment explaining *why* (not just *what*)?
- [ ] Is the code at the right abstraction level?

### YAGNI (You Aren't Gonna Need It)
- [ ] Is there added complexity "for future flexibility" that isn't justified by a current need?
- [ ] Are there dead code paths or unused parameters?

---

## How to Respond to Review Comments

As an author, receiving feedback is part of the process:

```
Reviewer: "nit: variable name `d` isn't clear — could be `durationMs`?"

Author options:
  ✅ Make the change and reply "Done ✓"
  ✅ "Changed to durationMs — good catch."
  ✅ "I used `d` because it matches the local convention in this file 
      (see L45, L67) — happy to rename all of them for consistency, 
      or leave it. What do you prefer?"
  ❌ Ignore the comment without resolving it
  ❌ "It's fine as is." (no explanation)
```

**Key principles:**
- Respond to every comment (resolve or explain)
- If you disagree, explain your reasoning and propose a path forward
- For blocking issues, fix them before re-requesting review
- Don't argue in PR comments — sync via Slack/huddle if there's real disagreement

---

## Async vs Sync Review Workflows

| Approach | When to use | Trade-offs |
|---|---|---|
| **Async PR review** | Standard workflow | Author doesn't wait; reviewer reviews when focused; slower cycle |
| **Synchronous pair review** | Complex PRs, teaching moments, urgent changes | Faster feedback; costly in time; good for onboarding |
| **Draft PR** | Work in progress, seeking early feedback | Author signals not ready to merge; get direction early |
| **Review meeting** | Large architectural PRs | Whole team reviews together; shared understanding |

**Recommended for distributed teams:** async by default with a **24-business-hour review SLA** (reviewers must leave a comment within 1 business day). For blocking PRs, tag the reviewer in Slack.

---

## Common Pitfalls

- **Reviewing too large a PR.** Reviewer fatigue leads to missed bugs. Enforce PR size in your team norms.
- **Only commenting on style.** If all your comments are "rename this variable," you're not reviewing logic, tests, or security.
- **Approving without reading.** A rubber-stamp approval creates false confidence. It's better to say "I looked at the tests and service layer but didn't review the DB schema" than to blindly approve.
- **Blocking on opinions.** If two approaches are both acceptable, let the author choose. Blocking on personal preference wastes everyone's time.
- **Not writing review comments until fully done.** Leave "thinking out loud" comments as you read — the author can respond to questions even if you haven't finished.

---

## Review Questions

1. A PR modifies 1,200 lines across 15 files. As the reviewer, what should you do before reviewing?
2. You write a comment: "This won't work if the list is empty." What label should you use, and how should you phrase it constructively?
3. The author pushes back on your suggestion: "I prefer my approach." The approach is acceptable but yours is marginally better. How do you handle this?
4. What are the three purposes of code review, and which should take priority?
5. Your team's PRs average 600 lines of diff. What structural changes would you propose to reduce PR size?
