# Configuration Screens (Depots, Countries, System Parameters)

## Purpose
This document details configuration screens used by administrators to manage master data: depots, countries, service codes, and system parameters. It includes UI flows, data validation, bulk upload patterns, and persistence details.

---

## Common Screens
- Depot Management
- Country / Zone Management
- Service Codes
- System Parameters (key-value pairs affecting runtime behavior)
- Reference Data import/export tools


## Depot Management
- Fields: `DEPOT_CODE`, `NAME`, `ADDRESS`, `TIMEZONE`, `STATUS` (active/inactive)
- CRUD Flow:
  - List view with filters
  - Edit dialog/form
  - Validation: unique `DEPOT_CODE`, valid timezone
  - Deactivate vs Delete: prefer deactivate to retain historical links
- Backend API:
  - `DepotService.create(DepotDto)`
  - `DepotService.update(DepotDto)`
  - `DepotService.findAll()` / `findByCode()`


## Country / Zone Management
- Manage countries and zones used for shipping rules and postage calculations
- Fields: `COUNTRY_CODE`, `NAME`, `ZONE`, `VAT_RATE`
- Bulk upload: import CSV with mapping to existing codes, validations for required columns


## Service Codes
- Manage available delivery services and their metadata (cut-off times, SLA)
- Each service maps to code used in `DELIVERY_REQUEST` and routing logic


## System Parameters
- Key-value store for runtime toggles (e.g., `ENABLE_TEST_MODE`, `DEFAULT_PICKUP_WINDOW`)
- Parameters may be cached in memory; ensure changes invalidate the cache or broadcast an event to reload
- Provide UI to view, edit, and commit parameter changes; include change comments


## Bulk Upload & Validation
- Upload CSV files via UI with server-side validation
- Validation step returns a preview of errors/warnings before commit
- Use a staging table for large bulk imports to avoid locking production tables


## Audit & Versioning
- Track changes to configuration items in `CONFIG_AUDIT` table. Store previous values and who changed them.
- Optionally support version rollback for critical configs


## Security & Approvals
- Changes to certain parameters require approval by a supervisor (approval workflow similar to admin actions)
- Implement role-based access control for configuration screens


## Integration with Other Systems
- Depot changes may trigger updates to routing engines or external systems; use messaging to inform downstream components
- Provide a manual sync action for rare synchronous updates


## References & Source Files Scanned
- Admin presentation modules for configuration UIs
- Service layer implementations for `DepotService`, `ConfigService` in service modules
- Property files under `MyDeliveryProperties` for default system parameters

---

Next: create reporting documentation (`05-Reporting-Features.md`).