---
title: "Java Generics — Map of Content"
tags:
  - Java
  - Generics
  - MOC
domain: Java
created: 2026-07-26
status: complete
---

# Java Generics — Map of Content

> Generics give you compile-time type safety at zero runtime cost. Mastering them — especially wildcards and erasure — is essential for writing reusable library code and understanding the JDK's own APIs.

---

## Concept Map

```mermaid
graph TD
    G["Generics"] --> GC["Generic Classes\nclass Box&lt;T&gt;"]
    G --> GM["Generic Methods\n&lt;T&gt; T method(T arg)"]
    G --> BT["Bounded Type Parameters\n&lt;T extends Comparable&lt;T&gt;&gt;"]
    G --> WC["Wildcards"]
    G --> TE["Type Erasure"]
    G --> VA["Variance"]

    WC --> EX["? extends T\n(upper bounded / Producer)"]
    WC --> SU["? super T\n(lower bounded / Consumer)"]
    WC --> UB["?\n(unbounded)"]

    TE --> RT["Raw Types\nList (no param)"]
    TE --> BR["Bridge Methods"]
    TE --> HP["Heap Pollution"]

    VA --> INV["Invariant\nList&lt;String&gt; ≠ List&lt;Object&gt;"]
    VA --> COV["Covariant\n? extends T"]
    VA --> CONT["Contravariant\n? super T"]

    style G fill:#2471A3,color:#fff
    style GC fill:#1E8449,color:#fff
    style GM fill:#1E8449,color:#fff
    style BT fill:#8E44AD,color:#fff
    style WC fill:#BA4A00,color:#fff
    style TE fill:#922B21,color:#fff
    style VA fill:#117A65,color:#fff
    style EX fill:#FAD7A0,color:#000
    style SU fill:#FAD7A0,color:#000
    style UB fill:#FAD7A0,color:#000
    style RT fill:#F1948A,color:#000
    style BR fill:#F1948A,color:#000
    style HP fill:#F1948A,color:#000
    style INV fill:#A9DFBF,color:#000
    style COV fill:#A9DFBF,color:#000
    style CONT fill:#A9DFBF,color:#000
```

---

## Learning Path

| Step | Topic | Note | Prerequisite |
|------|-------|------|--------------|
| 1 | Generic classes, methods, bounded params | [[Generic_Classes_and_Methods]] | Java OOP basics |
| 2 | Wildcards and PECS principle | [[Wildcards_and_PECS]] | Step 1 |
| 3 | Type erasure, variance, restrictions | [[Type_Erasure_and_Variance]] | Step 1–2 |
| 4 | Generics with Collections | [[_MOC_Java_Collections]] | Step 1–2 |
| 5 | Generics in Stream API | [[_MOC_Streams_Functional]] | Step 1–3 |

---

## Notes in This Section

| Note | Summary | Difficulty |
|------|---------|------------|
| [[Generic_Classes_and_Methods]] | Syntax, bounded params, raw types, diamond operator, naming conventions | Intermediate |
| [[Wildcards_and_PECS]] | Upper/lower/unbounded wildcards, PECS principle, Joshua Bloch's guidelines | Advanced |
| [[Type_Erasure_and_Variance]] | Erasure mechanics, restrictions, heap pollution, array covariance vs generic invariance | Advanced |

---

## Key Interview Questions

| Question | Core Answer | See Note |
|----------|------------|----------|
| Why can't you do `new T[]`? | Type parameter `T` is erased at runtime; JVM doesn't know what type to allocate for the array | [[Type_Erasure_and_Variance]] |
| What is PECS? | Producer Extends, Consumer Super — use `? extends T` to read from a collection, `? super T` to write to it | [[Wildcards_and_PECS]] |
| Why are Java arrays covariant but generics invariant? | Arrays check at runtime (ArrayStoreException); generics chose compile-time safety over covariance to prevent the same class of error statically | [[Type_Erasure_and_Variance]] |
| What is a raw type and why is it dangerous? | `List` without type parameter; compiler inserts unchecked casts; heap pollution possible | [[Generic_Classes_and_Methods]] |
| Difference between `<T extends Comparable<T>>` and `<? extends Comparable<?>>` | Type parameter creates a name you can reference; wildcard is anonymous and one-use | [[Wildcards_and_PECS]] |
| What is a bridge method? | Compiler-generated synthetic method that maintains polymorphism after type erasure in overridden generic methods | [[Type_Erasure_and_Variance]] |

---

## Quick-Reference Cheat Sheet

```
// Type parameter — reusable, nameable
public <T extends Comparable<T>> T max(T a, T b) { ... }

// Wildcard — anonymous, one-use
public void print(List<?> list) { ... }

// PECS rule:
List<? extends Number> producer = getNumbers(); // READ from here
Number n = producer.get(0);                    // OK
// producer.add(3.14); // COMPILE ERROR

List<? super Integer> consumer = getList();    // WRITE into here
consumer.add(42);                              // OK
// Integer i = consumer.get(0); // returns Object

// Type erasure: both become List at runtime
List<String>  → List (with String casts inserted by compiler)
List<Integer> → List (with Integer casts inserted by compiler)
```

---

## Related Sections

- [[_MOC_Java_Collections]] — generics in List, Map, Set APIs
- [[_MOC_Streams_Functional]] — `Stream<T>`, `Optional<T>`, `Collector<T,A,R>`
- [[_MOC_Java_Concurrency]] — `Future<V>`, `CompletableFuture<T>`
