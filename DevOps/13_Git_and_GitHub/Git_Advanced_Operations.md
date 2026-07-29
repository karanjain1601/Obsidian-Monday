---
title: Git Advanced Operations
aliases: [Git Stash, Git Reset, Git Reflog, Git Bisect, Git Worktree]
tags: [Git, GitHub, DevOps, Advanced]
domain: DevOps
difficulty: Advanced
created: 2026-07-29
related: [Git_Fundamentals, Git_Branching_and_Merging, _MOC_Git_GitHub]
status: complete
---

# Git Advanced Operations

> [!abstract] TL;DR
> Git's power tools: `stash` shelves uncommitted work; `reset` rewrites branch history with three safety levels; `revert` creates an undo commit safe for public branches; `reflog` gives a 30-day recovery net for any lost commit; `bisect` finds the breaking commit via binary search; `worktree` lets you check out multiple branches simultaneously.

---

## `git stash` — Shelving Uncommitted Work

Stash captures the working tree and index into a stack of `WIP` commits attached to `refs/stash`. The working tree returns to HEAD state.

```bash
git stash                      # stash tracked modifications + staged changes
git stash -u                   # include untracked files
git stash -a                   # include untracked + ignored files
git stash push -m "WIP: half-done auth" -- src/auth.py  # stash specific file

git stash list                 # stash@{0}: WIP on main: abc123 feat: login
git stash show stash@{1}       # summary of what was stashed
git stash show -p stash@{0}    # full diff

git stash pop                  # apply stash@{0} and remove from stack
git stash apply stash@{2}      # apply without removing
git stash drop stash@{1}       # delete one entry
git stash clear                # delete all entries
git stash branch feature/resume-work  # create branch from stash
```

> [!tip]
> `stash pop` can cause conflicts. If it does, resolve them then `git stash drop` manually — `pop` does not remove the entry on conflict.

---

## `git reset` — Rewriting Branch History

`git reset` moves the current branch's HEAD pointer and optionally modifies the index and working tree.

```
git reset [--soft | --mixed | --hard] <commit>
```

| Mode | HEAD moves | Index updated | Working tree updated | Data lost? |
|------|-----------|---------------|---------------------|------------|
| `--soft` | Yes | No | No | No |
| `--mixed` (default) | Yes | Yes | No | No |
| `--hard` | Yes | Yes | Yes | **Yes — DANGER** |

```bash
git reset --soft HEAD~1        # undo last commit; staged changes remain
git reset HEAD~1               # undo last commit; changes unstaged
git reset --hard HEAD~1        # undo last commit; discard ALL local changes
git reset --hard origin/main   # discard all local work to match remote
```

### Unstaging a File (Reset Without Moving HEAD)

```bash
git reset HEAD <file>          # unstage file (mixed reset on the index only)
git restore --staged <file>    # modern equivalent (Git 2.23+)
```

