# Developer Guide — Understanding Code Logic (detailed)

This guide explains how code is organized, how tests are executed, how to run and debug locally, and where to make changes for common tasks.

## Repo quick map (important paths)
- Test features: `src/test/java/com/acv/service/features/` (Gherkin `.feature`)
- Step definitions: `src/test/java/com/acv/service/stepDefintions/` (Java implementations)
- Shared resources: `src/test/java/com/acv/service/resources/` (`Utils.java`, `Config.java`, `APIResources.java`)
- Test data fixtures: `Resource/TestData/SIT/` (JSON payload examples)
- Build: `pom.xml` at repository root
- CI: `.github/workflows/maven.yml`

## How to run tests locally (Maven)

1. From repository root, run:

```powershell
mvn -DskipTests=false test
```

2. To run a specific profile or tag (example using Cucumber options):

```powershell
mvn -Dcucumber.options="--tags @smoke" test
```

3. After a run, reports are available in `Reports/` and `HtmlReport/`.

## Debugging flow
- Reproduce failure by running the failing feature locally with the same `global.properties`.
- Check `logging.txt` (request/response) created by `Utils.requestSpecification` filters.
- Add additional logger statements in the step definition class (e.g., `RequestOtp.java`).

## Common development tasks
- Add a new scenario: add a `.feature` under `features/`, implement step definitions under `stepDefintions/`, and add fixture JSON in `Resource/TestData`.
- Update an endpoint: change mapping in `APIResources.java` and adjust step implementations to use new URI.
- Change environment settings: edit `global.properties` or pass CI secrets for base URLs and credentials.

## Sample: add a new test that calls `RequestOTP`

1. Create `src/test/java/com/acv/service/features/NewRequestOtp.feature` with Gherkin scenario.
2. Implement steps in `src/test/java/com/acv/service/stepDefintions/NewRequestOtpSteps.java` — use `Utils.requestSpecification(Config.getConfigs().getPropertyValue("baseUrl"))` and `APIResources.RequestOTP.getResource()` to build the call.
3. Place JSON payload under `Resource/TestData/SIT/RequestOTP/RequestOTPValid.json` and load it using `new File("Resource/TestData/SIT/RequestOTP/RequestOTPValid.json")` (examples in `Utils`).

## Where to change behavior
- Timeouts/logging: `Utils.requestSpecification()` sets content type and logging filters.
- Token logic: `Utils.token()` currently contains environment-specific behavior — implement real token exchange in `OktaToken.java` and call from step defs.

## Tests patterns and best practices
- Keep fixtures small and explicit; include both positive and negative variants.
- Use POJOs under `src/main/java/com/acv/service/pojo/` to validate response schema via deserialization.
- Keep step definitions focused: orchestrate calls and assertions; move heavy logic into utilities under `resources/`.

