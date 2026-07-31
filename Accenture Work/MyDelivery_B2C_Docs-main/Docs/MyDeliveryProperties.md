# MyDeliveryProperties Module

Module dedicated to configuration property assembly, packaging environment-specific properties for deployment.

## Purpose
- Centralizes application property files (e.g., system parameters, external endpoint URLs, credentials placeholders, feature toggles).
- Provides assembly scripts/resources to integrate properties into deployable EAR/WAR artifacts.

## Structure
- `Assembly/InstallScripts`: Deployment scripts (Python) that likely inject or validate property sets.
- `Assembly/PlaceholderFiles`: Template property files included for environments.
- `Properties`: (Not listed here, expected) actual .properties files for different locales/environments.

## Typical Responsibilities
- Maintain consistent naming across environments (DEV/TEST/PROD) for keys consumed by `DefaultMyDeliveryServiceBase` and helpers.
- Provide versioned changes tracked by parent build (Maven filtering may inject build properties).

## Extension
- To add new property: define in appropriate environment file and document in README or change log; update service layer to read via `Properties` loader.
- Sensitive values should be externalized (e.g., via environment variables or secure vault) and only placeholders stored here.

