# Service Layer Integration (MyDelivery Admin)

## Purpose
This document explains how the MyDelivery Admin UI integrates with backend services: service APIs used by admin views, transaction patterns, async operations, and code references.

---

## How Views Call Services
- Vaadin views are Spring-managed beans (via `AutowiringApplicationServlet`) and receive service beans via `@Autowired`.
- Views call service layer methods directly; service layer performs validation, DB operations, and integration messaging.

Example injection:
```java
@Component
public class DeliveryRequestListView extends VerticalLayout {
  @Autowired
  private DeliveryService deliveryService;
}
```


## Key Admin Service APIs
- `DeliveryService` — read and write operations on delivery requests
  - Admin additions often call the same service methods as user-facing flows but with elevated permissions
- `DepotService` — create/update depot records
- `ConfigService` — manage system parameters
- `ReportService` — generate reports
- `AuditService` — record admin actions


## Transaction & Concurrency Patterns
- Admin operations requiring multiple DB changes must be transactional; annotate service methods with `@Transactional`
- For bulk admin operations (e.g., deactivate many depots), use batch DAO updates and consider offloading to background jobs


## Async & Long-Running Operations
- For operations that trigger external systems (resend to IBIS/JMS), services should register after-commit hooks to publish messages
- For heavy admin tasks (data migrations, bulk imports), use background workers and expose status via `AdminTask` entities


## Error Handling & User Feedback
- Surface domain exceptions to the UI with friendly messages
- Use notifications for asynchronous completion and provide links to logs or job details


## Example Call Sequence (Resend request)
1. Admin clicks `Resend` -> `DeliveryAdminController.resend(requestId)` or view calls `deliveryService.resendDeliveryRequest`
2. Service checks permissions and request state
3. Service updates retry counters and persists `ADMIN_AUDIT`
4. Registers transaction synchronization to send message to JMS on commit
5. Publish message after commit via `DeliveryAsyncMessageSender`


## References & Source Files Scanned
- `MyDeliveryServiceApi` and `MyDeliveryServiceImpl` modules for service interfaces and implementations
- `DeliveryAsyncMessageSender` in `delivery-async-process` module
- Admin presentation view classes under `MyDeliveryAdminPresentation`

---

All Admin documents complete. Next steps: run link-checks or expand any doc with exact class/method mappings on request.