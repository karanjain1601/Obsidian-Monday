---
title: Secure Coding Practices
aliases: [Secure Development, Defensive Programming, Security Headers]
tags: [DevSecOps, Security, SecureCoding, InputValidation, SecretsManagement]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [OWASP_Top_10, Threat_Modeling, SAST_Static_Analysis, Secrets_Management]
status: complete
---

# Secure Coding Practices

> [!abstract] TL;DR
> Secure coding is the practice of writing software that is resistant to attack by default — validating all inputs, encoding all outputs, applying least privilege, handling failures safely, and never storing secrets in code. These practices prevent the majority of OWASP Top 10 vulnerabilities before any security tool is run.

---

## Input Validation — Allowlists over Denylists

**Denylist** (blocklist): reject known bad input (e.g., block `<script>`). Easily bypassed with encoding variations (`<ScRiPt>`, `%3Cscript%3E`).

**Allowlist** (whitelist): only accept known-good input. Far more robust.

```python
import re

# Allowlist validation — username must be alphanumeric + underscore, 3-32 chars
USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_]{3,32}$')

def validate_username(username: str) -> str:
    if not USERNAME_PATTERN.match(username):
        raise ValueError("Invalid username format")
    return username

# Numeric validation — never trust client-supplied IDs
def validate_positive_int(value: str) -> int:
    try:
        n = int(value)
        if n <= 0:
            raise ValueError()
        return n
    except (ValueError, TypeError):
        raise ValueError(f"Expected positive integer, got: {value!r}")
```

**Validation rules**:
- Validate **type** (is it a string? integer? UUID?)
- Validate **length** (minimum and maximum bounds)
- Validate **format** (regex, enum, date format)
- Validate **range** (numeric bounds, date bounds)
- Validate **encoding** (reject unexpected Unicode control characters)

---

## Parameterized Queries — Preventing SQL Injection

Never build SQL queries with string concatenation:

```java
// WRONG — SQL injection vulnerability
String query = "SELECT * FROM accounts WHERE user_id = " + userId;

// CORRECT — parameterized prepared statement (Java JDBC)
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM accounts WHERE user_id = ?"
);
stmt.setLong(1, userId);
ResultSet rs = stmt.executeQuery();
```

```python
# WRONG — SQLite injection
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# CORRECT — parameterized (Python DB-API)
cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
```

**ORM note**: ORMs (Hibernate, SQLAlchemy) are parameterized by default, but raw query methods (`session.execute(text("..."))`) must still be parameterized.

---

## Output Encoding

Prevent Cross-Site Scripting (XSS) by encoding output for the context it is rendered in:

| Context | Encoding method | Example |
|---------|-----------------|---------|
| HTML body | HTML entity encoding | `<` → `&lt;` |
| HTML attribute | Attribute encoding | `"` → `&quot;` |
| JavaScript | JavaScript string escaping | `'` → `\'` |
| URL parameter | URL encoding | `<` → `%3C` |
| CSS | CSS escaping | `<` → `\3C` |

```python
# Python — html.escape() for HTML context
import html
safe_name = html.escape(user_supplied_name)

# Jinja2 — auto-escaping enabled (the default)
# Never use |safe unless you control the content absolutely
{{ user.bio }}       # safe — auto-escaped
{{ user.bio|safe }}  # DANGER — disables escaping
```

Use a framework's templating engine with auto-escaping enabled. Never concatenate HTML strings manually.

---

## Principle of Least Privilege

Grant only the minimum permissions required:

```yaml
# Kubernetes Pod with least-privilege ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-service
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: api-service-role
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get"]          # read-only, only configmaps
---
# AWS IAM — least privilege for Lambda
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],       # only read, not write/delete
    "Resource": "arn:aws:s3:::my-bucket/uploads/*"  # specific prefix, not *
  }]
}
```

**Code-level least privilege**:
- Database accounts: read-only accounts for read-only queries; separate write account for mutations
- Process users: don't run web servers as root; use a dedicated non-root OS user
- File permissions: don't make config files world-readable if they contain credentials

---

## Defense in Depth

Multiple security layers so that bypassing one control doesn't compromise the system:

```
Layer 1: Network — firewall, WAF, DDoS protection
Layer 2: Application — input validation, authentication, authorization
Layer 3: Data — encryption at rest, parameterized queries, field-level encryption
Layer 4: Monitoring — SIEM alerts, anomaly detection
```

If an attacker bypasses the WAF (Layer 1), they still face parameterized queries (Layer 2) and encrypted data (Layer 3).

