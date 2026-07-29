---
title: "Functional Java — Map of Content"
aliases: ["MOC Functional Java", "MOC Java Functional Programming"]
tags: [MOC, java, functional, lambda, streams, optional]
domain: Java
created: 2026-07-26
status: complete
---

# λ Functional Java — Map of Content

> [!abstract] What This Section Covers
> Java 8 introduced functional programming features that transformed idiomatic Java: lambdas, Streams, Optional, method references, and functional interfaces. This section covers all five pillars. Mastering these is essential for modern Java — virtually all Java 8+ codebases use them heavily, and understanding them is required to read Spring, JDK, and library source code.

## Concept Map
```mermaid
graph TD
    CENTER["λ Functional Java"]

    CENTER --> LAMBDA["[[Lambda_Expressions]]\n(x) -> x * 2\nclosure · effectively final"]
    CENTER --> STREAM["[[Stream_API]]\nmap · filter · reduce · collect\nlazy · parallel"]
    CENTER --> OPT["[[Optional_Class]]\nOptional.of/empty\norElse · flatMap · ifPresent"]
    CENTER --> MREF["[[Method_References]]\nClass::method\ninstance::method · Constructor::new"]
    CENTER --> FINT["[[Functional_Interfaces]]\nFunction · Predicate · Consumer\nSupplier · BiFunction"]

    LAMBDA -->|"implement"| FINT
    FINT -->|"used by"| STREAM
    MREF -->|"shorthand for"| LAMBDA
    STREAM -->|"often returns"| OPT

    style CENTER fill:#7c3aed,color:#fff
    style LAMBDA fill:#4a9eff,color:#fff
    style STREAM fill:#7ed321,color:#fff
    style OPT fill:#f5a623,color:#fff
    style MREF fill:#4a9eff,color:#fff
    style FINT fill:#e64980,color:#fff
```

## Learning Path
1. [[Functional_Interfaces]] — Understand the interfaces that lambdas implement.
2. [[Lambda_Expressions]] — Write lambdas and understand closures.
3. [[Method_References]] — Shorthand for lambdas using existing methods.
4. [[Stream_API]] — Chain operations on collections lazily and in parallel.
5. [[Optional_Class]] — Eliminate null checks with Optional.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Functional_Interfaces]] | Beginner | Function, Predicate, Consumer, Supplier, composition |
| [[Lambda_Expressions]] | Beginner | Lambda syntax, closures, effectively final, capturing scope |
| [[Method_References]] | Beginner | ::, static/instance/constructor references |
| [[Stream_API]] | Intermediate | map/filter/reduce/collect, lazy evaluation, Collectors, parallel |
| [[Optional_Class]] | Intermediate | Optional.of/empty, orElse/orElseThrow, map/flatMap, anti-patterns |

## Key Questions This Section Answers
- What is the difference between `map()` and `flatMap()` in streams?
- Why must variables captured in a lambda be effectively final?
- When should you use `Optional` vs null vs throwing an exception?
- What is lazy evaluation in streams and why does it matter?
- How does `Collectors.groupingBy()` work?

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[_MOC_Java_Networking|← Java Networking]]
- [[_MOC_Java_Patterns|→ Java Patterns]]

#MOC #java #functional #lambda #streams #optional #method-references
