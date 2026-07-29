---
title: OSINT Techniques
aliases: [OSINT, Open Source Intelligence, Passive Recon, Active Recon, Shodan, Maltego]
tags: [Cybersecurity, ThreatIntelligence, OSINT, Recon, Shodan, Maltego, PenTest]
domain: Cybersecurity
difficulty: Intermediate
created: 2026-07-29
related:
  - Threat_Intelligence_Overview
  - Reconnaissance_and_OSINT
  - Indicators_of_Compromise
  - Threat_Hunting
status: complete
---

# 🔍 OSINT Techniques

> [!abstract] TL;DR
> **Open Source Intelligence (OSINT)** is the collection and analysis of information from publicly available sources — no hacking required. **Passive recon** gathers information without touching the target (Shodan, WHOIS, Certificate Transparency, Wayback Machine). **Active recon** queries the target directly (DNS enumeration, port scanning). Key platforms: **Shodan/Censys** for internet-exposed assets, **Maltego** for relationship mapping, **theHarvester** for email/domain enumeration, **SpiderFoot** for automated OSINT. From a defender's perspective, OSINT reveals what an attacker sees about your organization before they even launch a single packet.

---

## Intuition — Analogy First

A burglar planning a heist doesn't start by picking the lock. First, they walk past the house (passive recon): note the security camera positions, the alarm company sticker, whether the porch light is on, when cars come and go. They check public records for the owner's name. They look on social media to find the owner posted "leaving for Cancun for 2 weeks!" This is OSINT.

Defenders do the same thing: walk past their own house with an attacker's eyes. What does an attacker see from the street? What email addresses, job postings, technology stacks, and misconfigured cloud storage does your organization expose publicly?

---

## How It Works

### Passive vs Active OSINT

```mermaid
graph LR
    subgraph "Passive Recon (No target interaction)"
        P1["Shodan / Censys\nSearch pre-scanned internet"]
        P2["WHOIS / RDAP\nDomain registration info"]
        P3["Certificate Transparency\nSSL cert history/subdomains"]
        P4["Wayback Machine\nHistorical website snapshots"]
        P5["GitHub / GitLab\nLeaked credentials, API keys"]
        P6["Social Media / LinkedIn\nEmployee names, tech stack"]
    end

    subgraph "Active Recon (Direct target queries)"
        A1["DNS Enumeration\nSubfinder, amass, dnsx"]
        A2["Port Scanning\nnmap, masscan"]
        A3["Web crawling\ngobuster, feroxbuster, hakrawler"]
        A4["Email enumeration\ntheHarvester, hunter.io"]
    end

    ATTACKER["Attacker / Researcher"] --> P1 & P2 & P3 & P4 & P5 & P6
    ATTACKER -->|"legal grey area\nor authorized only"| A1 & A2 & A3 & A4
```

**Passive recon** is legal against any target — you're querying third-party databases, not the target. **Active recon** sends packets to the target and requires authorization in a professional context (pentest engagement).

---

### Shodan — Internet-Wide Scanning

Shodan continuously scans the entire internet on common ports and stores the results. Unlike Google (which crawls HTML), Shodan indexes service banners, TLS certificates, device metadata.

```python
# Using Shodan Python library
import shodan

API_KEY = "YOUR_SHODAN_API_KEY"
api = shodan.Shodan(API_KEY)

# Search for exposed Elasticsearch instances (no authentication)
results = api.search('product:Elasticsearch port:9200 -authentication')
print(f"Found: {results['total']:,} exposed Elasticsearch instances")

for result in results['matches'][:5]:
    print(f"\nIP: {result['ip_str']}")
    print(f"  Country: {result.get('location', {}).get('country_name', 'Unknown')}")
    print(f"  ASN: {result.get('asn', 'N/A')}")
    print(f"  Hostname: {result.get('hostnames', [])}")

# Search for your own organization's exposed assets
org_results = api.search('org:"ACME Corp" port:22,3389,8080')

# Look up a specific IP
host = api.host('8.8.8.8')
print(f"Google DNS: {host['org']}, {host['country_name']}")
print(f"Open ports: {[item['port'] for item in host['data']]}")

# Common Shodan dorks
# org:"company name"          — all assets belonging to org
# ssl:"company.com"           — TLS certs containing domain
# net:192.0.2.0/24            — subnet range
# http.title:"Login"          — web pages with "Login" in title
# product:Jenkins             — all public Jenkins instances
# "default password"          — devices using default creds
```

**Defensive use:** Run Shodan queries against your own organization monthly. Any unexpected open ports, default credential warnings, or misconfigured services should be remediated before attackers find them.

