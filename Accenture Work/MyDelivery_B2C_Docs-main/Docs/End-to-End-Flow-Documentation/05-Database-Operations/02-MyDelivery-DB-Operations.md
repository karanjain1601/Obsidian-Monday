# MyDelivery DB Operations

This document collates the concrete DAO/SQL/DDL mappings used by the MyDelivery application for the redelivery flow. It focuses on the primary tables used by the presentation/service flow: DELIVERY_REQUEST (`DDRRRT01`), DELIVERY_ADDRESS (`DDRDAT01`) and related entities, repositories and audit/history tables. It includes the source DDL found in the project's A&D SQL files, the JPA entity classes and repository methods that persist/read these tables, and operational queries used in runbooks.

---

## Source DDL (core tables)

- DELIVERY_REQUEST — DDRRRT01
  - Source DDL (excerpt)
    - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-support\04_A&D\Database\Iteration 3\dbreqnr4232-DD-completeV3.sql

    CREATE TABLE DDADMIN.DDRRRT01 (
           DRR_OBJ_ID           NUMBER(12) NOT NULL,
           CON_ID               NUMBER(12) NULL,
           DRR_DELETE_IN        VARCHAR2(1) NOT NULL,
           DRR_UPDT_USER_ID     VARCHAR2(8) NOT NULL,
           DRR_UPDT_TD          DATE NOT NULL,
           DRR_SOFTLOCK_TS      TIMESTAMP(6) NOT NULL,
           DRR_CLOSED_TD        DATE NULL,
           DRR_DISCL_AGRD_IN    VARCHAR2(1) NULL,
           DRR_EMAILADDR_TX     VARCHAR2(129) NULL,
           DRR_HOMEPHONE_NR     VARCHAR2(30) NULL,
           DRR_MOBILEPHONE_NR   VARCHAR2(30) NULL,
           DRR_WORKPHONE_NR     VARCHAR2(30) NULL,
           DRR_OPENED_TD        DATE NULL,
           DRR_PLND_RDLV_DT     DATE NULL,
           DRR_RDLV_INSTR_TX    VARCHAR2(400) NULL,
           DRR_RDLV_OPTN_NR     NUMBER(1) NULL,
           DRR_RDLV_S_OPTN_NR   NUMBER(1) NULL,
           DRR_RQUSTD_RDLV_DT   DATE NULL,
           DRR_STATUS_NR        NUMBER(1) NULL,
           DAD_OBJ_ID           NUMBER(12) NULL
    )

  - Indexes / constraints: unique index `DDNRRT01` on `DRR_OBJ_ID`, query indexes on `CON_ID` (`DDQRRT01`) and `DAD_OBJ_ID` (`DDQRRT02`).

- DELIVERY_ADDRESS — DDRDAT01
  - Source DDL (excerpt)
    - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-support\04_A&D\Database\Iteration 2\dbreqnr4232-DD-completeV2.sql

    CREATE TABLE DDADMIN.DDRDAT01 (
       DAD_OBJ_ID NUMBER(12) NOT NULL,
       DAD_COMPANY_NM VARCHAR2(200),
       DAD_ADDR_LINE_1_TX VARCHAR2(200),
       DAD_ADDR_LINE_2_TX VARCHAR2(200),
       DAD_ADDR_LINE_3_TX VARCHAR2(200),
       DAD_CONTACT_NM VARCHAR2(129),
       COU_ISO_ID VARCHAR2(3),
       DAD_PROVINCE_NM VARCHAR2(100),
       DAD_HOMEPHONE_NR VARCHAR2(30),
       DAD_MOBILEPHONE_NR VARCHAR2(30),
       DAD_WORKPHONE_NR VARCHAR2(30),
       DAD_POST_CD VARCHAR2(40),
       DAD_TOWN_NM VARCHAR2(100),
       ...
    )

  - Indexes / constraints: unique index `DDNDAT01` on `DAD_OBJ_ID` (see SQL files for full column list and constraints).

---

