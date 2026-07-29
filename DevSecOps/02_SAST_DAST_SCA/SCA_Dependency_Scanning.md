---
title: SCA — Software Composition Analysis
aliases: [Dependency Scanning, SCA, Snyk, Dependabot, SBOM, CycloneDX]
tags: [DevSecOps, Security, SCA, Dependencies, SBOM, Snyk, Dependabot, OpenSource]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [SAST_Static_Analysis, Container_and_IaC_Security, Supply_Chain_Security, Security_in_CICD_Pipeline]
status: complete
---

# SCA — Software Composition Analysis

> [!abstract] TL;DR
> Modern applications are 80-90% open-source dependencies. SCA scans those dependencies against vulnerability databases (CVE/NVD) to identify known vulnerabilities, tracks license compliance, and generates Software Bill of Materials (SBOM). Tools like Snyk, Dependabot, and OWASP Dependency-Check automate this across the entire dependency tree — including transitive dependencies.

---

## Why SCA Matters

**The scale problem**:
- A typical Node.js app has ~900 transitive dependencies
- A Java Spring Boot app has ~150+ Maven dependencies
- Each dependency is a potential attack vector

**Real-world impact**:
- **Log4Shell (CVE-2021-44228)**: CVSS 10.0 RCE in Log4j 2.x — used by thousands of Java applications. Disclosed Dec 2021, widely exploited within 72 hours
- **event-stream (2018)**: malicious code injected into a popular npm package — downloaded 2M times/week
- **colors.js (2022)**: maintainer deliberately broke their own package with infinite loop — ~22M weekly downloads affected

---

## CVE and CVSS

**CVE (Common Vulnerabilities and Exposures)**: unique identifier for publicly known vulnerabilities (e.g., `CVE-2021-44228`).

**NVD (National Vulnerability Database)**: NIST database enriching CVEs with CVSS scores, affected versions, and fix versions.

**CVSS v3.1 Score Components**:
```
Base Score = f(Attack Vector, Attack Complexity, Privileges Required,
               User Interaction, Scope, Confidentiality, Integrity, Availability)

Score range: 0.0 – 10.0
None: 0.0
Low: 0.1–3.9
Medium: 4.0–6.9
High: 7.0–8.9
Critical: 9.0–10.0
```

**CI/CD gate policy**: fail build on CVSS ≥ 7.0 (High+); warn on CVSS 4.0–6.9 (Medium).

---

## Tool Landscape

### Dependabot / GitHub Security Alerts

Built into GitHub, zero configuration required:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      production-dependencies:
        dependency-type: "production"
    ignore:
      - dependency-name: "legacy-lib"
        versions: ["1.x"]  # temporarily ignore

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "daily"
```

Dependabot also creates **security PRs** automatically for vulnerabilities — no manual tracking needed.

### Snyk

More powerful than Dependabot — supports 50+ languages, provides fix recommendations, and integrates with CI:

```bash
# Install Snyk CLI
npm install -g snyk
snyk auth

# Test dependencies
snyk test                             # test current directory
snyk test --severity-threshold=high  # fail on high/critical only
snyk test --json > snyk-results.json

# Monitor project (track over time)
snyk monitor --project-name=my-app

# Fix automatically (opens PRs)
snyk fix
```

```yaml
# GitHub Actions — Snyk SCA
- name: Snyk Dependency Scan
  uses: snyk/actions/node@master
  continue-on-error: false
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high --sarif-file-output=snyk.sarif

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: snyk.sarif
```

### OWASP Dependency-Check

Free, open-source, supports Java/Python/.NET/Node:

```bash
# Download and run
dependency-check.sh \
  --project "MyApp" \
  --scan ./target/ \
  --format JSON \
  --out ./dependency-check-report/ \
  --failOnCVSS 7     # fail on CVSS >= 7.0

# Maven plugin
mvn org.owasp:dependency-check-maven:check \
  -DfailBuildOnCVSS=7 \
  -Dformat=JSON
```

### Trivy — Container + Dependencies

Trivy scans OS packages AND application dependencies inside container images:

```bash
# Scan a container image for vulnerabilities
trivy image myapp:latest

# Scan with SARIF output
trivy image --format sarif --output trivy-results.sarif myapp:latest

# Scan a filesystem / local project
trivy fs --security-checks vuln,secret .

# Only report critical and high
trivy image --severity CRITICAL,HIGH myapp:latest

