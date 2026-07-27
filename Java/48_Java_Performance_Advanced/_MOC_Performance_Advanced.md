---
title: "Java Performance Advanced — Map of Content"
aliases: ["MOC Performance Advanced", "MOC JVM Performance"]
tags: [java, performance, jvm, profiling, MOC]
domain: Java
created: 2026-07-26
status: complete
---

# 🔬 Java Performance Advanced — Map of Content

> [!abstract] What This Section Covers
> Advanced JVM performance engineering: profiling tools to find bottlenecks, heap dump analysis to locate memory leaks, thread dump analysis to diagnose deadlocks and contention, modern garbage collector selection (G1 vs ZGC), and Native Memory Tracking to understand what lives outside the Java heap. These topics separate Java engineers who tune performance from those who guess at it.

## Concept Map
```mermaid
graph TD
    CENTER["🔬 Java Performance Advanced"]
    CENTER --> PROF["[[JVM_Profiling_Tools]]\nasync-profiler · JFR\nFlame graphs"]
    CENTER --> HEAP["[[Heap_Analysis]]\nHeap dumps · MAT\nLeak detection"]
    CENTER --> THREAD["[[Thread_Dump_Analysis]]\njstack · deadlocks\nThread states"]
    CENTER --> GC["[[G1_ZGC_Collectors]]\nG1 regions · ZGC barriers\nGC flag selection"]
    CENTER --> NMT["[[Native_Memory_Tracking]]\nNMT · Metaspace\nOff-heap memory"]

    PROF -->|"flame graph shows"| HEAP
    HEAP -->|"heap pressure triggers"| GC
    THREAD -->|"GC STW pauses affect"| GC
    NMT -->|"Metaspace adds to total"| GC

    style CENTER fill:#e64980,color:#fff
    style PROF fill:#4a9eff,color:#fff
    style HEAP fill:#f5a623,color:#fff
    style THREAD fill:#2b8a3e,color:#fff
    style GC fill:#7c3aed,color:#fff
    style NMT fill:#4a9eff,color:#fff
```

## Learning Path
1. [[JVM_Profiling_Tools]] — Start with profiling to find *what* is slow before optimising.
2. [[Heap_Analysis]] — Analyse memory allocation and find leaks.
3. [[Thread_Dump_Analysis]] — Diagnose concurrency issues, deadlocks, and high CPU.
4. [[G1_ZGC_Collectors]] — Choose and tune the right garbage collector.
5. [[Native_Memory_Tracking]] — Understand memory beyond the Java heap.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[JVM_Profiling_Tools]] | Advanced | async-profiler, JFR, VisualVM, flame graphs, allocation profiling |
| [[Heap_Analysis]] | Advanced | Heap dump creation, MAT retained heap, shallow heap, common leak patterns |
| [[Thread_Dump_Analysis]] | Advanced | jstack, thread states, deadlock detection, high-CPU thread identification |
| [[G1_ZGC_Collectors]] | Advanced | G1 regions/mixed GC, ZGC load barriers, -XX flags, when to use each |
| [[Native_Memory_Tracking]] | Advanced | NMT summary/detail, jcmd commands, Metaspace tuning, container pitfalls |

## Key Questions This Section Answers
- How do you generate a flame graph with async-profiler?
- What is the difference between shallow heap and retained heap?
- How do you identify a deadlock from a thread dump?
- When should you choose ZGC over G1?
- What is Metaspace and why does it matter for containerised Java?
- How does Native Memory Tracking help diagnose "why is the container OOM killed?"

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[_MOC_Enterprise_Patterns|↔ Enterprise Patterns]] — Architectural choices affect GC pressure
- [[_MOC_Java_DevOps|↔ Java DevOps]] — Kubernetes memory limits interact with JVM tuning

#java #performance #jvm #profiling #gc #MOC
