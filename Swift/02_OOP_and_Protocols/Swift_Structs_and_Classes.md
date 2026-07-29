---
title: Swift Structs and Classes
aliases: [Swift Value Types, Swift Reference Types, Swift Properties]
tags: [Swift, SwiftUI, Structs, Classes, ARC, Properties]
domain: Swift
difficulty: Intermediate
created: 2026-07-29
related: [Swift_Overview, Swift_Protocols_and_Extensions, Swift_Enums_and_Pattern_Matching]
status: complete
---

# Swift Structs and Classes

> [!abstract] TL;DR
> Structs are **value types** (copied on assignment, stack-allocated when small); classes are **reference types** (shared identity, ARC-managed heap allocation). Swift prefers structs by default — Apple's own frameworks use structs for most data models. Use classes when you need shared mutable state, inheritance, or Objective-C interop.

---

## Structs — Value Types

```swift
struct Point {
    var x: Double
    var y: Double

    // Computed property — no stored state
    var magnitude: Double {
        (x*x + y*y).squareRoot()
    }

    // mutating method — marks that self is modified
    mutating func translate(by delta: Point) {
        x += delta.x
        y += delta.y
    }
}

var p1 = Point(x: 3, y: 4)
var p2 = p1          // COPY — independent value
p2.x = 10
print(p1.x)          // 3.0 — unaffected
```

Structs get a **memberwise initializer** for free. Classes do not.

---

## Classes — Reference Types

```swift
class Animal {
    let species: String
    var name: String
    private var _energy: Int = 100

    // Designated initializer
    init(species: String, name: String) {
        self.species = species
        self.name = name
    }

    // Convenience initializer — delegates to designated
    convenience init(name: String) {
        self.init(species: "Unknown", name: name)
    }

    func eat() {
        _energy = min(_energy + 20, 100)
    }

    deinit {
        print("\(name) deallocated")   // ARC cleanup
    }
}

class Dog: Animal {
    var breed: String

    required init(species: String, name: String) {  // required for subclassing
        self.breed = "Mixed"
        super.init(species: species, name: name)
    }

    override func eat() {
        super.eat()
        print("\(name) is happy after eating")
    }
}

let dog1 = Dog(species: "Canis lupus", name: "Rex")
let dog2 = dog1           // SHARED REFERENCE — same object
dog2.name = "Buddy"
print(dog1.name)          // "Buddy" — same object!
```

---

## Struct vs Class Decision Table

| Criterion | Struct | Class |
|---|---|---|
| Memory | Value semantics (copy) | Reference semantics (shared) |
| Inheritance | No | Yes |
| `deinit` | No | Yes |
| `@objc` interop | Partial | Full |
| Thread safety | Inherently safer (copies) | Requires synchronization |
| ARC overhead | None | Reference counting |
| SwiftUI | Preferred for models | Preferred for ViewModels (`@Observable`) |

**Apple's rule of thumb**: Use a struct unless you need inheritance, identity (`===`), or ObjC interop.

---

## Properties in Depth

```swift
struct Circle {
    // Stored property
    var radius: Double

    // Computed property (no storage)
    var area: Double {
        get { Double.pi * radius * radius }
        set { radius = (newValue / Double.pi).squareRoot() }
    }

    // Read-only computed (shorthand — no get needed)
    var circumference: Double { 2 * Double.pi * radius }
}

class Sensor {
    // Property observers
    var temperature: Double = 0 {
        willSet { print("About to change to \(newValue)") }
        didSet  { if temperature < -273 { temperature = -273 } }
    }

    // Lazy property — initialized on first access
    lazy var expensiveResource: HeavyObject = HeavyObject()

    // Type (static) property
    static let maxTemperature = 1000.0
}
```

---

## `final` Keyword

```swift
final class Singleton {
    static let shared = Singleton()
    private init() {}
    // Compiler optimizes calls — no vtable dispatch
}

class Base {
    func method() { }
    final func fixedMethod() { }  // cannot be overridden in subclasses
}
```

`final` enables **devirtualization** — the compiler replaces dynamic dispatch with a direct call, improving performance.

---

## Identity vs Equality

```swift
let a = Dog(species: "Canis lupus", name: "Rex")
let b = a
let c = Dog(species: "Canis lupus", name: "Rex")

a === b   // true  — same object identity (reference equality)
a === c   // false — different objects, same values
// a == b   // compile error unless Dog conforms to Equatable
```

Structs with `Equatable` conformance compare by value; classes compare by identity with `===`.

---

## Common Pitfalls

1. **Mutating struct in a `let` binding** — `let point = Point(...)` makes `point` immutable; calling `point.translate(...)` is a compile error even though `translate` is `mutating`.
2. **Unintended sharing with class references** — passing a class instance to a function and mutating it there affects the caller's reference. This is often a bug.
3. **`required init` in subclasses** — if a superclass has a `required` initializer, every subclass must also implement it.
4. **Property observers on `let`** — `willSet`/`didSet` are only called after initialization. A `let` property's observer fires exactly once (at init time) and never again.
5. **`lazy var` in structs** — lazy properties are technically mutating (they write to storage on first access), so they cannot be used on `let` struct instances.

---

## Review Questions

1. **What happens at the memory level when you assign one struct to another? What about two class references?**
   *Answer: Struct assignment copies the value into a new memory location (copy-on-write for collections). Class assignment copies the reference pointer — both variables point to the same heap-allocated object.*

2. **Why does Swift prefer structs for SwiftUI data models?**
   *Answer: Structs have value semantics — SwiftUI can detect changes by comparing old and new values cheaply. Reference types require manual observation machinery (`@Observable`/`ObservableObject`) to detect mutations since two references can point to the same mutated object.*

3. **What is `final` and why does it matter for performance?**
   *Answer: `final` prevents subclassing (or method overriding). The compiler replaces virtual dispatch (pointer through vtable) with direct function calls — eliminating indirection and enabling inlining.*

#Swift #SwiftUI #Structs #Classes #ARC #Properties
