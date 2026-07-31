# External Service Integration

## Purpose
Describe integration patterns with external services (email/SMS providers, address validation APIs, payment gateways) used across MyDelivery and B2C applications.

---

## Common Patterns
- Adapter facade per external provider implementing a common interface
- Spring-managed beans for provider clients and credentials
- Circuit-breaker/timeout configuration on outbound calls
- Retries with exponential backoff for transient failures


## Email/SMS Providers
- Email: SMTP or third-party APIs (e.g., SendGrid)
- SMS: Mobile gateway APIs (HTTP/REST) or SMPP
- Delivery receipts handled via webhooks


## Address & Location Services
- External address/PCA lookups for postcode validation
- Cache recent lookups to limit external calls


## Security & Credentials
- Store credentials in properties or vault; rotate periodically
- Use TLS for all external calls


## Observability
- Track success/failure rates and latency per provider
- Alert on provider outages


## References
- `03-B2C-Notification-Application/06-Email-SMS-Dispatch.md`
- Admin integration docs for address lookup services

---

Next: add `05-Control-M-Jobs.md`.