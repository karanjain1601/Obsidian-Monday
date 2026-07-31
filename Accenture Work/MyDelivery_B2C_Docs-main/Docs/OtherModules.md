# Other / Root Modules

## MyDeliveryParent
Parent Maven aggregator / dependencyManagement project controlling versions of shared dependencies (Spring, Apache HttpClient, OVal, JasperReports, Log4j, etc.) and plugin configurations (compiler, ear, war, jar packaging).

## MyDeliveryCrossDependencies
Holds shared cross-cutting dependencies or integration stubs not fitting cleanly into API or Impl modules. Could define adapters, additional JPA entities, or third-party integration helpers.

## Assembly (Root)
Deployment orchestration scripts:
- `deploy.py`, `dvnDeploy.py`, `start.py`: Automate build artifact distribution, environment setup, start sequences.
- `deployconfig.xml`: Configurable parameters (targets, hosts, credentials placeholders).

## Root `pom.xml`
Defines multi-module build, common plugin configuration, corporate repositories, global properties (Java version, encoding).

## `src/changes/changes.xml`
Change log tracking notable modifications for release notes (Maven Changes plugin).

## Site Documentation (`src/site/site.xml`)
Maven Site generation descriptor (linking modules, reports, change logs, javadocs).

## Creating Additional Docs
Add new Markdown files here or extend module-specific docs in this folder. Keep structure consistent for onboarding.

