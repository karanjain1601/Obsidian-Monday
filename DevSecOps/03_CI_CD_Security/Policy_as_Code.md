---
title: Policy as Code
aliases: [OPA, Open Policy Agent, Rego, Gatekeeper, Conftest, Policy Enforcement]
tags: [DevSecOps, Security, PolicyAsCode, OPA, Rego, Gatekeeper, Conftest, Kubernetes]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [Container_and_IaC_Security, Security_in_CICD_Pipeline, Supply_Chain_Security, Compliance_Automation]
status: complete
---

# Policy as Code

> [!abstract] TL;DR
> Policy as Code expresses security and compliance rules as version-controlled, testable code — instead of wiki documents that nobody reads. OPA (Open Policy Agent) with Rego is the most widely used policy engine. Gatekeeper enforces policies as Kubernetes admission webhooks; Conftest applies the same policies to Terraform, Dockerfiles, and Kubernetes manifests in CI.

---

## Why Policy as Code?

Traditional approach: security policies as wiki pages or spreadsheets. Problems:
- Nobody reads them
- They drift out of date
- No automated enforcement
- No testability — "does this configuration comply?" requires manual review
- Compliance audits are manual, slow, and point-in-time

**Policy as Code** makes policies:
- **Executable**: run `conftest test` in CI and get a pass/fail
- **Testable**: write unit tests for your policies
- **Auditable**: git history shows exactly when a policy changed and who approved it
- **Consistent**: same policy enforced in CI and in the cluster

---

## OPA — Open Policy Agent

OPA is a general-purpose policy engine. It decouples policy decision from policy enforcement:

```
Your App                    OPA
──────────────────────     ─────────────────────────────────
request → "Is this user   → Evaluate Rego policy against
           allowed to        input data
           delete the        ↓
           record?"       ← { "allow": true/false, "reason": "..." }
```

OPA is used for:
- Kubernetes admission control (via Gatekeeper)
- API authorization
- Terraform plan evaluation
- CI/CD gate decisions

---

## Rego — OPA's Policy Language

Rego is a declarative logic language:

```rego
# policy/kubernetes/no_root_containers.rego
package kubernetes.admission

# Deny if any container runs as root
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.securityContext.runAsNonRoot
  msg := sprintf("Container '%s' must set runAsNonRoot: true", [container.name])
}

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.runAsUser == 0
  msg := sprintf("Container '%s' must not run as root (UID 0)", [container.name])
}
```

```rego
# policy/terraform/no_public_s3.rego
package terraform.aws.s3

import input.plan as plan

deny[msg] {
  resource := plan.resource_changes[_]
  resource.type == "aws_s3_bucket_acl"
  resource.change.after.acl == "public-read"
  msg := sprintf("S3 bucket '%s' must not be publicly readable", [resource.name])
}
```

### Testing Rego Policies

```rego
# policy/kubernetes/no_root_containers_test.rego
package kubernetes.admission

# Test: a pod with runAsNonRoot=true should be allowed
test_allow_non_root {
  not deny[_] with input as {
    "request": {
      "kind": {"kind": "Pod"},
      "object": {"spec": {"containers": [
        {"name": "myapp", "securityContext": {"runAsNonRoot": true}}
      ]}}
    }
  }
}

# Test: a pod without runAsNonRoot should be denied
test_deny_root_container {
  deny[_] with input as {
    "request": {
      "kind": {"kind": "Pod"},
      "object": {"spec": {"containers": [
        {"name": "myapp", "securityContext": {}}
      ]}}
    }
  }
}
```

```bash
# Run OPA tests
opa test ./policy/ -v

# Evaluate a policy against input
opa eval \
  --data policy/kubernetes/no_root_containers.rego \
  --input pod.json \
  'data.kubernetes.admission.deny'
```

---

## Gatekeeper — OPA for Kubernetes

Gatekeeper is an OPA-based Kubernetes admission controller that enforces policies at the cluster level:

```
kubectl apply | API Server → Gatekeeper (webhook) → OPA policy evaluation
                                                        ↓
                                               Allow or Reject with reason
```

### Installation

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
```

### ConstraintTemplate — Define a Policy Type

```yaml
# constraint-template-no-root.yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8snoroot
spec:
  crd:
    spec:
      names:
        kind: K8sNoRoot
  targets:
  - target: admission.k8s.gatekeeper.sh
    rego: |
      package k8snoroot

      violation[{"msg": msg}] {
        container := input.review.object.spec.containers[_]
        not container.securityContext.runAsNonRoot
        msg := sprintf("Container '%s' must set runAsNonRoot: true", [container.name])
      }
```

### Constraint — Apply the Policy

```yaml
# constraint-no-root.yaml — enforce no-root on all namespaces except kube-system
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sNoRoot
metadata:
  name: no-root-containers
