# MyDelivery Application Validations

## Overview
This document lists all validations implemented in the MyDelivery application, including their locations, purposes, and integration into the code and user experience flows.

## Validation Framework
The application uses:
- **Oval Framework**: For declarative field validations via annotations.
- **Custom Validators**: For email and phone number validations.
- **Programmatic Checks**: For business logic and consignment eligibility.

## Validations List

### 1. Bean Field Validations (Declarative via Oval Annotations)
These are applied to fields in `DefaultRedeliveryRequestBean` using custom annotations from `com.tnt.express.mydelivery.validator.annotation`.

- **Consignment ID**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.consignmentid.missing")`
  - Location: `DefaultRedeliveryRequestBean.getConsignmentId()`
  - Purpose: Ensures the consignment ID is provided and not empty.
  - Code Flow: Triggered during `RedeliveryRequestFactory.create()` when enriching the consignment.
  - User Experience Flow: During "Enter Consignment Details" step, when submitting consignment ID.

- **Requested Date**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.requesteddate.missing")`
  - Location: `DefaultRedeliveryRequestBean.getRequestedDate()`
  - Purpose: Ensures a redelivery date is selected.
  - Code Flow: Triggered in `RedeliveryRequestFactory.create()` or during `confirm()` in `DefaultMyDeliveryService`.
  - User Experience Flow: During "Select Date" step, when confirming the request.

- **Original Delivery Town**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.town.missing")`
  - Location: `DefaultRedeliveryRequestBean.getOriginalDeliveryTown()`
  - Purpose: Ensures the original town is provided for address matching.
  - Code Flow: Used in consignment enrichment and validation in `DefaultRedeliveryConsignment.validate()`.
  - User Experience Flow: During consignment lookup.

- **Original Delivery Postcode**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.postcode.missing")` (conditionally enforced).
  - Location: `DefaultRedeliveryRequestBean.getOriginalDeliveryPostcode()`
  - Purpose: Ensures postcode is provided for postcoded countries.
  - Code Flow: Checked in `DefaultRedeliveryConsignment.validate()`.
  - User Experience Flow: During consignment validation.

- **Original Delivery Country ISO Code**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.country.missing")`
  - Location: `DefaultRedeliveryRequestBean.getOriginalDeliveryCountryISOCode()`
  - Purpose: Ensures country is specified.
  - Code Flow: Used in consignment matching.
  - User Experience Flow: During consignment entry.

- **Contact Name**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.contactname.missing")`
  - Location: `DefaultRedeliveryRequestBean.getContactName()`
  - Purpose: Ensures a contact name is provided.
  - Code Flow: Triggered during `confirm()`.
  - User Experience Flow: During "Enter Contact Details" step.

- **Email Address**:
  - Annotation: `@IsValidEmail(errorCode = "mydelivery.error.emailaddress.format")`
  - Location: `DefaultRedeliveryRequestBean.getEmailAddress()`
  - Purpose: Validates email format.
  - Code Flow: Checked during `confirm()`.
  - User Experience Flow: During contact details entry.

- **Redelivery Contact Name**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.contactname.missing")`
  - Location: `DefaultRedeliveryRequestBean.getRedeliveryContactName()`
  - Purpose: Ensures contact name for alternative delivery.
  - Code Flow: For alternative address options.
  - User Experience Flow: During alternative address entry.

- **Redelivery Address Line 1**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.redeliveryaddress.missing")`
  - Location: `DefaultRedeliveryRequestBean.getRedeliveryAddressLine1()`
  - Purpose: Ensures alternative address is provided.
  - Code Flow: For alternative address options.
  - User Experience Flow: When selecting "Deliver to Alternative Address".

- **Redelivery Town/Postcode/Country**:
  - Annotations: Similar `@NotNullOrEmpty` for town, postcode, country.
  - Locations: `getRedeliveryTown()`, `getRedeliveryPostcode()`, `getRedeliveryCountryISOCode()`
  - Purpose: Complete alternative address.
  - Code Flow: During alternative address validation.
  - User Experience Flow: Alternative address form.

- **Delivery Instructions**:
  - Annotation: `@NotNullOrEmpty(errorCode = "mydelivery.error.instructions.missing")`
  - Location: `DefaultRedeliveryRequestBean.getRedeliveryInstructions()`
  - Purpose: Ensures instructions are provided for unattended delivery.
  - Code Flow: For leave options.
  - User Experience Flow: When selecting leave options.

### 2. Phone Number Validations (Programmatic)
- **Format Validation**:
  - Regex: `PHONE_NUMBER_FORMAT = "[0-9 ()+-]*"`
  - Location: `MyDeliveryWebService.checkPhoneNumbers()` and `DefaultRedeliveryRequestBean`.
  - Purpose: Ensures phone numbers contain only valid characters.
  - Code Flow: Called in `checkPhoneNumbers` GET endpoint.
  - User Experience Flow: Real-time check during phone number input.

- **Country-Specific Validation**:
  - Uses `CountryPhonePrefixes.getInstance().isValid()`.
  - Location: `MyDeliveryWebService.checkPhoneNumbers()` and `CountryPhonePrefixes.java`.
  - Purpose: Validates phone prefixes and formats against country rules.
  - Code Flow: In `checkPhoneNumbers` endpoint.
  - User Experience Flow: During phone entry; shows warnings.

### 3. Consignment and Business Logic Validations
- **Minimum Data Requirements**:
  - Location: `DefaultRedeliveryConsignment.isMinimumDataRequirementMet()`.
  - Purpose: Checks required fields for consignment lookup.
  - Code Flow: In `RedeliveryRequestFactory.create()`.
  - User Experience Flow: Blocks progression if incomplete.

- **Consignment Existence and Matching**:
  - Location: `DefaultRedeliveryConsignment.enrichFromUniquelyMatchingConsignment()`.
  - Purpose: Verifies exactly one consignment matches.
  - Code Flow: During factory creation.
  - User Experience Flow: Error if no match.

- **Eligibility Checks**:
  - Location: `DefaultRedeliveryConsignment.validate()` and `DefaultRedeliveryRequest.determineAvailableOptions()`.
  - Purpose: Checks status, exclusions, address match.
  - Code Flow: In factory and `determineAvailableOptions()`.
  - User Experience Flow: Determines available options.

- **Address Validation via APC**:
  - Location: `DefaultRedeliveryConsignment.retrieveValidatedAPCAddress()`.
  - Purpose: Validates town/postcode against TNT's system.
  - Code Flow: During consignment enrichment.
  - User Experience Flow: Ensures valid address.

- **Existing Request Checks**:
  - Location: `DefaultRedeliveryRequest.determineAvailableOptions()`.
  - Purpose: Checks for pending requests.
  - Code Flow: In `determineAvailableOptions()`.
  - User Experience Flow: Shows previous options or blocks.

### 4. Confirmation-Time Validations
- **Overall Request Validity**:
  - Location: `DefaultMyDeliveryService.confirm()` checks `request.isValid()`.
  - Purpose: Aggregates all violations.
  - Code Flow: In `confirm()` method.
  - User Experience Flow: Final check during confirmation.

## Flow Integration Summary
- **Early Validation**: Phone checks (real-time warnings), bean fields during lookup.
- **Mid-Flow**: Consignment eligibility determines options.
- **Late Validation**: All checks during confirmation.

## Dependencies
- Oval framework (net.sf.oval)
- Custom validators (NotNullOrEmpty, IsValidEmail)
- Hibernate Validator (@Pattern, @Length)
- Spring MVC for request handling

Last Updated: November 6, 2025