## Java domain mapping (entities / repositories)
The project uses JPA/Hibernate entity classes that map to the above tables. The most relevant classes for the redelivery flow are:

- Entity: `DefaultDeliveryRequest` (maps to `DELIVERY_REQUEST`)
  - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\impl\DefaultDeliveryRequest.java
  - Key mapped columns (via `@Column` / `@JoinColumn`):
    - `id` -> `DELIVERY_REQUEST_PK` (sequence `DDRDRSQ1`)
    - `consignmentId` -> `CONSIGNMENT_ID`
    - `deliveryInstructions` -> `DELIVERY_INSTRUCTIONS`
    - `status` -> `STATUS`
    - `openedDatetime` -> `OPENED_TD`
    - `plannedDeliveryDate` -> `PLANNED_DELIVERY_DT`
    - `requestedDeliveryDate` -> `REQUESTED_DELIVERY_DT`
    - `deliveryAddress` -> `DELIVERY_ADDRESS_PK` (one-to-one cascade)
    - `emailAddress`, `homePhoneNumber`, `mobilePhoneNumber`, `workPhoneNumber`, `contactName`, `localeCode`

- Entity: `DefaultDeliveryAddress` (maps to `DELIVERY_ADDRESS`)
  - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\impl\DefaultDeliveryAddress.java
  - Key mapped columns:
    - `id` -> `DELIVERY_ADDRESS_PK` (sequence `DDRDASQ1`)
    - `contactName` -> `CONTACT_NAME`
    - `companyName` -> `COMPANY_NAME`
    - `addressLine1`/`2`/`3` -> `ADDRESS_LINE_1`/`2`/`3`
    - `town` -> `TOWN_NAME`
    - `county` -> `PROVINCE_NAME`
    - `countryCode` -> `COUNTRY_ISO_CODE`
    - `postCode` -> `POSTCODE`
    - phone fields -> `MOBILEPHONE_NUMBER`, `HOMEPHONE_NUMBER`, `WORKPHONE_NUMBER`

- Repository: `DefaultDeliveryRepository` (JPA-powered repository)
  - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\repository\impl\DefaultDeliveryRepository.java
  - Useful methods used by the service layer:
    - `findByConsignmentId(String consignmentId)` — returns latest DeliveryRequest for a consignment
    - `persist(DeliveryRequest deliveryRequest)` — inserts or merges the DeliveryRequest (handles cascaded DeliveryAddress persistence)
    - `delete(DeliveryRequest request)` — soft-delete pattern (marks deleted on request and address)
    - `findByDepot(...)`, `countByDepot(...)` — admin / reporting queries

Notes: the application uses `delivery_entity_DeliveryRequestDelegate` and `delivery_entity_DeliveryRepository` beans wired in `delivery-entity-context.xml`. The entity-context wires repositories and delegates used by the domain objects.

---

## Where persistence is triggered in the redelivery flow
- Presentation layer calls `confirmationDecorator` → decorator delegates to `MyDeliveryService.confirm(...)` (presentation module → service module).
  - Service: `DefaultMyDeliveryService.confirm(RedeliveryRequestBean bean)`
    - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery\MyDeliveryServiceImpl\src\main\java\com\tnt\express\warp\mydelivery\service\DefaultMyDeliveryService.java
    - This method uses an internal `RedeliveryRequest` domain object (factory produced by `RedeliveryRequestFactory`) to perform business rules, then calls domain operations which result in JPA entity creation/persist via the repository/delegate layer. The service is annotated with `@Transactional` so inserts/updates occur within a transaction.

- The domain implementation (`DefaultDeliveryRequest` and its delegate) uses the `delivery_entity_DeliveryRequestDelegate` (bean: `DefaultDeliveryRequestDelegate`) to perform repository operations. The delegate and repository are defined in `delivery-entity-context.xml`.

Files to inspect for exact DAO call sites:
- `DefaultDeliveryRequest` (entity impl) — many domain operations call delegate methods that interact with repositories.
  - Path: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\impl\DefaultDeliveryRequest.java
