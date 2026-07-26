---
title: "Design Patterns — Map of Content"
aliases: ["MOC Design Patterns", "GoF Patterns"]
tags: [MOC, java, design-patterns]
domain: Java
created: 2026-07-26
status: complete
---

# 🏗️ Design Patterns — Map of Content

> [!abstract] What This Section Covers
> Design patterns are proven, reusable solutions to commonly recurring problems in object-oriented software design. This section covers the Gang of Four (GoF) patterns organized by category: Creational (how objects are created), Structural (how objects are composed), and Behavioral (how objects communicate). Enterprise patterns (Repository, CQRS, Saga) extend these into distributed systems. Anti-patterns teach what to avoid.

## Concept Map
```mermaid
graph TD
    CENTER["🏗️ Design Patterns"]

    CENTER --> Create["[[Creational_Patterns]]\nSingleton · Factory · Builder\nAbstract Factory · Prototype"]
    CENTER --> Struct["[[Structural_Patterns]]\nProxy · Decorator · Adapter\nFacade · Composite · Flyweight"]
    CENTER --> Behave["[[Behavioral_Patterns]]\nStrategy · Observer · Command\nTemplate Method · Chain"]
    CENTER --> Ent["[[Enterprise_Patterns]]\nRepository · DTO · CQRS\nEvent Sourcing · Saga"]
    CENTER --> Anti["[[Pattern_Anti_Patterns]]\nGod Object · Anemic Domain\nSingleton overuse · Service Locator"]

    Create -->|"instances used in"| Struct
    Struct -->|"objects communicate via"| Behave
    Behave -->|"scale to"| Ent

    style CENTER fill:#7c3aed,color:#fff
    style Create fill:#4a9eff,color:#fff
    style Struct fill:#7ed321,color:#fff
    style Behave fill:#e64980,color:#fff
    style Ent fill:#f5a623,color:#fff
    style Anti fill:#ff6b6b,color:#fff
```

## Learning Path
1. [[Creational_Patterns]] — Control how objects are created: Singleton, Factory, Builder, Prototype.
2. [[Structural_Patterns]] — Compose objects into larger structures: Proxy, Decorator, Adapter, Facade.
3. [[Behavioral_Patterns]] — Define how objects communicate: Strategy, Observer, Command, Template Method.
4. [[Enterprise_Patterns]] — Apply patterns at scale: Repository, CQRS, Event Sourcing, Saga.
5. [[Pattern_Anti_Patterns]] — Recognize and avoid common anti-patterns that make code unmaintainable.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Creational_Patterns]] | Intermediate | Singleton (enum idiom), Factory Method, Abstract Factory, Builder, Prototype |
| [[Structural_Patterns]] | Intermediate | Proxy (JDK/CGLIB), Decorator (I/O streams), Adapter, Facade, Composite, Flyweight |
| [[Behavioral_Patterns]] | Intermediate | Strategy (Comparator), Observer (Spring events), Command, Template Method, Chain |
| [[Enterprise_Patterns]] | Advanced | Repository (Spring Data), DTO, CQRS, Event Sourcing, Specification |
| [[Pattern_Anti_Patterns]] | Intermediate | God Object, Anemic Domain, Service Locator, Lava Flow, Magic Numbers |

## Key Questions This Section Answers
- Which creational pattern should I use when construction logic is complex?
- How does Spring AOP use the Proxy pattern?
- How does Java's `InputStream` hierarchy use the Decorator pattern?
- What is the difference between Factory Method and Abstract Factory?
- When should I use Repository vs DAO pattern?
- What is the difference between choreography and orchestration in Saga pattern?

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[_MOC_Spring_Core|→ Spring Core]] — IoC container embodies Dependency Injection pattern
- [[_MOC_Spring_Data|→ Spring Data]] — Repository pattern implementation
- [[_MOC_Microservices_Java|→ Microservices]] — Enterprise patterns at distributed scale

#MOC #java #design-patterns #gof
