---
title: DevSecOps Overview
aliases: [DevSecOps Introduction, Shift Left Security]
tags: [DevSecOps, Security, DevOps, Foundations]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [Threat_Modeling, OWASP_Top_10, Secure_Coding_Practices, Zero_Trust_Architecture]
status: complete
---

# DevSecOps Overview

> [!abstract] TL;DR
> DevSecOps embeds security into every stage of the software delivery lifecycle — shifting it left from "test before release" to "design and code securely from day one." Security becomes a shared responsibility owned by Dev, Sec, and Ops together, enforced by automation rather than gate-keeping reviews.

---

## Shift Left Security Philosophy

Traditional security sits at the end of the pipeline: developers build, testers verify, then security does a final review before release. This creates:
- **Expensive rework** — fixing a design flaw discovered in production costs ~30× more than catching it in design
- **Security as a blocker** — security teams become the "department of No"
- **Slow feedback loops** — developers don't learn from their mistakes in real time

**Shift left** moves security activities earlier:

```
Traditional:  Dev → Build → Test → [SECURITY] → Deploy → Operate
DevSecOps:    [SEC]Dev → [SEC]Build → [SEC]Test → Deploy → [SEC]Operate
```

Every phase has automated security checks. Developers get instant feedback in their IDE and on every PR.

---

## DevSecOps vs DevOps vs Traditional Security

| Dimension | Traditional Security | DevOps (no Sec) | DevSecOps |
|-----------|----------------------|-----------------|-----------|
| When security runs | Release gate | Rarely | Every commit |
| Who owns security | Security team | N/A | Everyone |
| Tools | Manual scans, pen tests | None | SAST, DAST, SCA, IaC scanning |
| Compliance | Manual audits | Manual audits | Automated compliance-as-code |
| Speed impact | Slows releases | Fast but risky | Fast AND secure |

---

## The Three Pillars

### People
- **Security champions** — embed a security-focused engineer in each squad. They act as liaison to the central security team, run threat modeling sessions, and review security-relevant PRs.
- Training cadence: developers complete OWASP Top 10 training quarterly; new hires complete it during onboarding.
- Blameless post-mortems for security incidents — learning culture over blame culture.

### Process
- **SDLC security gates**: threat model at architecture design, SAST/SCA in PR checks, DAST against staging, pen test before major releases.
- **Security stories in backlog**: security requirements tracked as first-class user stories, not as a separate register.
- Compliance automation woven into pipeline (see [[Compliance_Automation]]).

### Tools
Automated, integrated, minimal friction:
- Pre-commit: secrets scanning (gitleaks), linting (semgrep rules)
- PR / CI: SAST (Semgrep/SonarQube), SCA (Snyk/Dependabot), container scanning (Trivy)
- Staging: DAST (OWASP ZAP), IaC scanning (Checkov)
- Production: Runtime security (Falco), SIEM (Splunk/Elastic)

---

## Security as Code

Every security control is expressed as code, versioned in git, and peer-reviewed:

```yaml
# .github/workflows/security.yml — example security gate
name: Security Pipeline
on: [pull_request]
jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten
          auditOn: push

  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Snyk SCA
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Gitleaks secrets scan
        uses: gitleaks/gitleaks-action@v2
```

---

## OWASP DevSecOps Guidelines

OWASP's DevSecOps Guideline (v0.2) recommends:
1. **Design phase**: threat modeling for all new features/services
2. **Development**: IDE security plugins, secure coding standards
3. **Build**: SAST integrated into CI, fail build on critical/high severity
4. **Test**: DAST on staging environment, API security testing
5. **Deploy**: IaC security scanning, container image scanning
6. **Operate**: runtime monitoring, SIEM alerting, vulnerability management

---

## Compliance Automation in CI/CD

Rather than point-in-time audits, encode compliance requirements as automated checks:

| Standard | Automated Control Example |
|----------|--------------------------|
| PCI-DSS 6.3.1 | SAST scan on all payment-handling code in CI |
| PCI-DSS 6.5 | SCA for known vulnerable components (CVSS ≥ 4.0) |
| SOC2 CC6.1 | Least-privilege IAM policy checks via OPA/Conftest |
| SOC2 CC7.1 | Automated vulnerability scanning evidence in audit trail |
| HIPAA §164.312(a) | Encryption-at-rest checks in Terraform (Checkov) |
| HIPAA §164.312(e) | TLS configuration validation in pipeline |

```bash
# Checkov check for PCI-DSS compliance on Terraform
checkov -d . --framework terraform \
  --check CKV_AWS_19,CKV_AWS_20,CKV_AWS_57 \
  --output json > checkov-results.json
```

---

## Threat Modeling in SDLC Security Gates

Threat modeling sessions are triggered at:
- New service or component design
- Significant new features (auth changes, new data stores, external integrations)
- Architecture reviews

See [[Threat_Modeling]] for STRIDE, PASTA, and tooling.

---

## Security Champions Program

A security champion is a developer (not a security engineer) who:
- Attends monthly security champions meetings
- Runs threat model sessions for their squad
- Reviews security-relevant PRs
- Triages SAST/SCA findings for their service
- Tracks security debt on the team backlog

**Ratio**: 1 champion per 10 developers is a common starting point.

---

## Common Pitfalls

- **Tool sprawl without process**: adding 8 security scanners without defining who owns findings creates alert fatigue
- **Blocking builds on every finding**: start with "warn only," graduate to "block on critical/high" once false-positive rates are tuned
- **Security as a separate team deliverable**: security stories must be in the same sprint, not a separate security sprint
- **Ignoring developer experience**: clunky tools with high false-positive rates will be disabled or ignored

---

## Review Questions

1. What does "shift left" mean in the context of DevSecOps, and why does it reduce cost?
2. Name the three pillars of DevSecOps and give one concrete example of each.
3. How does compliance-as-code differ from traditional point-in-time audits?
4. What is a security champion and what are their responsibilities?
5. At which SDLC gates would you run SAST vs DAST, and why?

---

#DevSecOps #Security #ShiftLeft #OWASP #Compliance
