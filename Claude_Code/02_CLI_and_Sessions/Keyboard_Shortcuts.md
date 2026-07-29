---
title: Claude Code Keyboard Shortcuts
aliases: [Claude Input Shortcuts, Claude Prefixes, Shift+Tab Claude]
tags: [ClaudeCode, CLI, Reference]
domain: Claude Code
difficulty: Beginner
created: 2026-07-29
related: [Claude_CLI_Commands, Session_Management]
status: complete
---

# Claude Code Keyboard Shortcuts

> [!tldr] TL;DR
> Key shortcuts: **Shift+Tab** to auto-accept a suggestion, **Ctrl+C** to interrupt an in-progress response, **Esc** to cancel current input, **Ctrl+R** to search history. Input prefixes: `!cmd` runs a shell command, `\` continues to next line, `@file` references a file.

---

## Keyboard Shortcuts Table

| Shortcut | What it does |
|---|---|
| **Shift+Tab** | Auto-accept the current suggestion and move on |
| **Ctrl+C** | Interrupt Claude mid-response (stop generation) |
| **Esc** | Cancel what you've typed (clear current input line) |
| **Esc, Esc** (double Esc) | Clear the entire input buffer |
| **Ctrl+R** | Search through input history (like bash reverse-i-search) |
| **Ctrl+L** | Clear the terminal screen (keeps session active) |
| **Up / Down arrows** | Navigate through previous inputs |
| **Ctrl+A** | Move cursor to start of current input line |
| **Ctrl+E** | Move cursor to end of current input line |
| **Tab** | Autocomplete file paths in `@filename` references |

---

## Shift+Tab — Auto-Accept

When Claude proposes a file edit or action, it shows a diff and waits for your approval. Options:
- Press **Enter** or type `y` to accept
- Type `n` to reject
- Press **Shift+Tab** to **auto-accept** the current suggestion and immediately proceed to the next one

Shift+Tab is useful when you're batch-reviewing a series of small changes and want to move quickly through them without typing `y` each time.

---

## Ctrl+C — Interrupt

Pressing **Ctrl+C** during Claude's response:
- Stops the current generation immediately
- Returns you to the prompt
- Does NOT undo any edits Claude has already written to disk

If Claude is mid-edit and you press Ctrl+C, files that were already written remain changed. Run `/rewind` if you want to undo the last turn's changes.

> [!important]
> Ctrl+C does not cancel approved file edits that are already written. Use `/rewind` to roll back completed actions.

---

## Input Prefixes

Input prefixes are special characters you type at the start of your message that change how Claude Code handles it:

### `!` — Run a Shell Command

```
! git status
! npm test
! cat src/config.json
```

Typing `!` followed by a shell command runs it directly in your current working directory. The output is shown in the session. This is useful for quick checks without leaving the Claude Code session.

**Difference from Claude running bash:** When you use `!`, *you* run the command and see the output. When Claude uses the bash tool, *Claude* runs it and incorporates the output into its reasoning.

### `\` — Line Continuation

```
Write a full test suite for the UserService class \
covering: creation, update, deletion, \
and the findByEmail edge cases including null email and duplicate.
```

A backslash at the end of a line tells Claude Code to wait for more input before submitting. This lets you write multi-line prompts without accidentally sending early.

**Tip:** For very long prompts, use `\` continuation or paste a prepared prompt from your clipboard.

### `@` — File Reference

```
Review @src/services/AuthService.ts for security issues
Explain the code in @components/UserProfile.tsx
What does @README.md say about setup?
```

The `@filename` prefix tells Claude to read and incorporate the specified file's content into the current message. Tab-completion works for file paths after `@`.

**Tip:** You can reference multiple files in one message: `Compare @models/User.ts and @models/UserV2.ts`.

---

## Full Reference

```
Keyboard Shortcuts
├── Navigation
│   ├── Up/Down     → history navigation
│   ├── Ctrl+R      → reverse history search
│   ├── Ctrl+A      → start of line
│   └── Ctrl+E      → end of line
├── Session control
│   ├── Ctrl+C      → interrupt response
│   ├── Esc         → cancel input
│   └── Ctrl+L      → clear screen
├── Accepting changes
│   ├── Enter / y   → accept suggestion
│   ├── n           → reject suggestion
│   └── Shift+Tab   → auto-accept and continue
└── Input prefixes
    ├── !cmd        → run shell command
    ├── \           → multi-line continuation
    └── @path       → file reference (Tab to complete)
```

---

## Workflow Tips

**Quickly check git state without leaving Claude Code:**
```
! git status
! git diff --stat
```

**Multi-line complex prompt:**
```
Refactor the payment processing module to: \
1. Use the Strategy pattern for different payment providers \
2. Add retry logic with exponential backoff \
3. Emit events on success/failure for the audit log \
Follow existing patterns in OrderService.ts.
```

**Reference a file while asking a question:**
```
Looking at @src/api/routes.ts — why are the auth middleware checks inconsistent
between the user routes and the admin routes?
```

---

## Common Pitfalls

> [!warning] Pitfall 1 — Pressing Ctrl+C expecting it to undo edits
> Ctrl+C interrupts generation but does NOT undo files already written to disk. If Claude has already saved a file, use `/rewind` to reverse the last turn.

> [!warning] Pitfall 2 — Forgetting Shift+Tab during batch approvals
> When Claude proposes a series of small changes, manually typing `y` for each one is slow. Use Shift+Tab to auto-accept and move through quickly.

> [!warning] Pitfall 3 — Not using \ for long prompts
> Pressing Enter mid-thought sends a partial prompt. Either use `\` continuation, or type the full prompt in a text editor and paste it in one go.

---

## Review Questions

> [!question] Q1 — What does Shift+Tab do in Claude Code?
> Auto-accepts the current suggestion and moves to the next one. Useful for quickly approving a series of small changes without typing `y` each time.

> [!question] Q2 — What does the `!` prefix do?
> Runs a shell command directly from the Claude Code prompt. The output is shown in the session but Claude doesn't automatically reason about it unless you follow up.

> [!question] Q3 — How do you write a multi-line prompt in Claude Code?
> End each line with a backslash `\` to continue on the next line without submitting. Press Enter on the final line (without `\`) to submit.

---

## See Also

- [[Claude_CLI_Commands]] — full reference for all shell and slash commands
- [[Session_Management]] — using /rewind to undo turns, /compact to compress context
- [[Context_and_Memory]] — how @ file references affect context usage
