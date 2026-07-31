## ACV API Automation — Documentation

Purpose: Document design, implementation, deployment, and operational runbooks for the
`eai-3540813-acv-api-automation` project (Cucumber + RestAssured based test automation).

Contents (key docs):
- [HLD.md](HLD.md) — High-level architecture, business context, integrations
- [LLD.md](LLD.md) — Code-level design, classes, sequence diagrams
- [architecture.md](architecture.md) — Deployment topology, infra, Helm/Terraform notes
- [database.md](database.md) — DB design, migration strategy, ER diagrams
- [services.md](services.md) — API contracts, auth, endpoints inventory
- [flows.md](flows.md) — Business flows, data flows, CI/CD pipelines
- [code-mapping.md](code-mapping.md) — Package & class inventory, dependency graphs
- [devops.md](devops.md) — CI/CD, monitoring, runbooks, rollback
- [diagrams.md](diagrams.md) — Consolidated Mermaid diagrams and rendering notes
- [glossary.md](glossary.md) — Terms & acronyms

Quick start

1. Build & run tests locally:

```bash
cd eai-3540813-acv-api-automation
./mvnw test -Denv=local
```

2. Run a specific Cucumber feature:

```bash
./mvnw -Dtest=TestRunner -Dcucumber.filter.tags="@smoke" test
```

3. Generate diagram images (requires Mermaid CLI):

```bash
npx @mermaid-js/mermaid-cli -i Documentation/acv-api-automation/diagrams-src/ci_flowchart.mmd -o Documentation/acv-api-automation/images/ci_flowchart.svg
```

Repository pointers
- Test features: [eai-3540813-acv-api-automation/src/test/java/com/acv/service/features/](eai-3540813-acv-api-automation/src/test/java/com/acv/service/features/)
- Framework utilities: [eai-3540813-acv-api-automation/src/test/java/com/acv/service/resources/](eai-3540813-acv-api-automation/src/test/java/com/acv/service/resources/)

Last updated: 2026-04-02

