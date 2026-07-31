# Consignment Status Processing (B2C Notification)

## Purpose
This document explains how consignment status events are processed into customer alerts. It covers normalization, business rule evaluation, contact lookup, payload generation, persistence, and dispatch.

---

## Event Sources
- Database staging tables populated by integration layers
- JMS/IBIS inbound queues with status messages
- File feeds loaded into staging tables by ETL processes


## Normalization
- Normalize incoming events to a canonical `ConsignmentStatusEvent` object with fields:
  - `consignmentId`, `statusCode`, `eventTimestamp`, `location`, `additionalInfo`
- Map source-specific codes to internal `statusCode` values via lookup tables


## Processing Steps
1. Read event and normalize into `ConsignmentStatusEvent`
2. Validate event (mandatory fields, acceptable timestamp range)
3. Lookup customer/contact details (email/SMS) using `IbisDataProvider` or DAO
4. Apply alert decision matrix to decide if an alert is required
5. Construct `Alert` object (type, recipient, template, payload)
6. Persist `Alert` to `OUTBOUND_ALERTS` and update event processing status
7. Enqueue alert to IBIS or outbound queue for actual dispatch


## Alert Decision Matrix (example rules)
- If `statusCode` == `DELIVERED` -> no outbound alert
- If `statusCode` == `ATTEMPTED_DELIVERY` -> send SMS if customer opted-in, else email
- If `statusCode` == `EXCEPTION` -> send email to account owner and SMS to mobile if flagged as urgent
- Respect `doNotContact` flags and time-of-day constraints


## Contact Lookup
- Primary source: customer contact table joined by `consignmentId`
- Fallbacks:
  - Account-level contact if consignment-level missing
  - Default contact from `properties` for testing

`IbisDataProvider` role:
- Adapter that encapsulates calls to IBIS or other systems to fetch dynamic customer data
- Provides methods like `getContactByConsignmentId(String id)` and `getPreferences(String accountId)`


## Template Rendering
- Templates located under `resources/templates/alerts/` or referenced via properties
- Use a template engine (Freemarker) to merge `Alert` payloads
- For SMS, keep payload short and include tracking URL; for email, include detailed HTML content


## Persistence & Idempotency
- Before creating a new alert, check `OUTBOUND_ALERTS` for existing sent/queued alerts for same event to avoid duplicates
- Use unique constraints and dedupe during DB insert


## Retry & Failure Handling
- If dispatch fails, increment `RETRY_COUNT` and schedule for retry based on backoff policy
- Move permanently failed alerts to `FAILED_ALERTS` with detailed failure reason


## Example Processor Sequence (ConsignmentStatusAlertAlerter)
1. `process(ConsignmentStatusEvent event)` called by Spring Batch
2. Validate and enrich event
3. `Contact contact = ibisDataProvider.getContactByConsignmentId(event.getConsignmentId())`
4. `if (shouldAlert(event, contact)) { Alert alert = buildAlert(event, contact); persistAlert(alert); enqueueOutbound(alert); }`


## Observability
- Emit metrics: events processed, alerts generated, alerts failed
- Log decision reasons to aid troubleshooting


## References (files scanned)
- `ConsignmentStatusAlertAlerter.java`
- `IbisDataProvider.java`
- `process-alerts-job.xml`

---

Next: create `04-Alert-Generation-Flow.md` describing payload structures and outbound formats for email/SMS.