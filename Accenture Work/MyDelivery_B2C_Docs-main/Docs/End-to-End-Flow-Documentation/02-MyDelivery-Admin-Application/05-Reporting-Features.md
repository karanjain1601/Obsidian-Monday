# Reporting Features (MyDelivery Admin)

## Purpose
This document explains reporting features available in MyDelivery Admin, including on-demand reports, scheduled reports, exports, and integration with reporting libraries.

---

## Report Types
- Operational reports: daily delivery volumes, exceptions, cancellations
- Historical reports: per-account shipment history, SLA adherence
- Audit reports: admin actions, config changes
- Custom ad-hoc reports: user-defined filters and columns


## Report Generation Flow
1. User configures report criteria in `ReportingView`
2. UI calls `reportService.generateReport(criteria)`
3. Service composes SQL queries (or calls stored procedures) to fetch data from DB
4. Data is transformed into a report model and passed to a report engine (e.g., JasperReports)
5. Report engine returns output in chosen format: PDF, XLSX, CSV
6. UI streams file to user or stores the generated report for scheduled distribution


## Scheduling & Background Execution
- Scheduled reports run via a scheduler (Quartz or application server scheduler)
- Scheduled job invokes `reportService.generateAndStore(criteria, scheduleInfo)` and persists the report location
- Notification sent to recipients via `NotificationService` with a link to download


## Data Sources & Performance
- Use optimized queries and materialized views for heavy reports
- For long-running reports, execute them in background and notify users when ready
- Consider sampling for analytical reports where exact counts are not required


## Export Formats
- PDF: for formatted, printable reports (JasperReports with template)
- XLSX/CSV: for data analysis in spreadsheets
- JSON: for API consumption by external systems


## Security & Access
- Reports may contain sensitive data; apply role-based access and data-level filters (e.g., restrict to certain depots)
- Mask sensitive columns in report templates where necessary


## Example Integration (Jasper)
- `reportService` prepares a `JRDataSource` or passes a JDBC connection and parameters to Jasper
- Precompiled `.jasper` templates stored in `resources/reports/`

Example code (conceptual):
```java
JasperPrint jasperPrint = JasperFillManager.fillReport(templateStream, params, dataSource);
JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
```


## Audit & Retention
- Keep generated report metadata in `REPORT_STORE` table: `REPORT_ID`, `CREATED_BY`, `SCHEDULED_FOR`, `LOCATION`, `EXPIRES_AT`
- Clean up stored reports after retention period


## References & Source Files Scanned
- `ReportingView` and `reportService` classes in admin modules
- Look for Jasper or other reporting engine dependencies in `pom.xml`

---

Next: document security integration (`06-Security-Integration.md`).