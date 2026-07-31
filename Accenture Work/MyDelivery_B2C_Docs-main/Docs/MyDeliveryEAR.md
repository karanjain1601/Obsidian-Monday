# MyDeliveryEAR Module

Enterprise Application Archive (EAR) module packaging the full MyDelivery application for deployment to an application server (IBM WebSphere suggested by `ibm-application-bnd.xml`).

## Purpose
- Aggregate WARs (Presentation, WebService) and JARs (ServiceApi, ServiceImpl, Properties, CrossDependencies) into a single deployable unit.
- Provide application-level deployment descriptors and vendor-specific bindings.

## Key Files
- `META-INF/application.xml`: Declares modules (web, ejb/jar) included in EAR.
- `META-INF/ibm-application-bnd.xml`: IBM-specific bindings (classloading, security roles, shared libs).
- `META-INF/ibmconfig/cells/...`: Additional WebSphere configuration assets.

## Build
- Maven module with packaging type `ear` (in parent POM) controlling inclusion artifacts & version alignment.

## Extension
- Add new web module: update `application.xml` & parent POM dependencyManagement.
- Adjust classloading or security: modify IBM binding descriptors accordingly.

## Deployment Scripts
- Coordinated with scripts in `Assembly/InstallScripts` at root or Properties module for environment provisioning.

