---
title: Container and IaC Security
aliases: [Container Security, Dockerfile Security, Kubernetes Security, IaC Scanning, Checkov, Trivy]
tags: [DevSecOps, Security, Containers, Kubernetes, IaC, Terraform, Checkov, Trivy, CSPM]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [SCA_Dependency_Scanning, Policy_as_Code, Runtime_Security_Monitoring, Security_in_CICD_Pipeline]
status: complete
---

# Container and IaC Security

> [!abstract] TL;DR
> Container security spans the image build (minimal base, non-root, pinned versions), the registry (signed images, vulnerability scanning), and runtime (Pod Security Standards, RBAC, NetworkPolicy). IaC security catches misconfigurations in Terraform/CloudFormation before infrastructure is deployed. Tools like Trivy (scanning), Checkov (IaC policies), and OPA/Gatekeeper (runtime enforcement) form the full stack.

---

## Container Image Scanning

Container images contain two vulnerability layers:
1. **OS packages** — vulnerabilities in Ubuntu/Alpine/Debian packages (like `libssl`, `libc`)
2. **Application dependencies** — language packages (npm, pip, Maven) inside the image

### Trivy — The Standard Scanner

```bash
# Scan an image (OS + app layer)
trivy image nginx:1.25.0

# Scan with severity filter
trivy image --severity CRITICAL,HIGH python:3.11-slim

# Scan local filesystem
trivy fs --security-checks vuln,secret,config .

# CI/CD — fail on CRITICAL
trivy image --exit-code 1 --severity CRITICAL myapp:latest

# Output as SARIF for GitHub Security tab
trivy image --format sarif --output trivy.sarif myapp:latest

# Scan IaC (Terraform, Kubernetes, Dockerfile)
trivy config --severity CRITICAL,HIGH ./terraform/
```

### Grype — Anchore's Scanner

```bash
# Scan image
grype myapp:latest

# Scan with fail threshold
grype myapp:latest --fail-on critical

# Scan SBOM
grype sbom:./sbom.cyclonedx.json
```

### Docker Scout (Docker Hub Integration)

```bash
# Requires Docker Desktop or Docker Hub account
docker scout cves myapp:latest
docker scout recommendations myapp:latest  # suggests base image updates
```

---

## Dockerfile Best Practices

### Non-Root User

```dockerfile
# WRONG — runs as root by default
FROM ubuntu:22.04
RUN apt-get install -y myapp
CMD ["myapp"]

# CORRECT — run as non-root user
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y myapp && \
    useradd --system --no-create-home --shell /bin/false appuser
USER appuser                       # switch to non-root before CMD
CMD ["myapp"]
```

### Minimal Base Images

```dockerfile
# LARGE — Ubuntu full image (~77MB)
FROM ubuntu:22.04

# SMALLER — Debian Slim (~80MB but fewer packages)
FROM debian:12-slim

# SMALLEST — Alpine Linux (~5MB)
FROM alpine:3.18

# MINIMAL — Distroless (no shell, no package manager)
FROM gcr.io/distroless/java17-debian12

# MULTI-STAGE — build in full image, run in minimal
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM gcr.io/distroless/java21-debian12
COPY --from=builder /app/target/app.jar /app.jar
USER nonroot                       # distroless has nonroot user built in
ENTRYPOINT ["/usr/bin/java", "-jar", "/app.jar"]
```

### Pin Versions

```dockerfile
# WRONG — floating tags change without notice
FROM python:latest
FROM python:3.11

# CORRECT — pin to digest (immutable)
FROM python:3.11.9-slim@sha256:abc123def456...

# OR pin to a specific version tag (less ideal but acceptable)
FROM python:3.11.9-slim
```

### Full Secure Dockerfile Example

```dockerfile
FROM python:3.11.9-slim@sha256:abc123

# Create non-root user
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy requirements first (Docker layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --require-hashes -r requirements.txt

# Copy application code
COPY --chown=appuser:appgroup . .

# Switch to non-root
USER appuser

# Expose non-privileged port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# No secrets in ENV — inject at runtime
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## Kubernetes Security

### Pod Security Standards (PSS)

PSS replaced PodSecurityPolicies (deprecated in K8s 1.21, removed in 1.25):

```yaml
# Enforce restricted security standard on a namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted   # block non-compliant pods
    pod-security.kubernetes.io/warn: restricted       # warn in dry-run
    pod-security.kubernetes.io/audit: restricted      # audit log violations

