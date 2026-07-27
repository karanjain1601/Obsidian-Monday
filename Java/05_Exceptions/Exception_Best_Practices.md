---
title: "Exception Best Practices"
aliases: [Exception Handling Best Practices, Exception Translation, Fail Fast, Exception Anti-Patterns]
tags: [Java, Exceptions, BestPractices, ExceptionTranslation, FailFast, Logging, ErrorHandling]
domain: Java
difficulty: Intermediate
created: 2026-07-27
related:
  - Checked_vs_Unchecked
  - Try_with_Resources
  - _MOC_Java_Exceptions
status: complete
---

# 🛡️ Exception Best Practices

> [!abstract] TL;DR
> Never swallow exceptions — an empty catch block is a time bomb. **Log at system boundaries** (controllers, queue consumers), not deep inside libraries. **Exception translation** converts low-level infrastructure exceptions into domain-meaningful ones while preserving the cause chain. **Fail fast** with `IllegalArgumentException` or `Objects.requireNonNull` at method entry rather than letting bad data propagate. Use **exception chaining** (`new RuntimeException("msg", cause)`) religiously — losing the root cause is the single most painful debugging mistake in production.

---

## Intuition

Think of exception handling like an emergency escalation protocol in a hospital:

- **Fail fast** = triage at the front door. Don't let a patient with a broken arm walk all the way to the surgery ward before someone notices — validate inputs the moment they arrive.
- **Log at system boundary** = the ER desk files a report when a new case comes in, not every time a nurse checks vitals. Inner methods don't log; the outer boundary does.
- **Exception translation** = the ER translates "patient presented with fractured proximal phalanx" into "patient has a broken finger" for the family — the technical detail is preserved in the chart (the cause chain), but the communicated error is meaningful to the receiver.
- **Never swallow** = never quietly discharge a patient without treatment and pretend nothing happened.

---

## How It Works

### Exception Handling Decision Flow

```mermaid
graph TD
    Throw["Exception thrown in library/infrastructure layer"]:::start

    Q1{"Can the caller\nrecover meaningfully?"}:::decision
    Q2{"Are we at a\nsystem boundary?"}:::decision
    Q3{"Is this a\nprogrammer error?"}:::decision

    Throw --> Q1

    Q1 -->|Yes| Checked["Throw checked exception\nor translate to domain exception"]:::action
    Q1 -->|No| Q3

    Q3 -->|Yes| Unchecked["Throw unchecked\n(IllegalArg, NPE, ISE)"]:::action
    Q3 -->|No| Q2

    Q2 -->|Yes| Log["Log with full context\nMap to API/protocol response"]:::action
    Q2 -->|No| Rethrow["Rethrow (wrap if checked)\nDo NOT log here"]:::action

    Unchecked --> Bubble["Bubble up to boundary"]:::end
    Rethrow --> Bubble
    Bubble --> Log

    classDef start fill:#FF6B35,stroke:#CC4400,color:#fff,font-weight:bold
    classDef decision fill:#2D6A4F,stroke:#1B4332,color:#fff
    classDef action fill:#95D5B2,stroke:#52B788,color:#1B4332
    classDef end fill:#E9C46A,stroke:#F4A261,color:#000
```

---

## Key Concepts

### 1. Never Swallow Exceptions

