---
title: Git Workflows and Hooks
aliases: [GitFlow, Trunk-Based Development, Git Hooks, Husky, Commitlint]
tags: [Git, GitHub, DevOps, Workflows, Hooks]
domain: DevOps
difficulty: Advanced
created: 2026-07-29
related: [Git_Branching_and_Merging, GitHub_Collaboration, GitHub_Actions_Deep_Dive, _MOC_Git_GitHub]
status: complete
---

# Git Workflows and Hooks

> [!abstract] TL;DR
> GitFlow suits scheduled versioned releases but introduces complexity; GitHub Flow and trunk-based development (TBD) suit CI/CD teams. Monorepo tools like Turborepo and Nx enable path-based CI triggering. Git hooks (pre-commit, commit-msg, pre-push) automate local quality gates; Husky, lint-staged, commitlint, and lefthook are the primary tools for enforcing them.

---

## Workflow Strategy Deep Dive

### GitFlow

Introduced by Vincent Driessen (2010). Uses long-lived parallel branches:

```
main       ─────────────────────────────────────────▶
               ↑  merge release               ↑  merge hotfix
release/1.0  ──┤                              │
               │  ← from develop              │
develop    ──────────────────────────────────────────▶
               ↑  merge feature               ↑  merge feature
feature/A  ────┤                  feature/B  ─┤
```

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready code only | — |
| `develop` | Integration branch for features | — |
| `feature/*` | New features | `develop` |
| `release/*` | Release preparation, only bug fixes | `main` + `develop` |
| `hotfix/*` | Urgent production fixes | `main` + `develop` |

**Pros:** Clear separation; supports parallel release lines; good audit trail.

**Cons:** Complex; slow integration (features sit in `develop` for days); bad fit for continuous delivery; merge conflicts accumulate.

**Tooling:** `git-flow` CLI automates the branch lifecycle:
```bash
git flow init
git flow feature start payment-gateway
git flow feature finish payment-gateway
git flow release start 2.0.0
git flow release finish 2.0.0
```

---

### GitHub Flow

Simple: `main` + short-lived feature branches.

```
main:     A → B → → → → → → → M2
               ↘            ↗
feature/X:      C → D → E
```

Rules:
1. `main` is always deployable
2. Create descriptive branches from `main`
3. Commit regularly; push often
4. Open a PR when ready for feedback (even for WIP — use draft PR)
5. Merge only after CI passes and reviews are approved
6. Deploy immediately after merge

**Best for:** SaaS, web apps, teams deploying daily or more frequently.

---

### Trunk-Based Development (TBD)

All developers integrate to `trunk` (main) at least once per day. Feature branches live < 2 days.

```
trunk: A → B → C → D → E → F → G → H  (everyone pushes here)
                   ↗       ↗
           short-lived (< 2 days)
```

**Feature flags** hide incomplete features:

```python
if feature_flag("new-checkout-flow"):
    return new_checkout()
else:
    return legacy_checkout()
```

**Feature flag systems:** LaunchDarkly, Unleash, flagsmith, OpenFeature.

**Pros:** Minimum merge conflicts (small batches); DORA elite performers use TBD; fast feedback loop.

**Cons:** Requires feature flags for every incomplete feature; team discipline essential; needs comprehensive CI.

---

### Comparison Matrix

| Dimension | GitFlow | GitHub Flow | Trunk-Based |
|-----------|---------|-------------|-------------|
| Branch lifespan | Weeks | Days | < 2 days |
| Release cadence | Scheduled | On merge | On merge / hourly |
| Complexity | High | Low | Medium (feature flags) |
| Conflict surface | High | Medium | Low |
| DORA level | Low/Medium | Medium/High | Elite |
| Best for | Versioned libraries, packaged software | SaaS web apps | High-velocity CI/CD |

---

## Monorepo Strategies

A monorepo holds multiple projects/packages in one repository.

### Turborepo

```bash
npx create-turbo@latest
```

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],   // build deps first
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "test/**"]
    },
    "lint": {}
  }
}
```

Turborepo uses content-hash caching: if inputs haven't changed, skip the task and restore cached output.

### Nx

```bash
npx create-nx-workspace@latest
nx affected:test --base=main    # only test projects affected by changes
nx graph                        # visualise dependency graph
```

### Path-Based CI Triggering (GitHub Actions)

Only run CI for packages that changed:

```yaml
on:
  push:
    paths:
      - "packages/api/**"
      - ".github/workflows/api.yml"

jobs:
  build-api:
    if: github.event_name == 'push'
    steps:
      - run: cd packages/api && npm test
```

Or use a change detection action:

```yaml
steps:
  - uses: dorny/paths-filter@v3
    id: changes
    with:
      filters: |
        api:
          - 'packages/api/**'
        frontend:
          - 'packages/frontend/**'

  - if: steps.changes.outputs.api == 'true'
    run: cd packages/api && npm test
