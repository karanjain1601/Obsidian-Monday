---
title: Supply Chain Security
aliases: [Software Supply Chain, SLSA, Sigstore, cosign, SBOM]
tags: [DevSecOps, Security, SupplyChain, SLSA, Sigstore, cosign, SolarWinds, Log4Shell]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [SCA_Dependency_Scanning, Security_in_CICD_Pipeline, Secrets_Management, Policy_as_Code]
status: complete
---

# Supply Chain Security

> [!abstract] TL;DR
> Software supply chain attacks compromise the pipeline or dependencies used to build software — the malicious code ships as part of a legitimate, signed release. SLSA (Supply chain Levels for Software Artifacts) is the framework for hardening build pipelines. Sigstore/cosign enables cryptographic signing of container images and packages. SBOMs provide transparency about what's in your software.

---

## Why Supply Chain Security Matters

### SolarWinds (2020) — The Canonical Case Study

Attackers (Cozy Bear/APT29) compromised SolarWinds' build system and injected the SUNBURST backdoor into the Orion software update. The malicious update was **code-signed by SolarWinds** — traditional signature verification didn't help because the build system itself was compromised.

Consequences:
- 18,000+ organizations installed the trojanized update
- US Treasury, CISA, FireEye, and hundreds of Fortune 500 companies compromised
- Dwell time: ~9 months before detection

### Log4Shell (2021) — Dependency Attack Surface

CVE-2021-44228 (CVSS 10.0) in Log4j2 affected millions of Java applications. The vulnerability was in a **transitive dependency** — many teams didn't even know they were using Log4j. This demonstrated the need for SBOMs to answer "do we use Log4j?" across the entire portfolio.

### Dependency Confusion (2021)

Alex Birsan discovered that by publishing public npm/PyPI packages with the same name as internal private packages, he could cause build systems to install his (benign, for research) code instead of the internal package. Real attackers now use this to deliver malware.

---

## SLSA Framework — Supply Chain Levels for Software Artifacts

SLSA (pronounced "salsa") is a Google-originated, CNCF-hosted security framework with 4 levels:

```
SLSA Level 0  No guarantees
SLSA Level 1  Build process is documented and scripted (no manual steps)
SLSA Level 2  Build uses version control + build service generates provenance
SLSA Level 3  Build service is hardened; provenance is signed and unforgeable
SLSA Level 4  (deprecated in SLSA v1.0, merged into L3)
```

**SLSA v1.0 Tracks**:
- **Build L1**: provenance exists
- **Build L2**: provenance is hosted by a build service (not the developer)
- **Build L3**: build environment is hardened (no network access during build, two-party reviews)

### SLSA Provenance

Provenance is a signed attestation describing how an artifact was built:
```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v0.2",
  "subject": [{
    "name": "myapp",
    "digest": { "sha256": "abc123..." }
  }],
  "predicate": {
    "builder": { "id": "https://github.com/actions/runner" },
    "buildType": "https://github.com/slsa-framework/slsa-github-generator",
    "invocation": {
      "configSource": {
        "uri": "git+https://github.com/myorg/myrepo@refs/heads/main",
        "digest": { "sha1": "def456..." },
        "entryPoint": ".github/workflows/build.yml"
      }
    }
  }
}
```

```yaml
# GitHub Actions — SLSA provenance generation
- uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v1.10.0
  with:
    image: ${{ needs.build.outputs.image }}
    digest: ${{ needs.build.outputs.digest }}
```

---

## Sigstore — Keyless Artifact Signing

Sigstore is a Linux Foundation project providing free, transparent, and keyless signing of software artifacts. Components:
- **cosign**: signs and verifies container images and other artifacts
- **Fulcio**: issues short-lived signing certificates (OIDC-based, no key management)
- **Rekor**: immutable, append-only transparency log of signing events

### Signing Container Images with cosign

```bash
# Install cosign
brew install cosign
# or: go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# Keyless signing (uses OIDC — works in GitHub Actions, GitLab CI)
# In GitHub Actions:
cosign sign --yes myregistry/myapp:${{ github.sha }}

# This creates a signature stored in the OCI registry:
# myregistry/myapp:sha256-<digest>.sig

# Verify signature
cosign verify \
  --certificate-identity="https://github.com/myorg/myrepo/.github/workflows/build.yml@refs/heads/main" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  myregistry/myapp:latest

# Verify with custom key (if using key-based signing)
cosign verify --key cosign.pub myregistry/myapp:latest
```

### Attaching SBOM to Image

```bash
# Attach SBOM as an OCI artifact alongside the image
cosign attach sbom --sbom sbom.cyclonedx.json myregistry/myapp:latest

# Or using oras (OCI Registry As Storage)
oras attach --artifact-type application/vnd.cyclonedx+json \
  myregistry/myapp:latest sbom.cyclonedx.json
```

