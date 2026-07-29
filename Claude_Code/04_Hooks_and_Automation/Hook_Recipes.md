---
title: Hook Recipes
aliases: [Claude Hook Examples, Practical Hooks, Hook Patterns]
tags: [ClaudeCode, Hooks, Automation]
domain: Claude Code
difficulty: Advanced
created: 2026-07-29
related: [Hook_Configuration, Hooks_Overview, Headless_Mode]
status: complete
---

# Hook Recipes

> [!tldr] TL;DR
> Six production-ready hook scripts: auto-commit after file writes, run linter on save, block dangerous shell commands, audit-log all tool calls, send desktop notifications at session end, and inject git context into every prompt. Each script is drop-in ready — save to `.claude/hooks/`, make executable, register in `settings.json`.

---

## Setup Reminder

All recipes assume:
1. Scripts saved to `.claude/hooks/` in your project root
2. Shell scripts marked executable: `chmod +x .claude/hooks/*.sh`
3. Registered in `.claude/settings.json` under the appropriate event key

See [[Hook_Configuration]] for the full `settings.json` format.

---

## Recipe 1 — Auto-Commit After File Write (PostToolUse)

**When to use**: Projects where you want every Claude-authored change committed immediately for easy `git bisect` / rollback. Pairs well with feature branches.

```bash
#!/bin/bash
# .claude/hooks/auto_commit.sh
# PostToolUse hook: commit after any Write or Edit tool call

TOOL=$(printenv CLAUDE_TOOL_NAME)

# Only trigger on file-mutation tools
if [[ "$TOOL" != "Write" && "$TOOL" != "Edit" ]]; then
  exit 0
fi

# Read the event JSON to get the file path
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.loads(sys.stdin.read())
inp = d.get('tool_input', {})
print(inp.get('file_path', inp.get('path', '')))
" 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

cd "$CLAUDE_WORKING_DIR" || exit 0

# Stage only the modified file (never git add -A — could catch secrets)
git add "$FILE_PATH" 2>/dev/null

# Only commit if there's something staged
if git diff --cached --quiet; then
  exit 0
fi

TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
git commit -m "claude: auto-commit $FILE_PATH @ $TIMESTAMP" --no-verify 2>/dev/null

echo "Auto-committed $FILE_PATH" >&2
exit 0
```

**Register in settings.json**:
```json
{ "hooks": { "PostToolUse": ".claude/hooks/auto_commit.sh" } }
```

---

## Recipe 2 — Run Linter on File Save (PostToolUse)

**When to use**: Enforce code style automatically. Works with `black` (Python), `prettier` (JS/TS), `gofmt`, or any formatter.

```python
#!/usr/bin/env python3
# .claude/hooks/format_on_save.py
# PostToolUse hook: run formatter after Write/Edit

import sys, json, os, subprocess

event = json.load(sys.stdin)
tool  = event.get("tool_name", "")

if tool not in ("Write", "Edit"):
    sys.exit(0)

file_path = event.get("tool_input", {}).get("file_path", "")
if not file_path:
    sys.exit(0)

# Make absolute if needed
if not os.path.isabs(file_path):
    file_path = os.path.join(os.environ.get("CLAUDE_WORKING_DIR", "."), file_path)

if not os.path.exists(file_path):
    sys.exit(0)

ext = os.path.splitext(file_path)[1]

FORMATTERS = {
    ".py":  ["black", "--quiet", file_path],
    ".ts":  ["npx", "prettier", "--write", file_path],
    ".tsx": ["npx", "prettier", "--write", file_path],
    ".js":  ["npx", "prettier", "--write", file_path],
    ".go":  ["gofmt", "-w", file_path],
}

cmd = FORMATTERS.get(ext)
if cmd:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"Formatted {file_path}", file=sys.stderr)
    else:
        print(f"Formatter warning: {result.stderr}", file=sys.stderr)

sys.exit(0)
```

**Register**:
```json
{ "hooks": { "PostToolUse": "python3 .claude/hooks/format_on_save.py" } }
```

---

## Recipe 3 — Block Dangerous Commands (PreToolUse)

**When to use**: Any project where you want a hard safety net. Blocks destructive shell commands and dangerous SQL regardless of what Claude decides to do.

