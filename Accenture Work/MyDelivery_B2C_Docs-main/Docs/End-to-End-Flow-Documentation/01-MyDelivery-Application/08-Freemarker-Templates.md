# Freemarker Templates (MyDelivery)

## Overview
MyDelivery uses Freemarker templates to render HTML pages for some views. This document describes the template directory structure, common macros and includes, view resolver configuration, and best practices.

---

## Template Locations
- Templates typically reside under `src/main/webapp/WEB-INF/templates/` or `src/main/resources/templates/` depending on the module.
- Example view resolver maps logical view names to `/WEB-INF/templates/{viewName}.ftl`.


## Common Macros & Includes
- `layout.ftl` — base layout for header/footer
- `macros/form-macros.ftl` — form helpers to render input fields with validation messages
- `macros/pagination.ftl` — pagination controls


## View Resolver
- Spring `FreeMarkerViewResolver` is configured in Spring web context (`webflow-servlet.xml` or equivalent) with:
  - `prefix` = `/WEB-INF/templates/`
  - `suffix` = `.ftl`


## Variable Exposure
- Controllers and WebFlow pass model attributes into the view scope; Freemarker templates reference these attributes directly.
- Common variables: `user`, `messages`, `formBackingObject`, `optionsList`


## Example Template Snippet
```ftl
<#-- Example: show available delivery options -->
<#list options as opt>
  <div class="option">
    <h3>${opt.name}</h3>
    <p>${opt.description}</p>
  </div>
</#list>
```


## i18n / Message Bundles
- Message bundles are configured in Spring as `ResourceBundleMessageSource` with base names pointing to properties files under `resources/properties/`.
- In templates, use `${springMacroRequestContext.getMessage('key')}` or model-provided `messages` map.


## Best Practices
- Keep templates logic-free; put complex logic in action beans or services.
- Use macros for repeated UI patterns.
- Cache templates in production for performance.


## References
- Search for `.ftl` files in `MyDeliveryPresentation` and component modules.
- `webflow-servlet.xml` for view resolver configuration.

---

## Purpose

Document how Freemarker templates are used by MyDelivery, which template files back which flow/view-states, how template variables map to Spring Web Flow scope/model/backing beans, and operational troubleshooting tips for template rendering issues.

## Where to look (files & locations)

- Template files: search `MyDeliveryPresentation/src/main/webapp/WEB-INF` and subfolders for `*.ftl` files.
- View resolver configuration: check presentation module Spring context and `web.xml` for the `FreemarkerServlet` entry and any view resolver bean configuration that maps logical view names to `.ftl` files.
- Controllers / flow view-states: `WEB-INF/flows/*.xml` files reference view names that resolve to `.ftl` templates.
- DTOs/Beans used by templates: `MyDeliveryServiceApi` and `MyDeliveryServiceImpl` provide RedeliveryRequestBean/DTOs used in templates.

## Common scopes and where variables come from

- flowScope: populated by `on-entry`/action/decoration methods in the flow definition (use for transient per-flow data).
- viewScope: used for rendering stateful data while the view is shown.
- requestScope: populated by controllers or action-state methods for one-time render data.
- sessionScope: persistent user session attributes such as locale, user preferences.
- model attributes: when controllers return a model map (Map<String,Object>), Freemarker resolves keys directly.

Most templates access properties on the `redeliveryRequest` bean or smaller DTOs exposed into the view. Examples include: `redeliveryRequest.trackingNumber`, `redeliveryRequest.deliveryAddress.postcode`, and `availableOptions` (a List).

## Typical template variable map examples

- Confirmation page (`confirmation.ftl` - example mapping):
  - `redeliveryRequest` -> RedeliveryRequestBean in flowScope
  - `address` -> redeliveryRequest.deliveryAddress
  - `showChangeLinks` -> boolean flag computed by decorator
  - `messages` -> i18n message bundle (via spring macro or message tool)

- Address fragment (`address-fragment.ftl` - example mapping):
  - `address` -> DeliveryAddress DTO
  - `formattedLines` -> helper method output or Freemarker macro for lines

- Landing / lookup page (`index.ftl`):
  - `trackingNumber` -> request param or small backing bean
  - `serviceArea` -> helper object injected into model

