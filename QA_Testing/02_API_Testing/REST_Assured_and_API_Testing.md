---
title: "REST Assured and API Testing"
aliases: ["REST Assured Java", "REST Assured DSL", "Java API Testing"]
tags: [QA, Testing, API, RESTAssured, Java, Parameterized]
domain: QA Testing
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# REST Assured and API Testing

> [!abstract] TL;DR
> REST Assured is a Java DSL for testing HTTP APIs with a fluent `.given().when().then()` syntax that reads like a BDD specification. It integrates natively with JUnit 5 for parameterized tests, supports JSON path and XML path assertions, and validates response schemas against JSON Schema. Request/response specifications reduce duplication across a large test suite. OAuth2, JWT bearer, and basic auth are all first-class concepts.

---

## Maven Dependency

```xml
<dependencies>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>json-schema-validator</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
    <!-- For Spring Boot integration tests -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>spring-mock-mvc</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## Core DSL — Given / When / Then

```java
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrderApiTest {

    @LocalServerPort int port;

    @BeforeEach
    void setup() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
        RestAssured.basePath = "/api";
    }

    @Test
    void getOrder_whenExists_returns200() {
        given()
            .header("Authorization", "Bearer " + getTestToken())
            .accept(ContentType.JSON)
        .when()
            .get("/orders/550e8400-e29b-41d4-a716-446655440000")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("id", equalTo("550e8400-e29b-41d4-a716-446655440000"))
            .body("status", equalTo("PENDING"))
            .body("items", hasSize(greaterThan(0)))
            .body("items[0].sku", notNullValue())
            .body("amount", greaterThan(0.0f))
            .time(lessThan(500L));  // response time assertion
    }

    @Test
    void createOrder_withValidPayload_returns201AndLocation() {
        String requestBody = """
            {
                "items": [{ "sku": "SKU-001", "quantity": 2 }],
                "shippingAddress": {
                    "line1": "123 Main St",
                    "city": "Boston",
                    "country": "US",
                    "postalCode": "02101"
                }
            }
            """;

        String location =
            given()
                .header("Authorization", "Bearer " + getTestToken())
                .contentType(ContentType.JSON)
                .body(requestBody)
            .when()
                .post("/orders")
            .then()
                .statusCode(201)
                .header("Location", matchesPattern("/api/orders/[0-9a-f-]{36}"))
                .body("id", matchesPattern("[0-9a-f-]{36}"))
                .body("status", equalTo("PENDING"))
            .extract()
                .header("Location");

        // Follow up: verify the created resource is retrievable
        given()
            .header("Authorization", "Bearer " + getTestToken())
        .when()
            .get(location)
        .then()
            .statusCode(200);
    }

    @Test
    void getOrder_withoutToken_returns401() {
        given()
            .accept(ContentType.JSON)
        .when()
            .get("/orders/any-id")
        .then()
            .statusCode(401)
            .body("error", equalTo("UNAUTHORIZED"))
            .body("message", containsString("token"));
    }
}
```

---

## Request / Response Specifications (DRY)

Specs eliminate repetition across many tests:

```java
// Shared specifications — define once, reuse everywhere

public class ApiSpecifications {

    public static RequestSpecification authenticatedRequest() {
        return new RequestSpecBuilder()
            .setBaseUri("http://localhost")
            .setPort(8080)
            .setBasePath("/api")
            .addHeader("Authorization", "Bearer " + TokenProvider.getToken())
            .addHeader("Accept", "application/json")
            .addHeader("Content-Type", "application/json")
            .setRelaxedHTTPSValidation()  // for self-signed certs in staging
            .log(LogDetail.ALL)           // log request for debugging
            .build();
    }

    public static ResponseSpecification successResponse() {
        return new ResponseSpecBuilder()
            .expectStatusCode(200)
            .expectContentType(ContentType.JSON)
            .expectResponseTime(lessThan(1000L))
            .build();
    }

    public static ResponseSpecification createdResponse() {
        return new ResponseSpecBuilder()
            .expectStatusCode(201)
            .expectContentType(ContentType.JSON)
            .expectHeader("Location", notNullValue())
            .build();
    }
}

// Usage in tests
@Test
void getOrder_withSpec() {
    given()
        .spec(ApiSpecifications.authenticatedRequest())
    .when()
        .get("/orders/{id}", orderId)
    .then()
        .spec(ApiSpecifications.successResponse())
        .body("id", equalTo(orderId));
}
```

---

## JSON Path and XML Path Assertions

```java
// JSON Path — dot notation and array access
.body("user.address.city", equalTo("Boston"))
.body("items[0].sku", equalTo("SKU-001"))
.body("items.size()", equalTo(3))
.body("items.sku", hasItems("SKU-001", "SKU-002"))  // any order
.body("items.findAll { it.quantity > 1 }.size()", equalTo(2))  // Groovy GPath

// Extract and use in Java
String city = given().spec(authSpec())
    .when().get("/users/1")
    .then().extract().path("address.city");

List<String> skus = given().spec(authSpec())
    .when().get("/orders/1")
    .then().extract().path("items.sku");

// Full response extraction for complex assertions
Response response = given().spec(authSpec())
    .when().get("/orders/1")
    .then().extract().response();

JsonPath json = response.jsonPath();
assertThat(json.getString("status")).isEqualTo("PENDING");
assertThat(json.getList("items")).hasSize(2);
```

---

## Authentication

```java
// Basic Auth
given()
    .auth().basic("username", "password")

