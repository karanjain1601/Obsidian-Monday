# MyDeliveryServiceApi Module

API contracts (interfaces, enums, model interfaces, validators, utilities) shared across service implementation, web service, and presentation layers.

## Packages Overview
- `com.tnt.express.warp.mydelivery.service.api`: Core service interfaces & domain abstractions.
- `com.tnt.express.warp.mydelivery.model.api`: Data model interfaces consumed / produced by services.
- `com.tnt.express.mydelivery.validator`: Validation result & rule violation abstractions.
- `com.tnt.express.mydelivery.validator.annotation`: Custom validation annotations & validators.
- `com.tnt.express.mydelivery.service.email.api`: Email template data contracts.
- `com.tnt.express.mydelivery.util`: Shared utility helpers (sorting, country phone metadata).

## Service API Interfaces
- `APCAcl`: Abstraction to APC (external) system operations.
- `Address`: Domain representation of an address (getter/setter contract).
- `ConsignmentDetails`: Contract exposing consignment-level shipment, status and redelivery metadata.
- `DeliverySystemParameter`: Represents a dynamic system parameter key/value pair.
- `DepotAvailability`: Abstraction of depot opening times / availability windows.
- `EmailSender`: Contract for sending templated emails (likely asynchronous / queued).
- `MyDeliveryPhoneNumber`: Structured phone number with type & validation semantics.
- `MyDeliveryPhoneNumberType`: Enum describing number categories (MOBILE, LANDLINE, etc.).
- `MyDeliveryService`: Primary façade for MyDelivery business operations (consignment lookup, options, confirmation, etc.).
- `MyDeliveryStatusCode`: Enum of internal workflow state / error or user journey codes.
- `PtlFormData`: Data needed to print a "Pending To Leave" (PTL) form.
- `RedeliveryConsignment`: Aggregate describing a consignment and permissible redelivery actions.
- `RedeliveryConsignmentParameters`: Mutable / builder style parameters for requesting redelivery.
- `RedeliveryOption`: Enum of supported redelivery modes (ORIGINAL_ADDRESS, ALTERNATIVE_ADDRESS, NEIGHBOUR, SELF_COLLECTION, LEAVE_IN_ABSENCE...).
- `RedeliveryRequest`: Immutable representation of a chosen redelivery request.
- `RedeliveryRequestBean`: Mutable form/backing bean for user input before confirmation.
- `RedeliveryRequestFactory`: Factory building validated `RedeliveryRequest` instances from beans / parameters.
- `ReportConstants`: Constants used for report parameter names, template ids, resource keys.
- `ReportPrinter`: Generic report generation contract (JasperReports integration expected).
- `ScreenNavigationStep`: Enum describing UI flow screens.
- `SelfCollectionDepotInformation`: Aggregate for depots supporting self collection (list, geocodes, opening hours).
- `StreamServeAcl`: Abstraction for calling StreamServe document generation service.
- `SupplyPostcodeRule`: Rule enumeration for postcode supply/validation logic.

## Model Interfaces
- `AvailableOptionsModel`: Encapsulates the set of available redelivery options and any violations/warnings.
- `BaseResponseModel`: Common response structure (success flags, violations, timestamps).
- `ConfirmationModel`: Data returned after a successful confirmation (references, print tokens, etc.).
- `CountryMetadataModel`: Country-specific rules (postcode formats, phone prefixes, locale config).
- `DatesModel`: Collection of available delivery date slots (with logic for ordering / earliest date).
- `DepotAddressModel`: Basic depot address details.
- `DepotDateAndTimesModel`: Per-depot date/time window (opening hours, earliest collection date).
- `PrintConfirmationModel`: Data for printing confirmation receipt.
- `PrintPTLModel`: Data for printing PTL forms (date formatting, barcode id, etc.).
- `SelfCollectionModel`: Data shown during self collection option (depots, dates, selection state).
- `ViolationsModel`: Aggregated validation / rule violations (codes, severities, messages).

## Validator Core
- `ErrorContainer`: Holds validation errors grouped by field or category.
- `FieldLengthConstants`: Centralized field max/min length constraints.
- `IEnumErrorCode`: Interface for error enums (code -> default message mapping).
- `MyDeliveryRuleViolation`: Represents a single violated rule (code, severity, field, message).
- `Severity`: Enum for violation severity (INFO/WARN/ERROR/FATAL etc.).
- `ValidationResult`: Interface conveying success state and list of violations.
- `ValidationResultImpl`: Concrete implementation of `ValidationResult`.
- `ValidatorFactory`: Produces validators for beans / requests (likely OVal or custom logic integration).

## Validation Annotations
- `annotation.NotNullOrEmpty`: Custom annotation enforcing non-null/non-empty string.
- `annotation.IsValidEmail`: Annotation for email format validation.
- `annotation.impl.NotNullOrEmptyValidator`: Logic backing NotNullOrEmpty.
- `annotation.impl.IsValidEmailValidator`: Email validation logic (regex + potential domain rules).

## Email Data Contracts
- `RedeliveryAlternativeDeliveryAddressData`
- `RedeliveryCollectFromTNTData`
- `RedeliveryLeaveInMyAbsenceAtNeighbourData`
- `RedeliveryLeaveInMyAbsenceWithInstructionsData`
- `RedeliveryOriginalAddressData`
  Each provides strongly typed getters exposing all tokens required to render its corresponding email template variant.

## Utilities
- `CountryPhonePrefixes`: Mapping of country -> phone prefix list (used for phone validation & UI drop-downs).
- `SortByValueComparator`: Generic comparator to sort map entries by value.
- `Util`: Miscellaneous helper methods (string trimming, safe parsing, etc.).

## Model API Usage Patterns
These interfaces are implemented in the `MyDeliveryServiceImpl` module under `model.impl`. They are serialized back to clients via web service endpoints (`MyDeliveryWebService`), or adapted into presentation beans in the presentation module.

## Extension Points
- New redelivery option: add enum, extend factory, update `AvailableOptionsModel` & UI decorators.
- New validation rule: implement `IEnumErrorCode` constant, integrate into validation helper/factory.
- New email template: create API data interface and implementation + email sender adaptation.

