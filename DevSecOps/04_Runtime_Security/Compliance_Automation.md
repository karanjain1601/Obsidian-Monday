---
title: Compliance Automation
aliases: [Compliance as Code, CIS Benchmarks, PCI-DSS, SOC2, HIPAA, GDPR]
tags: [DevSecOps, Security, Compliance, CISBenchmarks, PCIDSS, SOC2, HIPAA, GDPR, InSpec, OpenSCAP]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [Policy_as_Code, Security_Logging_and_SIEM, Incident_Response, DevSecOps_Overview]
status: complete
---

# Compliance Automation

> [!abstract] TL;DR
> Compliance as code replaces point-in-time manual audits with continuous automated verification. CIS Benchmarks, SOC2, PCI-DSS, HIPAA, and GDPR requirements are expressed as executable tests (InSpec, AWS Config Rules, OpenSCAP) that run on every deployment. Evidence is collected automatically. The result: always-on compliance with an audit trail, rather than a scramble before each audit.

---

## Compliance as Code Philosophy

Traditional compliance:
- Annual audit → 3-month scramble to gather evidence
- Manual interviews and config screenshots
- Point-in-time snapshot — compliant the day of the audit, unknown the rest of the year
- Expensive: security consultant fees + engineer time

Compliance as Code:
- Every configuration verified on every deployment
- Evidence collected automatically (API logs, test results, policy reports)
- Continuous monitoring for drift (CloudTrail, AWS Config, Falco)
- Audit = pull automated evidence reports, not manual data gathering

---

## CIS Benchmarks

CIS (Center for Internet Security) publishes security configuration benchmarks for 100+ technology platforms. Each recommendation has a Level 1 (basic, minimal impact) and Level 2 (advanced).

### Automated CIS Compliance — AWS Config Rules

```bash
# AWS Config — enable CIS AWS Benchmark
aws configservice put-conformance-pack \
  --conformance-pack-name CIS-AWS-Benchmark-Level2 \
  --template-s3-uri s3://aws-conformance-packs-us-east-1/Operational-Best-Practices-for-CIS-AWS-v1.4-Level2.yaml

# View compliance status
aws configservice describe-conformance-pack-compliance \
  --conformance-pack-names CIS-AWS-Benchmark-Level2

# Get non-compliant resources
aws configservice get-compliance-details-by-config-rule \
  --config-rule-name cis-iam-password-policy \
  --compliance-types NON_COMPLIANT
```

### CIS Kubernetes Benchmark — kube-bench

```bash
# Run kube-bench against Kubernetes cluster
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

# View results
kubectl logs -l app=kube-bench

# Example output:
# [PASS] 1.1.1 Ensure that the API server pod specification file permissions are set to 644 or more restrictive
# [FAIL] 1.2.6 Ensure that the --authorization-mode argument is not set to AlwaysAllow
#   Remediation: Edit the API server pod specification file...
```

### Lynis — Linux CIS Benchmark

```bash
# Lynis system audit
lynis audit system

# Lynis output excerpt:
# [+] Boot and services
#   - Service Manager:                            systemd
#   - Checking UEFI boot:                         [ ENABLED ]
# [+] Authentication
#   - PAM password strength tools:                [ SUGGESTION ]
#     * Install libpam-pwquality or pam_cracklib

# Lynis hardening index: 68/100 (target: >75 for Level 1)

# Non-interactive scan with JSON output for CI
lynis audit system --quiet --json --report-file=/var/log/lynis-report.dat
```

---

## InSpec — Compliance as Code Framework

Chef InSpec lets you write compliance requirements as executable Ruby code:

```ruby
# controls/pci_dss_6.3.rb — PCI-DSS 6.3: Develop software using secure coding guidelines

control 'pci-dss-6.3.1' do
  impact 1.0
  title 'All web-facing applications should be protected by a WAF'
  desc 'PCI-DSS Requirement 6.3.1: WAF must be in place'

  describe aws_wafv2_web_acl(name: 'production-waf', scope: 'REGIONAL') do
    it { should exist }
    its('default_action') { should eq 'BLOCK' }
  end
end

control 'pci-dss-6.4' do
  impact 0.7
  title 'Dependency vulnerability scanning must be active'

  describe file('/var/ci/last-sca-scan.json') do
    it { should exist }
    its('mtime') { should be > (Time.now - 86400) }  # scanned within 24h
  end
end
```

```ruby
# controls/cis_aws_2.1.rb — CIS AWS Benchmark 2.1: S3 Buckets not publicly accessible

control 'cis-aws-2.1.5' do
  impact 1.0
  title 'Ensure that S3 Buckets are configured with Block public access'

  aws_s3_buckets.bucket_names.each do |bucket|
    describe aws_s3_bucket(bucket_name: bucket) do
      it { should_not be_public }
      it { should have_access_control_list }
    end
  end
end
```

