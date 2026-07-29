---
title: Security Logging and SIEM
aliases: [SIEM, Security Information and Event Management, Splunk, Elastic SIEM, Security Logging]
tags: [DevSecOps, Security, SIEM, Logging, Splunk, ElasticSIEM, Sentinel, CloudTrail]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [Runtime_Security_Monitoring, Incident_Response, Compliance_Automation, DevSecOps_Overview]
status: complete
---

# Security Logging and SIEM

> [!abstract] TL;DR
> Security logging captures the evidence trail needed to detect attacks, investigate incidents, and prove compliance. A SIEM (Security Information and Event Management) aggregates logs from all sources, applies correlation rules to detect attack patterns, and triggers alerts. The key challenges are logging the right events (completeness), preventing log tampering (integrity), and managing alert fatigue (quality over quantity).

---

## What to Log — Security Logging Requirements

### Authentication Events (MUST LOG)

```json
// Every authentication attempt — success AND failure
{
  "timestamp": "2026-07-29T10:23:45.123Z",
  "event_type": "auth.login_success",
  "user_id": "user-abc123",
  "username": "karan@example.com",
  "source_ip": "1.2.3.4",
  "user_agent": "Mozilla/5.0 ...",
  "session_id": "sess-xyz789",
  "mfa_method": "totp",
  "request_id": "req-def456"
}

// Failed login — critical for detecting brute force
{
  "timestamp": "2026-07-29T10:23:47.456Z",
  "event_type": "auth.login_failure",
  "username": "admin@example.com",
  "source_ip": "5.6.7.8",
  "failure_reason": "invalid_password",
  "consecutive_failures": 4,
  "lockout_threshold": 5
}
```

### Authorization and Access Events

```json
// Admin action — who did what to which resource
{
  "timestamp": "2026-07-29T11:00:00Z",
  "event_type": "admin.user_deleted",
  "actor_user_id": "admin-user-001",
  "target_user_id": "user-abc123",
  "justification": "offboarding-ticket-12345",
  "ip": "10.0.0.5"
}

// Authorization failure — potential IDOR or privilege escalation attempt
{
  "timestamp": "2026-07-29T11:05:00Z",
  "event_type": "authz.access_denied",
  "user_id": "user-abc123",
  "resource": "/api/accounts/99999/statements",
  "action": "GET",
  "reason": "user_not_authorized"
}
```

### Application Errors and Input Validation

```python
# Python — structured security logging with structlog
import structlog

logger = structlog.get_logger()

def process_payment(user_id: str, amount: str):
    try:
        amount_float = float(amount)
        if amount_float <= 0 or amount_float > 100000:
            # Log validation failure — potential probing
            logger.warning(
                "payment.validation_failure",
                user_id=user_id,
                amount=amount,
                reason="amount_out_of_bounds",
                severity="medium"
            )
            return {"error": "Invalid amount"}
    except ValueError:
        # Log injection attempt pattern
        logger.warning(
            "payment.invalid_input",
            user_id=user_id,
            amount_raw=amount,  # log raw input for investigation
            reason="non_numeric_amount"
        )
        return {"error": "Invalid input"}
```

---

## What NOT to Log

```python
# NEVER log:
logger.info("User logged in", password=user.password)         # passwords
logger.info("Payment processed", card_number=card.number)     # PAN data
logger.info("Token issued", token=jwt_token)                   # session tokens
logger.info("User data", ssn=user.social_security_number)     # PII/SSN
logger.info("API call", api_key=request.headers["X-API-Key"]) # credentials

# Correct — log reference IDs not values
logger.info("User logged in", user_id=user.id, session_id=session.id)
logger.info("Payment processed", transaction_id=txn.id, amount=amount)
```

---

## Log Integrity — Preventing Tampering

Logs that can be tampered with are useless for incident response and compliance:

```bash
# Linux — append-only log directory (chattr)
chattr +a /var/log/app/    # append-only; even root can't delete
chattr +i /var/log/app/app.log.2026-07-29  # immutable after rotation

# Centralized log shipping — logs leave the host immediately
# Using Fluentd/Fluent Bit → centralized SIEM (attacker compromises host but can't modify remote logs)
```

```yaml
# Fluent Bit — ship logs to Elasticsearch immediately
[INPUT]
    Name tail
    Path /var/log/app/*.log
    Parser json
    Refresh_Interval 5

[FILTER]
    Name record_modifier
    Match *
    Record host ${HOSTNAME}
    Record cluster production-us-east-1

[OUTPUT]
    Name es
    Match *
    Host elasticsearch.monitoring.internal
    Port 9200
    Index security-logs
    Logstash_Format On
    Retry_Limit 3  # buffer and retry on network failure
```

---

## SIEM Platforms

| Platform | Type | Strength |
|----------|------|----------|
| **Splunk** | Commercial | Most powerful search (SPL), extensive app ecosystem |
| **Microsoft Sentinel** | Cloud-native (Azure) | Deep Azure/M365 integration, built-in SOAR |
| **Elastic SIEM** | Open-core | Cost-effective, ELK-native, good for Kubernetes-native orgs |
| **IBM QRadar** | Commercial | Enterprise compliance, pre-built use cases |
| **Chronicle** (Google) | Cloud-native | Petabyte scale, Google threat intelligence built-in |

---

## Splunk — Search and Correlation