Note: boolean properties must have getters compatible with Freemarker. For example prefer `getTermsAndConditionsAccepted()` in DTOs instead of `isTermsAndConditionsAccepted()` if code comments state this is required — check `RedeliveryRequestBean` for examples.

## Example Freemarker fragments (how templates read model)

- Iterate list:
  - <#list availableOptions as option>
      ${option.displayName}
    </#list>

- Safe navigation for possibly null nested objects:
  - ${address?if_exists.postcode!""}

- Date formatting macros: prefer project's shared date macro or use `?string("dd-MM-yyyy")` with care for nulls.

## Common rendering errors & troubleshooting

- Missing variable: check which scope populates the key (flow/view/request/session) and the `on-entry`/action that should set it. Enable DEBUG for Spring Web Flow to see scope population logs.
- NullPointerException in template: often caused by missing defaults. Use Freemarker safe-navigation (`?if_exists`) or default operator (`!""`) in templates.
- Boolean getter issues: verify DTO getter name. See `RedeliveryRequestBean` comments about boolean getters and Freemarker.
- Encoding issues: verify servlet response encoding and `FreemarkerServlet` configuration; templates should use `<#ftl encoding="UTF-8">` where needed.

## Testing and validation

- Render templates in unit tests: the `MyDeliveryPresentation` module contains test support for Freemarker templates (search `AbstractFreemarkerTemplate` in tests). Use it to assert rendered fragments.
- In a running instance: hit the view-state that renders the template and inspect the produced HTML and model values by temporarily enabling DEBUG logging in the flow and controller layers.

## Operational notes

- When changing DTO field names, update templates or add legacy getter aliases in DTOs to avoid runtime errors.
- When upgrading Freemarker, test macros and date formatting as behavior may change across versions.

## Next steps (work to finish in exhaustive mode)

- Extract the exact variable set for each `.ftl` file and insert a per-template variable table (filename → keys and source field) into this document.
- Add extracted example fragments from production templates (confirmation, address fragment, print templates).

---

## Per-template variable maps (extracted from `WEB-INF/views`)

Notes on sources used below:
- defaultRedeliveryRequestBean — the primary form/backing bean exposed into viewScope or as `modelAttribute` in forms; fields are properties on that bean or its nested DTOs.
- flowScope / flowRequestContext — Spring Web Flow context variables injected into views (e.g., `flowExecutionUrl`, `flowExecutionKey`, `flowRequestContext`).
- requestScope / request params — values passed by the controller or redirect (e.g., `conId`, `countryName`).
- model attributes — variables placed into the model map by action/controller beans (e.g., `availableOptions`, `availabledates`, `formattedDate`, `message`).
- macros — variables and helpers defined in `mydeliverysnippets.ftl` and `spring.ftl` that templates import and call.

Each template below shows the most relevant variables observed in the template source. Use these maps when editing templates or when adding new fields to `RedeliveryRequestBean`.

---

Template: `templates/defaultTemplate.ftl`
- Variables available:
  - `mydel.appVersion` — from `mydeliverysnippets.ftl` (appVersion macro/assign)
  - `flowExecutionUrl` (sometimes used by inserted pages) — flow redirect helper
  - `staticResourcesLocation` (set inline)
  - `defaultRedeliveryRequestBean` (used indirectly by included snippets/macros)
  - `orientation` / `tiles` / `cq` / `c` taglib helpers — taglib variables imported at top
- Sources: global template includes, macros in `mydeliverysnippets.ftl`, and `spring.ftl` tools
- Notes: includes DWR JS stubs (`/dwr/interface/DWRRemote.js` and `DWRPhoneValidation.js`) and references `${mydel.appVersion}` for cache-busting.

---

Template: `spring.ftl` (library)
- Exposes macros and helper variables used across templates and form macros:
  - `springMacroRequestContext` (provided by Spring FreeMarkerConfigurer when exposeSpringMacroHelpers=true)
  - Macros: `message`, `url`, `bind`, `formInput`, `formTextarea`, `formCheckbox`, etc.
- Sources: Spring FreeMarker support
- Notes: Not a page template — used by other templates for binding and i18n. When upgrading Spring, validate macro compatibility.