- `DefaultDeliveryRepository` — persist/merge methods (see above path)
- `delivery-entity-context.xml` — wiring of repository and delegate beans
  - Path: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\resources\delivery-entity-context.xml

---

## Call trace: where DELIVERY_REQUEST / DELIVERY_ADDRESS rows are created or merged

This section maps the exact service/delegate/repository methods that insert or update the delivery request and its cascaded delivery address (tables referenced in A&D as DDRRRT01 and DDRDAT01).

- Entry points that result in persistence
  - `DefaultDeliveryRequestService.submit(DeliveryRequest deliveryRequest)`
    - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\service-impl\src\main\java\com\tnt\express\domain\delivery\service\impl\DefaultDeliveryRequestService.java`
    - Signature: `public DeliveryRequest submitDeliveryRequest(DeliveryRequest deliveryRequest)`
    - Behaviour: validates and sets status/openedDatetime, deletes any existing active request for the same consignment via `repository.delete(existingDeliveryRequest)` and then persists the new/updated `DeliveryRequest` by calling `repository.persist(deliveryRequest)`.

  - `DefaultDeliveryRequestService.close(DeliveryRequest deliveryRequest)`
    - File: same as above
    - Signature: `public DeliveryRequest closeDeliveryRequest(DeliveryRequest deliveryRequest)`
    - Behaviour: marks the DeliveryRequest as closed and, when `ignoreWarnings` is true and there are no errors, calls `repository.persist(deliveryRequest)` to store the closed state.

- Repository implementation that performs DB insert/update
  - `DefaultDeliveryRepository.persist(DeliveryRequest deliveryRequest)`
    - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\repository\impl\DefaultDeliveryRepository.java`
    - Signature: `public DeliveryRequest persist(DeliveryRequest deliveryRequest)`
    - Implementation summary (exact behaviour):
      - If `deliveryRequest.getId() == null` then `EntityManager.persist(deliveryRequest)` (INSERT)
      - Else `result = EntityManager.merge(deliveryRequest)` (UPDATE/merge)
      - Finally `EntityManager.flush()` is invoked to force DB errors to surface.

- Entity mapping that determines the table/columns written
  - `DefaultDeliveryRequest` (JPA entity)
    - File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\impl\DefaultDeliveryRequest.java`
    - Key JPA annotations and columns:
      - `@Entity`
      - `@Table(name = "DELIVERY_REQUEST")` — maps this entity to the DELIVERY_REQUEST table (A&D name: DDRRRT01)
      - Primary key:
        - `@Id` / `@Column(name = "DELIVERY_REQUEST_PK")` / `@GeneratedValue(...)` — PK column
      - Delivery address relation (cascade ALL):
        - `@OneToOne(cascade = CascadeType.ALL, targetEntity = DefaultDeliveryAddress.class)`
        - `@JoinColumn(name = "DELIVERY_ADDRESS_PK")` — the DeliveryRequest holds a foreign key to the DELIVERY_ADDRESS record (A&D name: DDRDAT01)
      - Other mapped columns (examples): `CONSIGNMENT_ID`, `STATUS`, `PLANNED_DELIVERY_DT`, `REQUESTED_DELIVERY_DT`, `DEPOT_ID`, `DELIVERY_INSTRUCTIONS` etc. — see the entity file for full mapping.

- How address rows are created/updated
  - Because the relationship is mapped with `cascade = CascadeType.ALL` on the `deliveryAddress` field, persisting/merging the `DeliveryRequest` will also persist/merge the associated `DeliveryAddress` entity. The `@JoinColumn(name = "DELIVERY_ADDRESS_PK")` means the DELIVERY_REQUEST row references the DELIVERY_ADDRESS PK; the address entity is stored in the DELIVERY_ADDRESS table.

- Direct repository call locations (examples)
  - `DefaultDeliveryRequestService.submitDeliveryRequest` — calls `repository.persist(deliveryRequest)` after deleting any existing request for the consignment.
  - `DefaultDeliveryRequestService.closeDeliveryRequest` — conditionally calls `repository.persist(deliveryRequest)` when closing the request.
  - `DefaultDeliveryRepository.persist` — performs EntityManager.persist/merge/flush.

- JPQL / queries of interest (read operations)
  - `DefaultDeliveryRepository` defines JPQL strings used for reads and counts; examples:
    - `FIND_BY_DEPOT_ID`:
      `select request from DefaultDeliveryRequest request where deleted=false and status=:status and (depotId=:depotId or (alternativeDepotId is not null and alternativeDepotId=:depotId)) order by openedDatetime asc`
    - `FIND_BY_CONSIGNEMNT_ID`:
      `select request from DefaultDeliveryRequest request where deleted=false and consignmentId=:consignmentId`

---

## Exact code excerpts for persistence (DeliveryRequest / DeliveryAddress)

The following are verbatim method-level excerpts from the source code showing exactly where DeliveryRequest and its DeliveryAddress are inserted/updated/deleted. Use these to trace behaviour down to EntityManager.persist/merge/flush and to understand cascade behaviour that writes the DELIVERY_ADDRESS row.

---

### Service: submitDeliveryRequest (calls repository.persist)
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

---

### Service: closeDeliveryRequest (calls repository.persist)
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\service-impl\src\main\java\com\tnt\express\domain\delivery\service\impl\DefaultDeliveryRequestService.java`

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

