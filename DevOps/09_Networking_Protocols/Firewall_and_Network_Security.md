---
title: Firewall and Network Security
aliases:
  - iptables
  - nftables
  - WAF
  - Network ACL
  - Security Groups
  - VPC
tags:
  - DevOps
domain: DevOps
difficulty: advanced
created: 2026-07-28
related:
  - SSH_and_Remote_Access
  - Load_Balancers_and_Proxies
  - SSL_TLS_Certificates
  - DNS_and_Resolution
status: complete
---

# 🛡️ Firewall and Network Security

> [!abstract] TL;DR
> Firewalls enforce network access policies by inspecting and filtering packets at various layers. iptables (Linux kernel Netfilter) provides stateful packet filtering using tables (filter/nat/mangle), chains (INPUT/OUTPUT/FORWARD), and targets (ACCEPT/DROP/REJECT). nftables is the modern successor with a unified syntax. At the cloud layer, Security Groups (stateful, instance-level) and Network ACLs (stateless, subnet-level) provide tiered AWS network security. WAFs add HTTP-layer protection against OWASP Top 10 threats. A well-designed VPC with public/private subnets and a DMZ tier reduces the blast radius of any single compromise.

## Intuition

Think of firewall rules as a tiered security checkpoint. iptables is the server's own customs officer: every incoming and outgoing packet is inspected, and the first matching rule decides the fate (like an early-exit `if` chain). Security Groups are the building's key-card system: each instance knows which other instances and IP ranges are allowed. Network ACLs are the perimeter fence: coarse stateless rules at the subnet boundary before traffic ever reaches any instance. A DMZ is the airlock between the fence and the building interior.

## How It Works

```mermaid
graph LR
    classDef dark fill:#0f3460,stroke:#533483,color:#e8e8e8
    classDef mid fill:#16213e,stroke:#533483,color:#e8e8e8
    classDef accent fill:#1a1a2e,stroke:#e94560,color:#e8e8e8

    Internet[Internet Traffic] -->|hits| NACL[Network ACL<br/>stateless subnet filter]
    NACL -->|pass| SG[Security Group<br/>stateful instance filter]
    SG -->|pass| WAF[WAF<br/>HTTP layer filter]
    WAF -->|pass| App[Application]

    App -->|OUTPUT chain| IPT[iptables]
    IPT -->|PREROUTING/POSTROUTING| NAT[NAT / Masquerade]

    class Internet dark
    class NACL mid
    class SG accent
    class WAF dark
    class App mid
    class IPT,NAT accent
```

## Key Concepts / Details

### iptables Architecture

```
Tables (priority order: raw → mangle → nat → filter):
  filter   — main packet filtering (default table): INPUT, OUTPUT, FORWARD
  nat      — address translation: PREROUTING, POSTROUTING, OUTPUT
  mangle   — packet header modification: all 5 chains
  raw      — conntrack bypass: PREROUTING, OUTPUT

Chains (hooks in packet path):
  PREROUTING  — before routing decision (incoming)
  INPUT       — packets destined for local process
  FORWARD     — packets routed through this host (not local)
  OUTPUT      — packets from local process
  POSTROUTING — after routing decision (outgoing)

Packet path for incoming traffic:
  Wire → PREROUTING(raw) → PREROUTING(mangle) → PREROUTING(nat)
       → routing decision
       → INPUT(mangle) → INPUT(filter) → local process

Packet path for forwarded traffic:
  Wire → PREROUTING → routing → FORWARD(mangle) → FORWARD(filter)
       → POSTROUTING → Wire

Targets:
  ACCEPT  — allow the packet
  DROP    — silently discard (no response to sender)
  REJECT  — discard and send ICMP error to sender
  LOG     — log to syslog and continue to next rule
  DNAT    — change destination IP/port (PREROUTING)
  SNAT    — change source IP/port (POSTROUTING)
  MASQUERADE — SNAT with dynamic IP (for NAT gateway)
  RETURN  — exit current chain, continue in calling chain
```

### iptables Commands