---

Template: `common/mydeliverysnippets.ftl`
- Provides many shared macros and uses these variables:
  - `defaultRedeliveryRequestBean` — referenced for appVersion, fieldLengthConstants and countryMetadata
  - `flowExecutionUrl`, `flowRequestContext` — used in macros that render navigation and error boxes
  - `appVersion` alias (`?version=${defaultRedeliveryRequestBean.appVersion}`)
- Key macros that expose behaviour to pages: `pageTitle`, `stepoMeter`, `error`, `warning`, `sectionHeading`, `displayAddressSearchBox`, `displayMapLink`, `backButton`, and many UI fragments.
- Notes: Macros expect `flowRequestContext` to exist (provided by Spring Web Flow). Many macros rely on `defaultRedeliveryRequestBean.fieldLengthConstants` and `countryMetadata` — ensure bean populates these.

---

Template: `redelivery/enterDetails.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` (modelAttribute) — fields used:
    - `fieldLengthConstants.CONSIGNMENT_ID`, `originalDeliveryTown`, `originalDeliveryProvince`, `originalDeliveryCountryISOCode`
    - `countryMetadata.supplyPostcodeRule`, `fieldLengthConstants.POSTALCODE`
  - `conId` — request param used to prefill `consignmentId` input value
  - `countryName` — request attribute (display-only country name)
  - `flowExecutionKey` — flow execution hidden field
  - macros from `mydeliverysnippets` (e.g., `cemvalues`, `stepoMeter`)
- Sources: form backing bean (`defaultRedeliveryRequestBean`), request params (`conId`, `countryName`), flow context
- Notes: postcode input is conditional based on `countryMetadata.supplyPostcodeRule`; ensure `countryMetadata` is populated in flow pre-entry.

---

Template: `redelivery/redeliveryOptions.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` — fields: `previousSelectedOption`, `getWrongAddress()`, `consignmentId`, `skipEnterDetails`
  - `availableOptions` — model attribute with `.options` list; each `option` has `identifier`, `code`, `label`, `additionalInfo` (used for rendering images/links)
  - `_cem_App`, `_cem_CCode` — tracking params for CEM (instrumentation) present in generated links
  - `flowExecutionUrl`, `flowRequestContext`, `flowExecutionKey`
- Sources: service that populates `availableOptions` (from presentation action / decorator), `defaultRedeliveryRequestBean` in flowScope
- Notes: Template iterates `availableOptions.options` and references `option.identifier` and `option.code` to build event links. When adding new options, update `availableOptions` provider.

---

Template: `redelivery/redeliverToAlternateAddress.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` (form backing bean) — many fields:
    - `redeliveryContactName`, `redeliveryCompanyName`, `redeliveryAddressLine1/2/3`, `redeliveryTown`, `redeliveryProvince`, `redeliveryCountryISOCode`, `redeliveryPostcode`
    - `redeliveryCountryPhonePrefixMobile/Home/Work`, `redeliveryMobilePhone`, `redeliveryHomePhone`, `redeliveryWorkPhone`
    - `countryMetadata.supplyPostcodeRule`, `fieldLengthConstants`
    - `selectedOption.additionalInfo`, `termsAndConditionsAccepted`, `postcodeIgnore`, `appVersion`
  - `availabledates` — list of available dates (model attribute) used to render radiobuttons
  - `availableDates` (JS var) — set by template if `availabledates` present
  - macros: `displayAddressSearchLink`, `displayAddressSearchBox`, `backButton`, `continueButtonTermsConditionChk`
  - `flowExecutionUrl`, `flowExecutionKey`
- Sources: decorator/action populates `availabledates` and the bean fields; macros rely on `defaultRedeliveryRequestBean.countryPhonePrefixes` to render country phone selects
- Notes: Phone validation uses DWR `DWRPhoneValidation.phones(...)` and relies on `<dwr:remote>` export of the phone validation bean.

---

