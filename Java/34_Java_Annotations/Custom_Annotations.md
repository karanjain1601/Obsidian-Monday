---
title: "Custom Annotations"
aliases: ["Java Custom Annotations", "@interface", "Annotation Declaration"]
tags: [java, annotations, custom, intermediate]
domain: Java
difficulty: intermediate
created: 2026-07-26
related: ["[[Built_in_Annotations]]", "[[Annotation_Processing]]", "[[Runtime_Annotations]]", "[[_MOC_Java_Annotations]]"]
status: complete
---

# 🏷️ Custom Annotations

> [!abstract] TL;DR
> Custom annotations are declared with `@interface`. Every annotation element looks like a method declaration (no parameters, no throws) and can have a `default` value. Meta-annotations (`@Retention`, `@Target`) control where and how long the annotation lives. Use `@Repeatable` for annotations that can appear multiple times on the same element. The annotation itself is just metadata — the processing (at compile time or runtime) gives it meaning.

## Intuition — Annotations as Structured Comments

Think of custom annotations as **typed, machine-readable comments**. `// FIXME` is a comment only humans read. `@RequiresRole("admin")` is an annotation that can be read and acted upon by a security framework at runtime. Annotations bring structure, type-safety, and toolability to what would otherwise be conventions or comments.

---

## How It Works

```mermaid
graph TD
    DECL["@interface MyAnnotation\n@Retention(RUNTIME)\n@Target(METHOD)"] -->|"applied to code"| USAGE["@MyAnnotation(value=\"test\")\npublic void doSomething()"]
    USAGE -->|"read at runtime"| REFL["Method.getAnnotation()\nMyAnnotation.class"]
    USAGE -->|"read at compile time"| APT["AbstractProcessor\nannotation processing"]

    META["Meta-Annotations\n@Retention · @Target\n@Documented · @Inherited\n@Repeatable"] -->|"configure"| DECL

    style DECL fill:#7c3aed,color:#fff
    style META fill:#e64980,color:#fff
    style REFL fill:#7ed321,color:#fff
```

## Key Concepts / Details

### Basic Annotation Declaration

```java
import java.lang.annotation.*;

// Simple marker annotation (no elements)
@Retention(RetentionPolicy.RUNTIME)  // visible at runtime via reflection
@Target(ElementType.METHOD)           // can only be placed on methods
public @interface Cacheable {
    // marker — no elements
}

// Usage
@Cacheable
public Product findById(Long id) {
    return repository.findById(id).orElseThrow();
}
```

### Annotation Elements (Attributes)

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface RateLimit {

    // Elements look like abstract methods — no parameters, no throws
    int requestsPerSecond();       // required element (no default)
    int burstCapacity() default 10; // optional element with default
    String key() default "";        // empty string is a common default

    // Element types allowed: primitives, String, Class, enum, Annotation, arrays of these
    Class<?>[] excludeClasses() default {};
    RetentionPolicy policy() default RetentionPolicy.RUNTIME; // enum example
}

// Usage with required element
@RateLimit(requestsPerSecond = 100)
public void apiEndpoint() {}

// Usage with all elements
@RateLimit(requestsPerSecond = 50, burstCapacity = 100, key = "user-api")
public void premiumApiEndpoint() {}
```

### The `value()` Convention

```java
// If an annotation has a single element named "value", it can be omitted in usage
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audit {
    String value();  // named "value" — can be used positionally
}

// These are equivalent:
@Audit("CREATE_ORDER")
public Order createOrder(OrderRequest req) {}

@Audit(value = "CREATE_ORDER")
public Order createOrder(OrderRequest req) {}

// Multiple elements — must always name them
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Log {
    String value();
    String level() default "INFO";
}

// @Log("myMethod")          — OK, "value" is implicit
// @Log("myMethod", "DEBUG") — COMPILE ERROR: must use names for multiple elements
// @Log(value = "myMethod", level = "DEBUG") — OK
```

### `@Repeatable` — Multiple Applications

```java
// Step 1: Define the container annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Roles {
    Role[] value();  // holds the repeated annotations
}

// Step 2: Make the repeatable annotation point to its container
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Repeatable(Roles.class)  // points to the container
public @interface Role {
    String value();
}

// Usage — can now apply @Role multiple times
@Role("ADMIN")
@Role("MANAGER")
@Role("SUPERUSER")
public void sensitiveOperation() {}

// Reading repeatable annotations
Method method = MyClass.class.getMethod("sensitiveOperation");
Role[] roles = method.getAnnotationsByType(Role.class);  // all @Role annotations
// or get the container:
Roles container = method.getAnnotation(Roles.class);
```

### `@Inherited` — Annotation Inheritance

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited  // subclasses inherit this annotation if they don't override it
public @interface Service {
    String name() default "";
}

@Service(name = "base")
public class BaseService {}

public class ConcreteService extends BaseService {}

// ConcreteService.class.getAnnotation(Service.class) returns @Service(name="base")
// Without @Inherited: would return null

// IMPORTANT: @Inherited only works on class annotations, not method annotations
// Method annotations are NEVER inherited by overriding methods
```

