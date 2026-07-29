---
title: OWASP Top 10
aliases: [OWASP Top Ten, Web Application Security Risks]
tags: [DevSecOps, Security, OWASP, WebSecurity, Vulnerabilities]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [Secure_Coding_Practices, Threat_Modeling, SAST_Static_Analysis, DAST_Dynamic_Analysis]
status: complete
---

# OWASP Top 10

> [!abstract] TL;DR
> The OWASP Top 10 (2021 edition) is the de facto standard list of the most critical web application security risks. Every developer should understand all 10 categories — their attack vectors, example exploits, and prevention techniques. SAST tools and DAST tools map their findings to OWASP categories.

---

## A01 — Broken Access Control (was A05 in 2017)

**What**: Users can act outside their intended permissions — accessing other users' data, admin functionality, or modifying someone else's records.

**Example attack**:
```
# IDOR (Insecure Direct Object Reference)
GET /api/account/12345/statements      # logged in as user 12345
GET /api/account/99999/statements      # user 12345 accessing user 99999's data
# If the server only checks authentication (are you logged in?) but not
# authorization (are you user 99999?), the attack succeeds
```

**Prevention**:
- Deny by default; only grant permissions explicitly
- Enforce access control server-side, never rely on client-side hiding
- Log access control failures and alert on high rates
- Implement unit tests for access control logic

---

## A02 — Cryptographic Failures (was A03 Sensitive Data Exposure)

**What**: Sensitive data transmitted or stored without adequate encryption, or using weak/broken algorithms.

**Example attack**:
- Database storing MD5-hashed passwords → offline dictionary attack cracks in seconds
- HTTP (not HTTPS) transmitting session tokens → network sniffing captures credentials

**Prevention**:
- Classify data by sensitivity and encrypt sensitive data at rest (AES-256-GCM)
- Use TLS 1.2+ for all data in transit; enforce HSTS
- Use strong password hashing: `bcrypt` (cost ≥ 12), `Argon2id`, or `scrypt` — never MD5/SHA1 for passwords
- Never store unnecessary sensitive data (data minimization)

```python
# Wrong — bcrypt with too-low cost factor
bcrypt.hashpw(password, bcrypt.gensalt(rounds=4))

# Correct — cost factor of 12+
bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))
```

---

## A03 — Injection (SQL, NoSQL, Command, LDAP)

**What**: Untrusted data is sent to an interpreter as part of a command or query, causing unintended execution.

**Example attack**:
```python
# SQL Injection — vulnerable
query = f"SELECT * FROM users WHERE username = '{username}'"
# Input: ' OR '1'='1 -- 
# Resulting query: SELECT * FROM users WHERE username = '' OR '1'='1' --'
# Returns all users

# Command Injection — vulnerable  
import os
os.system(f"convert {filename} output.pdf")
# Input: image.jpg; rm -rf /
```

**Prevention**:
```python
# Parameterized query — prevents SQL injection
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))

# Use ORM — SQLAlchemy
user = session.query(User).filter_by(username=username).first()

# Command injection — use list form, avoid shell=True
import subprocess
subprocess.run(["convert", filename, "output.pdf"], shell=False)
```

---

## A04 — Insecure Design

**What**: Missing or ineffective security controls at the design level — security flaws baked into the architecture, not implementation bugs.

**Example**: A password reset flow that sends a 4-digit numeric OTP with no rate limiting → brute-forceable in 10,000 attempts.

**Prevention**:
- Threat modeling at design phase (see [[Threat_Modeling]])
- Use secure design patterns: principle of least privilege, defense in depth
- Establish a library of secure design patterns for common use cases (authentication, session management, input handling)
- Require security design review before implementation of new features

---

## A05 — Security Misconfiguration

**What**: Missing security hardening, unnecessary features enabled, default credentials, verbose error messages, missing security headers.

**Example attack**:
- AWS S3 bucket with public-read ACL → data exfiltration
- Spring Boot Actuator `/actuator/env` exposed publicly → environment variables leaked

**Prevention**:
```yaml
# Security headers in Nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header Content-Security-Policy "default-src 'self'; script-src 'self'";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

Use IaC scanning (Checkov) to detect misconfigurations before deployment.

---

## A06 — Vulnerable and Outdated Components

**What**: Using libraries, frameworks, or runtime components with known vulnerabilities.

**Example**: Log4Shell (CVE-2021-44228) — a critical RCE in Log4j 2.x used by millions of Java applications. Exploitable with a single crafted log message.

**Prevention**:
- Software Composition Analysis (SCA) in CI — see [[SCA_Dependency_Scanning]]
- Subscribe to CVE feeds for your tech stack
- Enable Dependabot / Snyk auto-PRs for dependency updates
- Maintain an SBOM (Software Bill of Materials)
- Remove unused dependencies

---

## A07 — Identification and Authentication Failures (was A02)

**What**: Weaknesses in authentication or session management — credential stuffing, brute force, weak passwords, session fixation.

**Example attack**:
- Login endpoint without rate limiting → credential stuffing attack tries 1M breached username/password pairs

**Prevention**:
```python
# Rate limiting with Flask-Limiter
from flask_limiter import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.route("/login", methods=["POST"])
@limiter.limit("5/minute")
def login():
    ...
