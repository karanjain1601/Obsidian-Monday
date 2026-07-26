# Java / Spring / Architecture: Introduction to All Topics

This document is a guided tour of the 50 sections in the Java notes library — a production-focused reference covering Java language internals, the Spring ecosystem, system design, distributed systems, and enterprise architecture patterns. Targeted at senior and staff-level Java engineers preparing for technical interviews or building production-grade systems.

Each section pairs conceptual notes (`.mdx`) with a runnable Java or Python demo file in the `demos/` folder.

---

## Part I — Java Language

### 01. Fundamentals

The JVM execution model and the Java type system — the mental model every other section assumes.

**What's covered:**
- **JVM Model** — Bytecode compilation, class loading, the interpreter and JIT compiler, the JVM runtime data areas (heap, stack, metaspace, PC register); how Java achieves platform independence.
- **Types and Variables** — Primitive types vs reference types; stack allocation vs heap allocation; autoboxing and unboxing pitfalls; `var` (local type inference); widening and narrowing conversions.
- **Operators and Strings** — Operator precedence; integer overflow; `String` immutability and the string pool; `==` vs `equals` on strings; `StringBuilder` vs `StringBuffer`; `String.format` and text blocks (Java 13+).
- **Identity and Equality** — `==` for identity vs `equals` for logical equality; the `hashCode` contract; `Comparable` vs `Comparator`; `equals`/`hashCode` symmetry, reflexivity, and transitivity.

---

### 02. Object-Oriented Programming

Java's OOP model — from class design to the SOLID principles that govern good design.

**What's covered:**
- **Classes and Encapsulation** — Access modifiers (`private`/`protected`/`public`/package-private); fields, constructors, and methods; `static` vs instance members; immutable class design; `final` fields.
- **Inheritance and Polymorphism** — `extends`; method overriding and `@Override`; dynamic dispatch (runtime polymorphism); `super`; covariant return types; why to favour composition over inheritance.
- **Interfaces and Abstraction** — `interface` vs `abstract class`; default and static interface methods; functional interfaces; the `Comparable` and `Iterable` contracts.
- **Modern Types** — Records (Java 16): compact constructors, auto-generated `equals`/`hashCode`/`toString`; sealed classes (Java 17): exhaustive pattern matching; enums with methods and abstract methods.
- **SOLID Principles** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — with Java code examples for each.

---

### 03. Collections

The Java Collections Framework — which container to pick and why.

**What's covered:**
- **Collection Hierarchy** — `Iterable` → `Collection` → `List` / `Set` / `Queue`; the `Map` side hierarchy; unmodifiable vs immutable collections; `Collections` utility methods.
- **Choosing Collections** — `ArrayList` vs `LinkedList`; `HashSet` vs `LinkedHashSet` vs `TreeSet`; `HashMap` vs `LinkedHashMap` vs `TreeMap`; complexity comparison table.
- **Maps and Queues** — `HashMap` internals (hash, bucket, tree-bin at threshold 8); `ConcurrentHashMap`; `PriorityQueue` and `ArrayDeque`; `Deque` as stack and queue.
- **Sorting and Iteration** — `Comparable` and `Comparator`; `Collections.sort` vs `List.sort`; `Stream.sorted`; `Iterator` and `ListIterator`; `for-each` and `forEach`; `ConcurrentModificationException`.

---

### 04. Generics

Parameterised types and the type-safety guarantees (and limitations) they provide.

