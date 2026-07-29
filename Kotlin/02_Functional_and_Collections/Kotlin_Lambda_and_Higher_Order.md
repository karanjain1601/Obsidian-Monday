---
title: Kotlin Lambda and Higher-Order Functions
aliases: [Kotlin Lambdas, Kotlin Higher Order Functions, Kotlin Function References, Kotlin Inline Functions]
tags: [Kotlin, Lambda, HigherOrder, Inline, Reified, FunctionTypes]
domain: Kotlin
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# 🟣 Kotlin Lambda and Higher-Order Functions

> [!abstract] TL;DR
> Kotlin treats functions as first-class citizens. Lambdas use `{ params -> body }` syntax with `it` as the implicit single-parameter name. Function references (`::`) pass existing functions as values. SAM conversions let Kotlin lambdas implement Java single-abstract-method interfaces directly. `inline` functions eliminate lambda allocation overhead; combined with `reified`, they enable type-safe generic operations at runtime. `typealias` gives readable names to function types.

---

## Intuition

In Java, passing behaviour requires either an anonymous class or a lambda (Java 8+), but Java still can't fully inline lambdas or retain generic type parameters at runtime. Kotlin goes further: `inline` functions instruct the compiler to copy the lambda body directly into the call site — zero allocation overhead, and when paired with `reified`, the type parameter is real at runtime, not erased. This unlocks patterns impossible in Java without reflection.

---

## How It Works

### Lambda Syntax and `it`

```kotlin
// Full lambda syntax: type annotation on parameter + explicit parameter name
val multiply: (Int, Int) -> Int = { x: Int, y: Int -> x * y }

// Type inferred from variable declaration
val double: (Int) -> Int = { x -> x * 2 }

// `it` — implicit name for single-parameter lambdas
val square: (Int) -> Int = { it * it }
println(square(5))   // 25

// Multi-line lambda — last expression is the return value
val processText: (String) -> String = {
    val trimmed = it.trim()
    val words   = trimmed.split(" ")
    words.joinToString("-")
}
println(processText("  hello world  "))  // "hello-world"

// Trailing lambda — when lambda is the last parameter, it goes outside parens
listOf(1, 2, 3).forEach { println(it) }
listOf("a","b","c").map { it.uppercase() }
listOf(1..10).filter { it % 2 == 0 }

// Unused lambda parameter — replace with _
mapOf("a" to 1, "b" to 2).forEach { (key, _) -> println(key) }
```

### Function References (`::`)

```kotlin
fun isEven(n: Int) = n % 2 == 0
fun String.countWords() = trim().split("\\s+".toRegex()).size

// Function reference — pass an existing function as a value
val evens = (1..10).filter(::isEven)          // [2, 4, 6, 8, 10]

// Method reference on an instance
val printer = ::println
listOf(1, 2, 3).forEach(printer)

// Constructor reference
data class Person(val name: String)
val names = listOf("Alice", "Bob")
val people = names.map(::Person)              // [Person("Alice"), Person("Bob")]

// Extension function reference
val wordCounts = listOf("hello world", "foo bar baz").map(String::countWords)
// [2, 3]
```

### SAM Conversions for Java Interfaces

```kotlin
// Java: Runnable, Comparator, Callable, etc. — single abstract method interfaces
// Kotlin lambda automatically converts to SAM interface
val runnable: Runnable = Runnable { println("Running!") }

// Even shorter — type is inferred
val thread = Thread { println("Running in a thread") }
thread.start()

// Comparator SAM conversion
val sorted = listOf("banana", "apple", "cherry").sortedWith(Comparator { a, b ->
    a.length - b.length
})
// Or even shorter with compareBy
val sorted2 = listOf("banana", "apple", "cherry").sortedWith(compareBy { it.length })

// Kotlin fun interfaces — define your own SAM interface in Kotlin
fun interface Transformer<T, R> {
    fun transform(input: T): R
}
val upper: Transformer<String, String> = Transformer { it.uppercase() }
```

### `typealias` for Function Types

```kotlin
// Give meaningful names to function types
typealias Predicate<T>      = (T) -> Boolean
typealias EventHandler      = (String, Any?) -> Unit
typealias Reducer<S, A>     = (S, A) -> S

fun <T> List<T>.filterWith(predicate: Predicate<T>) = filter(predicate)
val isLong: Predicate<String> = { it.length > 5 }
listOf("hi", "hello", "hey there").filterWith(isLong)  // ["hello", "hey there"]
```

### `inline` Functions — Eliminating Lambda Overhead

```kotlin
// Normal higher-order function: each lambda call allocates a Function object on the heap
fun measureTime(action: () -> Unit): Long {
    val start = System.nanoTime()
    action()
    return System.nanoTime() - start
}

// inline: compiler copies lambda body to call site — zero object allocation
inline fun measureTimeInline(action: () -> Unit): Long {
    val start = System.nanoTime()
    action()
    return System.nanoTime() - start
}
// Compiled code for measureTimeInline { doWork() } has no lambda object at all

// noinline — when you need to store or pass the lambda (can't inline stored lambdas)
inline fun doWith(
    action: () -> Unit,
    noinline callback: () -> Unit   // stored/passed — can't be inlined
) {
    action()
    scheduleCallback(callback)      // can store noinline lambdas
}

// crossinline — lambda can't use non-local return (called from another context)
inline fun runAsync(crossinline action: () -> Unit) {
    Thread { action() }.start()    // action runs in another thread — must be crossinline
}
```

### `reified` Type Parameters

```kotlin
// Normal generic: type erased at runtime — can't do `is T` check
fun <T> List<*>.filterIsInstance(): List<T> {
    // return filter { it is T }  // COMPILE ERROR: Cannot check for erased type T
}

// inline + reified: T is real at the call site
inline fun <reified T> List<*>.filterIsInstance(): List<T> =
    filter { it is T }.map { it as T }   // T is available at runtime here

val mixed: List<Any> = listOf(1, "hello", 2, "world", 3)
val strings: List<String> = mixed.filterIsInstance<String>()  // ["hello", "world"]

// Another classic reified use case: getting the Class<T>
inline fun <reified T> jacksonDeserialize(json: String): T =
    objectMapper.readValue(json, T::class.java)

val user: User = jacksonDeserialize<User>("""{"name":"Alice"}""")
// No need to pass User::class.java explicitly
```

## Function Type Anatomy

```
         (String, Int) -> Boolean
          ↑                ↑
    Parameter types    Return type

(receiver: String).(Int) -> Boolean
↑ Extension function type — this: String, param: Int, returns Boolean
```

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | `return` inside a non-inline lambda returns from the enclosing function | Use `return@labelName` for local return from the lambda |
| 2 | Forgetting `inline` on performance-sensitive higher-order functions | Benchmark; use `inline` when lambda is called immediately, not stored |
| 3 | Using `reified` without `inline` | `reified` requires `inline`; compiler will refuse |
| 4 | SAM conversion ambiguity with overloaded Kotlin methods | Use `fun interface` or explicit type annotation to disambiguate |
| 5 | Deeply nested lambdas with `it` — unreadable | Name the parameter explicitly when lambdas are nested |

## Review Questions

1. What is a SAM conversion and when does it apply? Does it work for Kotlin-defined interfaces?
2. What does `inline` do to a lambda at the bytecode level? Why does this matter for performance?
3. Why does `reified` require `inline`? What would happen at the JVM level without `inline`?

---

Related: [[Kotlin_Functions]] | [[Kotlin_Collections]] | [[Kotlin_Generics]] | [[Kotlin_Coroutines_Intro]] | [[Stream_Pipeline_and_Collectors]]

#Kotlin
