---
title: "API Testing Fundamentals"
aliases: ["REST API Testing", "API Test Checklist", "API QA"]
tags: [QA, Testing, API, REST, Postman, Newman]
domain: QA Testing
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# API Testing Fundamentals

> [!abstract] TL;DR
> API testing verifies that HTTP endpoints behave correctly: right status codes, correct response schema, proper auth enforcement, appropriate error messages, and sensible performance. It sits in the integration layer of the testing pyramid — faster than E2E, more realistic than unit. Postman collections with environments enable portable, shareable test suites; Newman executes them headlessly in CI. Negative testing (invalid auth, missing fields, wrong types, boundary values) finds the majority of API bugs.

---

## REST API Testing Checklist

For every endpoint, verify:

```
Checklist: GET /api/orders/{id}

Status Codes:
  [ ] 200 OK — valid authenticated request, order exists
  [ ] 401 Unauthorized — missing Authorization header
  [ ] 403 Forbidden — authenticated user does not own this order
  [ ] 404 Not Found — order ID does not exist
  [ ] 400 Bad Request — order ID is not a valid UUID

Response Headers:
  [ ] Content-Type: application/json; charset=utf-8
  [ ] Cache-Control header present and appropriate
  [ ] CORS headers correct for browser clients
  [ ] No sensitive headers leaked (X-Powered-By, Server version)

Response Body:
  [ ] Schema matches documented contract (all required fields present)
  [ ] Data types correct (id is string, amount is number, not string)
  [ ] No unexpected fields leaked (password_hash, internal_id)
  [ ] Dates formatted consistently (ISO 8601)

Authentication:
  [ ] JWT token: valid token succeeds
  [ ] JWT token: expired token returns 401 with helpful message
  [ ] JWT token: tampered signature returns 401
  [ ] API key: missing key returns 401
  [ ] API key: revoked key returns 401

Rate Limiting:
  [ ] 100 requests within limit succeed
  [ ] 101st request returns 429 Too Many Requests
  [ ] Retry-After header present on 429
```

---

## HTTP Methods — Idempotency Rules

| Method | Idempotent | Safe | Typical Use |
|--------|-----------|------|-------------|
| GET | Yes | Yes | Retrieve resource |
| HEAD | Yes | Yes | Retrieve headers only |
| PUT | Yes | No | Replace entire resource |
| PATCH | **No** | No | Partial update (implement idempotency manually with idempotency key) |
| DELETE | Yes | No | Remove resource (repeated deletes after first return 404, not error) |
| POST | **No** | No | Create resource (retry-safe only with idempotency key) |

**Idempotency key pattern** for POST:
```http
POST /api/payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{ "amount": 5000, "currency": "USD", "card_token": "tok_visa" }
```

Server stores the key; on retry with same key, returns original response without re-processing.

---

## Test Data Isolation

```javascript
// Postman Pre-request Script — create isolated test user
pm.sendRequest({
    url: pm.environment.get("baseUrl") + "/api/test/users",
    method: "POST",
    header: { "Content-Type": "application/json", "X-Test-Auth": pm.environment.get("testAdminKey") },
    body: {
        mode: "raw",
        raw: JSON.stringify({
            email: "test-" + Date.now() + "@example.com",
            role: "customer"
        })
    }
}, function(err, res) {
    pm.environment.set("testUserId", res.json().id);
    pm.environment.set("testUserToken", res.json().token);
});
```

**Teardown**: delete test data in a collection-level post-run script or via a dedicated cleanup endpoint.

---

## Contract Testing vs Functional Testing

| Aspect | Contract Testing | Functional Testing |
|--------|-----------------|-------------------|
| **Validates** | API shape (schema, fields, types) | Business logic (correct values, state changes) |
| **Speed** | Very fast (milliseconds, no real server) | Slower (requires running service) |
| **Who writes** | Both consumer and provider teams | QA / Dev on provider team |
| **Tools** | Pact, Dredd, OpenAPI validators | Postman, REST Assured, Karate |
| **Catches** | Breaking schema changes, renamed fields | Wrong calculations, missing validation, bad auth |

Run contract tests first (fast, fail-fast on schema); then run functional tests.

---

## Negative Testing Patterns

```javascript
// Postman test suite — negative cases for POST /api/users

// 1. Missing required field
pm.test("Missing email returns 400", function() {
    // Pre-request: send body without email
    pm.expect(pm.response.code).to.equal(400);
    pm.expect(pm.response.json().error).to.equal("VALIDATION_ERROR");
    pm.expect(pm.response.json().details[0].field).to.equal("email");
});

// 2. Wrong type
pm.test("Non-numeric age returns 400", function() {
    // body: { "age": "twenty" }
    pm.expect(pm.response.code).to.equal(400);
});

// 3. Boundary value
pm.test("Age 17 (below 18 minimum) returns 400", function() {
    // body: { "age": 17 }
    pm.expect(pm.response.code).to.equal(400);
    pm.expect(pm.response.json().error).to.include("must be at least 18");
});

// 4. SQL injection attempt
pm.test("SQL injection in username returns 400, not 500", function() {
    // body: { "username": "'; DROP TABLE users; --" }
    pm.expect(pm.response.code).to.be.oneOf([400, 422]);
    pm.expect(pm.response.code).to.not.equal(500); // must not crash
});

// 5. Oversized payload
pm.test("Payload over 1MB returns 413", function() {
    pm.expect(pm.response.code).to.equal(413);
});
```