```bash
# Run InSpec profile
inspec exec https://github.com/dev-sec/linux-baseline
inspec exec ./my-controls/ -t aws://us-east-1 --reporter cli json:results.json

# Run against a Docker container
inspec exec ./controls/ -t docker://container-id

# Run with Cinc (open-source InSpec fork)
cinc-auditor exec ./controls/ --reporter cli json:results.json
```

---

## SOC2 — Trust Service Criteria

SOC2 is an auditing standard for SaaS providers. The five Trust Service Criteria (TSC):

### CC6 — Logical and Physical Access Controls

```yaml
# CC6.1 — Logical access controls
# Automated check: all IAM users have MFA enabled
# AWS Config Rule
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  IAMMFAEnabled:
    Type: AWS::Config::ConfigRule
    Properties:
      ConfigRuleName: iam-user-mfa-enabled
      Source:
        Owner: AWS
        SourceIdentifier: IAM_USER_MFA_ENABLED
      Scope:
        ComplianceResourceTypes:
          - AWS::IAM::User
```

```python
# CC6.3 — Access removed within 24h of termination
# Automated: Okta SCIM provisioning + off-boarding playbook
# Test: check no terminated employees have active AWS keys

import boto3
def audit_iam_last_activity():
    iam = boto3.client('iam')
    users = iam.list_users()['Users']
    for user in users:
        report = iam.get_credential_report()
        # Check last activity for terminated employees
        # Alert if inactive > 90 days (CC6.2: periodic access review)
```

### CC7 — System Operations (Monitoring)

Requirement: monitoring for security events with defined alert thresholds.

```bash
# Evidence collection: export SIEM alert rule configurations
# Show that alerting is configured for:
# - Multiple failed logins (brute force)
# - Admin actions
# - Privilege escalation
# - Data download anomalies
splunk search "index=_audit | head 100" -auth admin:$SPLUNK_PASS > /audit/cc7-monitoring-evidence.json
```

---

## PCI-DSS — Payment Card Industry Data Security Standard

PCI-DSS v4.0 Technical Controls:

### Requirement 6 — Secure Systems and Software

```yaml
# PCI-DSS 6.3.1 — WAF protecting all web-facing applications
# Automated Checkov check for WAF association
# CKV_AWS_176: ALB should have WAF associated

resource "aws_lb" "payment_alb" {
  name               = "payment-alb"
  load_balancer_type = "application"
}

resource "aws_wafv2_web_acl_association" "payment_waf" {
  resource_arn = aws_lb.payment_alb.arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn
}
```

```bash
# PCI-DSS 6.5.1 — SAST for injection vulnerabilities
# CI gate: Semgrep scan fails on SQL injection patterns
semgrep --config p/sql-injection \
        --config p/xss \
        --error \   # exit code 1 on findings
        src/payment/
```

### Requirement 8 — Authentication

```hcl
# PCI-DSS 8.2.3 — MFA for all non-console administrative access
# Terraform: enforce MFA for AWS Console IAM users
resource "aws_iam_policy" "require_mfa" {
  name   = "RequireMFA"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Deny"
      NotAction = [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ]
      Resource = "*"
      Condition = {
        BoolIfExists = {
          "aws:MultiFactorAuthPresent" = "false"
        }
      }
    }]
  })
}
```

### Requirement 10 — Log and Monitor

```bash
# PCI-DSS 10.2 — Audit log requirements
# Verify CloudTrail is enabled in all regions
aws cloudtrail describe-trails --include-shadow-trails \
  | jq '.trailList[] | {name: .Name, multiRegion: .IsMultiRegionTrail, logFileValidation: .LogFileValidationEnabled}'

# PCI-DSS 10.5.1 — Protect audit logs from destruction
# Verify S3 log bucket has MFA delete and versioning
aws s3api get-bucket-versioning --bucket my-cloudtrail-logs
aws s3api get-bucket-lifecycle-configuration --bucket my-cloudtrail-logs
```

---

## HIPAA — Technical Safeguards

HIPAA §164.312 Technical Safeguards for ePHI:

```bash
# §164.312(a)(1) — Access Control (unique user IDs, emergency access, auto-logoff)
# Automated check: no shared service accounts
aws iam generate-credential-report
aws iam get-credential-report | python3 -c "
import sys, json, base64, csv, io
report = json.load(sys.stdin)
reader = csv.DictReader(io.StringIO(base64.b64decode(report['Content']).decode()))
for row in reader:
    if row['user'] != '<root_account>' and row['access_key_1_last_used_date'] != 'N/A':
        print(f\"{row['user']}: last used {row['access_key_1_last_used_date']}\")
"

# §164.312(a)(2)(iv) — Encryption and Decryption
# Check all RDS databases encrypted
aws rds describe-db-instances \
  --query 'DBInstances[?StorageEncrypted==`false`].[DBInstanceIdentifier]' \
  --output text | grep . && echo "FAIL: unencrypted RDS instances found" || echo "PASS"

# §164.312(e)(2)(ii) — Encryption in transit
# Verify all load balancers redirect HTTP to HTTPS
aws elbv2 describe-listeners \
  --query 'Listeners[?Protocol==`HTTP`].[ListenerArn,LoadBalancerArn]'
```

