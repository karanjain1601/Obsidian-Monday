---
title: DAST — Dynamic Application Security Testing
aliases: [Dynamic Analysis, DAST, OWASP ZAP, Burp Suite]
tags: [DevSecOps, Security, DAST, DynamicAnalysis, OWASPZap, BurpSuite, APISecurity]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [SAST_Static_Analysis, SCA_Dependency_Scanning, Security_in_CICD_Pipeline, OWASP_Top_10]
status: complete
---

# DAST — Dynamic Application Security Testing

> [!abstract] TL;DR
> DAST tests a running application from the outside — like an attacker would. It sends crafted payloads to discover vulnerabilities that only manifest at runtime: XSS, injection flaws, authentication bypass, business logic issues. OWASP ZAP is the standard open-source tool for CI/CD integration; Burp Suite is the professional choice for in-depth manual testing.

---

## DAST vs SAST Comparison

| Dimension | SAST | DAST |
|-----------|------|------|
| Tests | Source code | Running application |
| Execution | No app needed | Requires deployed app |
| Best for | Injection patterns, code smells | Runtime behavior, logic flaws |
| False positive rate | Higher (context-unaware) | Lower (actually confirmed exploitable) |
| CI/CD timing | On every commit/PR | On deployed staging environment |
| Language dependent | Yes | No — language agnostic |
| Finds | Code-level vulnerabilities | Runtime and configuration issues |

SAST and DAST are **complementary** — use both.

---

## OWASP ZAP — Open Source DAST

OWASP Zed Attack Proxy (ZAP) is the most widely used open-source DAST tool:

### Scan Modes

**Passive Scan**: observes traffic through the proxy without sending additional requests. Safe to use against production. Detects: missing security headers, information disclosure, insecure cookies.

**Active Scan**: sends attack payloads to test for vulnerabilities. Can cause writes/deletes — only run against non-production (staging).

### ZAP Automation Framework — CI/CD Integration

```yaml
# automation-plan.yml — ZAP automation framework config
env:
  contexts:
    - name: "MyApp Context"
      urls:
        - "https://staging.myapp.com"
      authentication:
        method: "form"
        parameters:
          loginPageUrl: "https://staging.myapp.com/login"
          loginRequestData: "username={%username%}&password={%password%}"
          loginIndicatorRegex: "Logout"
        credentials:
          - username: "zap-test-user"
            password: "${ZAP_TEST_PASSWORD}"

jobs:
  - type: spider
    parameters:
      context: "MyApp Context"
      maxDuration: 5       # minutes
      acceptCookies: true

  - type: activeScan
    parameters:
      context: "MyApp Context"
      maxScanDurationInMins: 30
      policy: "API-Scan-Policy"

  - type: report
    parameters:
      template: "traditional-html"
      reportDir: "/zap/reports"
      reportFile: "zap-report"
```

```yaml
# GitHub Actions — ZAP baseline scan
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.11.0
  with:
    target: 'https://staging.myapp.com'
    rules_file_name: '.zap/rules.tsv'
    cmd_options: '-a'    # include ajax spider

# ZAP API Scan (OpenAPI/Swagger)
- name: ZAP API Scan
  uses: zaproxy/action-api-scan@v0.6.0
  with:
    target: 'https://staging.myapp.com/api/v1/openapi.json'
    format: openapi
    fail_action: true   # fail CI if alerts found
```

### Baseline Scan vs Full Scan

| Mode | Duration | What it finds | Safe for prod? |
|------|----------|---------------|----------------|
| Baseline scan | ~2 min | Passive only — headers, info disclosure | Yes |
| Full scan | 30-120 min | Passive + active — injection, XSS, etc. | No — staging only |
| API scan | ~10 min | API-specific risks (OWASP API Top 10) | No — staging only |

---

## Burp Suite — Professional Proxy

Burp Suite is the industry-standard tool for manual penetration testing and in-depth DAST:

### Key Modules

**Proxy**: intercepts browser/mobile traffic. Configure browser to use `127.0.0.1:8080` as HTTP proxy.

**Scanner**: automated active scanner (Burp Suite Professional). Crawls and attacks the application. More sophisticated than ZAP for detecting complex vulnerabilities.

**Intruder**: fuzzes parameters with custom payload lists:
```
Attack type: Sniper (one parameter at a time)
Payload list: /usr/share/wordlists/rockyou.txt

Example: brute-force login
POST /api/login
{"username": "admin", "password": "§FUZZ§"}
```

**Repeater**: manually craft and re-send requests — essential for confirming a vulnerability.

**Decoder**: encode/decode Base64, URL encoding, HTML entities, hex.

**Collaborator**: out-of-band testing server — detects blind SSRF, blind SQLi, and blind XSS where the response is identical regardless of injection.

