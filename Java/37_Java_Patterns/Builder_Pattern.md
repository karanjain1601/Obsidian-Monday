---
title: "Builder Pattern"
aliases: ["Java Builder", "Lombok Builder", "Telescoping Constructor Problem"]
tags: [java, design-patterns, builder, lombok, beginner]
domain: Java
difficulty: beginner
created: 2026-07-26
related: ["[[Decorator_Pattern]]", "[[Strategy_Pattern]]", "[[_MOC_Java_Patterns]]"]
status: complete
---

# 🏗️ Builder Pattern

> [!abstract] TL;DR
> The Builder pattern solves the **telescoping constructor problem**: when an object has many optional parameters, you either have an explosion of constructors or one giant constructor. Builder uses a **fluent API** to set properties step by step and produces an immutable object at the end. **Lombok's `@Builder`** eliminates boilerplate entirely. Java 14+ **records** are a simpler alternative for truly immutable value objects with few fields.

## Intuition — Building a Custom Order

Creating an order with many optional fields is like **customizing a sandwich** — you specify only what you want, and the kitchen assembles it. A constructor forces you to specify every ingredient in one line (what's the third `false` for?). A builder lets you say `.withToast(true).withExtraCheese(true)` — self-documenting and flexible.

---

## How It Works

```mermaid
graph TD
    PROB["Problem: Telescoping Constructors\nnew Order(name, null, null, 0, true, false, ...)"] -->|"solved by"| BUILD["Builder\nOrder.builder()\n  .name(\"Alice\")\n  .amount(99.99)\n  .build()"]

    BUILD -->|"manual"| MANUAL["Manual inner Builder\nstatic class Builder { }"]
    BUILD -->|"lombok"| LOMBOK["@Builder annotation\nzero boilerplate"]
    BUILD -->|"record"| RECORD["Java Record\n+ wither methods"]

    MANUAL -->|"produces"| OBJ["Immutable Order object\n(all fields final)"]
    LOMBOK --> OBJ
    RECORD --> OBJ

    style PROB fill:#e64980,color:#fff
    style BUILD fill:#7c3aed,color:#fff
    style OBJ fill:#7ed321,color:#fff
```

## Key Concepts / Details

### The Problem: Telescoping Constructors

```java
// Bad: telescoping constructors — which null goes where?
public class Order {
    public Order(String customerId, String productId) { /* ... */ }
    public Order(String customerId, String productId, double amount) { /* ... */ }
    public Order(String customerId, String productId, double amount, String notes) { /* ... */ }
    public Order(String customerId, String productId, double amount, String notes, boolean express) { /* ... */ }
    // ... 10 more constructors for every combination

    // Usage: cryptic
    new Order("user-1", "prod-2", 99.99, null, true, false, null);  // WTF is false?
}
```

### Manual Builder — Classic Pattern

```java
public final class Order {  // immutable
    private final String customerId;
    private final String productId;
    private final double amount;
    private final String notes;         // optional
    private final boolean express;      // optional, default false
    private final String couponCode;    // optional

    // Private constructor — only Builder can call it
    private Order(Builder builder) {
        this.customerId = Objects.requireNonNull(builder.customerId, "customerId required");
        this.productId = Objects.requireNonNull(builder.productId, "productId required");
        this.amount = builder.amount;
        this.notes = builder.notes;
        this.express = builder.express;
        this.couponCode = builder.couponCode;
    }

    // Getters (no setters — immutable)
    public String getCustomerId() { return customerId; }
    public String getProductId() { return productId; }
    public double getAmount() { return amount; }
    public Optional<String> getNotes() { return Optional.ofNullable(notes); }
    public boolean isExpress() { return express; }
    public Optional<String> getCouponCode() { return Optional.ofNullable(couponCode); }

    // Static factory method to get the builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        // Required fields — initialized by required setters
        private String customerId;
        private String productId;
        private double amount;
        // Optional fields — with defaults
        private String notes;
        private boolean express = false;
        private String couponCode;

        // Required — not providing these causes NPE in build()
        public Builder customerId(String customerId) {
            this.customerId = customerId;
            return this;  // return this for chaining
        }
        public Builder productId(String productId) { this.productId = productId; return this; }
        public Builder amount(double amount) { this.amount = amount; return this; }

        // Optional
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder express(boolean express) { this.express = express; return this; }
        public Builder couponCode(String couponCode) { this.couponCode = couponCode; return this; }

        public Order build() {
            // Validate before construction
            if (amount <= 0) throw new IllegalStateException("Amount must be positive");
            return new Order(this);
        }
    }
}

// Usage — readable, self-documenting
Order order = Order.builder()
    .customerId("user-123")
    .productId("prod-456")
    .amount(99.99)
    .express(true)
    .couponCode("SAVE10")
    .build();
```

### Lombok `@Builder` — Zero Boilerplate

```java
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Getter
@Builder(toBuilder = true)  // toBuilder=true: generate order.toBuilder() for modifications
public class Order {
    @NonNull private final String customerId;   // Lombok validates non-null in builder
    @NonNull private final String productId;
    private final double amount;
    @Builder.Default private final boolean express = false;  // default value in builder
    private final String notes;
    private final String couponCode;
}

// Usage — identical to manual builder
Order order = Order.builder()
    .customerId("user-123")
    .productId("prod-456")
    .amount(99.99)
    .express(true)
    .build();

// toBuilder — create modified copy (immutable-safe modification)
Order expressOrder = order.toBuilder()
    .express(true)
    .couponCode("VIPCODE")
    .build();
// Original "order" is unchanged

// Lombok also generates:
// - All-args constructor
// - Static builder() method
// - Inner Builder class
// - build() method
```

### Java Records — For Simple Immutable Objects

```java
// Java 14+: Record = compact immutable class
record OrderRecord(String customerId, String productId, double amount, boolean express) {}

// Usage — compact but no optional fields, no defaults, no builder
OrderRecord o = new OrderRecord("user-1", "prod-2", 99.99, false);

// For optional params with records: use overloaded static factories
record Point(int x, int y, int z) {
    // Compact constructor for validation
    Point {
        if (x < 0 || y < 0) throw new IllegalArgumentException("Negative coordinates");
    }

    // Factory for 2D point (default z=0)
    static Point of(int x, int y) { return new Point(x, y, 0); }

    // "Wither" methods for immutable modification
    Point withX(int newX) { return new Point(newX, y, z); }
    Point withY(int newY) { return new Point(x, newY, z); }
}

Point p = Point.of(3, 4);       // 2D — z defaults to 0
Point moved = p.withX(10);      // new Point(10, 4, 0) — p unchanged
```

### Builder for Fluent Query/Configuration APIs

```java
// Builder pattern for complex API queries
public class OrderQuery {
    private final Status status;
    private final String customerId;
    private final LocalDate fromDate;
    private final LocalDate toDate;
    private final int limit;
    private final int offset;
    private final List<SortCriterion> sortBy;

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Status status;
        private String customerId;
        private LocalDate fromDate = LocalDate.now().minusMonths(1);  // default: last month
        private LocalDate toDate = LocalDate.now();
        private int limit = 20;
        private int offset = 0;
        private List<SortCriterion> sortBy = List.of(SortCriterion.CREATED_DESC);

        public Builder status(Status status) { this.status = status; return this; }
        public Builder customerId(String id) { this.customerId = id; return this; }
        public Builder fromDate(LocalDate from) { this.fromDate = from; return this; }
        public Builder toDate(LocalDate to) { this.toDate = to; return this; }
        public Builder limit(int limit) {
            if (limit > 1000) throw new IllegalArgumentException("Max limit is 1000");
            this.limit = limit;
            return this;
        }
        public Builder offset(int offset) { this.offset = offset; return this; }
        public Builder sortBy(SortCriterion... criteria) {
            this.sortBy = List.of(criteria);
            return this;
        }
        public OrderQuery build() { return new OrderQuery(this); }
    }
}

// Usage — readable query
List<Order> orders = orderService.findAll(
    OrderQuery.builder()
        .status(Status.COMPLETED)
        .customerId("VIP-001")
        .fromDate(LocalDate.parse("2025-01-01"))
        .limit(50)
        .sortBy(SortCriterion.AMOUNT_DESC)
        .build()
);
```

### Constructor vs Builder — Decision Table

| Scenario | Use | Reason |
|----------|-----|--------|
| 1-3 required params, no optionals | Constructor | Simple is better |
| 4+ params or any optionals | Builder | Self-documenting, avoids param confusion |
| All params always required | `@RequiredArgsConstructor` (Lombok) | Explicit, compact |
| Truly immutable value object, < 5 fields | Record | Most concise |
| Need defaults for some params | Builder (`@Builder.Default`) | Only builder supports defaults cleanly |
| Need to create modified copies | Builder with `toBuilder=true` | Immutable modification pattern |

## Real-World Notes

- **Lombok `@Builder` is the standard in Spring projects** — the vast majority of Spring Boot codebases use Lombok. `@Builder` + `@Getter` + `@EqualsAndHashCode` is the idiomatic pattern for DTOs.
- **`toBuilder=true` enables the "withers" pattern** — when you need to create a slightly modified copy of an immutable object (common in event sourcing), `toBuilder()` is cleaner than a manual copy constructor.
- **Builder for test data** — builders make test data setup readable: `Order.builder().amount(100).status(ACTIVE).build()`. Combine with `@Builder` and default values for "happy path" test data.
- **Validate in `build()`, not in setters** — setter validation means every partial state is validated. Build-time validation means validation happens once when the object is complete.

## Common Pitfalls

- **Mutable Builder leaking** — if the same Builder instance is reused, subsequent `build()` calls return objects sharing the same mutable state. Always create a new Builder: `Order.builder().field(x).build()`.
- **Forgetting `@Builder.Default`** — Lombok's `@Builder` initializes primitive fields to 0/false/null even if you assign a default in the field declaration. Use `@Builder.Default` to preserve defaults.
- **Builder without validation** — builder makes it easy to omit required fields. Always validate in `build()` with explicit checks or `Objects.requireNonNull`.
- **`@Builder` on class with inherited fields** — Lombok's `@Builder` doesn't include superclass fields. Use `@SuperBuilder` for inheritance hierarchies or flatten the hierarchy.

## Related Concepts
- [[Decorator_Pattern]] — Decorator also uses fluent builder-like APIs sometimes
- [[Functional_Interfaces]] — Supplier is sometimes used instead of builder for zero-arg construction

## Review Questions
1. What is the "telescoping constructor" problem and how does Builder solve it?
2. What does `@Builder.Default` do in Lombok, and why is it necessary?
3. When should you use a Java Record instead of a Builder?

#java #design-patterns #builder #lombok #immutable #fluent-api
