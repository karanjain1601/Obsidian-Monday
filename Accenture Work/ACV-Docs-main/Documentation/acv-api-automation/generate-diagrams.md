# Generate SVG/PNG from Mermaid sources

This folder includes Mermaid sources under `diagrams-src/`. To render them to SVG/PNG locally, use one of the following methods.

## Using npx (recommended)

Install Node.js, then run:

```powershell
npx @mermaid-js/mermaid-cli -i Documentation/acv-api-automation/diagrams-src/system_overview.mmd -o Documentation/acv-api-automation/images/system_overview.svg
npx @mermaid-js/mermaid-cli -i Documentation/acv-api-automation/diagrams-src/test_execution_sequence.mmd -o Documentation/acv-api-automation/images/test_execution_sequence.svg
npx @mermaid-js/mermaid-cli -i Documentation/acv-api-automation/diagrams-src/er_diagram.mmd -o Documentation/acv-api-automation/images/er_diagram.svg
npx @mermaid-js/mermaid-cli -i Documentation/acv-api-automation/diagrams-src/ci_flowchart.mmd -o Documentation/acv-api-automation/images/ci_flowchart.svg
npx @mermaid-js/mermaid-cli -i Documentation/acv-api-automation/diagrams-src/api_call_sequence.mmd -o Documentation/acv-api-automation/images/api_call_sequence.svg
```

## Using Docker

```powershell
docker run --rm -v ${PWD}:/data minlag/mermaid-cli:8.12.0 -i /data/Documentation/acv-api-automation/diagrams-src/system_overview.mmd -o /data/Documentation/acv-api-automation/images/system_overview.svg
```

## Windows note
If running from PowerShell, ensure paths are correct and wrap them in quotes when needed.

## After generation
- The `images/` folder will contain SVG files you can embed in the markdown pages.
- To produce PNG instead, change the output filename extension to `.png`.
