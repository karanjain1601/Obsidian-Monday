---
title: Incident Response
aliases: [IR, PICERL, Security Incident Response, Runbooks, Playbooks]
tags: [DevSecOps, Security, IncidentResponse, PICERL, Runbooks, Forensics, Chaos]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [Security_Logging_and_SIEM, Runtime_Security_Monitoring, Compliance_Automation, DevSecOps_Overview]
status: complete
---

# Incident Response

> [!abstract] TL;DR
> Incident Response (IR) is the structured process for identifying, containing, and recovering from security incidents. The PICERL framework (Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned) provides the playbook. Container environments require specific forensic techniques (crictl, kubectl). Blameless post-mortems improve future resilience. MTTR is the key IR health metric.

---

## PICERL Framework

### Phase 1: Preparation

Everything done before an incident to ensure effective response:

```markdown
Preparation Checklist:
- [ ] IR runbooks written for top 5 threat scenarios (ransomware, data breach, credential theft, container compromise, supply chain attack)
- [ ] On-call rotation and escalation paths defined
- [ ] SIEM alerts wired to PagerDuty / OpsGenie
- [ ] Forensic tools pre-installed on hosts (tcpdump, strace, auditd)
- [ ] Immutable log infrastructure (cannot be tampered by attacker)
- [ ] Out-of-band communication channel (Slack is potentially compromised during an incident — have a backup like Signal or phone tree)
- [ ] Tabletop exercises run quarterly
- [ ] Legal/compliance contacts identified for breach notification obligations
```

### Phase 2: Identification

Determine if a security event is actually an incident:

```
Alert sources:
├── SIEM correlation rules
├── Falco/runtime security alerts
├── EDR detections (CrowdStrike)
├── User reports ("I saw a weird login on my account")
├── Threat hunting findings
└── Third-party notification (HaveIBeenPwned, bug bounty)

Identification questions:
├── What is the affected scope? (one user? one service? entire domain?)
├── Is this still ongoing or historical?
├── What data/systems are at risk?
├── What is the likely attack vector?
└── Does this meet our incident definition criteria?
```

**Triage severity matrix**:

| Severity | Criteria | Response SLA |
|----------|----------|-------------|
| P1/Critical | Production breach, data exfiltration ongoing, ransomware | 15-minute response |
| P2/High | Credential compromise, suspicious admin activity | 1-hour response |
| P3/Medium | Failed attack attempts, policy violations | 4-hour response |
| P4/Low | Informational, suspicious but non-critical | Next business day |

### Phase 3: Containment

Stop the spread — prioritize limiting blast radius over full remediation:

```bash
# Short-term containment: isolate the affected resource

# Kubernetes: isolate a compromised pod (block all network traffic)
kubectl label pod compromised-pod-abc123 isolation=true -n production

# Apply NetworkPolicy that blocks all ingress/egress for labeled pods
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: isolate-compromised-pods
  namespace: production
spec:
  podSelector:
    matchLabels:
      isolation: "true"
  policyTypes: [Ingress, Egress]
  # No rules = deny all
EOF

# AWS: isolate an EC2 instance
# 1. Move to isolated security group (no inbound/outbound)
aws ec2 modify-instance-attribute \
  --instance-id i-0abc123 \
  --groups sg-isolated-quarantine

# 2. Block IAM credentials if compromised
aws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE

# Kubernetes: revoke ServiceAccount token
kubectl delete secret --field-selector=type=kubernetes.io/service-account-token \
  -n production -l app=compromised-service
```

### Phase 4: Eradication

Remove the threat completely:

```bash
# Remove malicious container (after preserving forensics)
# First: snapshot for forensics
docker commit compromised-container forensic-snapshot:$(date +%Y%m%d)
docker save forensic-snapshot:$(date +%Y%m%d) > /forensics/snapshot-$(date +%Y%m%d).tar

# Then: kill the pod
kubectl delete pod compromised-pod-abc123 --force --grace-period=0 -n production

# Rebuild from known-good image (supply chain verified)
kubectl set image deployment/myapp myapp=registry.io/myapp:verified-sha256@abc123

# Revoke all potentially compromised credentials
# - Rotate database passwords
# - Invalidate all active sessions for affected users
# - Rotate service account keys
# - Regenerate TLS certificates if PKI is suspected compromised
```

### Phase 5: Recovery

Restore normal operations with confidence:

```bash
# Verify the environment is clean before restoring traffic
# 1. Deploy from verified image (signed with cosign)
cosign verify \
  --certificate-identity="https://github.com/myorg/myrepo/..." \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  registry.io/myapp:latest

# 2. Run smoke tests against restored service
kubectl rollout status deployment/myapp -n production
curl -f https://api.myapp.com/health || echo "HEALTH CHECK FAILED"

# 3. Restore traffic incrementally (canary)
kubectl patch deployment myapp -n production \
  -p '{"spec":{"replicas":1}}'   # start with 1 replica
# Monitor for 10 minutes, then scale up
kubectl scale deployment myapp --replicas=10 -n production
```

### Phase 6: Lessons Learned (Post-Mortem)

