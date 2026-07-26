---
title: "REST Controllers"
aliases: ["@RestController", "Spring REST API", "ResponseEntity"]
tags: [java, spring, spring-mvc, beginner]
domain: Java
difficulty: beginner
created: 2026-07-26
related: ["[[Spring_MVC_Architecture]]", "[[Request_Mapping]]", "[[Exception_Handling]]"]
status: complete
---

# 🎮 REST Controllers

> [!abstract] TL;DR
> `@RestController` combines `@Controller` and `@ResponseBody` — every method return value is serialized directly to the HTTP response body (JSON by default via Jackson). `ResponseEntity<T>` gives full control over status codes, headers, and body. REST follows the Richardson Maturity Model: Level 2 (HTTP verbs + resources) is the minimum acceptable baseline; Level 3 (HATEOAS) adds self-describing hypermedia links.

## Intuition — analogy FIRST
A REST controller is like a hotel receptionist who speaks fluent HTTP. Each request type maps to a different desk: the "GET desk" retrieves information, the "POST desk" creates new records, the "PUT desk" replaces existing records, the "DELETE desk" removes them. The receptionist (controller) knows which desk to route to based on the HTTP method and URL path, processes the request, and returns the right response — including the correct status code (201 CREATED for new records, 404 NOT FOUND when missing, 400 BAD REQUEST for invalid input).

---

## How It Works

```mermaid
graph TD
    Request["HTTP Request\nGET /api/users/123"]
    DS["DispatcherServlet\nroutes by @RequestMapping"]
    Method["@GetMapping("/api/users/{id}")\npublic ResponseEntity<UserResponse> getUser(...)"]
    Service["UserService.findById(id)"]
    Jackson["Jackson ObjectMapper\nUser → JSON"]
    Response["HTTP 200 OK\nContent-Type: application/json\n{\"id\":\"123\", \"name\":\"Alice\"}"]

    Request --> DS --> Method --> Service --> Jackson --> Response

    style Request fill:#4a9eff,color:#fff
    style Method fill:#7ed321,color:#fff
    style Jackson fill:#e64980,color:#fff
    style Response fill:#f5a623,color:#fff
```

## Key Concepts / Details

### @RestController — Building REST APIs

```java
@RestController                         // @Controller + @ResponseBody
@RequestMapping("/api/v1/users")        // base path for all methods
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // GET /api/v1/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id) {
        return userService.findById(id)
            .map(user -> ResponseEntity.ok(UserMapper.toResponse(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/v1/users?page=0&size=20&sort=name
    @GetMapping
    public ResponseEntity<Page<UserResponse>> listUsers(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(userService.findAll(pageable).map(UserMapper::toResponse));
    }

    // POST /api/v1/users
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request,
            UriComponentsBuilder uriBuilder) {
        User created = userService.create(request);
        URI location = uriBuilder.path("/api/v1/users/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(UserMapper.toResponse(created));
    }

    // PUT /api/v1/users/{id} — full replacement
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        User updated = userService.update(id, request);
        return ResponseEntity.ok(UserMapper.toResponse(updated));
    }

    // PATCH /api/v1/users/{id} — partial update
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> patchUser(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        User patched = userService.patch(id, updates);
        return ResponseEntity.ok(UserMapper.toResponse(patched));
    }

    // DELETE /api/v1/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
```

### ResponseEntity — Full HTTP Control

```java
// Common ResponseEntity patterns
ResponseEntity.ok(body)                               // 200 OK with body
ResponseEntity.created(uri)                           // 201 Created with Location header
ResponseEntity.noContent().build()                    // 204 No Content
ResponseEntity.notFound().build()                     // 404 Not Found
ResponseEntity.badRequest().body(errorDetails)        // 400 Bad Request
ResponseEntity.status(HttpStatus.CONFLICT).body(msg) // 409 Conflict

// Full control builder
return ResponseEntity.status(HttpStatus.OK)
    .contentType(MediaType.APPLICATION_JSON)
    .header("X-Custom-Header", "value")
    .header("Cache-Control", "max-age=3600")
    .body(responseBody);
```

### HTTP Status Codes for REST

| Operation | Success | Error |
|-----------|---------|-------|
| GET (found) | 200 OK | 404 Not Found |
| POST (created) | 201 Created + Location header | 400 Bad Request, 409 Conflict |
| PUT (updated) | 200 OK or 204 No Content | 400, 404, 409 |
| DELETE (deleted) | 204 No Content | 404 Not Found |
| Business error | 4xx (client error) | 5xx (server error) |
| Validation failed | 400 Bad Request | - |
| Unauthorized | 401 Unauthorized | - |
| Forbidden | 403 Forbidden | - |