**What's covered:**
- **Generic Classes and Methods** — Type parameter syntax; generic methods; bounded type parameters (`<T extends Comparable<T>>`); raw types and why to avoid them.
- **Bounded Types and Wildcards** — Upper-bounded (`? extends T`), lower-bounded (`? super T`), and unbounded (`?`) wildcards; the PECS rule (Producer Extends, Consumer Super).
- **Type Erasure and Restrictions** — Why `List<String>` and `List<Integer>` become the same class at runtime; heap pollution; unchecked casts; why you cannot do `new T[]` or `instanceof List<String>`.
- **Variance** — Covariance, contravariance, and invariance; why Java arrays are covariant (and why that's a hole); how wildcards restore variance where needed.

---

### 05. Exceptions

Exception handling — the hierarchy, the mechanics, and clean exception design.

**What's covered:**
- **Exception Hierarchy** — `Throwable` → `Error` vs `Exception`; checked vs unchecked (runtime) exceptions; when to use each; `Error` as non-recoverable JVM failure.
- **Try-Catch-Finally** — Multi-catch; `try-with-resources` and `AutoCloseable`; `finally` guarantees; exception suppression; rethrowing and wrapping.
- **Custom Exceptions** — Designing domain-specific exception classes; adding context fields; checked vs unchecked custom exceptions; best practices for exception messages.

---

### 06. Streams and Functional Programming

Java's functional layer — lambdas, streams, and `Optional`.

**What's covered:**
- **Lambdas and Functional Interfaces** — Lambda syntax; method references (`::`) in all four forms; the `java.util.function` package (`Function`, `Predicate`, `Consumer`, `Supplier`, `BiFunction`); effectively final.
- **Stream Pipeline** — Source → intermediate operations (lazy) → terminal operation (triggers execution); `filter`, `map`, `flatMap`, `distinct`, `sorted`, `limit`, `skip`, `peek`.
- **Terminal Operations and Collectors** — `collect`, `reduce`, `count`, `min`, `max`, `findFirst`, `anyMatch`; `Collectors.toList/toSet/toMap/groupingBy/partitioningBy/joining`; `Collector` contract.
- **Optional and Parallel Streams** — `Optional` as a null-avoidance type; `map`, `flatMap`, `orElse`, `orElseGet`, `ifPresent`; parallel streams with the ForkJoinPool; when parallel hurts more than it helps.

---

### 07. Concurrency

Thread-based concurrency — from raw `Thread` to `CompletableFuture`.

**What's covered:**
- **Threads and Synchronization** — `Thread` lifecycle; `Runnable` vs `Callable`; `synchronized` blocks and methods; `volatile`; the Java Memory Model happens-before relationship; `wait`/`notify`.
- **Liveness and Executors** — Deadlock, livelock, starvation; `ExecutorService` and `ThreadPoolExecutor`; `ScheduledExecutorService`; thread pool sizing heuristics; proper shutdown.
- **CompletableFuture** — `supplyAsync`, `thenApply`, `thenCompose`, `thenCombine`, `exceptionally`, `handle`, `allOf`, `anyOf`; non-blocking async pipelines; custom executor supply.
- **Concurrent Utilities** — `java.util.concurrent` toolkit: `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`, `CountDownLatch`, `CyclicBarrier`, `Semaphore`, `Phaser`, `Exchanger`, `AtomicInteger`.

---

### 08. JVM Memory and Internals

The JVM runtime — how memory is structured, how it is reclaimed, and how code is accelerated.

**What's covered:**
- **Memory Areas** — Heap (Young: Eden + Survivor; Old/Tenured); Stack frames; Metaspace (replaced PermGen in Java 8); Code Cache; off-heap direct buffers; typical `-Xmx`/`-Xms`/`-XX:MaxMetaspaceSize` flags.
- **Class Loading** — Bootstrap, Extension/Platform, Application class loaders; parent-delegation model; custom class loaders; class loader isolation; dynamic module loading.
- **Garbage Collection** — Mark-sweep-compact; generational hypothesis; GC algorithms: Serial, Parallel, CMS (deprecated), G1 (default since Java 9), ZGC (ultra-low pause), Shenandoah; GC log analysis.
- **JIT and Tuning** — Interpreter → C1 (client) → C2 (server) tiered compilation; hotspot detection (invocation counter threshold); inlining; escape analysis; key flags: `-XX:+PrintCompilation`, `-XX:CompileThreshold`.

---

### 09. I/O and NIO

Reading, writing, and moving bytes — the classic streams API and the non-blocking NIO layer.

**What's covered:**
- **Streams and Buffering** — `InputStream`/`OutputStream`; `Reader`/`Writer` for characters; `BufferedInputStream`/`BufferedReader` for performance; `Scanner`; try-with-resources pattern.
- **NIO, Files, and Channels** — `java.nio.file.Path` and `Files` (Java 7+); `FileChannel` and `ByteBuffer`; memory-mapped files; `WatchService` for directory events; `AsynchronousFileChannel`.
- **Serialization** — `Serializable` and `serialVersionUID`; `transient` fields; the security risks of Java object serialization; alternatives: JSON (Jackson), Protocol Buffers, Avro.

---

### 10. Modern Java

Language features added from Java 8 through Java 21, and the module system.

**What's covered:**
- **Language Features** — Switch expressions (Java 14); text blocks (Java 15); pattern matching for `instanceof` (Java 16); records (Java 16); sealed classes (Java 17); pattern matching in `switch` (Java 21); unnamed patterns.
- **Java Time API** — `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`, `Duration`, `Period`; `DateTimeFormatter`; why `java.util.Date` and `Calendar` are deprecated; time zone pitfalls.
- **Java 21 and Modules** — Virtual threads (Project Loom): carrier threads, `Thread.ofVirtual()`, structured concurrency (`StructuredTaskScope`); sequenced collections; the Java Platform Module System (JPMS): `module-info.java`, `requires`/`exports`/`opens`; multi-module builds.

---

## Part II — Design, Testing, and Spring

### 11. Design Patterns

The Gang of Four patterns, explained through Java idioms.

**What's covered:**
- **Creational Patterns** — Singleton (enum idiom, double-checked locking with `volatile`); Factory Method; Abstract Factory; Builder (classic and Lombok); Prototype.
- **Structural Patterns** — Adapter; Bridge; Composite; Decorator; Facade; Flyweight; Proxy (JDK dynamic proxy and CGLIB); comparison table.
- **Behavioral Patterns** — Strategy; Observer (and Java `EventListener`); Command; Chain of Responsibility; Template Method; State; Iterator; Mediator; Visitor; Memento.

---

### 12. Testing

Writing tests that catch real bugs — JUnit 5, Mockito, and integration testing.

**What's covered:**
- **JUnit 5 and Assertions** — `@Test`, `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`; `@ParameterizedTest` with value sources; `@Nested`; `assertAll`, `assertThrows`, `assertTimeout`; `@ExtendWith`.
- **Mockito** — `@Mock`, `@InjectMocks`, `@Spy`, `@Captor`; `when`/`thenReturn`/`thenThrow`; `verify` and `ArgumentMatchers`; `doReturn`/`doAnswer` for void methods; `BDDMockito` style.
- **Integration Testing** — `@SpringBootTest`; `@WebMvcTest` for controller slices; `@DataJpaTest` with an in-memory DB; `MockMvc`; `Testcontainers` for real external services; test slices vs full context.

---

### 13. Spring Core

The container that powers the Spring ecosystem — IoC, dependency injection, AOP, and the event bus.

**What's covered:**
- **IoC and Beans** — `ApplicationContext`; bean definition (XML, annotation, Java config); `@Component` stereotype annotations; bean scopes (`singleton`, `prototype`, `request`, `session`); `BeanFactory` vs `ApplicationContext`.
- **Wiring and Configuration** — `@Autowired` (by type, then name); `@Qualifier`; `@Primary`; `@Bean` factory methods; `@Configuration` and the CGLIB proxy; constructor injection vs field injection.
- **AOP, Events, and SpEL** — Aspect-oriented programming: `@Aspect`, `@Around`, `@Before`, `@After`, pointcut expressions; proxy limitations (self-invocation); `ApplicationEventPublisher` and `@EventListener`; Spring Expression Language (SpEL) in annotations.

---

### 14. Spring Boot

Convention-over-configuration — the opinionated layer above Spring Framework.

**What's covered:**
- **Autoconfiguration and Starters** — How `@EnableAutoConfiguration` works via `spring.factories` / `AutoConfiguration.imports`; conditional annotations (`@ConditionalOnClass`, `@ConditionalOnMissingBean`); writing a custom starter.
- **Configuration and Profiles** — `application.properties` / `application.yml`; `@Value` and `@ConfigurationProperties`; profile activation (`spring.profiles.active`); environment-specific overrides; externalized configuration order.
- **Actuator and Ops** — Health endpoints; metrics (Micrometer integration); info endpoint; custom health indicators; securing Actuator endpoints; graceful shutdown.

---

### 15. Spring MVC and REST

Building HTTP APIs with Spring MVC.

**What's covered:**
- **Request Lifecycle and Controllers** — `DispatcherServlet`; `HandlerMapping` → `HandlerAdapter` → `ViewResolver`; `@RestController`; `@RequestMapping`, `@GetMapping`, `@PostMapping`; `@PathVariable`, `@RequestParam`, `@RequestBody`, `@ResponseBody`.
- **REST Design and Clients** — Richardson Maturity Model; HATEOAS; HTTP status codes; content negotiation; `RestTemplate` (legacy) vs `WebClient` (reactive); `@FeignClient` (Spring Cloud).
- **Validation and Exception Handling** — Bean Validation (Jakarta Validation) with `@Valid`, `@NotNull`, `@Size`; `@ControllerAdvice` and `@ExceptionHandler`; `ProblemDetail` (RFC 7807); global vs local exception handling.

---

### 16. Spring Persistence

Persisting data — JPA/Hibernate through Spring Data.

**What's covered:**
- **JPA Entities and Mapping** — `@Entity`, `@Table`, `@Id`, `@GeneratedValue`; relationships (`@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@OneToOne`); `fetch = LAZY` vs `EAGER`; `@Embeddable` and `@Embedded`; `@Inheritance` strategies.
- **Queries and Transactions** — Spring Data JPA repositories; derived query methods; `@Query` with JPQL and native SQL; `@Transactional` (propagation, isolation levels, rollback rules); `EntityManager` usage; `Specification` API for dynamic queries.
- **Performance and Ops** — N+1 query problem and `JOIN FETCH`; second-level cache (Ehcache, Redis); database connection pool tuning (HikariCP); `@BatchSize`; `EntityGraph`; Flyway / Liquibase migrations.

---

### 17. Spring Security

Authentication, authorisation, and token-based security in Spring.

**What's covered:**
- **Filter Chain and Authentication** — `SecurityFilterChain`; `DelegatingFilterProxy`; `UsernamePasswordAuthenticationFilter`; `AuthenticationManager` and `AuthenticationProvider`; `UserDetailsService`; password encoding (`BCryptPasswordEncoder`).
- **JWT, OAuth 2.0, and Method Security** — Stateless JWT validation; `BearerTokenAuthenticationFilter`; Spring Security OAuth 2.0 Resource Server and Authorization Server; `@PreAuthorize`, `@PostAuthorize`, `@Secured`; method-level security with SpEL.
- **Session, CSRF, and Access Control** — Session management (stateless vs stateful); CSRF tokens and when to disable; CORS configuration; `@RolesAllowed`; URL-based access rules (`requestMatchers`); security context propagation in async.

---

### 18. Scheduling, Async, and Messaging

Background tasks, asynchronous execution, and event-driven communication.

**What's covered:**
- **Scheduling and Async** — `@Scheduled` (fixed rate, fixed delay, cron expression); `@EnableScheduling`; `@Async` for non-blocking method calls; `@EnableAsync`; thread pool configuration; async exception handling.
- **Messaging Fundamentals and RabbitMQ** — Message broker concepts; queues, exchanges, and bindings; AMQP; RabbitMQ with `spring-rabbit`; `@RabbitListener`; dead-letter queues; message acknowledgement modes.
- **Kafka and Reliability** — Producer and consumer configuration; `@KafkaListener`; consumer groups; offset management; at-least-once vs exactly-once semantics; transactional Kafka; retry and DLT (dead-letter topic) with Spring Kafka.

---

### 19. Architecture and Microservices

Decomposing a system into services and making them resilient.

**What's covered:**
- **Architecture Patterns** — Monolith vs microservices vs modular monolith; domain-driven design (bounded contexts, aggregates, domain events); event-driven architecture; CQRS; event sourcing.
- **Microservice Patterns** — API Gateway; service discovery (Eureka); circuit breaker (Resilience4j); bulkhead; retry; rate limiter; saga pattern (choreography vs orchestration); outbox pattern for reliable messaging.
- **Spring Cloud and Resilience** — Spring Cloud Gateway; Spring Cloud Config Server; Spring Cloud LoadBalancer; Resilience4j annotations (`@CircuitBreaker`, `@Retry`, `@RateLimiter`, `@Bulkhead`); distributed tracing with Micrometer Tracing.

---

### 20. System Design

Designing scalable distributed systems — the concepts and the interview framework.

**What's covered:**
- **Scalability, Caching, and Storage** — Horizontal vs vertical scaling; load balancing strategies (round-robin, least-connections, consistent hashing); caching layers (CDN, reverse proxy, application, DB); CAP theorem; sharding and replication; SQL vs NoSQL selection.
- **Distributed Concepts** — Consistency models (strong, eventual, causal); consensus protocols (Paxos, Raft); distributed transactions (2PC, saga); idempotency keys; leader election; vector clocks.
- **Estimation and Interview Framework** — Back-of-envelope estimation (QPS, storage, bandwidth); the 6-step system design interview framework (clarify → estimate → design → deep dive → scale → wrap up); worked examples (URL shortener, rate limiter, notification system).

---

### 21. Ecosystem Libraries

The libraries every Java backend engineer encounters day-to-day.

**What's covered:**
- **Build, Lombok, and Mapping** — Maven (POM, lifecycle, plugins, dependency scopes); Gradle (tasks, configurations, build scripts); Lombok (`@Data`, `@Builder`, `@Slf4j`, pitfalls with JPA); MapStruct for compile-time bean mapping.
- **Jackson, Validation, and Logging** — Jackson `ObjectMapper`; custom serializers/deserializers; `@JsonProperty`, `@JsonIgnore`, `@JsonInclude`; Jakarta Bean Validation; SLF4J + Logback configuration; structured logging with Logstash JSON encoder.
- **Testing, Resilience, and OpenAPI** — WireMock for HTTP stubbing; RestAssured for integration API tests; Testcontainers; Resilience4j standalone usage; SpringDoc / Springfox for OpenAPI 3 documentation generation.

---

### 22. Engineering Leadership

The non-technical skills that multiply a senior engineer's impact.

**What's covered:**
- **Code Reviews and Decisions** — Code review philosophy (correctness over style); giving and receiving feedback; Architecture Decision Records (ADRs); RFC process for cross-team changes; decision documentation.
- **Mentoring and Delivery** — Mentoring junior and mid-level engineers; technical roadmap planning; estimation and commitment; managing technical debt; working with product and design.
- **CI/CD and Communication** — CI/CD pipeline design; feature flags and trunk-based development; incident communication (status pages, stakeholder updates); running effective technical meetings; writing engineering proposals.

---

## Part III — Data, Infrastructure, and Advanced Topics

### 23. Databases and SQL

Relational databases — from query writing to production tuning.

**What's covered:**
- **SQL Fundamentals** — DDL/DML/DCL; `JOIN` types (inner, left, right, full, cross); aggregations (`GROUP BY`, `HAVING`); window functions (`ROW_NUMBER`, `RANK`, `LEAD`, `LAG`); CTEs; subqueries; `EXPLAIN` / `EXPLAIN ANALYZE`.
- **Query Optimization and Transactions** — Index types (B-tree, hash, GiST, partial); covering indexes; query plan reading; transaction isolation levels (Read Uncommitted → Serializable); ACID properties; MVCC.
- **Locking, NoSQL, and Pools** — Row-level vs table-level locks; optimistic vs pessimistic locking; deadlock detection; NoSQL categories (document, key-value, column-family, graph) and when to choose them; connection pool sizing (HikariCP).

---

### 24. Data Structures and Algorithms (Java)

Core DSA for Java interviews — implementation and complexity in Java idioms.

**What's covered:**
- **Complexity, Arrays, and Lists** — Big-O analysis; Java array internals; `ArrayList` and `LinkedList` implementation; two-pointer and sliding-window patterns; stack and queue with `Deque`.
- **Trees, Graphs, and Sorting** — Binary tree traversals (iterative and recursive); BST operations; heap with `PriorityQueue`; BFS and DFS on graphs (`Map<Node, List<Node>>`); topological sort; `Arrays.sort` and `Collections.sort` (Timsort); custom `Comparator`.
- **Recursion, DP, and Interview Patterns** — Recursion with memoization using `HashMap`; tabulation; common DP patterns (knapsack, LCS, LIS); backtracking; binary search patterns; Java-specific interview traps (`Integer` cache, string interning).

---

### 25. Caching

Caching strategies — from in-process to distributed caches.

**What's covered:**
- **Spring Cache Abstraction** — `@EnableCaching`; `@Cacheable`, `@CachePut`, `@CacheEvict`; cache key generation; Redis and Caffeine as cache providers; cache synchronisation with database writes.
- **Eviction and Problems** — LRU, LFU, FIFO, TTL-based eviction; cache stampede / thundering herd; cache penetration (null caching, bloom filters); cache avalanche; cache aside vs read-through vs write-through vs write-behind.
- **HTTP Caching** — `Cache-Control` directives (`max-age`, `no-cache`, `no-store`, `private`, `public`); `ETag` and conditional requests (`If-None-Match`); `Last-Modified`; CDN edge caching; cache invalidation strategies.

---

### 26. Reactive Programming and WebFlux

Non-blocking reactive streams with Project Reactor and Spring WebFlux — when to use it, how it works, and the gotchas that break most first-time reactive services.

**What's covered:**

- **Reactive Fundamentals** — Why reactive: the thread-per-request model caps Tomcat at ~200 concurrent I/O-bound requests; the event-loop alternative handles thousands on a handful of threads. When reactive wins (high-concurrency I/O, streaming, true backpressure) and when it does **not** (CPU-bound work, simple CRUD, Java 21 virtual threads are the simpler alternative for concurrency-only problems).
- **Reactive Streams Specification** — The four interfaces (`Publisher`, `Subscriber`, `Subscription`, `Processor`) standardised in `java.util.concurrent.Flow` (Java 9); the `request(n)` pull-based backpressure model — subscribers control the rate, publishers must not exceed demand.
- **`Mono<T>` and `Flux<T>`** — Project Reactor's two publisher types: `Mono` for 0-or-1 items (analogous to `CompletableFuture`), `Flux` for 0-to-N (analogous to a lazy push-based stream). The critical insight: **nothing runs until subscribed** — a pipeline is a lazy recipe, not an eager execution. Cold publishers (each subscriber re-executes from scratch) vs hot publishers (emit regardless of subscribers; use `Sinks`, `.share()`, `.publish().autoConnect()`).
- **Core Operators** — `map` (sync 1-to-1 transform; never do I/O here); `flatMap` (async transform, subscribes to inner publishers **concurrently** — order not guaranteed); `concatMap` (async but sequential — use when order matters); `filter`, `take`, `zip` (wait for all publishers before emitting), `merge` (concurrent interleave), `concat` (sequential), `switchIfEmpty` (fallback on empty), `then` (chain after completion), `doOnNext`/`doOnError`/`doOnComplete` (side-effects without changing the stream). The #1 reactive bug: using `map` to return a `Mono` → gets `Flux<Mono<T>>` instead of `Flux<T>`; use `flatMap`.
- **Backpressure Overflow Strategies** — `onBackpressureBuffer()` (unbounded buffer, OOM risk); `onBackpressureBuffer(N)` (bounded, error on overflow); `onBackpressureDrop()` (silently discard excess — good for live sensor data where staleness is acceptable); `onBackpressureLatest()` (keep only the most recent undelivered item); `onBackpressureError()` (fail-fast on any excess).
- **WebFlux vs Spring MVC** — Side-by-side: Netty event loop vs Tomcat thread-per-request; scalability ceiling; programming model; DB support (R2DBC vs JDBC). The cardinal rule: **never block the event-loop thread** — any JDBC call, `Thread.sleep()`, or `.block()` inside a WebFlux controller freezes the thread serving all requests on that CPU core. Virtual threads + Spring MVC is simpler for services without true streaming needs.
- **Annotated vs Functional Endpoints** — `@RestController` with `Mono`/`Flux` return types works directly in WebFlux. Functional style: `RouterFunction` + `HandlerFunction` — centralised routing, composable `HandlerFilterFunction`, preferred by the WebFlux team for complex routing. Streaming via `produces = TEXT_EVENT_STREAM_VALUE` pushes `Flux` items to clients as SSE as they are produced.
- **WebClient** — Non-blocking HTTP client replacing `RestTemplate`. Fan-out with `Mono.zip` subscribes to all calls simultaneously — wall-clock time is the slowest single call, not the sum. `onStatus` for per-status error handling. Always set `.timeout(Duration.ofSeconds(N))` — without it WebClient waits indefinitely.
- **R2DBC — Reactive Database Access** — Non-blocking alternative to JDBC using Netty-based async DB drivers; `ReactiveCrudRepository`; `@Transactional` works with R2DBC. Key limitations vs JPA: no lazy loading, no `@OneToMany` relationship proxies, no automatic schema generation, no first-level cache — all joins must be explicit. Virtual threads + JPA is the simpler path when full ORM features are needed.
- **Schedulers** — `Schedulers.parallel()` (fixed pool = CPU cores, non-blocking only); `Schedulers.boundedElastic()` (expandable up to 10× CPU cores, designed for blocking I/O offload); `Schedulers.single()` (single thread, ordered sequential tasks); `Schedulers.immediate()` (current thread, zero overhead, for testing).
- **`subscribeOn` vs `publishOn`** — `subscribeOn` floats upstream and controls where the **source** starts — position in chain does not matter, only the first call wins. `publishOn` is positional — switches the executing thread for all operators **downstream** of it; multiple `publishOn` calls each switch again.
- **BlockHound** — Java agent that throws `BlockingOperationError` if any blocking call (JDBC, `Thread.sleep`, `.block()`) is detected on a non-blocking thread. Use in tests and development to catch violations early.
- **Error Handling** — `onErrorReturn` (replace with static default, stream completes normally); `onErrorResume` (replace with fallback publisher — can itself do async work like a cache lookup); `onErrorMap` (translate exception type, stream still errors); `doOnError` (logging side-effect, error unchanged); `retryWhen(Retry.backoff(...))` (exponential backoff with jitter, filter to transient errors only, never retry 404/400); `timeout` (always set on external calls).
- **Reactor Context** — `ThreadLocal` does not survive scheduler switches (`publishOn` moves execution to a new thread, losing the original `ThreadLocal`). `Reactor Context` is an immutable map that flows **upstream** from subscriber to source and is accessible anywhere in the chain. Used for distributed trace IDs, security context propagation, and multi-tenant request scoping. Spring Security WebFlux uses it automatically via `ReactiveSecurityContextHolder`.

**Key gotchas at a glance:**

| Trap | What Happens |
| ---- | ------------ |
| Nothing subscribed | A `Mono`/`Flux` is a lazy recipe — returning from a WebFlux controller is fine (Spring subscribes); forgetting to subscribe elsewhere means nothing executes |
| Blocking inside WebFlux | Any JDBC call, `Thread.sleep`, or `.block()` on the event-loop stalls all requests on that core |
| `map` instead of `flatMap` for async | Returns `Mono<Mono<T>>` — use `flatMap` to subscribe and flatten |
| `flatMap` ordering | Processes concurrently — use `concatMap` or `flatMapSequential` when order matters |
| Missing `timeout` on WebClient | Slow downstream waits indefinitely without `.timeout(...)` |
| `subscribeOn` placement | Only the first `subscribeOn` in a chain takes effect — it always affects the source |
| Reactor Context vs ThreadLocal | `ThreadLocal` doesn't cross scheduler switches — use `Reactor Context` for tracing and security |

---

### 27. Networking and APIs

The HTTP protocol and the API styles built on top of it.

**What's covered:**
- **HTTP Semantics** — HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC); request/response structure; idempotency and safety of HTTP methods; status codes; keep-alive and connection pooling; chunked transfer encoding; compression (gzip, Brotli).
- **Network Protocols** — TCP vs UDP; TLS handshake; DNS resolution; load balancer types (L4 vs L7); reverse proxy vs API gateway; WebSockets; long polling vs SSE.
- **API Styles** — REST (Richardson Maturity Model, HATEOAS); gRPC (Protocol Buffers, streaming, deadlines, interceptors); GraphQL (schema, resolvers, N+1 and DataLoader); WebSocket APIs; async APIs (AsyncAPI spec, event-driven contracts).

