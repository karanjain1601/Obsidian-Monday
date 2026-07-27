---
title: "Java Design Patterns — Map of Content"
aliases: ["MOC Java Patterns", "MOC Design Patterns Java"]
tags: [MOC, java, design-patterns, builder, observer, strategy]
domain: Java
created: 2026-07-26
status: complete
---

# 🏗️ Java Design Patterns — Map of Content

> [!abstract] What This Section Covers
> Design patterns are proven solutions to recurring software design problems. This section covers five foundational patterns in Java/Spring context: **Builder** (construct complex objects step by step), **Observer** (event-driven notification), **Strategy** (interchangeable algorithms), **Template Method** (define skeleton, let subclasses fill in steps), and **Decorator** (add behaviour without subclassing). Each includes modern Java implementation using lambdas and functional interfaces where applicable.

## Concept Map
```mermaid
graph TD
    CENTER["🏗️ Java Design Patterns"]

    CENTER --> BUILD["[[Builder_Pattern]]\nImmutable objects · Lombok @Builder\nFluent API · telescoping constructors"]
    CENTER --> OBS["[[Observer_Pattern]]\nEvent listener · Publisher/Subscriber\nSpring @EventListener · Reactive"]
    CENTER --> STRAT["[[Strategy_Pattern]]\nAlgorithm selection · @Component + Map\nFunctional alternative with lambdas"]
    CENTER --> TMPL["[[Template_Method_Pattern]]\nAbstract class skeleton\nSpring Batch · JdbcTemplate"]
    CENTER --> DEC["[[Decorator_Pattern]]\nLayer behaviour · Stream API\nServletFilter · Spring Security chain"]

    BUILD -.->|"creates"| OBS
    STRAT -.->|"selected at runtime"| TMPL
    DEC -.->|"wraps"| STRAT

    style CENTER fill:#7c3aed,color:#fff
    style BUILD fill:#4a9eff,color:#fff
    style OBS fill:#4a9eff,color:#fff
    style STRAT fill:#7ed321,color:#fff
    style TMPL fill:#f5a623,color:#fff
    style DEC fill:#e64980,color:#fff
```

## Learning Path
1. [[Builder_Pattern]] — Build complex objects safely and readably.
2. [[Strategy_Pattern]] — Select algorithms at runtime — polymorphism done right.
3. [[Template_Method_Pattern]] — Define skeleton algorithms with pluggable steps.
4. [[Decorator_Pattern]] — Layer behaviour without modifying the original class.
5. [[Observer_Pattern]] — Decouple producers from consumers with events.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Builder_Pattern]] | Beginner | Builder vs constructors, Lombok @Builder, record builders, telescoping problem |
| [[Observer_Pattern]] | Intermediate | Java Observer, Spring events, Guava EventBus, reactive alternatives |
| [[Strategy_Pattern]] | Intermediate | Strategy interface, Spring @Component registry, lambda strategies |
| [[Template_Method_Pattern]] | Intermediate | Abstract class template, Spring's JdbcTemplate, callback variants |
| [[Decorator_Pattern]] | Intermediate | Decorator vs inheritance, Java I/O stack, Spring filter chains |

## Key Questions This Section Answers
- When should you use a Builder instead of a constructor?
- How does Spring's `@EventListener` implement the Observer pattern?
- How do lambda expressions replace Strategy pattern implementations in Java 8+?
- What is the difference between Decorator and Proxy patterns?
- How does Spring Security's filter chain implement the Decorator pattern?

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[36_Functional_Java/_MOC_Functional_Java|← Functional Java]]
- [[38_Java_Internals/_MOC_Java_Internals|→ Java Internals]]

#MOC #java #design-patterns #builder #observer #strategy #decorator #template-method