```python
#!/usr/bin/env python3
# .claude/hooks/security_guard.py
# PreToolUse hook: block dangerous commands

import sys, json, re

event    = json.load(sys.stdin)
tool     = event.get("tool_name", "")
tool_inp = event.get("tool_input", {})

# ── Bash command checks ──────────────────────────────────────────────────
if tool == "Bash":
    cmd = tool_inp.get("command", "")

    BLOCKED_PATTERNS = [
        (r"rm\s+-rf\s+/",            "rm -rf / is forbidden"),
        (r"rm\s+-rf\s+~",            "rm -rf ~ would delete your home directory"),
        (r"curl\s+.*\|\s*(ba)?sh",   "Piping curl to shell is a supply-chain risk"),
        (r"wget\s+.*\|\s*(ba)?sh",   "Piping wget to shell is a supply-chain risk"),
        (r">\s*/etc/passwd",         "Overwriting /etc/passwd is forbidden"),
        (r"chmod\s+777\s+/",         "chmod 777 on / is forbidden"),
        (r"sudo\s+rm\s+-rf",         "sudo rm -rf is forbidden"),
        (r":\(\)\{.*\};:",           "Fork bomb detected"),
    ]

    for pattern, reason in BLOCKED_PATTERNS:
        if re.search(pattern, cmd, re.IGNORECASE):
            print(f"SECURITY BLOCK: {reason}", file=sys.stderr)
            print(f"Blocked command was: {cmd[:200]}", file=sys.stderr)
            sys.exit(1)

# ── Edit/Write path checks ───────────────────────────────────────────────
if tool in ("Edit", "Write"):
    path = tool_inp.get("file_path", tool_inp.get("path", ""))

    PROTECTED_PATHS = ["/etc/", "/usr/", "/bin/", "/sbin/", "/boot/"]
    for protected in PROTECTED_PATHS:
        if path.startswith(protected):
            print(f"SECURITY BLOCK: Cannot write to system path {path}", file=sys.stderr)
            sys.exit(1)

    SENSITIVE_FILES = [".env", ".env.local", ".aws/credentials", "id_rsa", "id_ed25519"]
    if any(path.endswith(s) for s in SENSITIVE_FILES):
        print(f"SECURITY BLOCK: Writing to sensitive file {path} requires manual confirmation.", file=sys.stderr)
        sys.exit(1)

sys.exit(0)
```

**Register**:
```json
{ "hooks": { "PreToolUse": "python3 .claude/hooks/security_guard.py" } }
```

---

## Recipe 4 — Audit Log All Tool Calls (PostToolUse)

**When to use**: Any project with compliance requirements, or when you want a permanent record of everything Claude did in a session.

```python
#!/usr/bin/env python3
# .claude/hooks/audit_log.py
# PostToolUse hook: append structured log entry for every tool call

import sys, json, os
from datetime import datetime, timezone

event = json.load(sys.stdin)

log_dir  = os.path.join(os.environ.get("CLAUDE_WORKING_DIR", "."), ".claude", "logs")
os.makedirs(log_dir, exist_ok=True)

today    = datetime.now(timezone.utc).strftime("%Y-%m-%d")
log_file = os.path.join(log_dir, f"audit_{today}.jsonl")

log_entry = {
    "ts":         datetime.now(timezone.utc).isoformat(),
    "session":    os.environ.get("CLAUDE_SESSION_ID", "unknown"),
    "event":      event.get("event"),
    "tool":       event.get("tool_name"),
    "input_keys": list(event.get("tool_input", {}).keys()),
    # Log tool input summary (truncated) — avoid logging full file contents
    "summary":    str(event.get("tool_input", {}))[:300],
}

with open(log_file, "a") as f:
    f.write(json.dumps(log_entry) + "\n")

sys.exit(0)
```

**Log output** (one line per tool call):
```json
{"ts": "2026-07-29T14:31:05Z", "session": "ses_abc123", "event": "PostToolUse", "tool": "Bash", "input_keys": ["command", "description"], "summary": "{'command': 'pytest tests/', 'description': 'Run test suite'}"}
```

**Register**:
```json
{ "hooks": { "PostToolUse": "python3 .claude/hooks/audit_log.py" } }
```

---

## Recipe 5 — Desktop Notification on Session End

**When to use**: Long-running tasks where you step away. Get pinged when Claude finishes.

### macOS (osascript)
```bash
#!/bin/bash
# .claude/hooks/notify_mac.sh
# Stop hook: send macOS notification when Claude finishes responding

osascript -e 'display notification "Claude Code has finished its response." with title "Claude Code" sound name "Glass"'
exit 0
```

### Windows (PowerShell toast notification)
```bash
#!/bin/bash
# .claude/hooks/notify_win.sh
# Stop hook: Windows toast notification via PowerShell

powershell.exe -Command "
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
\$xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent('ToastText01')
\$xml.GetElementsByTagName('text')[0].InnerText = 'Claude Code finished its response.'
\$toast = [Windows.UI.Notifications.ToastNotification]::new(\$xml)
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Claude Code').Show(\$toast)
" 2>/dev/null
exit 0
```

### Cross-platform (via `notify-send` on Linux, fallback)
```bash
#!/bin/bash
# .claude/hooks/notify.sh

if command -v osascript &>/dev/null; then
  osascript -e 'display notification "Claude Code finished." with title "Claude Code"'
elif command -v notify-send &>/dev/null; then
  notify-send "Claude Code" "Claude finished its response."
else
  # Windows PowerShell fallback
  powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Claude finished.','Claude Code')" 2>/dev/null
fi
exit 0
```