### Content Negotiation

```java
// Client sends Accept header to request format
// Accept: application/json → Jackson JSON
// Accept: application/xml → JAXB XML (requires jackson-dataformat-xml)

@GetMapping(value = "/{id}",
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
public UserResponse getUser(@PathVariable String id) { /*...*/ }

// Client sends Content-Type for request body
// Content-Type: application/json
// Content-Type: multipart/form-data (for file uploads)
@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest req) { /*...*/ }
```

### Richardson Maturity Model

| Level | Description | Example |
|-------|-------------|---------|
| L0: Swamp of POX | Single URI, POST only, no HTTP semantics | SOAP, RPC |
| L1: Resources | Multiple URIs for different resources | POST /users, POST /orders |
| L2: HTTP Verbs | HTTP methods for operations | GET /users/1, DELETE /users/1 |
| L3: HATEOAS | Links guide client to next actions | Response includes `_links` |

**Level 2** is the minimum for a proper REST API. Most production APIs stop here. Level 3 (HATEOAS) is rarely implemented in practice.

### WebClient — Calling Other REST APIs

```java
// RestTemplate (legacy, blocking) vs WebClient (modern, blocking OR async)
@Configuration
public class WebClientConfig {
    @Bean
    public WebClient userServiceClient() {
        return WebClient.builder()
            .baseUrl("https://user-service.example.com")
            .defaultHeader("Accept", "application/json")
            .filter(ExchangeFilterFunctions.basicAuthentication("user", "pass"))
            .build();
    }
}

@Service
public class UserApiClient {
    private final WebClient userClient;

    // Synchronous call (blocking — use in non-reactive apps)
    public Optional<UserResponse> getUser(String id) {
        try {
            return Optional.ofNullable(
                userClient.get()
                    .uri("/users/{id}", id)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(),
                              resp -> resp.bodyToMono(String.class)
                                        .map(body -> new UserNotFoundException(id)))
                    .bodyToMono(UserResponse.class)
                    .block(Duration.ofSeconds(5)) // blocking — specify timeout
            );
        } catch (UserNotFoundException e) {
            return Optional.empty();
        }
    }
}
```

---

## Real-World Notes

- **Location header on 201**: always return the `Location` header pointing to the created resource. It's part of the HTTP spec and essential for clients to know where to find the new resource.
- **`@Valid` triggers Bean Validation**: add `@Valid` before `@RequestBody` to trigger Jakarta Validation (`@NotNull`, `@Size`, `@Email`). Failed validation throws `MethodArgumentNotValidException` → 400 by default.
- **Idempotency**: `GET`, `PUT`, and `DELETE` must be idempotent (same result if called multiple times). `POST` creates new resources and is not idempotent. `PATCH` is typically not idempotent.

---

## Common Pitfalls

- **Not specifying HTTP status codes**: returning `200 OK` for resource creation (should be `201 Created`), or `200 OK` for deletion (should be `204 No Content`) — breaks REST conventions.
- **Exposing domain entities directly**: returning `@Entity` objects from controllers exposes database structure, causes lazy-loading exceptions, and serializes internal fields. Always use DTOs.
- **Missing `@Valid` on `@RequestBody`**: without it, Bean Validation annotations on request DTOs are silently ignored.

---

## Related Concepts

- [[Spring_MVC_Architecture]] — DispatcherServlet routes requests to controller methods
- [[Request_Mapping]] — Detailed coverage of all parameter extraction annotations
- [[Exception_Handling]] — How to handle errors and return proper error responses

---

## Review Questions

1. What is the difference between `@Controller` and `@RestController`?
2. When should you return `ResponseEntity<T>` vs just returning `T`?
3. What HTTP status code should a successful POST request return and why?
4. What is content negotiation and how do you configure what formats your endpoint supports?
5. Describe the Richardson Maturity Model levels with an example for each.

---

## Sources

- Spring Framework Documentation: @RestController
- Roy Fielding, *Architectural Styles and the Design of Network-based Software Architectures* (REST dissertation)
- Richardson Maturity Model: https://martinfowler.com/articles/richardsonMaturityModel.html

#java #spring #spring-mvc #rest #restcontroller #responseentity #http-status
