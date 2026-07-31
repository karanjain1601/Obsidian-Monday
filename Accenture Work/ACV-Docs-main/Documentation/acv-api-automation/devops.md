# DevOps Guide — Deployment & CI (detailed)

## Purpose

Provide clear instructions for running the automation pipeline, storing artifacts, and integrating with platform infra.

## CI pipeline (actual)

A canonical pipeline exists at `.github/workflows/maven.yml`. It performs:

1. Checkout source
2. Set up JDK 11 (Temurin)
3. `mvn install -DskipTests` to build
4. `mvn test` to execute Cucumber suites

Excerpt (see file): `.github/workflows/maven.yml` — the job runs on `ubuntu-latest` and uses `actions/setup-java@v3`.

## Uploading artifacts

- Use `actions/upload-artifact` to upload `Reports/`, `HtmlReport/` and `logging.txt`.
- For long-term storage, integrate step to push artifacts to S3 or Azure Blob using secure credentials stored in GitHub Secrets.

## Environment variables and secrets

- `BASE_URL` or `ACV_API_BASE_URL` — base URL for the targeted environment (override `global.properties` in CI)
- `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET` — credentials for token exchange (store in Secrets)
- `REPORT_STORE_URL` — optional external artifact location

## Running in containers

Recommended: create an ephemeral test image used by CI that contains JDK and Maven. Example Dockerfile:

```dockerfile
FROM eclipse-temurin:11-jre
WORKDIR /app
COPY . /app
RUN mvn -q -DskipTests install
CMD ["mvn", "test"]
```

CI can run the container in a self-hosted runner or use GitHub Actions to build and run it.

## Infrastructure references

- Terraform and infra lives in the sibling folder `eai-3540813-infra` in this workspace. See `main.tf`, `backend.tf` and modules for cloud resource definitions.
- For deployments of any services used by tests (e.g., test harness or mock services), prefer deploying into an isolated test subscription and avoid production resources.

## Failure handling and alerts

- CI should upload full logs and a short summary. Use `exit 1` on critical failures to fail the job.
- Integrate notifications (Slack/email) in the pipeline to alert platform owners on repeated failures.

## Recommendations
- Never commit secrets to the repo; use GitHub Secrets and read them at runtime.
- Tag test images and clear old artifacts using lifecycle policies.