**Register** (fires after each response, not just session end):
```json
{ "hooks": { "Stop": ".claude/hooks/notify.sh" } }
```

---

## Recipe 6 — Inject Git Context into Every Prompt (UserPromptSubmit)

**When to use**: When you want Claude to always be aware of the current branch, dirty files, and recent commits without having to mention it.

```python
#!/usr/bin/env python3
# .claude/hooks/inject_git_context.py
# UserPromptSubmit hook: prepend git context to stdout (Claude sees it)

import sys, json, subprocess, os

event = json.load(sys.stdin)

cwd = os.environ.get("CLAUDE_WORKING_DIR", ".")

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd, timeout=3)
    return r.stdout.strip() if r.returncode == 0 else ""

branch  = run(["git", "rev-parse", "--abbrev-ref", "HEAD"])
status  = run(["git", "status", "--short"])
recent  = run(["git", "log", "--oneline", "-5"])

if not branch:
    sys.exit(0)   # Not a git repo, skip

context_lines = [f"[git context] branch={branch}"]
if status:
    context_lines.append(f"[git context] dirty files:\n{status}")
if recent:
    context_lines.append(f"[git context] recent commits:\n{recent}")

# Print to stdout → Claude sees this before processing the user's message
print("\n".join(context_lines))

sys.exit(0)
```

**Register**:
```json
{ "hooks": { "UserPromptSubmit": "python3 .claude/hooks/inject_git_context.py" } }
```

---

## Combining Multiple Hooks

You can only register one command per event. To run multiple scripts for the same event, use a dispatcher:

```bash
#!/bin/bash
# .claude/hooks/pre_tool_use_dispatcher.sh
# Runs all pre-tool-use hooks in sequence; blocks if any returns non-zero

INPUT=$(cat)  # Capture stdin once

for hook in \
  ".claude/hooks/security_guard.sh" \
  ".claude/hooks/rate_limiter.sh" \
  ".claude/hooks/path_validator.sh"
do
  if [ -x "$hook" ]; then
    echo "$INPUT" | "$hook"
    STATUS=$?
    if [ $STATUS -ne 0 ]; then
      exit $STATUS  # Propagate the block
    fi
  fi
done

exit 0
```

Register the dispatcher as the single `PreToolUse` command:
```json
{ "hooks": { "PreToolUse": ".claude/hooks/pre_tool_use_dispatcher.sh" } }
```

---

## Common Pitfalls

> [!warning] Pitfall 1 — Not capturing stdin before multiple uses
> Stdin is consumed on first read. In shell scripts, capture it immediately: `INPUT=$(cat)`. In Python, call `json.load(sys.stdin)` once and store the result. Any attempt to read stdin a second time returns empty.

> [!warning] Pitfall 2 — Notification hooks blocking the session
> If `notify-send` or `osascript` fails (e.g., no display server in CI), it may hang or exit non-zero. Always call notification commands in the background (`notify-send ... &`) or wrap them in `|| true` so the hook always exits 0.

> [!warning] Pitfall 3 — Audit log hook logging full file contents
> A PostToolUse hook that logs `tool_input` verbatim will log entire file contents for Write tool calls. This creates huge log files and may capture secrets. Always truncate or summarize: log only `input_keys`, not values, or limit value length to 300 characters.

---

## Review Questions

> [!question] Q1 — In Recipe 3 (security guard), why is stdin parsed with `json.load(sys.stdin)` instead of reading environment variables?
> Environment variables only carry `CLAUDE_TOOL_NAME` and similar metadata. The actual command string being checked is inside the `tool_input.command` field of the JSON event, which is only available on stdin. Env vars don't contain the full tool arguments.

> [!question] Q2 — Why does the dispatcher script in the "Combining Multiple Hooks" section capture stdin first before calling sub-scripts?
> Stdin is a one-time stream. If the dispatcher passes the raw stdin to the first sub-script, it is consumed. The second sub-script would receive nothing. By capturing `INPUT=$(cat)` once and piping `echo "$INPUT"` to each sub-script, every hook sees the full event JSON.

> [!question] Q3 — What is the difference between registering a hook on the `Stop` event vs the `SessionEnd` event for notifications?
> `Stop` fires after every individual Claude response (every time Claude finishes a turn and waits for input). `SessionEnd` fires only once when the entire Claude Code process exits. For "Claude finished this response" notifications, use `Stop`. For "session over" cleanup, use `SessionEnd`.

---

## See Also

- [[Hook_Configuration]] — how to register these scripts in `settings.json`
- [[Hooks_Overview]] — conceptual overview of all 6 events
- [[Headless_Mode]] — hooks are critical for CI safety in unattended mode
- [[Security_Best_Practices_Claude]] — broader security checklist for AI-assisted projects
