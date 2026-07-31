# Data Access Layer (MyDelivery)

## Purpose
This document details the data access layer for the MyDelivery application: DAO patterns, SQL mappings, common table structures, transaction rules, and examples of DAO methods used by services.

---

## DAO Conventions
- DAOs follow the `*Dao` interface and `*DaoImpl` implementation pattern.
- DAOs are Spring beans and typically use `JdbcTemplate` or an ORM (e.g., iBATIS / MyBatis) depending on the module.
- Methods are focused: `insert`, `update`, `findById`, `findByCriteria`, `delete`.
- DAOs do not manage transactions; services manage transactional boundaries.


## Key Tables (Examples)
- `DELIVERY_REQUEST` — stores a delivery/redelivery request. Key columns:
  - `REQUEST_ID` (PK)
  - `CONSIGNMENT_ID` (FK to consignment)
  - `REQUEST_STATUS` (enum)
  - `REQUESTED_DATE`, `CREATED_BY`, `UPDATED_AT`

- `DELIVERY_ADDRESS` — stores address details associated with a delivery request.
  - `ADDRESS_ID` (PK)
  - `REQUEST_ID` (FK)
  - `LINE1`, `LINE2`, `POSTCODE`, `COUNTRY`

- `REDLIVERY_HISTORY` / `REDELIVERY_LOG` — audit trail of redelivery attempts and statuses.

- Reference tables: `COUNTRY`, `DEPOT`, `SERVICE_CODES`


## Common DAO Implementations
- `DeliveryRequestDao` / `DeliveryRequestDaoImpl`
  - `long insertDeliveryRequest(DeliveryRequest req)`
  - `int updateDeliveryRequestStatus(long requestId, String status)`
  - `DeliveryRequest findByConsignmentId(String consignmentId)`

- `DeliveryAddressDao` / `DeliveryAddressDaoImpl`
  - `long insertAddress(DeliveryAddress addr)`
  - `DeliveryAddress findById(long addressId)`

- `RedeliveryHistoryDao`
  - `List<RedeliveryHistory> findByConsignmentId(String consignmentId)`


## SQL Patterns
- Use named parameters (NamedParameterJdbcTemplate) to improve readability.
- When inserting, return generated keys (via KeyHolder) for foreign key relationships.
- Avoid SELECT *; specify columns explicitly to avoid coupling to schema changes.

Example snippet (conceptual):

```sql
INSERT INTO DELIVERY_REQUEST (CONSIGNMENT_ID, REQUEST_STATUS, REQUESTED_DATE, CREATED_BY)
VALUES (:consignmentId, :status, :requestedDate, :createdBy)
```


## Batch Operations
- Batch updates/inserts are used for bulk processing (e.g., processing multiple consignment statuses in B2C flows).
- Use JdbcTemplate.batchUpdate for efficient writes.


## Handling Concurrency
- Use optimistic locking where possible (VERSION column) or PESSIMISTIC locks when necessary (SELECT ... FOR UPDATE) for critical operations like status updates.
- Ensure unique constraints on columns like `CONSIGNMENT_ID` to prevent duplicate request creation.


## Transactions & Rollbacks
- DAOs should throw runtime exceptions on SQL errors so Spring can roll back the transaction.
- Service layer catches and maps exceptions for UI-friendly messages.


## Example DAO Method (conceptual Java)

```java
public long insertDeliveryRequest(DeliveryRequest req) {
    String sql = "INSERT INTO DELIVERY_REQUEST (CONSIGNMENT_ID, REQUEST_STATUS, REQUESTED_DATE, CREATED_BY)"
               + " VALUES (:consignmentId, :status, :requestedDate, :createdBy)";
    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("consignmentId", req.getConsignmentId())
        .addValue("status", req.getStatus())
        .addValue("requestedDate", req.getRequestedDate())
        .addValue("createdBy", req.getCreatedBy());
    KeyHolder keyHolder = new GeneratedKeyHolder();
    namedParameterJdbcTemplate.update(sql, params, keyHolder);
    return keyHolder.getKey().longValue();
}
```


## Repository persist / delete call sites (DeliveryRequest)

The following are the concrete locations in the codebase where DeliveryRequest objects are persisted or logically deleted. For each entry I list the file, the method, the approximate line number (as found in the workspace), and a short verbatim excerpt showing the persistence call.