---

### Repository: DefaultDeliveryRepository.persist (EntityManager.persist / merge / flush)
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\repository\impl\DefaultDeliveryRepository.java`

```java
public DeliveryRequest persist(DeliveryRequest deliveryRequest) {
	DeliveryRequest result = deliveryRequest;
	if (deliveryRequest.getId() == null) {
		getEntityManager().persist(deliveryRequest);
	} else {
		// The record is updated
		result = getEntityManager().merge(deliveryRequest);
	}
	// Make sure all is stored in the db to force errors
	getEntityManager().flush();
	return result;
}
```

---

### Repository: DefaultDeliveryRepository.delete (soft-delete via deleted flag)
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\repository\impl\DefaultDeliveryRepository.java`

```java
public void delete(DeliveryRequest request) {
	DeliveryRequest deliveryRequest = findById(request.getId());
	((PersistenceOperations) deliveryRequest).setDeleted(true);
	if (deliveryRequest.getDeliveryAddress() != null) {
		((PersistenceOperations) deliveryRequest.getDeliveryAddress()).setDeleted(true);
	}
	this.persist(deliveryRequest);
}
```

Note: delete(...) performs a logical (soft) delete by setting the `deleted` flag on the DeliveryRequest and its DeliveryAddress and then calling persist(...) to write the change.

---

### Entity: DefaultDeliveryRequest (JPA mappings relevant to table writes)
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery\entity-impl\src\main\java\com\tnt\express\domain\delivery\entity\impl\DefaultDeliveryRequest.java`

```java
@Configurable(dependencyCheck = true)
@Entity
@TypeDef(name = "timestamp_utc", typeClass = DbTimestampType.class)
@Table(name = "DELIVERY_REQUEST")
public class DefaultDeliveryRequest extends DefaultBaseEntity implements DeliveryRequest, DeliveryRequestOperations {

    // ...existing code...

