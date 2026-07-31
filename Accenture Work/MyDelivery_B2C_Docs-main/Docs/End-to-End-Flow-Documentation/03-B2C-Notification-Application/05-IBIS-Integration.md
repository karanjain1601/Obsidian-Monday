# IBIS Integration (B2C Notification)

## Purpose
This document details how the B2C Notification application integrates with IBIS messaging infrastructure. It covers connection methods, message formats, queue naming conventions, adapter classes, and error/retry strategies.

---

## Integration Points
- Outbound alerts are sent to IBIS queues for downstream delivery through enterprise integration bus
- IBIS queue names and connection details are configured in `properties/` and `b2c-common-context.xml`


## Adapter Classes
- `IbisDataProvider` encapsulates logic for creating IBIS messages and sending them via the IBIS API or JMS template
  - Methods found: `createIbisMessage(Alert alert)`, `sendToIbisQueue(String queueName, Object message)`
  - It may rely on an `IbisConnectionFactory` or a company-specific IBIS client API


## Message Format
- IBIS messages follow the agreed XML schema for the enterprise bus
- Messages contain headers with routing metadata and a body containing the alert payload (often base64 or CDATA)
- Ensure proper encoding and escaping to avoid IBIS parsing errors

Example (conceptual):
```xml
<ibisMessage>
  <header>
    <type>ALERT</type>
    <source>B2C_NOTIFICATION</source>
    <priority>5</priority>
  </header>
  <body>
    <alertId>123</alertId>
    <recipient>+441234567890</recipient>
    <payload>...</payload>
  </body>
</ibisMessage>
```


## Queue Naming & Conventions
- Outbound queues typically named `IBIS.OUT.<system>.<purpose>` or use site-specific names defined in properties such as `IBIS_ALERT_OUT_QUEUE`
- Example observed in IBIS analysis: `CON2.CONX1` style endpoints (B2C used IBIS API CON2.CONX1)


## Transactional Considerations
- If IBIS supports XA, messages can be sent within the same transaction as DB updates. If not, prefer the outbox pattern:
  - Persist outbound alert record
  - After commit, send IBIS message
  - Mark record as sent


## Retry & Dead Letter Handling
- On transient failure, `IbisDataProvider` retries send according to configured retry policy
- On permanent failure, write to `OUTBOUND_ALERTS` with status `FAILED` and record error in `ALERT_AUDIT`
- Consider using IBIS dead-letter queues for manual inspection


## Monitoring
- Monitor IBIS queue depth, send success/failure rates, and latency
- Log message IDs and correlation IDs for tracing across systems


## Security
- Ensure IBIS credentials are stored securely in properties with restricted file permissions
- Sign or encrypt message payloads if required by downstream systems


## References
- `IBIS_Queue_Usage_Analysis.md` in Docs for broader IBIS usage patterns
- `b2c-common-context.xml` and `properties/*.properties` for queue names and connection settings
- `ConsignmentStatusAlertAlerter.java` and `IbisDataProvider.java` for implementation details

---

Next: add `06-Email-SMS-Dispatch.md` describing external provider integration and adapter patterns.