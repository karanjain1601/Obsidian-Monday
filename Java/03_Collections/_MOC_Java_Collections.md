---
title: "Java Collections — Map of Content"
tags:
  - Java
  - Collections
  - MOC
domain: Java
created: 2026-07-26
status: complete
---

# Java Collections — Map of Content

> The Java Collections Framework (JCF) is the backbone of nearly every Java program. Understanding which container to reach for — and why — separates journeyman Java from expert Java.

---

## Concept Map

```mermaid
graph TD
    A["Iterable&lt;E&gt;"] --> B["Collection&lt;E&gt;"]

    B --> C["List&lt;E&gt;"]
    B --> D["Set&lt;E&gt;"]
    B --> E["Queue&lt;E&gt;"]

    C --> C1["ArrayList"]
    C --> C2["LinkedList"]
    C --> C3["CopyOnWriteArrayList"]

    D --> D1["HashSet"]
    D --> D2["LinkedHashSet"]
    D --> D3["TreeSet"]

    E --> E1["PriorityQueue"]
    E --> E2["ArrayDeque"]
    E --> E3["BlockingQueue"]

    F["Map&lt;K,V&gt;"] --> F1["HashMap"]
    F --> F2["LinkedHashMap"]
    F --> F3["TreeMap"]
    F --> F4["ConcurrentHashMap"]
    F --> F5["EnumMap / WeakHashMap"]

    style A fill:#4A90D9,color:#fff
    style B fill:#4A90D9,color:#fff
    style C fill:#27AE60,color:#fff
    style D fill:#8E44AD,color:#fff
    style E fill:#E67E22,color:#fff
    style F fill:#C0392B,color:#fff
    style C1 fill:#82E0AA,color:#000
    style C2 fill:#82E0AA,color:#000
    style C3 fill:#82E0AA,color:#000
    style D1 fill:#D7BDE2,color:#000
    style D2 fill:#D7BDE2,color:#000
    style D3 fill:#D7BDE2,color:#000
    style E1 fill:#FAD7A0,color:#000
    style E2 fill:#FAD7A0,color:#000
    style E3 fill:#FAD7A0,color:#000
    style F1 fill:#F1948A,color:#000
    style F2 fill:#F1948A,color:#000
    style F3 fill:#F1948A,color:#000
    style F4 fill:#F1948A,color:#000
    style F5 fill:#F1948A,color:#000
```

---

## Learning Path

| Step | Topic | Notes | Prerequisite |
|------|-------|-------|--------------|
| 1 | Collection hierarchy & selection | [[Collection_Hierarchy_and_Choosing]] | Java basics |
| 2 | HashMap internals & concurrent collections | [[HashMap_and_Concurrent_Collections]] | Step 1 |
| 3 | Sorting (Comparable/Comparator) & Iteration | [[Sorting_and_Iteration]] | Step 1 |
| 4 | Generics with Collections | [[_MOC_Java_Generics]] | Step 1–3 |
| 5 | Thread-safe collections deep dive | [[_MOC_Java_Concurrency]] | Step 2 |

---

## Notes in This Section

| Note | Summary | Difficulty |
|------|---------|------------|
| [[Collection_Hierarchy_and_Choosing]] | Full JCF hierarchy, when to use each type, immutability, complexity table | Intermediate |
| [[HashMap_and_Concurrent_Collections]] | HashMap bucket internals, treeification, ConcurrentHashMap, CopyOnWriteArrayList | Advanced |
| [[Sorting_and_Iteration]] | Comparable vs Comparator, TimSort, Iterator, ConcurrentModificationException | Intermediate |

---

## Key Interview Questions

| Question | Key Answer Points | See Note |
|----------|-------------------|----------|
| How does HashMap work internally? | Array of Node[], hash function, bucket index `(n-1) & hash`, chaining, treeify at ≥8 entries | [[HashMap_and_Concurrent_Collections]] |
| When would you use LinkedHashSet over HashSet? | When insertion order must be preserved with O(1) lookup (e.g., LRU-style dedup) | [[Collection_Hierarchy_and_Choosing]] |
| What causes ConcurrentModificationException? | Structural modification during iteration detected via `modCount`; use `Iterator.remove()` or `removeIf()` | [[Sorting_and_Iteration]] |
| HashMap vs ConcurrentHashMap vs Hashtable? | HashMap not thread-safe; Hashtable fully synchronized (slow); CHM per-bucket locking with CAS | [[HashMap_and_Concurrent_Collections]] |
| ArrayList vs LinkedList — when to prefer each? | ArrayList O(1) random access; LinkedList O(1) head/tail insert but poor cache locality | [[Collection_Hierarchy_and_Choosing]] |
| What is the difference between `List.of()` and `Collections.unmodifiableList()`? | `List.of()` truly immutable, rejects nulls; `unmodifiableList` wraps — original can still mutate | [[Collection_Hierarchy_and_Choosing]] |

---

## Quick-Reference Cheat Sheet

```
Need indexed access?              → ArrayList
Frequent head/tail ops?           → ArrayDeque (or LinkedList)
No duplicates, fast lookup?       → HashSet
No duplicates, insertion order?   → LinkedHashSet
No duplicates, sorted?            → TreeSet
Key-value, fast lookup?           → HashMap
Key-value, insertion order?       → LinkedHashMap
Key-value, sorted keys?           → TreeMap
Key-value, thread-safe?           → ConcurrentHashMap
Priority / min-max heap?          → PriorityQueue
Bounded blocking producer/consumer → ArrayBlockingQueue
```

---

## Related Sections

- [[_MOC_Java_Fundamentals]] — OOP, primitives, strings
- [[_MOC_Java_Generics]] — type parameters, wildcards, erasure
- [[_MOC_Java_Concurrency]] — threads, locks, concurrent utilities
- [[_MOC_Streams_Functional]] — stream pipeline, collectors
