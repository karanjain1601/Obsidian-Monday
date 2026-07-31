# Email & SMS Dispatch (B2C Notification)

## Purpose
This document describes how outbound alerts are delivered to external providers (email and SMS): adapter patterns, provider configuration, rate limiting, delivery receipts, and error handling.

---

## Adapter Pattern
- Use provider-specific adapters implementing a common interface `OutboundDispatcher`:
  - `sendEmail(Alert alert)`
  - `sendSms(Alert alert)`
- Adapter implementations for providers (e.g., SendGrid, SMTP, Twilio, local SMS gateway) are configured via Spring and selected via properties


## Provider Configuration
- `properties/*.properties` contains provider endpoints, credentials, and rate limits
- Support for multiple providers for failover and regional routing


## Rate Limiting & Throttling
- Implement rate limiting per provider (requests per second) to avoid being throttled
- Use token-bucket or leaky-bucket algorithms, or rely on provider SDKs


## Delivery Receipts & Callbacks
- For SMS, providers often offer delivery receipts via callbacks/webhooks; implement an endpoint to receive receipts and update `OUTBOUND_ALERTS` status
- For email, track opens/clicks if provider supports it; update alert status accordingly


## Idempotency & Duplicate Handling
- Use provider message IDs and store them in `OUTBOUND_ALERTS` to dedupe or reconcile delivery receipts


## Retries & Backoff
- On transient errors (HTTP 5xx, network issues), retry with exponential backoff
- On permanent errors (invalid number/email), mark alert as `FAILED` and log reason


## Example Integration (SMTP)
- Use Spring `JavaMailSender` for SMTP
- Build `MimeMessage` from alert payload and send via `mailSender.send(mimeMessage)`

Example (conceptual):
```java
MimeMessage msg = mailSender.createMimeMessage();
MimeMessageHelper helper = new MimeMessageHelper(msg, true);
helper.setTo(alert.getRecipient());
helper.setSubject(alert.getSubject());
helper.setText(alert.getBodyText(), alert.getBodyHtml());
mailSender.send(msg);
```


## Security
- Store provider credentials securely and rotate them periodically
- Whitelist callback URLs for delivery receipts


## Observability
- Emit provider-level metrics (send attempts, successes, failures, latency)
- Monitor rate-limit thresholds and provider status


## References
- `b2c-common-context.xml` for bean wiring
- `properties` for provider configs
- Outbound adapter classes (search for `OutboundDispatcher`, `EmailDispatcher`, `SmsDispatcher` in project)

---

Next: create `07-Batch-Job-Execution.md` and `08-Error-Handling-Retry.md`.