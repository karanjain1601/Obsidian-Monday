---
title: Kubernetes — Section MOC
aliases: [K8s MOC, Kubernetes MOC]
tags: [DevOps, Kubernetes, MOC]
domain: DevOps
created: 2026-07-26
status: complete
---

# ☸️ Kubernetes — Section MOC

> [!abstract] Section Overview
> Kubernetes is a declarative container orchestration platform. Controllers reconcile desired state (Git/YAML) with actual state (cluster). This section covers core concepts (Pod, Deployment, RBAC), networking (CNI, Services, Ingress), storage (PV/PVC, StatefulSets), Helm package management, and the Operator/CRD extension model.

---

## Concept Map

```mermaid
graph TD
    MOC["☸️ Kubernetes MOC"]:::moc

    CORE["Core Concepts\n(Pod, Deployment, RBAC, Namespaces)"]:::note
    NET["Networking & Ingress\n(CNI, Services, CoreDNS, Gateway API)"]:::note
    STO["Storage & StatefulSets\n(PV/PVC, StorageClass, CSI)"]:::note
    HLM["Helm Charts\n(Go templates, values, releases)"]:::note
    OPR["Operators & CRDs\n(reconcile loop, Kubebuilder)"]:::note

    MOC --> CORE & NET & STO & HLM & OPR

    CORE -->|"expose Pods"| NET
    CORE -->|"mount volumes"| STO
    NET -->|"traffic to Pods"| CORE
    STO -->|"used by"| OPR
    OPR -->|"deploy via"| HLM
    HLM -->|"templates"| CORE

    classDef moc fill:#1a1a2e,stroke:#e94560,color:#fff
    classDef note fill:#16213e,stroke:#0f3460,color:#a8d8ea
```

---

## Notes in This Section

| Note | Key Concepts | Difficulty |
|------|-------------|------------|
| [[Kubernetes_Core_Concepts\|K8s Core Concepts]] | Pod, Deployment, probes, RBAC, ResourceQuota | Intermediate |
| [[Kubernetes_Networking_and_Ingress\|Networking & Ingress]] | CNI, Services, kube-proxy, CoreDNS, Gateway API | Advanced |
| [[Storage_and_StatefulSets\|Storage & StatefulSets]] | PV/PVC, StorageClass, StatefulSet, CSI, PDB | Advanced |
| [[Helm_Charts\|Helm Charts]] | chart structure, Go templates, releases, helmfile | Intermediate |
| [[Operators_and_CRDs\|Operators & CRDs]] | CRD, reconcile loop, Kubebuilder, OLM | Advanced |

---

## Learning Path

```
K8s Core Concepts → Networking & Ingress → Storage & StatefulSets
→ Helm Charts → Operators & CRDs
```

---

## Related Sections

- [[_MOC_DevOps_Master|↑ DevOps Master MOC]]
- [[../03_Containers_Docker/_MOC_Containers_Docker|← Containers & Docker]] — containers run in Pods
- [[../02_CICD_Pipelines/ArgoCD_and_GitOps|← ArgoCD & GitOps]] — deploys to K8s
- [[../07_Monitoring_Observability/_MOC_Monitoring_Observability|→ Observability]] — K8s emits metrics/logs/traces

---

#DevOps #Kubernetes #K8s #MOC