```java
import java.util.logging.*;

public class SwallowingAntiPattern {

    private static final Logger log = Logger.getLogger(SwallowingAntiPattern.class.getName());

    // TERRIBLE: exception swallowed — bug is invisible
    public void saveUser_BAD(User user) {
        try {
            database.save(user);
        } catch (Exception e) {
            // Nothing! The user was never saved but callers don't know.
        }
    }

    // STILL BAD: printing is not logging — no stack trace, no context, not searchable
    public void saveUser_ALSO_BAD(User user) {
        try {
            database.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // CORRECT: either log + handle, or rethrow
    public void saveUser_GOOD(User user) {
        try {
            database.save(user);
        } catch (DatabaseException e) {
            log.log(Level.SEVERE, "Failed to save user id=" + user.id(), e);
            throw new UserPersistenceException("Could not save user: " + user.id(), e);
        }
    }

    interface Database { void save(Object o) throws DatabaseException; }
    static class DatabaseException extends RuntimeException { DatabaseException(String m) { super(m); } }
    static class UserPersistenceException extends RuntimeException {
        UserPersistenceException(String m, Throwable c) { super(m, c); }
    }
    record User(long id, String name) {}
    Database database = o -> {};
}
```

### 2. Log at System Boundary, Not Inside Libraries

```java
import org.slf4j.*;

public class LoggingBoundary {

    // Library/service layer — DO NOT LOG here; just rethrow
    public class OrderService {
        private static final Logger log = LoggerFactory.getLogger(OrderService.class);

        public Order createOrder(long userId, List<Item> items) {
            validateItems(items);              // may throw IllegalArgumentException
            User user = userRepo.findById(userId);  // may throw UserNotFoundException
            return orderRepo.save(new Order(user, items)); // may throw DataException
            // No try-catch here — let exceptions bubble up naturally
        }
    }

    // System boundary (REST controller) — LOG here
    public class OrderController {
        private static final Logger log = LoggerFactory.getLogger(OrderController.class);
        private final OrderService service;

        public ResponseEntity<?> create(CreateOrderRequest req) {
            try {
                Order order = service.createOrder(req.userId(), req.items());
                return ResponseEntity.ok(order);
            } catch (IllegalArgumentException e) {
                // Client error — log at WARN, return 400
                log.warn("Bad order request userId={}: {}", req.userId(), e.getMessage());
                return ResponseEntity.badRequest().body(e.getMessage());
            } catch (Exception e) {
                // Server error — log at ERROR with full trace, return 500
                log.error("Unexpected error creating order for userId={}", req.userId(), e);
                return ResponseEntity.internalServerError().body("Internal error");
            }
        }

        record CreateOrderRequest(long userId, List<Item> items) {}
        OrderController(OrderService s) { this.service = s; }
    }

    // Avoid double-logging: if service logs AND controller logs, every error appears twice
    // Rule: log once, at the outermost boundary that can map the exception to a response

    interface User {}
    interface Item {}
    interface Order {}
    interface UserRepo { User findById(long id); }
    interface OrderRepo { Order save(Object o); }
    class UserNotFoundException extends RuntimeException { }
    UserRepo userRepo = id -> { throw new UserNotFoundException(); };
    OrderRepo orderRepo = o -> null;
    List<Item> items = List.of();
}
```

### 3. Exception Translation

```java
public class ExceptionTranslation {

    // Infrastructure exception — contains JDBC details
    // Domain layer should never expose SQL details to callers

    public class UserRepository {

        public User findById(long id) {
            try {
                return jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE id = ?",
                    userMapper, id
                );
            } catch (EmptyResultDataAccessException e) {
                // Translate to meaningful domain exception
                throw new UserNotFoundException("User not found: id=" + id, e);
            } catch (DataAccessException e) {
                // Translate infrastructure exception to domain exception
                throw new RepositoryException("Failed to load user: id=" + id, e);
                // Cause is preserved: e is passed as second argument
            }
        }
    }

    // Domain exceptions — callers understand these; JDBC is encapsulated
    static class UserNotFoundException extends RuntimeException {
        UserNotFoundException(String msg, Throwable cause) { super(msg, cause); }
    }
    static class RepositoryException extends RuntimeException {
        RepositoryException(String msg, Throwable cause) { super(msg, cause); }
    }

    // Exception chaining: ALWAYS pass cause
    // new RuntimeException("msg", cause)   ✓ root cause preserved
    // new RuntimeException("msg")          ✗ root cause LOST — debugging nightmare

    interface JdbcTemplate { Object queryForObject(String sql, Object mapper, long id); }
    interface EmptyResultDataAccessException {}
    interface DataAccessException {}
    interface UserMapper {}
    interface User {}
    JdbcTemplate jdbcTemplate = (s, m, id) -> null;
    UserMapper userMapper = null;
}
```

