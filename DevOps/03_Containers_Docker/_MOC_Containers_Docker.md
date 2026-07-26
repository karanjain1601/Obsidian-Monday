---
title: Containers & Docker — Section MOC
aliases: [Docker MOC, Containers MOC]
tags: [DevOps, Docker, Containers, MOC]
domain: DevOps
created: 2026-07-26
status: complete
---

# 🐳 Containers & Docker — Section MOC

> [!abstract] Section Overview
> Containers are Linux processes with namespace isolation and cgroup resource limits — no guest kernel. Docker provides the tooling (Dockerfile, Compose, registry) on top of the OCI specs. This section covers internals, best practices, networking, security hardening, and registry distribution.

---

## Concept Map

```mermaid
graph TD
    MOC["🐳 Containers & Docker MOC"]:::moc

    ARCH["Docker Architecture\n(namespaces, cgroups, containerd, overlay2)"]:::note
    DF["Dockerfile Best Practices\n(multi-stage, cache, distroless, secrets)"]:::note
    NET["Compose & Networking\n(bridge/host/overlay, DNS, volumes)"]:::note
    SEC["Container Security\n(non-root, capabilities, seccomp, Trivy)"]:::note
    REG["Registry & Distribution\n(OCI spec, digest pinning, cosign)"]:::note

    MOC --> ARCH & DF & NET & SEC & REG

    ARCH -->|"build layers"| DF
    DF -->|"push to"| REG
    REG -->|"pull + run"| ARCH
    ARCH -->|"network namespaces"| NET
    SEC -->|"hardens"| ARCH & DF
    REG -->|"supply chain"| SEC

    classDef moc fill:#1a1a2e,stroke:#e94560,color:#fff
    classDef note fill:#16213e,stroke:#0f3460,color:#a8d8ea
```

---

## Notes in This Section

| Note | Key Concepts | Difficulty |
|------|-------------|------------|
| [[Docker_Architecture_and_Internals\|Docker Architecture]] | namespaces, cgroups, containerd, runc, overlay2, OCI | Intermediate |
| [[Dockerfile_Best_Practices\|Dockerfile Best Practices]] | multi-stage, cache ordering, base ladder, BuildKit secrets | Intermediate |
| [[Docker_Compose_and_Networking\|Docker Compose & Networking]] | Compose v3 YAML, bridge/host/overlay, DNS, volumes | Beginner |
| [[Container_Security_and_Hardening\|Container Security]] | non-root, capabilities, seccomp, AppArmor, Trivy, SBOM | Advanced |
| [[Container_Registry_and_Distribution\|Registry & Distribution]] | OCI distribution spec, digest pinning, Notary/cosign | Intermediate |

---

## Learning Path

```
Docker Architecture → Dockerfile Best Practices → Docker Compose & Networking
→ Container Registry → Container Security
```

---

## Risk Formula Reference

```
Container residual risk = R₀ × ∏(1 - mᵢ)

Where:
  R₀ = base risk score (e.g., CVE severity × exploitability)
  mᵢ = mitigation effectiveness of control i

Example: R₀=0.8, non-root(m₁=0.4), read-only-rootfs(m₂=0.3), seccomp(m₃=0.2)
Residual = 0.8 × (1-0.4) × (1-0.3) × (1-0.2)
         = 0.8 × 0.6 × 0.7 × 0.8 = 0.269
```

---

## Related Sections

- [[_MOC_DevOps_Master|↑ DevOps Master MOC]]
- [[../04_Kubernetes/_MOC_Kubernetes|→ Kubernetes]] — containers run in Pods
- [[../02_CICD_Pipelines/_MOC_CICD_Pipelines|← CI/CD Pipelines]] — build and push images

---

#DevOps #Docker #Containers #MOC