    /** Primary Key */
    @Id
    @Column(name = "DELIVERY_REQUEST_PK")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "DDRDRSQ1_SEQ")
    @SequenceGenerator(name = "DDRDRSQ1_SEQ", sequenceName = "DDRDRSQ1")
    private Long id;

    @Column(name = "DELIVERY_INSTRUCTIONS")
    private String deliveryInstructions;

    @Column(name = "CONSIGNMENT_ID")
    private String consignmentId;

    @Column(name = "STATUS")
    private DeliveryRequestStatus status;

    @OneToOne(cascade = CascadeType.ALL, targetEntity = DefaultDeliveryAddress.class)
    @JoinColumn(name = "DELIVERY_ADDRESS_PK")
    private DeliveryAddress deliveryAddress;

    // ...existing code...
}
```

Important implications:
- `@Table(name = "DELIVERY_REQUEST")` indicates the entity maps to the DELIVERY_REQUEST table (A&D: DDRRRT01).
- `@OneToOne(cascade = CascadeType.ALL, targetEntity = DefaultDeliveryAddress.class)` with `@JoinColumn(name = "DELIVERY_ADDRESS_PK")` means persisting or merging the DeliveryRequest will cascade to persist/merge the associated DeliveryAddress row (A&D: DDRDAT01). The DeliveryRequest holds the FK column `DELIVERY_ADDRESS_PK`.

---

## Additional full code excerpts (call sites that invoke submit/close leading to persistence)

These excerpts show application-level callers that eventually cause DeliveryRequest rows (and cascaded DeliveryAddress rows) to be persisted via the service -> repository -> EntityManager path.

### WebFlow action: DeliveryRequestFormAction.submit
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery-domain-enquiry\delivery-domain-enquiry-web\src\main\java\com\tnt\express\domain\delivery\action\DeliveryRequestFormAction.java`

```java
public Event submit(RequestContext requestCtx) {
	DeliveryRequestVO requestVO = (DeliveryRequestVO) getFormObjectAccessor(requestCtx).getCurrentFormObject();
	DefaultDeliveryRequest request =
		(DefaultDeliveryRequest) service.createDeliveryRequest(requestVO.getConsignmentId());
	this.clearDeliveryAddress(requestVO);
	CopyDefaultDeliveryRequest.copy(requestVO, request);
	service.submitDeliveryRequest(request);
	CopyDefaultDeliveryRequest.copy(request, requestVO);
	if (requestVO.getDeliveryAddress() == null) {
		requestVO.setDeliveryAddress(new DeliveryAddressVO());
	}
	requestCtx.getFlashScope().put("resultFound", true);
	if (request.getErrorDetails().isEmpty()) {
		return success();
	} else {
		return error();
	}
}
```

Notes: this FormAction method is invoked from WebFlow `view-state`/`action-state` transitions. It constructs the domain `DefaultDeliveryRequest`, copies data from the form backing VO, and calls `service.submitDeliveryRequest(...)` which performs validation and calls `repository.persist(...)`.