### 4. Fail Fast — Validate at Entry

```java
import java.util.Objects;

public class FailFast {

    // BAD: late failure — bad data propagates through layers before failing
    public Order processOrder_BAD(User user, List<Item> items) {
        // What if user is null? NPE somewhere deep in business logic
        // What if items is empty? Logic error far from the call site
        inventory.reserve(items);
        Payment payment = paymentService.charge(user, items);
        return orderRepo.save(new Order(user, items, payment));
    }

    // GOOD: fail immediately at entry with clear messages
    public Order processOrder_GOOD(User user, List<Item> items) {
        Objects.requireNonNull(user,  "user must not be null");
        Objects.requireNonNull(items, "items must not be null");
        if (items.isEmpty()) throw new IllegalArgumentException("Order must contain at least one item");
        if (items.size() > 100) throw new IllegalArgumentException(
            "Order exceeds maximum item count: " + items.size() + " > 100");

        // Now we know preconditions hold — proceed with confidence
        inventory.reserve(items);
        Payment payment = paymentService.charge(user, items);
        return orderRepo.save(new Order(user, items, payment));
    }

    // Objects.requireNonNull — idiomatic Java for null guard
    // throws NullPointerException with the provided message
    // Alternative: Guava's Preconditions.checkNotNull, checkArgument, checkState

    interface User {}
    interface Item {}
    interface Order {}
    interface Payment {}
    interface Inventory { void reserve(List<Item> items); }
    interface PaymentService { Payment charge(User user, List<Item> items); }
    interface OrderRepository { Order save(Object o); }
    Inventory inventory = items -> {};
    PaymentService paymentService = (u, i) -> null;
    OrderRepository orderRepo = o -> null;
}
```

### 5. Structured Logging with MDC

```java
import org.slf4j.MDC;

public class StructuredLogging {

    // MDC (Mapped Diagnostic Context) — attach context to every log line
    // in a request's thread without passing it through every method call

    public ResponseEntity<?> handleRequest(HttpRequest req) {
        // Put correlation ID in MDC at entry point
        String correlationId = req.header("X-Correlation-ID");
        MDC.put("correlationId", correlationId);
        MDC.put("userId", req.header("X-User-ID"));
        try {
            return process(req);
        } catch (Exception e) {
            // Every log line in this thread now automatically includes correlationId and userId
            log.error("Request failed", e);  // log output: {"correlationId":"abc","userId":"42",...}
            return ResponseEntity.internalServerError().build();
        } finally {
            MDC.clear();  // always clear MDC at thread boundary to prevent leaks in thread pools
        }
    }

    static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(StructuredLogging.class);
    interface HttpRequest { String header(String name); }
    interface ResponseEntity<T> {
        static <T> ResponseEntity<T> internalServerError() { return null; }
        default ResponseEntity<T> build() { return this; }
    }
    ResponseEntity<?> process(HttpRequest req) { return null; }
}
```

### 6. Functional Exception Patterns — Either Simulation