### Burp for API Testing

```bash
# Import OpenAPI spec into Burp for targeted API scanning
# Burp → Target → Import from OpenAPI definition
# Then use Active Scanner on the API scope

# Common API attacks to test manually:
# 1. IDOR: change {id} parameter to another user's ID
# 2. Mass assignment: add unexpected fields to JSON body
# 3. Missing auth: remove Authorization header — does the API still respond?
# 4. HTTP verb tampering: try GET instead of POST
```

---

## OWASP API Top 10

API-specific security risks (separate from the Web Top 10):

| Risk | Description | Example |
|------|-------------|---------|
| API1:2023 BOLA | Broken Object Level Authorization (IDOR) | `/api/orders/12345` returns another user's order |
| API2:2023 Auth | Broken Authentication | JWT `alg:none` accepted, no expiry validation |
| API3:2023 BOPLA | Broken Object Property Level Auth | User can modify `isAdmin` field in PATCH request |
| API4:2023 Unrestricted Resource Consumption | No rate limiting | Automated scraping, credential stuffing |
| API5:2023 BFLA | Broken Function Level Authorization | Regular user can call `/api/admin/users` |
| API6:2023 Unrestricted Access to Sensitive Business Flows | Business logic bypass | Skip payment step in checkout flow |
| API7:2023 SSRF | Server-Side Request Forgery | Image URL parameter fetches internal metadata |
| API8:2023 Security Misconfiguration | Debug mode on, stack traces, open CORS | `Access-Control-Allow-Origin: *` |
| API9:2023 Improper Inventory Management | Undocumented/old API versions | `/api/v1/` still active after `/api/v3/` released |
| API10:2023 Unsafe Consumption of APIs | Trusting third-party API responses | Third-party API returns XSS payload, app renders it |

---

## Authenticated DAST

Most application vulnerabilities only appear after login. Configure DAST tools to authenticate:

```python
# ZAP Python client — authenticated DAST
from zapv2 import ZAPv2

zap = ZAPv2(proxies={'http': 'http://127.0.0.1:8080'})

# Authenticate
zap.authentication.set_authentication_method(
    contextid='1',
    authmethodname='formBasedAuthentication',
    authmethodconfigparams='loginUrl=https://staging.myapp.com/login&loginRequestData=username%3D%7B%25username%25%7D%26password%3D%7B%25password%25%7D'
)

# Set logged-in indicator
zap.authentication.set_logged_in_indicator('1', r'\QWelcome, \E')

# Spider authenticated
zap.spider.scan(contextid='1', userid='1', url='https://staging.myapp.com')
```

---

## Headless DAST with Docker

Run ZAP in headless mode in CI without a display:

```bash
# Docker — ZAP baseline scan
docker run --rm \
  -v $(pwd):/zap/wrk:rw \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
  -t https://staging.myapp.com \
  -g gen.conf \
  -r zap-report.html \
  -I  # don't fail on warnings (use -I for non-blocking, remove for blocking)

# ZAP Full Scan
docker run --rm \
  -v $(pwd):/zap/wrk:rw \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py \
  -t https://staging.myapp.com \
  -r zap-full-report.html
```

---

## ZAP Rules Configuration

Customize which alerts cause failures:

```tsv
# .zap/rules.tsv — configure alert actions
# Format: AlertID  Action (IGNORE/WARN/FAIL)
10038	IGNORE  # Content Security Policy header — handled by framework
10021	IGNORE  # X-Content-Type-Options — set globally in load balancer
40012	FAIL    # Cross Site Scripting — always fail
40018	FAIL    # SQL Injection — always fail
90022	WARN    # Application Error Disclosure — warning only
```

---

## Common Pitfalls

- **Running DAST against production**: active scan sends attack payloads — it WILL cause unintended writes, errors, or data corruption. Always use a dedicated staging environment
- **Not authenticating DAST**: unauthenticated scans miss the majority of application functionality — most vulnerabilities are behind login
- **Ignoring false positives instead of configuring suppressions**: unreviewed DAST reports lose developer trust quickly
- **No scope limitation**: without defining the target scope, ZAP may follow links to third-party sites and attack them
- **Single scan modality**: passive scans are safe but find little; full scans find more but take time. Match scan depth to risk tolerance and pipeline stage

---

## Review Questions

1. What is the fundamental difference between SAST and DAST, and why do you need both?
2. Explain the difference between ZAP's baseline scan and full scan. When would you use each?
3. What is BOLA (API1:2023) and how would you test for it manually with Burp Suite?
4. Why must authenticated DAST run against staging, not production?
5. How does Burp Collaborator help detect blind injection vulnerabilities?

---

#DevSecOps #DAST #DynamicAnalysis #OWASPZap #BurpSuite #APISecurity #Security