// OAuth2 Bearer Token
given()
    .auth().oauth2("eyJhbGciOiJSUzI1NiIsIn...")

// Preemptive auth (send credentials without waiting for 401 challenge)
given()
    .auth().preemptive().basic("user", "pass")

// API Key in header
given()
    .header("X-API-Key", apiKey)

// API Key in query param
given()
    .queryParam("api_key", apiKey)

// OAuth2 flow — get token first
String token = given()
    .contentType("application/x-www-form-urlencoded")
    .formParam("grant_type", "client_credentials")
    .formParam("client_id", "test-client")
    .formParam("client_secret", "test-secret")
    .formParam("scope", "read:orders")
.when()
    .post("https://auth.example.com/oauth/token")
.then()
    .statusCode(200)
.extract()
    .path("access_token");
```

---

## JSON Schema Validation

```java
// schema file: src/test/resources/schemas/order-response-schema.json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "status", "amount", "createdAt"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "status": { "type": "string", "enum": ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] },
    "amount": { "type": "number", "minimum": 0, "exclusiveMinimum": 0 },
    "createdAt": { "type": "string", "format": "date-time" },
    "items": {
      "type": "array", "minItems": 1,
      "items": {
        "type": "object",
        "required": ["sku", "quantity", "unitPrice"],
        "properties": {
          "sku": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 },
          "unitPrice": { "type": "number", "minimum": 0 }
        }
      }
    }
  },
  "additionalProperties": false
}
```

```java
// In test
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

@Test
void createOrder_responseMatchesSchema() {
    given()
        .spec(authSpec())
        .body(validOrderPayload())
    .when()
        .post("/orders")
    .then()
        .statusCode(201)
        .body(matchesJsonSchemaInClasspath("schemas/order-response-schema.json"));
}
```

---

## Parameterized API Tests with JUnit 5

```java
@ParameterizedTest(name = "Invalid card {0} returns 402")
@CsvSource({
    "tok_chargeDeclined, CARD_DECLINED",
    "tok_expired,        CARD_EXPIRED",
    "tok_insufficient,   INSUFFICIENT_FUNDS",
    "tok_cvcFail,        CVC_MISMATCH"
})
void checkout_withInvalidCards_returns402(String cardToken, String expectedError) {
    given()
        .spec(authSpec())
        .body(Map.of("cardToken", cardToken, "amount", 100))
    .when()
        .post("/payments/charge")
    .then()
        .statusCode(402)
        .body("error", equalTo(expectedError));
}

@ParameterizedTest
@MethodSource("boundaryAmounts")
void payment_withBoundaryAmounts(BigDecimal amount, int expectedStatus) {
    given()
        .spec(authSpec())
        .body(Map.of("amount", amount))
    .when()
        .post("/payments/charge")
    .then()
        .statusCode(expectedStatus);
}

static Stream<Arguments> boundaryAmounts() {
    return Stream.of(
        Arguments.of(BigDecimal.ZERO, 400),              // zero amount
        Arguments.of(new BigDecimal("0.01"), 200),        // minimum valid
        Arguments.of(new BigDecimal("999999.99"), 200),   // maximum valid
        Arguments.of(new BigDecimal("1000000.00"), 400)   // over limit
    );
}
```

---

## File Upload Testing

```java
@Test
void uploadInvoice_withValidPdf_returns200() {
    File invoiceFile = new File("src/test/resources/fixtures/invoice.pdf");

    given()
        .spec(authSpec())
        .contentType("multipart/form-data")
        .multiPart("file", invoiceFile, "application/pdf")
        .multiPart("orderId", testOrderId)
    .when()
        .post("/orders/upload-invoice")
    .then()
        .statusCode(200)
        .body("url", startsWith("https://"))
        .body("mimeType", equalTo("application/pdf"))
        .body("sizeBytes", lessThan(10_000_000));
}
```

---

## Common Pitfalls

1. **Hard-coded base URIs** — use `RestAssured.baseURI`, `RestAssured.port`, and `RestAssured.basePath` configured in `@BeforeEach` or a base class; never hard-code in individual tests
2. **Ignoring `extract()` for chaining** — accessing `response.path()` without `.extract()` first returns Hamcrest matchers, not values; always extract before using in Java
3. **Not resetting `RestAssured` defaults** — if one test changes `RestAssured.authentication`, it affects subsequent tests; either reset in `@AfterEach` or use `given()` per-request settings (preferred)
4. **Logging disabled in CI** — enable `.log().ifValidationFails()` on all requests so failures print the request/response automatically; debugging CI failures without logs is very painful
5. **GPath complexity** — Groovy GPath expressions like `items.findAll{it.qty>1}` are powerful but hard to read; prefer extracting to Java and using AssertJ for complex assertions

---

## Review Questions

1. What does `.extract().path("user.address.city")` return, and how is it different from `.body("user.address.city", equalTo("Boston"))`?
2. How would you create a `RequestSpecification` that handles OAuth2 token refresh for all tests in a class?
3. Write a parameterized REST Assured test that verifies five different invalid inputs to `POST /api/users` each return the correct 400 error code.
4. What is JSON Schema validation with REST Assured, and at what layer does it differ from a `body("status", equalTo("PENDING"))` assertion?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[API_Testing_Fundamentals]]
- [[Contract_Testing]]
- [[_MOC_Java_Testing|Java Testing MOC]]

---

#QA #Testing #API #RESTAssured #Java
