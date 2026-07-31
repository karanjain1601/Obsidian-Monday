# Service Layer Details (MyDelivery)

## Purpose
This document describes the MyDelivery service layer: package layout, key classes, responsibilities, transaction boundaries, integration points (DB, JMS, IBIS, external services), error handling patterns, and example call sequences used by the presentation layer (WebFlow/DWR/Vaadin).

---

## Package Layout & Conventions
- Typical package roots:
  - `com.tnt.express.domain.delivery.service` (Delivery-related services)
  - `com.tnt.express.domain.location.service` (Location/address lookup)
  - `com.tnt.express.common.*` (common utilities)
- Services are defined as Spring beans (singleton scope) and injected into controllers/action beans.
- Naming convention: `*Service` (interface) and `*ServiceImpl` (implementation).


## Key Service Responsibilities
- Coordinate business operations across DAOs and external integrations.
- Manage transactions (typically with Spring `@Transactional`).
- Validate and enrich domain objects used by the presentation layer.
- Publish asynchronous messages (JMS / IBIS) for downstream processing.
- Handle retries where appropriate or raise domain exceptions for the presentation layer to handle.


## Transaction Boundaries
- Transaction demarcation is at the service layer. Controllers and action beans should not open or commit transactions.
- Typical annotation: `@Transactional(readOnly = true)` for lookup methods; `@Transactional` for update/insert/delete operations.
- For operations that publish JMS messages after DB commit, use after-commit hooks or transaction synchronization to ensure messages are sent only on successful commit.

Example pattern:
- Service method begins transaction
- DAO update/insert operations executed
- On success, register TransactionSynchronization to publish JMS messages
- Commit


## Key Service Classes (examples found in workspace)
- `DeliveryService` / `DeliveryServiceImpl`
  - Purpose: Main entry point for redelivery and delivery request operations
  - Common methods:
    - `DeliveryRequest createDeliveryRequest(DeliveryRequestForm form)`
    - `void updateDeliveryRequestStatus(String consignmentId, Status status)`
    - `List<DeliveryOption> getAvailableOptions(Address address)`
  - Integrations: DAOs for DELIVERY_REQUEST and DELIVERY_ADDRESS, `DeliveryAsyncMessageSender` for async operations

- `DeliveryDomainEnquiryService`
  - Purpose: Read-only queries used by presentation flows to show options and history
  - Common methods:
    - `DeliveryDetails findDeliveryDetails(String consignmentId)`
    - `List<RedeliveryHistory> findRedeliveryHistory(String accountId)`

- `LocationService` / `AddressLookupService`
  - Purpose: Lookup depot/country/postcode information using DB or remote services
  - Methods:
    - `Location lookupByPostcode(String postcode)`
    - `List<Location> suggestAddresses(String term)`

- `NotificationService`
  - Purpose: Used by admin or batch components to trigger alerts or create tracking messages
  - Methods:
    - `void sendNotification(NotificationRequest request)`


## Async Integration (JMS / IBIS)
- Services delegate to async sender components to publish integration messages rather than coupling business logic to transport.
- Example class: `DeliveryAsyncMessageSender` — observed in `delivery-async-process` module
  - Methods:
    - `void sendAsync(AsyncMessageWrapper payload)`
    - `void sendToQueue(String queueName, Object message)`
- Ensure send is performed after successful DB commit. Patterns observed:
  - Use Spring `TransactionSynchronizationManager.registerSynchronization(...)` to enqueue message send after commit
  - Or publish via a JMS transaction manager bound to the same XA transaction if available


## Exception Handling & Domain Errors
- Service methods throw domain-specific exceptions (e.g., `DeliveryValidationException`, `DeliveryNotFoundException`) which presentation layer maps to user-friendly messages.
- Use checked exceptions sparingly — prefer runtime exceptions that will trigger rollback when thrown in a transactional context.
- For recoverable integration errors (e.g., temporary IBIS outage), either retry at service layer (with exponential backoff) or persist a compensating record and surface the error to an operator dashboard.


