# Diagrams and Rendering

This file indexes the principal Mermaid diagrams used across the `acv-api-automation` documentation and provides rendering guidance.

Primary diagrams (source files under `diagrams-src/`):

- `ci_flowchart.mmd` — CI pipeline flow
- `system_context.mmd` — System context and dependencies
- `test_sequence.mmd` — Typical test execution sequence

Example: CI flow (embedded for quick reference)

```mermaid
flowchart LR
  Checkout --> Build --> Test --> Report[Generate Reports] --> Upload[Upload Artifacts]
```

Rendering notes
- Install the Mermaid CLI: `npm i -D @mermaid-js/mermaid-cli`
- Render: `npx @mermaid-js/mermaid-cli -i <src>.mmd -o <out>.svg`

Keep diagrams focused and split large diagrams into sub-diagrams when nodes exceed ~15.

Last Updated: 2026-04-02
# Consolidated Mermaid Diagrams

Below are the primary diagrams used across the HLD/LLD/architecture documents. Paste into a Mermaid-enabled viewer if they do not render inline.

## System Overview

```mermaid
graph LR
  subgraph Automation
    A[Test Runner] --> B[Framework Lib]
    A --> C[Report Generator]
    B --> D[HTTP Clients]
    B --> E[Auth & Config]
  end
  C --> F[Report Storage]
  A --> G[Artifact DB]
  H[CI: Jenkins/GitHub Actions] --> A
  I[ACV Services] -->|REST / SOAP| D
```

## Test Execution Sequence

```mermaid
sequenceDiagram
  participant CI
  participant Runner
  participant Framework
  participant ACV
  CI->>Runner: start test job
  Runner->>Framework: load config, auth
  Runner->>Framework: execute suites (parallel)
  Framework->>ACV: call API
  ACV-->>Framework: response
  Framework->>Runner: record result
  Runner->>Report: generate artifacts
  Runner-->>CI: publish artifacts
```

## ER Diagram (Database)

```mermaid
erDiagram
  TEST_RUN ||--o{ TEST_CASE : contains
  TEST_CASE ||--o{ TEST_STEP : contains
```