---

### 28. Application Security

Security as a first-class concern at the application layer.

**What's covered:**
- **OWASP Injections** — OWASP Top 10 2021; SQL injection and parameterised queries; command injection; LDAP injection; XSS (reflected, stored, DOM-based) and Content Security Policy; SSRF.
- **Access Control and Secrets** — Broken access control; IDOR; privilege escalation; secrets management (Vault, AWS Secrets Manager, environment variables); never hardcode credentials; secret rotation.
- **Transport, Dependencies, and Validation** — TLS configuration (cipher suites, certificate pinning); HSTS; SCA (software composition analysis) with OWASP Dependency-Check / Snyk; input validation vs output encoding distinction.

---

### 29. Cloud and DevOps

Deploying, running, and operating Java services in the cloud.

**What's covered:**
- **CI/CD and Docker** — CI pipeline stages (build → test → scan → package → push); GitHub Actions / GitLab CI; multi-stage Dockerfile for Java (build stage + minimal JRE runtime stage); Docker layer caching; image scanning.
- **Kubernetes and Cloud** — Pod, Deployment, Service, Ingress, ConfigMap, Secret; liveness and readiness probes; resource requests and limits; Horizontal Pod Autoscaler; Helm charts; AWS/GCP/Azure services commonly used with Java (ECS, GKE, AKS, RDS, MSK).
- **Deployment, Monitoring, and Config** — Blue-green and canary deployments; rolling updates; feature flags; 12-factor app configuration; centralized config with Spring Cloud Config or Kubernetes ConfigMaps; log aggregation (ELK / Loki).

