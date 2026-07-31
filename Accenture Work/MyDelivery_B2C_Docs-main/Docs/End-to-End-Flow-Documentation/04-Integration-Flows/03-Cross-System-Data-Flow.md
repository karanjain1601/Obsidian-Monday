# Cross-System Data Flow

## Purpose
Document how data flows between MyDelivery, MyDelivery Admin, B2C Notification, and external systems. Include examples of data ownership, sync points, and responsibility for fields like consignment status and customer contact details.

---

## Data Ownership
- MyDelivery owns `DELIVERY_REQUEST`, `DELIVERY_ADDRESS`, and local session state for web interactions.
- B2C Notification owns alert generation logic and the `OUTBOUND_ALERTS` table.
- Tracking system (external) is the source of truth for consignment status events.


## Data Exchange Patterns
- Staging tables: external systems or ETL write status events into staging tables that batch jobs read
- JMS/IBIS messages: MyDelivery publishes async messages for downstream systems to react to
- Synchronous APIs: for real-time lookup of address or depot info (via service calls)


## Example Flow: Consignment Status Update
1. Tracking system publishes status via IBIS or writes to staging tables
2. B2C batch job picks up statuses and generates alerts
3. MyDelivery admin may query history and trigger re-sends; re-sends enqueue messages back onto JMS


## Data Mapping Notes
- Use canonical field names in internal DTOs (e.g., `consignmentId`, `statusCode`, `eventTimestamp`)
- Map external system codes to internal enumerations via configuration tables


## Consistency & Reconciliation
- Reconcile counts between tracking system and outbound alerts nightly
- Provide reconciliation reports for missing alerts or duplicate sends


## References
- Integration Flows docs
- Database tables reference documents

---

Next: add `04-External-Service-Integration.md`.