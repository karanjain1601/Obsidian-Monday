---
title: Security and Monitoring
aliases: [Elasticsearch Security, RBAC, TLS Elasticsearch, API Keys, Stack Monitoring, Prometheus Elasticsearch]
tags: [Elasticsearch, Search, ELK, Security, Monitoring, RBAC]
domain: Elasticsearch
difficulty: Advanced
created: 2026-07-29
related: [Cluster_Architecture, Performance_Tuning, Kibana_and_Visualization, _MOC_Elasticsearch_Master, _MOC_DevOps_Master]
status: complete
---

# Security and Monitoring

> [!abstract] TL;DR
> Elasticsearch 8.x enables security by default: TLS on transport + HTTP layers, built-in authentication, and RBAC for fine-grained access control. API keys authenticate services. Monitoring is done via Stack Monitoring (built-in) or Metricbeat/Prometheus exporter for external systems.

## Security Overview (ES 8.x Default)

```
ES 8.x out-of-the-box:
  ✓ TLS/SSL on inter-node transport (9300)
  ✓ TLS/SSL on HTTP REST API (9200)
  ✓ Built-in users with auto-generated passwords
  ✓ Bootstrap password for initial setup
  ✓ Kibana service token
```

In ES 7.x and below, security was disabled by default — all requests were unauthenticated and unencrypted.

## TLS Configuration

### Transport layer (inter-node)

```yaml
# elasticsearch.yml
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
```

### HTTP layer (REST API)

```yaml
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: http_keystore.p12
```

### Generate certificates (ES built-in tool)

```bash
# Generate CA + node certificate
bin/elasticsearch-certutil ca
bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12

# Generate HTTP cert
bin/elasticsearch-certutil http
```

## Authentication

### Built-in users

| User | Role | Purpose |
|------|------|---------|
| `elastic` | Superuser | Bootstrap admin account |
| `kibana_system` | `kibana_system` role | Kibana ↔ Elasticsearch communication |
| `logstash_system` | `logstash_system` role | Logstash ↔ Elasticsearch monitoring |
| `beats_system` | `beats_system` role | Beats monitoring |
| `apm_system` | `apm_system` role | APM server monitoring |
| `remote_monitoring_user` | `remote_monitoring_collector` | Metricbeat monitoring |

```bash
# Reset built-in password
bin/elasticsearch-reset-password -u elastic

# Or set manually
POST /_security/user/elastic/_password
{ "password": "new-strong-password" }
```

### Native user management

```bash
# Create a user
POST /_security/user/john
{
  "password": "secure_password",
  "roles": ["read_only_analyst"],
  "full_name": "John Smith",
  "email": "john@company.com",
  "enabled": true
}

# List users
GET /_security/user
```

### Authentication realms

| Realm | Description |
|-------|-------------|
| `native` | Users stored in ES `.security` index (default) |
| `file` | Users in `config/users` file (admin recovery) |
| `ldap` | Active Directory / LDAP integration |
| `saml` | SAML 2.0 SSO (Okta, Azure AD) |
| `oidc` | OpenID Connect (Google, Okta) |
| `pki` | TLS client certificate |

## RBAC — Role-Based Access Control

### Built-in roles

| Role | Access level |
|------|-------------|
| `superuser` | Full cluster and index access |
| `kibana_admin` | Full Kibana management |
| `kibana_user` | Read access to Kibana features |
| `viewer` | Read-only cluster + index |
| `editor` | Read + write (no admin) |
| `monitor` | Cluster monitoring (read-only) |
| `manage_ilm` | Manage ILM policies |
| `ingest_admin` | Manage pipelines and templates |

### Custom role

```bash
PUT /_security/role/payments-analyst
{
  "cluster": ["monitor"],
  "indices": [
    {
      "names": ["orders-*", "payments-*"],
      "privileges": ["read", "view_index_metadata"],
      "query": {                              # document-level security
        "term": { "region": "EMEA" }          # only see EMEA documents
      },
      "field_security": {                     # field-level security
        "grant": ["order_id", "total", "timestamp", "status"],
        "except": ["internal_cost", "margin"]
      }
    }
  ],
  "applications": [
    {
      "application": "kibana-.kibana",
      "privileges": ["read"],
      "resources": ["space:payments-team"]
    }
  ]
}

# Assign to user
POST /_security/user/alice
{
  "password": "secure123",
  "roles": ["payments-analyst"]
}
```

## API Keys — Service Authentication

API keys are the recommended way to authenticate services and agents (no rotating passwords):

```bash
# Create an API key
POST /_security/api_key
{
  "name": "payment-service-key",
  "expiration": "30d",
  "role_descriptors": {
    "payment-writer": {
      "cluster": ["monitor"],
      "indices": [
        {
          "names": ["orders-*"],
          "privileges": ["index", "create_index"]
        }
      ]
    }
  }
}
# Response: { "id": "abc", "name": "payment-service-key", "api_key": "xyz123" }
# Use: Authorization: ApiKey <base64(id:api_key)>

# List API keys
GET /_security/api_key?name=payment-service-key

# Revoke
DELETE /_security/api_key
{ "ids": ["abc"] }
```

