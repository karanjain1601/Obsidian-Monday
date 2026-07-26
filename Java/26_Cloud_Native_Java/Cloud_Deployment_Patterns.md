---
title: "Cloud Deployment Patterns"
aliases: ["Deployment Strategies", "Blue-Green Deployment", "Canary Deployment"]
tags: [java, devops, cloud-native, deployment, intermediate]
domain: Java
difficulty: intermediate
created: 2026-07-26
related: ["[[Kubernetes_Java]]", "[[Docker_Java]]", "[[Spring_Cloud_Config]]", "[[_MOC_Cloud_Native_Java]]"]
status: complete
---

# 🚀 Cloud Deployment Patterns

> [!abstract] TL;DR
> Cloud deployment patterns let you ship new versions of Java services **without downtime and with controlled risk**. The three core strategies are **rolling updates** (gradual pod-by-pod replacement), **blue-green deployments** (maintain two identical environments and flip traffic instantly), and **canary deployments** (route a small percentage of real traffic to the new version first). Feature flags add an additional layer of runtime control over what users see independently of deployment.

## Intuition — analogy FIRST

Deploying software is like renovating a restaurant while keeping it open. A **rolling update** is like renovating one table at a time — most guests keep eating while you update each area gradually. A **blue-green deployment** is like building a brand-new restaurant next door, fully decorated and tested, then flipping the sign on the door — instant switch, and the old restaurant is kept ready for immediate rollback. A **canary deployment** is like inviting a small group of trusted food critics (1% of traffic) to try the new menu before serving it to all guests — if they complain, you stop. Feature flags are like a switch behind the kitchen counter that lets you enable the new dish for specific customers without deploying new code.

---

## How It Works

```mermaid
graph TD
    Traffic["User Traffic\n(100%)"] --> LB["Load Balancer\n/ Ingress"]

    subgraph Blue-Green
        LB -->|"100%"| Blue["Blue (v1)\n(standby after switch)"]
        LB -->|"0% → 100%"| Green["Green (v2)\n(new version)"]
    end

    subgraph Canary
        LB2["Load Balancer"] -->|"95%"| Stable["Stable (v1)"]
        LB2 -->|"5%"| Canary["Canary (v2)"]
    end

    subgraph Rolling
        Pod1["Pod v1"] -->|"replaced by"| Pod1New["Pod v2"]
        Pod2["Pod v1"] -->|"still running"| Pod2x["Pod v1"]
    end

    style Blue fill:#4a9eff,color:#fff
    style Green fill:#7ed321,color:#fff
    style Canary fill:#f5a623,color:#fff
    style Stable fill:#4a9eff,color:#fff
```

## Key Concepts / Details

### Rolling Update (Default in Kubernetes)

```yaml
# Kubernetes Deployment — Rolling Update (default)
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # allow 1 extra pod during rollout
      maxUnavailable: 0   # never reduce below desired count
```

**Process:** Kubernetes replaces Pods one (or a few) at a time. New Pods must pass readiness probes before old ones are terminated.

| Aspect | Value |
|--------|-------|
| Downtime | Zero (if readiness probes are correct) |
| Rollback speed | Slow — must roll forward again or do another rolling update |
| Resource overhead | Low — `maxSurge: 1` means only one extra pod |
| Traffic mixing | Yes — briefly runs two versions simultaneously |

### Blue-Green Deployment

```yaml
# Kubernetes: Two Deployments, one Service selector switch
# Blue (v1)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service-blue
  labels: { version: blue }
spec:
  template:
    metadata:
      labels: { app: order-service, version: blue }

---
# Green (v2)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service-green
  labels: { version: green }
spec:
  template:
    metadata:
      labels: { app: order-service, version: green }

---
# Service — flip selector to switch all traffic
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
    version: green   # was "blue" — change this to switch 100% traffic
```

**Rollback:** Change `version: green` back to `version: blue` — takes effect in seconds.

| Aspect | Value |
|--------|-------|
| Downtime | Near-zero (Service selector update is near-instant) |
| Rollback speed | Instant — flip selector back |
| Resource overhead | 2× — both environments fully running simultaneously |
| Traffic mixing | No — all traffic on one version at a time |

### Canary Deployment

