---
title: OpenClaw Cron and Skills
aliases: [OpenClaw Cron Jobs, OpenClaw Skills, ClawHub, OpenClaw Plugins]
tags: [OpenClaw, automation]
domain: OpenClaw
difficulty: Intermediate
created: 2026-07-29
related: [OpenClaw_Hooks_and_Webhooks, OpenClaw_Memory_and_Context, OpenClaw_Security]
status: complete
---

# OpenClaw Cron and Skills

> [!abstract] TL;DR
> Cron jobs in OpenClaw schedule recurring shell or AI tasks (`cron add`, `cron list`, `cron remove`). Skills are reusable instruction packages — install from ClawHub with `openclaw skills install <name>` or create your own in `~/workspace/skills/`. Use `/plugins` to browse installed skills at runtime. Skills differ from hooks in that they are invoked on demand by the user, not automatically triggered by events.

---

## Cron Jobs

OpenClaw has a built-in cron scheduler. Unlike traditional Unix cron, OpenClaw cron jobs can run **AI prompts** (not just shell scripts), have access to workspace memory, and can post results to channels.

### Managing Cron Jobs

```bash
# List all scheduled cron jobs
openclaw cron list

# Add a cron job (interactive)
openclaw cron add

# Add directly
openclaw cron add \
  --name "morning-news" \
  --schedule "0 8 * * 1-5" \
  --prompt "Fetch the top 5 tech headlines and summarise each in one sentence. Post to Telegram." \
  --channel telegram

# Remove a job
openclaw cron remove --name morning-news

# Disable without removing
openclaw cron disable --name morning-news

# Re-enable
openclaw cron enable --name morning-news

# Run immediately (test/debug)
openclaw cron run --name morning-news
```

### Cron Syntax Reference

```
┌─────── minute  (0-59)
│ ┌───── hour    (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─ month  (1-12)
│ │ │ │ ┌ day of week (0-6, Sun=0)
│ │ │ │ │
* * * * *

Examples:
0 8 * * 1-5    → 8:00 AM on weekdays
0 9 * * 1      → 9:00 AM every Monday
*/30 * * * *   → every 30 minutes
0 0 1 * *      → midnight on the 1st of each month
0 18 * * 5     → 6:00 PM every Friday
```

### Cron Job with Shell Script

```bash
openclaw cron add \
  --name "backup-workspace" \
  --schedule "0 2 * * *" \
  --script ~/workspace/scripts/backup.sh
```

```bash
#!/bin/bash
# ~/workspace/scripts/backup.sh
TIMESTAMP=$(date +%Y%m%d)
tar -czf ~/backups/workspace-${TIMESTAMP}.tar.gz ~/workspace/
# Keep only last 7 days
find ~/backups/ -name "workspace-*.tar.gz" -mtime +7 -delete
```

### Cron vs Heartbeats

| Feature | Cron Jobs | Heartbeats |
|---------|-----------|-----------|
| Configured in | CLI (`cron add`) | `HEARTBEAT.md` |
| Format | CLI flags or YAML | Human-readable markdown |
| Can run shell scripts | Yes | No (AI prompts only) |
| Active hours support | Via config | Yes (built-in) |
| Best for | Technical scheduled tasks | Natural-language AI tasks |

Both are fine for AI prompt scheduling; cron is better when you need shell script execution.

---

## Skills

Skills are **reusable instruction packages** — a bundled prompt, optional context files, and optional scripts — that extend OpenClaw's behaviour on demand.

### Skill vs Hook

| Dimension | Skill | Hook |
|-----------|-------|------|
| Trigger | User invokes explicitly (`/skill <name>`) | Automatic on event |
| Persistence | Installed, always available | Configured in `hooks.yaml` |
| Distribution | ClawHub or local | Local only |
| Use case | On-demand tasks ("summarise this", "translate this") | Reactive automation |

---

## Installing Skills from ClawHub

ClawHub is the community skill registry at `hub.openclaw.io`.

```bash
# Browse available skills
openclaw skills search
openclaw skills search "summarise"
openclaw skills search "translate"

# Install a skill
openclaw skills install summarise-article
openclaw skills install daily-standup
openclaw skills install expense-tracker
openclaw skills install language-translate

# List installed skills
openclaw skills list

# Show a skill's prompt and configuration
openclaw skills show summarise-article

# Update all installed skills
openclaw skills update --all

# Remove a skill
openclaw skills remove expense-tracker
```

