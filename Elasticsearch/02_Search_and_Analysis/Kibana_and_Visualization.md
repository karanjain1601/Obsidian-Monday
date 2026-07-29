---
title: Kibana and Visualization
aliases: [Kibana Discover, Kibana Lens, KQL, Elastic APM, Kibana Dashboards]
tags: [Elasticsearch, Search, ELK, Kibana, Visualization, APM]
domain: Elasticsearch
difficulty: Intermediate
created: 2026-07-29
related: [Aggregations, Cluster_Architecture, Security_and_Monitoring, _MOC_Elasticsearch_Master, _MOC_DevOps_Master]
status: complete
---

# Kibana and Visualization

> [!abstract] TL;DR
> Kibana is the visualization and management UI for the Elastic Stack. Discover enables ad-hoc log exploration (KQL queries). Lens builds charts via drag-and-drop. Dashboards combine panels. APM provides distributed tracing. Spaces enable multi-tenancy.

## Kibana Discover — Ad-Hoc Log Exploration

Discover is the primary interface for exploring raw documents with time filtering.

### KQL (Kibana Query Language)

KQL is an Elasticsearch-specific query language for Kibana's search bar:

```kql
# Field existence
response_code : *

# Exact match (keyword/numeric)
status : "error"
http.response.status_code : 500

# Text contains
message : "connection refused"

# Range
response_time_ms >= 1000 and response_time_ms <= 5000

# Wildcard
url.path : /api/v*

# Boolean combinations
(status : "error" or status : "fatal") and not service : "healthcheck"

# Nested fields
host.name : "prod-web-01" and log.level : "ERROR"
```

### Discover workflow

1. Select a **Data View** (index pattern, e.g., `logs-*`)
2. Set the **time range** (top-right: Last 15 minutes, custom range)
3. Enter a **KQL query** to filter documents
4. Expand a document to see all fields
5. Select specific **columns** to display in the table
6. Save as a **Saved Search** to embed in dashboards

## Kibana Lens — Drag-and-Drop Visualization

Lens allows building charts without writing any query DSL:

### Chart types in Lens

| Chart | Use Case |
|-------|----------|
| Bar / Horizontal bar | Comparisons across categories |
| Line / Area | Time series trends |
| Pie / Donut | Proportions (< 7 slices) |
| Data table | Multi-metric tabular view |
| Metric | Single KPI number |
| Heat map | Correlation matrix |
| Treemap | Hierarchical proportions |
| Gauge / Goal | Progress toward target |
| Tag cloud | Text frequency |

### Lens building blocks

- **X-axis / Y-axis** — drag fields; Lens suggests appropriate aggregation
- **Breakdown** — split by a dimension (e.g., color bars by `status`)
- **Formula** — write `count() / overall_sum(count())` for derived metrics
- **Layer** — combine multiple metrics on one chart (e.g., line + area)

### Formula examples

```
# Error rate percentage
count(kql='status : "error"') / count() * 100

# P95 latency
percentile(response_ms, percentile=95)

# 7-day rolling average
moving_average(average(response_ms), window=7)
```

## Kibana Dashboards

Dashboards combine multiple panels (visualizations, saved searches, maps, markdown):

### Dashboard controls

- **Time range picker** — global time filter applied to all panels
- **Filter bar** — KQL filters applied globally (e.g., `service: payments`)
- **Control panel** — dropdown/slider controls for interactive filtering
- **Drilldowns** — click a panel to navigate to another dashboard with context

### Dashboard best practices

```
Layout tips:
- Top row: KPI/metric tiles (error count, avg latency, throughput)
- Second row: Time series line charts
- Third row: Distribution bar charts / tables
- Bottom: Raw log table (Discover saved search)
```

## Kibana Dev Tools

### Console

The Console provides an interactive REST client for Elasticsearch:

```
# Keyboard shortcuts
Ctrl+Enter     — Run selected query
Ctrl+/         — Comment/uncomment
Ctrl+Space     — Autocomplete
Alt+L          — Fold/unfold code block
```

```
# Example workflow: debug a slow query
GET /logs-*/_search
{
  "profile": true,
  "query": { "match": { "message": "timeout" } }
}
```

### Grok Debugger

Used to test Grok patterns for Logstash/ingest pipelines:

```
Sample log: [2026-07-29T10:30:45Z] ERROR PaymentService - Connection timeout after 3000ms

Grok pattern: \[%{TIMESTAMP_ISO8601:timestamp}\] %{LOGLEVEL:level} %{DATA:service} - %{GREEDYDATA:message}

Result:
  timestamp: 2026-07-29T10:30:45Z
  level: ERROR
  service: PaymentService
  message: Connection timeout after 3000ms
```

## Elastic APM — Application Performance Monitoring

APM provides distributed tracing, error tracking, and service performance metrics.