> [!danger] `--hard` is permanent (from the working tree's perspective)
> Committed data is recoverable via `reflog`. Uncommitted data in the working tree after `--hard` is **irrecoverable**.

---

## `git revert` — Safe Public Undo

`revert` creates a **new commit** that undoes the changes of a previous commit. The history is not rewritten; it is extended. Safe to use on public/shared branches.

```bash
git revert HEAD                # create undo commit for the last commit
git revert abc123              # revert a specific commit
git revert abc123 def456       # revert multiple (one commit each)
git revert HEAD~3..HEAD        # revert a range (three commits)
git revert -n abc123           # stage revert without auto-committing (--no-commit)
git revert --abort             # cancel an in-progress revert with conflicts
```

### reset vs revert

| Scenario | Use |
|----------|-----|
| Local commit not yet pushed | `reset` (rewrite) |
| Commit already on shared branch | `revert` (safe extension) |
| Roll back a specific change mid-history | `revert` |

---

## `git reflog` — 30-Day Safety Net

The reflog records every time HEAD moves — commits, merges, rebases, resets, checkouts. Entries expire after 90 days (HEAD) / 30 days (other refs) by default.

```bash
git reflog                     # full reflog (most recent first)
git reflog show main           # reflog for a specific branch
git reflog --date=iso          # show human-readable timestamps

# Example output:
# abc123 HEAD@{0}: commit: feat: add payment
# def456 HEAD@{1}: rebase: pick
# 789abc HEAD@{2}: reset: moving to HEAD~2
```

### Recovering Lost Commits

```bash
# After an accidental git reset --hard or dropped stash:
git reflog                     # find the SHA you need
git checkout <lost-sha>        # inspect it
git branch recovery <lost-sha> # save it as a branch
# or
git cherry-pick <lost-sha>     # bring commit to current branch
```

> [!tip]
> `git fsck --lost-found` finds dangling objects not reachable from any ref — another recovery path.

---

## `git bisect` — Binary Search for Bugs

Bisect automates finding the commit that introduced a regression. Git checks out commits at the midpoint of the remaining suspect range; you mark each as good or bad until the culprit is isolated.

**Complexity:** `⌈log₂ n⌉` steps for n commits.

```bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good v2.0.0         # last known good tag/SHA

# Git checks out midpoint — test manually, then:
git bisect bad                 # this commit still has the bug
git bisect good                # this commit is fine

# Git narrows the range and checks out next midpoint — repeat
# When done:
# "abc123 is the first bad commit"

git bisect reset               # return to original branch
```

### Automated Bisect

```bash
git bisect start
git bisect bad HEAD
git bisect good v3.1.0
git bisect run ./test.sh       # must exit 0=good, 1=bad, 125=skip
```

---

## `git blame` — Line-Level Authorship

```bash
git blame src/auth.py          # annotate each line with last-modifying commit
git blame -L 10,25 src/auth.py # only lines 10–25
git blame -w src/auth.py       # ignore whitespace changes
git blame --follow src/auth.py # follow renames

# Output columns: SHA | author | date | line | content
```

---

## Advanced `git log` Options

```bash
git log --oneline --graph --all --decorate    # DAG view of all branches
git log --stat                                # show file change stats
git log -S "SecretKey"                        # pickaxe: commits that added/removed string
git log -G "regex"                            # commits where diff matches regex
git log --diff-filter=D -- path/             # only commits that deleted files
git log --no-merges                           # exclude merge commits
git log main..feature                         # commits in feature not in main
git log main...feature                        # commits in either, not both (symmetric diff)
```

---

## `git worktree` — Multiple Branches Simultaneously

Worktrees let you check out a different branch in a separate directory without switching or stashing. All worktrees share the same `.git/` object store.

```bash
git worktree add ../hotfix-branch hotfix/1.4.2   # check out branch in sibling dir
git worktree add -b new-feature ../new-feature main  # create new branch + worktree
git worktree list              # list all worktrees
git worktree remove ../hotfix-branch              # remove when done
git worktree prune             # remove stale worktree references
```

Use case: fix a production hotfix while keeping your in-progress feature branch untouched.

---

## `git submodule` and `git subtree`

### Submodules — Repository Inside a Repository

```bash
git submodule add https://github.com/org/lib.git libs/mylib
git submodule update --init --recursive    # clone after fresh repo checkout
git submodule update --remote              # pull latest from upstream
git submodule foreach git pull origin main # update all submodules
```

Submodules record a specific commit SHA; they do not auto-update. The parent repo stores `.gitmodules` and a "gitlink" (special tree entry with mode `160000`).

### Subtree — Merging a Repository as a Subdirectory

```bash
git subtree add --prefix=libs/mylib https://github.com/org/lib.git main --squash
git subtree pull --prefix=libs/mylib https://github.com/org/lib.git main --squash
git subtree push --prefix=libs/mylib https://github.com/org/lib.git main
```

Subtree embeds the external repo's history. No special submodule init needed; `git clone` works transparently.

| | Submodule | Subtree |
|-|-----------|---------|
| External repo isolated | Yes | No (merged history) |
| Clone works out of box | No (`--recursive`) | Yes |
| Contributor experience | Complex | Simple |
| Upstream contributions | Easy (it's a real checkout) | Via `subtree push` |

---

## Partial Staging with `git add -p`

Interactive patch mode lets you stage individual hunks within a file:

```bash
git add -p                     # prompt for each hunk in every modified file
git add -p src/auth.py         # limit to one file
```

Hunk commands:

| Key | Action |
|-----|--------|
| `y` | stage this hunk |
| `n` | skip this hunk |
| `s` | split into smaller hunks |
| `e` | manually edit the hunk diff |
| `q` | quit (stop processing) |
| `?` | help |

Useful for separating a refactor from a bug fix in the same file, so you can commit them as two clean commits.

---

## Common Pitfalls

| Pitfall | Cause | Fix |
|---------|-------|-----|
| Lost work after `--hard` reset | Working tree not committed or stashed | Check reflog immediately; use `git fsck --lost-found` |
| Bisect left in detached HEAD | Forgot `git bisect reset` | `git bisect reset` always; add to shell alias |
| Submodule out of sync | Others updated parent without `--recursive` | `git submodule update --init --recursive` after every pull |
| Stash conflicts on `pop` | Diverged working tree | Resolve conflicts, then manually `git stash drop` |
| `git reset --hard` on wrong branch | No branch awareness | Always `git status` before destructive operations |

---

## Review Questions

1. What is the difference between `git stash pop` and `git stash apply`?
2. Describe the three modes of `git reset` and the exact state of the index and working tree after each.
3. You accidentally ran `git reset --hard HEAD~3` and lost 3 commits. What is the recovery sequence?
4. Why is `git revert` preferred over `git reset` for undoing commits on `main` in a team environment?
5. A test suite started failing somewhere in the last 200 commits. How many `git bisect` steps are needed, and write the bisect sequence.
6. When would you choose `git worktree` over `git stash`?

---

#Git #GitHub #DevOps
