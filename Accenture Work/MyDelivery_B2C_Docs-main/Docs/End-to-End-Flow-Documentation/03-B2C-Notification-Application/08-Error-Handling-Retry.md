# Error Handling & Retry (B2C Notification)

## Purpose
This document defines error handling and retry strategies for the B2C Notification system, covering transient/ permanent errors, dead-letter handling, and manual reprocessing procedures.

---

## Error Categories
- Transient errors: network timeouts, temporary DB locks, provider rate limiting
- Permanent errors: invalid recipient, malformed payload, permission denied from provider
- System errors: out-of-memory, configuration missing


## Retry Strategies
- Implement retries with exponential backoff for transient errors
- Configure retries at multiple layers:
  - Processor-level retries for transient lookup failures
  - Writer-level retries for DB write contention
  - Outbound send retries for provider timeouts
- Typical policy: initial delay 1 min, factor 2, max attempts 5


## Dead-Letter Handling
- Move permanently failed alerts to `FAILED_ALERTS` with detailed failure reason
- Provide admin UI to inspect and optionally requeue failed alerts after fixes
- Maintain a `FAILED_ALERTS` retention policy and archival process


## Manual Reprocessing
- Admins can reprocess failed alerts via Admin UI or via SQL-based requeue utilities
- Example SQL to find failed alerts:
```sql
SELECT ALERT_ID, CONSIGNMENT_ID, STATUS, RETRY_COUNT, LAST_ERROR
FROM OUTBOUND_ALERTS
WHERE STATUS = 'FAILED'
ORDER BY CREATED_AT DESC;
```
- Requeue command (conceptual):
```sql
UPDATE OUTBOUND_ALERTS SET STATUS='QUEUED', RETRY_COUNT=0 WHERE ALERT_ID = :id;
```


## Monitoring & Alerts
- Alert operations team on repeated failures or high retry rates
- Create dashboards showing failure rates by error type and provider


## Notifications & Escalation
- For business-critical alerts, escalate to on-call engineers if retry threshold reached
- Provide an operations manual describing who to contact for IBIS or provider outages


## Observability & Logging
- Log full stack traces to logs, but mask sensitive data
- Include correlation IDs in logs for tracing


## References
- `process-alerts-job.xml` for skip/retry configuration
- `OUTBOUND_ALERTS` table schema
- Admin UI `Failed Alerts` screen (to be implemented in admin docs)

---

All B2C documentation files created. Next steps: link B2C docs into main README TOC and run a link-check.