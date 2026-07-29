---
title: Threat Modeling
aliases: [STRIDE, PASTA Methodology, Attack Trees]
tags: [DevSecOps, Security, ThreatModeling, STRIDE, PASTA]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [DevSecOps_Overview, OWASP_Top_10, Secure_Coding_Practices]
status: complete
---

# Threat Modeling

> [!abstract] TL;DR
> Threat modeling is a structured process to identify, enumerate, and prioritize threats to a system before they can be exploited. Done at design time, it's the highest-ROI security activity — fixing a design flaw here costs a fraction of fixing it post-production. STRIDE categorizes threat types; PASTA adds attacker perspective; DFDs visualize data flows and trust boundaries.

---

## Why Threat Model?

A threat model answers four questions:
1. **What are we building?** — system diagram, components, data stores
2. **What can go wrong?** — enumerate threats per component
3. **What are we going to do about it?** — mitigations for each threat
4. **Did we do a good enough job?** — review and sign-off

Without threat modeling, security reviews are reactive (penetration tests find what's already in production). Threat modeling makes security **proactive and systematic**.

---

## STRIDE — Threat Categories

Developed by Microsoft, STRIDE assigns a threat category to each type of attack:

| Category | What it means | Example | Property violated |
|----------|---------------|---------|-------------------|
| **S**poofing | Impersonating another entity | Forged JWT, ARP spoofing | Authentication |
| **T**ampering | Modifying data/code | SQL injection, man-in-the-middle modifying HTTP body | Integrity |
| **R**epudiation | Denying an action occurred | User claims "I never made that API call" | Non-repudiation |
| **I**nformation Disclosure | Exposing sensitive data | Verbose error messages, S3 bucket listing | Confidentiality |
| **D**enial of Service | Making a service unavailable | DDoS, resource exhaustion via crafted input | Availability |
| **E**levation of Privilege | Gaining unauthorized access | Exploiting `sudo` misconfiguration, JWT `alg:none` | Authorization |

### Applying STRIDE to a Component

For a REST API endpoint `POST /transfer`:
- **S**: Is the caller authenticated? (JWT/OAuth)
- **T**: Is the request body validated? Is the wire encrypted (TLS)?
- **R**: Are transfers logged with user ID, timestamp, amount?
- **I**: Does the error response leak account details?
- **D**: Is the endpoint rate-limited?
- **E**: Can a regular user transfer from another user's account (IDOR)?

---

## PASTA — Process for Attack Simulation and Threat Analysis

PASTA is a risk-centric, 7-stage methodology that incorporates attacker perspective:

```
Stage 1: Define Objectives       — business impact, security objectives
Stage 2: Define Technical Scope  — architecture, tech stack, dependencies
Stage 3: Application Decomposition — DFDs, entry points, assets, trust levels
Stage 4: Threat Analysis         — threat intelligence, attack patterns (CAPEC)
Stage 5: Vulnerability Analysis  — link threats to existing vulnerabilities
Stage 6: Attack Modeling         — attack trees, exploit scenarios
Stage 7: Risk/Impact Analysis    — CVSS scoring, risk ranking, mitigations
```

PASTA is more thorough than STRIDE but takes longer — best for high-risk systems (payment processing, authentication).

---

## Data Flow Diagrams (DFDs)

DFDs are the primary artifact of threat modeling. They show:
- **Processes** (circles/rounded boxes): code that transforms data
- **Data stores** (parallel lines): databases, files, caches
- **External entities** (rectangles): users, third-party services
- **Data flows** (arrows): data moving between components
- **Trust boundaries** (dashed lines): where privilege/trust changes

```
[User Browser] ──HTTPS──> [Load Balancer] ──HTTP──> [API Service]
                                                         |
                                    ┌────────────────────┤
                                    |                    |
                              [PostgreSQL DB]      [Redis Cache]
                              (trust boundary)
```

**Trust boundary rule**: every data flow crossing a trust boundary should have a STRIDE threat associated with it.

### DFD Trust Boundary Checklist
- [ ] Internet → DMZ boundary (Spoofing, Tampering, DoS)
- [ ] DMZ → Internal network boundary (Elevation of Privilege)
- [ ] Application → Database boundary (Injection, Information Disclosure)
- [ ] Service → External API boundary (Spoofing, Information Disclosure)

---

## OWASP Threat Dragon

Open-source threat modeling tool by OWASP:

```bash
# Run Threat Dragon locally via Docker
docker run -it --rm \
  -p 3000:3000 \
  -e NODE_ENV=development \
  owasp/threat-dragon:latest

# Access at http://localhost:3000
# Create new threat model → add DFD → annotate with STRIDE threats
```

Threat Dragon stores models as JSON files — commit them to the repo alongside architecture docs.

---

## Microsoft Threat Modeling Tool

Free desktop tool (Windows) that auto-generates STRIDE threats from a DFD drawn in the tool. Useful for teams new to threat modeling — it reduces the cognitive load of remembering all threat categories.

Workflow:
1. Draw the DFD using the built-in stencils
2. Click "Analyze" → threats are auto-generated per component
3. Review each threat: mark as Mitigated, Not Applicable, or Needs Investigation
4. Export to Word/PDF for the security review record

---

## When to Threat Model

| Trigger | Detail |
|---------|--------|
| New service | Before writing any code |
| New external integration | Before the API contract is finalized |
| Auth system changes | Before implementation starts |
| Significant new features | At design/RFC stage |
| Architecture review | Annually for existing critical services |
| After a security incident | To find root cause and related threats |

**Sprint integration**: 2-hour threat modeling session in the sprint planning for any story touching authentication, data access, or new integrations.

---

## Attack Trees

Attack trees decompose a top-level attacker goal into sub-goals:

```
Goal: Steal user credentials
├── AND: Bypass authentication
│   ├── OR: Brute force password
│   ├── OR: Exploit password reset flow
│   └── OR: Session hijacking (stolen JWT)
└── AND: Database exfiltration
    ├── OR: SQL injection → dump users table
    └── OR: Compromised admin account
```

AND nodes mean all children must succeed; OR nodes mean any one child succeeds. Attack trees help prioritize mitigations (break the node with the highest impact and lowest attacker effort first).

---

## DREAD Scoring — Threat Prioritization

DREAD gives each threat a score to prioritize the order of mitigations:

| Factor | Question | Score (1–3) |
|--------|----------|-------------|
| **D**amage | How bad is the damage if exploited? | 1=low, 3=critical |
| **R**eproducibility | How easily can it be reproduced? | 1=hard, 3=trivial |
| **E**xploitability | How much skill does the attacker need? | 1=expert, 3=script kiddie |
| **A**ffected Users | How many users are impacted? | 1=few, 3=all |
| **D**iscoverability | How easy is it to find the vulnerability? | 1=obscure, 3=obvious |

`Risk Score = (D + R + E + A + D) / 5`

Scores ≥ 2.5 → fix immediately; 1.5–2.5 → fix in next sprint; < 1.5 → track as tech debt.

---

## Common Pitfalls

- **DFD at wrong level of detail**: too high misses threats, too low wastes time. Level 2 DFD (showing major services and databases) is usually the right granularity
- **No trust boundaries marked**: without trust boundaries, STRIDE analysis misses boundary-crossing threats
- **Threat model as a one-time activity**: it must be a living document updated when the architecture changes
- **Security team runs it alone**: threat modeling requires the developer who built it — they know the edge cases

---

## Review Questions

1. List the six STRIDE threat categories and the security property each violates.
2. Draw a simple DFD for a "user login" flow and identify two trust boundaries.
3. What does a DREAD score of 2.8 for a threat imply about prioritization?
4. How does PASTA differ from STRIDE in its approach to threat analysis?
5. At what SDLC stage should threat modeling occur for a new microservice?

---

#DevSecOps #ThreatModeling #STRIDE #PASTA #Security
