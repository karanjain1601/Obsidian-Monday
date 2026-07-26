---
title: Git & Version Control — Section MOC
aliases: [Git MOC]
tags: [DevOps, Git, MOC]
domain: DevOps
created: 2026-07-26
status: complete
---

# 🌿 Git & Version Control — Section MOC

> [!abstract] Section Overview
> Git is a content-addressable distributed version control system built on a Merkle DAG of immutable objects. Mastering Git internals unlocks confident use of rebase, cherry-pick, bisect, and monorepo tooling at scale.

---

## Concept Map

```mermaid
graph TD
    MOC["🌿 Git & Version Control"]:::moc

    INT["Git Internals\n(Merkle DAG, objects, packfiles)"]:::note
    BR["Branching Strategies\n(GitFlow, GitHub Flow, trunk-based)"]:::note
    RB["Rebasing & History\n(rebase, cherry-pick, bisect)"]:::note
    HK["Git Hooks & Automation\n(Husky, commitlint, pre-commit)"]:::note
    MR["Monorepo Tools\n(Nx, Turborepo, Bazel, sparse-checkout)"]:::note

    MOC --> INT & BR & RB & HK & MR

    INT -->|"branch=41-byte ref"| BR
    INT -->|"SHA-1 hashes change"| RB
    HK -->|"enforce conventions"| BR
    MR -->|"affected subset"| HK
    BR -->|"PR triggers"| HK

    classDef moc fill:#1a1a2e,stroke:#e94560,color:#fff
    classDef note fill:#16213e,stroke:#0f3460,color:#a8d8ea
```

---

## Notes in This Section

| Note | Key Concepts | Difficulty |
|------|-------------|------------|
| [[Git_Internals\|Git Internals]] | blob/tree/commit/tag objects, SHA-1, packfiles, reflog | Intermediate |
| [[Branching_Strategies\|Branching Strategies]] | GitFlow, GitHub Flow, trunk-based, conflict probability | Intermediate |
| [[Rebasing_and_History\|Rebasing & History]] | rebase vs merge, interactive rebase, bisect, --force-with-lease | Intermediate |
| [[Git_Hooks_and_Automation\|Git Hooks & Automation]] | client/server hooks, Husky, commitlint, Conventional Commits | Beginner |
| [[Monorepo_Tools\|Monorepo Tools]] | Nx, Turborepo, Bazel, sparse-checkout, CODEOWNERS | Advanced |

---

## Learning Path

```
Git Internals → Branching Strategies → Rebasing & History
→ Git Hooks & Automation → Monorepo Tools
```

---

## Key Questions

1. How does Git's content-addressable store guarantee data integrity?
2. Why does rebasing change commit SHAs, and when is that dangerous?
3. How does trunk-based development reduce integration conflict probability?
4. What is the performance difference between Nx computation cache and full rebuilds?
5. When should you use `--force-with-lease` instead of `--force`?

---

## Related Sections

- [[_MOC_DevOps_Master|↑ DevOps Master MOC]]
- [[../02_CICD_Pipelines/_MOC_CICD_Pipelines|→ CI/CD Pipelines]] — hooks trigger pipelines
- [[../05_Infrastructure_as_Code/_MOC_Infrastructure_as_Code|→ IaC]] — GitOps pattern origins

---

#DevOps #Git #MOC
