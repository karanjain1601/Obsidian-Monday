---
title: Scala Style Guide
aliases: [Scala conventions, Scala best practices, scalafmt, Scala code style]
tags: [Scala, StyleGuide, BestPractices, FunctionalProgramming, Conventions]
domain: Scala
difficulty: Beginner
created: 2026-07-29
related: []
status: complete
---

# Scala Style Guide

> [!abstract] TL;DR
> Idiomatic Scala code defaults to immutability (`val` over `var`), uses expressions rather than statements (`if/match` return values), avoids `null` entirely (use `Option`), and models data as case classes and sealed traits. One public type per file, PascalCase for types, camelCase for values, and `scalafmt` for formatting. Avoid overusing implicits — prefer explicit `given`/`using` in Scala 3.

---

## Intuition

Good Scala code looks neither like Java (verbose, mutable, OOP-heavy) nor like pure Haskell (impenetrable abstraction). The target is **readable FP**: concise but clear, typed but not type-gymnastics everywhere, functional by default but pragmatic when needed. Scala's expressiveness is also its danger — the style guide prevents teams from diverging into incompatible dialects.

---

## How It Works

### Naming Conventions

```scala
// Types — PascalCase
class UserRepository
trait Configurable
object MathUtils
case class HttpResponse(status: Int, body: String)
enum PaymentMethod { case CreditCard, BankTransfer, Cash }

// Values, parameters, methods — camelCase
val maxRetries = 3
def fetchUser(userId: Long): Future[User] = ???

// Constants — camelCase in Scala (unlike Java's SCREAMING_SNAKE_CASE)
val maxConnections = 100       // NOT MAX_CONNECTIONS
val defaultTimeout = 30.seconds

// Type parameters — single uppercase letter or short descriptive names
def map[A, B](fa: List[A])(f: A => B): List[B]
class Cache[K, V](capacity: Int)
trait Functor[F[_]]

// Packages — lowercase, dotted hierarchy
package com.example.users.repository
```

### Immutability First

```scala
// PREFER:
val result = compute()
val updated = original.copy(field = newValue)
val mapped = items.map(transform)

// AVOID:
var result = null
result = compute()             // reassignment

var list = List.empty[Int]
for i <- 1 to 10 do
  list = list :+ i             // quadratic! and mutable

// PREFER — functional accumulation:
val list = (1 to 10).toList
// or
val list2 = List.range(1, 11)
```

### Expressions, Not Statements

```scala
// PREFER expressions — they return values
val status = if code == 200 then "OK" else "Error"

val label = item match
  case Item.Active  => "active"
  case Item.Expired => "expired"

def describe(n: Int): String =
  if n > 0 then "positive"
  else if n < 0 then "negative"
  else "zero"

// AVOID statements with side-effecting assignments
var status = ""
if code == 200 then status = "OK"
else status = "Error"
```

### Avoid null — Use Option

```scala
// NEVER return null from Scala code
def findUser(id: Int): Option[User] =    // correct
def findUser(id: Int): User = null       // WRONG — never do this

// Wrap Java APIs immediately
val envVar: Option[String] = Option(System.getenv("HOME"))
val result: Option[Int]    = Option(javaMap.get("key")).map(_.toInt)

// getOrElse for defaults, not null checks
val name = findUser(id).map(_.name).getOrElse("Anonymous")
// NOT: if findUser(id) != null then findUser(id).name else "Anonymous"
```

### Case Classes for Data

```scala
// Use case classes — not POJOs with getters/setters
case class Address(street: String, city: String, country: String)
case class User(id: Long, name: String, address: Address)

// AVOID:
class UserPOJO:
  var id: Long = 0
  var name: String = ""
  def getId: Long = id
  def setId(v: Long): Unit = id = v    // Java style — avoid completely
```

### File and Code Organisation

```scala
// One public type per file (for complex types)
// file: User.scala
case class User(id: Long, name: String)

// Companion object in same file
object User:
  def apply(name: String): User = User(0L, name)
  val anonymous: User = User(0L, "Anonymous")

// Small helper types can share a file
// file: Errors.scala
sealed trait AppError
case class NotFound(id: Long)     extends AppError
case class Unauthorized(msg: String) extends AppError
case class ValidationError(errors: List[String]) extends AppError
```

### Avoid Overusing Implicits / given

```scala
// GOOD: given for typeclass instances — clear purpose
given Ordering[User] = Ordering.by(_.name)
given Show[User] with
  def show(u: User) = s"User(${u.id}, ${u.name})"

// AVOID: implicit conversion (Scala 2 antipattern)
// implicit def stringToInt(s: String): Int = s.toInt  // too magical, breaks code

// PREFER explicit over clever:
// BAD:
def process(using magic: ComplexImplicit): Unit = ???

// GOOD: make the dependency clear
def process(config: Config, logger: Logger): Unit = ???
```

### scalafmt Configuration

```hocon
# .scalafmt.conf
version = "3.8.3"
runner.dialect = scala3

maxColumn = 100
indent.main = 2
indent.significant = 2

align.preset = more
newlines.topLevelStatementBlankLines = [
  { blanks { before = 1 } }
]

rewrite.rules = [SortImports, RedundantBraces]
rewrite.scala3.insertEndMarkerMinLines = 15
```

### The "Principle of Least Power"

```scala
// Use the weakest abstraction that gets the job done
// Don't reach for IO when a pure function works:
def addTax(price: Double, rate: Double): Double = price * (1 + rate)  // pure, testable

// Don't use Future when a simple val works
// Don't use Monad[F[_]] typeclass when Option is sufficient
// Don't abstract over F[_] unless you truly need it to work for multiple effects

// Exception: DO abstract when your code must work over:
// - Multiple effect types (tests use IO.pure, prod uses real IO)
// - Multiple collection types
// - Adding new variants without changing callers
```

## Scala vs Java Style Comparison

| Aspect | Java Style | Scala Idiomatic |
|---|---|---|
| Data | Mutable POJO with setters | Immutable `case class` |
| Null | `null` as valid return | `Option[T]` |
| Error | `throws Exception` | `Either[E, A]` or `Try[A]` |
| Loops | `for (int i=0; i<n; i++)` | `(1 to n).map(...)` |
| Conditionals | Statement `if` | Expression `if/else` |
| Type test | `instanceof` + cast | `match` with type pattern |
| Constructors | `new` keyword | companion `apply` or `case class` |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | `var` creeping into FP code — defeats reasoning | Code review rule: every `var` needs a comment explaining why |
| 2 | Returning `null` from a method — Java habit | Return `Option[T]`; use `Option(x)` to wrap possibly-null values |
| 3 | Overuse of postfix operator notation — `list size` instead of `list.size` | Postfix requires explicit import; prefer dot notation for clarity |
| 4 | `Thread.sleep` in tests — flaky and slow | Use `TestControl` (cats-effect) or mock time sources |
| 5 | Deep implicit chains — type error messages become cryptic | Limit implicit chains to 1-2 levels; prefer explicit code |

## Review Questions

1. Why is `val result = if condition then a else b` preferred over `var result = ...; if condition then result = a`?
2. What is the "principle of least power" and how does it guide abstraction choices?
3. Why do Scala naming conventions use camelCase for constants instead of `UPPER_SNAKE_CASE`?

---

Related: [[Scala_Overview]] | [[Scala_Immutability_and_ADTs]] | [[Scala_Testing]] | [[Scala_Build_Tools]]

#Scala