---

### Certificate Transparency

Every publicly trusted TLS certificate is logged in public Certificate Transparency (CT) logs. This is a goldmine for subdomain enumeration:

```bash
# Query CT logs for subdomains
# crt.sh (web UI and API)
curl "https://crt.sh/?q=%.example.com&output=json" | \
    jq '.[].name_value' | sort -u | \
    grep -v '\*' | sed 's/"//g' > subdomains.txt

# Using subfinder (automated, queries CT logs + other sources)
subfinder -d example.com -o subdomains.txt -all

# Using amass for comprehensive enumeration
amass enum -d example.com -passive -o subdomains.txt

# Resolve found subdomains to IP addresses
cat subdomains.txt | dnsx -a -resp -o resolved.txt

# Example output:
# admin.example.com [192.0.2.10]       ← could be admin panel
# old-vpn.example.com [198.51.100.5]   ← potentially old/unpatched VPN
# staging.example.com [203.0.113.20]   ← staging with prod data?
```

---

### GitHub Leak Discovery

Developers frequently accidentally commit API keys, credentials, and proprietary code:

```bash
# Search GitHub for leaked credentials (authorized research / own org)
# Using trufflehog
trufflehog github --org=mycompany --only-verified

# Using gitleaks
gitleaks detect --source /path/to/repo --report-path gitleaks-report.json

# Manual GitHub dorks (search.github.com)
# org:mycompany password
# org:mycompany "api_key" OR "api_secret" OR "access_token"
# org:mycompany filename:.env
# org:mycompany filename:id_rsa

# Using GitDorker
python3 GitDorker.py -tf myorg_tokens.txt -q mycompany -d dorks.txt

# Common leak patterns to search for:
# AWS: AKIA[0-9A-Z]{16}
# GitHub: ghp_[a-zA-Z0-9]{36}
# Stripe: sk_live_[a-zA-Z0-9]{24}
# Private keys: -----BEGIN RSA PRIVATE KEY-----
```

---

### theHarvester — Email and Domain Enumeration

```bash
# Enumerate emails, employee names, and hosts for a domain
theHarvester -d example.com -b all -l 500 -f harvest_results.html

# Specific sources
theHarvester -d example.com -b google,linkedin,shodan,certspotter,crtsh

# Useful for: phishing target lists, employee enumeration for password spraying
# Output: emails (john.doe@example.com), subdomains, IPs, employee names

# hunter.io API for email format discovery
curl "https://api.hunter.io/v2/domain-search?domain=example.com&api_key=KEY" | \
    jq '.data.emails[].value'
# Discovers email format: first.last@example.com → use for phishing or password spraying
```

---

### Maltego — Relationship Mapping

Maltego is a graphical OSINT tool that maps relationships between entities (people, domains, IPs, organizations):

```
Transforms in Maltego:
Person → Email addresses → Domains → IP addresses → Hosting provider → Other domains → ...

Example investigation graph:
John Smith (LinkedIn CEO at ACME) 
  → email: john.smith@acme.com (theHarvester)
  → personal email: jsmith1985@gmail.com (data breach lookup)
  → GitHub: github.com/jsmith (personal projects)
    → leaked AWS key in repo from 2022
  → Domain: johnsmith.dev (personal site)
    → DNS: same hosting as acme.com dev environment
    → SSL cert: also lists staging.acme.com
```

Transform types:
- **Passive DNS** — historical DNS records for IPs/domains
- **WHOIS / RDAP** — registration data, registrant email
- **Shodan** — exposed services on discovered IPs
- **Have I Been Pwned** — check emails in breach databases

---

### Cloud Resource Discovery

Cloud services often expose assets via predictable naming:

```bash
# S3 bucket enumeration (passive — querying AWS public endpoints)
# Tools: S3Scanner, cloud_enum, BucketFinder

python3 cloud_enum.py -k mycompany -k acmecorp -k acme

# Manually test S3 bucket access
aws s3 ls s3://company-backups --no-sign-request  # No auth required for public buckets

# Google Cloud Storage
curl -s "https://storage.googleapis.com/mycompany-data/" 

# Azure Blob Storage
curl -s "https://mycompany.blob.core.windows.net/?comp=list"

# Common misconfigurations found via OSINT:
# - Public S3 buckets with database backups
# - Exposed .git directories on web servers
# - Publicly accessible Kubernetes dashboards
# - Jenkins without authentication
# - Exposed .env files with database credentials
```

---

### OSINT Frameworks and Automation

