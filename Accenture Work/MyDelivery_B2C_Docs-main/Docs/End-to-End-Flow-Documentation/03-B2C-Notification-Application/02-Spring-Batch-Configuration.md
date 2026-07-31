# Spring Batch Configuration (B2C Notification)

## Purpose
This document provides a deep dive into Spring Batch job definitions used by the B2C Notification application. It explains job/step configurations, readers/writers/processors, chunk sizes, transaction handling, restartability, listeners, and configuration properties.

---

## Key Job Files
- `process-alerts-job.xml` — main job definition
- `process-consignment-statuses-job.xml` — alternate/related job definitions
- Shell scripts: `process-alerts.sh`, `process-constatuses.sh` — job launchers
- `b2c-common-context.xml` — provides shared beans used by batch jobs (datasource, transaction manager, taskExecutor)


## Job Structure (Typical)
- Job: `processAlertsJob`
  - Step 1: `readStatusEvents` — ItemReader reads staged consignment status rows (JdbcCursorItemReader or CompositeItemReader)
  - Step 2: `processAlerts` — ItemProcessor (ConsignmentStatusAlertAlerter) transforms events into Alert objects
  - Step 3: `writeOutbound` — ItemWriter persists alerts to `OUTBOUND_ALERTS` and optionally sends to IBIS/JMS
  - Step 4: `postProcess` — optional cleanup and metrics update


## Readers
- Common reader types:
  - `JdbcCursorItemReader` — reads from staging tables using a SQL query
  - `JmsItemReader` or custom JMS reader — reads messages from inbound queues if configured
  - `CompositeItemReader` — when consumers need to combine DB reads with lookups
- Reader configurations:
  - `fetchSize` to control DB roundtrips
  - `rowMapper` to map rows to domain objects


## Processors
- `ConsignmentStatusAlertAlerter` acts as the main processor: determines whether to create an alert for a given status update.
- Processor responsibilities:
  - Validate event data
  - Lookup customer contact details (via `IbisDataProvider` or DAO)
  - Apply business rules determining alert eligibility
  - Build `Alert` DTO with payload (email/SMS templates populated)


## Writers
- Writers persist generated alerts and optionally publish to IBIS/JMS
- Two writer patterns observed:
  - Combined writer: write to `OUTBOUND_ALERTS` table and enqueue message to IBIS in same step
  - Decoupled: write to DB and let another dispatcher pick up outbound records for dispatch
- Use `JdbcBatchItemWriter` for efficient bulk writes


## Chunking & Transaction Management
- Use `chunk` processing with commit-interval tuned via properties (e.g., 100–1000)
- Each chunk executes within a transaction; ensure external sends to IBIS occur after DB commit or within a transactional outbox pattern
- For consistency, prefer writing outbound to DB first, then enqueue in a separate transactional step or use transaction synchronization


## Restartability & Idempotency
- Jobs must be restartable: mark readers/writers as `saveState=true` where supported
- Processors should be idempotent: check outbound DB for existing alert for the same event to avoid duplicates
- Use unique constraints or dedupe logic based on `CONSIGNMENT_ID` + `EVENT_TIMESTAMP` + `ALERT_TYPE`


## Listeners & Monitoring
- `JobExecutionListener` for job start/end logging and metrics
- `StepExecutionListener` for step-level metrics
- `SkipListener` for skipped records and error handling


## Error Handling Strategies
- Use `skip` and `retry` policies for transient errors (e.g., network timeouts when looking up external data)
- For permanent errors on a record, write to a `FAILED_EVENTS` table and continue
- Set `maxAttempts` and retryable exception classes in retry policy


## Properties & Tuning
- `batch.chunk.size` — commit interval
- `reader.fetch.size` — DB fetch size
- `retry.max.attempts` — retry limit
- `outbound.queue.name` — IBIS queue destination


## Example Snippet (conceptual XML)
```xml
<batch:job id="processAlertsJob">
  <batch:step id="processAlertsStep">
    <batch:tasklet>
      <batch:chunk reader="statusReader" processor="alerterProcessor" writer="outboundWriter" commit-interval="${batch.chunk.size}"/>
    </batch:tasklet>
  </batch:step>
</batch:job>
```


## References (files scanned)
- `process-alerts-job.xml` — job definition
- `b2c-common-context.xml` — shared beans
- `ConsignmentStatusAlertAlerter.java` — processor logic
- `IbisDataProvider.java` — IBIS interaction helper
- `properties/` files for tuning values

---

Next: expand `03-Consignment-Status-Processing.md` to explain the processor logic and alert decision matrix.