Template: `redelivery/enterContactDetails.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` (modelAttribute) — fields:
    - `contactName`, `countryPhonePrefixMobile/Home/Work`, `countryPhonePrefixes` (list), `mobilePhone`, `homePhone`, `workPhone`, `fieldLengthConstants.*`, `emailAddress`, `showStopperError`
  - `flowExecutionKey`, `flowExecutionUrl`
  - macros: `cemvalues`, `backButton`, `confirmButton`
  - DWR `DWRPhoneValidation` client stub is used in inline JS
- Sources: flow-scoped backing bean and supporting lists (countryPhonePrefixes)
- Notes: Templates bind selects using Spring `bind` macro to create unique ids; JS selects `#countryPhonePrefixMobile` ids which come from spring bind status expression — avoid refactoring bind names.

---

Template: `redelivery/confirmDetails.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` — many fields used for display:
    - `consignmentId`, `contactName`, `redeliveryContactName`, `redeliveryCompanyName`, `ptlCountries` (List), `originalDeliveryCountryISOCode`, `formattedDate`, `selectedOption`, `redeliveryInstructions`, `mobilePhone`, `workPhone`, `homePhone`, `emailAddress`
  - `message` — string used to decide which confirmation fragment to include (e.g., `mydelivery.leaveinabsenceconfirm.success.message`)
  - `formattedDate` — model attribute, date string for display
  - Imported fragments/macros: `originalAddress.details`, `selfCollect.details`, `alternateAddress.details`, `leaveInAbsence.details`, `leaveWithNeighbour.details`
  - `flowExecutionUrl` (for print links) and `flowExecutionKey`
- Sources: flow action prepares `formattedDate` and `message`; fragments expect `defaultRedeliveryRequestBean` to hold address/contact fields
- Notes: Print button links to flow event `printConfirmation` or `printPTL` — ensure print endpoints accept `deliveryRequestId` or flow key as required.

---

Template: `redelivery/originalAddressConfirm.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` — fields:
    - `originalDeliveryAddressLine1/2/3`, `originalDeliveryTown`, `originalDeliveryPostcode`, `countryDisplayName`, `mobilePhone`, `workPhone`, `homePhone`, `emailAddress`, `selectedOption.additionalInfo`, `redeliveryInstructions`
- Sources: `DefaultRedeliveryRequestBean` populated from domain `DeliveryRequest` or DTO
- Notes: Uses `textarea` to render long instructions; uses safe-defaults (`!""`) in parent templates to avoid null rendering issues.

---

Template: `redelivery/selfCollectConfirm.ftl`
- Variables used:
  - `selfCollectModel` — model attribute with fields: `addressLine1/2/3`, `town`, `postcode`, `coordinateX`, `coordinateY`, `town`, `postCode`
  - `defaultRedeliveryRequestBean.countryDisplayName`
  - `depotTimes` — model attribute (string) to show opening times
  - `defaultRedeliveryRequestBean.mobilePhone`, `workPhone`, `homePhone`, `emailAddress`
- Sources: service that resolves depot details and populates `selfCollectModel` and `depotTimes` before rendering confirmation
- Notes: Map link rendering checks `selfCollectModel.coordinateY` presence.

---

Template: `redelivery/leaveWithNeighbour.ftl` and `redelivery/leaveWithNeighbourConfirm.ftl`
- Variables used (both):
  - `defaultRedeliveryRequestBean` — fields: likely `redeliveryContactName`, `redeliveryAddressLine1/2/3` or neighbour fields, `redeliveryTown`, `redeliveryPostcode`, `redeliveryCompanyName`, contact phones/emails
  - `message` and `formattedDate` (confirm template)
- Sources: flow/backing bean
- Notes: Confirm template imports which fields to display; ensure bean contains neighbour-specific fields if added.

---

Template: `redelivery/leaveInAbsence.ftl` and `redelivery/leaveInAbsenceConfirm.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` — fields: `originalDelivery...` or `redelivery...` depending on option, `redeliveryInstructions`, `selectedOption`, contact phones, `ptlCountries`
  - `message`, `formattedDate` in confirm template
- Sources: flow beans
- Notes: Confirmation determines PTL availability by checking `ptlCountries` contains `originalDeliveryCountryISOCode`.

---

Template: `redelivery/collectFromTNTDepot.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean` — fields used for display: contact phones, email, `countryDisplayName`
  - `availableDepotList` or `selfCollectModel` (depending on implementation) — list of depots with addresses and coordinates
  - `flowExecutionUrl`, `flowExecutionKey`
