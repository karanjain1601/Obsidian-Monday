# Security Integration (MyDelivery Admin)

## Purpose
This document describes how security is integrated into the MyDelivery Admin application: authentication, authorization, session management, CSRF protection, and SSO integration points.

---

## Authentication & Authorization
- Authentication is typically handled by Spring Security or container-managed authentication; SSO integration may exist (check enterprise SSO modules)
- Roles commonly used: `ROLE_ADMIN`, `ROLE_SUPERVISOR`, `ROLE_SUPPORT`
- Vaadin views enforce authorization checks before rendering sensitive UI components


## Spring Security Configuration
- XML or Java config defines `http` security, filter chain, and role hierarchies
- Protected URL patterns include admin servlet mapping (e.g., `/admin/**`)
- Login flow often uses a servlet login page or SSO redirect

Example XML snippet (conceptual):
```xml
<http>
  <intercept-url pattern="/admin/**" access="ROLE_ADMIN"/>
  <form-login login-page="/login"/>
</http>
```


## Vaadin & Security
- Vaadin components should check security before showing actions (e.g., hide 'Cancel' button if user lacks permission)
- Store a lightweight `UserContext` in session containing roles and depot scope
- Secure RPC endpoints (if any) such as DWR or custom servlets


## Session Management
- Configure session timeout in `web.xml` and invalidate sessions on logout
- Prevent session fixation by creating new session on authentication
- Optionally restrict concurrent sessions per user


## CSRF & XSS Protection
- Use Spring Security CSRF protection for form submissions. For Vaadin, ensure server-side validation and token checks when using custom AJAX endpoints
- Sanitize user-generated content before rendering in templates


## SSO & External Auth Integration
- If SSO is used, integrate via SAML or OAuth clients in Spring Security
- Map external SSO attributes to local roles and usernames
- Provision missing accounts or use a separate provisioning flow


## Audit & Compliance
- Log successful and failed logins to `SECURITY_AUDIT`
- Log role changes and permission grants in `ADMIN_AUDIT`


## Troubleshooting
- If users see 403 errors: check role mappings and `intercept-url` patterns
- Vaadin-specific: ensure `SecurityContext` is propagated into the UI thread for background tasks


## References & Source Files Scanned
- `MyDeliveryAdminPresentation` web.xml and spring security config files in `MyDeliveryAdminConfig`
- Search for Spring Security dependencies in `pom.xml`

---

Next: add service-layer integration document for admin (`07-Service-Layer-Integration.md`).