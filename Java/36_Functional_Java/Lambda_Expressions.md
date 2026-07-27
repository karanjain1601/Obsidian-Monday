---
title: "Lambda Expressions"
aliases: ["Java Lambdas", "Lambda Java 8", "Anonymous Functions Java"]
tags: [java, functional, lambda, closures, beginner]
domain: Java
difficulty: beginner
created: 2026-07-26
related: ["[[Functional_Interfaces]]", "[[Method_References]]", "[[Stream_API]]", "[[_MOC_Functional_Java]]"]
status: complete
---

# λ Lambda Expressions

> [!abstract] TL;DR
> Lambdas are **anonymous functions** — they have parameters, a body, and a return value, but no name. They implement functional interfaces concisely. Syntax: `(parameters) -> expression` or `(parameters) -> { statements; }`. Lambdas can capture variables from their enclosing scope, but those variables must be **effectively final** (not reassigned after capture). Lambdas don't create a new scope for `this` — `this` refers to the enclosing class.

## Intuition — Functions as Values

Before lambdas, behaviour was bundled in objects. You created a `Comparator` to sort — an entire class for one method. Lambda makes the function itself a value you can pass around:

```java
// Pre-lambda (anonymous class)
list.sort(new Comparator<String>() {
    @Override
    public int compare(String a, String b) { return a.length() - b.length(); }
});

// Lambda — the same thing, 5x shorter
list.sort((a, b) -> a.length() - b.length());
```

---

## How It Works

```mermaid
graph TD
    SYNTAX["Lambda Syntax"] --> SINGLE["Single-expression\n(x) -> x * 2"]
    SYNTAX --> BLOCK["Block body\n(x) -> { int y = x*2; return y; }"]
    SYNTAX --> NOPARAM["No params\n() -> System.out.println(\"hi\")"]
    SYNTAX --> MULTI["Multiple params\n(a, b) -> a + b"]

    SINGLE -->|"compiles to"| FINT["Functional Interface\nimplementation"]
    BLOCK --> FINT

    CAPTURE["Captured variables\nfrom enclosing scope"] -->|"must be"| EFF_FINAL["Effectively final\n(not reassigned)"]

    style SYNTAX fill:#7c3aed,color:#fff
    style FINT fill:#7ed321,color:#fff
    style EFF_FINAL fill:#e64980,color:#fff
```

## Key Concepts / Details

### Lambda Syntax Variants

```java
// Form 1: No parameters
Runnable r = () -> System.out.println("Hello!");
r.run();  // "Hello!"

// Form 2: Single parameter (parentheses optional for single param)
Consumer<String> print = s -> System.out.println(s);
Consumer<String> print2 = (s) -> System.out.println(s);  // same

// Form 3: Multiple parameters (parentheses required)
Comparator<String> byLength = (a, b) -> a.length() - b.length();
BiFunction<Integer, Integer, Integer> add = (x, y) -> x + y;

// Form 4: Block body (multiple statements, explicit return)
Function<String, String> process = (s) -> {
    String trimmed = s.trim();
    String upper = trimmed.toUpperCase();
    return upper;
};

// Form 5: With explicit types (usually inferred, but valid)
Comparator<String> explicit = (String a, String b) -> a.length() - b.length();

// Return in expression form (no "return" keyword needed)
Function<Integer, Boolean> isEven = n -> n % 2 == 0;  // expression returns boolean
```

### Target Typing — How the Compiler Knows the Type

```java
// The compiler infers the lambda's type from context (target type)

// Target: Runnable (run() returns void, 0 params)
Runnable r = () -> System.out.println("running");

// Target: Supplier<String> (get() returns String, 0 params)
Supplier<String> s = () -> "hello";

// Target: Comparator<Integer> (compare() returns int, 2 Integer params)
Comparator<Integer> c = (a, b) -> Integer.compare(a, b);

// Method parameter determines target type
List<String> names = List.of("Charlie", "Alice", "Bob");
names.sort((a, b) -> a.compareTo(b));  // sort() takes Comparator → lambda targets Comparator

// Ambiguous — two matching overloads
// execute(() -> someVoidCall());  // ambiguous if execute(Runnable) and execute(Callable<Void>) both exist
// Disambiguate with cast or method reference
```

### Closures — Capturing Outer Variables

```java
public class LambdaCapture {

    private int instanceField = 10;  // instance fields can always be captured (captured via "this")

    public Runnable createCounter() {
        int localVar = 5;  // effectively final — never reassigned

        return () -> {
            // Can read effectively-final local variables
            System.out.println("Local: " + localVar);  // OK

            // Can read/write instance fields (via this)
            System.out.println("Instance: " + instanceField);  // OK
            instanceField++;  // OK — mutating through instance reference, not capturing field

            // CANNOT capture and modify local primitive
            // localVar++;  // COMPILE ERROR — local variable must be final or effectively final
        };
    }

    public void captureExamples() {
        String message = "Hello";  // effectively final (never reassigned)
        Runnable ok = () -> System.out.println(message);  // OK

        String changing = "Initial";
        // Runnable bad = () -> System.out.println(changing);  // would be OK
        changing = "Modified";  // now changing is NOT effectively final
        // The lambda above would cause a compile error because of this reassignment

        // Workaround for capturing mutable state: use array or AtomicInteger
        int[] counter = {0};  // array reference is effectively final; element can change
        Runnable mutableCapture = () -> counter[0]++;  // OK (but not thread-safe)

        AtomicInteger atomicCounter = new AtomicInteger(0);
        Runnable threadSafe = () -> atomicCounter.incrementAndGet();  // thread-safe mutation
    }
}
```