---

### 30. Performance Engineering

Finding and fixing performance problems in production Java services.

**What's covered:**
- **Bottlenecks and Profiling** — CPU profiling with async-profiler and flame graphs; memory profiling; allocation profiling; `jstack`, `jmap`, `jcmd`; `perf` for native-level profiling; identifying hot methods.
- **Dumps and GC** — Thread dump analysis (deadlock detection, stuck threads); heap dump analysis with MAT or VisualVM; GC log analysis (pause times, promotion failures); GC tuning flags for G1 and ZGC.
- **Latency, DB, and Load** — Latency percentiles (p50/p95/p99); Little's Law; database slow query log analysis; connection pool exhaustion diagnosis; load testing with Gatling or k6; SLO breach root cause methodology.

---

### 31. Jakarta EE

The enterprise Java platform — its history, specifications, and migration path.

**What's covered:**
- **History and Rename** — Java EE → Jakarta EE handover from Oracle to Eclipse Foundation (2017–2019); namespace change from `javax.*` to `jakarta.*` (Jakarta EE 9); versioning history.
- **Specs and Servlet** — Key Jakarta EE specifications: Servlet, JSP, EJB, JPA, JMS, JAX-RS, CDI, Bean Validation, JSON-B, JSON-P; Servlet lifecycle; filter chains; async servlet.
- **Migration Guide** — Migrating from Spring Boot 2.x (`javax.*`) to Spring Boot 3.x (`jakarta.*`); namespace migration tools; GlassFish / WildFly / Payara vs embedded Tomcat/Jetty.

