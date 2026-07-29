---
title: Zero Trust Architecture
aliases: [ZTA, Zero Trust, BeyondCorp, Never Trust Always Verify]
tags: [DevSecOps, Security, ZeroTrust, BeyondCorp, IAM, Microsegmentation]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [DevSecOps_Overview, Secure_Coding_Practices, Policy_as_Code, Runtime_Security_Monitoring]
status: complete
---

# Zero Trust Architecture

> [!abstract] TL;DR
> Zero Trust Architecture (ZTA) eliminates implicit trust — every request is authenticated, authorized, and encrypted regardless of whether it originates inside or outside the network perimeter. The core mantra: "never trust, always verify." This model defeats lateral movement attacks that exploit assumed internal trust.

---

## Why Zero Trust Matters

The traditional **castle-and-moat** model: trust everything inside the network perimeter, block everything outside. This breaks down because:
- Insiders can be malicious or compromised
- Modern workloads span multiple clouds — there is no single perimeter
- Remote work means devices are outside the corporate network
- Lateral movement: an attacker who compromises one internal service can reach everything else if internal traffic is trusted

**Zero Trust outcome**: a compromised service can only reach services it is explicitly authorized to reach. Blast radius is minimized.

---

## Core Principles — NIST SP 800-207

NIST's Zero Trust Architecture framework (SP 800-207) defines three tenets:

### 1. Verify Explicitly
Authenticate and authorize every request based on all available data points:
- User identity (who)
- Device compliance (is the device managed and patch-current?)
- Location and context (unusual geography, time of day)
- Service/workload identity (which service is calling which)
- Data classification (is this request accessing sensitive data?)

### 2. Use Least Privilege Access
- Just-In-Time (JIT) access: grant elevated permissions only when needed, for a limited time window
- Just-Enough-Access (JEA): grant only the specific permissions needed for the task
- Continuously re-evaluate permissions as context changes

### 3. Assume Breach
- Minimize blast radius: microsegmentation limits what a compromised entity can reach
- End-to-end encryption even for internal traffic (mutual TLS / mTLS)
- Collect telemetry to detect anomalies and drive threat response

---

## ZTA Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Control Plane                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │ Identity     │   │ Policy       │   │ Security       │  │
│  │ Provider     │   │ Decision     │   │ Intelligence   │  │
│  │ (IdP/SSO)    │   │ Point (PDP)  │   │ (SIEM/logs)    │  │
│  └──────────────┘   └──────────────┘   └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼ Policy Decision
┌─────────────────────────────────────────────────────────────┐
│                    Data Plane                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Policy Enforcement Point (PEP)              │  │
│  │   (API Gateway, Service Mesh, Network Proxy)         │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                              │                    │
│  ┌──────┴───────┐              ┌───────┴──────┐            │
│  │  Resource A  │              │  Resource B  │            │
│  │  (Service)   │              │  (Database)  │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

- **Identity Provider (IdP)**: Okta, Azure AD, Google Workspace — authenticates users and workloads
- **Policy Decision Point (PDP)**: evaluates policies and returns allow/deny (OPA/Gatekeeper)
- **Policy Enforcement Point (PEP)**: enforces the PDP decision at the network/application layer (Istio, API gateway, BeyondCorp proxy)

---

## Google BeyondCorp Model

Google's real-world implementation of Zero Trust for enterprise access, deployed after the Operation Aurora attack in 2010:

**Key insight**: **Access level is determined by device and user context, not network location.**

Before BeyondCorp: VPN → internal network → trust everything
After BeyondCorp: no VPN → every request evaluated against device inventory + user identity + access policy

```
User Request → BeyondCorp Proxy (PEP)
                    │
                    ├── Is device managed? (Device Inventory DB)
                    ├── Is device patch-current? (Device Certificate)
                    ├── Is user authenticated? (SSO + MFA)
                    └── Does user+device have access to this resource? (Access Policy)
                                │
                        Allow or Deny → Log to SIEM
```

**Workload identity in BeyondCorp**: services authenticate with workload certificates (SPIFFE/SPIRE), not network location.

---

## Microsegmentation

Microsegmentation divides the network into small zones with fine-grained access controls between them:

