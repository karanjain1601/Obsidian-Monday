---
title: "Postman and Newman"
aliases: ["Postman Testing", "Newman CLI", "Postman Collections"]
tags: [QA, Testing, API, Postman, Newman, CI]
domain: QA Testing
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# Postman and Newman

> [!abstract] TL;DR
> Postman is the industry-standard GUI for building, documenting, and running API tests. Collections are portable JSON test suites; environments parametrise them for different deployment targets (local/dev/staging/prod). Pre-request scripts handle dynamic setup (token refresh, test data creation); test scripts assert on responses and chain values between requests. Newman is Postman's CLI runner — it executes collections headlessly in CI and produces JUnit/HTML reports for build dashboards.

---

## Workspace and Collection Setup

```
Postman Workspace Structure:
├── Team Workspace: "Payment Platform"
│   ├── Collection: "Payment API v2"
│   │   ├── Folder: Auth
│   │   ├── Folder: Orders
│   │   ├── Folder: Products
│   │   └── Folder: _Setup & Teardown
│   ├── Environments:
│   │   ├── Local (localhost:8080)
│   │   ├── Development (dev.api.example.com)
│   │   ├── Staging (staging.api.example.com)
│   │   └── Production (api.example.com — read-only, no mutations)
│   └── Mock Servers: "Payment Mock"
```

**Export for version control**:
```bash
# Collections and environments are JSON — commit them to the repo
git add postman/Payment_API_v2.collection.json
git add postman/environments/staging.env.json
# NEVER commit environment files with secrets — use Postman Vault for secrets
```

---

## Environment Variables — Scoping

Postman has four variable scopes (highest precedence first):
1. **Local** — temporary, set in pre-request scripts via `pm.variables.set()`
2. **Data** — from CSV/JSON file in Collection Runner / Newman
3. **Environment** — per-deployment values like base URLs and credentials
4. **Collection** — shared across all environments (API version, common headers)
5. **Global** — workspace-wide, avoid for team use (prone to collision)

```javascript
// Setting scoped variables
pm.globals.set("apiVersion", "v2");              // global
pm.collectionVariables.set("timeout", 5000);    // collection
pm.environment.set("authToken", token);          // environment (persists across requests)
pm.variables.set("tempOrderId", "123");          // local (request-scoped, lost after)
```

**Dynamic built-in variables** (no scripting needed):
```
{{$randomEmail}}        → test-1234567890@example.com
{{$randomUUID}}         → 6929bb52-3ab8-4196-a6d1-6b40b8dc4b82
{{$randomInt}}          → 728
{{$isoTimestamp}}       → 2026-07-29T10:30:00.000Z
{{$randomFirstName}}    → Alice
```

---

## Pre-Request Scripts

Pre-request scripts run *before* the HTTP request is sent. Common uses:

**1. Token refresh (OAuth2 / JWT)**:
```javascript
const now = new Date().getTime();
const tokenExpiry = pm.environment.get("tokenExpiry");

if (!tokenExpiry || now >= parseInt(tokenExpiry)) {
    const tokenRequest = {
        url: pm.environment.get("authUrl") + "/oauth/token",
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        body: {
            mode: "urlencoded",
            urlencoded: [
                { key: "grant_type", value: "client_credentials" },
                { key: "client_id", value: pm.environment.get("clientId") },
                { key: "client_secret", value: pm.environment.get("clientSecret") },
                { key: "scope", value: "read:orders write:orders" }
            ]
        }
    };

    pm.sendRequest(tokenRequest, function(err, res) {
        if (err) throw err;
        const json = res.json();
        pm.environment.set("accessToken", json.access_token);
        pm.environment.set("tokenExpiry", now + (json.expires_in * 1000) - 5000);
    });
}
```

**2. Compute HMAC signature**:
```javascript
const timestamp = Math.floor(Date.now() / 1000).toString();
const payload = timestamp + pm.request.method + pm.request.url.getPath();
const secret = pm.environment.get("apiSecret");
const signature = CryptoJS.HmacSHA256(payload, secret).toString();

pm.request.headers.add({ key: "X-Signature", value: signature });
pm.request.headers.add({ key: "X-Timestamp", value: timestamp });
```

---

## Test Scripts

Test scripts run *after* the response is received.

**Comprehensive test script**:
```javascript
// Status code
pm.test("Status 201 Created", () => {
    pm.expect(pm.response.code).to.equal(201);
});

// Response time SLA
pm.test("Response time under 500ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Headers
pm.test("Content-Type is JSON", () => {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// Body schema
const body = pm.response.json();
pm.test("Response has required fields", () => {
    pm.expect(body).to.have.property("id");
    pm.expect(body).to.have.property("status");
    pm.expect(body).to.have.property("createdAt");
});

// Data type assertions
pm.test("ID is a UUID", () => {
    pm.expect(body.id).to.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
});

pm.test("Amount is a positive number", () => {
    pm.expect(body.amount).to.be.a("number");
    pm.expect(body.amount).to.be.above(0);
});

// No sensitive data leaked
pm.test("No sensitive fields exposed", () => {
    pm.expect(body).to.not.have.property("password");
    pm.expect(body).to.not.have.property("cardNumber");
    pm.expect(body).to.not.have.property("cvv");
});

// Chain: save for next request
pm.environment.set("createdOrderId", body.id);
console.log("Created order:", body.id);
```