---

## Using Skills at Runtime

```bash
# In any channel conversation:
/plugins                         # list installed skills
/skill summarise-article         # invoke a skill
/skill language-translate to=es  # invoke with parameters

# Or just describe what you want if your assistant knows the skill:
"Summarise this article: [url]"   # → assistant uses summarise-article skill
```

---

## Creating a Custom Skill

Skills live in `~/workspace/skills/<skill-name>/`:

```
~/workspace/skills/
└── my-standup/
    ├── skill.yaml
    ├── prompt.md
    └── context.md        (optional extra context injected into prompt)
```

```yaml
# skill.yaml
name: my-standup
version: 1.0.0
description: Generate a daily standup update from recent memory
trigger:
  - "standup"
  - "what did I work on"
parameters:
  - name: team
    description: The team channel to post to
    default: slack
```

```markdown
# prompt.md

You are helping the user write a daily standup update.

Read their recent memory files (last 2 days) and summarise:
1. What they accomplished yesterday
2. What they plan to do today
3. Any blockers

Keep it under 5 bullet points total. Be factual; don't embellish.
Post the result to the {{team}} channel.
```

```bash
# Install the custom skill from local directory
openclaw skills install --local ~/workspace/skills/my-standup

# Test it
openclaw skills run my-standup --param team=slack
```

---

## Cron + Skills Combined

You can schedule a skill to run on a cron schedule:

```bash
openclaw cron add \
  --name "weekly-standup" \
  --schedule "0 9 * * 1" \
  --skill my-standup \
  --param team=slack
```

This runs `my-standup` every Monday at 9:00 AM and posts to Slack automatically.

---

## Cron and Skills Reference Table

| Command | Purpose |
|---------|---------|
| `cron list` | List all scheduled jobs with status |
| `cron add --name X --schedule "* * * * *" --prompt "..."` | Add an AI prompt cron job |
| `cron add --name X --schedule "* * * * *" --script path` | Add a shell script cron job |
| `cron remove --name X` | Delete a cron job |
| `cron disable/enable --name X` | Toggle without deleting |
| `cron run --name X` | Trigger immediately |
| `skills search [query]` | Browse ClawHub |
| `skills install <name>` | Install from ClawHub |
| `skills install --local <path>` | Install from local directory |
| `skills list` | List installed skills |
| `skills show <name>` | Inspect skill prompt and config |
| `skills update --all` | Update all installed skills |
| `skills remove <name>` | Uninstall a skill |
| `/plugins` | In-chat list of installed skills |
| `/skill <name> [params]` | Invoke a skill in chat |

---

## Common Pitfalls

1. **Using cron where a heartbeat is clearer** — If your scheduled task is an AI prompt (e.g., "summarise the news"), consider using `HEARTBEAT.md` instead of `cron add`. Heartbeat config is readable by non-technical collaborators and easier to modify without CLI commands. Reserve `cron add` for tasks requiring shell scripts.
2. **Installing skills from ClawHub without reviewing their prompts** — A community skill's `prompt.md` has full access to your workspace memory and channels. Always run `openclaw skills show <name>` before installing to review what the prompt does. Treat skills like npm packages — review before running.
3. **Scheduling cron jobs in UTC without converting to local time** — OpenClaw cron jobs use UTC by default. A job scheduled at `0 8 * * *` fires at 8:00 AM UTC, which may be 3:00 AM or 4:00 PM depending on your timezone. Pass `--timezone America/New_York` on `cron add` or set a global default in `config.yaml`.

---

## Review Questions

1. What is the key operational difference between a skill and a hook, and which would you use for "automatically summarise every incoming email forwarded to OpenClaw" versus "let the user ask for a standup summary on demand"?
2. You install a community skill from ClawHub and notice it posts to a channel you did not configure. What should you check, and what command shows you the skill's full prompt?
3. A cron job is running at the wrong time of day. You specified `0 9 * * 1-5`. What is the most likely cause, and how do you fix it?

---

## See Also

- [[OpenClaw_Hooks_and_Webhooks]] — Event-triggered automation; heartbeats vs cron
- [[OpenClaw_Memory_and_Context]] — Skills that read and write workspace memory
- [[OpenClaw_Security]] — Reviewing skill prompts for security risks
- [[_MOC_OpenClaw_Master]] — Full vault index