- Sources: depot lookup service populates depot list
- Notes: Template may include map link macro; ensure coordinates are numeric strings.

---

Template: `redelivery/redeliverOriginalAddress.ftl` (if present)
- Variables used:
  - `defaultRedeliveryRequestBean.originalDelivery*` fields (address lines, town, postcode), contact phones, `selectedOption`
  - `availabledates` (if date selection applicable)
  - `flowExecutionUrl`, `flowExecutionKey`
- Sources: flow bean + reference data

---

Template: `redelivery/alternateAddressConfirm.ftl`
- Variables used:
  - `defaultRedeliveryRequestBean.redeliveryContactName`, `redeliveryCompanyName`, `redeliveryAddressLine1/2/3`, `redeliveryTown`, `redeliveryPostcode`, `countryDisplayName`, contact phones, `redeliveryInstructions`
- Sources: flow bean

---

General notes and common pitfalls
- Boolean getters: FreeMarker sometimes expects `getX()` rather than `isX()` — check `RedeliveryRequestBean` for boolean getter naming (the code comments indicate `getTermsAndConditionsAccepted()` is used for Freemarker compatibility).
- Null safety: templates frequently use `??` checks and `!""` defaults. When adding new fields to beans always provide non-null defaults or update templates to guard against nulls.
- ID binding: Spring `bind` macro creates generated `id` values used by JS; if you refactor form paths, update JS selectors that reference those ids (e.g., `#countryPhonePrefixMobile`).
- DWR stubs: templates include DWR client JS by name (e.g., `DWRRemote.js`, `DWRPhoneValidation.js`). If DWR bean names change, update template includes.

Next steps (if you want exhaustive detail):
- I can extract every field used (full property path) and the exact Java field or getter method on `DefaultRedeliveryRequestBean` / `RedeliveryRequestBean` and insert a table per template mapping template variable → bean getter (file + line ranges). This requires reading the bean classes and will be the next pass.

---

## Per-template exact variable → Java getter/field mapping (exhaustive pass)

NOTE: where variables come from the Spring Web Flow runtime (flowExecutionUrl, flowExecutionKey, flowRequestContext) or from request parameters they are marked as such. All bean getters below reference the implementation class `DefaultRedeliveryRequestBean` unless otherwise noted.

Template: `redelivery/enterDetails.ftl`
- defaultRedeliveryRequestBean.fieldLengthConstants.CONSIGNMENT_ID
  - Field: FieldLengthConstants.CONSIGNMENT_ID
  - Getter: `com.tnt.express.mydelivery.validator.FieldLengthConstants.getCONSIGNMENT_ID()`
  - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery\MyDeliveryServiceApi\src\main\java\com\tnt\express\mydelivery\validator\FieldLengthConstants.java (approx. lines 1-80)
- defaultRedeliveryRequestBean.originalDeliveryTown
  - Getter: `com.tnt.express.warp.mydelivery.service.integration.DefaultRedeliveryRequestBean.getOriginalDeliveryTown()`
  - File: c:\Users\6687869\Applications\MyDelivery\eai-3532120-mydelivery\MyDeliveryServiceImpl\src\main\java\com\tnt\express\warp\mydelivery\service\integration\DefaultRedeliveryRequestBean.java (lines ~468-476)
- defaultRedeliveryRequestBean.originalDeliveryProvince
  - Getter: `DefaultRedeliveryRequestBean.getOriginalDeliveryProvince()`
  - File: same as above (lines ~482-488)
- defaultRedeliveryRequestBean.originalDeliveryCountryISOCode
  - Getter: `DefaultRedeliveryRequestBean.getOriginalDeliveryCountryISOCode()`
  - File: same as above (lines ~524-532)
- defaultRedeliveryRequestBean.originalDeliveryPostcode
  - Getter: `DefaultRedeliveryRequestBean.getOriginalDeliveryPostcode()`
  - File: same as above (lines ~497-504)
- conId (request param)
  - Source: request parameter `conId` set by controller/flow (not a bean getter)
- countryName (display-only)
  - Source: request attribute placed by decorator/action before view render