spec:
  enforcementAction: deny      # or: warn (audit mode), dryrun
  match:
    kinds:
    - apiGroups: ["apps"]
      kinds: ["Deployment", "DaemonSet", "StatefulSet"]
    excludedNamespaces:
    - kube-system
    - gatekeeper-system
```

### Image Registry Allowlist

```yaml
# ConstraintTemplate
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8sallowedrepos
spec:
  crd:
    spec:
      names:
        kind: K8sAllowedRepos
      validation:
        openAPIV3Schema:
          type: object
          properties:
            repos:
              type: array
              items:
                type: string
  targets:
  - target: admission.k8s.gatekeeper.sh
    rego: |
      package k8sallowedrepos
      violation[{"msg": msg}] {
        container := input.review.object.spec.containers[_]
        not startswith(container.image, input.parameters.repos[_])
        msg := sprintf("Image '%s' is not from an approved registry", [container.image])
      }
---
# Constraint
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: allowed-repos
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
  parameters:
    repos:
      - "gcr.io/distroless/"
      - "registry.mycompany.com/"
```

---

## Conftest — Policy Testing in CI

Conftest applies OPA policies to structured data files (Terraform plans, Kubernetes manifests, Dockerfiles) in CI — before deployment:

```bash
# Install conftest
brew install conftest

# Test Kubernetes manifests against policies
conftest test k8s/deployment.yaml --policy policy/kubernetes/

# Test Terraform plan
terraform plan -out=plan.tfplan
terraform show -json plan.tfplan > plan.json
conftest test plan.json --policy policy/terraform/ --namespace terraform

# Test Dockerfile
conftest test Dockerfile --policy policy/docker/ --all-namespaces

# Test multiple files
conftest test k8s/*.yaml --policy policy/ --output json
```

```yaml
# GitHub Actions — Conftest in CI
- name: Conftest Policy Check
  run: |
    conftest test k8s/ --policy policy/ --output github
  # --output github formats output as GitHub Actions annotations
```

---

## HashiCorp Sentinel

Sentinel is HashiCorp's policy-as-code framework built into Terraform Cloud/Enterprise, Vault Enterprise, and Consul Enterprise:

```hcl
# Sentinel policy — require specific EC2 instance types
import "tfplan/v2" as tfplan

allowed_instance_types = ["t3.micro", "t3.small", "t3.medium"]

# Get all EC2 instances from the Terraform plan
ec2_instances = filter tfplan.resource_changes as _, rc {
  rc.type is "aws_instance" and
  rc.mode is "managed" and
  (rc.change.actions contains "create" or rc.change.actions contains "update")
}

# Check instance types
check_instance_types = rule {
  all ec2_instances as _, instance {
    instance.change.after.instance_type in allowed_instance_types
  }
}

main = rule {
  check_instance_types
}
```

---

## AWS SCPs — Service Control Policies

SCPs are OUs/account-level guardrails in AWS Organizations — they limit what any principal in the account can do, even the root user:

```json
// SCP — deny disabling CloudTrail
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": [
      "cloudtrail:StopLogging",
      "cloudtrail:DeleteTrail",
      "cloudtrail:PutEventSelectors"
    ],
    "Resource": "*"
  }]
}
```

```json
// SCP — require MFA for sensitive operations
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": ["iam:*", "cloudtrail:*"],
    "Resource": "*",
    "Condition": {
      "BoolIfExists": {
        "aws:MultiFactorAuthPresent": "false"
      }
    }
  }]
}
```

---

## CIS Benchmark Automated Checks

```bash
# AWS CIS Benchmark with Prowler
pip install prowler
prowler aws --compliance cis_aws_3.0.0

# Kubernetes CIS Benchmark with kube-bench
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl logs -l app=kube-bench

# Linux CIS Benchmark with Lynis
lynis audit system
```

---

## Common Pitfalls

- **`enforcementAction: warn` left in production**: audit/warn mode doesn't block — it's for initial rollout only. Graduate to `deny` once the policy is stable
- **Policies without tests**: untested Rego policies have silent bugs; every policy must have a unit test suite
- **OPA as a synchronous call in critical paths**: OPA policy evaluation adds latency. Cache decisions where possible; use async evaluation for non-blocking flows
- **Conflicting policies**: multiple Gatekeeper constraints can interact unexpectedly — test policy combinations in a staging cluster

---

## Review Questions

1. Write a Rego policy that denies Kubernetes pods that don't set `readOnlyRootFilesystem: true`.
2. What is the difference between a ConstraintTemplate and a Constraint in Gatekeeper?
3. How does Conftest enable policy-as-code testing in a CI pipeline without a running Kubernetes cluster?
4. What is an AWS SCP and how does it differ from an IAM policy?
5. What is `enforcementAction: warn` in Gatekeeper used for, and why should it not stay in production indefinitely?

---

#DevSecOps #PolicyAsCode #OPA #Rego #Gatekeeper #Conftest #Kubernetes #Compliance #Security
