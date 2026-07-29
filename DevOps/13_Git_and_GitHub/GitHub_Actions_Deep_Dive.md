---
title: GitHub Actions Deep Dive
aliases: [GitHub Actions, GHA, CI/CD Actions, OIDC GitHub]
tags: [Git, GitHub, DevOps, CI/CD, Actions]
domain: DevOps
difficulty: Advanced
created: 2026-07-29
related: [GitHub_Collaboration, Git_Workflows_and_Hooks, _MOC_Git_GitHub]
status: complete
---

# GitHub Actions Deep Dive

> [!abstract] TL;DR
> GitHub Actions is a built-in CI/CD platform. A workflow is a YAML file in `.github/workflows/` that contains one or more jobs made of steps. Steps either run shell commands or invoke reusable actions from the Marketplace. Matrix builds, reusable workflows, composite actions, and OIDC-based cloud auth are the advanced patterns.

---

## Actions Architecture

```
Workflow (.github/workflows/*.yml)
 └── Job (runs on a runner)
      └── Step (atomic unit)
           ├── uses: actions/checkout@v4   ← invoke a reusable action
           └── run: npm test               ← shell command
```

| Concept | Description |
|---------|-------------|
| **Workflow** | YAML file; triggered by events; contains jobs |
| **Job** | Runs on a single runner; jobs run in parallel by default |
| **Step** | Sequential unit inside a job; shares the same runner filesystem |
| **Action** | Reusable unit (Docker, JavaScript, or composite) |
| **Runner** | VM/container that executes the job; GitHub-hosted or self-hosted |

---

## Workflow YAML Syntax

```yaml
name: CI Pipeline

on:                             # triggers
  push:
    branches: [main, "release/**"]
    paths-ignore: ["docs/**"]
  pull_request:
    types: [opened, synchronize, reopened]
  schedule:
    - cron: "0 2 * * 1"        # weekly Monday 02:00 UTC
  workflow_dispatch:            # manual trigger via UI
    inputs:
      environment:
        description: "Target environment"
        required: true
        default: "staging"
        type: choice
        options: [staging, production]

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-24.04       # GitHub-hosted runner image

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Event Triggers Reference

```yaml
on:
  push:                         # commit pushed
  pull_request:                 # PR opened/updated
  pull_request_target:          # PR from fork (runs in base repo context — use with caution)
  release:
    types: [published]
  issues:
    types: [opened, labeled]
  issue_comment:
    types: [created]
  schedule:
    - cron: "*/15 * * * *"     # every 15 minutes
  workflow_dispatch:            # manual
  workflow_call:                # called by another workflow (reusable workflow)
  repository_dispatch:          # external API trigger
  workflow_run:                 # after another workflow completes
    workflows: ["CI"]
    types: [completed]
```

---

## Environment Variables and Secrets

```yaml
env:                            # workflow-level env vars
  NODE_ENV: production
  APP_PORT: "3000"

jobs:
  deploy:
    env:                        # job-level env vars (override workflow-level)
      DEPLOY_REGION: us-east-1

    steps:
      - name: Deploy
        env:                    # step-level env vars
          API_KEY: ${{ secrets.API_KEY }}           # org/repo secret
          DB_PASS: ${{ secrets.DB_PASS }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}    # built-in auto-generated token
        run: ./deploy.sh
```

### Accessing Secrets

- `secrets.GITHUB_TOKEN` — auto-created per workflow run; scoped to the repo; expires after run
- Org/repo secrets: Settings → Secrets and variables → Actions
- Environment secrets: tied to specific deployment environments (require approval)

```yaml
jobs:
  deploy:
    environment: production    # requires environment protection rules to pass
    steps:
      - run: echo ${{ secrets.PROD_DB_URL }}
```

---

## The `github` Context

Provides metadata about the event that triggered the workflow:

```yaml
steps:
  - run: |
      echo "SHA:      ${{ github.sha }}"
      echo "Ref:      ${{ github.ref }}"          # refs/heads/main
      echo "Branch:   ${{ github.ref_name }}"     # main
      echo "Actor:    ${{ github.actor }}"        # username
      echo "Event:    ${{ github.event_name }}"   # push / pull_request
      echo "Repo:     ${{ github.repository }}"  # org/repo
      echo "Run ID:   ${{ github.run_id }}"
      echo "Run No.:  ${{ github.run_number }}"
      echo "PR No.:   ${{ github.event.pull_request.number }}"
```

Key expression syntax: `${{ <context>.<property> }}`, `${{ env.MY_VAR }}`, `${{ secrets.MY_SECRET }}`, `${{ inputs.my_input }}`

---

## Matrix Strategy — Build Across Versions/OSes

```yaml
jobs:
  test:
    strategy:
      fail-fast: false          # don't cancel other jobs on first failure
      matrix:
        os: [ubuntu-24.04, windows-latest, macos-14]
        node: ["18", "20", "22"]
        include:                # add extra variables to specific combos
          - os: ubuntu-24.04
            node: "20"
            experimental: true
        exclude:                # skip specific combinations
          - os: windows-latest
            node: "18"

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

