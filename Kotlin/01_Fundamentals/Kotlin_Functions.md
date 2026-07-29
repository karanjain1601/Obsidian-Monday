---
title: Kotlin Functions
aliases: [Kotlin Extension Functions, Kotlin Default Parameters, Kotlin Higher Order Functions]
tags: [Kotlin, Functions, Extensions, Infix, Operators, Vararg]
domain: Kotlin
difficulty: Beginner
created: 2026-07-29
related: []
status: complete
---

# 🟣 Kotlin Functions

> [!abstract] TL;DR
> Kotlin functions support named parameters and default values (eliminating Java's builder pattern for optional args), single-expression bodies, extension functions (add methods to existing classes), infix notation, operator overloading, `tailrec` optimization, local functions for encapsulation, `vararg`/spread operator, and first-class function types. Together these make Kotlin significantly more expressive than Java for everyday coding.

---

## Intuition

Java forces you to either create builder classes for optional parameters or write a cascade of overloaded methods. Kotlin's default and named parameters solve this in the function signature itself. Extension functions let you write `"hello".isPalindrome()` without modifying the `String` class — clean, discoverable API additions that read as if they were always there.

---

## How It Works

### Named and Default Parameters

```kotlin
// Default parameters — eliminates overloaded constructor/method chains
fun sendEmail(
    to: String,
    subject: String = "No subject",
    body: String = "",
    cc: List<String> = emptyList(),
    priority: Int = 3
) { println("Sending '$subject' to $to") }

sendEmail("alice@example.com")                             // uses all defaults
sendEmail("bob@example.com", subject = "Meeting at 3pm")  // named — skip positional order
sendEmail(to = "carol@example.com", priority = 1, subject = "URGENT")

// In Java interop: @JvmOverloads generates the Java overloads automatically
@JvmOverloads
fun connect(host: String, port: Int = 8080, ssl: Boolean = false) { /* ... */ }
// Generates: connect(host), connect(host,port), connect(host,port,ssl) for Java callers
```

### Single-Expression Functions

```kotlin
// Full form
fun square(n: Int): Int { return n * n }

// Single-expression shorthand — return type inferred
fun square(n: Int) = n * n
fun max(a: Int, b: Int) = if (a > b) a else b
fun isEven(n: Int) = n % 2 == 0
```

### Extension Functions

```kotlin
// Add methods to existing classes — no inheritance, no decorator needed
fun String.isPalindrome(): Boolean = this == this.reversed()
fun String.truncate(max: Int) = if (length <= max) this else "${substring(0, max)}…"
fun Int.factorial(): Long = (1L..this).fold(1L) { acc, n -> acc * n }

println("racecar".isPalindrome())   // true
println("Hello World".truncate(5))  // "Hello…"
println(5.factorial())              // 120

// Extension functions on nullable types
fun String?.orEmpty(): String = this ?: ""

// Extension properties
val String.wordCount: Int get() = this.trim().split("\\s+".toRegex()).size
println("hello world foo".wordCount)  // 3
```

### Infix Functions

```kotlin
// infix — called without dot and parentheses when between two arguments
infix fun Int.times(str: String) = str.repeat(this)
println(3 times "ha ")  // "ha ha ha "

// Used extensively in test assertions and DSLs
infix fun <T> T.shouldBe(expected: T) {
    if (this != expected) throw AssertionError("Expected $expected but was $this")
}
// 42 shouldBe 42

// Standard library uses infix: to, until, step, downTo
val pair: Pair<String, Int> = "Alice" to 30
val range = 1 until 10
```

### Operator Overloading

```kotlin
data class Vector(val x: Double, val y: Double) {
    operator fun plus(other: Vector)  = Vector(x + other.x, y + other.y)
    operator fun minus(other: Vector) = Vector(x - other.x, y - other.y)
    operator fun times(scalar: Double) = Vector(x * scalar, y * scalar)
    operator fun unaryMinus()          = Vector(-x, -y)
}

val v1 = Vector(1.0, 2.0)
val v2 = Vector(3.0, 4.0)
println(v1 + v2)        // Vector(x=4.0, y=6.0)
println(v1 * 3.0)       // Vector(x=3.0, y=6.0)
```

### `tailrec` — Tail-Call Optimization

```kotlin
// JVM doesn't support TCO natively, but Kotlin's compiler rewrites tailrec into a loop
tailrec fun factorial(n: Long, acc: Long = 1L): Long =
    if (n <= 1) acc else factorial(n - 1, n * acc)

// Without tailrec: StackOverflowError for large n
// With tailrec: O(1) stack space — compiler emits a while loop
println(factorial(20))   // 2432902008176640000
```

### Local Functions and `vararg`

```kotlin
// Local functions — hide implementation details inside the outer function
fun validateAndSave(user: User): Boolean {
    fun isValidEmail(email: String) = email.contains("@")  // only visible here
    fun isValidName(name: String)   = name.isNotBlank() && name.length >= 2

    if (!isValidEmail(user.email)) { println("Bad email"); return false }
    if (!isValidName(user.name))   { println("Bad name");  return false }
    // save...
    return true
}

// vararg — variable number of arguments
fun sum(vararg numbers: Int): Int = numbers.sum()
sum(1, 2, 3, 4, 5)  // 15

// Spread operator (*) — unpack an array into vararg
val nums = intArrayOf(1, 2, 3)
sum(*nums)           // 6
```

### Function Types as Parameters

```kotlin
// Higher-order functions — take or return functions
fun applyTwice(x: Int, f: (Int) -> Int): Int = f(f(x))
applyTwice(3) { it * 2 }                  // 12  (3 → 6 → 12)

// Trailing lambda syntax — lambda outside parentheses when last parameter
listOf(1, 2, 3).map { it * it }           // [1, 4, 9]

// Function references — :: operator
fun double(x: Int) = x * 2
val doubled = listOf(1, 2, 3).map(::double)   // [2, 4, 6]

// Returning functions
fun multiplier(factor: Int): (Int) -> Int = { x -> x * factor }
val triple = multiplier(3)
println(triple(5))   // 15
```

## Function Features Quick Reference

| Feature | Syntax | Java Equivalent |
|---------|--------|-----------------|
| Default params | `fun f(x: Int = 0)` | Overloaded methods |
| Named params | `f(x = 5)` | Builder pattern |
| Extension func | `fun String.foo()` | Utility static method |
| Infix | `a infix b` | `a.infix(b)` |
| Operator overload | `operator fun plus()` | N/A in Java |
| tailrec | `tailrec fun f(...)` | Manual loop refactor |
| vararg + spread | `vararg n: Int`, `*arr` | `int... n`, no spread |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Extension function shadowed by member function | Member always wins; rename the extension or use it as a static utility |
| 2 | `@JvmOverloads` missing for Java callers needing default params | Add `@JvmOverloads` to generate Java-friendly overloads |
| 3 | `tailrec` applied to non-tail call | Compiler warns; the last call must be the recursive call with no further operations |
| 4 | Capturing mutable vars in lambdas | Lambdas capture the reference; mutations are visible — prefer `val` captures |
| 5 | Forgetting spread operator when passing array to vararg | Use `f(*myArray)` not `f(myArray)` |

## Review Questions

1. How do Kotlin's default parameters eliminate the Java builder pattern? Give an example.
2. What is the difference between an extension function and a member function? Who wins if both exist with the same name?
3. What does the `tailrec` modifier do, and what constraint must the function satisfy for it to work?

---

Related: [[Kotlin_Classes_and_OOP]] | [[Kotlin_Lambda_and_Higher_Order]] | [[Kotlin_Collections]] | [[Kotlin_Control_Flow]]

#Kotlin