### APM Concepts

| Concept | Description |
|---------|-------------|
| **Transaction** | High-level user-visible request (e.g., `GET /api/products`) |
| **Span** | Single operation within a transaction (DB query, HTTP call, cache lookup) |
| **Trace** | Full path of a request across services |
| **Error** | Captured exception with stack trace |
| **Service** | A named application emitting APM data |

### APM Data Flow

```
App (APM agent) → APM Server → Elasticsearch → Kibana APM UI
```

APM agents are available for: Java, Node.js, Python, Ruby, Go, .NET, PHP, iOS, Android.

### Java APM example (Spring Boot)

```xml
<!-- pom.xml -->
<dependency>
  <groupId>co.elastic.apm</groupId>
  <artifactId>apm-agent-attach</artifactId>
  <version>1.50.0</version>
</dependency>
```

```bash
# Start with Java agent attached
java -javaagent:/path/to/elastic-apm-agent.jar \
     -Delastic.apm.service_name=payment-service \
     -Delastic.apm.server_url=http://apm-server:8200 \
     -Delastic.apm.environment=production \
     -jar payment-service.jar
```

### APM Service Map

The Service Map shows the dependency graph across your entire microservice architecture:
- Nodes = individual services
- Edges = calls between services with latency/error metrics
- Click a service to see its metrics, transactions, errors

## Fleet and Elastic Agent

Elastic Agent is the successor to individual Beats (Filebeat, Metricbeat, etc.):

| Old approach | New approach |
|---|---|
| Filebeat (logs) + Metricbeat (metrics) + separate agents | Single Elastic Agent |
| Individual config files per agent | Managed via Fleet UI in Kibana |
| Manual upgrades | Central remote upgrades via Fleet |

```yaml
# elastic-agent.yml (minimal)
outputs:
  default:
    type: elasticsearch
    hosts: [https://es:9200]
    api_key: "my-api-key"

inputs:
  - type: logfile
    paths: ["/var/log/nginx/*.log"]
    processors:
      - decode_json_fields:
          fields: ["message"]
```

## Kibana Alerting

### Alert types

| Rule type | Trigger | Use case |
|-----------|---------|---------|
| ES query | ES query returns N+ docs | Alert on error spike |
| Metric threshold | Index metric crosses threshold | CPU > 90% |
| Log threshold | Log count in time window | > 100 errors in 5 min |
| Anomaly detection | ML-detected anomaly | Unusual traffic pattern |

### Alert rule anatomy (Kibana API)

```bash
POST /api/alerting/rule
{
  "name": "High error rate",
  "rule_type_id": ".es-query",
  "schedule": { "interval": "1m" },
  "params": {
    "index": ["logs-*"],
    "timeField": "@timestamp",
    "esQuery": "{\"query\":{\"term\":{\"level\":\"ERROR\"}}}",
    "timeWindowSize": 5,
    "timeWindowUnit": "m",
    "thresholdComparator": ">",
    "threshold": [100]
  },
  "actions": [{
    "id": "slack-connector-id",
    "group": "threshold met",
    "params": { "message": "Error count exceeded 100 in 5 minutes" }
  }]
}
```

## Kibana Spaces — Multi-Tenancy

Spaces partition Kibana into isolated environments with separate dashboards, saved searches, and data views:

```bash
# Create a space
POST /api/spaces/space
{
  "id": "team-payments",
  "name": "Payments Team",
  "color": "#D36086",
  "initials": "PT"
}

# Assign saved objects to a space
POST /api/spaces/_copy_saved_objects
{
  "spaces": ["team-payments"],
  "objects": [{ "type": "dashboard", "id": "my-dashboard-id" }]
}
```

Access control: combine Spaces with RBAC roles to give each team access only to their space.

## Common Pitfalls

- **KQL vs Lucene syntax** — Kibana's search bar accepts KQL by default (since 7.x); avoid Lucene syntax unless toggled. KQL uses `:` not `=`.
- **Data View time field mismatch** — if the data view's time field doesn't match the actual timestamp field in documents, Discover shows no results.
- **APM agent version mismatch** — APM agent and APM server versions should be compatible (± 1 major version); mismatches cause dropped spans.
- **Dashboard time zone** — Kibana uses the browser's local timezone; ensure ES date fields are stored in UTC to avoid off-by-hour issues.

## Review Questions

1. What KQL query would you write to find all ERROR or FATAL logs from the `payments` service in the last hour, excluding health checks?
2. What is the difference between a Transaction and a Span in Elastic APM?
3. How do Kibana Spaces differ from index-level security (RBAC roles)?
4. What is the advantage of Elastic Agent over individual Beats agents?
5. How would you create an alert that fires when error count exceeds 100 in a 5-minute window?

#Elasticsearch #Search #ELK #Kibana #Visualization #APM