---

## GDPR Engineering Requirements

Key technical controls required by GDPR for EU data:

| Requirement | Technical Implementation |
|-------------|--------------------------|
| Data residency | AWS `region = "eu-west-1"` SCP denying other regions |
| Encryption at rest | RDS: `storage_encrypted = true`, S3: SSE-KMS |
| Encryption in transit | TLS 1.2+ on all endpoints; HSTS enabled |
| Right to erasure | Data deletion API + cascade delete in DB; audit log of deletion |
| Data minimization | Log review: no PII in application logs |
| Breach notification | IR playbook includes DPA (Data Protection Authority) notification within 72h |

```sql
-- Right to erasure implementation
CREATE OR REPLACE FUNCTION gdpr_erase_user(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Anonymize rather than delete (preserves referential integrity)
  UPDATE users SET
    email = CONCAT('erased-', p_user_id, '@deleted.invalid'),
    full_name = 'GDPR Erased',
    phone = NULL,
    address = NULL,
    erased_at = NOW()
  WHERE user_id = p_user_id;

  -- Log the erasure for compliance evidence
  INSERT INTO audit_log (event_type, subject_id, actor, timestamp)
  VALUES ('gdpr.right_to_erasure', p_user_id, current_user, NOW());
END;
$$ LANGUAGE plpgsql;
```

---

## OpenSCAP — Linux Security Hardening

```bash
# Install OpenSCAP
yum install -y openscap-scanner scap-security-guide

# Run CIS RHEL 9 benchmark
oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_cis_server_l1 \
  --results /var/log/openscap/results.xml \
  --report /var/log/openscap/report.html \
  /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml

# Auto-remediate (apply fixes)
oscap xccdf eval \
  --remediate \
  --profile xccdf_org.ssgproject.content_profile_cis_server_l1 \
  /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml
```

---

## Compliance Dashboard — Evidence Collection

```bash
# Automated evidence collection for SOC2 audit
# Run weekly, store results in S3

#!/bin/bash
DATE=$(date +%Y%m%d)
EVIDENCE_BUCKET="s3://compliance-evidence-${ACCOUNT_ID}/${DATE}/"

# IAM MFA compliance
aws iam generate-credential-report
sleep 5
aws iam get-credential-report > evidence-iam-credential-report.json
aws s3 cp evidence-iam-credential-report.json ${EVIDENCE_BUCKET}

# CloudTrail enabled check
aws cloudtrail get-trail-status --name management-trail > evidence-cloudtrail-status.json
aws s3 cp evidence-cloudtrail-status.json ${EVIDENCE_BUCKET}

# S3 bucket public access check
aws s3api list-buckets --query 'Buckets[].Name' --output text | \
  xargs -I{} aws s3api get-public-access-block --bucket {} \
  > evidence-s3-public-access.json
aws s3 cp evidence-s3-public-access.json ${EVIDENCE_BUCKET}

echo "Evidence collected and stored at ${EVIDENCE_BUCKET}"
```

---

## Common Pitfalls

- **Compliance ≠ Security**: meeting PCI-DSS checkbox requirements doesn't mean you're secure — it means you meet the minimum baseline. A system can be fully compliant and still be breached
- **Point-in-time compliance tools**: running Lynis once a month gives a snapshot, not continuous compliance. Use AWS Config Rules for real-time drift detection
- **Storing compliance evidence insecurely**: evidence for an audit stored in a compromised system is inadmissible. Use immutable S3 (Object Lock) for evidence
- **GDPR "right to erasure" breaking database referential integrity**: use soft-delete / anonymization patterns rather than hard deletes

---

## Review Questions

1. What is the difference between compliance and security? Give a concrete example where a system could be PCI-DSS compliant but still vulnerable.
2. Write an InSpec control that verifies all S3 buckets block public access.
3. What does PCI-DSS Requirement 10 mandate for audit log retention and protection?
4. Explain GDPR's "right to erasure" requirement and how a database schema should handle it technically.
5. What is OpenSCAP's `--remediate` flag and what risk does it carry in production?

---

#DevSecOps #Compliance #CISBenchmarks #PCIDSS #SOC2 #HIPAA #GDPR #InSpec #OpenSCAP #Security