### Composing Annotations — Meta-Annotation Pattern (Spring Style)

```java
// Create a composed annotation that bundles multiple annotations
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Component          // meta-annotated — carries @Component
@Transactional      // meta-annotated — carries @Transactional
public @interface TransactionalService {
    String value() default "";  // passed through to @Component's value()
}

// Usage — single annotation replaces two
@TransactionalService("orderService")
public class OrderService {
    // @Component + @Transactional behaviour inherited from the composed annotation
}
```

### Full Example — Custom `@RequiresPermission`

```java
// Declaration
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
@Documented  // shows up in Javadoc
public @interface RequiresPermission {
    String[] value();                              // required: list of permissions
    boolean requireAll() default false;            // AND vs OR for multiple permissions
    String errorMessage() default "Access denied"; // custom error
}

// Usage
@RestController
@RequiresPermission("READ_ORDERS")  // class-level — applies to all methods
public class OrderController {

    @GetMapping("/orders/{id}")
    @RequiresPermission(value = {"READ_ORDERS", "VIEW_SENSITIVE_DATA"}, requireAll = true)
    public Order getOrder(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @DeleteMapping("/orders/{id}")
    @RequiresPermission(value = {"DELETE_ORDER", "ADMIN"}, requireAll = false)
    public void deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
    }
}

// AOP-based enforcement
@Aspect
@Component
public class PermissionAspect {

    @Before("@annotation(requiresPermission)")
    public void checkPermission(RequiresPermission requiresPermission) {
        String[] needed = requiresPermission.value();
        boolean requireAll = requiresPermission.requireAll();
        Set<String> userPerms = SecurityContext.getCurrentUserPermissions();

        boolean granted = requireAll
            ? Arrays.stream(needed).allMatch(userPerms::contains)
            : Arrays.stream(needed).anyMatch(userPerms::contains);

        if (!granted) {
            throw new AccessDeniedException(requiresPermission.errorMessage());
        }
    }
}
```

### Annotation Element Constraints

| Feature | Allowed? | Example |
|---------|----------|---------|
| Primitive elements | Yes | `int timeout()` |
| String elements | Yes | `String name()` |
| Class elements | Yes | `Class<?> clazz()` |
| Enum elements | Yes | `Level level()` |
| Annotation elements | Yes | `SomeAnnotation nested()` |
| Array of the above | Yes | `String[] tags()` |
| Default null | NO | `String name() default null` — illegal |
| Generic elements | NO | `List<String> values()` — illegal |
| Method parameters | NO | annotations look like abstract methods |

## Real-World Notes

- **Spring's annotations are all custom annotations** — `@Component`, `@Service`, `@Autowired`, `@Transactional` are all `@interface` declarations. Spring reads them via reflection and AOP at startup.
- **Lombok uses APT, not runtime reflection** — `@Data`, `@Builder`, `@Slf4j` are processed at compile time by Lombok's annotation processor, which generates bytecode. No runtime cost.
- **`@Documented` matters for public APIs** — if you build a library, add `@Documented` to annotations you want users to know about. Without it, they won't appear in Javadoc.
- **Keep annotation elements simple** — complex validation logic belongs in the annotation processor or AOP aspect, not in the annotation declaration.

## Common Pitfalls

- **`default null` is illegal** — annotations don't allow null as a default. Use empty string `""`, empty array `{}`, or a sentinel value like `-1`.
- **Forgetting `@Retention(RUNTIME)`** — if you forget this, reflection will return null even though the annotation is in source. Default retention is `CLASS` — available in `.class` files but not at runtime.
- **Class-level annotations not visible on instances** — `obj.getClass().getAnnotation(...)` works; `obj.getAnnotation(...)` doesn't exist. Annotations are on the class, not the object.
- **@Inherited gives false confidence** — it only inherits to direct class extension, and only for class-level (not method-level) annotations. Many developers assume method annotations are inherited.

## Related Concepts
- [[Annotation_Processing]] — compile-time processing of custom annotations
- [[Runtime_Annotations]] — reading custom annotations at runtime via reflection
- [[Built_in_Annotations]] — the built-in annotations and meta-annotations

## Review Questions
1. Why is `default null` not allowed in annotation element declarations?
2. How does the `value()` naming convention simplify annotation usage?
3. What is the difference between `@Retention(CLASS)` and `@Retention(RUNTIME)`?

#java #annotations #custom-annotations #repeatable #inherited #meta-annotations
