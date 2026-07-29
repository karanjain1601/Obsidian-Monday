---
title: Rust Web Ecosystem
aliases: [reqwest, sqlx, tracing, Rust HTTP client, Rust database, Rust observability]
tags: [Rust, web, reqwest, sqlx, tracing, observability, metrics, database]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rust_Web_with_Axum]]"
  - "[[Tokio_Runtime]]"
  - "[[Rust_Serde]]"
  - "[[Rust_Error_Handling]]"
status: complete
---

# Rust Web Ecosystem

> [!abstract] TL;DR
> The Rust web ecosystem provides async-native equivalents for every production need: `reqwest` for HTTP clients, `sqlx` for async SQL with compile-time query checking, `tracing` for structured logging and distributed tracing, and `metrics` for Prometheus integration. All are built on Tokio and integrate seamlessly with Axum. Together they cover the full stack of a production Rust backend service.

---

## reqwest — HTTP Client

`reqwest` is the standard async HTTP client in Rust — built on `hyper` and `tokio`, with a clean high-level API.

```toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }
```

```rust
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Deserialize)]
struct GitHubUser {
    login: String,
    name: Option<String>,
    public_repos: u32,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Create a client — reuse it for connection pooling
    let client = Client::builder()
        .timeout(Duration::from_secs(10))
        .user_agent("my-app/1.0")
        .build()?;

    // Simple GET with JSON deserialization
    let user: GitHubUser = client
        .get("https://api.github.com/users/rust-lang")
        .header("Accept", "application/vnd.github.v3+json")
        .send()
        .await?
        .error_for_status()?   // returns Err if status >= 400
        .json()
        .await?;

    println!("{:?}", user);

    // POST with JSON body
    #[derive(Serialize)]
    struct CreateIssue { title: String, body: String }

    let response = client
        .post("https://api.github.com/repos/user/repo/issues")
        .bearer_auth("my_token")
        .json(&CreateIssue {
            title: "Bug report".to_string(),
            body: "Description here".to_string(),
        })
        .send()
        .await?;

    // Query parameters
    let response = client
        .get("https://api.example.com/search")
        .query(&[("q", "rust"), ("page", "1"), ("per_page", "20")])
        .send()
        .await?;

    // Check status
    match response.status() {
        StatusCode::OK => println!("success"),
        StatusCode::NOT_FOUND => println!("not found"),
        s => println!("unexpected: {s}"),
    }

    // Concurrent requests
    let urls = vec!["https://httpbin.org/get?n=1", "https://httpbin.org/get?n=2"];
    let futures: Vec<_> = urls.iter()
        .map(|url| client.get(*url).send())
        .collect();
    let responses = futures::future::join_all(futures).await;

    Ok(())
}
```

---

## sqlx — Async SQL with Compile-Time Checking

`sqlx` provides async database access with compile-time SQL verification — if your query references a column that doesn't exist, it's a compile error, not a runtime panic.

```toml
[dependencies]
sqlx = { version = "0.8", features = ["runtime-tokio", "postgres", "macros"] }
```

```rust
use sqlx::{PgPool, postgres::PgPoolOptions, Row};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct User {
    id: i64,
    username: String,
    email: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://localhost/myapp".to_string());

    // Connection pool (recommended for production)
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(std::time::Duration::from_secs(5))
        .connect(&database_url)
        .await?;

    // Run migrations (migrations/ folder)
    sqlx::migrate!("./migrations").run(&pool).await?;

    // Compile-time verified query — requires DATABASE_URL env var at compile time
    // and a live database to check the schema against (or offline mode)
    let users = sqlx::query_as!(
        User,
        "SELECT id, username, email, created_at FROM users WHERE active = true"
    )
    .fetch_all(&pool)
    .await?;

    println!("{} active users", users.len());

    // Insert with returning
    let new_user = sqlx::query_as!(
        User,
        "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at",
        "alice",
        "alice@example.com"
    )
    .fetch_one(&pool)
    .await?;

    println!("Created: {:?}", new_user);

    // Update
    let affected = sqlx::query!(
        "UPDATE users SET active = false WHERE id = $1",
        new_user.id
    )
    .execute(&pool)
    .await?
    .rows_affected();

    println!("Updated {affected} rows");

    // Transactions
    let mut tx = pool.begin().await?;
    sqlx::query!("INSERT INTO events (name) VALUES ($1)", "user_created")
        .execute(&mut *tx)
        .await?;
    sqlx::query!("UPDATE counters SET count = count + 1 WHERE name = 'users'")
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;

    Ok(())
}
```

---

## Redis with deadpool-redis

```toml
[dependencies]
deadpool-redis = "0.15"
redis = "0.25"
```