1) DefaultDeliveryRequestService.submitDeliveryRequest(...) — service layer (calls repository.delete(...) and repository.persist(...))
   - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\service-impl\src\main\java\com\tnt\express\domain\delivery\service\impl\DefaultDeliveryRequestService.java`
   - Occurrences (approx lines in file):
     - repository.persist(deliveryRequest) — line ~64
     - repository.persist(deliveryRequest) — line ~147
   - Excerpt (verbatim line showing persist):
     - result = repository.persist(deliveryRequest);
   - Notes: This is the primary service method invoked by presentation flows to submit a redelivery request. It first checks for an existing active request via `repository.findByConsignmentId(...)` and if found calls `repository.delete(existingDeliveryRequest)` (logical delete), then persists the new/updated request.

2) DefaultDeliveryRequestService.closeDeliveryRequest(...) — service layer (conditional persist on close)
   - File: same as above (DefaultDeliveryRequestService.java)
   - Occurrence (approx line): repository.persist(deliveryRequest) — line ~64
   - Excerpt:
     - result = repository.persist(deliveryRequest);
   - Notes: closeDeliveryRequest() uses `DeliveryRequest.close()` to set status and then persists when `!hasErrorDetails()` and `isIgnoreWarnings()`.

3) DefaultDeliveryRepository.delete(...) — repository layer (logical/soft delete)
   - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\repository\impl\DefaultDeliveryRepository.java`
   - Occurrence (approx line): `this.persist(deliveryRequest);` — line ~67 (inside delete method)
   - Excerpt:
     - this.persist(deliveryRequest);
   - Notes: `delete(...)` implements a logical delete by setting `deleted=true` on the deliveryRequest and its DeliveryAddress (if present) and then calls `persist(...)` to store the change.

4) DefaultDeliveryRepository.persist(DeliveryRequest) — repository layer (INSERT / MERGE / FLUSH)
   - File: same as above (DefaultDeliveryRepository.java)
   - Occurrence (approx line): getEntityManager().persist(deliveryRequest) / merge(...) / flush() — line ~103
   - Excerpt (core behaviour):
     - if (deliveryRequest.getId() == null) {
         getEntityManager().persist(deliveryRequest);
       } else {
         result = getEntityManager().merge(deliveryRequest);
       }
       getEntityManager().flush();
   - Notes: The repository `persist` method uses JPA EntityManager.persist() for new entities (INSERT) and EntityManager.merge() for existing (UPDATE), then calls `flush()` to force SQL execution and surface DB constraint errors early. The `DeliveryRequest` JPA mapping uses `@OneToOne(cascade = CascadeType.ALL)` on `deliveryAddress` so address rows are written automatically when the parent is persisted/merged.

5) Tests & other call sites (examples)
   - Several unit tests exercise repository.persist and delete behaviour for delivery-related entities; look under:
     - `.../delivery/entity-impl/src/test/java/.../DefaultDeliveryRepositoryTest.java` (calls `delete()` and `persist()` in setup/teardown)
   - Notes: Tests can be used as executable examples of the expected DB state transitions.

## Operational DB inspection queries (DeliveryRequest / DeliveryAddress)

- Inspect active delivery requests by consignment id:
  - SELECT * FROM DELIVERY_REQUEST WHERE CONSIGNMENT_ID = '<consignmentId>' AND DELETED = 'N';
- Inspect associated address:
  - SELECT * FROM DELIVERY_ADDRESS WHERE DELIVERY_ADDRESS_PK = (SELECT DELIVERY_ADDRESS_PK FROM DELIVERY_REQUEST WHERE CONSIGNMENT_ID = '<consignmentId>');
- Find recent changes (order by OPENED_TD / CLOSED_TD):
  - SELECT * FROM DELIVERY_REQUEST WHERE CONSIGNMENT_ID = '<consignmentId>' ORDER BY OPENED_TD DESC;

Replace the `DELETED` values depending on your DB (some schemas use CHAR, NUMBER or BOOLEAN).

## Notes on cascade behaviour

Because `DefaultDeliveryRequest` uses `@OneToOne(cascade = CascadeType.ALL, targetEntity = DefaultDeliveryAddress.class)` the repository persist/merge will cascade to `DeliveryAddress`. That means operators and developers need only inspect `DELIVERY_REQUEST` and `DELIVERY_ADDRESS` tables to observe the complete change.

## Next steps

- I will add exact file/line ranges (precise line numbers) for each method if you want absolute positions (I can compute these in the next pass and update the doc). For now I used the approximate line references as discovered during code inspection.

## References (scanned files)
- `Database_Tables_Complete_Reference.md` — Schema reference
- DAO packages under `MyDeliveryServiceImpl/src/main/java/...` and `eai-3532120-mydelivery-components` modules

---

Next: add per-table DDL snippets and reference exact DAO class files discovered in the repo.