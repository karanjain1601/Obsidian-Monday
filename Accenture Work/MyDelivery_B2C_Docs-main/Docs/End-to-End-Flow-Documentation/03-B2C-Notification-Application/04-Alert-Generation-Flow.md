# Alert Generation Flow (B2C Notification)

## Purpose
This document specifies how alert payloads are generated for email and SMS, the outbound message structure, IBIS message formats, and persistence/audit considerations.

---

## Alert Data Model
- `Alert` fields:
  - `alertId`, `consignmentId`, `alertType` (EMAIL/SMS), `recipient`, `payload`, `templateId`, `status` (QUEUED/SENT/FAILED), `retryCount`, `createdAt`, `sentAt`

## Template Mapping
- Templates are stored with IDs and localized variants. Template engine (Freemarker) binds event data to keys used by templates.
- Template selection rules:
  - Choose template based on `alertType`, `statusCode`, and `customerLocale`
  - Use fallback to default template if locale missing


## Email Payload Example
- MIME: HTML body + plain-text fallback
- Include tracking links with secure tokens to identify the consignment
- Headers: Subject derived from template variables, From configured in properties, Reply-To configured per account

Example JSON representation stored in `OUTBOUND_ALERTS.PAYLOAD`:
```json
{
  "subject": "Delivery Attempted for Consignment 12345",
  "bodyHtml": "<p>Dear John, ...</p>",
  "bodyText": "Dear John, ...",
  "attachments": []
}
```


## SMS Payload Example
- Plain text limited to supported length (e.g., 160 chars)
- Include short tracking URL

Example:
"Your delivery for consignment 12345 had an attempted delivery at 14:23. Reschedule: http://tnt/rd/abc123"


## IBIS Message Format
- IBIS messages are XML or structured text blocks per the integration contract. Typical structure:
```xml
<message>
  <header>
    <messageId>...</messageId>
    <destination>NOTIF.OUT</destination>
  </header>
  <body>
    <alertType>EMAIL</alertType>
    <payload>...base64 or CDATA...</payload>
    <recipient>...</recipient>
  </body>
</message>
```
- `IbisDataProvider` prepares the message payload and calls the IBIS API or JMS template to send


## Persistence & Outbound Flow
- Persist alert record with status `QUEUED`
- Enqueue to IBIS/JMS with reference `alertId`
- On send success, update `status= SENT`, set `sentAt`
- On failure, increment `retryCount` and set `status=FAILED` if `retryCount` exceeds limit


## Retry Policies
- Exponential backoff: initial delay 1 min, multiplier 2, max attempts 5
- For permanent errors (invalid recipient), mark as `FAILED` immediately


## Audit Trail
- All state changes recorded in `ALERT_AUDIT` table with `alertId`, `oldStatus`, `newStatus`, `reason`, `changedBy`, `timestamp`


## Observability
- Emit per-alert logs with `alertId` and `consignmentId`
- Track queue depth of outbound IBIS queue and outbound DB rows awaiting dispatch


## Security
- Mask PII in logs; do not write full payloads to debug logs in production
- Store sensitive tokens in encrypted columns or secure vault


## References (files scanned)
- `process-alerts-job.xml`
- `ConsignmentStatusAlertAlerter.java`
- `IbisDataProvider.java`

---

Next: detail IBIS integration in `05-IBIS-Integration.md`.