- flowExecutionKey, flowExecutionUrl, flowRequestContext
  - Source: Spring Web Flow (provided by the view rendering context)


Template: `redelivery/redeliveryOptions.ftl`
- defaultRedeliveryRequestBean.previousSelectedOption
  - Getter: `DefaultRedeliveryRequestBean.getPreviousSelectedOption()`
  - File: DefaultRedeliveryRequestBean.java (lines ~300-312)
- defaultRedeliveryRequestBean.consignmentId
  - Getter: `DefaultRedeliveryRequestBean.getConsignmentId()`
  - File: DefaultRedeliveryRequestBean.java (lines ~368-376)
- defaultRedeliveryRequestBean.getWrongAddress() / getWrongAddress
  - Getter: `DefaultRedeliveryRequestBean.getWrongAddress()` (boolean)
  - File: DefaultRedeliveryRequestBean.java (search for getWrongAddress method; present in class)
- availableOptions (model attribute)
  - Source: decorator/action that populates the model before rendering (see `DefaultMyDeliveryService` / decorator classes referenced in `04-Spring-WebFlow-Configuration.md`)
- _cem_App, _cem_CCode
  - Source: tracking parameters injected by decorator / macro (flow context)
- flowExecutionUrl, flowRequestContext
  - Source: Spring Web Flow


Template: `redelivery/redeliverToAlternateAddress.ftl`
- defaultRedeliveryRequestBean.redeliveryContactName
  - Getter: `DefaultRedeliveryRequestBean.getRedeliveryContactName()`
  - File: DefaultRedeliveryRequestBean.java (lines ~640-648)
- defaultRedeliveryRequestBean.redeliveryCompanyName
  - Getter: `DefaultRedeliveryRequestBean.getRedeliveryCompanyName()`
  - File: DefaultRedeliveryRequestBean.java (lines ~652-660)
- defaultRedeliveryRequestBean.redeliveryAddressLine1/2/3
  - Getters: `getRedeliveryAddressLine1()`, `getRedeliveryAddressLine2()`, `getRedeliveryAddressLine3()`
  - File: DefaultRedeliveryRequestBean.java (getRedeliveryAddressLine1 at lines ~700-706)
- defaultRedeliveryRequestBean.redeliveryTown / redeliveryProvince / redeliveryPostcode / redeliveryCountryISOCode
  - Getters: `getRedeliveryTown()`, `getRedeliveryProvince()`, `getRedeliveryPostcode()`, `getRedeliveryCountryISOCode()`
  - File: DefaultRedeliveryRequestBean.java (lines ~724-744)
- defaultRedeliveryRequestBean.redeliveryCountryPhonePrefixMobile / Home / Work
  - Getters: `getRedeliveryCountryPhonePrefixMobile()`, `getRedeliveryCountryPhonePrefixHome()`, `getRedeliveryCountryPhonePrefixWork()`
  - File: DefaultRedeliveryRequestBean.java (lines ~760-780)
- defaultRedeliveryRequestBean.redeliveryMobilePhone / redeliveryHomePhone / redeliveryWorkPhone
  - Getters: `getRedeliveryMobilePhone()`, `getRedeliveryHomePhone()`, `getRedeliveryWorkPhone()`
  - File: DefaultRedeliveryRequestBean.java (lines ~786-804)
- defaultRedeliveryRequestBean.termsAndConditionsAccepted
  - Getter: `DefaultRedeliveryRequestBean.getTermsAndConditionsAccepted()` or boolean accessor (check bean for `getTermsAndConditionsAccepted()` / `isTermsAndConditionsAccepted()`)
  - File: DefaultRedeliveryRequestBean.java (boolean property methods exist in bean)
- availabledates (model attribute)
  - Source: decorator/action (model populated by the domain wrapper `DefaultRedeliveryRequest` when `mapToDeliveryRequest()`/`availableDates` set)
- countryMetadata.supplyPostcodeRule and fieldLengthConstants
  - Getters: `DefaultRedeliveryRequestBean.getCountryMetadata()` (returns CountryMetadataModel) then `getSupplyPostcodeRule()` on CountryMetadataModel; and `DefaultRedeliveryRequestBean.getFieldLengthConstants()` -> `FieldLengthConstants` getters