```

---

## Git Hooks

Hooks are scripts in `.git/hooks/` that execute at specific lifecycle points. They are **not committed** by default (unless you use a tool like Husky that symlinks them).

### Client-Side Hooks

| Hook | Fires | Common Use |
|------|-------|-----------|
| `pre-commit` | Before commit is created | Run linters, tests |
| `prepare-commit-msg` | Before commit message editor opens | Inject issue number |
| `commit-msg` | After message is written | Validate Conventional Commits |
| `post-commit` | After commit completes | Notifications, stats |
| `pre-push` | Before push to remote | Run full test suite |
| `pre-rebase` | Before rebase starts | Warn about dangerous rebases |

### Server-Side Hooks (bare repo / GitHub not exposed to clients)

| Hook | Fires | Common Use |
|------|-------|-----------|
| `pre-receive` | Before accepting a push | Enforce policies |
| `update` | Per-ref during receive | Enforce per-branch rules |
| `post-receive` | After push accepted | Trigger CI, deploy |

### Manual Hook Example

```bash
#!/bin/sh
# .git/hooks/pre-commit
set -e
npm run lint
npm run test:unit
```

```bash
chmod +x .git/hooks/pre-commit
```

---

## Husky — Managing Hooks in Version Control

Husky installs hooks into `.git/hooks/` from a config you commit to the repo.

```bash
npm install --save-dev husky
npx husky init              # creates .husky/ directory and installs hooks
```

```bash
# .husky/pre-commit
npm run lint

# .husky/commit-msg
npx --no -- commitlint --edit $1

# .husky/pre-push
npm test
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky"     // install hooks on npm install
  }
}
```

> [!note]
> Husky v9+ uses `npx husky init`. The `.husky/` folder contains the hooks; they are committed to the repo. Contributors get hooks automatically on `npm install`.

---

## lint-staged — Incremental Linting

Only lint files that are **staged**, not the entire codebase. Dramatically faster pre-commit hooks.

```bash
npm install --save-dev lint-staged
```

```json
// package.json or .lintstagedrc.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx}": ["eslint --fix"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

---

## commitlint — Enforcing Conventional Commits

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor",
      "test", "chore", "perf", "ci", "revert"
    ]],
    "scope-case": [2, "always", "lower-case"],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [2, "always", 100]
  }
};
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

```
# Valid:
feat(auth): add PKCE support for OAuth flow

# Invalid (rejected by commitlint):
WIP: stuff
Added new feature
```

---

## lefthook — Husky Alternative

Lefthook is a fast, single-binary hooks manager written in Go. Supports parallel hook execution.

```bash
npm install --save-dev @evilmartians/lefthook
# or: brew install lefthook
```

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js}"
      run: npx eslint {staged_files}
    format:
      glob: "*.{ts,tsx,js,json}"
      run: npx prettier --check {staged_files}

commit-msg:
  commands:
    validate:
      run: npx commitlint --edit {1}

pre-push:
  commands:
    test:
      run: npm test
```

```bash
lefthook install       # install hooks
lefthook run pre-commit # manually run hooks
```

**lefthook vs Husky:**

| | Husky | lefthook |
|-|-------|---------|
| Config format | Shell scripts in `.husky/` | Single YAML file |
| Parallel hooks | No | Yes |
| Dependency | npm package | Single binary |
| Performance | Slower | Faster |

---

## `.gitattributes` — Line Endings and Merge Strategies

```gitattributes
# Force LF line endings on checkout (cross-platform teams)
* text=auto eol=lf

# Force CRLF for Windows-only files
*.bat text eol=crlf
*.ps1 text eol=crlf

# Binary files — no diff, no merge
*.png binary
*.jpg binary
*.pdf binary

# Custom merge driver for lock files (union merge)
package-lock.json merge=npm-merge-driver

# Mark generated files for diff verbosity reduction
dist/** linguist-generated=true
```

### Custom Merge Strategy for Lock Files

```bash
git config --global merge.npm-merge-driver.name "npm merge driver"
git config --global merge.npm-merge-driver.driver "npx npm-merge-driver merge %O %A %B %P"
```

Prevents lock file conflicts from blocking merges with conflicting `node_modules` resolutions.

---

## Complete Local Quality Gate Setup

```bash
# Install everything
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional

# Initialize
npx husky init

# Write hooks
echo "npx lint-staged" > .husky/pre-commit
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
echo "npm test" > .husky/pre-push
chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push
```

```
Commit attempt
     │
     ▼
pre-commit → lint-staged (ESLint + Prettier on staged files)
     │
     ▼
commit-msg → commitlint (validates Conventional Commits format)
     │
     ▼
[commit created]
     │
     ▼ (on push)
pre-push → npm test (full test suite)
     │
     ▼
[code pushed to remote]
     │
     ▼
GitHub Actions → CI pipeline (linting, testing, security scans)
```

---

## Common Pitfalls

| Pitfall | Cause | Fix |
|---------|-------|-----|
| Hooks not running for a colleague | `.git/hooks/` not committed | Use Husky/lefthook; add `prepare` script to `package.json` |
| lint-staged runs on all files | Wrong glob pattern | Use `{staged_files}` in lefthook or let lint-staged resolve automatically |
| GitFlow merge conflicts on release branch | Feature merged to develop while release is open | Freeze develop during release, or cherry-pick |
| Hook bypassed with `--no-verify` | Developer skips on frustration | Note in CI: the server-side checks still catch it |
| Turborepo cache not hitting | Non-deterministic build output | Ensure build is deterministic; exclude timestamps from output hashes |

---

## Review Questions

1. You maintain a library published to npm with semantic versioning. Which workflow is best suited and why?
2. A team practicing trunk-based development wants to ship a large new checkout flow over 3 weeks without breaking `main`. What technique do they use?
3. What is the difference between `pre-commit` and `commit-msg` hooks? What does each validate?
4. Why does lint-staged run only on staged files rather than the full codebase?
5. Write a `.lintstagedrc.json` entry that runs ESLint and Prettier on all staged `.ts` and `.tsx` files.
6. A developer bypasses pre-commit hooks with `git commit --no-verify`. How does your team's CI pipeline ensure quality is not compromised?

---

#Git #GitHub #DevOps
