# MyDeliveryServiceImpl Module

Provides concrete implementations of service APIs, models, integration ACLs, helpers, HTTP utilities, reporting assembly, and AspectJ concerns.

## Packages
- `model.impl`: POJO implementations of API model interfaces.
- `service`: Core service façade implementations.
- `service.acl.*`: Anti-Corruption Layer adapters for external systems (APC, OSC, StreamServe, common codes).
- `service.aspectj`: Cross-cutting concerns (caching aspect).
- `service.helper`: Utility builders and validation helpers specific to service logic.
- `service.http`: HTTP client configuration & execution utilities.
- `service.integration`: Domain integration aggregates & mutable helper objects for redelivery processes.
- `service.reports`: Report data assembly and printing support.
- `service.acl.streamserve.request`: JAXB-mapped XML payload/request/response classes.

## Model Implementations
- `DefaultAvailableOptionsModel`: Holds computed redelivery options & potential validation violations.
- `DefaultBaseResponseModel`: Base response implementation (implements `BaseResponseModel` plus common serialization helpers).
- `DefaultConfirmationModel`: Concrete confirmation details (reference IDs, timestamps, status codes).
- `DefaultCountryMetadataModel`: Country rules (postcode pattern, phone prefix, feature toggles).
- `DefaultDatesModel`: Backing for selectable dates (internally ensures ordering, uniqueness, earliest date retrieval).
- `DefaultDepotAddressModel`: Concrete depot address fields (name, street, city, postal code, country).
- `DefaultDepotDateAndTimesModel`: Opening/collection window representation for a depot date.
- `DefaultPrintConfirmationModel`: Data & formatted date strings for confirmation printing.
- `DefaultPrintPTLModel`: Data & formatted date/barcode strings for PTL form printing.
- `DefaultSelfCollectionModel`: Aggregates depot list, selection state and available collection dates.
- `DefaultViolationsModel`: Maintains a list of `MyDeliveryRuleViolation` grouped for responses.

## Core Service
- `DefaultMyDeliveryServiceBase`: Abstract/base class consolidating common utilities, property loading, locale resolution, and error mapping logic shared by services.
- `DefaultMyDeliveryService`: Concrete implementation of `MyDeliveryService`; orchestrates validation, option determination, consignment retrieval, redelivery confirmation, printing request building, and integration calls to ACLs.

## Helpers
- `LocaleHelper`: Resolves locale / language settings via system parameters & request hints.
- `PtlFormDataCreator`: Assembles `PtlFormData` from consignment + user input (dates, charges, references) with formatting.
- `ValidationHelper`: Wraps validation routines, collecting `ErrorContainer` entries into `ViolationsModel` results.

## AspectJ
- `Caching`: Aspect providing method-level caching (likely around read-only service methods) with logging and key generation.

## HTTP Utilities
- `HttpConfig`: Builds and configures Apache HttpClient (timeouts, credentials, proxy, pooling).
- `HttpProcessor`: Executes HTTP calls with retry / timeout handling, status code validation, entity reading, and logging.

## ACL (Anti-Corruption Layer) Adapters
- `apc.DefaultAPCAcl`: Wraps APC system calls (e.g., address/consignment lookups) adding validation & logging.
- `commoncodes.DefaultCommonCodesAcl`: Fetches and caches reference/common code data (e.g., country lists, option flags).
- `osc.DefaultOSCAcl`: Calls OSC service for operational service capabilities / country info; implements `OSCAcl` interface.
- `streamserve.DefaultStreamServeAcl`: Sends document generation requests (labels, confirmations) to StreamServe, handling marshalling and response parsing.

### StreamServe Support
- `PayloadCreator`: Builds XML request payload objects (`XmlRequest`, child elements) from domain data.
- `RequestHandler`: Marshals JAXB objects to XML bytes & logs payload.
- `ResponseHandler`: Interprets HTTP responses, captures errors, and extracts violation details.

### StreamServe JAXB Request/Response Classes
- `request.Address`, `Sender`, `Receiver`: Parties involved in document generation (name, address lines, contact fields).
- `request.Consignment`: Shipment identification (numbers, piece counts, weight).
- `request.Option`: Service option element inside product.
- `request.Product`: Product/service details with option list wrapper.
- `request.XmlRequest`: Root request envelope containing consignments, parties, metadata.
- `request.XmlResponse`: Root response capturing document generation outcome/status.

## Integration Domain / Redelivery Workflow
- `DefaultAddress`: Mutable address implementation with validation utilities; used in construction of requests.
- `DefaultConsignmentDetails`: Implementation linking underlying domain consignment to API `ConsignmentDetails`.
- `DefaultDeliverySystemParameter`: Simple key/value / typed parameter representation.
- `DefaultDepotAvailability`: Availability windows for self collection depots (dates & capacity info).
- `DefaultMyDeliveryPhoneNumber`: Implementation including formatting / sanitization logic.
- `DefaultPtlFormData`: Concrete `PtlFormData` including numeric fields (charges) and references.
- `DefaultRedeliveryConsignment`: Aggregate containing consignment base data, selected redelivery path, allowed options, and validation state.
- `DefaultRedeliveryConsignmentHelper`: Utility to derive permissible options based on consignment status, service codes, country rules.
- `DefaultRedeliveryConsignmentParameters`: Carries user selections (date, address variant, instructions) before constructing a request.
- `DefaultRedeliveryRequest`: Immutable request built from bean/parameters ready for confirmation.
- `DefaultRedeliveryRequestBean`: Mutable user form bean with raw input subject to validation.
- `DefaultRedeliveryRequestFactory`: Creates `RedeliveryRequest` from `RedeliveryRequestBean` after applying business rules.
- `DefaultSelfCollectionDepotInformation`: Collection of depots available for self collection (with geocodes & distances).
- `DeliveryRequestEnquiryService`: Interface to determine redelivery options for a consignment id.
- `MutableRedeliveryConsignment`: Internal mutable variant of `RedeliveryConsignment` for assembly.
- `MutableRedeliveryRequest`: Internal mutable representation used during factory construction.

## Reporting
- `MyDeliveryConfirmationDetail`: Value object aggregated for JasperReport (label fields, localized strings, images, map of dynamic values).
- `MyDeliveryConfirmationDetailBuilder`: Builds detail objects from `RedeliveryRequestBean` & other model data.
- `MyDeliveryConfirmationDetailLabels`: Resolves localized label names via CMS / message source.
- `MyDeliveryReportPrinter`: Implements `ReportPrinter`; compiles/fills JasperReports with provided detail/label data.

## Cross-Cutting Notes
- ReflectionToStringBuilder usage across models ensures consistent logging string form.
- Net.sf.oval annotations provide declarative validation in model & request classes.
- SimpleDateFormat usage suggests date formatting not yet migrated to thread-safe DateTimeFormatter; caution for concurrency.

## Extension Points
- Add new external system: create new `service.acl.<system>` package with interface in API module & implementation here.
- Introduce caching for a method: annotate or update `Caching` aspect pointcut expressions.
- Add new report: create builder, labels provider updates, and add printer method in `MyDeliveryReportPrinter`.