```rust
use deadpool_redis::{Config, Runtime, Pool};
use redis::AsyncCommands;

async fn get_redis_pool() -> anyhow::Result<Pool> {
    let cfg = Config::from_url("redis://127.0.0.1:6379");
    let pool = cfg.create_pool(Some(Runtime::Tokio1))?;
    Ok(pool)
}

async fn cache_example(pool: &Pool) -> anyhow::Result<()> {
    let mut conn = pool.get().await?;

    // SET with expiry
    conn.set_ex::<_, _, ()>("user:1", "Alice", 3600).await?;

    // GET
    let name: Option<String> = conn.get("user:1").await?;
    println!("{:?}", name);  // Some("Alice")

    // Increment counter
    let count: i64 = conn.incr("page_views", 1).await?;

    // JSON via serde
    use serde_json;
    let user = User { id: 1, username: "alice".to_string(), email: "a@b.com".to_string() };
    conn.set_ex::<_, _, ()>(
        "user:full:1",
        serde_json::to_string(&user)?,
        3600
    ).await?;

    Ok(())
}

#[derive(serde::Serialize, serde::Deserialize)]
struct User { id: u64, username: String, email: String }
```

---

## tracing — Structured Logging and Distributed Tracing

`tracing` replaces `log` in the Rust async world. It adds structured fields, span context (for distributed tracing), and integrates with OpenTelemetry.

```toml
[dependencies]
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
```

```rust
use tracing::{info, warn, error, debug, instrument, span, Level};

// #[instrument] auto-creates a span with function name and arguments logged
#[instrument(skip(password), fields(user_id))]
async fn login(username: &str, password: &str) -> Result<String, String> {
    tracing::Span::current().record("user_id", &"123");

    debug!("checking credentials");
    if password == "correct" {
        info!(username, "login successful");
        Ok("token".to_string())
    } else {
        warn!(username, "login failed — bad password");
        Err("invalid credentials".to_string())
    }
}

// Structured fields in log events
fn process_request(request_id: &str, user_id: u64) {
    info!(
        request_id,
        user_id,
        endpoint = "/api/users",
        "processing request"
    );

    error!(
        error.code = 500,
        error.message = "database unavailable",
        "request failed"
    );
}

fn main() {
    // Initialize subscriber — controls where/how logs are written
    tracing_subscriber::fmt()
        .with_env_filter("info,my_crate=debug")  // INFO by default, DEBUG for my_crate
        .with_target(true)
        .with_thread_ids(true)
        .init();

    // JSON output for production (machine-readable logs)
    tracing_subscriber::fmt()
        .json()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
        )
        .init();

    tokio::runtime::Runtime::new().unwrap().block_on(async {
        let _ = login("alice", "correct").await;
    });
}
```

---

## OpenTelemetry Integration

```toml
[dependencies]
opentelemetry = "0.23"
opentelemetry-otlp = { version = "0.16", features = ["tonic"] }
tracing-opentelemetry = "0.24"
```

```rust
use opentelemetry_otlp::WithExportConfig;

fn init_telemetry() -> anyhow::Result<()> {
    let tracer = opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(
            opentelemetry_otlp::new_exporter()
                .tonic()
                .with_endpoint("http://otel-collector:4317"),
        )
        .install_batch(opentelemetry_sdk::runtime::Tokio)?;

    let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);
    use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .with(telemetry)
        .init();

    Ok(())
}
```

---

## Prometheus Metrics

```toml
[dependencies]
metrics = "0.23"
metrics-exporter-prometheus = "0.15"
```

```rust
use metrics::{counter, gauge, histogram};
use metrics_exporter_prometheus::PrometheusBuilder;

fn setup_metrics() {
    PrometheusBuilder::new()
        .with_http_listener(([0, 0, 0, 0], 9090))  // expose /metrics on port 9090
        .install()
        .unwrap();
}

fn record_request(path: &str, status: u16, duration_ms: f64) {
    // Increment counter with labels
    counter!("http_requests_total", "path" => path.to_string(), "status" => status.to_string())
        .increment(1);

    // Record histogram for latency
    histogram!("http_request_duration_ms", "path" => path.to_string())
        .record(duration_ms);

    // Set gauge
    gauge!("active_connections").set(42.0);
}
```

---

## Common Pitfalls

- **Reusing `reqwest::Client`** — always create one `Client` and reuse it. Each `Client::new()` creates a new connection pool — creating one per request wastes connections and is slow.
- **`sqlx` offline mode for CI** — `query!` macros require a live database at compile time. Use `cargo sqlx prepare` to generate a `.sqlx/` snapshot for offline compilation in CI.
- **`tracing` spans in async code** — use `#[instrument]` instead of manually creating spans. Manual spans across `.await` points can cause incorrect parent-child relationships.
- **Metrics cardinality explosion** — avoid using request-unique values (user IDs, request IDs) as metric labels. High cardinality kills Prometheus performance.
- **`deadpool` connection acquisition** — `pool.get().await` can fail if all connections are in use and the timeout expires. Handle the error; don't unwrap.

---

## Review Questions

1. Why should `reqwest::Client` be created once and reused rather than created per request?
2. What does `sqlx::query!` do at compile time that runtime SQL execution cannot? What is the tradeoff, and how do you handle it in CI?
3. What is the difference between `tracing` spans and log messages? How does `#[instrument]` help with async code specifically?
4. What is "metrics cardinality" and why does it matter for Prometheus? Give an example of a label that would cause cardinality explosion.

---

#Rust #web #reqwest #sqlx #tracing #observability #metrics #database
