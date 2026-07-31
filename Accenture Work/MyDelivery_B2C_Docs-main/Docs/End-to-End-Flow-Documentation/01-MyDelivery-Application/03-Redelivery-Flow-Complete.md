# Redelivery Flow — Complete (MyDelivery)

## Purpose
This document describes the complete user and system flow for the Redelivery feature in MyDelivery, covering presentation layer, flow state management, service layer, DAO interactions, asynchronous messaging, database changes, and operational troubleshooting. It intentionally omits code snippets and diagrams and focuses on detailed textual sequences and references.

---

## Entry Point & HTTP Endpoints
- Users access the Redelivery feature via the landing page or a direct URL that maps to a WebFlow flow (e.g., `/redelivery`).
- The initial request is handled by the WebFlow handler which locates the `redelivery` flow definition and starts a flow execution.


## Flow Start & Form Preparation
1. Flow `start-state` initializes flow-scoped variables including a form backing object containing fields such as `consignmentId`, `address`, `preferredDate`, and `deliveryOptions`.
2. An `on-entry` action calls an action bean that populates initial options and lookup data (e.g., available depots, service options) by calling the appropriate service methods.
3. The view-state renders the enter details page with localized labels and help texts pulled from message bundles.


## Address Selection Subflow
- The flow may call a `subflow-state` to provide address searching and selection. The subflow performs postcode lookups and suggestion lists using the `LocationService`.
- Once a user selects an address, the chosen address object is returned into the parent flow scope and the main form is updated.


## Validation & Confirmation
1. User submits the form; the flow invokes an `action-state` that calls validation routines in an action bean.
2. The service layer checks business rules (e.g., request within allowed window, address deliverability). If validation fails, the flow transitions back to the input view-state and displays field-specific errors.
3. On validation success, the flow transitions to a confirmation view-state that displays a summary and estimated costs or options.


## Save / Persist Operation
1. When the user confirms, the flow calls a service method to create a `DELIVERY_REQUEST` record and associated `DELIVERY_ADDRESS` record using DAO operations.
2. The service method is transactional. Within the transaction, DAOs perform insert/update queries and return generated keys where needed.
3. The service registers a post-commit action to publish an asynchronous message for downstream processing (e.g., notify fulfillment or tracking systems) rather than sending during the transaction.
4. After commit, the asynchronous sender publishes a message to a JMS queue which will be processed by MDB consumers.


## Messaging & Async Processing
- Outbound asynchronous messages use an `AsyncMessageWrapper` envelope indicating the selector and payload.
- The message is serialized and sent as a TextMessage to a configured queue. A separate Message-Driven Bean consumes the message and performs actions such as calling external systems or updating tracking records.


## Post-Processing & User Feedback
- Once persistence and message enqueueing are complete, the flow transitions to an `end-state` showing a confirmation page with a reference number and expected next steps.
- The system logs an audit entry recording the user, action, and timestamps in an admin/audit table for traceability.


## Error Handling Scenarios
- Validation Errors: surfaced to the user with field messages and retained values in the flow scope for correction.
- Transaction Failures: service method throws runtime exception, transaction rolled back, flow transitions to an error state that instructs the user to retry or contact support.
- Message Send Failures: if the send fails after commit, the system logs and records a failure entry in an outbound log for manual retry; if JMS participates in XA, failures may roll back the entire transaction depending on configuration.


## Concurrency & Idempotency
- Idempotency is enforced by unique constraints (e.g., `CONSIGNMENT_ID` + request timestamp) and by the async consumer checking for already-processed records.
- For concurrent updates, the DAO layer uses optimistic locking or select-for-update where necessary to prevent lost updates.


## Audit & Monitoring
- Business operations team can monitor queue depth, job execution logs, and recent DB inserts for the `DELIVERY_REQUEST` table.
- Use correlation IDs logged with each operation to trace a request across presentation, service, DB, and JMS components.


## Operational Troubleshooting Checklist
- If a user reports that a redelivery was not processed:
  - Confirm a `DELIVERY_REQUEST` record exists for the consignment ID and timestamp.
  - Check outbound queue for messages referencing the request ID and verify send status.
  - Inspect MDB logs for processing errors or DLQ entries.
  - Look for database deadlocks or transaction rollbacks during the reported timeframe.