---

## Postman Collections

**Collection structure**:
```
Collection: Payment Service API
├── Authentication
│   ├── Login (stores token in env var)
│   └── Refresh Token
├── Orders
│   ├── Create Order (positive)
│   ├── Create Order - Missing Fields (negative)
│   ├── Create Order - Invalid Card (negative)
│   ├── Get Order by ID
│   └── Get Order - Not Found (negative)
└── Teardown
    └── Delete Test Data
```

**Environment variables**:
```json
{
    "id": "dev-environment",
    "name": "Development",
    "values": [
        { "key": "baseUrl", "value": "http://localhost:8080" },
        { "key": "apiKey", "value": "dev-key-do-not-commit" },
        { "key": "testUserToken", "value": "" }
    ]
}
```

**Pre-request script — token refresh**:
```javascript
const tokenExpiry = pm.environment.get("tokenExpiry");
if (!tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/auth/token",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify({
            client_id: pm.environment.get("clientId"),
            client_secret: pm.environment.get("clientSecret")
        })}
    }, function(err, res) {
        pm.environment.set("accessToken", res.json().access_token);
        pm.environment.set("tokenExpiry", Date.now() + (res.json().expires_in * 1000));
    });
}
```

**Test script with `pm.expect`**:
```javascript
pm.test("Status is 201", () => pm.expect(pm.response.code).to.equal(201));
pm.test("Order ID is UUID", () => {
    const body = pm.response.json();
    pm.expect(body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});
pm.test("Response time < 500ms", () => pm.expect(pm.response.responseTime).to.be.below(500));
pm.test("No sensitive fields exposed", () => {
    const body = pm.response.json();
    pm.expect(body).to.not.have.property("password");
    pm.expect(body).to.not.have.property("cvv");
});

// Chain: store created order ID for next request
pm.environment.set("createdOrderId", pm.response.json().id);
```

---

## Newman for CLI Execution

```bash
# Install Newman
npm install -g newman newman-reporter-html

# Basic run
newman run payment-collection.json -e dev-environment.json

# With HTML report
newman run payment-collection.json \
    -e staging-environment.json \
    --reporters cli,html \
    --reporter-html-export reports/newman-report.html

# CI integration — fail build on test failure
newman run payment-collection.json \
    -e ci-environment.json \
    --reporters cli,junit \
    --reporter-junit-export reports/newman-results.xml \
    --bail  # stop on first error

# Run specific folder only
newman run payment-collection.json \
    -e dev-environment.json \
    --folder "Orders"

# With delay between requests (rate limit avoidance)
newman run payment-collection.json \
    --delay-request 100
```

**GitHub Actions integration**:
```yaml
- name: Run API Tests
  run: |
    newman run postman/collection.json \
      -e postman/env-staging.json \
      --reporters cli,junit \
      --reporter-junit-export test-results/api-tests.xml
- name: Publish Test Results
  uses: mikepenz/action-junit-report@v4
  if: always()
  with:
    report_paths: 'test-results/api-tests.xml'
```

---

## Common Pitfalls

1. **Testing only happy paths** — 60–80% of API bugs are in error handling; invest heavily in negative tests
2. **Hard-coded base URLs** — a collection with `localhost:8080` hardcoded cannot run in CI against staging; always use environment variables
3. **Ignoring response headers** — Content-Type mismatches and missing CORS headers are common bugs not caught by body-only assertions
4. **Not testing rate limits** — rate limit bugs (missing headers, wrong limits) are only caught if you actually test the limit boundary
5. **Shared test data** — if multiple Newman runs execute in parallel, shared test users cause race conditions; use dynamic test data created per run

---

## Review Questions

1. For `DELETE /api/resources/{id}`, what status codes should you test, and what is the expected response for the second call with the same ID?
2. What is the difference between contract testing and functional API testing? When would you use each?
3. Write a Postman test script that verifies a 201 response, extracts the `id` field, and stores it for the next request in the chain.
4. What Newman flags would you use in a CI pipeline to publish JUnit-format results and stop on first failure?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[Postman_and_Newman]]
- [[REST_Assured_and_API_Testing]]
- [[Contract_Testing]]
- [[CI_CD_Testing_Integration]]
- [[_MOC_Java_Testing|Java Testing MOC]]

---

#QA #Testing #API #REST #Postman #Newman
