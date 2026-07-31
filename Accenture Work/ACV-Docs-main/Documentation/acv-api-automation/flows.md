# Flows and Sequences (detailed)

## Test Execution Flow (CI)

The main CI flow is implemented in `.github/workflows/maven.yml`. A canonical flow:

```mermaid
flowchart TD
  A["CI Trigger (push / pr to master)"] --> B["Checkout"]
  B --> C["Set up JDK 11"]
  C --> D["Build (mvn install -DskipTests)"]
  D --> E["Run tests (mvn test)"]
  E --> F["Collect reports"]
  F --> G["Upload artifacts"]
```

Failure handling:
- Steps should `exit 1` on critical failures so CI marks the job failed.
- Upload raw `logging.txt` and partial reports on failure to aid triage.

## API Call Sequence (single test case)

```mermaid
sequenceDiagram
  participant Test as Feature
  participant StepDef
  participant Utils
  participant ACV

  Test->>StepDef: execute step
  StepDef->>Utils: load fixture + prepare request
  Utils->>ACV: HTTP request (logs to file)
  ACV-->>Utils: HTTP response
  Utils-->>StepDef: deserialized object
  StepDef->>Test: assert + attach evidence
```

## CI partitioning & parallelism
- Use job matrices to run across environment permutations (if required).
- For faster runs, split feature files into groups and run in parallel jobs. Use unique artifact directories per job.

## Notifications and post-processing
- On failure, create a short summary file (`failure-summary.txt`) and upload as an artifact.
- Optionally, a CI job can call a webhook to open a ticket or notify Slack with the artifact link.