## Example Call Sequence (Redelivery flow: short form)
1. Presentation (WebFlow action) calls `deliveryService.createDeliveryRequest(form)`
2. `DeliveryService` validates input and calls `deliveryDao.insertDeliveryRequest(...)`
3. `DeliveryService` calls `addressDao.insertOrUpdateAddress(...)`
4. `DeliveryService` registers a transaction synchronization to call `DeliveryAsyncMessageSender.sendAsync(...)` after commit
5. Transaction commits, synchronization executes and message placed on JMS queue (e.g., `MYD1.INOU1P/SRVQ`)
6. MDB (`DeliveryAsyncMessageProcessorMDB`) picks up message and performs downstream processing


## Verbatim service method excerpts & call traces
Below are full, copy‑paste method excerpts for the primary service methods invoked by the presentation layer during the redelivery flow. Use these to trace transactions, validation points and repository calls.

### DefaultDeliveryRequestService.submitDeliveryRequest(...) — full excerpt
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\service-impl\src\main\java\com\tnt\express\domain\delivery\service\impl\DefaultDeliveryRequestService.java`

```java
@Transactional(propagation = Propagation.REQUIRED)
public DeliveryRequest submitDeliveryRequest(DeliveryRequest deliveryRequest) {
    DeliveryRequest result = deliveryRequest;
    ((DeliveryRequestOperations) deliveryRequest).submit();
    if (!deliveryRequest.hasErrorDetails()) {
        // Check if there is already an existing, active (not deleted) delivery request
        DeliveryRequest existingDeliveryRequest = repository.findByConsignmentId(deliveryRequest.getConsignmentId());
        if (existingDeliveryRequest != null) {
            // WMYDEL-291 - Chang00008593 - Receiver being able to change the (re)arranging of his delivery until planned by depot dispatcher
            // delete the delivery existing delivery request
            repository.delete(existingDeliveryRequest);
        }
        result = repository.persist(deliveryRequest);
        // Extra check in case persist causes errors
        if (!deliveryRequest.hasErrorDetails()) {
            // check if the result is submitted successfully
            if (result != null && result.getId() != null) {
                // retrieve the depot delivery parameters by given the depot id found in the delivery request
                DepotDeliveryParameters depotDeliveryParameters = referenceRepository.findDepotDeliveryParametersByDepotId(result.getDepotId());
                // check if the depot delivery parameters and if the delivery request email is specified
                if (depotDeliveryParameters != null && StringUtils.isNotEmpty(depotDeliveryParameters.getDeliveryRequestMailbox())) {
                    // send the notification to the depot
                    deliveryRequestNotificationEmailDispatcher.sendNotificationEmail(depotDeliveryParameters.getDeliveryRequestMailbox(), result);
                }
            }
        }
    }
    return result;
}
```

Notes:
- Transactional boundary: REQUIRED (service-level). If persist(...) throws a runtime exception the transaction will rollback.
- Repository.delete(...) performs a logical (soft) delete (sets `deleted` flag) and then persists the change — see repository excerpt in Data Access doc.
- The email dispatch is invoked inside the service transaction after persist; if you need guaranteed post-commit behaviour for external calls prefer registering a TransactionSynchronization or sending asynchronously after commit.

---

### DefaultDeliveryRequestService.closeDeliveryRequest(...) — full excerpt
- File: same as above

```java
@Transactional(propagation = Propagation.REQUIRED)
public DeliveryRequest closeDeliveryRequest(DeliveryRequest deliveryRequest) {
    DeliveryRequest result = deliveryRequest;
    ((DeliveryRequestOperations) deliveryRequest).close();
    if (!deliveryRequest.hasErrorDetails() && deliveryRequest.isIgnoreWarnings()) {
        result = repository.persist(deliveryRequest);
    }
    return result;
}
```

Notes:
- `close()` updates status and closedDatetime on the domain object; `persist(...)` writes the change.
- Because `persist` may perform `merge` for existing entities, the returned `result` should be used thereafter (it may be a managed instance different from the input).

---

### DefaultMyDeliveryService.confirm(...) — full excerpt
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery\MyDeliveryServiceImpl\src\main\java\com\tnt\express\warp\mydelivery\service\DefaultMyDeliveryService.java`

