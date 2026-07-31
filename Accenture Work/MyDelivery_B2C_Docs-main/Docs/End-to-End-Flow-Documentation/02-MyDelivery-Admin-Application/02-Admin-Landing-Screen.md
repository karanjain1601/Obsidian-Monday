# Admin Landing Screen (MyDelivery Admin)

## Purpose
This document describes the main landing screen presented to administrators when they log into the MyDelivery Admin application. It covers layout, navigation structure, primary views, component composition, events, and integration points.

---

## Main Layout
Typical landing screen contains:
- Top navigation bar (branding, user profile, global actions)
- Left-side navigation menu (tree or accordion for admin functions)
- Main content area (dynamic view container)
- Right-side quick panel (optional: notifications, logs)
- Footer with system version and environment info

Example high-level layout (Vaadin components):
- `HorizontalLayout` root
  - `VerticalLayout` left menu (`Panel` or `TreeTable`)
  - `VerticalLayout` mainContent (`Navigator` or `ViewDisplay`)
  - `VerticalLayout` rightPanel


## Navigation & View Management
- Vaadin `Navigator` (or custom view management) loads views into the main content area.
- URLs for views (deep-linking) follow pattern: `/#viewName` or use Navigator's state management.
- Common admin views:
  - `DeliveryRequestListView` — paginated grid of requests with filters
  - `DeliveryRequestEditView` — form for editing request details
  - `ConfigurationView` — manage depots, countries and system params
  - `ReportingView` — generate/export reports
  - `UserManagementView` — admin user CRUD


## Component Details
- DeliveryRequestListView
  - Uses `Grid`/`Table` for list
  - Server-side pagination and sorting via service layer
  - Row actions: view, edit, resend, cancel
- DeliveryRequestEditView
  - `FormLayout` with field validators
  - Save button triggers service call to update request
  - On save, UI shows notification and updates list view
- Configuration Screens
  - Use `FormLayout` + `ComboBox` for reference entities
  - Bulk-upload via CSV for depot mappings


## Data Loading & Caching
- Avoid loading large datasets into memory on UI thread. Use lazy-loading containers or server-side queries.
- Cache reference data (country list, service codes) in session-scoped beans where appropriate.


## Event Handling & Notifications
- Use Vaadin `EventBus` (or Spring ApplicationEvent) for cross-component notifications (e.g., after a request is updated, refresh list views)
- Show user-friendly notifications using `Notification.show(...)`


## Example Vaadin Code (conceptual)
```java
public class DeliveryRequestListView extends VerticalLayout implements View {
  private Grid<DeliveryRequest> grid;
  private DeliveryService deliveryService;

  @Autowired
  public DeliveryRequestListView(DeliveryService deliveryService) {
    this.deliveryService = deliveryService;
    grid = new Grid<>(DeliveryRequest.class);
    grid.setItems(query -> deliveryService.findRequests(query.getOffset(), query.getLimit()).stream());
    addComponent(grid);
  }
}
```


## Access Controls
- Views and actions should check user roles/permissions (e.g., ROLE_ADMIN, ROLE_SUPERVISOR) before enabling sensitive actions.
- Use a central `SecurityService` or Spring Security-context checks inside UI actions.


## UX & Usability
- Provide quick filters and saved filter presets.
- Allow bulk actions with confirmation dialogs.
- Maintain undo capability where feasible (soft-delete / status revert)


## Diagnostics & Support Links
- Landing screen includes a link to system diagnostics page showing current active connections, version numbers, and recent error logs.


## References & Source Files Scanned
- `MyDeliveryAdminApplication.java` — main UI class
- Admin view classes under `MyDeliveryAdminPresentation/src/main/java/.../view/` (search for `View` and `Navigator` usage)
- `AutowiringApplicationServlet` for how beans are injected into views

---

Next: create Delivery Request Management documentation (`03-Delivery-Request-Management.md`).