```spl
# SPL (Splunk Processing Language)

# Detect brute force: 5+ failed logins from same IP in 10 minutes
index=security sourcetype=auth_logs event_type=auth.login_failure
| bucket _time span=10m
| stats count as failures, dc(username) as unique_targets by _time, source_ip
| where failures >= 5
| eval alert_type="brute_force_attempt"

# Detect credential stuffing: many logins across many accounts from one IP
index=security event_type=auth.login_failure
| stats dc(username) as target_accounts, count as attempts by source_ip
| where target_accounts > 50 AND attempts > 100
| sort - attempts

# Detect privilege escalation
index=security event_type IN ("sudo.*", "auth.privilege_escalation")
| stats count by user, host, command
| where command IN ("su -", "/bin/bash", "chmod 777")
```

### Elastic SIEM — KQL Queries

```kql
-- Elastic KQL: detect suspicious container activity
event.category: "process" AND 
container.id: * AND 
process.name: ("bash" OR "sh" OR "python" OR "nc" OR "curl") AND 
NOT process.args: ("-c" "healthcheck")

-- Detect potential SQL injection in logs
http.response.status_code: 500 AND
url.query: (*OR* OR *UNION* OR *SELECT* OR *DROP*)
```

---

## Correlation Rules — Attack Pattern Detection

Good SIEM rules detect multi-step attack patterns, not just individual events:

```
Rule: Account Takeover Pattern
  Step 1: Failed login from new IP (auth.login_failure, count >= 3)
  Step 2: Successful login (auth.login_success) within 5 minutes
  Step 3: Password change (user.password_changed) within 10 minutes of step 2
  Severity: CRITICAL — classic account takeover sequence
```

```
Rule: Insider Data Exfiltration
  Step 1: Download > 1GB data from internal service
  Step 2: OR: Query > 10,000 records in one API call
  Step 3: AND: Unusual time (2AM - 5AM)
  Severity: HIGH
```

---

## Cloud Logging — AWS CloudTrail

```bash
# Query CloudTrail with AWS CLI
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket \
  --start-time 2026-07-28T00:00:00Z

# CloudWatch Insights query — find root user activity
fields @timestamp, userIdentity.type, eventName, sourceIPAddress
| filter userIdentity.type = "Root"
| sort @timestamp desc
| limit 20

# Detect credential exposure (access from unusual IP)
fields @timestamp, userIdentity.userName, sourceIPAddress, eventName
| filter errorCode = "NoSuchBucket" or errorCode = "AccessDenied"
| stats count() as failures by userIdentity.userName, sourceIPAddress
| filter failures > 10
| sort failures desc
```

---

## Audit Logging Standards

**Log formats**:
- **CEF (Common Event Format)**: `CEF:0|Security|SIEM|1.0|auth.failure|Login Failure|7|src=1.2.3.4 dst=10.0.0.1 duser=admin`
- **GELF (Graylog Extended Log Format)**: JSON-based, supports structured fields
- **Structured JSON logs**: preferred for modern cloud-native applications — parseable by all SIEM tools

```json
// Structured JSON log — optimal for SIEM ingestion
{
  "@timestamp": "2026-07-29T10:23:45.123Z",
  "log.level": "warn",
  "event.category": "authentication",
  "event.type": "start",
  "event.outcome": "failure",
  "source.ip": "1.2.3.4",
  "user.name": "admin",
  "user.id": "user-001",
  "http.request.method": "POST",
  "url.path": "/api/login",
  "error.message": "invalid_password",
  "service.name": "auth-service",
  "service.version": "2.3.1",
  "host.name": "api-pod-abc123"
}
```

---

## Log Retention Policies

| Regulation | Minimum retention |
|------------|-------------------|
| PCI-DSS | 1 year (3 months immediately accessible) |
| HIPAA | 6 years |
| SOC2 | Evidence for audit period (typically 1 year) |
| GDPR | Only as long as necessary (right to erasure applies) |
| ISO 27001 | Risk-based, typically 1-3 years |

```bash
# Elasticsearch index lifecycle management — auto-delete after 1 year
PUT /_ilm/policy/security-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": { "rollover": { "max_size": "50GB", "max_age": "7d" } }
      },
      "warm": {
        "min_age": "30d",
        "actions": { "shrink": { "number_of_shards": 1 } }
      },
      "delete": {
        "min_age": "365d",
        "actions": { "delete": {} }
      }
    }
  }
}
```

---

## Alert Fatigue Management

High-volume, low-quality alerts burn out security teams:

1. **Tune before enabling**: test correlation rules against historical data; only enable rules with < 5% false positive rate
2. **Risk-based prioritization**: not all alerts are equal; critical + high volume asset = P1
3. **Aggregation**: 100 failed logins from the same IP is one alert, not 100
4. **Auto-close low-confidence alerts**: use ML anomaly detection to separate true anomalies from noise
5. **Measure MTTD**: track Mean Time To Detect — alert fatigue causes MTTD to increase

---

## Common Pitfalls

- **Logging everything without structure**: unstructured logs (plaintext error messages) are hard to query and ingest into SIEM
- **Log shipping failures silently drop events**: configure buffer and retry in Fluentd/Fluent Bit; alert when the log pipeline has gaps
- **No integrity protection for logs**: an attacker who compromises a host can clear `auth.log` — always ship to a remote SIEM immediately
- **Logging sensitive data**: GDPR requires data minimization; logging PII/PHI/PAN creates compliance violations

---

## Review Questions

1. List five categories of events that must be logged for security monitoring purposes.
2. What structured log fields does ECS (Elastic Common Schema) recommend for authentication events?
3. Write a Splunk SPL query that detects 5+ failed logins from the same IP in a 5-minute window.
4. Why is append-only or remote log shipping critical for incident response?
5. What is PCI-DSS's minimum log retention requirement and what does "immediately accessible" mean?

---

#DevSecOps #SIEM #SecurityLogging #Splunk #ElasticSIEM #CloudTrail #Security