| Tool | Type | Best For |
|------|------|----------|
| **Maltego** | GUI relationship mapping | Complex entity relationship investigation |
| **SpiderFoot** | Automated OSINT platform | Comprehensive automated profiling |
| **theHarvester** | CLI | Quick email/domain enumeration |
| **Recon-ng** | Modular framework | Scripted reconnaissance workflows |
| **OSINT Framework** (osintframework.com) | Reference | Categorised tool index |
| **Shodan** | Search engine | Internet-exposed asset discovery |
| **Censys** | Search engine | TLS cert analysis, network data |
| **GreyNoise** | Noise filtering | Distinguish attackers from internet scanners |

---

## Real-World Notes

- **Twitter/X employee data breach (2022)** — A security researcher used OSINT (GraphQL API, LinkedIn, and theHarvester) to enumerate 5.4M Twitter user records and email associations before any exploitation. The exposure was via a publicly documented API that returned user associations given email or phone number.
- **Microsoft Azure misconfigured storage (routine OSINT finds)** — In 2023, a Microsoft partner's Azure Blob Storage containing 38TB of private AI training data was discovered via OSINT — the URL was embedded in a public GitHub repository. Cloud enumeration + GitHub search is one of the most productive passive OSINT combinations.
- **Ransomware groups use OSINT extensively** — Before attacking a target, groups like LockBit use Shodan to identify internet-exposed RDP (port 3389), VPN appliances with known CVEs, and publicly announced employee layoffs (disgruntled insiders as initial access vectors).

---

## Trade-offs

| OSINT Approach | Information Quality | Effort | Legal Risk | Target Awareness |
|---------------|--------------------|---------|-----------|-----------------| 
| Shodan/Censys search | High (real-time infrastructure) | Low | None | Zero |
| Certificate Transparency | High (subdomains) | Low | None | Zero |
| GitHub search | Very High (credentials) | Medium | None | Zero (can alert) |
| Active DNS enumeration | High | Medium | Low (authorized) | Low |
| Social media OSINT | Medium | High | None | Zero |
| Dark web monitoring | Very High (breach data) | High | Complex | Zero |

---

## Common Pitfalls

1. **OSINT without a goal** — Tool-running without a defined intelligence requirement produces a pile of data, not intelligence. Always start with "what do I need to know and why?"
2. **Attributing GitHub leaks incorrectly** — Just because a repository mentions "mycompany" doesn't mean the credential is current or valid. Validate before concluding.
3. **Active recon without authorization** — Even "light" DNS enumeration queries the target's servers. Without written authorization (pentest scope), this is computer fraud in most jurisdictions.
4. **Missing subdomain takeover** — OSINT finds a subdomain pointing to a decommissioned cloud service (dangling DNS). This is a subdomain takeover vulnerability — check registrability of the target service before reporting.
5. **Over-relying on one source** — Shodan doesn't scan all ports. Censys and GreyNoise provide different perspectives. Use multiple sources for complete coverage.

---

## Related Concepts

- [[Threat_Intelligence_Overview|← Threat Intelligence Overview]] — OSINT is the collection phase of the intel lifecycle
- [[Reconnaissance_and_OSINT|← Pentest Recon]] — offensive OSINT in pentest context
- [[Indicators_of_Compromise|→ IoCs]] — OSINT finds IoCs for defensive use
- [[Threat_Hunting|→ Threat Hunting]] — OSINT-derived IoCs drive hunting hypotheses
- [[_MOC_Threat_Intelligence|↑ Threat Intelligence MOC]]

---

## Review Questions

1. A CISO asks you to assess what an attacker could learn about your organization using only passive OSINT (no packets to your network). Describe a step-by-step methodology using at least 5 different sources, and what critical risk findings each source is likely to reveal.
2. Explain the legal distinction between passive OSINT and active reconnaissance. Give two specific examples of techniques that cross the line from passive to active, and explain the legal risk in your jurisdiction.
3. You find a GitHub repository with the string `AKIA...` (an AWS access key). Describe the steps you would take to: (a) determine if the key is still valid, (b) determine what AWS resources it can access, and (c) responsibly disclose the finding.

---

## Sources

- Shodan: https://www.shodan.io/
- Censys: https://censys.io/
- GreyNoise: https://www.greynoise.io/
- OSINT Framework: https://osintframework.com/
- Certificate Transparency: https://crt.sh/
- trufflehog: https://github.com/trufflesecurity/trufflehog
- SpiderFoot: https://www.spiderfoot.net/

#Cybersecurity #OSINT #Recon #Shodan #Maltego #ThreatIntelligence #PassiveRecon #threat-intelligence