# Exit code 1 if CRITICAL found
trivy image --exit-code 1 --severity CRITICAL myapp:latest
```

---

## License Compliance Scanning

Open-source licenses have obligations. Using GPL-licensed code in a proprietary product may require open-sourcing your code:

| License | Copyleft | Commercial use | Distribution requirement |
|---------|----------|----------------|--------------------------|
| MIT | No | Permitted | Include copyright notice |
| Apache 2.0 | No | Permitted | Include copyright + NOTICE |
| GPL v2/v3 | Strong | Permitted with conditions | Must open-source derivative |
| LGPL | Weak | Permitted | Linking allowed; modifications must be open |
| AGPL | Network copyleft | Risky | SaaS usage requires open-sourcing |
| BUSL | Source available | Restricted | Commercial use may require license |

```bash
# Snyk license compliance
snyk test --json | jq '.vulnerabilities[] | select(.type == "license")'

# FOSSA — dedicated license compliance tool
fossa analyze
fossa test --timeout 300
```

---

## SBOM — Software Bill of Materials

An SBOM is a formal, machine-readable list of all software components in an application:

**Why it matters**:
- Rapid vulnerability response (Log4Shell: who uses Log4j? Check the SBOM)
- Executive Order 14028 (US federal software supply chain security) mandates SBOMs
- Enables automated vulnerability tracking across the entire portfolio

**Formats**:
- **CycloneDX** (OWASP) — preferred for security use cases
- **SPDX** (Linux Foundation) — preferred for license compliance

```bash
# Generate CycloneDX SBOM with Syft
syft packages myapp:latest -o cyclonedx-json=sbom.json

# Generate SPDX SBOM
syft packages myapp:latest -o spdx-json=sbom.spdx.json

# Scan SBOM for vulnerabilities with Grype
grype sbom:./sbom.json

# Maven CycloneDX plugin
mvn org.cyclonedx:cyclonedx-maven-plugin:makeBom
# Generates: target/bom.xml or target/bom.json
```

```yaml
# SBOM generation in GitHub Actions
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    image: myapp:latest
    format: cyclonedx-json
    output-file: sbom.cyclonedx.json

- name: Scan SBOM for vulnerabilities
  uses: anchore/scan-action@v3
  with:
    sbom: sbom.cyclonedx.json
    fail-build: true
    severity-cutoff: critical
```

---

## Transitive Dependency Risks

Transitive (indirect) dependencies are the most dangerous:

```
Your app → express@4.18.2
              └── qs@6.11.0         (direct dependency of express)
                    └── vulnerable-lib@1.2.3  ← transitive, 3 levels deep
```

You didn't choose `vulnerable-lib` — but it's in your app. SCA tools track the full dependency tree.

**Lock files are critical**: `package-lock.json`, `yarn.lock`, `Pipfile.lock`, `go.sum` pin exact transitive versions. Commit them to git and scan them.

```bash
# Check if lock file and package.json are in sync
npm ci --dry-run  # fails if out of sync

# Audit using lock file (more accurate than package.json)
npm audit --audit-level=high
```

---

## Automated PRs for Dependency Updates

Configure Dependabot or Renovate to auto-create update PRs:

```json
// renovate.json — Renovate Bot configuration
{
  "extends": ["config:base"],
  "vulnerabilityAlerts": {
    "enabled": true,
    "automerge": true,         // auto-merge security patches
    "labels": ["security"]
  },
  "packageRules": [{
    "matchUpdateTypes": ["patch"],
    "automerge": true          // auto-merge patch updates
  }]
}
```

---

## Common Pitfalls

- **Scanning only direct dependencies**: transitive vulnerabilities are the majority of real-world exposures — always scan the full tree (using lock files)
- **No lock file**: without a lock file, dependency versions are non-deterministic — scans may give different results in CI vs production
- **Ignoring medium-severity findings indefinitely**: medium vulnerabilities accumulate; set a maximum age policy (e.g., fix medium findings within 90 days)
- **SBOM as a one-time artifact**: SBOMs must be regenerated on every build — the dependency graph changes continuously

---

## Review Questions

1. What is the difference between a direct and transitive dependency? Why do transitive dependencies matter for security?
2. What does CVSS measure, and at what score would you fail a CI build?
3. Describe two SBOM formats and when you would choose each.
4. Why do lock files improve the accuracy of SCA scans?
5. An AGPL-licensed library is used in your proprietary SaaS application. What is the potential legal risk?

---

#DevSecOps #SCA #DependencyScanning #SBOM #CVE #Snyk #Dependabot #OpenSource #Security