```bash
# List rules (with line numbers, no DNS lookup)
iptables -L -n -v --line-numbers

# List specific table
iptables -t nat -L -n -v

# Append rule to chain
iptables -A INPUT -p tcp --dport 22 -j ACCEPT         # allow SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT         # allow HTTP
iptables -A INPUT -p tcp --dport 443 -j ACCEPT        # allow HTTPS

# Insert rule at position 1 (before existing rules)
iptables -I INPUT 1 -p tcp --dport 8080 -j ACCEPT

# Delete a specific rule (by spec)
iptables -D INPUT -p tcp --dport 8080 -j ACCEPT

# Delete by line number
iptables -D INPUT 3

# Block a specific IP
iptables -I INPUT 1 -s 203.0.113.100 -j DROP

# Allow established connections (stateful — key rule)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Default policy (deny all if no rule matches)
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT            # usually allow outbound

# Flush all rules in a chain
iptables -F INPUT
iptables -F                          # flush all chains in filter table

# NAT masquerade (Linux as NAT gateway / router)
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
echo 1 > /proc/sys/net/ipv4/ip_forward

# Port forwarding (DNAT: redirect incoming port to internal host)
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT \
    --to-destination 10.0.1.50:8080

# Rate limiting (anti-brute-force for SSH)
iptables -A INPUT -p tcp --dport 22 -m limit \
    --limit 3/min --limit-burst 5 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP

# Log and drop (debugging)
iptables -A INPUT -p tcp --dport 9200 \
    -m limit --limit 5/min -j LOG --log-prefix "BLOCKED ES: "
iptables -A INPUT -p tcp --dport 9200 -j DROP

# Save and restore rules
iptables-save > /etc/iptables/rules.v4       # save current rules
iptables-restore < /etc/iptables/rules.v4    # restore on boot
```

### Stateful vs Stateless Filtering

```
Stateless (ACL-style):
  Each packet judged independently
  Must explicitly allow BOTH directions (request AND reply)
  Example: AWS Network ACL — allow TCP in on 443 AND allow TCP out on 1024-65535
  Faster but more complex to configure

Stateful (conntrack):
  Tracks connection state (NEW, ESTABLISHED, RELATED, INVALID)
  Automatically allows reply packets for established connections
  iptables + AWS Security Groups use stateful filtering
  ESTABLISHED: reply to a connection we initiated or allowed in
  RELATED:      associated connections (FTP data channel for FTP control)
  INVALID:      drop unknown state packets
```

### nftables — Modern iptables Replacement

```
# nftables uses tables → chains → rules (same concepts, cleaner syntax)

# Create a table
nft add table ip filter

# Create a chain with policy
nft add chain ip filter input '{ type filter hook input priority 0 ; policy drop ; }'
nft add chain ip filter output '{ type filter hook output priority 0 ; policy accept ; }'

# Add rules
nft add rule ip filter input ct state established,related accept
nft add rule ip filter input iif lo accept
nft add rule ip filter input tcp dport 22 accept
nft add rule ip filter input tcp dport { 80, 443 } accept

# NAT masquerade
nft add table ip nat
nft add chain ip nat postrouting '{ type nat hook postrouting priority 100 ; }'
nft add rule ip nat postrouting oif "eth0" masquerade

# List ruleset
nft list ruleset

# Save and restore
nft list ruleset > /etc/nftables.conf
nft -f /etc/nftables.conf

# Major advantages over iptables:
# - Atomic rule updates (no transient state)
# - Native sets and maps (IP sets in one rule)
# - Single tool for IPv4, IPv6, ARP, bridge
# - Better performance (JIT compilation)
```

### WAF (Web Application Firewall)

```
Protects against OWASP Top 10:
  - SQL Injection: detect/block SQLi patterns in parameters
  - XSS: detect/block script injection in inputs
  - LFI/RFI: detect path traversal (../../etc/passwd)
  - Command injection: detect shell metacharacters
  - CSRF: token validation (application-level)

Security models:
  Negative (blocklist): block known-bad patterns; easy to start, needs updates
  Positive (allowlist): only allow known-good patterns; harder to tune, more secure

ModSecurity (open source WAF, embeds in Nginx/Apache):
  Core Rule Set (CRS): community-maintained ruleset for common attacks
  Paranoia levels 1-4: higher = more rules = more false positives

AWS WAF:
  Managed rule groups (AWS + marketplace providers)
  Custom rules with rate limiting, geo-blocking, IP reputation
  Integrates with ALB, CloudFront, API Gateway

Rate limiting at WAF layer:
  Block IPs exceeding N requests/minute per path
  Protect against credential stuffing, scraping, DDoS
```