### `this` in Lambdas vs Anonymous Classes

```java
public class ThisDemo {
    private String name = "Outer";

    public void showDifference() {
        // Anonymous class: creates new class — "this" refers to anonymous class
        Runnable anon = new Runnable() {
            @Override
            public void run() {
                System.out.println(this.getClass().getSimpleName());  // Runnable$1 (anon class)
                System.out.println(ThisDemo.this.name);  // need outer class qualifier
            }
        };

        // Lambda: no new class — "this" refers to enclosing class
        Runnable lambda = () -> {
            System.out.println(this.getClass().getSimpleName());  // "ThisDemo"
            System.out.println(this.name);  // "Outer" — this is ThisDemo
        };
    }
}
```

### Lambdas in Common APIs

```java
// Sorting
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));
names.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));

// Thread creation
Thread t = new Thread(() -> System.out.println("Running in thread"));
t.start();

// Conditional with Predicate
List<String> filtered = names.stream()
    .filter(name -> name.startsWith("A"))
    .collect(Collectors.toList());

// Optional operations
Optional<String> opt = Optional.of("hello");
opt.ifPresent(s -> System.out.println(s.toUpperCase()));
String result = opt.map(String::toUpperCase).orElse("default");

// Event listeners (JavaFX example)
button.setOnAction(event -> System.out.println("Button clicked!"));

// Suppliers for lazy initialization
Supplier<List<String>> lazyList = ArrayList::new;
List<String> list = lazyList.get();
```

### Lambda Performance Notes

```java
// Lambda compilation: compiler creates invokedynamic bytecode
// First invocation: lambda class is generated by LambdaMetafactory
// Subsequent: same class reused (not allocated per call)

// Capturing lambdas (those that capture variables) allocate on each capture
// Non-capturing lambdas (no captured variables) are singletons — no allocation!

// Non-capturing (singleton — no allocation per call)
Comparator<String> byLength = (a, b) -> a.length() - b.length();
// This comparator object is allocated once and reused

// Capturing (new instance per stream chain)
String prefix = "Hello";  // captured
Predicate<String> startsWith = s -> s.startsWith(prefix);  // captures "prefix"
// One Predicate object created when the lambda is evaluated — not per element
```

## Real-World Notes

- **Lambdas are compiled to `invokedynamic`**, not anonymous inner classes — the JVM generates the functional interface implementation on first use via `LambdaMetafactory`. This is faster and produces less bytecode than anonymous classes.
- **Prefer method references for existing methods** — `s -> s.toUpperCase()` → `String::toUpperCase`. Cleaner, more readable, and the compiler can sometimes optimize better.
- **Lambda + parallel streams: beware shared mutable state** — lambdas in `parallelStream()` may execute on different threads. Never mutate shared state inside a lambda unless using thread-safe structures.
- **Exception handling in lambdas is verbose** — checked exceptions must be caught inside the lambda body. Use helper wrappers (`ThrowingSupplier`, `ThrowingFunction`) for clean code.

## Common Pitfalls

- **Capturing loop variable** — `for (int i = 0; i < 10; i++) { lambdas.add(() -> System.out.println(i)); }` → compile error because `i` is reassigned. Use `final int captured = i;` inside the loop.
- **Mutable local variable capture** — incrementing a local `int` inside a lambda requires `int[]` or `AtomicInteger` workaround. This is by design — lambdas should be pure or use thread-safe mutation.
- **`this` confusion** — if you access `this` inside a lambda defined in an instance method, it refers to the outer class. If you wanted the anonymous class's `this`, you need an anonymous class, not a lambda.
- **Void lambda returning a value** — `Consumer<String> c = s -> s.length();` doesn't compile — `Consumer` expects `void`. The expression `s.length()` returns int, but Consumer expects void. Either use `Function<String, Integer>` or wrap in a block: `s -> { s.length(); }` (discarding the result).

## Related Concepts
- [[Functional_Interfaces]] — the interfaces that lambdas implement
- [[Method_References]] — shorthand for lambdas that simply call a method
- [[Stream_API]] — where lambdas are used most extensively

## Review Questions
1. Why must variables captured by a lambda be effectively final?
2. How does `this` differ in a lambda vs an anonymous inner class?
3. What is the difference between a capturing and a non-capturing lambda in terms of object allocation?

#java #functional #lambda #closures #effectively-final #anonymous-function
