---
title: Git Fundamentals
aliases: [Git Basics, Git Objects, Git Internals Primer]
tags: [Git, GitHub, DevOps, Fundamentals]
domain: DevOps
difficulty: Beginner
created: 2026-07-29
related: [Git_Branching_and_Merging, Git_Advanced_Operations, _MOC_Git_GitHub]
status: complete
---

# Git Fundamentals

> [!abstract] TL;DR
> Git is a distributed version control system built on a content-addressed object store. Every piece of data is identified by the SHA-1 hash of its content; four object types (blob, tree, commit, tag) form a Merkle DAG. Understanding the `.git/` directory, the index, and HEAD gives you a mental model for every Git command.

---

## The Git Object Model

Git stores everything in an immutable object database under `.git/objects/`. There are exactly four object types:

| Object | Contains | Identified By |
|--------|----------|---------------|
| **blob** | File contents (no filename) | SHA-1 of content |
| **tree** | Directory listing (mode + filename + blob/tree SHA) | SHA-1 of listing |
| **commit** | tree SHA, parent SHA(s), author, committer, message | SHA-1 of all fields |
| **tag** | Object SHA, type, tagger, message | SHA-1 of tag data |

```
commit abc123
├── tree def456
│   ├── blob aaa111  (README.md)
│   ├── blob bbb222  (main.py)
│   └── tree ccc333  (src/)
│       └── blob ddd444  (src/app.py)
└── parent xyz789
```

### SHA-1 Content Addressing

Every object is stored at `.git/objects/<first-2-chars>/<remaining-38-chars>`. Because the SHA is derived from content, identical files share one blob. This is structural deduplication.

```bash
# Inspect any object
git cat-file -t abc123     # type: commit / blob / tree / tag
git cat-file -p abc123     # pretty-print contents
git cat-file blob HEAD:README.md
```

---

## The Three-Area Architecture

```
Working Tree  ──git add──▶  Index (Staging)  ──git commit──▶  Repository (.git/)
     ◀──git checkout──             ◀──git reset HEAD──
```

| Area | Location | Purpose |
|------|----------|---------|
| **Working Tree** | project folder | files you edit |
| **Index / Staging Area** | `.git/index` | snapshot prepared for next commit |
| **Repository** | `.git/objects/` | permanent history |

The index is a binary file listing every tracked file with its blob SHA, mode, and stat info. `git add` writes blobs into the object store and updates the index. `git commit` materialises a tree from the index and wraps it in a commit object.

---

## The `.git/` Directory Anatomy

```
.git/
├── HEAD           ← current branch ref (or bare SHA in detached HEAD)
├── config         ← repo-local config
├── index          ← staging area (binary)
├── COMMIT_EDITMSG ← last commit message
├── objects/       ← content-addressed store
│   ├── pack/      ← packfiles (.pack + .idx)
│   └── info/
├── refs/
│   ├── heads/     ← local branches (one file per branch = SHA)
│   ├── remotes/   ← remote-tracking refs
│   └── tags/      ← tags
├── logs/          ← reflog data
└── hooks/         ← hook scripts
```

---

## Refs, Branches, and HEAD

**A branch is just a file** in `.git/refs/heads/` containing a 40-character SHA. Moving a branch forward just overwrites that file.

```bash
cat .git/refs/heads/main       # → abc123...
cat .git/HEAD                  # → ref: refs/heads/main
```

**HEAD** is a symbolic ref pointing to the current branch. When HEAD points directly to a commit SHA (not via a branch), you are in **detached HEAD** state — any commits you make are not reachable from a branch and will be garbage-collected unless you create a branch.

```bash
git checkout abc123            # detached HEAD
git checkout -b rescue-branch  # save work in detached HEAD
```

---

## Packfiles and Delta Compression

Loose objects are eventually packed by `git gc` (or automatic packing) into `.pack` files with a companion `.idx` index. Packfiles apply delta compression: similar objects are stored as a base object plus a diff, dramatically reducing repository size for large histories.

```bash
git count-objects -vH          # loose objects vs packed
git gc --aggressive            # manual pack and repack
```

---