# PSS levels:
# privileged — no restrictions (for system-level workloads)
# baseline   — prevents known privilege escalation
# restricted — hardened, best current practices
```

### SecurityContext for Pods

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true        # enforce non-root
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        seccompProfile:
          type: RuntimeDefault    # restrict syscalls

      containers:
      - name: app
        securityContext:
          allowPrivilegeEscalation: false   # prevent sudo/setuid
          readOnlyRootFilesystem: true       # immutable filesystem
          capabilities:
            drop: ["ALL"]                    # drop all Linux capabilities
            add: ["NET_BIND_SERVICE"]        # add only what's needed
```

### RBAC — Principle of Least Privilege

```yaml
# Service account for a read-only app
apiVersion: v1
kind: ServiceAccount
metadata:
  name: readonly-app
  namespace: production
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]   # read-only, no write/delete
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: production
subjects:
- kind: ServiceAccount
  name: readonly-app
  namespace: production
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### Secrets Encryption at Rest

```yaml
# EncryptionConfiguration — encrypt etcd secrets at rest
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets
  providers:
  - aescbc:                          # AES-CBC with HMAC-SHA256
      keys:
      - name: key1
        secret: <base64-encoded-key>
  - identity: {}                     # fallback — unencrypted (for migration)
```

---

## IaC Scanning

### Checkov — Multi-Framework IaC Scanner

```bash
# Install
pip install checkov

# Scan Terraform
checkov -d ./terraform/ --framework terraform

# Scan Kubernetes manifests
checkov -d ./k8s/ --framework kubernetes

# Scan Dockerfile
checkov -f ./Dockerfile --framework dockerfile

# Scan CloudFormation
checkov -f template.yaml --framework cloudformation

# Generate SARIF output
checkov -d . --output sarif --output-file-path ./checkov-results.sarif

# Fail on HIGH severity only
checkov -d . --soft-fail-on LOW,MEDIUM

# Skip specific checks (with justification comment in code)
checkov -d . --skip-check CKV_AWS_57
```

Example Checkov finding and fix:
```hcl
# Flagged by Checkov: CKV_AWS_19 - S3 bucket not encrypted
# WRONG
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
}

# CORRECT — with server-side encryption
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
}
resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
```

### tfsec — Terraform-Focused Scanner

```bash
# Scan Terraform directory
tfsec ./terraform/

# Output as SARIF
tfsec ./terraform/ --format sarif --out tfsec.sarif

# Only check specific severity
tfsec ./terraform/ --minimum-severity HIGH
```

### Terrascan — Multi-Cloud IaC

```bash
# Scan Terraform for AWS
terrascan scan -t aws -d ./terraform/

# Scan Kubernetes manifests
terrascan scan -t k8s -d ./k8s/
```

---

## Cloud Security Posture Management (CSPM)

CSPM tools continuously monitor cloud environments for misconfigurations:

| Tool | Cloud support | Key feature |
|------|--------------|-------------|
| **Prisma Cloud** (Palo Alto) | AWS/Azure/GCP | Real-time posture + compliance reporting |
| **AWS Security Hub** | AWS only | Aggregates findings from GuardDuty, Inspector, Macie |
| **Microsoft Defender for Cloud** | Azure + multi-cloud | Secure Score, compliance dashboard |
| **GCP Security Command Center** | GCP | Asset inventory, threat detection |
| **Wiz** | Multi-cloud | Agentless, attack path analysis |

```bash
# AWS Security Hub — enable CIS AWS benchmark
aws securityhub enable-security-hub \
  --enable-default-standards \
  --region us-east-1

# Query findings
aws securityhub get-findings \
  --filters '{"SeverityLabel": [{"Value": "CRITICAL", "Comparison": "EQUALS"}]}'
```

---

## Common Pitfalls

- **Scanning only in CI without production drift detection**: CSPM is needed because configurations drift after deployment (manual changes, AWS Console "quick fixes")
- **Using `latest` image tag**: `latest` changes without notice — pin digests in production
- **Running containers as root**: the single most common container security mistake — always specify `USER` in Dockerfile and `runAsNonRoot: true` in K8s
- **Secrets in environment variables visible to `docker inspect`**: use Docker secrets or K8s Sealed Secrets instead
- **RBAC ClusterAdmin for all service accounts**: least privilege for service accounts is consistently overlooked

---

## Review Questions

1. What is the difference between an OS vulnerability and an application layer vulnerability in a container image?
2. Write a Kubernetes SecurityContext that enforces non-root, read-only filesystem, and drops all capabilities.
3. What does `readOnlyRootFilesystem: true` prevent, and what does it require in your application architecture?
4. A Checkov check `CKV_AWS_57` fires — it reports an S3 bucket with public access enabled. Write the Terraform fix.
5. What is a CSPM tool and how does it differ from IaC scanning?

---

#DevSecOps #Containers #Kubernetes #IaC #Terraform #Checkov #Trivy #CSPM #Security