### Flow-backed integration: DefaultRedeliveryRequest.confirm
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery\MyDeliveryServiceImpl\src\main\java\com\tnt\express\warp\mydelivery\service\integration\DefaultRedeliveryRequest.java`

```java
@Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public void confirm() {
	if (!states.contains(RequestState.REDELIVERY_METHOD_SELECTED)) {
		throw new IllegalArgumentException("No redelivery method selected prior to confirmation");
	}

	switch (deliveryRequest.getDeliveryOption()) {
	case DELIVER_TO_ORIGINAL_ADDRESS:
		consignment.redeliverToOriginalAddress(createDefaultRedeliveryConsignmentParameters(deliveryRequest.getDeliveryOption()));
		break;
	case COLLECT_FROM_MY_LOCAL_TNT_LOCATION:
		consignment.selfCollect(createDefaultRedeliveryConsignmentParameters(deliveryRequest.getDeliveryOption()));
		break;
	case LEAVE_IN_MY_ABSENCE_MY_ADDRESS:
		consignment.redeliverInAbsence(createDefaultRedeliveryConsignmentParameters(deliveryRequest.getDeliveryOption()));
		break;
	case LEAVE_IN_MY_ABSENCE_NEIGHBOURS_ADDRESS:
		consignment.leaveWithNeighbour(createDefaultRedeliveryConsignmentParameters(deliveryRequest.getDeliveryOption()));
		break;
	case DELIVER_TO_ALTERNATIVE_DELIVERY_ADDRESS:
		consignment.redeliverToAlternativeAddress(createDefaultRedeliveryConsignmentParameters(deliveryRequest.getDeliveryOption()));
		break;
	default:
		throw new IllegalStateException(
			"Attempted to submit redelivery request without setting delivery option first");
	}

	if (!consignment.isValid()) {
		violations.addAll(consignment.getViolations());
	}

	if (this.isValid()) {
		final DeliveryRequest result = deliveryRequestService.submitDeliveryRequest(deliveryRequest);

		if (result.hasErrorDetails()) {
			violations.addAll(mapViolations(deliveryRequest.getErrorDetails()));
		}
	}

	if (!this.isValid()) {
		throw new IllegalStateException("Attempted to submit an invalid redelivery request [" + this + "]");
	}
}
```

Notes: `DefaultRedeliveryRequest.confirm()` is invoked by higher-level application code (e.g., WebFlow decorators/actions). It prepares consignment updates and delegates to `deliveryRequestService.submitDeliveryRequest(...)` to persist the DeliveryRequest. The method is transactional.


### WebFlow action: DeliveryRequestFormAction.close (invokes service.closeDeliveryRequest)
- File: `c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery-components\delivery-domain-enquiry\delivery-domain-enquiry-web\src\main\java\com\tnt\express\domain\delivery\action\DeliveryRequestFormAction.java`

```java
public Event close(RequestContext requestCtx) {
	String dateStr = requestCtx.getRequestParameters().get("newPlannedDeliveryDate");
	DateFormat df = new SimpleDateFormat("dd-MM-yyyy");
	Date plannedDate = null;
	try {
		plannedDate = df.parse(dateStr);
	} catch (ParseException e) {
		// plannedDate = null;
	}

	DeliveryRequestVO parametersVO =
		(DeliveryRequestVO) getFormObjectAccessor(requestCtx).getCurrentFormObject();
	DefaultDeliveryRequest parameters =
		(DefaultDeliveryRequest) service.findDeliveryRequestById(parametersVO.getId());
	// Update the closed date.
	parameters.setPlannedDeliveryDate(plannedDate);
	service.closeDeliveryRequest(parameters);
	CopyDefaultDeliveryRequest.copy(parameters, parametersVO);
	requestCtx.getFlashScope().put("resultFound", true);
	if (parameters.getErrorDetails().isEmpty()) {
		return success();
	} else {
		return error();
	}
}
```

Notes: `close(...)` updates the `plannedDeliveryDate` and calls `service.closeDeliveryRequest(...)`, which may call `repository.persist(...)` to persist the closed state.

---

## Operational queries & runbook snippets
- Find recent redelivery requests for a consignment ID:
  SELECT * FROM DDADMIN.DDRRRT01 WHERE CON_ID = :consignmentId ORDER BY DRR_OPENED_TD DESC;

- Inspect address record for a delivery request:
  SELECT * FROM DDADMIN.DDRDAT01 WHERE DAD_OBJ_ID = :dadObjId;

- Check for unprocessed outbound messages referencing a delivery request ID (example; actual outbound table name varies by environment):
  SELECT * FROM OUTBOUND_MSG_TABLE WHERE CORRELATION_ID = :drrObjId;

- Example: find requests that were created but not moved to status CLOSED (status column mapping in entity -> `STATUS`):
  SELECT * FROM DDADMIN.DDRRRT01 WHERE DRR_STATUS_NR IS NULL OR DRR_STATUS_NR <> <closed_status_code> ORDER BY DRR_OPENED_TD DESC;

---

## Next actions (I will proceed with these unless you instruct otherwise)
1. Scan `MyDeliveryServiceImpl` and domain delegate classes to extract the exact repository/delegate method calls that create/merge rows in `DDRRRT01` and `DDRDAT01`. I will copy the exact method signatures and any inline SQL or JPQL used.
2. Extract and document any DB-backed outbound tables or JMS-outbound gateway tables used by `DeliveryAsyncMessageSender` or other async components (to support DLQ republish runbook).
3. Add concrete republish SQL/PowerShell examples using the actual outbound table and JMS queue names discovered in step (2).

If you want me to start (1) now, I will scan the service and delegate classes and add method-by-method DAO mappings to this document.
