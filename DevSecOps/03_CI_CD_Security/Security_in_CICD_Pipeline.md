---
title: Security in CI/CD Pipeline
aliases: [Pipeline Security, Secure CI/CD, GitHub Actions Security]
tags: [DevSecOps, Security, CICD, GitHubActions, PipelineSecurity, ShiftLeft]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [Secrets_Management, Supply_Chain_Security, SAST_Static_Analysis, DAST_Dynamic_Analysis, SCA_Dependency_Scanning]
status: complete
---

# Security in CI/CD Pipeline

> [!abstract] TL;DR
> A secure CI/CD pipeline embeds security checks at every stage: pre-commit (secrets scanning, linting), PR (SAST + SCA), build (container scanning, SBOM), staging deploy (DAST), and production (runtime monitoring). GitHub Actions security requires pinning action versions to SHA hashes, applying least-privilege GITHUB_TOKEN permissions, and using OIDC instead of stored credentials for cloud access.

---

## Security Pipeline Stages

```
Pre-commit          PR Check          Build            Deploy (Staging)   Production
─────────           ────────          ─────            ────────────────   ──────────
secrets scan    →   SAST         →    container scan → DAST          →    runtime security
gitleaks            Semgrep           Trivy              ZAP                Falco
detect-secrets      SonarQube         SBOM generation    API security       SIEM
lint                SCA               image signing      smoke tests        alerting
                    Snyk/Dependabot   SLSA provenance    pen test (manual)
```

Each stage provides progressively deeper testing while maintaining fast feedback for developers.

---

## GitHub Actions Security

### Pinned Action Versions (SHA hashes)

Third-party GitHub Actions are a supply chain risk — a tag like `v4` can be moved to point to different (malicious) code:

```yaml
# WRONG — tag-based, mutable
- uses: actions/checkout@v4
- uses: snyk/actions/node@master

# CORRECT — SHA-pinned, immutable
- uses: actions/checkout@692973c6df8b09f4ef74d5add1a38f6b9b9dc9aa  # v4.1.7
- uses: snyk/actions/node@b98d498629f1c5e001e6f9ba91b886f17bca08fd   # pin to a commit
```

Use tools like `pin-github-actions` or `actionlint` to automate pinning:

```bash
# pin-github-actions — updates actions to SHA pins
pip install pin-github-actions
pin-github-actions .github/workflows/security.yml
```

### Least-Privilege GITHUB_TOKEN

```yaml
# Workflow-level: restrict all permissions by default
permissions:
  contents: read     # read-only on repo

jobs:
  build:
    permissions:
      contents: read
      packages: write    # only the build job needs to push packages
      security-events: write   # only SARIF upload job needs this

  sast:
    permissions:
      contents: read
      security-events: write   # for SARIF upload to Security tab
```

**Rule of thumb**: if a job doesn't need `write`, don't give it `write`. Default `permissions: read-all` then selectively add write.

### Environment Protection Rules

```yaml
# deployment job — requires approval for production
jobs:
  deploy-prod:
    environment: production   # maps to GitHub Environment with protection rules
    # GitHub Environment "production" can be configured with:
    # - Required reviewers (manual approval)
    # - Wait timer (deployment delay)
    # - Deployment branch restrictions (only main)
```

### OIDC — No Stored Secrets for Cloud Auth

OIDC (OpenID Connect) lets GitHub Actions authenticate to AWS/Azure/GCP without storing long-lived credentials:

```yaml
# AWS OIDC — no AWS_ACCESS_KEY_ID stored in GitHub Secrets
jobs:
  deploy:
    permissions:
      id-token: write    # required for OIDC
      contents: read

    steps:
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@010d0da01d0b5a38af31e9c3470dbfdabdecca3a  # v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-deploy
          aws-region: us-east-1
          # No secrets needed — OIDC token is exchanged for temporary credentials

      - name: Deploy
        run: aws s3 sync ./dist s3://my-bucket/
```

```hcl
# Terraform — AWS IAM OIDC trust policy for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "github-actions-deploy"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com" }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:myorg/myrepo:*"
        }
      }
    }]
  })
}
```

---

## Full Secure Pipeline Example

