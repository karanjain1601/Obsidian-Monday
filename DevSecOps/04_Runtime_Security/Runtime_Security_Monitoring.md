---
title: Runtime Security Monitoring
aliases: [Falco, eBPF Security, Container Runtime Security, EDR, Tetragon]
tags: [DevSecOps, Security, RuntimeSecurity, Falco, eBPF, Kubernetes, EDR, SIEM]
domain: DevSecOps
difficulty: Advanced
created: 2026-07-29
related: [Security_Logging_and_SIEM, Incident_Response, Container_and_IaC_Security, Zero_Trust_Architecture]
status: complete
---

# Runtime Security Monitoring

> [!abstract] TL;DR
> Runtime security detects threats that static analysis and DAST cannot: a container exploiting a zero-day at 3AM, a pod making unexpected network connections, a process escalating privileges. Falco uses eBPF to intercept Linux syscalls and fire rules when containers behave suspiciously. EDR tools like CrowdStrike cover traditional VMs and endpoints. Integrate with SIEM for centralized detection and response.

---

## The Runtime Security Gap

SAST catches code vulnerabilities. SCA catches vulnerable dependencies. Container scanning catches known CVEs in images. But none of these catch:

- A container exploiting an **unknown zero-day** at runtime
- A compromised dependency that **phones home** at runtime
- A privileged process that **mounts the host filesystem** unexpectedly
- A service that suddenly **opens outbound connections** to C2 servers
- An insider who **exfiltrates data** through an API at night

Runtime security monitors what is actually happening — not what the code was supposed to do.

---

## Falco — eBPF Runtime Threat Detection

Falco (CNCF graduated project) monitors Linux system calls using eBPF probes. It fires alerts when containers or processes behave against defined rules.

### How Falco Works

```
Process                 Kernel                  Falco
───────────────────    ──────────────────      ────────────────────────────
Container exec()  →   eBPF probe captures  →   Rules engine evaluates
open("/etc/passwd")    syscall arguments        "is this allowed?"
                                                    ↓
                                          Alert: container read /etc/passwd
```

eBPF (extended Berkeley Packet Filter) probes run safely in kernel space without modifying the kernel — no kernel module required.

### Installation

```bash
# Helm install for Kubernetes
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set driver.kind=ebpf \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.slack.webhookurl=https://hooks.slack.com/...
```

### Example Falco Rules

```yaml
# /etc/falco/falco_rules.yaml

# Rule 1: shell spawned in a container
- rule: Terminal shell in container
  desc: A shell was spawned in a container
  condition: >
    evt.type = execve and
    evt.dir = < and
    container.id != host and
    proc.name in (shell_binaries)
  output: >
    Shell spawned in container
    (user=%user.name container=%container.name
     image=%container.image.repository:%container.image.tag
     shell=%proc.name parent=%proc.pname cmdline=%proc.cmdline)
  priority: WARNING
  tags: [container, shell, mitre_execution]

# Rule 2: privileged container
- rule: Launch Privileged Container
  desc: Detect the initial process started in a privileged container
  condition: >
    container_started and
    container.privileged = true
  output: >
    Privileged container started
    (user=%user.name image=%container.image.repository
     command=%proc.cmdline)
  priority: INFO

# Rule 3: unexpected network connection
- rule: Unexpected outbound connection
  desc: Container made an unexpected external network connection
  condition: >
    outbound and
    container.id != host and
    not proc.name in (allowed_outbound_processes)
  output: >
    Unexpected outbound connection
    (command=%proc.cmdline connection=%fd.name container=%container.name)
  priority: WARNING

# Rule 4: sensitive file read
- rule: Read sensitive file
  desc: An attempt to read a sensitive file
  condition: >
    open_read and
    sensitive_files and
    not proc.name in (allowed_readers)
  output: >
    Sensitive file opened for reading
    (user=%user.name file=%fd.name proc=%proc.name)
  priority: WARNING
```

### Falco + Falcosidekick — Output Routing

Falcosidekick routes Falco alerts to multiple destinations:

```yaml
# falcosidekick config
config:
  slack:
    webhookurl: "https://hooks.slack.com/services/..."
    minimumpriority: "warning"
  
  elasticsearch:
    hostport: "http://elasticsearch:9200"
    index: "falco-alerts"
    minimumpriority: "notice"
  
  pagerduty:
    routingkey: "your-integration-key"
    minimumpriority: "critical"
  
  aws:
    cloudwatchlogs:
      loggroup: "/aws/falco/alerts"
      minimumpriority: "warning"
```

---

## Cilium Tetragon — eBPF for Deep Runtime Visibility