## Core Commands

### Initialisation & Cloning

```bash
git init                       # create .git/ in current directory
git init --bare repo.git       # server-side bare repo (no working tree)
git clone <url>                # full clone
git clone --depth 1 <url>      # shallow clone (1 commit)
git clone --filter=blob:none   # blobless clone (partial clone)
```

### Working Tree & Staging

```bash
git status                     # working tree vs index vs HEAD
git status -s                  # short format (M=modified, A=added, ?=untracked)
git add <file>                 # stage specific file
git add -p                     # interactive patch staging (hunk by hunk)
git add -u                     # stage all tracked modifications/deletions
git rm --cached <file>         # unstage file (keep in working tree)
git diff                       # working tree vs index
git diff --staged              # index vs HEAD
git diff HEAD~2                # working tree vs 2 commits ago
```

### Committing

```bash
git commit -m "feat: add login endpoint"
git commit -a -m "fix: typo"   # stage all tracked + commit
git commit --amend             # rewrite last commit (rebase alternative for WIP)
```

### Viewing History

```bash
git log --oneline --graph --all --decorate
git log -p                     # diff with each commit
git log --stat                 # changed files summary
git log --author="Alice" --since="2 weeks ago"
git log --follow -- path/to/file   # follow renames
git show abc123                # full commit detail
```

---

## Commit Anatomy

Every commit object contains these fields:

```
tree   <tree-sha>
parent <parent-sha>          ← absent for root commit; two entries for merge commits
author Alice <a@x.com> 1700000000 +0530
committer Bob <b@x.com> 1700000010 +0000

feat(auth): add JWT refresh token rotation

Closes #42
Breaking-change: removes /api/v1/login endpoint
```

**Author** = person who wrote the patch. **Committer** = person who applied it (differs in patch-email workflows or rebases). Both timestamps are Unix epoch + timezone.

---

## Semantic Commit Messages — Conventional Commits

Format: `<type>(<scope>): <description>`

| Type | When to Use |
|------|-------------|
| `feat` | new feature visible to users |
| `fix` | bug fix |
| `docs` | documentation changes only |
| `style` | formatting, no logic change |
| `refactor` | code restructure without new feature or fix |
| `test` | adding or fixing tests |
| `chore` | build scripts, CI config, dependencies |
| `perf` | performance improvements |
| `ci` | CI pipeline changes |
| `revert` | reverting a prior commit |

Footer keywords: `BREAKING CHANGE: <desc>`, `Closes #<n>`, `Co-authored-by: Name <email>`

```
feat(api)!: rename /users to /accounts

BREAKING CHANGE: all existing /users/* routes now return 301.
Closes #198
```

---

## `.gitignore` Patterns

```gitignore
# ignore all .log files
*.log

# ignore node_modules at any depth
**/node_modules/

# ignore build/ at repo root only
/build/

# but track this specific file
!important.log

# ignore by extension in a subdirectory
docs/**/*.tmp
```

---

## Common Pitfalls

| Pitfall | Cause | Fix |
|---------|-------|-----|
| Committed secrets | No pre-commit hook | `git filter-repo`, rotate secrets immediately |
| Huge files bloating repo | Binary assets committed | Use Git LFS or exclude via `.gitignore` |
| Detached HEAD confusion | `git checkout <sha>` or `git checkout <tag>` | Always create a branch to save work |
| Wrong author/email | Global config not set | `git config user.email` per repo or globally |
| Staged wrong file | `git add .` blindly | Use `git add -p` or `git status` before committing |

---

## Review Questions

1. What is the difference between a blob and a tree object in Git's object store?
2. Why does `git add` need to run before `git commit` rather than commit using the working tree directly?
3. What exactly is stored in `.git/HEAD` and how does it change when you enter detached HEAD state?
4. A colleague says "renaming a branch is fast because Git just moves a pointer." Explain why this is true at the internals level.
5. Why do packfiles use delta compression instead of storing each version of a file independently?
6. Write a Conventional Commits message for: adding a breaking change to an authentication API that removes support for HTTP Basic Auth.

---

#Git #GitHub #DevOps