```markdown
# Incident Post-Mortem Template

## Incident Summary
- Date/Time: [ISO 8601]
- Duration: [from detection to recovery]
- Severity: [P1/P2/P3]
- Impact: [affected users/services/data]

## Timeline
| Time | Event |
|------|-------|
| T+0  | Initial alert fired in SIEM |
| T+8m | On-call engineer acknowledged |
| T+25m| Blast radius assessed |
| T+45m| Containment complete |
| T+2h | Eradication complete |
| T+3h | Recovery verified |

## Root Cause Analysis (5 Whys)
1. Why did the breach occur? Unpatched Log4j vulnerability
2. Why was it unpatched? No automated vulnerability scanning in CI
3. Why was there no automated scanning? SCA not yet configured for this service
4. Why wasn't it configured? Service predated our SCA standard
5. Why didn't the rollout cover legacy services? No audit of pre-standard services

## Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Add SCA to all remaining services | DevSecOps team | 2026-08-15 | HIGH |
| Audit all services for pre-standard gaps | Platform team | 2026-08-30 | MEDIUM |
| Add automatic SBOM scanning for existing images | DevSecOps | 2026-08-01 | HIGH |
```

---

## Container Compromise Response

### Using crictl for Container Forensics

```bash
# crictl — container runtime interface (works with containerd, CRI-O)

# List running containers
crictl ps

# Get container details (image, command, mounts)
crictl inspect <container-id>

# Get container logs
crictl logs <container-id>

# Get container stats (CPU, memory — look for anomalies)
crictl stats <container-id>

# Copy forensic files from container
docker cp compromised-pod:/proc/net/tcp /forensics/tcp-connections.txt
docker cp compromised-pod:/etc/crontab /forensics/crontab.txt

# Live process listing inside container
kubectl exec -it <pod-name> -- ps aux
kubectl exec -it <pod-name> -- netstat -tulnp
kubectl exec -it <pod-name> -- cat /proc/net/tcp
```

---

## Cloud Incident Response — AWS GuardDuty

```bash
# GuardDuty findings (automated threat detection)
aws guardduty list-findings \
  --detector-id <detector-id> \
  --finding-criteria '{"Criterion":{"severity":{"Gte":7}}}'

# Get finding details
aws guardduty get-findings \
  --detector-id <detector-id> \
  --finding-ids <finding-id>

# Typical GuardDuty findings and response:
# UnauthorizedAccess:IAMUser/TorIPCaller → rotate credentials, review access
# Recon:EC2/PortProbeUnprotectedPort → review security groups
# CryptoCurrency:EC2/BitcoinTool.B → terminate instance (cryptomining)
# Backdoor:EC2/C&CActivity.B → isolate instance, forensics
```

---

## AWS EC2 Isolation Runbook

```bash
#!/bin/bash
# isolate-ec2.sh — isolate a compromised EC2 instance

INSTANCE_ID=$1
ISOLATED_SG="sg-0abc123isolated"  # security group with no rules

echo "[+] Disabling termination protection"
aws ec2 modify-instance-attribute \
  --instance-id $INSTANCE_ID \
  --no-disable-api-termination

echo "[+] Taking memory snapshot via SSM"
aws ssm send-command \
  --instance-ids $INSTANCE_ID \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=['sudo avml /tmp/memory.lime && aws s3 cp /tmp/memory.lime s3://forensics-bucket/']"

echo "[+] Capturing disk snapshot"
aws ec2 create-snapshot \
  --volume-id $(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].BlockDeviceMappings[0].Ebs.VolumeId' --output text) \
  --description "Forensic snapshot - incident $(date +%Y%m%d)"

echo "[+] Isolating instance (move to quarantine security group)"
aws ec2 modify-instance-attribute \
  --instance-id $INSTANCE_ID \
  --groups $ISOLATED_SG

echo "[+] Instance isolated. Forensic artifacts saved to s3://forensics-bucket/"
```

---

## MTTR and Key IR Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **MTTA** | Mean Time To Acknowledge | < 15 min (P1) |
| **MTTD** | Mean Time To Detect | < 1 hour |
| **MTTC** | Mean Time To Contain | < 4 hours (P1) |
| **MTTR** | Mean Time To Recover | < 24 hours (P1) |
| **Dwell Time** | Time from initial compromise to detection | Industry avg: 207 days (minimize!) |

---

## Chaos Engineering for Security Testing

Apply Netflix's chaos engineering principles to security:

```bash
# Chaos Monkey for security — test that your controls work
# Scenario 1: inject a shell into a running container
# → Falco should alert within seconds; SOAR should isolate

# Scenario 2: exfiltrate a test file from a container
# → DLP / network monitoring should detect the outbound transfer

# Scenario 3: deploy an unsigned container image
# → Kyverno/Gatekeeper should reject it

# Scenario 4: disable CloudTrail
# → SCP should deny; alert should fire
```

---

## Common Pitfalls

- **Killing the pod before preserving forensics**: once the pod is gone, you've lost all volatile evidence (process list, network connections, memory). Always snapshot first
- **Using potentially compromised communication channels**: if Slack or email could be compromised, the attacker is reading your IR comms. Use an out-of-band channel
- **No tabletop exercises**: the first time you follow a runbook should not be during a real incident. Run quarterly drills
- **Skipping lessons learned**: the post-mortem is the highest-value activity — skip it and you repeat the same incidents

---

## Review Questions

1. List the six PICERL phases and the primary goal of each.
2. During containment of a compromised Kubernetes pod, what should you do before deleting the pod?
3. Write a kubectl command to isolate a pod by blocking all ingress and egress with a NetworkPolicy.
4. What is "dwell time" and why is it the most important security metric to minimize?
5. What is the purpose of a blameless post-mortem and why does it produce better outcomes than blame-based reviews?

---

#DevSecOps #IncidentResponse #PICERL #Forensics #Runbooks #Kubernetes #Security
