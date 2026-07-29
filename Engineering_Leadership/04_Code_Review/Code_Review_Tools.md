---
title: Code Review Tools
aliases: [PR Review Tools, Code Review Platforms]
tags: [engineering-leadership, code-review, tools, github, ci]
domain: Engineering Leadership
difficulty: Beginner
created: 2026-07-29
related: [Code_Review_Best_Practices, Code_Review_Culture, Delivery_and_Execution]
status: complete
---

# Code Review Tools

> [!abstract] TL;DR
> GitHub PRs are the industry default for code review, with features like inline comments, suggestion commits, CODEOWNERS, and required approvals. Automated guards (linting, type checking, test coverage, security scanning) run in CI and are the first line of defense — they free human reviewers to focus on logic and design. AI review tools (CodeRabbit, GitHub Copilot) are an emerging layer that catches obvious issues before human review.

## GitHub PR Review Features

### Inline Comments and Suggestions

GitHub's core review interface lets reviewers comment on specific lines:

```markdown
<!-- Reviewer leaves a suggested code change: -->
```suggestion
const MAX_RETRIES = 3;
```

Author can click "Commit suggestion" to apply it directly — no manual edit needed.
```

**Review thread states:**
- **Open:** comment needs a response or action
- **Resolved:** author or reviewer marked as done
- **Outdated:** the code changed and the comment no longer applies to the current line

### Review Types

| Type | What it signals |
|---|---|
| **Comment** | General feedback, no approval decision |
| **Approve** | LGTM — this is ready to merge (if required approvals met) |
| **Request changes** | Blocking — must address these before I'll approve |

### Required Approvals and Branch Protection

Configure under Repository → Settings → Branches → Branch protection rules:

```yaml
# Branch protection for main:
require_pull_request_reviews: true
required_approving_review_count: 2
dismiss_stale_reviews: true          # re-approval required after new commits
require_review_from_code_owners: true
require_status_checks_to_pass: true  # CI must pass
include_administrators: true          # branch protection applies to admins too
```

### CODEOWNERS

Automatically request review from specific teams/people when their files change:

```
# .github/CODEOWNERS

# Global owners — review everything
*                           @org/senior-engineers

# Frontend team reviews frontend
/src/frontend/              @org/frontend-team

# Security team reviews auth code
/src/auth/                  @org/security-team
**/migrations/              @org/dba-team

# Single file owners
config/production.yaml      @alice @bob
```

CODEOWNERS rules: last matching pattern wins (like `.gitignore`).

---

## GitLab Merge Requests

GitLab MRs are the equivalent of GitHub PRs with some differences:

| Feature | GitHub PR | GitLab MR |
|---|---|---|
| Auto-close on merge | Via "Closes #123" in PR body | Via "Closes #123" in MR description |
| Required approvals | Branch protection rules | Approval rules with multiple strategies |
| Code quality | GitHub Actions + Code Scanning | GitLab CI + Code Quality widget |
| Suggestion commits | ✓ | ✓ |
| Draft MR | Draft: prefix | Draft: prefix or "Draft" button |
| Review apps | Environments in Actions | Review Apps (built-in) |

GitLab-specific feature: **Approval rules** allow configuring `any 2 of group-a OR 1 from group-b` patterns.

---

## Gerrit — Google's Code Review System

Gerrit is Google's open-source code review system, used internally at Google and externally by Android, Chromium, LibreOffice, and many large open-source projects.

**Key differences from GitHub:**
- **Change-based, not branch-based:** each commit is a separate review unit ("Change")
- **Patchset versioning:** each revision of a Change is a "patchset" — reviewers can compare patchsets
- **Verified + Code-Review scores:** reviewers give `Code-Review: +1/+2/-1/-2` and CI gives `Verified: +1/-1`
- **Submit requires:** `Code-Review: +2` from at least one reviewer + `Verified: +1`

```bash
# Push for review (Gerrit special ref)
git push origin HEAD:refs/for/main

# Push with topic
git push origin HEAD:refs/for/main%topic=my-feature

# Push with reviewers
git push origin HEAD:refs/for/main%r=reviewer@google.com
```

**Why Gerrit:** enforces "one change per review" discipline; excellent for monorepos and large teams where GitHub's PR model breaks down.

---

## AI Code Review Tools

