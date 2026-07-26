---
title: "Latency vs Throughput — Map of Content"
tags: [MOC, SystemDesign, LatencyVsThroughput]
domain: SystemDesign
created: 2026-07-26
---

# ⏱ Latency vs Throughput — Map of Content

> [!abstract] What This Section Covers
> Latency is the time a single request takes from start to finish. Throughput is the number of requests a system can handle per unit of time. This section examines why these two metrics often pull in opposite directions, introduces Little's Law as the connecting formula, and covers the practical trade-offs engineers navigate when tuning systems for one versus the other.

## Concept Map

```mermaid
graph TD
    CENTER["⏱ Latency vs Throughput"]

    CENTER --> LAT["Latency"]
    CENTER --> THRU["Throughput"]
    CENTER --> LITTLE["Little's Law\nL = λW"]
    CENTER --> TRADEOFFS["Trade-offs"]

    LAT --> P99["P50 / P95 / P99\nPercentile Latency"]
    LAT --> Sources["Sources of Latency\n(network, disk, compute)"]

    THRU --> QPS["Queries Per Second"]
    THRU --> Bandwidth["Bandwidth Constraints"]

    TRADEOFFS --> BatchVsStream["Batching vs Streaming"]
    TRADEOFFS --> Concurrency["Concurrency & Queuing"]
    TRADEOFFS --> Caching["Caching to Reduce Latency"]

    style CENTER fill:#7c3aed,color:#fff
    style LAT fill:#4a9eff,color:#fff
    style THRU fill:#7ed321,color:#fff
    style LITTLE fill:#f5a623,color:#fff
```

## Learning Path

1. [[Latency_vs_Throughput]] — Definitions, Little's Law, the latency/throughput tension, and design strategies

## All Notes at a Glance

| Note | Summary | Difficulty |
|------|---------|------------|
| [[Latency_vs_Throughput]] | Explains latency and throughput, introduces Little's Law, and covers the fundamental tension between the two | Beginner |

## Key Questions This Section Answers

- What is the difference between latency and throughput?
- Why does optimizing for lower latency sometimes reduce throughput (and vice versa)?
- What is Little's Law (L = λW) and how do you apply it to capacity planning?
- What is the difference between mean latency and P99 latency, and why does P99 matter?
- How does batching increase throughput while increasing individual request latency?
- What are the dominant sources of latency in a distributed system (network RTT, serialization, disk I/O)?
- How do you set latency and throughput targets for a system design interview?

## Related Sections

- [[_MOC_SystemDesign_Master|↑ System Design Master MOC]]
- [[_MOC_Introduction|← Introduction]]
- [[_MOC_PerformanceVsScalability|← Performance vs Scalability]]
- [[_MOC_AvailabilityPatterns|→ Availability Patterns]]

#MOC #SystemDesign #LatencyVsThroughput