```yaml
# .github/workflows/devsecops.yml
name: DevSecOps Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

# Restrict all token permissions globally
permissions:
  contents: read

jobs:
  # ────────────────────────────────────────────────────────
  # Stage 1: Secrets Scanning
  # ────────────────────────────────────────────────────────
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@692973c6df8b09f4ef74d5add1a38f6b9b9dc9aa  # v4.1.7
        with:
          fetch-depth: 0    # full history for secret scanning
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # ────────────────────────────────────────────────────────
  # Stage 2: SAST
  # ────────────────────────────────────────────────────────
  sast:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@692973c6df8b09f4ef74d5add1a38f6b9b9dc9aa
      - name: Semgrep SAST
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten
          generateSarif: true
        env:
          SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: semgrep.sarif

  # ────────────────────────────────────────────────────────
  # Stage 3: SCA
  # ────────────────────────────────────────────────────────
  sca:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@692973c6df8b09f4ef74d5add1a38f6b9b9dc9aa
      - name: Snyk SCA
        uses: snyk/actions/node@b98d498629f1c5e001e6f9ba91b886f17bca08fd
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --sarif-file-output=snyk.sarif
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: snyk.sarif

  # ────────────────────────────────────────────────────────
  # Stage 4: Build + Container Scan
  # ────────────────────────────────────────────────────────
  build-and-scan:
    needs: [secrets-scan, sast, sca]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      security-events: write
      id-token: write    # for image signing with cosign
    steps:
      - uses: actions/checkout@692973c6df8b09f4ef74d5add1a38f6b9b9dc9aa

      - name: Build image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Trivy image scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          format: sarif
          output: trivy-image.sarif
          exit-code: 1
          severity: CRITICAL

      - name: Generate SBOM
        uses: anchore/sbom-action@v0
        with:
          image: myapp:${{ github.sha }}
          format: cyclonedx-json
          output-file: sbom.cyclonedx.json

      - name: Sign image with cosign (Sigstore)
        uses: sigstore/cosign-installer@v3
      - run: cosign sign --yes myapp:${{ github.sha }}

  # ────────────────────────────────────────────────────────
  # Stage 5: IaC Scan
  # ────────────────────────────────────────────────────────
  iac-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@692973c6df8b09f4ef74d5add1a38f6b9b9dc9aa
      - name: Checkov IaC Scan
        uses: bridgecrewio/checkov-action@master
        with:
          directory: terraform/
          framework: terraform
          output_format: sarif
          output_file_path: checkov.sarif
          soft_fail: false

  # ────────────────────────────────────────────────────────
  # Stage 6: DAST (only on staging deploy)
  # ────────────────────────────────────────────────────────
  dast:
    if: github.ref == 'refs/heads/main'
    needs: [build-and-scan]
    runs-on: ubuntu-latest
    steps:
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.11.0
        with:
          target: 'https://staging.myapp.com'
          fail_action: true
```

---

## Pre-Commit Hooks

Catch issues before they are pushed:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks     # secrets scanning on staged files

  - repo: https://github.com/returntocorp/semgrep
    rev: v1.50.0
    hooks:
      - id: semgrep
        args: ["--config", "p/security-audit", "--error"]

  - repo: https://github.com/bridgecrewio/checkov
    rev: 3.0.0
    hooks:
      - id: checkov
        args: ["--framework", "terraform"]
```

```bash
# Install pre-commit
pip install pre-commit
pre-commit install          # install hooks
pre-commit run --all-files  # test against all files
```

---

## Common Pitfalls

- **Long-running pipelines blocking development**: parallelize security jobs; don't run all checks sequentially. SAST + SCA can run in parallel
- **No caching of security tool databases**: Trivy and Dependabot download vulnerability DBs on each run — cache them to reduce CI time by 2-3 minutes
- **Storing cloud credentials in GitHub Secrets**: use OIDC instead — temporary credentials are fundamentally safer than long-lived keys
- **Security pipeline only on main branch**: security checks must run on every PR — that's the shift-left point

---

## Review Questions

1. Why should GitHub Actions use SHA-pinned action versions instead of tag-based versions?
2. Explain how OIDC eliminates the need for stored AWS credentials in GitHub Actions.
3. List five stages of a secure CI/CD pipeline and what security tool runs at each stage.
4. What GitHub token permissions does a SARIF upload job minimally need?
5. What is the purpose of pre-commit hooks in a DevSecOps pipeline?

---

#DevSecOps #CICD #PipelineSecurity #GitHubActions #OIDC #ShiftLeft #Security
