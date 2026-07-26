---
title: "Request Mapping"
aliases: ["@PathVariable", "@RequestParam", "@RequestBody", "Spring Request Parameters"]
tags: [java, spring, spring-mvc, intermediate]
domain: Java
difficulty: intermediate
created: 2026-07-26
related: ["[[REST_Controllers]]", "[[Spring_MVC_Architecture]]", "[[Exception_Handling]]"]
status: complete
---

# 📍 Request Mapping

> [!abstract] TL;DR
> Spring MVC provides rich annotations for extracting data from every part of an HTTP request: `@PathVariable` for URI segments, `@RequestParam` for query string values, `@RequestBody` for JSON/XML request bodies, `@RequestHeader` for HTTP headers, `@CookieValue` for cookies, and `@RequestPart` for multipart file uploads. Bean Validation integrates with `@Valid` to validate request data declaratively.

## Intuition — analogy FIRST
Think of an HTTP request as a letter: the envelope has the address (`@PathVariable` — who it's to), the back of the envelope has sticky notes (`@RequestParam` — extra instructions like "deliver before noon"), the letter itself contains the main content (`@RequestBody` — the actual payload), and there are postal stamps (`@RequestHeader` — metadata like language, authorization). Spring's annotations let you read each part of the letter with dedicated tools rather than manually parsing the raw text.

---

## How It Works

```mermaid
graph TD
    Request["HTTP Request"]
    URL["URL: /users/{id}/orders?status=PENDING&page=0"]
    Body["Body: {\"quantity\": 5}"]
    Headers["Headers: Authorization: Bearer token\nAccept-Language: en-US"]

    PV["@PathVariable\nextracts {id} from URL segment"]
    RP["@RequestParam\nextracts status=PENDING, page=0"]
    RB["@RequestBody\ndeserializes JSON body to object"]
    RH["@RequestHeader\nextracts Authorization header"]

    Request --> URL
    Request --> Body
    Request --> Headers
    URL --> PV
    URL --> RP
    Body --> RB
    Headers --> RH

    style Request fill:#4a9eff,color:#fff
    style PV fill:#7ed321,color:#fff
    style RP fill:#e64980,color:#fff
    style RB fill:#f5a623,color:#fff
    style RH fill:#ff6b6b,color:#fff
```

## Key Concepts / Details

### @PathVariable — URI Template Variables

```java
// Simple path variable
@GetMapping("/users/{userId}/orders/{orderId}")
public OrderResponse getOrder(
        @PathVariable String userId,       // matches {userId}
        @PathVariable("orderId") String id) { // explicit name mapping
    return orderService.findByUserAndId(userId, id);
}

// Optional path variable
@GetMapping(value = {"/users/{id}", "/users"})
public ResponseEntity<UserResponse> getUser(
        @PathVariable(required = false) String id) {
    if (id == null) return ResponseEntity.ok(userService.getDefault());
    return ResponseEntity.ok(userService.find(id));
}

// Regex constraint in path variable
@GetMapping("/users/{id:[0-9]+}")  // only matches numeric IDs
public UserResponse getUser(@PathVariable Long id) { /*...*/ }

// Multiple variables and type conversion (Spring auto-converts)
@GetMapping("/reports/{year}/{month}")
public Report getReport(@PathVariable int year, @PathVariable int month) { /*...*/ }
```

### @RequestParam — Query String Parameters

```java
// GET /products?category=electronics&minPrice=100&maxPrice=1000&sort=price
@GetMapping("/products")
public Page<ProductResponse> searchProducts(
        @RequestParam String category,                // required by default
        @RequestParam(required = false) BigDecimal minPrice,  // optional → null if absent
        @RequestParam(defaultValue = "0.0") BigDecimal maxPrice,
        @RequestParam(defaultValue = "name") String sort,
        @PageableDefault(size = 20) Pageable pageable) {
    return productService.search(category, minPrice, maxPrice, sort, pageable);
}

// List parameter: GET /items?ids=1&ids=2&ids=3
@GetMapping("/items")
public List<Item> getItems(@RequestParam List<String> ids) {
    return itemService.findAllById(ids);
}

// Map of all params
@GetMapping("/search")
public SearchResult search(@RequestParam Map<String, String> params) {
    return searchService.search(params);
}
```

### @RequestBody — Deserializing JSON

```java
// POST /orders with JSON body
@PostMapping("/orders")
public ResponseEntity<OrderResponse> createOrder(
        @Valid @RequestBody CreateOrderRequest request) { // @Valid triggers Bean Validation
    Order order = orderService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(OrderMapper.toResponse(order));
}

// Request DTO with validation
public record CreateOrderRequest(
    @NotBlank String customerId,
    @NotEmpty @Size(max = 50) List<@Valid OrderLineRequest> lines,
    @NotNull Address shippingAddress
) {}

public record OrderLineRequest(
    @NotBlank String productId,
    @Min(1) @Max(999) int quantity
) {}
```

### @RequestHeader — HTTP Headers

```java
@GetMapping("/api/data")
public DataResponse getData(
        @RequestHeader("Authorization") String authHeader,       // required
        @RequestHeader(value = "X-Request-ID", required = false) String requestId,
        @RequestHeader("Accept-Language") Locale locale) {
    String token = authHeader.replace("Bearer ", "");
    return dataService.getData(token, locale);
}

// All headers as map
@PostMapping("/webhook")
public ResponseEntity<Void> handleWebhook(
        @RequestHeader Map<String, String> headers,
        @RequestBody String body) {
    String signature = headers.get("X-Signature");
    webhookService.verify(signature, body);
    return ResponseEntity.ok().build();
}
```

### @CookieValue — Cookies

```java
@GetMapping("/profile")
public ProfileResponse getProfile(
        @CookieValue("session-token") String sessionToken,
        @CookieValue(value = "theme", defaultValue = "light") String theme) {
    return profileService.getProfile(sessionToken, theme);
}
```

### Multipart File Upload

```java
// POST multipart/form-data
@PostMapping("/users/{id}/avatar")
public ResponseEntity<String> uploadAvatar(
        @PathVariable String id,
        @RequestPart("file") MultipartFile file,
        @RequestPart(value = "metadata", required = false) String metadata) {

    if (file.isEmpty()) throw new BadRequestException("File cannot be empty");
    if (!isValidImageType(file.getContentType())) throw new BadRequestException("Invalid file type");

    String url = storageService.upload(id, file.getInputStream(), file.getOriginalFilename());
    return ResponseEntity.ok(url);
}

// Multiple files
@PostMapping("/documents")
public List<String> uploadDocuments(@RequestPart("files") List<MultipartFile> files) {
    return files.stream()
        .map(file -> storageService.upload(file))
        .collect(Collectors.toList());
}
```

```yaml
# application.yml — file upload limits
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 50MB
```

### @ModelAttribute — Bind Form Data / Multiple Params to Object

```java
// Useful for form submissions or multiple query params → one object
public record SearchCriteria(
    String name,
    String category,
    Integer minAge,
    Integer maxAge
) {}

// GET /search?name=Alice&category=premium&minAge=18
@GetMapping("/search")
public List<UserResponse> search(@ModelAttribute SearchCriteria criteria) {
    // Spring binds all matching query params to SearchCriteria fields
    return userService.search(criteria);
}
```

### @MatrixVariable — Matrix Variables

```java
// GET /cars;color=red,blue;weight=heavy
@GetMapping("/cars")
public List<Car> getCars(
        @MatrixVariable List<String> color,
        @MatrixVariable String weight) {
    return carService.findBy(color, weight);
}
```

---

## Real-World Notes

- **Automatic type conversion**: Spring converts request parameter strings to Java types automatically: `String → int`, `String → LocalDate` (needs formatter), `String → UUID`, `String → Enum`. Register custom converters with `WebMvcConfigurer.addFormatters()`.
- **`@RequestBody` for PATCH**: for partial updates, `@RequestBody Map<String, Object>` or `Optional<T>` fields let you detect which fields were explicitly sent vs omitted.
- **Pageable auto-binding**: add `spring-boot-starter-data-jpa` and `@PageableDefault` to automatically bind `?page=0&size=20&sort=name,asc` from query params to a `Pageable` object.
- **Validation on path variables**: `@Positive @PathVariable Long id` validates that the ID is positive. Requires `@Validated` on the class level to activate method-level validation.

---

## Common Pitfalls

- **`@RequestParam` vs `@PathVariable` confusion**: `@RequestParam` reads from `?key=value` (query string); `@PathVariable` reads from the URL path template `/{variable}`. Don't confuse them.
- **Missing `@Valid` on `@RequestBody`**: validation annotations on DTOs are silently ignored without `@Valid`. This is the most common validation bug.
- **Large file uploads in memory**: by default, multipart files are stored in memory. Configure `spring.servlet.multipart.file-size-threshold` to write to disk for large files.
- **`@RequestHeader` name case**: HTTP headers are case-insensitive, but `@RequestHeader("content-type")` and `@RequestHeader("Content-Type")` both work.

---

## Related Concepts

- [[REST_Controllers]] — Controller method structure and response handling
- [[Exception_Handling]] — How validation errors from @Valid are handled
- [[Spring_MVC_Architecture]] — Argument resolvers extract the parameters

---

## Review Questions

1. What is the difference between `@PathVariable` and `@RequestParam`?
2. How do you make a `@RequestParam` optional with a default value?
3. What is `@ModelAttribute` and when would you use it over `@RequestBody`?
4. How does Spring convert a request parameter string `"2026-07-26"` to a `LocalDate`?
5. How do you upload a file along with JSON metadata in a single request?

---

## Sources

- Spring Framework Documentation: Annotated Controllers
- Spring Framework Documentation: Data Binding
- Baeldung: Spring Request Parameter

#java #spring #spring-mvc #pathvariable #requestparam #requestbody #requestheader #multipart