### Verifying in Kubernetes (Policy Enforcement)

```yaml
# Kyverno policy — only allow signed images
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signatures
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds: [Pod]
    verifyImages:
    - imageReferences: ["myregistry/myapp:*"]
      attestors:
      - entries:
        - keyless:
            subject: "https://github.com/myorg/myrepo/*"
            issuer: "https://token.actions.githubusercontent.com"
```

---

## SBOM as Supply Chain Transparency

An SBOM enables:
1. **Vulnerability response**: "Which of our apps use OpenSSL < 3.0?" → query all SBOMs
2. **License compliance**: "Are we using any GPL-3 dependencies?"
3. **Regulatory compliance**: US EO 14028 mandates SBOMs for software sold to federal agencies

```bash
# Generate SBOM with Syft (supports 50+ ecosystems)
syft packages dir:. -o cyclonedx-json=sbom.cyclonedx.json
syft packages myimage:latest -o spdx-json=sbom.spdx.json

# Scan SBOM for vulnerabilities with Grype
grype sbom:./sbom.cyclonedx.json --fail-on critical

# Query SBOM with cdxgen
cdxgen -t java -o sbom.json .
```

---

## Dependency Confusion Attacks

### Attack
An attacker publishes a public package with the same name as your internal private package. If your package manager searches public registries first, it installs the attacker's package.

### Prevention

```bash
# npm — scope all internal packages and configure registry
# package.json
{
  "dependencies": {
    "@mycompany/internal-lib": "^1.0.0"   # scoped package
  }
}

# .npmrc — map scope to internal registry
@mycompany:registry=https://registry.mycompany.internal/
//registry.mycompany.internal/:_authToken=${NPM_TOKEN}
```

```toml
# pyproject.toml / pip.conf — internal package index
[tool.pip]
index-url = https://pypi.internal.mycompany.com/simple/
extra-index-url = https://pypi.org/simple/  # fallback for public packages
```

**Best practice**: use scoped package names (`@mycompany/`) that cannot be registered on public registries without the namespace owner's permission.

---

## Third-Party CI Actions Auditing

Every `uses: third-party/action@v1` in GitHub Actions is a supply chain trust decision:

```yaml
# Audit workflow files for unverified actions
# List all external actions used
grep -rh "uses:" .github/workflows/ | \
  grep -v "actions/" | \
  sort | uniq

# Security questions for each third-party action:
# 1. Is the action from a trusted organization?
# 2. Is it pinned to a SHA (immutable)?
# 3. Has the action been audited for malicious code?
# 4. Does it have excessive permissions?
```

Tools:
```bash
# actionlint — static analysis for GitHub Actions workflows
go install github.com/rhysd/actionlint/cmd/actionlint@latest
actionlint .github/workflows/

# zizmor — security analysis for GitHub Actions
pip install zizmor
zizmor .github/workflows/
```

---

## npm/PyPI Typosquatting

Attackers register packages with names similar to popular packages (`colorz` vs `colors`, `requsets` vs `requests`):

```bash
# Before installing an unfamiliar package:
# 1. Check the download count (low counts are suspicious)
# 2. Check the GitHub repo (empty repos, no issues, no contributors)
# 3. Verify the maintainer's identity
# 4. Check the publish date (new packages for old names are suspicious)

# Tools to detect typosquatting in your dependencies
pip install pip-audit
pip-audit  # scans installed packages against OSV database

npm audit  # built into npm
```

---

## Trusted Base Images Policy

Establish an organization policy for approved base images:

```yaml
# OPA/Gatekeeper policy — only allow approved base images
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: allow-approved-registries
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
  parameters:
    repos:
      - "gcr.io/distroless/"
      - "registry.internal.mycompany.com/"
      - "docker.io/library/"    # official Docker Hub images only
```

---

## Common Pitfalls

- **Signing artifacts without verifying at deploy time**: signing is useless without verification — enforce signature checks at the admission controller level
- **SBOM as a one-time document**: generate SBOM on every build, not once at release time
- **Trusting base image tags**: use digest-pinned base images (`FROM ubuntu@sha256:abc...`) — tags can be overwritten
- **Internal packages without namespace scoping**: unscoped internal package names are vulnerable to dependency confusion attacks

---

## Review Questions

1. How did the SolarWinds attack succeed even though the malicious code was code-signed?
2. What are the four SLSA levels, and what additional guarantee does each level provide?
3. Explain how Sigstore's keyless signing works and why it doesn't require managing private keys.
4. What is a dependency confusion attack, and how do scoped package names prevent it?
5. Why must SBOM generation happen on every build rather than once at initial release?

---

#DevSecOps #SupplyChain #SLSA #Sigstore #cosign #SBOM #SolarWinds #Security
