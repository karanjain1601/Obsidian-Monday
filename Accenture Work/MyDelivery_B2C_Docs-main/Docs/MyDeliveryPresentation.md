# MyDeliveryPresentation Module

Presentation/UI layer (likely Spring MVC + JSP/Tiles + DWR) responsible for web user interface, view resolution, decorators, servlets for printing, conversion, and client-side validation endpoints.

## Packages
- `com.spring.tiles.configurer`: Custom Tiles view resolver & configurer extensions.
- `com.spring.dwr.configurer`: DWR servlet configuration integration.
- `com.tnt.express.warp.mydelivery.ui.servlet`: Legacy servlets handling printing & setup tasks.
- `com.tnt.express.warp.mydelivery.ui.remote`: DWR-exposed remote validation & address lookup.
- `com.tnt.express.warp.mydelivery.ui.validators`: UI-level validator (form bean checks before service call).
- `com.tnt.express.warp.mydelivery.ui.decorator`: Screen flow decorators controlling navigation / rendering.
- `com.tnt.express.warp.mydelivery.ui.conversion`: Type converters (date parsing/formatting) and conversion service.
- `com.tnt.express.warp.mydelivery.ui.filter`: Servlet filter(s) applying cross-cutting web concerns.
- `com.tnt.express.warp.mydelivery.address.enquiry.api`: Address search API (probably an internal adaptor for front-end autocomplete).
- `com.tnt.express.warp.mydelivery.util`: UI-specific utilities (URL construction, etc.).

## View / Tiles Infrastructure
- `ExtUrlBasedViewResolver`: Extends Spring's resolver to support Tiles + maybe custom fallback logic.
- `SpringTilesConfigurer`: Configures Tiles definitions and refresh settings.
- `ExtTilesView`: Customized Tiles view enabling additional model exposure (maybe locale or dynamic definitions).

## UI Utilities
- `UrlUtil`: Helper for constructing application URLs or rewriting paths (handles locale, context path).

## Validators
- `DefaultRedeliveryRequestBeanValidator`: UI-level validation for `RedeliveryRequestBean` prior to server submission (lengths, required fields, phone, email).

## Remote / DWR
- `DwrPhoneValidation`: Exposes phone validation result via AJAX without full form submission.
- `GlobalAddress`: Provides address lookup / standardization remote calls.
- `GlobalAddressResults`: DTO encapsulating address search response states.

## Servlets
- `SetupAppServlet`: Initialization (loading caches, config, warm-ups) on application startup.
- `PrintMyDeliveryPTLFormServlet`: Streams PTL form PDF to browser using `ReportPrinter`.
- `PrintMyDeliveryConfirmationDetailsServlet`: Streams confirmation details PDF.
- `AbstractPrintServlet`: Base providing common printing logic (parameter extraction, response headers, error handling).
- `ResourceServletException`: Exception wrapper for resource streaming errors.

## Decorators (Navigation / Flow)
Each decorator corresponds to a UI step or option, setting up model attributes, deciding next/previous steps, and applying availability rules.
- `AlternativeAddressDecorator`
- `AvailableOptionsDecorator`
- `ConfirmationDecorator`
- `EnterContactDetailsDecorator`
- `InitDecorator`
- `LeaveInAbsenceDecorator`
- `LeaveWithNeighbourDecorator`
- `MyDeliveryDecorator`: Central orchestrator or base for decorators.
- `OriginalAddressDecorator`
- `RedeliveryOptionsDecorator`
- `SelfCollectionDecorator`

## Converters
- `DateConverter`: Parses and formats dates for UI forms (supports multiple patterns & locale-specific formatting).
- `CustomConversionService`: Registers converters (date, enums) for Spring binding.

## Filters
- `MyDeliveryFilter`: Applies pre/post-processing (e.g., character encoding, locale injection, security checks) across requests.

## Address Enquiry API
- `AddressDTO`: Data Transfer Object for address search results.
- `AddressRepositoryException`: Thrown when address search backend fails.
- `AddressSearchCompletionState`: Enum reflecting completion / partial match status.
- `AddressSearchCriteria`: Inputs for address search (query text, country, limit).
- `AddressSearchResult`: Collection of `AddressDTO` with metadata like total matches.

## Interaction Flow
1. User enters consignment id; `InitDecorator` prepares initial view.
2. System determines available options; `AvailableOptionsDecorator` prepares list.
3. User chooses option; relevant decorator (e.g., `AlternativeAddressDecorator`) sets form state.
4. `EnterContactDetailsDecorator` collects contact & scheduling info.
5. `ConfirmationDecorator` shows summary; print servlets optionally generate PDFs.
6. Global address & phone DWR services enhance UX via AJAX.

## Extension Points
- New UI step: create decorator implementing shared base interface & add to navigation chain.
- Add converter: register within `CustomConversionService`.
- New remote validation: expose DWR bean & configure in DWR servlet config.

