# MyDeliveryWebService Module

Spring MVC / Controller style web service layer exposing MyDelivery operations over HTTP (likely REST-like or RPC-style endpoints) translating HTTP params to service API calls and returning serialized model responses.

## Packages
- `webservice.impl`: Controllers / base classes orchestrating request parsing and service invocation.
- `webservice.param.impl`: Parameter (VO) classes representing inbound request payloads / query params.
- `webservice.result.impl`: Result (VO) classes representing outbound responses (wrap model implementations and add HTTP-level metadata).

## Controllers
- `MyDeliveryWebServiceBase`: Base controller with shared parsing (date, locale), validation glue, and response assembly utilities.
- `MyDeliveryWebService`: Concrete controller mapping HTTP endpoints to service methods: consignment details, available options/dates, confirmation (various address modes), phone prefix retrieval, etc.

## Request Parameter Value Objects
Each Param/VO class encapsulates inputs for a specific endpoint, often extending common base parameter classes that include shared fields such as consignment id, country code, locale, security tokens.

- `AlternativeAddressAvailableDatesParamVO`: Parameters for fetching available dates when choosing an alternative address.
- `AlternativeAddressConfirmParamVO`: Confirmation parameters for alternative address redelivery.
- `AlternativeAddressVO`: Nested structure for alternative address details (contact name, lines, postal code, etc.).
- `AvailableDatesParamVO`: Base for endpoints retrieving available delivery / collection dates for chosen option.
- `ConfirmParamVO`: Base for confirmation actions (option selection + required contact data).
- `ConsignmentDetailsParamVO`: Parameters for requesting consignment detail at original address (id, country, locale).
- `ConsignmentDetailsB2CParamVO`: Variant including B2C-specific fields (maybe email/phone or marketing consent).
- `ConsignmentRedeliverableParamVO`: Parameters to quickly test if a consignment is redeliverable (id, destination data, date).
- `LeaveWithNeighbourConfirmParamVO`: Confirmation for leave-with-neighbour option (neighbour address & contact data).
- `LocaleDataParamVO`: Parameters for retrieving localized content fragments (app name, locale id).
- `MyDeliveryWebServiceBaseParam`: Common base with tracing / correlation / authentication tokens.
- `MyDeliveryWebServiceCommonSystemsBaseParam`: Base including system codes shared across multiple endpoints.
- `NeighbourAddressVO`: Structure capturing neighbour address & contact when leaving in neighbour's absence.

## Result Value Objects
Wrap `DefaultBaseResponseModel` to provide consistent envelope (violations, status codes, messages) plus endpoint-specific payload fields.

- `AddressForPrefillResultVO`: Contains address data for pre-populating UI forms based on consignment id & option.
- `AvailableOptionsResultVO`: Carries set of `RedeliveryOption` plus any violations messages.
- `CheckPhoneNumbersResultVO`: Outcome of phone validation (normalized numbers, error codes).
- `ConsignmentDetailsResultVO`: Full consignment detail payload (pieces, weight, status, service codes) & violations.
- `CountrySelectionsResultVO`: Lists available destination or origin country selections (id->label mappings).
- `LocaleDataResultVO`: Localized label/value map for UI consumption.
- `PhonePrefixesResultVO`: Country phone prefix collection for UI dropdowns.
- `RedeliveryOptionResultVO`: Simple bean with delivery option id and flag whether additional info is required client-side.

## Common Field Patterns
- Equals / HashCode / ToString implemented via Apache Commons Lang builders for uniform logging & caching.
- Net.sf.oval `@NotNull` annotations appear on required fields in result classes for runtime validation.

## Data Flow Summary
1. HTTP request hits `MyDeliveryWebService` mapped method.
2. Request params bound into specific *ParamVO* (Spring binding / maybe custom binder).
3. Controller delegates to `MyDeliveryService` (impl in ServiceImpl module).
4. Service returns model implementation; controller wraps into *ResultVO*.
5. Violations / messages aggregated into base response fields.
6. Result serialized (likely as JSON or XML) to client.

## Extension Guidance
- Add new endpoint: define ParamVO (input), extend `MyDeliveryWebServiceBase` for transformation, implement in `MyDeliveryWebService`, create ResultVO if needed, update documentation.
- Add new redelivery confirmation variant: create specialized ConfirmParamVO subclass & adapt service call.

## Validation & Localization
- ParamVO classes define structure; actual validation executed by service layer (`ValidationHelper`) or OVal annotations.
- Locale resolution assisted by base class methods leveraging `LocaleHelper` from service implementation.