**JSON Schema validation**:
```javascript
const schema = {
    "type": "object",
    "required": ["id", "status", "amount", "createdAt"],
    "properties": {
        "id": { "type": "string", "format": "uuid" },
        "status": { "type": "string", "enum": ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] },
        "amount": { "type": "number", "minimum": 0 },
        "createdAt": { "type": "string", "format": "date-time" }
    },
    "additionalProperties": false
};

pm.test("Response matches schema", () => {
    pm.expect(tv4.validate(pm.response.json(), schema)).to.be.true;
});
```

---

## Collection Runner and Data Files

**Data-driven testing with CSV**:
```csv
email,password,expectedStatus,expectedError
alice@example.com,correct-password,200,
alice@example.com,wrongpassword,401,INVALID_CREDENTIALS
notanemail,anypassword,400,VALIDATION_ERROR
,anypassword,400,VALIDATION_ERROR
```

```javascript
// In test script — read from data file
pm.test("Status matches expected", () => {
    pm.expect(pm.response.code).to.equal(parseInt(pm.iterationData.get("expectedStatus")));
});

pm.test("Error code matches (if applicable)", () => {
    const expectedError = pm.iterationData.get("expectedError");
    if (expectedError) {
        pm.expect(pm.response.json().error).to.equal(expectedError);
    }
});
```

---

## Newman — Full Reference

```bash
# Install
npm install -g newman newman-reporter-htmlextra

# Basic run with environment
newman run collection.json -e environment.json

# Multiple reporters
newman run collection.json \
    -e staging.json \
    --reporters cli,html,junit \
    --reporter-html-export reports/report.html \
    --reporter-junit-export reports/junit.xml

# Data-driven from CSV
newman run collection.json \
    -e environment.json \
    -d test-data.csv \
    --reporters cli

# Run specific folder
newman run collection.json \
    --folder "Orders" \
    --folder "Auth"

# Set timeout per request (ms)
newman run collection.json --timeout-request 5000

# Retry failed tests
newman run collection.json --iteration-count 1

# Environment variable overrides (CI secrets)
newman run collection.json \
    -e environment.json \
    --env-var "baseUrl=https://staging.api.example.com" \
    --env-var "apiKey=$API_KEY_FROM_CI_SECRET"

# Exit code: 0 = all pass, 1 = failures exist
newman run collection.json -e env.json; echo "Exit: $?"
```

**htmlextra reporter** (richer HTML reports):
```bash
newman run collection.json \
    -e environment.json \
    --reporters htmlextra \
    --reporter-htmlextra-export reports/report.html \
    --reporter-htmlextra-title "Payment API Test Report" \
    --reporter-htmlextra-browserTitle "QA Report" \
    --reporter-htmlextra-showEnvironmentData \
    --reporter-htmlextra-showMarkdownLinks
```

---

## Postman Mock Servers

Create a mock server from a collection to test consumer code before the API exists:

```bash
# Postman API — create mock server (requires Postman API key)
curl --location 'https://api.getpostman.com/mocks' \
  --header 'X-Api-Key: {{postmanApiKey}}' \
  --header 'Content-Type: application/json' \
  --data '{
    "mock": {
      "collection": { "id": "{{collectionId}}" },
      "environment": { "id": "{{envId}}" },
      "name": "Payment Mock"
    }
  }'
```

The mock server returns example responses defined in each request's "Examples" tab. Consumers can develop and test against the mock URL while the API is under development.

---

## Common Pitfalls

1. **Secrets in environment files committed to git** — use Postman Vault for secrets; never commit `apiKey` or `clientSecret` values; use `$CI_SECRET` injection in Newman
2. **Environment-specific assertions** — asserting on exact IDs or timestamps that differ between environments; use regex patterns or relative assertions
3. **Request ordering dependency in collections** — if Request B depends on Request A's output, but the runner can skip A, the collection is fragile; always verify prerequisites in pre-request scripts
4. **No cleanup** — collections that create test data without cleaning up pollute staging databases; always include a teardown folder
5. **Using pm.globals for team collections** — global variables are user-scoped, not workspace-scoped; they behave inconsistently across team members; use collection variables instead

---

## Review Questions

1. What is the difference between environment variables and collection variables in Postman? When would you use each?
2. Write a pre-request script that refreshes a JWT token only if it has expired (or will expire in the next 30 seconds).
3. How would you run a Newman collection in GitHub Actions, publishing JUnit results and failing the build if any test fails?
4. What are Postman mock servers and when are they useful in a team workflow?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[API_Testing_Fundamentals]]
- [[REST_Assured_and_API_Testing]]
- [[CI_CD_Testing_Integration]]

---

#QA #Testing #API #Postman #Newman
