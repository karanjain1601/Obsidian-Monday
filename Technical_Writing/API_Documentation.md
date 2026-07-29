---
title: API Documentation
aliases: [OpenAPI, Swagger, API Reference]
tags: [technical-writing, api, openapi, swagger, documentation]
domain: Technical Writing
difficulty: Intermediate
created: 2026-07-29
related: [Technical_Writing_Overview, Developer_Guides, Documentation_Tools]
status: complete
---

# API Documentation

> [!abstract] TL;DR
> API documentation starts with an OpenAPI/Swagger spec (YAML/JSON describing endpoints, parameters, schemas, and examples), rendered into interactive docs via Swagger UI, Redoc, or Stoplight. Good endpoint descriptions include not just what the endpoint does but also required permissions, rate limits, and error codes. Code samples in multiple languages and a changelog are essential for developer trust.

## OpenAPI / Swagger Specification

OpenAPI is the industry standard for describing REST APIs. A `.yaml` or `.json` spec file fully describes your API:

```yaml
# openapi.yaml
openapi: "3.1.0"
info:
  title: Example API
  description: |
    The Example API enables you to manage users and resources.
    
    ## Authentication
    All requests require a Bearer token in the `Authorization` header.
    
    ## Rate Limits
    - Free tier: 100 requests/minute
    - Pro tier: 1,000 requests/minute
    
    Rate limit headers are returned on every response.
  version: "2.0.0"
  contact:
    email: api-support@example.com

servers:
  - url: https://api.example.com/v2
    description: Production

paths:
  /users/{user_id}:
    get:
      operationId: getUser
      summary: Retrieve a user
      description: |
        Returns the full profile for a user by their unique ID.
        
        **Required permissions:** `users:read`
        
        **Rate limits:** This endpoint is rate-limited at 100 requests/minute per API key.
      tags: [Users]
      parameters:
        - name: user_id
          in: path
          required: true
          description: The unique identifier of the user (UUID v4)
          schema:
            type: string
            format: uuid
            example: "550e8400-e29b-41d4-a716-446655440000"
      security:
        - bearerAuth: []
      responses:
        "200":
          description: User found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
              examples:
                active_user:
                  summary: Active user
                  value:
                    id: "550e8400-e29b-41d4-a716-446655440000"
                    email: "alice@example.com"
                    name: "Alice Johnson"
                    status: "active"
                    created_at: "2024-01-15T10:30:00Z"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "404":
          $ref: "#/components/responses/NotFound"
        "429":
          $ref: "#/components/responses/RateLimited"

components:
  schemas:
    User:
      type: object
      required: [id, email, name, status, created_at]
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier (UUID v4)
          readOnly: true
        email:
          type: string
          format: email
          description: User's email address (used for login)
        name:
          type: string
          description: Display name
          example: "Alice Johnson"
        status:
          type: string
          enum: [active, inactive, suspended]
          description: |
            Account status:
            - `active` — user can log in and use the API
            - `inactive` — user has not confirmed their email
            - `suspended` — account suspended by an admin
        created_at:
          type: string
          format: date-time
          readOnly: true

  responses:
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    RateLimited:
      description: Rate limit exceeded
      headers:
        Retry-After:
          description: Seconds until the rate limit resets
          schema:
            type: integer

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## Writing Good Endpoint Descriptions

A good endpoint description answers:

1. **What does it do?** — in plain language, not technical jargon
2. **Who can call it?** — required permissions/scopes
3. **What are the limits?** — rate limits specific to this endpoint
4. **What can go wrong?** — common error codes and their meaning

```yaml
# Bad endpoint description:
description: Updates a user.

# Good endpoint description:
description: |
  Updates one or more fields on an existing user profile.
  
  **Partial updates supported:** Only the fields you include in the request body are updated.
  Fields omitted from the request body are not modified.
  
  **Required permissions:** `users:write`
  
  **Rate limits:** 60 updates/minute per API key across all users.
  
  **Note:** Updating `email` triggers a confirmation email. The user's email is 
  not changed until they confirm. During this time, `email_pending` contains 
  the new email address.
  
  **Errors:**
  - `400 invalid_email` — email address format is invalid
  - `409 email_taken` — email address is already in use by another account
  - `422 immutable_field` — you attempted to change `id` or `created_at`
```

---

## Parameter Documentation

```yaml
parameters:
  - name: cursor
    in: query
    required: false
    description: |
      Pagination cursor from the previous page's `next_cursor` field.
      Omit this parameter to start from the first page.
      
      Cursors are opaque strings — do not parse or construct them manually.
      Cursors expire after 24 hours.
    schema:
      type: string
      example: "eyJpZCI6IjEyMyJ9"

  - name: limit
    in: query
    required: false
    description: Maximum number of results to return (1–100, default: 20)
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
```

---

## Interactive API Docs

### Swagger UI

Auto-generated from your OpenAPI spec. Allows users to make real API calls from the browser:

```bash
# Host Swagger UI locally for development
npx swagger-ui-express openapi.yaml