```java
@Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public ConfirmationModel confirm(RedeliveryRequestBean bean) {
    bean.setPrintPtl();
    RedeliveryRequest request = redeliveryRequestFactory.create(bean);
    if (!request.isValid()) {
        return new DefaultConfirmationModel(new DefaultViolationsModel(request.getViolations()));
    }
    Map<String, String> unformattedPhoneNumbers = storeUnformattedPhoneNumbers(bean);
    correctPhoneNumbersFormat(bean);
    performRedeliveryMethod(bean.getSelectedOption(), request);
    if (request.isValid()) {
        request.confirm();
    }
    if (!request.isValid()) {
        resetFormattedPhoneNumbers(bean, unformattedPhoneNumbers);
        return new DefaultConfirmationModel(new DefaultViolationsModel(request.getViolations()));
    } else {
        return prepareAndDispatchConfirmationEmail(bean, getDepotInfo(bean.getSelectedOption(), request));
    }
}
```

Notes:
- This method orchestrates the internal domain redelivery request (`RedeliveryRequest`) and eventually calls `request.confirm()` which causes domain-level persistence via `deliveryRequestService.submitDeliveryRequest(...)` (see flow: DefaultRedeliveryRequest.confirm → deliveryRequestService.submitDeliveryRequest).
- Transactional: REQUIRED and rollbackFor Throwable — ensures any checked or unchecked exception will cause rollback.
- The method formats phone numbers, calls the domain operation, and then dispatches confirmation email (within the same transaction). If you need email after commit, move dispatch to after-commit sync.

---

## Post-commit JMS send patterns (observed)
- Observed pattern: a service persists DB state and either registers a transaction synchronization for after-commit messaging or relies on the repository/service to call an async sender after commit.
- Example approach used in codebase:
  - Persist entities using repository.persist(...)
  - After successful persist/commit, DeliveryAsyncMessageSender creates a JMS TextMessage wrapping an `AsyncMessageWrapper` and sends to the configured queue.
  - The `DeliveryAsyncMessageSender` lives in `delivery-async-process` module and is wired via Spring in `delivery-async-process-context.xml`.

Small excerpt (sender behaviour) — File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\delivery-async-process\src\main\java\com\tnt\express\domain\delivery\async\DeliveryAsyncMessageSender.java`

```java
AsyncMessageWrapper wrapper = new AsyncMessageWrapper(selector, payload);
// create TextMessage and send to queue
destinationProducer.send(textMessage);
```

Recommendation:
- Prefer TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() { afterCommit() { send(...) } }) to guarantee sends only after commit, or use a JMS broker XA configuration when the transaction encompasses DB + JMS.

---

## Testing & Mocking Recommendations
- Unit tests: mock DAOs and external senders (JMS/IBIS) — verify transaction boundaries and that messages are queued after DB ops succeed.
- Integration tests: use an embedded DB and a test JMS broker (or mocks) to validate end-to-end flows.


## References (scanned files)
- `delivery-async-process/src/main/java/.../DeliveryAsyncMessageSender.java`
- `delivery-async-process/src/main/java/.../DeliveryAsyncMessageProcessorMDB.java`
- `MyDeliveryServiceImpl` (service implementations under `MyDeliveryServiceImpl/` module)
- `MyDeliveryPresentation/...` action beans invoking service layer

---

Next: expand `06-Data-Access-Layer.md` with DAO classes, SQL table mappings, and example queries.