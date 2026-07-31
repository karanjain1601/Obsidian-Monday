# Delivery Request Management (Admin)

## Purpose
This document details the admin CRUD flows for delivery requests: listing, filtering, view, edit, cancel, resend, and audit trail. It explains UI interactions, service/DAO calls, transaction handling, and security checks.

---

## User Journeys
- Browse and filter delivery requests
- View request details and history
- Edit request fields (address, date, options)
- Cancel a pending request
- Resend or requeue request for processing (publish JMS/IBIS message)
- Export selected requests to CSV or PDF


## List & Filter Flow
1. UI launches `DeliveryRequestListView` and calls `deliveryService.findRequests(criteria, page, size)`
2. Service delegates to `deliveryRequestDao.findByCriteria(...)` with pagination and sorting
3. DAO returns a paged result; UI renders grid with server-side pagination
4. User selects rows and triggers actions (export, bulk cancel)


## View Details Flow
1. User clicks view on a row; UI calls `deliveryService.findDeliveryDetails(requestId)`
2. Service fetches data from `DELIVERY_REQUEST`, `DELIVERY_ADDRESS`, and `REDELIVERY_HISTORY` via DAOs
3. UI displays read-only details in a dialog or navigation to `DeliveryRequestEditView` in read-only mode


## Edit & Save Flow
1. Edit form is populated with current request state
2. User updates fields and clicks Save
3. UI calls `deliveryService.updateDeliveryRequest(requestDTO)`
4. Service validates business rules (e.g., cannot change consignment ID once dispatched)
5. Service calls DAOs to update request and address records within a single transaction (`@Transactional`)
6. If update should trigger external processing (e.g., resend), service registers after-commit action to publish message via `DeliveryAsyncMessageSender`
7. UI receives confirmation and refreshes list view


## Cancel Flow
- Cancellation sets `REQUEST_STATUS = CANCELLED` and writes an audit entry
- If message was already published to downstream systems, perform compensating logic or notify operations team

Implementation notes:
- Soft-cancel by default (set status flag) rather than hard delete
- Provide reason for cancellation and store in `REDELIVERY_HISTORY`/`AUDIT_LOG`


## Resend / Requeue Flow
1. Admin selects a failed/queued request and clicks Resend
2. System calls `deliveryService.resendDeliveryRequest(requestId, adminUser)`
3. Service verifies request is in a resendable state
4. Service may recreate or update a retry counter column and then enqueue a message to JMS/IBIS
5. Use transaction synchronization to ensure message is only sent after DB updates commit


## API Method Signatures (example)
```java
public interface DeliveryService {
  DeliveryRequestDTO findDeliveryDetails(Long requestId);
  PagedResult<DeliveryRequestDTO> findRequests(SearchCriteria criteria, int page, int size);
  DeliveryRequestDTO updateDeliveryRequest(DeliveryRequestDTO requestDto) throws DeliveryValidationException;
  void cancelDeliveryRequest(Long requestId, String reason, String adminUser);
  void resendDeliveryRequest(Long requestId, String adminUser) throws InvalidRequestStateException;
}
```


## Validation & Business Rules
- Field-level validation: non-empty address lines, valid postcode format
- Business rules: cannot edit requests in `COMPLETED` state; cannot cancel shipped consignments without special approval
- Display validation errors on the edit form with field-specific messages


## Audit & Logging
- Record all admin actions in an `ADMIN_AUDIT` table with columns: `AUDIT_ID`, `USER`, `ACTION`, `TARGET_REQUEST_ID`, `DETAILS`, `TIMESTAMP`
- Log changes at INFO level; sensitive data should be masked


## Security & Approval Flows
- Some actions (e.g., cancel after dispatch) require elevated privileges; implement an approval workflow or secondary confirmation dialog.
- Approval steps:
  - Admin requests action -> records request in `ADMIN_ACTIONS` table
  - Supervisor reviews and approves via dedicated `ApprovalView`
  - On approval, the action is executed and audit recorded


## Error Handling & Retry
- For transient failures (DB deadlocks), retry the save operation a small number of times
- For message publish failures, persist the message in an outbound table to be retried by a background job


## References & Source Files Scanned
- Admin presentation view classes under `MyDeliveryAdminPresentation` (search for `DeliveryRequest` in view package)
- Service and DAO methods in `MyDeliveryServiceImpl` and `delivery` components
- Audit table definitions in `Database_Tables_Complete_Reference.md`

---

Next: create `04-Configuration-Screens.md` with details about depot/country/system parameters management.