### AWS Network ACLs vs Security Groups

```
Network ACL (NACL):
  Subnet-level (applies to all instances in subnet)
  STATELESS — must allow both inbound and outbound for each connection
  Rules evaluated in order (lowest number first); first match wins
  Default NACL: allow all (number 100 ALLOW *, then 32767 DENY *)
  Cannot reference other security groups

  Example — allow HTTPS in, ephemeral ports out:
  Inbound:  100 ALLOW TCP 0.0.0.0/0 dport 443
  Outbound: 100 ALLOW TCP 0.0.0.0/0 dport 1024-65535  (ephemeral ports)

Security Group:
  Instance-level (attached to ENI)
  STATEFUL — reply traffic allowed automatically
  No explicit deny rules (only allow rules + implicit deny)
  Can reference other SGs by ID (not CIDR)

  Example — allow HTTP from ALB SG only:
  Inbound:  TCP port 80 source sg-0abc123 (the ALB's security group)
  Outbound: all traffic (default)
```

### DMZ Architecture

```
Three-tier network security model:

Internet
    │
    ▼ (TCP 80/443 only)
┌─────────────────────────────────────┐
│  DMZ / Public Subnet                │
│  - Load Balancers (ALB)             │
│  - Bastion Hosts (port 22)          │
│  - NAT Gateways                     │
│  NACL: allow 80, 443 in; block rest │
└──────────────┬──────────────────────┘
               │ (internal traffic only)
               ▼
┌─────────────────────────────────────┐
│  Application Subnet / Private       │
│  - App Servers                      │
│  - API Services                     │
│  SG: allow from ALB SG only         │
└──────────────┬──────────────────────┘
               │ (DB port only)
               ▼
┌─────────────────────────────────────┐
│  Data Subnet / Private              │
│  - RDS / Postgres                   │
│  - ElasticSearch                    │
│  - Redis / ElastiCache              │
│  SG: allow 5432/6379 from App SG    │
│  No internet access, no NAT GW      │
└─────────────────────────────────────┘
```

### VPC Networking Basics

```
VPC (Virtual Private Cloud):
  Isolated virtual network in AWS; you define IP range (e.g., 10.0.0.0/16)

Subnets:
  Public subnet:  route table has route to Internet Gateway (0.0.0.0/0 → igw-*)
  Private subnet: route table has route to NAT Gateway for outbound only

Internet Gateway (IGW): allows bidirectional internet access for public subnet resources
NAT Gateway: allows private subnet resources to initiate outbound internet, blocks inbound

Route Tables:
  public-rt:  10.0.0.0/16 → local | 0.0.0.0/0 → igw-*
  private-rt: 10.0.0.0/16 → local | 0.0.0.0/0 → nat-*

VPC Peering: direct networking between two VPCs (same or different account/region)
  Routes must be added on both sides; no transitive routing

Transit Gateway: hub-and-spoke model for connecting many VPCs and on-prem
VPN Gateway: IPsec VPN to on-premises data center
Direct Connect: dedicated physical link from on-premises to AWS
```

### Port Security Reference

```bash
# Ports to block by default on public-facing servers:
# 23   — Telnet (plaintext)
# 3389 — RDP (brute-forced constantly; only via VPN/bastion)
# 1433 — MSSQL
# 3306 — MySQL (never expose to internet)
# 5432 — Postgres (never expose to internet)
# 6379 — Redis (no auth by default on old versions)
# 9200 — Elasticsearch (exposes data without auth by default)
# 27017 — MongoDB

# Common required ports by service:
# 22    SSH
# 80    HTTP
# 443   HTTPS
# 53    DNS (UDP + TCP)
# 123   NTP (UDP)
# 25    SMTP (outbound only from mail servers)
# 587   SMTP submission (with TLS)
```

## Real-World Notes