Tetragon (Cilium's runtime security component) provides:
- **Process execution events**: every process start/stop with full lineage
- **File access events**: reads/writes to sensitive paths
- **Network events**: TCP connections with process attribution
- **System call events**: privilege escalation, namespace escapes

```yaml
# Tetragon TracingPolicy — alert on privilege escalation
apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: "monitor-privileged-syscalls"
spec:
  kprobes:
  - call: "sys_setuid"
    syscall: true
    args:
    - index: 0
      type: "int"
    selectors:
    - matchArgs:
      - index: 0
        operator: "Equal"
        values:
        - "0"   # setuid(0) = setuid to root
      matchActions:
      - action: Sigkill   # kill the process immediately
```

---

## Sysdig — Commercial Runtime Security

Sysdig extends Falco (they created it) with:
- Real-time container activity dashboard
- Drift detection (process not in original image)
- Threat intelligence integration
- Compliance posture (CIS benchmarks in real-time)

```bash
# Sysdig Inspect — record and analyze system activity
sysdig -w capture.scap    # record all syscalls to file
sysdig -r capture.scap "proc.name = ssh"   # analyze capture
sysdig -c topprocs_cpu    # show CPU usage by process
```

---

## EDR Solutions — Endpoint Detection & Response

For non-containerized workloads (VMs, physical servers, developer machines):

| Product | Company | Key feature |
|---------|---------|-------------|
| **CrowdStrike Falcon** | CrowdStrike | AI-based behavioral detection, threat hunting |
| **SentinelOne** | SentinelOne | Autonomous response (kill + rollback), no cloud required |
| **Microsoft Defender for Endpoint** | Microsoft | Deep Windows integration, SIEM-native with Sentinel |
| **Carbon Black** | VMware/Broadcom | Process tree visualization, threat hunting |

EDR monitors:
- Process creation and parent-child relationships
- File system changes (ransomware detection)
- Network connections and DNS requests
- Registry changes (Windows persistence mechanisms)
- Memory injection attempts

---

## Security Events to Monitor

| Event Category | Specific Events | Severity |
|----------------|-----------------|----------|
| Authentication | Multiple failed logins (brute force), login from new country | HIGH |
| Privilege escalation | `sudo` usage, setuid/setgid calls, capability grants | HIGH |
| Lateral movement | New internal service connections, unexpected SMB/SSH | HIGH |
| Data exfiltration | Large outbound transfers, unusual DNS queries | HIGH |
| Container anomalies | Shell in container, unexpected process, privileged exec | MEDIUM-HIGH |
| File system | Reads of `/etc/passwd`, `/etc/shadow`, SSH keys | MEDIUM |
| Persistence | New cron jobs, modified startup scripts, new services | HIGH |
| Network scanning | Port scanning from internal hosts | MEDIUM |

---

## SOAR — Security Orchestration, Automation, Response

SOAR automates repetitive security analyst tasks:

```yaml
# Conceptual SOAR playbook: Falco "shell in container" alert

trigger: Falco alert "Terminal shell in container"
actions:
  1. Enrich:
     - Get container metadata (kubectl describe pod)
     - Get Kubernetes namespace owner
     - Check if this is a known maintenance window
  
  2. Contain:
     - Capture container snapshot (docker commit)
     - Isolate pod via NetworkPolicy (block all ingress/egress)
  
  3. Notify:
     - Slack alert to #security-oncall
     - PagerDuty if after hours
     - Create Jira ticket with evidence
  
  4. Remediate (if auto-approved):
     - Kill the pod (kubectl delete pod)
     - Preserve logs to S3 for forensics
```

SOAR platforms: Splunk SOAR (Phantom), Palo Alto XSOAR, Microsoft Sentinel playbooks (Logic Apps).

---

## Common Pitfalls

- **Too many Falco rules → alert fatigue**: start with Falco's default rules, add custom rules gradually, tune noise before adding more rules
- **No baseline of normal behavior**: rules need to define what's "unexpected" — you need to understand normal first
- **Falco with kernel module in production**: eBPF driver is safer than the kernel module (no risk of kernel panic); always use `driver.kind=ebpf` in production
- **Runtime security without response plan**: alerts that go to `/dev/null` are useless — every rule needs an owner and a response runbook
- **EDR on containers is wrong**: containers are ephemeral; use Falco for containers, EDR for VMs/physical hosts

---

## Review Questions

1. What types of threats can runtime security detect that SAST and container scanning cannot?
2. Explain how eBPF allows Falco to monitor syscalls without kernel module risks.
3. Write a Falco rule that alerts when a container reads `/etc/passwd`.
4. What is Cilium Tetragon's `Sigkill` action and when would you use it?
5. What is a SOAR playbook and what are the four phases of automated response?

---

#DevSecOps #RuntimeSecurity #Falco #eBPF #EDR #Kubernetes #Security #SOAR