Template: `redelivery/enterContactDetails.ftl`
- defaultRedeliveryRequestBean.contactName
  - Getter: `DefaultRedeliveryRequestBean.getContactName()`
  - File: DefaultRedeliveryRequestBean.java (lines ~630-636)
- defaultRedeliveryRequestBean.countryPhonePrefixes
  - Getter: `DefaultRedeliveryRequestBean.getCountryPhonePrefixes()`
  - File: DefaultRedeliveryRequestBean.java (lines ~100-130)
- defaultRedeliveryRequestBean.countryPhonePrefixMobile / Home / Work
  - Getters: `getCountryPhonePrefixMobile()`, `getCountryPhonePrefixHome()`, `getCountryPhonePrefixWork()`
  - File: DefaultRedeliveryRequestBean.java (lines ~568-616)
- defaultRedeliveryRequestBean.mobilePhone / homePhone / workPhone
  - Getters: `getMobilePhone()`, `getHomePhone()`, `getWorkPhone()`
  - File: DefaultRedeliveryRequestBean.java (lines ~582-616)
- defaultRedeliveryRequestBean.emailAddress
  - Getter: `getEmailAddress()`
  - File: DefaultRedeliveryRequestBean.java (lines ~634-642)
- showStopperError
  - Getter: `getShowStopperError()` or directly available as `defaultRedeliveryRequestBean.showStopperError` (bean exposes field via getter)


Template: `redelivery/confirmDetails.ftl`
- defaultRedeliveryRequestBean.consignmentId
  - Getter: `getConsignmentId()` (DefaultRedeliveryRequestBean.java lines ~368-376)
- defaultRedeliveryRequestBean.contactName / redeliveryContactName / redeliveryCompanyName
  - Getters: `getContactName()`, `getRedeliveryContactName()`, `getRedeliveryCompanyName()`
  - File: DefaultRedeliveryRequestBean.java (contactName around lines ~628-636; redelivery getters around lines ~640-660)
- defaultRedeliveryRequestBean.ptlCountries
  - Getter: `getPtlCountries()` (static array accessors in bean)
  - File: DefaultRedeliveryRequestBean.java (search for ptlCountries definition and accessor)
- defaultRedeliveryRequestBean.originalDeliveryCountryISOCode
  - Getter: `getOriginalDeliveryCountryISOCode()` (lines ~524-532)
- formattedDate
  - Source: model attribute set by decorator/action (maps from DefaultRedeliveryRequest.availableDates or service formatting)
- selectedOption
  - Source: model/backing bean (`DefaultRedeliveryRequestBean.getSelectedOption()`)
- flowExecutionUrl / print links
  - Source: Spring Web Flow (flowExecutionUrl) and print event handlers (view action triggers)


Template: `redelivery/originalAddressConfirm.ftl`
- defaultRedeliveryRequestBean.originalDeliveryAddressLine1/2/3
  - Getters: `getOriginalDeliveryAddressLine1()`, `getOriginalDeliveryAddressLine2()`, `getOriginalDeliveryAddressLine3()`
  - File: DefaultRedeliveryRequestBean.java (lines ~428-460)
- defaultRedeliveryRequestBean.originalDeliveryTown / originalDeliveryPostcode / countryDisplayName
  - Getters: `getOriginalDeliveryTown()` (lines ~468-476), `getOriginalDeliveryPostcode()` (lines ~497-504), `getCountryDisplayName()` (lines ~234-240)
- mobilePhone / workPhone / homePhone / emailAddress
  - Getters: `getMobilePhone()`, `getWorkPhone()`, `getHomePhone()`, `getEmailAddress()` (lines ~582-642)


Template: `redelivery/selfCollectConfirm.ftl`
- selfCollectModel
  - Source & Getter: `DefaultRedeliveryRequestBean.getSelfCollectModel()`
  - File: DefaultRedeliveryRequestBean.java (getSelfCollectModel at lines ~230-238)
- defaultRedeliveryRequestBean.countryDisplayName
  - Getter: `getCountryDisplayName()` (lines ~234-240)