```yaml
# v1: 19 replicas, v2: 1 replica → 5% canary traffic
# Kubernetes: Same label selector, different replica counts
apiVersion: apps/v1
kind: Deployment
metadata: { name: order-service-canary }
spec:
  replicas: 1   # 5% of traffic when stable has 19 replicas
  template:
    metadata:
      labels: { app: order-service }  # Same selector as stable!
    spec:
      containers:
        - name: order-service
          image: myregistry/order-service:2.0.0  # new version
```

For precise traffic splitting, use an Ingress controller or service mesh:

```yaml
# Istio VirtualService — 5% canary traffic
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata: { name: order-service }
spec:
  http:
    - route:
        - destination: { host: order-service-stable }
          weight: 95
        - destination: { host: order-service-canary }
          weight: 5
```

### Feature Flags

Feature flags decouple **deployment** from **release** — code is deployed but features are toggled per user, region, or percentage.

```java
// Using Unleash or LaunchDarkly
@Service
public class OrderService {
    private final Unleash unleash;

    public Order createOrder(OrderRequest req) {
        if (unleash.isEnabled("new-pricing-engine")) {
            return newPricingEngine.price(req);
        }
        return legacyPricingEngine.price(req);
    }
}
```

```yaml
# Spring Boot with Flipt / LaunchDarkly
spring:
  cloud:
    openfeatureapi:
      enabled: true
      provider: launchdarkly
```

### 12-Factor App Configuration

| Factor | Principle | Java/Spring Implementation |
|--------|-----------|---------------------------|
| **III Config** | Store config in env, not code | `@Value("${DB_URL}")`, Spring Cloud Config |
| **IV Backing services** | Treat DB, MQ as attached resources | JDBC URL from env var |
| **IX Disposability** | Fast startup, graceful shutdown | Spring graceful shutdown, readiness probes |
| **X Dev/prod parity** | Keep environments similar | Testcontainers in tests, same Docker image |
| **XI Logs** | Treat logs as event streams | Structured JSON logging → stdout |

### Deployment Pipeline Checklist

```
CI/CD Pipeline:
1. Build Docker image (multi-stage)
2. Run unit + integration tests
3. Run security scan (trivy/snyk)
4. Push to registry with SHA tag
5. Deploy to staging (rolling update)
6. Run smoke tests + canary analysis
7. Promote to production (blue-green or canary)
8. Monitor error rate + latency for 30 min
9. Fully promote or rollback based on SLO
```

## Real-World Notes

- **Blue-green costs 2× resources** — accept this cost in environments where rollback speed is critical (payments, core banking). Use rolling updates for non-critical services.
- **Canary requires observability** — you cannot judge a canary deployment without monitoring error rates, latency p99, and business metrics (conversion rates) for both versions.
- **Feature flags as a safety net** — even with blue-green, keeping a feature flag allows instant disable of a feature without redeployment.
- **Database migrations and deployments must be compatible** — with rolling updates and blue-green, v1 and v2 both run against the same database simultaneously during transition. Migrations must be backward-compatible (add columns, never remove until old version is gone).

## Common Pitfalls

- **Rolling update + incompatible DB migration** — if v2 renames a column that v1 still reads, pods from both versions crash during the transition window.
- **No readiness probe** — rolling updates without readiness probes will send traffic to pods that haven't finished starting, causing request failures.
- **Canary without sufficient traffic** — 1 canary pod in a low-traffic system gets almost no traffic; wait for statistically significant samples before judging success.
- **Forgetting to clean up blue/standby environment** — blue-green costs 2× resources; decommission the standby after a successful deployment and observation period.

## Related Concepts
- [[Kubernetes_Java]] — Deployment spec, rolling updates, health probes
- [[Spring_Cloud_Config]] — Config refresh during deployments without restart
- [[Docker_Java]] — Building and tagging images for deployment pipelines

## Review Questions
1. What is the key operational trade-off between a rolling update and a blue-green deployment?
2. Why do database migrations need special care in rolling update deployments?
3. How do feature flags differ from canary deployments in controlling feature exposure?

## Sources
- Martin Fowler — BlueGreenDeployment — https://martinfowler.com/bliki/BlueGreenDeployment.html
- Kubernetes Deployment Strategies — https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy
- 12-Factor App — https://12factor.net/

#java #devops #deployment #kubernetes #cloud-native #blue-green #canary