---

## Secure Defaults

Software should be secure by default — users should have to opt out of security, not opt in:

- Default to HTTPS, not HTTP
- Default to strict CORS policy (same-origin only), not open CORS
- Default to authentication required, not public endpoints
- Default to minimum permissions on new accounts, not admin
- Default to encrypted storage, not plaintext

```java
// Spring Security — secure defaults
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()  // secure by default
            )
            .sessionManagement(s -> s
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(h -> h
                .contentSecurityPolicy(c -> c.policyDirectives("default-src 'self'"))
                .frameOptions(f -> f.deny()))
            .build();
    }
}
```

---

## Fail Securely

When errors occur, fail to a secure state — not an open state:

```python
# WRONG — fail open (grants access on error)
def check_permission(user_id, resource_id):
    try:
        return db.query_permission(user_id, resource_id)
    except DatabaseError:
        return True  # Error? Just allow it...

# CORRECT — fail closed (denies access on error)
def check_permission(user_id, resource_id):
    try:
        return db.query_permission(user_id, resource_id)
    except DatabaseError:
        logger.error("Permission check failed", exc_info=True)
        return False  # Error? Deny access
```

**Secure error handling**:
- Log the full exception internally (for debugging)
- Return a generic error to the user (no stack traces, no internal paths, no DB error messages)
- Fail to a denied/locked state, never to an open/permitted state

---

## Security Headers

Every HTTP response from a web application should include these headers:

```nginx
# Nginx — comprehensive security headers
server {
    # Prevent clickjacking
    add_header X-Frame-Options "DENY" always;

    # Prevent MIME sniffing
    add_header X-Content-Type-Options "nosniff" always;

    # XSS protection (legacy browsers)
    add_header X-XSS-Protection "1; mode=block" always;

    # HSTS — force HTTPS for 2 years, include subdomains
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Content Security Policy — restrict resource loading
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-{NONCE}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none';" always;

    # Control referrer information
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Control browser feature access
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
}
```

Test headers at [securityheaders.com](https://securityheaders.com).

---

## Secrets Management — Never in Code

**Why secrets in code are catastrophic**: git history is permanent. A secret committed and then deleted is still in the git history — accessible via `git log`, forks, and any CI system that cloned the repo.

```bash
# Wrong — hardcoded secret
DATABASE_URL="postgresql://user:SuperSecret123@prod-db.example.com/app"

# Wrong — .env file committed to git
echo ".env" >> .gitignore  # too late if it was ever committed
```

**Correct patterns**:

```python
# Environment variable injection (CI/CD injects at runtime)
import os
db_url = os.environ["DATABASE_URL"]

# AWS Secrets Manager (runtime fetch)
import boto3
client = boto3.client('secretsmanager')
secret = client.get_secret_value(SecretId="prod/myapp/database")
db_password = json.loads(secret['SecretString'])['password']
```

```yaml
# Kubernetes — secret reference (not hardcoded value)
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: database-credentials
      key: password
```

See [[Secrets_Management]] for HashiCorp Vault, AWS Secrets Manager, and sealed secrets.

---

## Separation of Duties

No single person or process should have end-to-end control over a critical operation:
- Code reviews require at least one approver who is not the author
- Deployment to production requires approval from a different team member than the developer
- Database admin and application accounts are separate
- CI/CD cannot self-approve deployments to production

---

## Common Pitfalls

- **Trusting client-supplied data for authorization**: always re-fetch the resource from the database and check server-side, never trust `role=admin` from a JWT claim without server-side verification
- **Using `eval()` on user input**: any form of dynamic code execution with user input is injection (JS `eval`, Python `exec`, shell `$()`)
- **Logging sensitive data**: never log passwords, session tokens, credit card numbers, or PII — check logging configuration with automated rules
- **Ignoring security headers**: browsers enforce CSP and HSTS, making whole classes of XSS and downgrade attacks impossible

---

## Review Questions

1. What is the difference between an allowlist and a denylist for input validation? Give a concrete example where a denylist fails.
2. Why does "fail securely" matter? Give an example of failing open vs. failing closed.
3. What does the `Content-Security-Policy` header prevent, and what does a safe baseline policy look like?
4. A developer stores an API key in a `.env` file and adds `.env` to `.gitignore`. Why might this still be a security risk?
5. Explain the principle of least privilege applied to database accounts in a web application.

---

#DevSecOps #SecureCoding #InputValidation #SecurityHeaders #LeastPrivilege #Secrets
