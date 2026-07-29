---
title: Swift Types and Variables
aliases: [Swift Optionals, Swift Type System, Swift Variables]
tags: [Swift, SwiftUI, Optionals, TypeSystem, Variables]
domain: Swift
difficulty: Beginner
created: 2026-07-29
related: [Swift_Overview, Swift_Control_Flow, Swift_Error_Handling]
status: complete
---

# Swift Types and Variables

> [!abstract] TL;DR
> Swift's type system has two pillars: **optionals** (`T?`) — the compiler's built-in mechanism for expressing "value or nil" — and **type inference**, which eliminates most explicit annotations while keeping full static typing. `let` declares constants; `var` declares variables. Optionals must be explicitly unwrapped before use, preventing the billion-dollar null pointer mistake at compile time.

---

## `let` vs `var`

```swift
let pi = 3.14159          // constant — cannot be reassigned
var score = 0             // variable — can be mutated

score += 10               // ✓
pi = 3.0                  // ✗ error: cannot assign to value: 'pi' is a 'let' constant
```

**Prefer `let` by default.** The compiler warns you if a `var` is never mutated and suggests converting it to `let`.

---

## Type Inference and Annotations

Swift infers types at compile time from the initializer expression:

```swift
let greeting = "Hello"       // inferred: String
let count = 42               // inferred: Int
let ratio = 0.5              // inferred: Double
let flag = true              // inferred: Bool

// Explicit annotation when inference is insufficient or for clarity:
let price: Float = 9.99
let items: [String] = []     // empty array — type cannot be inferred alone
```

---

## The Optional Type — Swift's Killer Feature

An optional `T?` is sugar for `Optional<T>`, an enum with two cases:

```swift
enum Optional<Wrapped> {
    case some(Wrapped)
    case none
}
```

```swift
var name: String? = "Alice"  // has a value
var age: Int? = nil          // explicitly absent

// WRONG — compiler error before you ever ship
let length = name.count      // ✗ value of optional type 'String?' must be unwrapped

// RIGHT — force unwrap (crashes if nil — avoid in production)
let length = name!.count

// RIGHT — optional chaining (returns nil if name is nil)
let length = name?.count     // type: Int?
```

---

## Optional Binding

**`if let`** — unwrap into a scoped constant:

```swift
if let unwrappedName = name {
    print("Hello, \(unwrappedName)")   // unwrappedName is String here
} else {
    print("No name provided")
}

// Swift 5.7+ shorthand — shadows the outer optional with same name
if let name {
    print("Hello, \(name)")
}
```

**`guard let`** — early-exit pattern, keeps main path unindented:

```swift
func greet(name: String?) {
    guard let name else {
        print("No name")
        return                 // must exit scope here
    }
    // name is String (non-optional) for the rest of the function
    print("Hello, \(name)")
}
```

**`while let`** — iterate until nil (common with iterators):

```swift
var iterator = someSequence.makeIterator()
while let element = iterator.next() {
    process(element)
}
```

---

## Optional Chaining (`?.`)

Returns an optional — if any link in the chain is nil, the whole expression evaluates to nil without crashing:

```swift
struct User {
    var address: Address?
}
struct Address {
    var city: String
}

let user: User? = User(address: Address(city: "London"))

let city = user?.address?.city    // type: String? — "London"
let missing: User? = nil
let noCity = missing?.address?.city  // nil — no crash
```

---

## Nil Coalescing (`??`)

Provides a default value when the optional is nil:

```swift
let displayName = user?.name ?? "Anonymous"   // String (non-optional)
let port = configuredPort ?? 8080
```

Chains are left-associative: `a ?? b ?? c` evaluates as `(a ?? b) ?? c`.

---

## Implicitly Unwrapped Optionals (`!`)

Declared with `!` — treated as non-optional in usage but can be nil (crashes if nil when accessed):

```swift
var imageView: UIImageView!   // common in IBOutlets — set before first use

// Use sparingly; prefer lazy var or proper optional binding
```

---

## Type Aliases and Tuples

```swift
typealias Coordinate = (Double, Double)
typealias CompletionHandler = (Result<Data, Error>) -> Void

// Unnamed tuple
let point = (3.0, 4.0)
let x = point.0    // 3.0

// Named tuple — preferred for clarity
let namedPoint: (x: Double, y: Double) = (x: 3.0, y: 4.0)
let px = namedPoint.x

// Decomposition
let (width, height) = (1920.0, 1080.0)

// Returning multiple values from functions
func minMax(_ arr: [Int]) -> (min: Int, max: Int) {
    return (arr.min()!, arr.max()!)
}
let result = minMax([3, 1, 4, 1, 5])
print(result.max)   // 5
```

---

## Type Safety and Casting

```swift
let mixed: Any = 42

// `is` — type check
if mixed is Int { print("It's an Int") }

// `as?` — conditional downcast (optional)
if let n = mixed as? Int {
    print(n * 2)   // 84
}

// `as!` — forced downcast (crashes if wrong type)
let n = mixed as! Int

// Numeric types do NOT implicitly convert
let a: Int = 10
let b: Double = 3.14
// let c = a + b  ✗ — must cast explicitly
let c = Double(a) + b   // ✓
```

---

## Common Pitfalls

1. **Overusing `!`** — force-unwrapping hides bugs; crashes appear in production instead of compile time.
2. **Optional pyramid of doom** — nested `if let` blocks; use `guard let` or `if let a, let b` multi-binding (Swift 5.9).
3. **`var` everywhere** — immutability is free; reach for `let` first.
4. **Forgetting `?` on optional chain result type** — `user?.name` is `String?`, not `String`; assigning it to a `String` is a compile error.
5. **Comparing optionals to nil with `==`** — works, but `if let` or `guard let` is more idiomatic and also binds the value.

---

## Review Questions

1. **What is the underlying type of `String?` in Swift, and what are its two cases?**
   *Answer: `Optional<String>` — an enum with `.some(String)` and `.none`.*

2. **When would you choose `guard let` over `if let`?**
   *Answer: `guard let` is for early-exit validation at the top of a function — it keeps the happy path unindented and makes "must-have" requirements explicit. `if let` is for branching logic where both paths have meaningful work.*

3. **What is the difference between `weak` and `unowned` references in the context of ARC?**
   *Answer: `weak` is optional and is zeroed to nil when the referenced object deallocates (safe to use after dealloc). `unowned` is non-optional and assumes the referenced object outlives the reference — accessing it after dealloc crashes.*

#Swift #SwiftUI #Optionals #TypeSystem
