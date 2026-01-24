---
title: Failover
tags: [SystemDesign, Availability, Reliability, Failover, HighAvailability]
---

# 🔁 Failover

## 🧠 Core Idea

**Failover** is an availability pattern used to ensure that a system continues to function even when a component fails.

It works by having a **backup (secondary) component** ready to take over when the **primary component** fails — enabling **minimal disruption** and **continuous service**.

> Goal: **Automatically switch to a backup system when failure occurs.**

---

## 📖 Definition

In a failover system:
- A **primary component** handles requests.
- A **secondary (backup) component** stays on standby.
- The primary is continuously **monitored for failures**.
- If failure occurs, the secondary **takes over responsibilities**.

This ensures the system remains available despite component crashes.

---

## 🎯 Why Failover Matters

- Eliminates single points of failure  
- Improves uptime and reliability  
- Ensures business continuity  
- Reduces user-facing downtime  

---

## 🧩 Types of Failover

### 1️⃣ Active-Passive Failover (Master–Slave)

#### 🧠 Concept
- Only the **active (primary)** server handles traffic.
- The **passive (secondary)** server stays on standby.
- **Heartbeats** monitor the primary.
- If heartbeat stops → passive takes over IP and service.

#### 🔥 Standby Modes
- **Hot Standby:** Secondary already running → near-zero downtime.  
- **Cold Standby:** Secondary starts after failure → longer downtime.

#### ⚙️ Characteristics
- Simple to implement  
- Lower cost than active-active  
- Only one server actively processes traffic  

---

### 2️⃣ Active-Active Failover (Master–Master)

#### 🧠 Concept
- Both servers handle traffic simultaneously.
- Load is distributed across both.
- If one fails → the other continues serving traffic.

#### ⚙️ Requirements
- DNS or Load Balancer must know both servers.
- Application must support multi-active state handling.

#### ⚙️ Characteristics
- Higher availability  
- Better performance and load distribution  
- More complex synchronization  

---

### 3️⃣ Hot-Standby

#### 🧠 Concept
- Backup server runs in parallel.
- Continuously synchronized with primary.
- Immediate takeover during failure.

---

## ⚖️ Comparison

| Failover Type | Active Servers | Downtime | Complexity | Cost |
|---------------|----------------|----------|------------|------|
| Active-Passive (Cold) | 1 | Moderate | Low | Low |
| Active-Passive (Hot) | 1 + Ready Backup | Very Low | Medium | Medium |
| Active-Active | 2 | Near Zero | High | High |

---

## ⚠️ Disadvantages of Failover

- Adds **extra hardware costs**  
- Introduces **operational complexity**  
- Potential **data loss** if writes aren’t replicated before failure  
- Requires reliable **monitoring and detection**  

---

## 🏗️ Practical Examples

- Primary–Replica Database Failover  
- Web Servers behind a Load Balancer  
- Leader election in distributed systems  

---

## 🧠 Trade-off Insight

```
Higher Availability → More Redundancy → Higher Cost & Complexity
```

---

## 🖼️ Diagram Placeholder

Add this image into your Obsidian vault:

```
![[failover-architecture-diagram.png]]
```

---

## 🔗 Related Topics

[[Availability Patterns]]  
[[Load Balancing]]  
[[Replication]]  
[[Consensus Algorithms]]  
[[Disaster Recovery]]  
[[Health Checks]]

---

## 📚 Source

- Architectural Patterns for High Availability — FileCloud  
  https://www.filecloud.com/blog/architectural-patterns-for-high-availability/

---

## 🏷️ Tags

#SystemDesign #Failover #HighAvailability #Reliability
