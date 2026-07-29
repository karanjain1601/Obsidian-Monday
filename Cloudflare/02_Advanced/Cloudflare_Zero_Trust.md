---
title: Cloudflare Zero Trust
aliases: [Cloudflare Access, ZTNA, Cloudflare Tunnel, cloudflared]
tags: [cloudflare, zero-trust, security, vpn, access-control]
domain: Cloudflare
difficulty: Intermediate
created: 2026-07-29
related: [Cloudflare_Overview, Cloudflare_Performance, Workers_Patterns]
status: complete
---

# Cloudflare Zero Trust

> [!abstract] TL;DR
> Cloudflare Zero Trust replaces traditional VPN with identity-aware access: Cloudflare Access proxies internal apps behind identity verification (no VPN client needed), Cloudflare Tunnel exposes services without port forwarding, WARP provides device-level Zero Trust network access, and Gateway filters DNS/HTTP traffic to block malware and enforce DLP policies.

## Zero Trust Model vs VPN

```
Traditional VPN:
  User → VPN tunnel → Corporate network → All internal apps
  (inside network = trusted = full access)

Zero Trust:
  User → Identity check → Per-app access decision → Only that app
  (never trust, always verify — even for internal users)
```

Zero Trust principles:
1. **Verify explicitly:** always authenticate and authorize (identity + device posture)
2. **Use least-privilege access:** users get access to only what they need
3. **Assume breach:** log everything, inspect all traffic, prepare for lateral movement

---

## Cloudflare Access — Identity-Aware Proxy

Access puts an identity layer in front of any internal application. The app doesn't need a VPN — users authenticate through Cloudflare before requests reach the origin.

```
User → access.example.com/internal-app → Cloudflare Access (identity check)
                                                    ↓
                                        IdP (Okta, Azure AD, GitHub)
                                                    ↓
                                        Policy check (email, group, MFA)
                                                    ↓
                                        Internal app (only if authorized)
```

### Setting Up an Access Application (Dashboard)

1. **Zero Trust → Access → Applications → Add Application**
2. Choose type: **Self-hosted** (your own origin), **SaaS** (Okta/Salesforce), or **SSH/RDP**
3. Set the hostname: `internal-tool.example.com`
4. Configure identity providers
5. Create policies (who can access)

### Access Policies

```
Policy Name: Engineering Team Access
Action: Allow
Rules:
  Include:
    - Emails: @company.com
    - Group: engineering (from Okta)
  Require:
    - MFA (users must have completed MFA)
  Exclude:
    - Emails: contractor@external.com
```

| Rule Type | Description |
|---|---|
| **Include** | Must match at least one (OR logic) |
| **Require** | Must match all (AND logic) |
| **Exclude** | Must NOT match (deny list) |

### Supported Identity Providers

- **Okta** — SAML 2.0, OIDC
- **Azure Active Directory** — OIDC, SAML
- **Google Workspace** — OIDC
- **GitHub** — OAuth
- **One-time PIN (OTP)** — email-based, no IdP required (free tier)

---

## Cloudflare Tunnel (`cloudflared`)

Tunnels allow you to expose a local or internal service to the internet **without opening inbound firewall ports**. The `cloudflared` daemon creates an outbound connection to Cloudflare's edge.

```
Internet user → Cloudflare edge → cloudflared tunnel → Local service
                (no port 443/80 inbound required on origin)
```

### Setting Up a Tunnel

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared
# or: curl -L --output cloudflared.deb \
#   https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Login and authorize
cloudflared tunnel login

# Create a named tunnel
cloudflared tunnel create my-tunnel
# Returns: tunnel ID and credentials JSON file

# Create DNS record pointing to tunnel
cloudflared tunnel route dns my-tunnel app.example.com

# Run the tunnel (expose local port 3000)
cloudflared tunnel run --url http://localhost:3000 my-tunnel
```

### Tunnel Config File (`~/.cloudflared/config.yml`)

```yaml
tunnel: <tunnel-id>
credentials-file: /home/user/.cloudflared/<tunnel-id>.json

ingress:
  # Route app.example.com to local port 3000
  - hostname: app.example.com
    service: http://localhost:3000

  # Route api.example.com to local port 8080
  - hostname: api.example.com
    service: http://localhost:8080
    originRequest:
      noTLSVerify: true

  # Route SSH access
  - hostname: ssh.example.com
    service: ssh://localhost:22

  # Default: catch-all 404
  - service: http_status:404
```

### Running as a System Service

```bash
# Install as systemd service (Linux)
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared

