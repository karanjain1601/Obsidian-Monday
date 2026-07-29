---
title: Code Review Culture
aliases: [Review Culture, PR Culture, Healthy Review]
tags: [engineering-leadership, code-review, culture, team, psychological-safety]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Code_Review_Best_Practices, Code_Review_Tools, Team_Building_and_Culture, People_Management]
status: complete
---

# Code Review Culture

> [!abstract] TL;DR
> A healthy review culture requires psychological safety (no shame for mistakes), blameless language, explicit norms (SLA, comment types), and leadership modeling. Google's Code Review Developer Guide is the industry standard. The key insight: review is a team practice, not an individual judgment — the goal is shipping good code together, not proving one engineer is smarter than another.

## Psychological Safety in Review

Code review is inherently vulnerable — you're exposing your work to scrutiny. Without psychological safety, engineers:
- Write fewer tests (less to criticize)
- Write large PRs to avoid frequent feedback
- Stop asking questions in reviews
- Become defensive when receiving feedback

**Building psychological safety in review:**

1. **Normalize learning:** When a reviewer finds a bug, celebrate the catch — don't shame the author. "Good catch, I totally missed that edge case" is the right response.
2. **Model curiosity:** Use questions not commands. "I wonder if we could simplify this with X?" not "Use X."
3. **Public praise, private criticism:** If you find a pattern of mistakes in someone's code, have a private 1:1 conversation — don't call it out in the PR where the whole team sees.
4. **No "bike-shedding" derailment:** Long review threads about variable names or formatting erode trust. Automate style; don't argue it in PRs.

---

## Blameless Language

The language in code reviews shapes the culture:

```
Blameless → "This section is a bit hard to follow — could we add a comment explaining the algorithm?"
With blame → "This code is confusing."

Blameless → "I think there might be a race condition here if two requests arrive simultaneously."
With blame → "You didn't think about concurrency."

Blameless → "The happy path looks good! I noticed we're not handling the case where `user` is null."
With blame → "You forgot null checks."
```

**Rule of thumb:** write as if the code wrote itself. Comment on the code, not the author.

---

## Google's Code Review Developer Guide

Google published its internal code review guidelines (eng-practices). Key principles:

### For Reviewers

1. **Look at the big picture first** — is the overall design right before nitpicking details?
2. **Approve imperfect but working code.** Don't let perfect be the enemy of good. If it works, improves things, and the downsides are manageable — approve it.
3. **Resolve conflicts by explaining, not insisting.** If author and reviewer disagree, explain the reasoning behind the concern. Don't just repeat "I don't like it."
4. **Review in reasonable time** — within 1 business day for most PRs. Slow reviews block engineers and damage trust.
5. **Complete what you've started.** Don't leave a review half-done — it blocks the author and is worse than not reviewing at all.

### For Authors

1. **Create small CLs (Changelists).** The single most important PR hygiene practice.
2. **Respond to all comments.** Don't leave comments open without a response or resolution.
3. **Don't fight against reviewer preferences without justification.** If you disagree, explain why — but be willing to defer to the reviewer's expertise in their domain.
4. **Add context to PRs.** Don't make reviewers guess why you made a change — explain it in the description.

---

## Pair Programming as Alternative

Pair programming (and mob programming) can replace or augment code review:

| Aspect | Code Review (async) | Pair Programming (sync) |
|---|---|---|
| Latency | Hours to days | Immediate |
| Knowledge transfer | Reviewer reads code | Both engineers see code being written |
| Bug detection | After the code is written | During writing |
| Breadth | One reviewer, one pass | Continuous two-person check |
| Cost | ~20% of dev time | ~100% of dev time for the pair |

**When to pair instead of review:**
- Complex algorithmic work where real-time discussion is faster than async
- Onboarding new engineers (pair on first few weeks)
- High-risk production changes (deploy pairing)
- Stuck engineers (debugging sessions)

Pair programming doesn't eliminate review entirely — a second pair of eyes on the final diff is still valuable for catching what both authors normalized.

---

## Async Review in Distributed Teams

Async review (different timezones) introduces specific challenges:

```
SF engineer submits PR at 9am → London reviewer picks it up at 2pm (5h wait)
→ London leaves 3 comments → SF picks up at 9am next day (19h round trip)
= 24+ hour review cycle for one pass
```

**Strategies:**

1. **Write-heavy review comments.** Async review requires more written context. "Change X" is insufficient — "Change X because Y, here's the pattern we use in module Z" saves a round-trip.

