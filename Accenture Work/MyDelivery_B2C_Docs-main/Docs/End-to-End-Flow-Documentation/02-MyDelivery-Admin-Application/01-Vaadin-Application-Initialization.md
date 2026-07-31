# Vaadin Application Initialization (MyDelivery Admin)

## Purpose
This document describes how the MyDelivery Admin Vaadin application is initialized and bootstrapped. It covers servlet wiring, Spring integration, the main Application/UI class, servlet init parameters, themes, push, session settings, and troubleshooting steps.

---

## Key Files & Locations
- `AutowiringApplicationServlet.java` — custom servlet to integrate Vaadin with Spring and enable autowiring
  - Path: `eai-3532120-mydelivery-admin/MyDeliveryAdminPresentation/src/main/java/com/tnt/express/warp/mydelivery/admin/presentation/servlet/AutowiringApplicationServlet.java`
- `MyDeliveryAdminApplication.java` — Vaadin Application / UI bootstrap class
  - Path: `eai-3532120-mydelivery-admin/MyDeliveryAdminPresentation/src/main/java/com/tnt/express/warp/mydelivery/admin/presentation/MyDeliveryAdminApplication.java`
- `web.xml` — servlet mapping, filters, listeners
  - Path: `eai-3532120-mydelivery-admin/MyDeliveryAdminEAR/` or presentation `WEB-INF/web.xml` (search project for admin web.xml)
- Spring context files used by Admin presentation
  - `applicationContext.xml`, `mydeliveryadmin-servlet.xml` (see `MyDeliveryAdminConfig/` and presentation module)


## Servlet & Spring Wiring
- The Vaadin servlet is wrapped by `AutowiringApplicationServlet` to allow Spring-managed beans to be injected into Vaadin UI classes and components.
- `web.xml` configures the servlet mapping typically like `/admin/*` or `/*` for the admin app.
- Servlet init parameters commonly used:
  - `widgetset` — custom Vaadin widgetset if using custom components
  - `productionMode` — `true|false` to enable production optimizations
  - `UI` — fully qualified UI class (older Vaadin 6/7 styles)

Typical web.xml snippet (conceptual):

```xml
<servlet>
  <servlet-name>MyDeliveryAdmin</servlet-name>
  <servlet-class>com.tnt.express.warp.mydelivery.admin.presentation.servlet.AutowiringApplicationServlet</servlet-class>
  <init-param>
    <param-name>UI</param-name>
    <param-value>com.tnt.express.warp.mydelivery.admin.presentation.MyDeliveryAdminApplication</param-value>
  </init-param>
  <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
  <servlet-name>MyDeliveryAdmin</servlet-name>
  <url-pattern>/admin/*</url-pattern>
</servlet-mapping>
```


## Autowiring Integration Details
- `AutowiringApplicationServlet` performs a lookup of the Spring `WebApplicationContext` and configures a `SpringBeanInjector` (or equivalent) to allow Vaadin components to receive Spring-injected beans.
- UI classes may declare `@Autowired` fields for services, DAOs, or helpers.
- For older Vaadin versions, the servlet may call `VaadinService.getCurrent().addDependency(...)` or set a custom `Instantiator`.


## UI Class Responsibilities
- `MyDeliveryAdminApplication` (or `MainUI`) is the root of the Vaadin UI tree. Typical responsibilities:
  - Build main layout and navigation (menu bar, side panels)
  - Initialize user session context (load user roles, preferred depot)
  - Register event listeners for navigation and window resizing
  - Provide access to common services via Spring injection


## Session & Push Configuration
- Session timeout configured in `web.xml` via `<session-config><session-timeout>`.
- Vaadin Push (if used) configured in servlet init parameters or annotation (`@Push`) on UI class. Check whether server push is enabled for real-time admin events.


## Themes, Static Resources & Widgetsets
- Themes are registered in `VAADIN/themes/<themeName>/` within the WAR. View resolver for static resources is standard servlet static resource serving.
- If custom widgets are used, the `widgetset` init-param points to the compiled widgetset JavaScript.


## Security Considerations at Init Time
- Ensure servlet mappings are protected by Spring Security filters or container filters (see `02-MyDelivery-Admin-Application/06-Security-Integration.md`).
- Prevent unauthenticated access to the admin UI by applying a filter or login page before Vaadin UI instantiation.


## Error Handling & Startup Diagnostics
- Common startup issues:
  - Spring context not found → check `ContextLoaderListener` and application context locations
  - Autowiring failures → ensure `AutowiringApplicationServlet` finds the correct `WebApplicationContext` and classpath contains config files
  - Missing widgetset or theme → check WAR assembly paths
- Enable DEBUG logging for `com.tnt.express.warp.mydelivery.admin` and `org.springframework` to trace initialization and bean wiring


## Deployment Notes
- Admin app is packaged in an EAR or deployed separately. Ensure `MyDeliveryAdminEAR` contains correct references to shared libraries and modules.
- Verify `MANIFEST.MF` classpath entries if running in an application server with module classloader isolation.


## References & Source Files Scanned
- `AutowiringApplicationServlet.java` — servlet implementation
- `MyDeliveryAdminApplication.java` — Vaadin UI bootstrap
- `MyDeliveryAdminPresentation` module `pom.xml` and `WEB-INF/web.xml`

---

Next steps: document the Admin landing screen navigation and component hierarchy (`02-Admin-Landing-Screen.md`).