# MyDelivery Documentation

This `docs` folder contains high-level technical documentation for the multi-module MyDelivery system. Each module document lists every Java class in `src/main/java` with a concise description of its purpose and primary responsibilities. Where source content was not fully inspected, descriptions are based on class naming, package context, and common Java EE / Spring patterns. Expand or refine as needed.

Module documents:
- `MyDeliveryServiceApi.md`
- `MyDeliveryServiceImpl.md`
- `MyDeliveryWebService.md`
- `MyDeliveryPresentation.md`
- `MyDeliveryProperties.md`
- `MyDeliveryEAR.md`
- `OtherModules.md`

Conventions:
- Model classes encapsulate data transferred between layers.
- *Acl* classes wrap external system/service calls (anti-corruption layer).
- *Helper* / *Creator* utility classes build or validate complex domain objects.
- *Validator* classes perform input validation and aggregate rule violations.
- *Decorator* classes augment / adapt UI presentation objects or flow.
- *Servlet* classes provide legacy servlet endpoints for printing or setup.
- *Report* classes assemble data for JasperReports or similar reporting engines.
- *Request / Response* JAXB classes map XML payload structures.
- *Enum / Constants* provide strongly-typed configuration & value lists.

For deeper per-method documentation, regenerate after augmenting parsing automation.
