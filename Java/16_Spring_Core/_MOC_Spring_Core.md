---
title: "Spring Core — Map of Content"
aliases: ["MOC Spring Core", "Spring IoC", "Spring DI", "_MOC_Spring_Framework"]
tags: [MOC, java, spring, spring-core]
domain: Java
created: 2026-07-26
status: complete
---

# 🌱 Spring Core — Map of Content

> [!abstract] What This Section Covers
> Spring Core is the foundation of the entire Spring ecosystem. At its heart is the IoC (Inversion of Control) container — the ApplicationContext — which manages object creation, wiring, and lifecycle. This section covers the container itself, dependency injection styles and resolution rules, the bean lifecycle with scopes and callbacks, Aspect-Oriented Programming for cross-cutting concerns, and the Spring event system for decoupled communication.

## Concept Map
```mermaid
graph TD
    CENTER["🌱 Spring Core"]

    CENTER --> IoC["[[Spring_IoC_Container]]\nApplicationContext · BeanFactory\n@Component · @Bean"]
    CENTER --> DI["[[Dependency_Injection]]\n@Autowired · @Qualifier\nconstructor vs field injection"]
    CENTER --> BL["[[Spring_Bean_Lifecycle]]\nscopes · @PostConstruct\nBeanPostProcessor"]
    CENTER --> AOP["[[Spring_AOP]]\n@Aspect · @Around\npointcut expressions · proxy"]
    CENTER --> Events["[[Spring_Events]]\nApplicationEventPublisher\n@EventListener · @Async"]

    IoC -->|"injection mechanism"| DI
    DI -->|"within lifecycle"| BL
    BL -->|"intercepted by"| AOP
    AOP -->|"combined with"| Events

    style CENTER fill:#7c3aed,color:#fff
    style IoC fill:#4a9eff,color:#fff
    style DI fill:#7ed321,color:#fff
    style BL fill:#e64980,color:#fff
    style AOP fill:#f5a623,color:#fff
    style Events fill:#ff6b6b,color:#fff
```

## Learning Path
1. [[Spring_IoC_Container]] — What the ApplicationContext is, how beans are defined, and the container's role.
2. [[Dependency_Injection]] — How Spring wires beans together: by type, by name, constructor vs field injection.
3. [[Spring_Bean_Lifecycle]] — Bean scopes (singleton/prototype/request), lifecycle callbacks, and BeanPostProcessor.
4. [[Spring_AOP]] — Cross-cutting concerns with aspects, advice types, and pointcut expressions.
5. [[Spring_Events]] — Application events for decoupled communication between components.

## All Notes at a Glance
| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Spring_IoC_Container]] | Beginner | ApplicationContext, BeanFactory, component scanning, bean definition styles |
| [[Dependency_Injection]] | Beginner | @Autowired, @Qualifier, @Primary, constructor vs field injection, CGLIB |
| [[Spring_Bean_Lifecycle]] | Intermediate | Scopes, @PostConstruct/@PreDestroy, BeanPostProcessor, scoped proxies |
| [[Spring_AOP]] | Intermediate | Aspects, @Around/@Before/@After, pointcuts, self-invocation pitfall |
| [[Spring_Events]] | Intermediate | ApplicationEventPublisher, @EventListener, @Async, @TransactionalEventListener |

## Key Questions This Section Answers
- What is the difference between BeanFactory and ApplicationContext?
- Why is constructor injection preferred over field injection?
- What happens if two beans of the same type exist — how does @Autowired resolve it?
- What is the difference between singleton scope and prototype scope?
- How does Spring AOP use proxies and what is the self-invocation pitfall?
- What is a @TransactionalEventListener and when would you use it?

## Related Sections
- [[_MOC_Java_Master|↑ Java Master MOC]]
- [[_MOC_Spring_Boot|→ Spring Boot]] — Auto-configuration builds on the IoC container
- [[_MOC_Spring_MVC_REST|→ Spring MVC REST]] — @RestController is a Spring-managed bean
- [[_MOC_Spring_Data|→ Spring Data]] — Repositories are Spring-managed beans with AOP transactions

#MOC #java #spring #spring-core