# Or add to Express app:
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.parse(spec)));
```

### Redoc

Cleaner, documentation-focused rendering of OpenAPI specs:

```html
<!-- Embed Redoc in HTML -->
<!DOCTYPE html>
<html>
<body>
  <redoc spec-url='https://api.example.com/openapi.yaml'></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
</body>
</html>
```

### Stoplight Studio

Visual OpenAPI editor with live preview — useful for non-engineer technical writers writing OpenAPI specs.

---

## Code Samples

Always provide code samples in multiple languages. Use real, working examples — not pseudocode:

```python
# Python example — get user
import httpx

client = httpx.Client(base_url="https://api.example.com/v2")
client.headers["Authorization"] = "Bearer YOUR_API_KEY"

response = client.get("/users/550e8400-e29b-41d4-a716-446655440000")
user = response.json()
print(user["name"])  # Alice Johnson
```

```typescript
// TypeScript / Node.js
const response = await fetch('https://api.example.com/v2/users/550e8400-e29b-41d4-a716-446655440000', {
  headers: { Authorization: `Bearer ${process.env.API_KEY}` },
});
const user = await response.json();
console.log(user.name); // Alice Johnson
```

```bash
# cURL
curl https://api.example.com/v2/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Principle:** every API endpoint page should have a working cURL example at minimum. cURL is the universal lowest common denominator — if it works in cURL, it works.

---

## API Changelog

A changelog builds developer trust. Developers need to know when things changed and whether they're breaking:

```markdown
## API Changelog

### 2026-07-01 — v2.3.0

#### Added
- `GET /users/{id}/activity` — new endpoint to retrieve user activity feed
- `include_inactive` query parameter on `GET /users` — now returns inactive users when true

#### Changed
- `POST /webhooks` — `retry_count` field now accepts 0–10 (previously 1–5)
- `GET /orders` — `created_after` parameter now accepts ISO 8601 timestamps with timezone

#### Fixed
- `DELETE /users/{id}` — now returns 204 (was incorrectly returning 200)

---

### 2026-06-01 — v2.2.0 (Breaking change in v2.2)

> **Breaking change:** `status` field on User objects has changed.
> `enabled` → `active`, `disabled` → `inactive`. Update your code before upgrading.

#### Changed
- **BREAKING:** User `status` field values renamed (see above)
- Rate limits are now returned in `X-RateLimit-*` headers on every response

#### Deprecated
- `GET /users/{id}/settings` — use `GET /users/{id}` which now includes `settings` inline
  - Will be removed in v3.0.0 (planned 2027-01-01)
```

---

## API Playground Integration

An in-browser sandbox where users try the API with a test account — removes friction between "reading docs" and "making a first call":

```typescript
// Mintlify API playground config (mintlify.json):
{
  "api": {
    "baseUrl": "https://api.example.com/v2",
    "auth": {
      "method": "bearer",
      "name": "API Key"
    },
    "playground": {
      "mode": "show"  // show playground by default on every endpoint page
    }
  }
}
```

**Good playground features:**
- Pre-filled example parameters (not empty fields)
- Test API key or sandbox environment pre-configured
- Response shown inline with syntax highlighting
- "Copy as cURL" button on every request

---

## Common Pitfalls

- **OpenAPI spec drifts from implementation.** The spec becomes stale as engineers ship changes without updating it. Generate the spec from code annotations (Swagger annotations in Java, FastAPI auto-spec in Python) to keep them in sync.
- **Missing error documentation.** Documenting only the 200 response leaves users confused when they get a 422. Document every possible error code with its cause and fix.
- **Copy-paste code samples that don't work.** Test every code sample in CI. A broken sample is worse than no sample — it destroys trust.
- **Parameter descriptions say what, not what for.** `The user ID` is not a description — `The unique identifier of the user (UUID v4) — found in your account dashboard` is.
- **Versioning strategy undocumented.** Developers need to know: when do you make breaking changes? How much notice? How long is v1 supported after v2 launches?

---

## Review Questions

1. What is `operationId` in an OpenAPI spec, and why is it important beyond just naming?
2. A developer calls your API and gets a 422 error with no documentation. What should your error response body contain, and what should your docs say about 422s?
3. How does auto-generating an OpenAPI spec from code annotations (like FastAPI or Spring Swagger) solve the spec drift problem?
4. You have code samples in Python, Node.js, Go, and Ruby. Your API adds a new `pagination_token` parameter. What's your process for keeping all samples accurate?
5. What are the four things a good API endpoint description must include beyond "what it does"?