```bash
# Use API key in curl
curl -H "Authorization: ApiKey $(echo -n 'id:api_key' | base64)" https://localhost:9200/
```

## Stack Monitoring

### Built-in Stack Monitoring (legacy/Metricbeat-based)

```yaml
# elasticsearch.yml — send monitoring data to a monitoring cluster
xpack.monitoring.elasticsearch.collection.enabled: true
xpack.monitoring.elasticsearch.collection.interval: 10s
```

In Kibana: **Stack Management → Stack Monitoring**

### External monitoring with Metricbeat (recommended)

Separate Metricbeat instance collects ES metrics and sends to a monitoring cluster:

```yaml
# metricbeat.yml
metricbeat.modules:
  - module: elasticsearch
    xpack.enabled: true
    period: 10s
    hosts: ["https://es-prod:9200"]
    username: remote_monitoring_user
    password: "secure_password"
    ssl.certificate_authorities: ["/etc/ssl/ca.crt"]

output.elasticsearch:
  hosts: ["https://monitoring-cluster:9200"]
  username: elastic
  password: "monitor_password"
```

## Prometheus Monitoring

The `elasticsearch_exporter` (Prometheus community) exposes ES metrics at `/metrics`:

```bash
# Run elasticsearch_exporter
docker run -d \
  --name elasticsearch_exporter \
  -p 9114:9114 \
  prometheuscommunity/elasticsearch-exporter:latest \
  --es.uri=https://elastic:password@es-host:9200 \
  --es.all \
  --es.shards

# Scrape config for Prometheus
scrape_configs:
  - job_name: 'elasticsearch'
    static_configs:
      - targets: ['elasticsearch-exporter:9114']
```

### Key Prometheus metrics

| Metric | Description |
|--------|-------------|
| `elasticsearch_cluster_health_status` | 0=green, 1=yellow, 2=red |
| `elasticsearch_indices_search_query_time_seconds_total` | Cumulative search time |
| `elasticsearch_indices_indexing_index_time_seconds_total` | Cumulative indexing time |
| `elasticsearch_jvm_memory_used_bytes{area="heap"}` | JVM heap used |
| `elasticsearch_jvm_gc_collection_duration_seconds_total` | GC pause time |
| `elasticsearch_os_cpu_percent` | CPU usage |
| `elasticsearch_filesystem_data_used_bytes` | Disk usage |
| `elasticsearch_thread_pool_rejected_count_total` | Rejected thread pool tasks |
| `elasticsearch_indices_segments_number` | Segment count |

### Grafana dashboards

Use community dashboards:
- **ID 2322** — Elasticsearch monitoring (by Oliver Lorenz)
- **ID 14191** — Elasticsearch Exporter Quickstart

## Key Alerts to Set Up

```yaml
# Grafana/AlertManager alert examples

# Cluster health not green
- alert: ElasticsearchClusterNotGreen
  expr: elasticsearch_cluster_health_status{color="green"} == 0
  for: 5m

# High heap usage
- alert: ElasticsearchHeapHigh
  expr: elasticsearch_jvm_memory_used_bytes{area="heap"} / elasticsearch_jvm_memory_max_bytes{area="heap"} > 0.85
  for: 10m

# Search rejections
- alert: ElasticsearchSearchRejections
  expr: rate(elasticsearch_thread_pool_rejected_count_total{name="search"}[5m]) > 1
  for: 5m

# Disk space low (< 10%)
- alert: ElasticsearchDiskLow
  expr: (elasticsearch_filesystem_data_available_bytes / elasticsearch_filesystem_data_size_bytes) < 0.10
  for: 5m
```

## Audit Logging

```yaml
# elasticsearch.yml
xpack.security.audit.enabled: true
xpack.security.audit.logfile.events.include:
  - access_denied
  - authentication_failed
  - connection_denied
  - anonymous_access_denied
  - run_as_denied
  - index_created
  - user_login
```

Audit logs appear in `logs/elasticsearch_audit.json` — structured JSON, importable into Elasticsearch itself.

## Common Pitfalls

- **Storing elastic superuser credentials in apps** — use API keys with minimal permissions; rotate on a schedule.
- **Document-level security performance** — DLS applies a query to every search; complex DLS queries on large indices significantly slow search; benchmark carefully.
- **Self-monitoring (sending metrics to itself)** — if the cluster is unhealthy, it can't record its own monitoring data; use a dedicated monitoring cluster.
- **HTTP security disabled in config** — `xpack.security.http.ssl.enabled: false` exposes the REST API unencrypted; production must always use HTTPS.
- **Not rotating API keys** — API keys with no expiration and no revocation are a security risk; set `expiration` and implement rotation procedures.

## Review Questions

1. What is the difference between transport-layer TLS and HTTP-layer TLS in Elasticsearch?
2. What is document-level security (DLS) and what are its performance implications?
3. When should you use API keys vs username/password authentication?
4. Why is it recommended to send ES monitoring data to a **separate** monitoring cluster?
5. What Prometheus metric would you alert on for search performance degradation?

#Elasticsearch #Search #ELK #Security #Monitoring #RBAC