- depotTimes
  - Source: model attribute populated by the decorator/action that resolves depot opening times (see `DefaultRedeliveryRequest.selfCollect()` / `DefaultRedeliveryRequest.getSelfCollectionDepot()` in `DefaultRedeliveryRequest.java`)
- defaultRedeliveryRequestBean.mobilePhone / workPhone / homePhone / emailAddress
  - Getters: same as above


Template: `redelivery/leaveWithNeighbour.ftl` and `redelivery/leaveWithNeighbourConfirm.ftl`
- defaultRedeliveryRequestBean.redeliveryContactName / redeliveryAddressLine1/2/3 / redeliveryTown / redeliveryPostcode / redeliveryCompanyName
  - Getters: see `getRedelivery*` methods in `DefaultRedeliveryRequestBean.java` (lines ~700-760)
- message (confirm templates)
  - Source: model attribute set by flow decorator/action
- formattedDate
  - Source: model attribute (see `DefaultRedeliveryRequest.getAvailableDates()` / decorator formatting)


Template: `redelivery/leaveInAbsence.ftl` and `redelivery/leaveInAbsenceConfirm.ftl`
- defaultRedeliveryRequestBean.redeliveryInstructions
  - Getter: `DefaultRedeliveryRequestBean.getRedeliveryInstructions()`
  - File: DefaultRedeliveryRequestBean.java (lines ~900-912)
- ptlCountries / originalDeliveryCountryISOCode
  - Getters: `getPtlCountries()` (static dataset in bean) and `getOriginalDeliveryCountryISOCode()`
- message / formattedDate
  - Source: model attributes set by flow decorator/action


Template: `redelivery/collectFromTNTDepot.ftl`
- defaultRedeliveryRequestBean (contact phones, email, countryDisplayName)
  - Getters: contact and phone getters in `DefaultRedeliveryRequestBean.java`
- availableDepotList / selfCollectModel
  - Sources: populated by depot lookup action / `DefaultRedeliveryRequest.selfCollect()` -> `DefaultSelfCollectionDepotInformation` in `DefaultRedeliveryRequest.java`


Template: `redelivery/redeliverOriginalAddress.ftl`
- defaultRedeliveryRequestBean.originalDelivery* fields
  - Getters: `getOriginalDeliveryAddressLine1/2/3()`, `getOriginalDeliveryTown()`, `getOriginalDeliveryPostcode()`, `getOriginalDeliveryCountryISOCode()`
- availabledates
  - Source: `DefaultRedeliveryRequest.availableDates` set by `mapToDeliveryRequest()` and deliveryRequest.fetchDeliveryConstraints() (see `DefaultRedeliveryRequest.java` methods around lines ~260-340)


Template: `redelivery/alternateAddressConfirm.ftl`
- defaultRedeliveryRequestBean.redeliveryContactName / redeliveryCompanyName / redeliveryAddressLine1/2/3 / redeliveryTown / redeliveryPostcode / countryDisplayName
  - Getters: see `DefaultRedeliveryRequestBean.getRedelivery*()` methods


Template: `templates/defaultTemplate.ftl` and `templates/spring.ftl` and `common/mydeliverysnippets.ftl`
- defaultRedeliveryRequestBean.appVersion
  - Getter: `DefaultRedeliveryRequestBean.getAppVersion()` (lines ~198-204)
- defaultRedeliveryRequestBean.fieldLengthConstants
  - Getter: `DefaultRedeliveryRequestBean.getFieldLengthConstants()` (lines ~212-220)
- countryPhonePrefixes
  - Getter: `DefaultRedeliveryRequestBean.getCountryPhonePrefixes()` (lines ~100-120)
- many macros rely on `flowRequestContext`, `flowExecutionUrl` and Spring macro helpers exposed by Spring FreeMarker (`springMacroRequestContext`) — source: Spring FreeMarkerConfigurer / Web Flow view tech


---

If you want, I will now:
- Insert verbatim method excerpts (one-line signatures) next to each mapping (so developers can quickly jump to the exact method), and
- Expand mappings to include exact line ranges for every referenced method (I can compute precise 1-based line ranges by reading each implementation location), or
- Apply the same exhaustive mapping for the `MyDeliveryAdmin` and `B2C-Notification` templates.

---