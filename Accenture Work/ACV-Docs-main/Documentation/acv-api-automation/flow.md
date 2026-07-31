# Application Logic Flow

Purpose: Describe the orchestration of a single automated scenario from feature execution through HTTP call, response processing, assertions, and reporting.

## Overview Flow

```mermaid
flowchart TD
  A["Start: Cucumber Scenario"] --> B["Load Fixture &amp; Test Data"]
  B --> C["Build RequestSpecification (Utils)"]
  C --> D{"Need Auth?"}
  D -->|Yes| E["Utils.token() — attach Authorization"]
  D -->|No| F["Continue"]
  E --> F
  F --> G["Execute HTTP call via RestAssured"]
  G --> H{"HTTP Status"}
  H -->|2xx| I["Deserialize to POJO"]
  H -->|401| J["Refresh token and retry (once)"]
  H -->|429 / 5xx| K["Retry with backoff (max 3)"]
  H -->|4xx other| L["Fail step; capture response"]
  I --> M["Run assertions in Step Definition"]
  M --> N{"Assertions pass?"}
  N -->|Yes| O["Attach evidence to report"]
  N -->|No| P["Mark failure, attach logs and response snapshot"]
  O --> Q["Scenario complete"]
  P --> Q
  Q --> R["Runner aggregates results — ExtentReports + logging.txt"]
```

## Sequence Diagram (detailed)

```mermaid
sequenceDiagram
  participant Feature
  participant StepDef
  participant Utils
  participant Okta
  participant ACV
  participant Reporter

  Feature->>StepDef: start scenario
  StepDef->>Utils: load fixture, config
  StepDef->>Utils: build RequestSpecification(baseUrl)
  alt needs auth
    Utils->>Okta: request token (client credentials)
    Okta-->>Utils: access_token
    Utils-->>StepDef: spec with Authorization
  end
  StepDef->>ACV: execute HTTP request
  ACV-->>StepDef: response (2xx / 4xx / 5xx)
  alt 2xx
    StepDef->>POJO: deserialize
    StepDef->>StepDef: validate assertions
    StepDef->>Reporter: attach success evidence
  else 401
    StepDef->>Utils: refresh token
    StepDef->>ACV: retry request
  else 5xx/429
    StepDef->>Utils: retry with backoff
  else failure
    StepDef->>Reporter: attach failure evidence
  end
  StepDef->>Reporter: mark step result
```

## Decision Points & Error Paths

- Auth failure: attempt token refresh once; if still 401, fail the scenario and attach token exchange logs.
- Rate limiting / server errors: retry with exponential backoff (recommend 3 attempts, e.g., 1s, 2s, 4s).
- Assertion failures: capture response body, request payload, and full headers to `logging.txt` and include in ExtentReports.

## Observability & Artifacts

- `logging.txt`: raw request/response traces (full HTTP exchange)
- ExtentReports HTML/PDF: human-readable result summary and attached evidence
- CI artifacts: zipped `Reports/` and `logging.txt` for post-failure triage

## Implementation Notes

- Keep `Utils.requestSpecification()` idempotent and thread-safe (avoid static mutable state).
- Parameterize retry counts and timeouts via `global.properties` and/or CI environment variables.
- Provide a test-mode for `OktaToken` to return a stubbed token when running against isolated test environments.

Last Updated: 2026-04-02