---

### 32. Behavioral Interview

Preparing the non-technical side of a Java engineering interview.

**What's covered:**
- **STAR and Stories** — STAR format (Situation, Task, Action, Result); building a story bank from past projects; quantifying impact; common question themes (conflict, failure, leadership, innovation).
- **Interview Types** — Behavioural screen; culture-fit rounds; manager interviews; values-based questions (Amazon Leadership Principles, etc.); panel interviews; what each interviewer is assessing.
- **Questions and Offers** — Questions to ask at each interview stage; evaluating an offer (compensation components, equity, growth); negotiation tactics; handling competing offers.

---

## Part IV — Distributed Systems and Advanced Java

### 33. Kafka and Streaming

Apache Kafka as a distributed commit log and streaming platform.

**What's covered:**
- **Kafka Architecture** — Topics, partitions, offsets, brokers, ZooKeeper (deprecated) vs KRaft mode; leader and follower replicas; producer partitioner; consumer group rebalancing; log compaction.
- **Delivery and Durability** — `acks` setting (0 / 1 / all); `min.insync.replicas`; idempotent producer (`enable.idempotence=true`); transactional API for exactly-once; at-least-once consumer with manual offset commit.
- **Kafka Streams, Spring, and Ops** — Kafka Streams DSL (`KStream`, `KTable`, `KGroupedStream`, windowed aggregations); Spring Kafka `@KafkaListener`, `KafkaTemplate`; consumer lag monitoring; topic sizing; partition count tradeoffs; Kafka Connect.

---

### 34. Distributed Systems

The theory behind distributed systems — consistency, consensus, time, and failure.

**What's covered:**
- **Consistency and Consensus** — CAP theorem; PACELC; consistency models (strong, linearisable, sequential, causal, eventual); Paxos and Raft consensus algorithms; leader election; quorum reads/writes.
- **Time, Transactions, and Hashing** — Logical clocks (Lamport timestamps); vector clocks; hybrid logical clocks (HLC); distributed transactions (2PC and its failure modes); saga pattern; consistent hashing and virtual nodes.
- **Failure and Engines** — Failure detection (heartbeats, Phi Accrual detector); split-brain and fencing tokens; CRDTs for conflict-free state; gossip protocols; distributed storage engines (LSM-tree vs B-tree); Dynamo-style systems.

---

### 35. Advanced JVM

The JVM internals that matter at senior level — memory model, GC algorithms, and JIT deep dives.

**What's covered:**
- **Java Memory Model and Object Layout** — Happens-before edges; `volatile` and total store ordering; `synchronized` and monitor entry/exit fences; object header layout (mark word, class pointer, array length); field alignment and padding; `sun.misc.Unsafe`; `VarHandle`.
- **GC Internals** — G1 regions (Eden, Survivor, Old, Humongous); mixed GC; concurrent marking; remembered sets and card tables; ZGC load barriers and colored pointers; Shenandoah Brooks forwarding pointers; GC safepoints.
- **JIT and Diagnostics** — Tiered compilation (T0–T4); inlining decisions (size limit, call depth); on-stack replacement (OSR); escape analysis and scalar replacement; lock elision and lock coarsening; `-XX:+PrintInlining`; JITWatch.

