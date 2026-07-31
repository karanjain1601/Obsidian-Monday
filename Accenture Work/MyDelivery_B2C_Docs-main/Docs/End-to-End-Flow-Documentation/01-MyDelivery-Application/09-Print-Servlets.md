# Print Servlets (PDF Generation) — MyDelivery

## Overview
MyDelivery supports PDF/print generation via dedicated servlets. This document describes print servlet responsibilities, template rendering for PDFs, libraries used, streaming approach, and example sequences.

---

## Key Classes & Files
- `SetupAppServlet.java` — application setup; may register print servlets or configure PDF resources
- Print servlet classes under `MyDeliveryPresentation/src/main/java/.../servlet/print/` (search for `PrintServlet` or similar)
- PDF templates may reuse Freemarker `.ftl` templates or separate PDF templates (HTML then rendered to PDF)


## PDF Generation Approaches Observed
1. HTML-to-PDF
   - Render Freemarker template to HTML
   - Use a library (e.g., Flying Saucer + iText, wkhtmltopdf) to convert HTML to PDF
2. Programmatic PDF
   - Use iText/PDFBox directly and build PDF via code


## Typical Flow (HTML-to-PDF)
1. Request hits print servlet with parameters (e.g., requestId)
2. Servlet calls service layer to fetch data
3. Service returns model object; servlet merges model with Freemarker template to produce HTML
4. HTML is passed into PDF renderer which produces PDF bytes
5. Servlet streams PDF bytes to response with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename=...`.


## Streaming & Memory Considerations
- Stream PDFs directly to HttpServletResponse output stream to avoid large in-memory buffers.
- For very large PDFs, produce paged output or temporary files.


## Caching
- Cache static resources (images, CSS) used by PDF renderer.
- Cache rendered templates where content is identical for multiple requests.


## Error Handling
- Return a user-friendly error page or a small PDF containing the error message when generation fails.
- Log stack traces and include correlation IDs for support.


## References
- `SetupAppServlet.java` — general servlet setup
- Search for PDF libraries in pom.xml (look for `itext`, `flying-saucer`, `wkhtmltopdf` wrappers)

---

## Purpose

Document the print endpoints used by MyDelivery and MyDelivery Admin presentation layers. Include servlet classes, expected request parameters/attributes, and which templates or views they render for printing confirmation and PTL details.

## Print servlet classes & locations

- `PrintMyDeliveryPTLFormServlet` - MyDelivery presentation
  - Path: `MyDeliveryPresentation/src/main/java/com/tnt/express/warp/mydelivery/ui/servlet/PrintMyDeliveryPTLFormServlet.java`
  - Purpose: render PTL (print-to-label) form for a delivery request

- `PrintMyDeliveryConfirmationDetailsServlet` - MyDelivery presentation
  - Path: `MyDeliveryPresentation/src/main/java/com/tnt/express/warp/mydelivery/ui/servlet/PrintMyDeliveryConfirmationDetailsServlet.java`
  - Purpose: render confirmation details (printable) for a confirmed redelivery request

- Admin side print servlets/windows
  - `PrintPlannedDeliveryDetailsServlet` - MyDeliveryAdminPresentation/src/main/java/.../servlet/PrintPlannedDeliveryDetailsServlet.java
  - `PrintPlannedDeliveryDetailsWindow` - Vaadin window class used in the admin UI for printing planned delivery details

## URL mappings (web.xml)

Search `web.xml` in presentation modules for servlet mapping. Example patterns used in the project:
- `/print/ptl/*` for PTL printing
- `/print/confirmation/*` for confirmation printing

Verify the exact mappings in `MyDeliveryPresentation/WEB-INF/web.xml` and `MyDeliveryAdminPresentation/WEB-INF/web.xml`.

## Model / request attributes expected by print servlets

These servlets expect a populated `RedeliveryRequestBean` or `Print*Model` object in request or session scope. Typical attributes:
- `deliveryRequestId` or `trackingNumber` (request param to load the model)
- `redeliveryRequest` or `printModel` (model object containing address, contact, options)
- `printOptions` (e.g. include barcodes, show map link)

Example flow:
1. User completes confirmation -> flow stores `redeliveryRequest` and redirects to print endpoint with `deliveryRequestId`.
2. Print servlet loads full `DeliveryRequest` from DB (via service) and populates print model.
3. Servlet forwards to a Freemarker template or JSP that renders printable HTML/PDF.

## Operational notes

- PDF generation: if the app converts HTML to PDF, the conversion tool (external) and its logs must be known. Confirm whether a headless browser or a library (wkhtmltopdf, iText) is used.
- Print formatting: confirm CSS and printer margins; tests exist under support/test logs (`Print Confirmation details.pdf`).
- Session/authorization: ensure the print servlet enforces authorization and doesn't allow arbitrary printing of other users' requests.

## Exact web.xml servlet mappings (MyDeliveryPresentation)
- `dwr` servlet
  - servlet-name: `dwr`
  - servlet-class: `com.spring.dwr.configurer.DWRConfigurerServlet`
  - url-pattern: `/dwr/*`
  - File: `MyDeliveryPresentation/WEB-INF/web.xml` (servlet + mapping entries)

- `freemarker` servlet
  - servlet-name: `freemarker`
  - servlet-class: `freemarker.ext.servlet.FreemarkerServlet`
  - url-pattern: `*.ftl`
  - File: `MyDeliveryPresentation/WEB-INF/web.xml`

- `webflow` servlet
  - servlet-name: `webflow`
  - servlet-class: `org.springframework.web.servlet.DispatcherServlet`
  - url-pattern: `/flow/*`
  - File: `MyDeliveryPresentation/WEB-INF/web.xml`

- `resourceservlet` (static resources)
  - servlet-name: `resourceservlet`
  - servlet-class: `org.springframework.js.resource.ResourceServlet`
  - url-pattern: `/static/*`
  - File: `MyDeliveryPresentation/WEB-INF/web.xml`

- Print servlets (mapped):
  - `PrintMyDeliveryPTLForm`
    - servlet-class: `com.tnt.express.warp.mydelivery.ui.servlet.PrintMyDeliveryPTLFormServlet`
    - url-pattern: `/print/PrintMyDeliveryPTLForm`
    - File: `MyDeliveryPresentation/WEB-INF/web.xml` (servlet + mapping)
  - `PrintMyDeliveryConfirmationDetails`
    - servlet-class: `com.tnt.express.warp.mydelivery.ui.servlet.PrintMyDeliveryConfirmationDetailsServlet`
    - url-pattern: `/print/PrintMyDeliveryConfirmationDetails`
    - File: `MyDeliveryPresentation/WEB-INF/web.xml`


## Print servlet behaviour & exact service calls (per servlet)

### PrintMyDeliveryPTLFormServlet (path: `/print/PrintMyDeliveryPTLForm`)
- Class: `com.tnt.express.warp.mydelivery.ui.servlet.PrintMyDeliveryPTLFormServlet`
- Extends: `AbstractPrintServlet`
- Expected session attribute: `ReportConstants.REPORT_SESSION_PRINT_PTL_ATTRIBUTE_NAME` (`printPTLModel`)
  - The `ConfirmationDecorator` and `MyDeliveryDecorator.confirm()` set this session attribute when a PTL print is required.
  - Evidence:
    - `MyDeliveryDecorator.confirm(...)` sets session attribute: `httpRequest.getSession().setAttribute(ReportConstants.REPORT_SESSION_PRINT_PTL_ATTRIBUTE_NAME, model.getPrintPtlModel());` (see `MyDeliveryDecorator.java`)
    - `ConfirmationDecorator` also sets the session attribute when preparing confirmation flow (see `ConfirmationDecorator.java`).
- Behaviour (code excerpt):
  - `getReport(HttpServletRequest request)` reads the `PrintPTLModel` from session and then calls `model.getPTLPrint()` to obtain PDF bytes.
  - It constructs headers: Content-Type `application/pdf`, Content-Disposition `attachment; filename="<model.getOutputFileName()>"` and returns `Report` wrapper to `AbstractPrintServlet.doGet()` which streams bytes.
- Exact call sequence (files + method lines):
  - `MyDeliveryDecorator.confirm(RedeliveryRequestBean, RequestContext)` (file: `MyDeliveryDecorator.java`, around lines 90-120) calls `ConfirmationModel model = getService().confirm(bean);` then sets session attribute if PTL present.
  - `DefaultMyDeliveryService.confirm(...)` (service impl) delegates to domain `DefaultDeliveryRequestService` / `DefaultRedeliveryRequest` which persists/creates DeliveryRequest and produces `PrintPTLModel` (see `05-Service-Layer-Details.md` for detailed call trace).
  - `PrintMyDeliveryPTLFormServlet.getReport(...)` (file: `PrintMyDeliveryPTLFormServlet.java`, lines 1-35) returns `new Report(reportData, CONTENT_TYPE_PDF, fileName.toString(), contentDispositionValue.toString(), ReportConstants.REPORT_SESSION_PRINT_PTL_ATTRIBUTE_NAME);` which `AbstractPrintServlet.doGet()` streams.
- Relevant files:
  - `MyDeliveryDecorator.java` — sets session attribute (see earlier excerpt)
  - `PrintMyDeliveryPTLFormServlet.java` — reads session attribute and returns Report (see file)
  - `AbstractPrintServlet.java` — streams report bytes to response (see file)


### PrintMyDeliveryConfirmationDetailsServlet (path: `/print/PrintMyDeliveryConfirmationDetails`)
- Class: `com.tnt.express.warp.mydelivery.ui.servlet.PrintMyDeliveryConfirmationDetailsServlet`
- Extends: `AbstractPrintServlet`
- Expected session attribute: `ReportConstants.REPORT_SESSION_PRINT_CONFIRMATION_ATTRIBUTE_NAME` (`printConfirmationModel`)
  - Set by confirmation flow/decorator when a confirmation PDF is created and placed in session.
- Behaviour (code excerpt):
  - `getReport(HttpServletRequest request)` reads `PrintConfirmationModel` from session and calls `model.getPrintConfirmation()` to get PDF bytes; constructs headers with `model.getOutputFileName()` + `.pdf` and returns `Report`.
- Exact call sequence (files + method lines):
  - Confirmation flow sets the `printConfirmationModel` in session (search `REPORT_SESSION_PRINT_CONFIRMATION_ATTRIBUTE_NAME` usage across codebase references in decorators)
  - `PrintMyDeliveryConfirmationDetailsServlet.getReport(...)` returns `Report` which `AbstractPrintServlet.doGet()` streams to response.
- Relevant files:
  - `PrintMyDeliveryConfirmationDetailsServlet.java` — reads session attribute and returns Report (see file)
  - `AbstractPrintServlet.java` — streams report bytes to response


## Expected request/session attributes for print endpoints
- PTL print (`/print/PrintMyDeliveryPTLForm`)
  - Session: `printPTLModel` (PrintPTLModel)
  - `PrintPTLModel` methods used: `getPTLPrint()` -> byte[], `getOutputFileName()` -> String
  - These are set by the confirmation flow in `MyDeliveryDecorator.confirm()` when the selected option is LeaveInAbsence and a PTL model is returned by the service.

- Confirmation print (`/print/PrintMyDeliveryConfirmationDetails`)
  - Session: `printConfirmationModel` (PrintConfirmationModel)
  - `PrintConfirmationModel` methods used: `getPrintConfirmation()` -> byte[], `getOutputFileName()` -> String


## Actionable verification steps for operators / devs
- To verify PTL printing end-to-end in a running instance:
  1. Submit a redelivery request using LeaveInAbsence option via UI.
  2. After confirmation, check the user session in server logs or by debugging to verify `printPTLModel` attribute exists.
  3. Call `/print/PrintMyDeliveryPTLForm` endpoint in the same session (browser should open link in new tab/window) and confirm a PDF is downloaded with expected filename.

- To check why a print fails:
  - Inspect server logs for exceptions in `AbstractPrintServlet.handleException()` (logs error and sets HTTP status).
  - Verify session attribute exists and `model.getPTLPrint()` / `model.getPrintConfirmation()` returns non-null byte[].
  - If PDF generation happens earlier (service layer), check the service call path for exceptions and logs.


## Next steps (exhaustive mode)
- Extract exact service method excerpts that produce `PrintPTLModel` and `PrintConfirmationModel` (file + exact line ranges), and include the code that marshals the report (JasperReports `.jrxml`/`.jasper` usage if present). Search for `getPTLPrint()` and `getPrintConfirmation()` implementations and insert verbatim code excerpts.
- Add sample HTTP requests (curl / PowerShell Invoke-WebRequest) to trigger the print endpoints in a test environment (including cookies/flowExecutionKey if needed).

Next: locate exact print servlet classes and PDF library dependency entries in project pom.xml files and list them here.