## Next Steps
- Add method-level call sequences mapping exact action bean methods to service and DAO methods.
- Add quick-reference tables mapping flow states to view names and JSP templates.
- Optionally, include example SQL queries for the DAO operations on request creation and history retrieval.

---

## Detailed method-level call traces (presentation → service → DAO → JMS)
This subsection provides the concrete call sequence and file references you can use to trace a single redelivery request from the WebFlow submission through persistence and async message publication.

1. Presentation / WebFlow action
   - `DeliveryRequestFormAction.submit(RequestContext)`
     - File: MyDelivery component
       `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery-domain-enquiry\delivery-domain-enquiry-web\src\main\java\com\tnt\express\domain\delivery\action\DeliveryRequestFormAction.java`
     - Behaviour (excerpt): constructs a domain `DefaultDeliveryRequest`, copies form data and calls the service

     ```java
     DefaultDeliveryRequest request = (DefaultDeliveryRequest) service.createDeliveryRequest(requestVO.getConsignmentId());
     CopyDefaultDeliveryRequest.copy(requestVO, request);
     service.submitDeliveryRequest(request);
     ```

2. Service layer
   - `DefaultRedeliveryRequest.confirm()` (flow/integration class orchestrating confirmation)
     - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery\MyDeliveryServiceImpl\src\main\java\com\tnt\express\warp\mydelivery\service\integration\DefaultRedeliveryRequest.java`
     - Behaviour (excerpt): prepares consignment parameters then calls the delivery request service

     ```java
     if (this.isValid()) {
         final DeliveryRequest result = deliveryRequestService.submitDeliveryRequest(deliveryRequest);
     }
     ```

   - `DefaultDeliveryRequestService.submitDeliveryRequest(DeliveryRequest)`
     - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\service-impl\src\main\java\com\tnt\express\domain\delivery\service\impl\DefaultDeliveryRequestService.java`
     - Behaviour (excerpt): validates, optionally deletes existing request and calls repository.persist(...)

     ```java
     DeliveryRequest existingDeliveryRequest = repository.findByConsignmentId(deliveryRequest.getConsignmentId());
     if (existingDeliveryRequest != null) {
         repository.delete(existingDeliveryRequest); // soft-delete
     }
     result = repository.persist(deliveryRequest);
     ```

3. Repository / Persistence
   - `DefaultDeliveryRepository.persist(DeliveryRequest)`
     - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\repository\impl\DefaultDeliveryRepository.java`
     - Behaviour (excerpt): performs EntityManager.persist() for new entities or merge() for updates, followed by flush(). The `DeliveryRequest` entity is annotated with cascade ALL for its `deliveryAddress`, so address rows are written transparently.

     ```java
     if (deliveryRequest.getId() == null) {
         getEntityManager().persist(deliveryRequest);
     } else {
         result = getEntityManager().merge(deliveryRequest);
     }
     getEntityManager().flush();
     ```

4. Async outbound messaging (post-commit)
   - `DeliveryAsyncMessageSender.createAndPutMessage(...)` / `createAndSend` (sender that formats and enqueues JMS TextMessage)
     - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\delivery-async-process\src\main\java\com\tnt\express\domain\delivery\async\DeliveryAsyncMessageSender.java`
     - Behaviour (excerpt): builds an AsyncMessageWrapper and sends to configured queue (typically executed after commit)

     ```java
     AsyncMessageWrapper wrapper = new AsyncMessageWrapper(selector, payload);
     // create TextMessage and send to queue
     destinationProducer.send(textMessage);
     ```

   - MDB consumer: `DeliveryAsyncMessageProcessorMDB.onMessage(Message)`
     - File: `...delivery-async-process...\DeliveryAsyncMessageProcessorMDB.java`
     - Behaviour: receives the JMS message and processes payload (calls downstream systems or services). DLQ handling is configured by the JMS provider/activation-config.

---

## Operational SQL & quick checks
Use these queries to locate the request and related address in the database. Replace placeholders (e.g. :consignmentId or :deliveryRequestPk) as needed.

