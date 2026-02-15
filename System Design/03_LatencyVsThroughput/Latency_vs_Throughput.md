---
title: Latency vs Throughput
tags: [SystemDesign, Performance, Latency, Throughput]
---

# ⏱️ Latency vs Throughput

## 🧠 Core Idea

**Latency** and **Throughput** are two fundamental performance metrics used to evaluate how a system behaves under load.

> **Latency** = Time taken to process a **single request**.  
> **Throughput** = Number of **requests processed per unit time**.

A well-designed system aims for:

> **Maximum Throughput with Acceptable Latency**

---

```handwritten-ink
{
	"versionAtEmbed": "0.3.4",
	"filepath": "Ink/Writing/2026.2.15 - 22.06pm.writing"
}
```

## 📖 Definitions

### ⏳ Latency
- Measures **response time** of a system.
- Typically measured in milliseconds (ms).
- Includes:
  - Network delay
  - Processing time
  - Queueing time
  - Disk I/O delay

> High latency means users experience slow responses.

---

### 🚀 Throughput
- Measures **work completed per unit time**.
- Common units:
  - Requests per second (RPS)
  - Transactions per second (TPS)
  - Messages per second

> High throughput means the system can handle many requests concurrently.

---

## 🔍 Practical Distinction

| Scenario | Observation | Issue |
|----------|-------------|-------|
| Single user request takes long time | High Latency | Performance problem |
| Many users cause slowdown | Low Throughput | Scalability bottleneck |
| Fast single response + handles many users | Low Latency + High Throughput | Ideal system |

---

## 🧩 Examples

### ❌ High Latency System
- Request takes 3 seconds to respond.
- Root cause: slow database query or remote API call.

### ❌ Low Throughput System
- Each request is fast.
- But system crashes or slows when many users connect.
- Root cause: limited worker threads or unscaled services.

### ✅ Good System
- Responds quickly.
- Handles many concurrent requests efficiently.

---

## ⚖️ Relationship

Reducing Latency → Improves user experience
Increasing Throughput → Improves system capacity
``

Trade-off:
- Optimizing throughput may increase latency due to batching or queueing.
- Optimizing latency may reduce throughput due to resource reservation.

---

## 📊 Conceptual Visualization

### Latency Focus
Single Request → Faster Response

### Throughput Focus

More Requests → More Completed Work per Second

---

## 🖼️ Diagram Placeholders

Add these images into your Obsidian vault:

```
![[latency-vs-throughput-graph.png]]
![[queueing-latency-diagram.png]]
```

---

## 🧠 Why This Matters in System Design

- User-facing systems prioritize **low latency**.
- Batch and data-processing systems prioritize **high throughput**.
- Large-scale systems must balance both based on workload type.

---

## 🔗 Related Topics

[[Performance vs Scalability]]  
[[Load Balancing]]  
[[Caching]]  
[[Queueing Systems]]  
[[Bottlenecks]]  
[[Capacity Estimation]]

---

## 📚 Sources

- CS.fyi — *Latency vs Throughput*  
  https://cs.fyi/guide/latency-vs-throughput

- Cadence Blog — *Understanding Latency vs Throughput*  
  https://community.cadence.com/cadence_blogs_8/b/fv/posts/understanding-latency-vs-throughput

---

## 🏷️ Tags

```
#SystemDesign #Latency #Throughput #Performance
```