---

### 36. Advanced Concurrency

Lock-free programming, the ForkJoin framework, and virtual threads.

**What's covered:**
- **CAS and Locks** — Compare-and-swap hardware instruction; `AtomicInteger` / `AtomicReference` / `AtomicLongFieldUpdater`; ABA problem and `AtomicStampedReference`; `StampedLock` (optimistic, read, write modes); `ReentrantReadWriteLock`.
- **ForkJoin and Threads** — `ForkJoinPool` work-stealing scheduler; `RecursiveTask` and `RecursiveAction`; `Stream.parallel()` internals; `Phaser` for multi-phase barriers; `ThreadLocal` and `InheritableThreadLocal`; thread naming and `UncaughtExceptionHandler`.
- **Virtual Threads and Testing** — Virtual threads (Java 21 GA): carrier threads, pinning (synchronized block, native call), `Thread.ofVirtual()`; `StructuredTaskScope` for fan-out/fan-in; testing concurrent code with `CountDownLatch`, `CyclicBarrier`, deterministic sleep replacement.

---

### 37. GraalVM and Native Images

Ahead-of-time compilation for instant startup and low memory footprint.

**What's covered:**
- **GraalVM and Native Image** — GraalVM Community vs Enterprise; `native-image` tool; closed-world assumption; reflection, resources, dynamic proxies, and serialisation requiring metadata; build-time vs runtime initialisation.
- **Metadata and Spring** — Native hints (`@RegisterReflectionForBinding`, `@ImportRuntimeHints`); `spring-aot-maven-plugin`; Spring Boot 3 native support; Testcontainers-based native testing; GraalVM CE vs Oracle GraalVM feature comparison.
- **Trade-offs and Polyglot** — Native image build time and memory overhead during build; peak throughput lower than JIT for long-running services; Truffle polyglot API (JavaScript, Python, Ruby on GraalVM); when native image makes sense (CLI tools, serverless, short-lived containers).

---

### 38. Advanced Spring

Spring's internal machinery — how the container bootstraps, creates proxies, and integrates observability.

**What's covered:**
- **Container Bootstrap** — `SpringApplication.run` sequence; `ApplicationContext` refresh phases; `BeanFactoryPostProcessor` vs `BeanPostProcessor`; `ImportSelector`; `@DeferredImport`; ordered bean processing.
- **Autoconfiguration and Proxies** — How `AutoConfiguration.imports` works end-to-end; writing a `Condition`; CGLIB subclass proxy vs JDK interface proxy; self-invocation pitfall with AOP; `@Scope("prototype")` with `proxyMode = ScopedProxyMode.TARGET_CLASS`.
- **Lifecycle and Observation** — `InitializingBean` vs `@PostConstruct`; `DisposableBean` vs `@PreDestroy`; `SmartLifecycle` for ordered start/stop; Micrometer `ObservationRegistry`; `@Observed`; Spring Boot's auto-configured `MeterRegistry`.

---

### 38a. Spring AI *(planned section — no source files yet)*

Building AI-powered Java applications using Spring AI — the official Spring portfolio project for integrating language models, embeddings, and RAG pipelines into Spring Boot services.

**What's covered:**

- **Overview and Philosophy** — Spring AI provides a portable, Spring-idiom abstraction over AI providers (OpenAI, Anthropic Claude, Azure OpenAI, Amazon Bedrock, Google Vertex AI, Ollama for local models). The same code works across providers by swapping a starter dependency and configuration — analogous to how Spring Data abstracts different databases.
- **Chat Models** — `ChatClient` as the primary fluent API; `ChatModel` as the lower-level interface; streaming responses with `Flux<String>` via `stream()`; `ChatOptions` for per-call overrides (temperature, max tokens, top-p); system prompt and user message construction; multi-turn conversation with `MessageChatMemoryAdvisor`.
- **Prompt Templates** — `PromptTemplate` for parameterised prompts with `{placeholder}` substitution; loading prompt files from the classpath; composing system + user messages; `@Value` injection of prompt strings from `application.properties`.
- **Structured Output** — `BeanOutputConverter<T>` and `MapOutputConverter` for extracting typed Java objects from model responses; format instructions automatically appended to the prompt; Pydantic-style schema generation for the model; retry on parse failure.
- **Function / Tool Calling** — Registering Java methods as callable tools with `@Bean`-annotated `Function<Input, Output>`; Spring AI automatically serialises the function schema and handles the tool-call/response round-trip; multi-tool conversations; tool execution with `ToolCallingManager`.
- **Embedding Models** — `EmbeddingModel` interface; `EmbeddingRequest` and `EmbeddingResponse`; batch embedding; distance metrics (cosine, dot product); providers: OpenAI `text-embedding-3`, Ollama, Azure, Bedrock Titan.
- **Vector Stores** — `VectorStore` interface with implementations for PGVector, Redis, Pinecone, Chroma, Milvus, Weaviate, MongoDB Atlas, Qdrant, Cassandra, OpenSearch; `Document` as the universal chunk type with metadata; similarity search with metadata filtering; `SimpleVectorStore` for in-memory/file-backed use in tests.
- **Retrieval-Augmented Generation (RAG)** — `QuestionAnswerAdvisor` as the simplest RAG advisor (retrieves top-K docs and stuffs them into the prompt); `RetrievalAugmentationAdvisor` for the full modular pipeline (query transformation → retrieval → post-processing → augmentation); document readers (`PdfPageDocumentReader`, `TikaDocumentReader`, `JsonReader`, `TextReader`); `TokenTextSplitter` for chunking; `KeywordMetadataEnricher` for adding metadata at ingestion time.
- **AI Advisors** — The `Advisor` chain runs around every `ChatClient` call; built-in advisors: `MessageChatMemoryAdvisor` (injects conversation history from a `ChatMemory` store), `QuestionAnswerAdvisor` (RAG), `SafeGuardAdvisor` (keyword blocking), `SimpleLoggerAdvisor` (request/response logging); composing multiple advisors with `defaultAdvisors(...)`.
- **Chat Memory** — `InMemoryChatMemory` for single-session; `CassandraChatMemory`, `JdbcChatMemory`, `Neo4jChatMemory` for persistent multi-session conversation history; conversation ID scoping for multi-user applications.
- **Image Generation** — `ImageModel` interface; `ImagePrompt` with `ImageOptions` (size, quality, style, n); providers: OpenAI DALL-E 3, Stability AI, Azure OpenAI image; `ImageResponse` with URLs or base64 data.
- **Observability** — Spring AI auto-configures Micrometer spans for every model call (TTFT, total latency, token counts as metrics); integration with OpenTelemetry; `GenAiAttributes` semantic conventions; prompt and completion content captured as span events (opt-in).
- **Testing** — `MockChatModel` and `MockEmbeddingModel` for unit tests without API calls; Testcontainers-based integration tests with Ollama; `@SpringBootTest` with `spring.ai.openai.api-key=test` and WireMock for API stubbing.
- **Spring Boot Auto-configuration** — `spring-ai-openai-spring-boot-starter`, `spring-ai-anthropic-spring-boot-starter`, etc.; `spring.ai.openai.chat.options.model`, `spring.ai.openai.api-key`; `ChatClient.Builder` auto-configured as a bean; BOM (`spring-ai-bom`) for dependency management.

