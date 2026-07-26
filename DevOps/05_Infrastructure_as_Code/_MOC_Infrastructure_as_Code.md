---
title: Infrastructure as Code — Section MOC
aliases: [IaC MOC, Terraform MOC]
tags: [DevOps, IaC, Terraform, MOC]
domain: DevOps
created: 2026-07-26
status: complete
---

# 🏗️ Infrastructure as Code — Section MOC

> [!abstract] Section Overview
> IaC defines infrastructure (servers, networks, databases) in version-controlled code, enabling repeatability, auditability, and drift detection. This section covers Terraform (HCL, state, modules), CloudFormation/CDK (AWS-native), Ansible (configuration management), Pulumi (general-purpose languages), and drift detection strategies.

---

## Concept Map

```mermaid
graph TD
    MOC["🏗️ Infrastructure as Code MOC"]:::moc

    TF["Terraform\n(HCL, state, modules, workspaces)"]:::note
    CF["CloudFormation & CDK\n(AWS-native stacks, L1/L2/L3 constructs)"]:::note
    ANS["Ansible\n(agentless, playbooks, roles, idempotency)"]:::note
    PUL["Pulumi\n(TypeScript/Python IaC, ComponentResource)"]:::note
    DRIFT["Drift Detection\n(plan -detailed-exitcode, import block)"]:::note

    MOC --> TF & CF & ANS & PUL & DRIFT

    TF -->|"manages"| DRIFT
    CF -->|"AWS alternative to"| TF
    PUL -->|"code-first alternative to"| TF
    ANS -->|"configures nodes provisioned by"| TF
    DRIFT -->|"applies to"| TF & CF

    classDef moc fill:#1a1a2e,stroke:#e94560,color:#fff
    classDef note fill:#16213e,stroke:#0f3460,color:#a8d8ea
```

---

## Notes in This Section

| Note | Key Concepts | Difficulty |
|------|-------------|------------|
| [[Terraform_Core_and_Modules\|Terraform Core & Modules]] | HCL DAG, state, plan+apply, modules, workspaces | Intermediate |
| [[CloudFormation_and_CDK\|CloudFormation & CDK]] | CF stacks, change sets, CDK constructs L1/L2/L3 | Intermediate |
| [[Ansible\|Ansible]] | Agentless SSH, playbooks, roles, idempotency | Beginner |
| [[Pulumi\|Pulumi]] | TypeScript/Python IaC, ComponentResource, ESC | Intermediate |
| [[Drift_Detection_and_State_Management\|Drift Detection]] | State management, drift, import, immutable infra | Advanced |

---

## Learning Path

```
Terraform Core & Modules → Drift Detection → CloudFormation & CDK
→ Ansible → Pulumi
```

---

## Related Sections

- [[_MOC_DevOps_Master|↑ DevOps Master MOC]]
- [[../06_Cloud_Platforms/_MOC_Cloud_Platforms|→ Cloud Platforms]] — IaC provisions cloud resources
- [[../04_Kubernetes/_MOC_Kubernetes|→ Kubernetes]] — Terraform provisions EKS/GKE/AKS
- [[../02_CICD_Pipelines/_MOC_CICD_Pipelines|← CI/CD]] — IaC changes flow through pipelines

---

#DevOps #IaC #Terraform #CloudFormation #Ansible #Pulumi #MOC
