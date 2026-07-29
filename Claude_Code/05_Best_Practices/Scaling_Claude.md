---
title: Scaling Claude Code
aliases: [Agent Teams, Parallel Agents, Git Worktrees Claude, Fleet Mode]
tags: [ClaudeCode, BestPractices, Scaling]
domain: Claude Code
difficulty: Advanced
created: 2026-07-29
related: [Subagents_Guide, Plan_Mode, Headless_Mode]
status: complete
---

# Scaling Claude Code

> [!tldr] TL;DR
> One Claude session has a fixed context window and executes serially. To scale beyond that: use **parallel sub-agents** for independent tasks, **git worktrees** for isolation (one working tree per agent so they don't conflict), and an **orchestrator + workers** pattern for coordinated large work. Scaling multiplies cost but can collapse a multi-hour task into minutes.

---

## When One Claude Session Isn't Enough

A single Claude session works well for:
- Tasks that fit in one context window (~200K tokens)
- Sequential work where each step depends on the last
- Simple file edits, quick fixes, and exploration

One session is not enough when:
- The codebase is too large to read in full (needs selective context)
- Multiple independent subtasks could run simultaneously
- Different subtasks need different "personas" (code writer, test writer, reviewer)
- You want parallelism to reduce wall-clock time
- The task would exceed the context window mid-execution

---

## Orchestrator + Worker Pattern

The most reliable scaling pattern is **one orchestrator agent** that delegates to **multiple specialized worker agents**:

```
Orchestrator (high-level Claude)
├── Worker 1: "Refactor auth module"        → works on src/auth/
├── Worker 2: "Write tests for auth"        → works on tests/auth/
├── Worker 3: "Update API docs"             → works on docs/api/
└── Worker 4: "Update CHANGELOG"            → works on CHANGELOG.md
```

The orchestrator:
1. Plans the overall work and breaks it into subtasks
2. Spawns agents with precise, self-contained instructions
3. Collects results and synthesizes a final report
4. Handles failures (retries a failed worker, adjusts approach)

Workers:
1. Receive a focused task with all necessary context
2. Execute independently with no awareness of other workers
3. Return results to the orchestrator

```mermaid
flowchart TD
    U([User: "Refactor and document auth module"]) --> O[Orchestrator Agent]
    O --> P[Plan: break into 4 subtasks]
    P --> W1[Worker 1\nRefactor auth code]
    P --> W2[Worker 2\nWrite unit tests]
    P --> W3[Worker 3\nUpdate API docs]
    P --> W4[Worker 4\nWrite changelog entry]
    W1 --> R[Orchestrator collects results]
    W2 --> R
    W3 --> R
    W4 --> R
    R --> S([Summary report to user])
```

In Claude Code, the orchestrator uses the `Agent` tool to spawn workers. Each `Agent` call is a separate Claude session with its own context.

---

## Git Worktrees for Isolation

When multiple agents need to edit files in the same repository simultaneously, they will conflict if they share the same working directory. The solution is **git worktrees**.

A git worktree is a second (or third, or fourth) checkout of the same repository, each on its own branch, all sharing the same `.git` directory:

```bash
# Create worktrees for parallel agents
git worktree add ../project-auth-refactor feature/auth-refactor
git worktree add ../project-auth-tests  feature/auth-tests
git worktree add ../project-api-docs    feature/api-docs

# Now each path is a fully independent working directory
# Agent 1 works in ../project-auth-refactor/
# Agent 2 works in ../project-auth-tests/
# Agent 3 works in ../project-api-docs/
```

Benefits of worktrees for parallel agents:
- No file conflicts (each agent has its own filesystem view)
- Each agent can run tests independently
- Changes are isolated until merged
- If an agent messes up, you discard its branch without affecting others

```bash
# After agents complete, merge their branches
git merge feature/auth-refactor
git merge feature/auth-tests
git merge feature/api-docs

# Clean up worktrees
git worktree remove ../project-auth-refactor
```

---

## Foreground vs Background Agents

When running multiple agents from an orchestrator, you choose whether to wait for each:

| Mode | Claude Code API | When to use |
|---|---|---|
| **Foreground** | `run_in_background: false` | You need the result before spawning the next agent |
| **Background** | `run_in_background: true` (default) | Independent tasks that can run concurrently |

**Sequential (foreground)** — agent 2 needs agent 1's output:
```
Agent 1: "Read all Python files and list public APIs" → foreground (wait for result)
Agent 2: "Write tests for these APIs: {result from Agent 1}" → foreground
```

**Parallel (background)** — agents are independent:
```
Agent 1: "Refactor src/auth.py" → background
Agent 2: "Write tests/test_auth.py" → background  
Agent 3: "Update docs/auth.md" → background
(All three run simultaneously; orchestrator collects results)
```

---

## Practical Example: Parallelizing a Large Refactor

**Scenario**: Migrate a Node.js codebase from CommonJS (`require()`) to ESM (`import`). 200 files, organized in 8 modules.

**Sequential approach** (1 agent): ~8 hours

**Parallel approach** (8 agents, one per module):

```
Orchestrator plan:
├── Agent 1: Migrate src/auth/ (22 files)
├── Agent 2: Migrate src/api/ (31 files)
├── Agent 3: Migrate src/db/ (18 files)
├── Agent 4: Migrate src/utils/ (27 files)
├── Agent 5: Migrate src/models/ (33 files)
├── Agent 6: Migrate src/services/ (29 files)
├── Agent 7: Migrate src/middleware/ (19 files)
└── Agent 8: Update package.json + tsconfig.json (root files)

Wall-clock time: ~1.5 hours (8x faster)
Cost: ~8x higher than single agent
```

Each agent works in its own git worktree. After all complete, the orchestrator merges branches and runs the full test suite.

---

## Fleet View: Managing Multiple Agents

When you have many agents running simultaneously, Claude Code provides a **fleet view** — an overview of all active agents, their status, and their current task.

Access the fleet view from inside a Claude Code session (in a supported terminal):
- Press `F` or use the sidebar to view running agents
- Each agent shows: task summary, elapsed time, current step, cost so far
- You can interrupt an individual agent without stopping others

In headless/CI mode, you track agents via the orchestrator's structured JSON output.

---

## Scaling Decision Table

| Situation | Recommended approach |
|---|---|
| Single focused task, any size | One session, use `/plan` for large tasks |
| Two independent tasks with different file sets | Two background agents |
| Large monorepo, multiple modules | Orchestrator + one worker per module |
| Same-repo parallel agents | Git worktrees (mandatory — avoid conflicts) |
| Agents that need sequential handoff | Foreground agents with output passing |
| Long research + long implementation | Research agent first (foreground), then impl agent |
| CI pipeline | `claude -p` headless, one job per subtask |

---

## Cost Implications

Scaling with parallel agents multiplies cost proportionally:

| Setup | Context tokens | Cost multiplier |
|---|---|---|
| 1 agent, large context | 200K tokens | 1× |
| 4 parallel agents, focused context | 4 × 50K tokens | ~0.4× (smaller contexts = cheaper) |
| 8 parallel agents, full context each | 8 × 200K tokens | 8× |

**Cost optimization tips**:
- Give each worker only the context it needs (not the entire codebase)
- Use smaller models (Haiku, Sonnet) for workers; reserve Opus for the orchestrator
- Combine with prompt caching: if all workers read the same large file, it's cached after the first read
- Reuse session context when workers share common background information

See [[Claude_Pricing]] for per-token costs by model.

---

## Common Pitfalls

> [!warning] Pitfall 1 — Parallel agents editing the same files
> Without git worktrees, two agents writing to the same file will clobber each other's changes. Always create a worktree per agent for any parallel workflow that involves file mutations. Read-only agents (research, analysis) can share a single working directory safely.

> [!warning] Pitfall 2 — Orchestrator prompt too vague for workers
> Workers have no memory of the parent conversation. Each worker prompt must be entirely self-contained: include the task, the relevant file paths, any constraints, and the desired output format. A vague "refactor the auth module" will produce inconsistent results across workers. Write worker prompts as if briefing someone who just walked into the room cold.

> [!warning] Pitfall 3 — Forgetting to clean up worktrees
> Git worktrees consume disk space and can confuse tools that scan for `.git` directories. After merging, always remove worktrees: `git worktree remove <path>` and `git worktree prune`. Abandoned worktrees also hold branch locks that can interfere with branch operations.

---

## Review Questions

> [!question] Q1 — Why are git worktrees necessary for parallel agents that edit files?
> Without worktrees, multiple agents share the same working directory. If two agents edit the same file simultaneously, they overwrite each other's changes. Git worktrees give each agent an isolated filesystem view on its own branch, so changes don't conflict until intentionally merged.

> [!question] Q2 — What is the difference between a foreground and background agent call, and when would you use each?
> Foreground (`run_in_background: false`) pauses the orchestrator until the agent completes — use when the result is needed to construct the next step. Background (default) lets agents run concurrently — use for independent tasks where you don't need to wait for one before starting another.

> [!question] Q3 — How does giving workers focused context reduce cost compared to giving each worker the full codebase?
> Token cost scales with context size. A worker given only the 50K tokens relevant to its module costs far less than one given a 200K-token full-codebase context. Parallel agents with focused contexts can collectively cost less than a single agent with maximum context.

---

## See Also

- [[Subagents_Guide]] — how the Agent tool works, spawning mechanics
- [[Plan_Mode]] — planning before large parallel executions
- [[Headless_Mode]] — running agents in CI pipelines
- [[Advanced_Patterns]] — Opusplan workflow and git worktree patterns
- [[Claude_Pricing]] — token costs and caching for multi-agent workloads