### GitHub Copilot Code Review

GitHub Copilot can leave automated PR review comments:
- Catches obvious bugs (null pointer risks, off-by-one errors)
- Suggests test cases for uncovered paths
- Flags potential security issues (hardcoded credentials, SQL injection patterns)
- Available in GitHub PR review sidebar

### CodeRabbit

CodeRabbit is a dedicated AI reviewer that integrates with GitHub/GitLab:
- Posts a PR summary (walkthrough of all changes)
- Leaves line-by-line review comments
- Learns from your dismissed/accepted suggestions over time
- Configure via `.coderabbit.yaml` in the repo

```yaml
# .coderabbit.yaml
reviews:
  profile: "chill"   # assertive | chill
  request_changes_workflow: false
  high_level_summary: true
  poem: false
  review_status: true
language: "en-US"
tone_instructions: "Focus on security and performance issues"
```

### Sourcery

Sourcery focuses on Python code quality — refactoring suggestions, duplicate detection, complexity reduction:
```bash
sourcery review --github-token TOKEN --pr 123
```

---

## Automated Review Guardrails in CI

The principle: **automate what can be automated, save human review time for what requires judgment**.

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint          # ESLint / Prettier
      - run: npm run typecheck     # TypeScript strict

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% below threshold 80%"
            exit 1
          fi

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with: { languages: javascript }
      - uses: github/codeql-action/analyze@v3
      - run: npx audit-ci --moderate  # block on moderate+ npm vulnerabilities
```

### Automated Checks Checklist

| Check | Tool | Blocks PR? |
|---|---|---|
| Code style | ESLint, Prettier, Black, gofmt | Yes (easy fix) |
| Type safety | TypeScript, mypy, Sorbet | Yes |
| Unit tests pass | Jest, pytest, JUnit | Yes |
| Test coverage > N% | Istanbul, coverage.py | Yes (configurable) |
| Dependency vulnerabilities | `npm audit`, Snyk, Dependabot | Yes (high severity) |
| Secret scanning | GitHub Secret Scanning, Gitleaks | Yes |
| Static analysis | CodeQL, SonarQube, Semgrep | Yes (configurable severity) |
| Performance regression | Lighthouse CI, k6 | Warning |
| Bundle size increase | bundlesize, size-limit | Warning |

---

## Review Metrics

Track these to improve your team's review process:

| Metric | What it tells you | Tool |
|---|---|---|
| **Time to first review** | Are PRs sitting unreviewed? | GitHub Insights, LinearB |
| **Review cycle time** | How many round-trips of review? | LinearB, Sleuth |
| **PR merge time** | Total time from open to merge | DORA, LinearB |
| **Review thoroughness** | Comments per PR, files reviewed | GitHub Insights |
| **Rework rate** | How often are PRs reopened after merge due to bugs? | Issue tracker + DORA |

**DORA's Change Lead Time** includes PR review time as a component — teams with slow reviews have high lead times even if development is fast.

---

## Common Pitfalls

- **Required approvals without CODEOWNERS.** Required approvals mean any 2 team members can approve anything — including files outside their expertise. Add CODEOWNERS to route the right reviewers.
- **Stale review dismissal off.** If `dismiss_stale_reviews` is off, a PR that got approved, then had significant new commits, can be merged with a stale approval.
- **Overwhelming CI check count.** If there are 20+ CI checks and 5 always fail (flaky), engineers learn to merge anyway. Keep checks green and flake-free.
- **AI reviewers creating noise.** If CodeRabbit comments on every nit, engineers start dismissing all AI comments including important ones. Tune the `profile` to be less verbose.
- **No branch protection on main.** Without branch protection, anyone can push directly to main, bypassing review entirely.

---

## Review Questions

1. What is a CODEOWNERS file and where does it live? Write an example that routes all changes to `src/payments/` to the `@billing-team`.
2. What is the difference between `dismiss_stale_reviews` enabled vs disabled?
3. Your team's CI runs 25 checks. 3 are chronically flaky. What is the effect on code review culture, and what should you do?
4. How does Gerrit's "patchset" model differ from GitHub's commit history in a PR? What problem does it solve?
5. Describe the automated check pipeline you'd set up for a TypeScript Node.js project. Which checks block the PR and which are warnings?