- Find latest delivery requests for a consignment:

```sql
SELECT *
FROM DELIVERY_REQUEST
WHERE CONSIGNMENT_ID = :consignmentId
ORDER BY OPENED_TD DESC;
```

- Inspect the delivery address referenced by a delivery request:

```sql
SELECT a.*
FROM DELIVERY_ADDRESS a
JOIN DELIVERY_REQUEST r ON r.DELIVERY_ADDRESS_PK = a.DELIVERY_ADDRESS_PK
WHERE r.DELIVERY_REQUEST_PK = :deliveryRequestPk;
```

- Check for logically deleted requests (soft-delete flag stored on base entity):

```sql
SELECT DELIVERY_REQUEST_PK, CONSIGNMENT_ID, STATUS, OPENED_TD, CLOSED_TD, DELETED
FROM DELIVERY_REQUEST
WHERE CONSIGNMENT_ID = :consignmentId;
```

- Find recent outbound async messages tracked in outbound log (if present)

```sql
SELECT * FROM OUTBOUND_MESSAGE_LOG WHERE PAYLOAD LIKE '%:deliveryRequestPk%' ORDER BY CREATED_TD DESC;
```

---

## DLQ / Republish runbook (concise)
1. Identify the failed message
   - Use the JMS broker admin console (or `jmsctl`/operator tools) to list messages on the DLQ for the delivery queue.
   - Capture message headers and the TextMessage payload (AsyncMessageWrapper contents: selector + payload).
2. Correlate to DB record
   - Parse payload for the deliveryRequest id or consignment id and verify the corresponding `DELIVERY_REQUEST` record exists and is not already processed.
   - Run the SQL checks above.
3. Decide republish approach
   - If the message payload is valid and external system is now available, republish the same TextMessage to the original queue using the broker console or a small republish script.
   - If required, update any outbound log status row (if present) to reflect republish attempt.
4. If redelivery requires database repair
   - If the DB row is missing or corrupted, create a new `DELIVERY_REQUEST`/`DELIVERY_ADDRESS` using a controlled SQL insert OR re-run the service call in a staging environment. Avoid manual inserts in production unless instructed by DBAs and with appropriate audit.
5. Monitor
   - Confirm the message leaves the queue and the MDB processes it successfully (check MDB logs and downstream system responses). If errors persist, capture stack traces and payload and escalate to the integration team.

Notes:
- Where possible prefer republishing via the application/service layer (a small admin tool that calls `deliveryRequestService.submitDeliveryRequest(...)`) to ensure consistent persistence and auditing. Only use raw message republish when the exact conditions of the original execution are known and validated.

---

## Control‑M / Batch jobs related to redelivery (quick references)
- B2C Notification and other scheduled jobs that may act on delivery requests are defined in the `B2C-Notification` project and other modules. Typical job artifacts:
  - `process-alerts-job.xml` and `process-alerts.sh` (B2C Notification service) — path: `c:\Users\6687869\Applications\B2C\eai-3533704-business-to-consumer\B2C-Notification\B2C-NotificationService\`
- Operational checks:
  - Check Control‑M job status via the Control‑M GUI or CLI for relevant job names (e.g., ProcessAlerts, ProcessConsignmentStatuses).
  - Inspect job logs (stdout/stderr) produced by the shell wrappers in the `B2C-NotificationService/target` or log paths defined by your runtime.

---

## Where to add tests
- Add unit tests for `DeliveryRequestFormAction` and `DefaultRedeliveryRequest` to assert the submission and confirm flows produce the expected calls to `deliveryRequestService` and that validation errors populate the flow `MessageContext`.
- Add integration tests that mock JMS and verify the post-commit sender enqueues the expected AsyncMessageWrapper payload.

---

References & Source Files Scanned:
- `MyDeliveryPresentation/src/main/webapp/WEB-INF/flows/redelivery-flow.xml`
- `delivery-async-process/src/main/java/.../DeliveryAsyncMessageSender.java`
- `delivery-async-process/src/main/java/.../DeliveryAsyncMessageProcessorMDB.java`
- DAO files and service implementations under `eai-3532120-mydelivery-components` modules