```
- Implement MFA for all privileged accounts
- Use secure session management: random session IDs (≥128 bits), expire sessions
- Check passwords against breached credential lists (HaveIBeenPwned API)

---

## A08 — Software and Data Integrity Failures

**What**: Code or data that is assumed to be trusted without integrity verification — insecure deserialization, CI/CD pipeline compromise, auto-update without signature verification.

**Example attack**: 
- SolarWinds attack: malicious code injected into the build pipeline → signed and distributed as a legitimate update

**Prevention**:
- Sign artifacts (Sigstore/cosign for container images) — see [[Supply_Chain_Security]]
- Verify signatures before deployment
- Use pinned action SHA hashes in GitHub Actions (`uses: actions/checkout@abc123sha`)
- Implement deserialization safeguards (JSON instead of Java serialization)

---

## A09 — Security Logging and Monitoring Failures

**What**: Insufficient logging means attacks go undetected; without monitoring, breaches persist for months.

**Fact**: The average dwell time (time from breach to detection) was 207 days in 2023.

**What to log**:
- All authentication events (success AND failure, with user ID, IP, timestamp)
- All authorization failures
- All admin/privileged actions
- Input validation failures (potential probing activity)
- Application errors and exceptions

**Prevention**:
```json
// Structured JSON log format — easy to ingest into SIEM
{
  "timestamp": "2026-07-29T10:23:45Z",
  "level": "WARN",
  "event": "auth.failure",
  "user_id": "user-123",
  "ip": "1.2.3.4",
  "endpoint": "/api/login",
  "reason": "invalid_password",
  "attempt_count": 4
}
```

See [[Security_Logging_and_SIEM]] for SIEM integration.

---

## A10 — Server-Side Request Forgery (SSRF)

**What**: The server makes HTTP requests to an attacker-controlled URL — can reach internal services, cloud metadata APIs, or exfiltrate data.

**Example attack**:
```
# Attacker submits this URL to an image-upload feature:
POST /api/upload-image
{ "url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name" }

# Server fetches the AWS metadata endpoint internally and returns:
# { "AccessKeyId": "...", "SecretAccessKey": "...", "Token": "..." }
```

**Prevention**:
- Validate and allowlist URL schemas and domains before making server-side requests
- Disable HTTP redirects in the HTTP client library
- Use network segmentation — app servers should not reach internal APIs directly
- Block requests to private IP ranges (10.x.x.x, 172.16.x.x, 192.168.x.x, 169.254.x.x)

```python
import ipaddress, urllib.parse

SSRF_BLOCKED_RANGES = [
    ipaddress.ip_network("169.254.0.0/16"),  # link-local / AWS metadata
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
]

def is_ssrf_safe(url: str) -> bool:
    host = urllib.parse.urlparse(url).hostname
    try:
        ip = ipaddress.ip_address(host)
        return not any(ip in net for net in SSRF_BLOCKED_RANGES)
    except ValueError:
        return True  # hostname, not IP — resolve and check separately
```

---

## Common Pitfalls

- **Treating OWASP Top 10 as a checklist**: it's a risk-awareness guide, not a complete security standard. Use it as a starting point, not the finish line
- **Only testing for Top 10**: many real vulnerabilities fall outside these categories (business logic flaws, race conditions)
- **Conflating A01 and A07**: A01 is *authorization* (what you can do); A07 is *authentication* (who you are)
- **Ignoring A04 Insecure Design**: often overlooked because it requires fixing the architecture, not just adding a check

---

## Review Questions

1. What is the difference between A01 (Broken Access Control) and A07 (Authentication Failures)?
2. A login endpoint is vulnerable to credential stuffing. Which OWASP category does this fall under, and what three technical controls prevent it?
3. Explain how Log4Shell maps to A06 and what the mitigation is.
4. Write a parameterized query example in your language of choice to prevent A03 SQL injection.
5. What should every authentication event log record contain (A09)?

---

#DevSecOps #OWASP #WebSecurity #Injection #AccessControl #Security