- **iptables rules are volatile by default** — rules exist only in memory and are lost on reboot. Always persist rules with `iptables-save > /etc/iptables/rules.v4` and ensure `iptables-restore` runs at boot (via `iptables-persistent` package or a systemd unit). `nftables` uses `/etc/nftables.conf` loaded by systemd.
- **Security groups are preferable to NACLs for most AWS use cases** because they are stateful (no need to manually open ephemeral port ranges) and can reference other security groups by ID (making "allow traffic from the load balancer" exactly that — no IP ranges to maintain). Use NACLs for coarse subnet-level IP blocking (e.g., blocking a known-bad IP range).
- **WAF false positive tuning** is the biggest operational burden: start in "count" mode (log but don't block), analyze traffic, then gradually enable blocking rules. A WAF that blocks legitimate traffic is worse than no WAF.
- **East-west traffic in microservices** (service to service within a VPC) is increasingly secured with mTLS (Istio/Linkerd service mesh) rather than relying solely on security groups. Security groups provide coarse network-layer control; mTLS provides per-service identity-based authorization at the application layer.

## Common Pitfalls

1. **Stateless NACL forgetting ephemeral ports** — when you ALLOW inbound TCP on port 443 in a NACL, you must also ALLOW outbound TCP on the ephemeral port range (1024–65535) for the TCP reply. Many operators set up inbound rules but forget outbound reply rules, causing connections to hang. Security groups (stateful) avoid this entirely.
2. **Default DROP policy before allowing ESTABLISHED** — setting `iptables -P INPUT DROP` without first adding the ESTABLISHED/RELATED rule immediately locks out all existing connections, including your own SSH session. Always add `iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT` before changing the default policy.
3. **Security group limits masking a configuration error** — AWS SGs have a default limit of 60 inbound rules per SG and 5 SGs per ENI. When you hit the limit and must split rules across SGs or use CIDRs instead of SG references, the resulting configuration is harder to audit. Use VPC prefix lists and SG references instead of long CIDR lists.
4. **Overly broad VPC peering rules** — VPC peering is non-transitive and requires explicit route entries, but many teams add `0.0.0.0/0` to the peering route or allow all ports in the SG rule "just to make it work." Always scope peering to specific CIDR prefixes and restrict SG rules to the exact ports needed.
5. **Not logging dropped traffic** — iptables `-j DROP` is silent. Without LOG rules before DROP, you have no visibility into what traffic is being blocked. Add logging for unexpected drops: `iptables -I INPUT -m limit --limit 5/min -j LOG --log-prefix "DROP: "` before the final DROP rule. VPC Flow Logs provide equivalent visibility in AWS.

## Related Concepts

- [[SSH_and_Remote_Access]] — SSH hardening (sshd_config), port 22 access, bastion host architecture
- [[Load_Balancers_and_Proxies]] — LBs sit in the DMZ public subnet; SGs control what reaches backends
- [[SSL_TLS_Certificates]] — TLS/HTTPS is the primary mitigation for network-level eavesdropping; WAF complements TLS at the application layer
- [[DNS_and_Resolution]] — DNS (port 53) must be allowed through firewalls; split-horizon DNS relates to VPC internal zones
- [[_MOC_Networking_Protocols]] — Section MOC

## Review Questions

1. In an iptables configuration with `iptables -P INPUT DROP`, what is the minimum set of rules needed to allow incoming SSH connections while also allowing replies to outbound connections your server initiates?
2. Explain why AWS Security Groups are stateful but Network ACLs are stateless. Give a concrete example of a configuration that works with Security Groups but would require extra rules with NACLs.
3. What is a DMZ architecture, and why does placing a load balancer in a public subnet but application servers in a private subnet improve security compared to putting everything in a public subnet?
4. A developer reports that their `curl https://api.internal` works from their laptop but fails when called from an EC2 instance in a private subnet. Walk through the network security layers you would check to diagnose this.

## Sources

- [iptables man page](https://linux.die.net/man/8/iptables)
- [nftables wiki](https://wiki.nftables.org/)
- [AWS VPC Security Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ModSecurity / CRS Documentation](https://coreruleset.org/docs/)
- [AWS Security Groups vs NACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)

#DevOps #Networking #Security #iptables #nftables #WAF #VPC #Firewall #AWS