---

### 39. Observability and SRE

Making a Java service observable and operating it reliably.

**What's covered:**
- **Pillars and Metrics** — Logs, metrics, and traces (the three pillars); structured logging with MDC context propagation; Micrometer metrics (counters, gauges, timers, distribution summaries); Prometheus exposition format; Grafana dashboards.
- **SRE and Alerting** — SLIs, SLOs, SLAs, and error budgets; alerting on symptoms vs causes; `alert_for` duration to reduce noise; on-call runbooks; toil reduction; blameless postmortems.
- **Production Readiness** — Readiness vs liveness vs startup probes; graceful shutdown (drain in-flight requests); zero-downtime deployment checklist; feature flags; chaos engineering; capacity planning.

---

### 40. Data-Intensive Applications

Building pipelines and batch systems that move and transform data at scale.

**What's covered:**
- **CDC, Storage, and Pipelines** — Change Data Capture (Debezium with Kafka Connect); event log as the source of truth; storage engine trade-offs (LSM vs B-tree); column-oriented storage for analytics; data lake vs data warehouse vs data lakehouse.
- **Batch Engines and Windowing** — Spring Batch (Job, Step, ItemReader, ItemProcessor, ItemWriter, retry/skip); Apache Spark RDD/DataFrame/Dataset API; streaming windowing: tumbling, sliding, session windows; watermarks for out-of-order events; Apache Flink.
- **Stateful Processing and Architecture** — State backends in Flink (RocksDB); exactly-once stateful processing; the Lambda Architecture vs Kappa Architecture; stream-table duality; materialised views; the data flywheel.

---

## Part V — Enterprise Architecture

### 41. Architecture Fundamentals

The discipline of software architecture — what it is, how decisions are made, and how it evolves.

**What's covered:**
- **Role and Characteristics** — The software architect's scope; architecture characteristics (availability, scalability, performance, security, maintainability, deployability, testability); fitness functions; the architect's role vs team lead's role.
- **Trade-offs and Decision Styles** — No universally good architecture; trade-off analysis; Architecture Decision Records (ADRs); ATAM (Architecture Trade-off Analysis Method); synchronous vs asynchronous; coupling dimensions (afferent vs efferent); Conway's Law.
- **Evolution and Interview** — Architecture evolution patterns (strangler fig, feature toggle, parallel run); the architectural runway; how to approach an architecture whiteboard interview; common anti-patterns (big ball of mud, distributed monolith).

---

### 42. Architecture Documentation

Communicating architectural decisions to different audiences.

**What's covered:**
- **C4 Model and Views** — C4 levels (Context → Container → Component → Code); when to draw each level; diagramming with Structurizr; the 4+1 architectural views model (logical, process, physical, development, scenarios).
- **UML and Templates** — Class diagrams, sequence diagrams, component diagrams, deployment diagrams; PlantUML and Mermaid for diagram-as-code; Architecture Decision Record templates; RFC templates.
- **Diagrams and Audience** — Tailoring documentation to executives, product managers, engineers, and operations; keeping diagrams current; living documentation principles; Architectural Fitness Functions as automated checks.

---

### 43. Team Topologies

Organising engineering teams for fast, sustainable software delivery.

**What's covered:**
- **Conway's Law and Its Inverse** — Systems mirror communication structures; Inverse Conway Maneuver (design the org to get the architecture you want); cognitive load as the primary constraint.
- **Team Types and Interactions** — Stream-aligned teams (own a value stream); platform teams (reduce cognitive load); enabling teams (upskill and unblock); complicated-subsystem teams; three interaction modes (collaboration, X-as-a-Service, facilitating).
- **Cognitive Load and Platform** — Team cognitive load budget; domain complexity mapping; Internal Developer Platform (IDP) design principles; "golden paths"; measuring team flow with DORA metrics (deployment frequency, lead time, change failure rate, MTTR).

---

### 44. Legacy Modernization

Safely moving from legacy systems to modern architectures without big-bang rewrites.

**What's covered:**
- **Monolith, Data, and Sequencing** — Strangler fig pattern; branch by abstraction; feature toggles for parallel running; the database decomposition problem (shared DB anti-pattern); database-per-service migration sequencing.
- **Rewrite and Patterns** — When to rewrite vs refactor vs re-platform; the risks of rewrites; seam identification (DDD bounded contexts as seams); anti-corruption layer; event interception for state synchronisation.
- **Validation and Boundaries** — Testing during migration (shadow mode, traffic shadowing); defining service boundaries using cohesion and coupling metrics; fitness functions to enforce boundaries; incremental delivery checkpoints.

---

### 45. Multi-Tenancy and SaaS

Building software that serves many customers on shared infrastructure.

**What's covered:**
- **Models and Partitioning** — Isolation models: pooled (shared schema), silo (separate DB per tenant), bridge (separate schema, shared server); data partitioning strategies; PostgreSQL row-level security; schema-per-tenant with Flyway.
- **Context and Noisy Neighbor** — Tenant context propagation (thread-local, MDC, HTTP header); tenant-aware caches; noisy neighbor problem; per-tenant resource quotas and rate limiting; fair scheduling.
- **Lifecycle and Customization** — Tenant onboarding automation; tenant configuration and feature flags; per-tenant data export and deletion (GDPR right to erasure); customization patterns (plugin model, configuration-driven, extension points).

---

### 46. Disaster Recovery and Business Continuity

Designing systems that survive failures and recover within defined time objectives.

**What's covered:**
- **Concepts, RTO, and RPO** — Business continuity vs disaster recovery; RTO (Recovery Time Objective) and RPO (Recovery Point Objective); MTTR and MTBF; disaster categories (hardware, network, data center, logical, regional).
- **Strategies and Topologies** — DR tiers: cold standby, warm standby, hot standby, active-active; pilot light architecture; multi-region active-active with global load balancing; database replication for DR (streaming replication, read replicas, multi-region Aurora).
- **Backups, Failover, and Testing** — 3-2-1 backup rule (3 copies, 2 media, 1 offsite); immutable/WORM backups; point-in-time recovery (PITR); automated failover vs manual; failback complexity; game days and chaos engineering (Chaos Monkey, Gremlin, Chaos Mesh); untested backups don't exist.

---

### 47. Security Architecture

Security designed into the system from the start, not bolted on.

