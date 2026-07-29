---
title: "Openclaw Roadmap"
tags: [Roadmap]
source: roadmap.sh
created: 2026-07-28
---

# Openclaw Roadmap

> Source: roadmap.sh

## Topics


### OpenClaw vs Claude Code

### Introduction

### How OpenClaw Works

### Setting up OpenClaw

### Usage Best Practices

### Related Roadmaps

### Claude Code Roadmap

### Vibe Coding Roadmap

### AI Agents Roadmap

### AI Engineer Roadmap
- Find the detailed version of this roadmap
- along with other similar roadmaps
- roadmap.sh
- Visit the following roadmaps to keep learning

### Claude Code

### Vibe Coding

### AI Engineer
- channels list
- channels login
- channels add --channel
- channels status --probe
- models list | set | status
- models auth setup-token
- models auth add
- cron list
- cron add
- /status
- /new
- /model
- /context
- /compact
- memory index --all
- memory search "<query>"
- gateway
- gateway start | stop | restart
- doctor --deep

### Command Cheatsheet

### Setup & Health

### security audit
- doctor

### Gateway

### Models
- /help
- /reset
- /stop

### Skills

### Multi-Agents

### Installing from ClawHub

### Creating Skills

### Security Risks

### Routing Rules

### Auth & Model Providers

### Adding First Channel

### Adding Daemon

### Workspace Settings

### Antropic

### OpenAI

### Gemini

### Ollama

### Why and Why not?

### Use cases

### Gateway Settings

### Context Window

### Memory System

### Gateway

### Channels

### Skills

### Proactive Core

### Agents

### Understand the Differences

### MEMORY.md

### AGENTS.md

### SOUL.md

### USER.md

### Other Workspace Files
- memory/YYYY-MM-DD.md

### Agent Loop
- iMessage

### Telegram

### Slack

### WhatsApp

### Open Claw in Action

### Discord

### Signal

### Plugins

### Automating Tasks

### Hooks

### Webhooks

### Heartbeats

### Cron Jobs

### Managing & Disabling Jobs

### Event Types

### Hook Structure

### Securing Webhooks

### HEARTBEAT.md

### Interval & Active Hours

### MCP

### Security checkist
- Deploy on an isolated VPS, VM, or dedicated device, not you PC

### Run OpenClaw as a non-root user
- Bind the gateway to localhost, not `0.0.0.0` and secure ports 18789 and 18793
- Set a strong gateway auth token before exposing any service
- Enable device pairing and maintain a minimal sender allowlist

### Never hardcode API keys: use environment variables
- Start in read-only mode and widen permissions deliberately

### Never trust external content (emails, web pages) to prevent prompt injection

### Run `openclaw security audit --deep` after every config change

### Update OpenClaw regularly: many security fixes ship in patch releases
- Rotate all credentials immediately if a breach is suspected

### Creating Plugins

### Installing Plugins

### Channels
- channels remove --channel
- onboard

### Memory & Cron
- backup create

### Slash Commands (/)
- /usage
- /think
- /fast
- /reasoning
- /allowlist
- /config
- /mcp
- /plugins

### Security Risks

### Choose your Installation Method

### Local Machine

### Security Best Practices

### VPS/Cloud

### Dedicated Hardware

### Rasberry Pi

### Mac Mini

### Docker

### Isolated Install

### Installation

### Onboarding

### Sessions

### Why and Why not?

### Security Best Practices

### Why and Why not?

### Pick a Provider