# Or as macOS LaunchAgent
cloudflared service install
```

---

## WARP — Device-Level Zero Trust

WARP is Cloudflare's device agent. It routes all device traffic through Cloudflare's network, enabling:

- **DNS filtering** via Gateway (block malicious domains, enforce safe search)
- **HTTP inspection** (Gateway can inspect HTTPS via MITM cert)
- **Device posture** (is the device compliant? disk encrypted? OS up to date?)
- **Private network access** — connect to private IPs through Cloudflare Tunnel without a traditional VPN

### WARP Architecture

```
Device WARP agent → Cloudflare network → Gateway policies → Internet
                                       → Private tunnels → Internal apps
```

### Device Posture Checks

Configure under Zero Trust → Settings → WARP client → Device posture:
- OS version (block devices running Windows < 10.22H2)
- Disk encryption enabled
- Antivirus active
- Carbon Black / SentinelOne / CrowdStrike agent present
- Certificate check (custom corporate cert installed)

---

## Cloudflare Gateway

Gateway provides DNS-level and HTTP-level filtering for all traffic from WARP-enrolled devices.

### DNS Filtering

```
Device → WARP → Cloudflare DNS Resolver → Gateway policies → Allow/Block
                                                     ↓
                                           Block: malware, phishing, adult content
                                           Allow: approved domains only
```

Configure DNS policies under Zero Trust → Gateway → DNS Policies:
```
Policy: Block Malware and Phishing
Rules:
  Security categories: Malware, Phishing, Command & Control
  Action: Block
```

### HTTP Filtering (with TLS inspection)

HTTP policies can inspect HTTPS content (via MITM certificate installed on devices):

```
Policy: Block File Uploads to Personal Cloud Storage
Rules:
  Domain: dropbox.com, drive.google.com (personal)
  Upload action: Block
  Action: Block

Policy: DLP - Block SSN Patterns
Rules:
  Content patterns: SSN regex (DLP profile)
  Action: Block
```

### Gateway vs Traditional Proxy

| Feature | Gateway | Traditional Web Proxy |
|---|---|---|
| DNS filtering | Native | Requires DNS redirect |
| HTTPS inspection | Via WARP certificate | Via proxy cert |
| Deployment | WARP agent (no proxy config) | Manual proxy setting |
| Latency overhead | Low (Cloudflare PoP routing) | Medium-High |
| Egress traffic | Through Cloudflare backbone | Through proxy server |

---

## Teams Dashboard Structure

```
Zero Trust Dashboard
├── Access
│   ├── Applications (what you're protecting)
│   ├── Service Tokens (machine-to-machine auth)
│   └── Policies
├── Gateway
│   ├── DNS Policies
│   ├── HTTP Policies
│   ├── Network Policies
│   └── DLP Profiles
├── WARP Client
│   ├── Device Posture
│   └── Split Tunneling (exclude certain IPs from WARP)
├── Logs
│   ├── Access Logs
│   ├── Gateway DNS Logs
│   └── Gateway HTTP Logs
└── Settings
    ├── Authentication (IdP config)
    └── Account Plan
```

---

## Common Pitfalls

- **Forgetting to pair Tunnel with Access.** A tunnel exposes your internal service publicly by default. Always add an Access application policy in front of it.
- **One-time PIN (OTP) allows any email.** If you set the IdP to "One-time PIN" without email domain restriction, anyone with any email can authenticate. Add an email domain rule.
- **WARP split tunneling and private subnets.** If you have on-prem services at `10.0.0.0/8`, configure split tunneling to include that range through WARP, or it'll try to reach it directly.
- **cloudflared token rotation.** Tunnel credentials are long-lived files. Rotate them periodically and store securely (not in Git).
- **Device posture checks require WARP enrollment.** If a user isn't enrolled in WARP, posture checks can't run — Access will deny them or fall back to a weaker policy.

---

## Review Questions

1. What is the core difference between a Zero Trust model and a traditional VPN approach?
2. You want to expose an internal GitLab instance at `gitlab.internal.example.com` without opening port 443 on your server. Which Cloudflare product do you use, and what are the setup steps?
3. An Access policy has an `Include` rule (emails matching `@company.com`) and a `Require` rule (MFA). Describe who can and cannot access the application.
4. What is the difference between Cloudflare Gateway DNS policies and HTTP policies? When would you use each?
5. A WARP-enrolled device fails a device posture check (OS version too old). What happens when that user tries to access an Access-protected application?