**What's covered:**
- **Mindset and Threat Modeling** — Shift-left security; threat modeling with STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege); attack surface analysis; trust boundaries; DREAD risk scoring.
- **Zero Trust and Defense** — Zero-trust architecture ("never trust, always verify"); micro-segmentation; mutual TLS (mTLS) for service-to-service; defence in depth; WAF; DDoS protection; security layers (perimeter → network → compute → application → data).
- **Secrets, Identity, and Supply Chain** — Secrets management (HashiCorp Vault, cloud KMS); service identity with SPIFFE/SPIRE; certificate rotation; software supply chain security (SBOM, Sigstore, in-toto); dependency pinning; container image signing.

---

### 48. Compliance and Governance

Regulatory requirements and the engineering processes to meet them.

**What's covered:**
- **Regimes and Privacy** — GDPR (data subject rights, lawful basis, DPA obligations); CCPA; HIPAA (PHI, BAA, safeguards); PCI-DSS (cardholder data environment, tokenisation); SOC 2 Type II (Trust Service Criteria).
- **Governance and Automation** — Policy-as-code (OPA/Rego, Sentinel); infrastructure compliance scanning (Checkov, Prowler); automated audit evidence collection; security posture management; change advisory boards (CABs) vs continuous compliance.
- **Residency, Lifecycle, and Audit** — Data residency and sovereignty requirements; data classification; data lifecycle management (retention, archival, deletion); audit log immutability; evidence packaging for external auditors; risk register maintenance.

---

### 49. FinOps and Cost Engineering

Engineering cloud costs as a first-class concern.

**What's covered:**
- **Cost Architecture and FinOps** — FinOps Foundation principles; the FinOps lifecycle (inform → optimise → operate); unit economics (cost per API call, cost per user); cloud cost attribution (tagging taxonomy, chargeback vs showback).
- **Optimization Levers and Build vs Buy** — Right-sizing instances; reserved instances vs savings plans vs spot; auto-scaling to match demand; storage tiering (S3 Intelligent-Tiering); data transfer cost reduction; build vs buy cost analysis (make vs buy framework, hidden costs).
- **Visibility and Interview** — Cost allocation tagging strategy; cost anomaly detection (AWS Cost Anomaly Detection, Kubecost); FinOps tooling (CloudHealth, Apptio); engineering interview questions on cost-aware system design.

---

### 50. Enterprise Integration

Connecting systems that were not designed to talk to each other.

**What's covered:**
- **Integration Styles and Building Blocks** — Gregor Hohpe's Enterprise Integration Patterns (EIP): file transfer, shared database, RPC, messaging; message channel types (point-to-point, publish-subscribe); message anatomy (header, body, envelope).
- **Routing and Transformation** — Content-based router; message filter; splitter and aggregator; scatter-gather; message translator (canonical data model); normaliser; dead letter channel; guaranteed delivery.
- **Endpoints, Management, and Frameworks** — Polling consumer vs event-driven consumer; competing consumers for scalability; message store for audit; control bus for runtime management; Apache Camel (routes, components, EIP DSL); Spring Integration; MuleSoft Anypoint.

---

## Section Map at a Glance

| # | Section | Domain |
|---|---------|--------|
| 01 | Fundamentals | Java Language |
| 02 | OOP | Java Language |
| 03 | Collections | Java Language |
| 04 | Generics | Java Language |
| 05 | Exceptions | Java Language |
| 06 | Streams and Functional | Java Language |
| 07 | Concurrency | Java Language |
| 08 | JVM Memory | Java Runtime |
| 09 | I/O and NIO | Java Runtime |
| 10 | Modern Java (8–21) | Java Language |
| 11 | Design Patterns | Design |
| 12 | Testing | Quality |
| 13 | Spring Core | Spring |
| 14 | Spring Boot | Spring |
| 15 | Spring MVC / REST | Spring |
| 16 | Spring Persistence | Spring |
| 17 | Spring Security | Spring |
| 18 | Scheduling / Async / Messaging | Spring |
| 19 | Architecture and Microservices | Architecture |
| 20 | System Design | Architecture |
| 21 | Ecosystem Libraries | Tooling |
| 22 | Engineering Leadership | Soft Skills |
| 23 | Databases and SQL | Data |
| 24 | DSA (Java) | Algorithms |
| 25 | Caching | Infrastructure |
| 26 | Reactive / WebFlux | Spring |
| 27 | Networking and APIs | Infrastructure |
| 28 | Application Security | Security |
| 29 | Cloud and DevOps | Infrastructure |
| 30 | Performance Engineering | JVM / Ops |
| 31 | Jakarta EE | Java Platform |
| 32 | Behavioral Interview | Soft Skills |
| 33 | Kafka and Streaming | Distributed |
| 34 | Distributed Systems | Distributed |
| 35 | Advanced JVM | Java Runtime |
| 36 | Advanced Concurrency | Java Language |
| 37 | GraalVM and Native | Java Runtime |
| 38 | Advanced Spring | Spring |
| 38a | Spring AI *(planned)* | Spring / AI |
| 39 | Observability and SRE | Ops |
| 40 | Data-Intensive Applications | Distributed |
| 41 | Architecture Fundamentals | Architecture |
| 42 | Architecture Documentation | Architecture |
| 43 | Team Topologies | Organisation |
| 44 | Legacy Modernization | Architecture |
| 45 | Multi-Tenancy / SaaS | Architecture |
| 46 | Disaster Recovery / BC | Architecture |
| 47 | Security Architecture | Security |
| 48 | Compliance and Governance | Governance |
| 49 | FinOps and Cost | Ops |
| 50 | Enterprise Integration | Architecture |

---

## How to Navigate This Knowledge Base

**If you're a Java developer joining a new team:**
`01 Fundamentals` → `02 OOP` → `03 Collections` → `06 Streams` → `07 Concurrency` → `13 Spring Core` → `14 Spring Boot`

**If you're preparing for a Java backend interview:**
`01–10` (language) → `11 Design Patterns` → `12 Testing` → `13–17` (Spring) → `23 Databases` → `24 DSA` → `20 System Design` → `32 Behavioral Interview`

**If you're moving into a senior/staff engineer role:**
`19 Architecture` → `34 Distributed Systems` → `33 Kafka` → `41 Architecture Fundamentals` → `43 Team Topologies` → `22 Leadership`

**If you're building a production microservices system:**
`13–18` (Spring) → `19 Microservices` → `29 Cloud/DevOps` → `25 Caching` → `39 Observability` → `28 Security` → `46 Disaster Recovery`

**If you're working on JVM performance:**
`08 JVM Memory` → `30 Performance` → `35 Advanced JVM` → `36 Advanced Concurrency` → `37 GraalVM`

**If you're building AI-powered Java services:**
`38a Spring AI` → `13 Spring Core` → `14 Spring Boot` → `26 Reactive/WebFlux` (for streaming responses) → `16 Spring Persistence` (for vector store integration)

**If you're working on enterprise or regulated systems:**
`41 Architecture Fundamentals` → `47 Security Architecture` → `48 Compliance` → `45 Multi-Tenancy` → `50 Enterprise Integration`