```java
import java.util.function.*;

public class FunctionalPatterns {

    // Java has no built-in Either type, but we can approximate it
    // Useful for functional pipelines that shouldn't throw

    sealed interface Result<T> permits Result.Success, Result.Failure {
        record Success<T>(T value) implements Result<T> {}
        record Failure<T>(String error, Throwable cause) implements Result<T> {}

        static <T> Result<T> of(Supplier<T> supplier) {
            try {
                return new Success<>(supplier.get());
            } catch (Exception e) {
                return new Failure<>(e.getMessage(), e);
            }
        }

        default boolean isSuccess() { return this instanceof Success; }

        @SuppressWarnings("unchecked")
        default <R> Result<R> map(Function<T, R> fn) {
            return switch (this) {
                case Success<T>(var v) -> Result.of(() -> fn.apply(v));
                case Failure<T>(var msg, var cause) -> new Failure<>(msg, cause);
            };
        }
    }

    public static void demo() {
        Result<Integer> result = Result.of(() -> Integer.parseInt("42"))
            .map(n -> n * 2)
            .map(n -> n + 1);

        switch (result) {
            case Result.Success<Integer>(var v) -> System.out.println("Value: " + v);
            case Result.Failure<Integer>(var msg, var cause) -> System.err.println("Error: " + msg);
        }
    }
}
```

---

## Real-World Notes

- **Spring's `@ControllerAdvice`** is the canonical system-boundary exception handler for web apps — centralize all `@ExceptionHandler` methods there, log at ERROR for 5xx, at WARN for 4xx, and never log at ERROR for client errors (it pollutes on-call alerts).
- **Sentry / Datadog error tracking**: only capture exceptions at the outermost boundary and once per request. Capturing inside service methods causes duplicate entries in error tracking tools.
- **`Objects.requireNonNull` in constructors**: every field passed to a constructor should be null-checked there so that the object is never in a partially-invalid state. An object with a null required field is a bug that hides until some method is called.
- **Library authors**: NEVER log from inside a library — libraries have no idea where their output will go or how to format it. Throw informative exceptions with all context in the message and let application code decide what to log.

---

## Common Pitfalls (Anti-Patterns)

| Anti-Pattern | Example | Consequence | Fix |
|-------------|---------|-------------|-----|
| Empty catch block | `catch (Exception e) { }` | Silent failure; impossible to diagnose | Log and/or rethrow always |
| Logging then rethrowing | `log.error("...", e); throw e;` | Double-logged in every caller | Log only at the outermost boundary |
| Catching `Throwable` or `Error` | `catch (Throwable t)` in business code | JVM errors caught; corrupt state continues | Only catch `Exception`; let `Error` kill the JVM |
| Losing the cause | `throw new RuntimeException("msg")` after catching `e` | Root cause gone; debugging is guesswork | Always: `throw new RuntimeException("msg", e)` |
| Catch then ignore with comment | `// should never happen` | It will happen; you'll have no info | Throw `AssertionError("should never happen", e)` |
| Generic catch in library | `catch (Exception e)` in a library method | Catches and hides programming errors | Catch specific, expected exception types only |
| Fail slow instead of fail fast | Null check 10 layers deep | Misleading stack trace far from root cause | Validate at entry with `requireNonNull` |

---

## Related Notes

- [[_MOC_Java_Exceptions|↑ Section MOC — Java Exceptions]]
- [[Checked_vs_Unchecked]] — which exception type to throw and when
- [[Try_with_Resources]] — resource cleanup and suppressed exceptions
- [[Streams_and_Pipelines]] — functional patterns and exception handling in lambdas
- [[Logging_and_Observability]] — MDC, structured logging, correlation IDs

---

## Review Questions

1. A library method catches `IOException`, logs it with `log.error(...)`, and then throws a `RuntimeException(e)`. The application's REST controller also catches the RuntimeException and logs it. What problem does this create in production, and how would you fix the library's exception handling?

2. A teammate's code reads: `catch (Exception e) { throw new ServiceException("failed"); }` — the original exception `e` is not passed to the constructor. In what scenario does this make debugging in production extremely difficult, and what is the one-line fix?

3. You are writing a public utility method `parseConfig(String yaml)`. Describe a "fail fast" strategy for this method: what do you validate, in what order, and what exception types do you throw for each kind of invalid input?

---

#Java #Exceptions #BestPractices #ExceptionTranslation #FailFast #Logging #ErrorHandling #Intermediate