Matrix generates a job for each combination: 3 × 3 = 9 jobs, minus excluded = 8 jobs.

---

## Caching

```yaml
steps:
  - name: Cache node_modules
    uses: actions/cache@v4
    id: cache-npm
    with:
      path: ~/.npm
      key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-npm-

  - name: Install (skip if cache hit)
    if: steps.cache-npm.outputs.cache-hit != 'true'
    run: npm ci
```

Cache keys: if exact key exists, restore it (cache hit). If not, try `restore-keys` prefixes. On success, the `Post` step saves the new cache.

---

## Artifacts — Sharing Data Between Jobs

```yaml
jobs:
  build:
    steps:
      - run: npm run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
          retention-days: 7

  deploy:
    needs: build               # wait for build job
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: ./deploy.sh dist/
```

---

## Reusable Workflows (`workflow_call`)

Extract common CI logic into a called workflow:

```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      NPM_TOKEN:
        required: true

jobs:
  test:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      - run: npm test
```

```yaml
# Calling workflow
jobs:
  run-tests:
    uses: org/repo/.github/workflows/reusable-test.yml@main
    with:
      node-version: "20"
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Composite Actions

Create a reusable action from a series of steps in any repo:

```yaml
# .github/actions/setup-project/action.yml
name: "Setup Project"
description: "Install dependencies and configure environment"
inputs:
  node-version:
    description: "Node.js version"
    required: false
    default: "20"
outputs:
  cache-hit:
    description: "Whether npm cache was hit"
    value: ${{ steps.cache.outputs.cache-hit }}

runs:
  using: "composite"
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    - id: cache
      uses: actions/cache@v4
      with:
        path: node_modules
        key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
    - run: npm ci
      shell: bash
```

```yaml
# Using the composite action
steps:
  - uses: ./.github/actions/setup-project
    with:
      node-version: "22"
```

---

## OIDC for Cloud Auth (No Long-Lived Credentials)

Instead of storing AWS/GCP/Azure credentials as secrets, GitHub Actions can exchange an OIDC token for a short-lived cloud role. Zero secrets stored.

```yaml
permissions:
  id-token: write              # required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-24.04
    steps:
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-deploy
          aws-region: us-east-1
          # No access-key-id or secret-access-key — OIDC only

      - run: aws s3 sync dist/ s3://my-bucket/
```

**AWS IAM trust policy** (allows GitHub's OIDC IdP to assume this role):

```json
{
  "Principal": {
    "Federated": "arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com"
  },
  "Condition": {
    "StringLike": {
      "token.actions.githubusercontent.com:sub": "repo:org/repo:ref:refs/heads/main"
    }
  }
}
```

---

## Self-Hosted Runners

For private network access, faster hardware, or custom tooling:

```yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64, gpu]  # labels match runner config
```

Runner registration:

```bash
# On your machine/VM:
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.x.x.tar.gz -L https://github.com/actions/runner/releases/download/v2.x.x/...
tar xzf actions-runner-linux-x64-2.x.x.tar.gz
./config.sh --url https://github.com/org/repo --token <TOKEN>
./run.sh          # or install as systemd service: sudo ./svc.sh install
```

> [!warning] Security
> Never use self-hosted runners on public repos — a malicious PR could execute arbitrary code on your runner. Use GitHub-hosted runners or isolated ephemeral VMs for untrusted code.

---

## Common Pitfalls

| Pitfall | Cause | Fix |
|---------|-------|-----|
| Secrets exposed in logs | `echo ${{ secrets.X }}` | Secrets are masked by default, but avoid echoing them |
| Cache poisoning | Using mutable cache keys | Include lockfile hash: `${{ hashFiles('**/package-lock.json') }}` |
| OIDC permission missing | No `id-token: write` | Add `permissions.id-token: write` to the job |
| `pull_request_target` code execution | Untrusted fork code runs with write access | Use `pull_request` (not `pull_request_target`) for code-building steps |
| Matrix job count explosion | Too many dimensions | Use `exclude` to prune; consider 2D matrix max |
| Stale cache serving broken state | Hash matches old broken state | Use a `cache-busting` prefix in the key |

---

## Review Questions

1. What is the difference between a `step` using `uses:` and a step using `run:`?
2. Write a matrix job that tests on Node 18 and 20, on both Ubuntu and macOS, but skips Node 18 on macOS.
3. Explain how OIDC eliminates the need for long-lived AWS credentials in GitHub Actions.
4. What is the difference between a reusable workflow and a composite action?
5. How does `actions/cache` determine whether to restore from cache vs create a new cache entry?
6. What security risk does `pull_request_target` introduce, and how do you mitigate it?

---

#Git #GitHub #DevOps