2. **Draft PRs for early design feedback.** Open a draft PR before all the code is written to get design direction early. Avoids large re-writes after full implementation.

3. **Review SLA.** Define team norm: "All PRs must receive a first review (even if just a comment saying 'I'll review by EOD') within 1 business day." Without an SLA, PRs become blockers.

4. **Time-zone-aware review assignment.** If the PR is from Sydney and your London teammates won't be awake for 10 hours, assign to the US teammates first.

5. **Synchronous review for high-stakes PRs.** For architectural changes or high-risk PRs, schedule a 30-minute review call rather than async back-and-forth.

---

## Reviewer Assignment Strategies

| Strategy | How it works | Best for |
|---|---|---|
| **Round-robin** | PRs assigned to team members in rotation | Balanced workload; everyone reviews everything |
| **Expertise-based** | Route PRs by changed file type/module to experts | Deep review quality; risk of bottlenecks |
| **CODEOWNERS** | GitHub auto-assigns based on `.github/CODEOWNERS` | Large codebases with clear ownership |
| **Author's choice** | Author selects reviewers | Flexibility; can be gamed (always pick the easiest reviewer) |
| **Random + expertise hybrid** | Random primary reviewer + auto-assign CODEOWNER | Balanced + expert coverage |

**Avoid:** always assigning PRs to the same senior engineer. Creates bottleneck, burnout, and deprives junior engineers of reviewing opportunities.

---

## Review SLA

Define explicit SLA expectations to prevent PRs from stagnating:

```
Team norm (example):
- First review response: within 1 business day
- Full review (all comments): within 2 business days
- Author response to review: within 1 business day
- Escalation: if blocked > 3 business days, ping reviewer in Slack
- Review turnaround goal: merge within 5 business days of opening
```

**Track SLA compliance** with tools like LinearB, Swarmia, or custom GitHub Actions that post to Slack when PRs are stale.

---

## Reducing Review Friction

### Pre-Review Self-Review

Before requesting review, the author should self-review:

```markdown
## Author checklist before requesting review:
- [ ] I read every changed line myself
- [ ] I've tested the change locally
- [ ] Tests are added/updated
- [ ] PR description explains what, why, and how to test
- [ ] PR is < 400 lines of diff
- [ ] No console.log / debugging artifacts
- [ ] No TODO comments without tracking issues
```

### PR Templates

Enforce good PR descriptions with a template:

```markdown
<!-- .github/pull_request_template.md -->
## What changed
<!-- One paragraph summary -->

## Why
<!-- Motivation: bug, feature request, tech debt, perf -->

## How to test
<!-- Steps to verify the change -->

## Checklist
- [ ] Tests added/updated
- [ ] No hardcoded secrets
- [ ] Breaking change? (Y/N) — if yes, describe migration
- [ ] Documentation updated (if user-facing change)
```

---

## Reviewing for Learning vs Reviewing for Correctness

Two modes of review, both valid:

**Reviewing for learning (reviewer learns):**
- Reviewer asks questions to understand the design
- "I haven't used this pattern before — can you explain why you used X?"
- Good for onboarding and knowledge sharing

**Reviewing for correctness (author learns):**
- Reviewer has stronger context and guides the author
- More mentor-review style
- Must be done with care to avoid making authors feel inadequate

**Balance:** Most reviews should be a mix. Pure "reviewing to correct" erodes author ownership; pure "reviewing to learn" misses real issues.

---

## Common Pitfalls

- **No explicit comment type labeling.** When comments aren't labeled (nit/must-fix/question), authors don't know what to prioritize. Every comment looks blocking.
- **Review SLA without accountability.** Publishing a SLA but not tracking compliance means it's theater. Use tooling to surface stale PRs.
- **EMs never reviewing code.** When engineering managers stop reviewing code, they lose technical credibility and the team perceives review as a junior activity.
- **Senior engineers who never approve without changes.** When the most senior reviewer always finds something to block on, authors start hiding complexity in later PRs or avoiding the reviewer.
- **Large PR amnesty.** Allowing occasional huge PRs ("this one is special") normalizes large PRs. Hold the line on PR size.

---

## Review Questions

1. A junior engineer gets a review with 25 comments from a senior. The junior becomes reluctant to submit PRs. As EM, what do you do?
2. What are two key differences between Google's Code Review guide's advice for authors vs reviewers?
3. Your team is distributed across SF and London (8-hour timezone gap). Review cycle is averaging 3 days per pass. What are three structural changes you'd make?
4. Why is pair programming insufficient as a full replacement for code review?
5. Describe what "blameless language" means in code review with two contrasting examples.
