---
title: OpenClaw Setup
aliases: [OpenClaw Installation, OpenClaw Onboarding, OpenClaw VPS Setup]
tags: [OpenClaw, fundamentals]
domain: OpenClaw
difficulty: Beginner
created: 2026-07-29
related: [OpenClaw_Overview, OpenClaw_Channels, OpenClaw_Models, OpenClaw_Security]
status: complete
---

# OpenClaw Setup

> [!abstract] TL;DR
> Install OpenClaw on an isolated VPS (strongly preferred over your personal PC for security), run `openclaw onboard` to walk through the interactive setup wizard, add a channel and model provider, then verify health with `openclaw doctor --deep`. Never run OpenClaw as root, and never expose the gateway port to the public internet without authentication.

---

## Choosing an Installation Target

| Target | When to use | Trade-offs |
|--------|------------|------------|
| **VPS (recommended)** | Production use, always-on assistant | Small monthly cost; best isolation |
| **Local machine** | Development and testing only | Not always on; shares OS with personal data |
| **Docker container** | Teams, CI, or multi-service setups | Good isolation; requires Docker knowledge |
| **Raspberry Pi** | Low-cost always-on home server | ARM-specific builds; limited RAM for large models |
| **Mac Mini (local server)** | macOS-only channels (iMessage via Bluebubbles) | Requires macOS; best for iMessage integration |

> [!warning] Personal PC Warning
> Running OpenClaw on your daily-use machine means the gateway process has access to your filesystem under your user account. A prompt-injection attack via a malicious incoming message could execute code. Use a **dedicated non-root user** or a separate machine/VM.

---

## Installation

### Prerequisites

- A Linux VPS or macOS machine (Ubuntu 22.04 LTS recommended for VPS)
- Node.js 20+ or the OpenClaw binary from the release page
- A non-root system user dedicated to OpenClaw (e.g., `openclaw`)

```bash
# Create a dedicated user (Linux)
sudo useradd -m -s /bin/bash openclaw
sudo su - openclaw

# Install OpenClaw via the install script
curl -fsSL https://get.openclaw.io | bash

# Or via npm
npm install -g @openclaw/cli

# Verify installation
openclaw --version
```

### Docker Install

```bash
docker pull openclaw/openclaw:latest

docker run -d \
  --name openclaw \
  -p 127.0.0.1:18789:18789 \
  -v /home/openclaw/workspace:/workspace \
  --restart unless-stopped \
  openclaw/openclaw:latest
```

Note: binding to `127.0.0.1` (not `0.0.0.0`) ensures the port is not exposed to the network. Put a reverse proxy (nginx, Caddy) with TLS in front if you need external access.

---

## Initial Onboarding: `openclaw onboard`

The `onboard` wizard walks you through all required configuration in one interactive session:

```bash
openclaw onboard
```

The wizard will:
1. Create the workspace directory (`~/workspace/` by default)
2. Generate the gateway auth token (stored in `~/.openclaw/config.yaml`)
3. Ask you to add your first channel
4. Ask you to add your first model provider (API key)
5. Write initial workspace files (`MEMORY.md`, `SOUL.md`, `USER.md`, `AGENTS.md`)
6. Start the gateway and confirm it is listening

---

## Adding a First Channel

```bash
# Interactive add
openclaw channels add --channel telegram

# The CLI will prompt for a Telegram bot token
# Get one from @BotFather on Telegram
```

See [[OpenClaw_Channels]] for full channel setup details per platform.

---

## Connecting a Model Provider (Anthropic Example)

```bash
# Interactive token setup
openclaw models auth setup-token

# Or add directly
openclaw models auth add --provider anthropic --token sk-ant-...

# Verify the provider is active
openclaw models status
```

Your API keys are stored in `~/.openclaw/credentials.yaml` (never commit this file).

---

## Starting and Managing the Gateway

```bash
# Start the gateway (foreground, for debugging)
openclaw start

# Start as a background daemon
openclaw start --daemon

# Check daemon status
openclaw status

# Stop the daemon
openclaw stop

# Restart
openclaw restart
```

For production VPS, register OpenClaw as a systemd service so it starts on boot:

```ini
# /etc/systemd/system/openclaw.service
[Unit]
Description=OpenClaw AI Personal Assistant Gateway
After=network.target

[Service]
User=openclaw
ExecStart=/usr/local/bin/openclaw start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable openclaw
sudo systemctl start openclaw
```

---

## Health Check

```bash
# Basic health check
openclaw doctor

# Deep health check — verifies channel connectivity and model API reachability
openclaw doctor --deep
```

`openclaw doctor --deep` checks:
- Gateway is listening on port 18789
- Auth token is set and non-empty
- Each configured channel can be reached
- Each configured model provider returns a successful test completion
- Workspace files exist and are readable
- No deprecated config keys are present

---

## First-Time Security Checklist

| Item | Command / Action |
|------|-----------------|
| Dedicated non-root user | `sudo useradd -m openclaw` |
| Gateway bound to localhost | Confirm `bind: 127.0.0.1` in `~/.openclaw/config.yaml` |
| Strong auth token (32+ chars) | `openclaw config regen-token` |
| Credentials file not world-readable | `chmod 600 ~/.openclaw/credentials.yaml` |
| Firewall blocks port 18789 externally | `ufw deny 18789` (if using ufw) |
| Regular updates | `openclaw update` or `npm update -g @openclaw/cli` |
| Sender allowlist on each channel | `/allowlist add <sender>` on first message |

---

## Common Pitfalls

1. **Running `openclaw onboard` as root** — The wizard will warn but not block this. Root installs mean the gateway process has unrestricted system access. Always use a dedicated unprivileged user.
2. **Forgetting to bind the gateway to localhost** — The default config binds to `0.0.0.0`, which exposes port 18789 to all network interfaces. Change `bind: 0.0.0.0` to `bind: 127.0.0.1` in `~/.openclaw/config.yaml` before first start.
3. **Skipping `openclaw doctor --deep` after changes** — Channel and model configs can silently fail (bad token, bot not added to channel, firewall block). Always run the deep health check after any configuration change.

---

## Review Questions

1. Why is `openclaw doctor --deep` preferred over `openclaw doctor` after adding a new channel or model?
2. What is the difference between binding the gateway to `127.0.0.1` versus `0.0.0.0`, and which is correct for a VPS with a reverse proxy in front?
3. A fresh install on a shared hosting account runs OpenClaw as the same user as the web server. What are the security risks, and what is the preferred solution?

---

## See Also

- [[OpenClaw_Overview]] — Architecture and core concepts
- [[OpenClaw_Channels]] — Per-channel setup requirements
- [[OpenClaw_Models]] — Model provider authentication
- [[OpenClaw_Security]] — Full security model and audit checklist
- [[_MOC_OpenClaw_Master]] — Full vault index
