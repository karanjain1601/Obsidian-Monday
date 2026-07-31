# Business Guide — Business Logic & Domain Overview

## Purpose

This document explains the business scenarios the automation covers, the key domain entities, and how test outcomes map to business impact — written for product owners and business stakeholders.

## Business Context

The ACV automation verifies APIs crucial to customer onboarding, identity verification and document validation. Passing automation increases confidence that key customer journeys work end-to-end.

## Core Business Entities (detailed)
- Account: unique customer/tenant; tests validate read and search behaviors.
- Document: uploaded assets (e.g., identity documents) used in validation flows; tests verify metadata, content acceptance and retrieval.
- Validation: asynchronous process where documents or identity data are validated against business rules; tests poll for status and assert business outcomes.

## Business Flows Covered (mapping to tests)

- Account onboarding
	- Tests: `GetCountryList.feature` (validates country configuration used during onboarding)
	- Business outcome: ensures user can select valid country and proceed with onboarding.

- Document lifecycle
	- Tests: `DocumentList.feature` (document metadata listing), document upload tests (if added)
	- Business outcome: customers can upload and retrieve documents, which is critical for KYC/validation.

- Validation process (OTP / PAN)
	- Tests: `ACVRequestOTP.feature`, `FetchData.feature` (PAN check)
	- Business outcome: identity checks and third-party data lookups succeed, enabling downstream approvals.

## Severity and SLA mapping
- Critical flows (onboarding, document upload, OTP) should be part of smoke runs and monitored closely.
- Failures in critical flows should trigger immediate alerts and an incident triage.

## Business reporting

- Provide a weekly summary highlighting pass rates by business flow, average durations, and top failing scenarios.
- Include simple language for executives: e.g., "OTP flow failing for IN country impacts 12% of onboarding attempts." (use data from test-run metrics)

## Actions for stakeholders
- When automation detects a regression in a critical flow, open an incident and attach the report and failing feature file.
- For feature changes: product owners should review affected feature files and sign off on modified scenarios.