```yaml
# Kubernetes NetworkPolicy — microsegmentation
# Only allow the 'api' service to talk to 'database' on port 5432
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-database
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: database
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-service
    ports:
    - protocol: TCP
      port: 5432
```

```yaml
# Default deny all — start with zero access, add only what's needed
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}       # applies to ALL pods
  policyTypes:
  - Ingress
  - Egress
  # No ingress or egress rules = deny all
```

---

## Zero Trust in Cloud Environments

### AWS — Identity-Centric Zero Trust

```json
// IAM Policy with condition-based trust (Zero Trust principles)
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::sensitive-data/*",
    "Condition": {
      "StringEquals": {
        "aws:PrincipalTag/department": "finance"
      },
      "Bool": {
        "aws:MultiFactorAuthPresent": "true"  // require MFA
      },
      "IpAddress": {
        "aws:SourceIp": ["10.0.0.0/8"]  // internal network only
      }
    }
  }]
}
```

AWS Zero Trust building blocks:
- **AWS IAM Identity Center** (SSO + attribute-based access)
- **AWS Verified Access** (BeyondCorp-style application access without VPN)
- **VPC Security Groups + NACLs** (microsegmentation)
- **AWS PrivateLink** (private connectivity without public internet exposure)

### Azure — Conditional Access

Azure AD Conditional Access enforces ZTA policies:

```
Policy: "Block access to Finance App unless:"
  ├── User is in 'Finance' group AND
  ├── Device is Intune-managed AND compliant AND
  ├── MFA completed AND
  └── Sign-in risk is Low
```

### Istio Service Mesh — mTLS for Service-to-Service ZTA

```yaml
# Istio PeerAuthentication — enforce mTLS for all services
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT    # reject plaintext traffic

---
# AuthorizationPolicy — only allow 'frontend' to call 'api'
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: api-authz
  namespace: production
spec:
  selector:
    matchLabels:
      app: api
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/production/sa/frontend"]
```

---

## SPIFFE/SPIRE — Workload Identity

SPIFFE (Secure Production Identity Framework For Everyone) provides cryptographic workload identities without passwords:

```bash
# SPIRE agent issues SVIDs (SPIFFE Verifiable Identity Documents)
# Each workload gets a certificate with its SPIFFE ID:
# spiffe://example.org/ns/production/sa/api-service

# Services authenticate to each other using mTLS with SPIFFE certificates
# No passwords, no API keys — just cryptographic identity
```

---

## ZTA Maturity Model

| Stage | Characteristics |
|-------|-----------------|
| **0 — Traditional** | VPN + network perimeter, implicit internal trust |
| **1 — Identity-Centric** | SSO + MFA for all users; no implicit trust for auth |
| **2 — Device Trust** | Device compliance enforced before access (MDM/EDR) |
| **3 — Workload Identity** | Service-to-service mTLS (Istio); no implicit inter-service trust |
| **4 — Continuous Verification** | Real-time risk scoring; context-aware access revocation |

---

## Common Pitfalls

- **Treating ZTA as a product**: ZTA is an architecture philosophy, not a single vendor product to buy
- **Starting with network segmentation only**: ZTA requires identity-first thinking; network controls alone are insufficient
- **Ignoring service-to-service trust**: many ZTA implementations focus on user access but leave service-to-service calls implicitly trusted
- **SPOF on the IdP**: if the identity provider goes down, no one can access anything — IdP must be HA with fallback mechanisms
- **Overcomplicating day one**: start with SSO + MFA + phishing-resistant 2FA, then layer in device trust and workload identity

---

## Review Questions

1. What are the three core tenets of NIST SP 800-207 Zero Trust Architecture?
2. How does Google BeyondCorp differ from a traditional VPN-based access model?
3. Write a Kubernetes NetworkPolicy that enforces default-deny-all for a namespace.
4. What is SPIFFE/SPIRE, and what problem does it solve for service-to-service authentication?
5. At what ZTA maturity stage does mTLS for service-to-service communication occur?

---

#DevSecOps #ZeroTrust #BeyondCorp #Microsegmentation #IAM #SPIFFE #mTLS
