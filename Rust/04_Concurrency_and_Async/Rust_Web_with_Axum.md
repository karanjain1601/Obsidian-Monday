---
title: Rust Web with Axum
aliases: [Axum framework, Rust web server, Axum router, Axum extractors, Axum middleware]
tags: [Rust, web, axum, HTTP, REST, middleware, extractors]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Tokio_Runtime]]"
  - "[[Rust_Async_Await]]"
  - "[[Rust_Serde]]"
  - "[[Rust_Error_Handling]]"
  - "[[Rust_Web_Ecosystem]]"
status: complete
---

# Rust Web with Axum

> [!abstract] TL;DR
> Axum is a Rust web framework built on Tokio + Tower, designed around composable extractors and type-safe routing. Handler functions take typed extractors (Path, Query, Json, State) as parameters — the framework handles deserialization and error conversion automatically. Middleware is added as Tower layers. Axum produces the highest-performance web servers with ergonomic, type-safe code.

---

## Intuition

Axum's design philosophy is "functions as handlers." A handler is just an async function whose parameters are extractors (typed data from the request) and whose return value implements `IntoResponse`. There's no request object passed around — you declare exactly what you need, and Axum extracts it. This makes handlers highly testable and composable.

Tower is the middleware layer: any Tower `Service` or `Layer` can wrap an Axum router, giving you a huge ecosystem of middleware (rate limiting, tracing, compression, auth, CORS).

---

## Setup

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tower = "0.5"
tower-http = { version = "0.6", features = ["trace", "cors", "compression-gzip"] }
```

---

## Basic Server

```rust
use axum::{Router, routing::{get, post}, response::Json};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Serialize)]
struct Greeting {
    message: String,
}

// Handler — an async fn returning something that implements IntoResponse
async fn hello_world() -> Json<Greeting> {
    Json(Greeting { message: "Hello, World!".to_string() })
}

async fn health_check() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(hello_world))
        .route("/health", get(health_check));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## Extractors

Extractors are types that implement `FromRequest` or `FromRequestParts`. They are declared as function parameters:

```rust
use axum::{
    extract::{Path, Query, Json, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Deserialize)]
struct CreateUser {
    username: String,
    email: String,
}

#[derive(Serialize, Clone)]
struct User {
    id: u64,
    username: String,
    email: String,
}

#[derive(Deserialize)]
struct PaginationParams {
    page: Option<u32>,
    per_page: Option<u32>,
}

type AppState = Arc<Mutex<HashMap<u64, User>>>;

// Path extractor — captures URL segments
async fn get_user(
    State(db): State<AppState>,   // shared state
    Path(user_id): Path<u64>,     // /users/:user_id
) -> Result<Json<User>, StatusCode> {
    let db = db.lock().unwrap();
    db.get(&user_id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

// Query extractor — parses ?page=1&per_page=20
async fn list_users(
    State(db): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Json<Vec<User>> {
    let page = params.page.unwrap_or(1);
    let per_page = params.per_page.unwrap_or(10);
    let db = db.lock().unwrap();
    let users: Vec<User> = db.values().cloned().collect();
    Json(users) // simplified — no real pagination here
}

// Json extractor — deserializes request body
async fn create_user(
    State(db): State<AppState>,
    Json(payload): Json<CreateUser>,
) -> (StatusCode, Json<User>) {
    let mut db = db.lock().unwrap();
    let id = db.len() as u64 + 1;
    let user = User { id, username: payload.username, email: payload.email };
    db.insert(id, user.clone());
    (StatusCode::CREATED, Json(user))
}

fn create_app() -> Router {
    let db: AppState = Arc::new(Mutex::new(HashMap::new()));

    Router::new()
        .route("/users", get(list_users).post(create_user))
        .route("/users/:user_id", get(get_user))
        .with_state(db)
}
```

---

## Custom Error Handling

Axum expects handlers to return types that implement `IntoResponse`. For clean error handling, define a custom error type:

```rust
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("not found")]
    NotFound,
    #[error("validation error: {0}")]
    Validation(String),
    #[error("internal server error")]
    Internal(#[from] anyhow::Error),
}

// Implement IntoResponse — Axum can now return AppError from handlers
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match &self {
            AppError::NotFound        => (StatusCode::NOT_FOUND, self.to_string()),
            AppError::Validation(m)   => (StatusCode::UNPROCESSABLE_ENTITY, m.clone()),
            AppError::Internal(_)     => (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string()),
        };

        (status, Json(json!({ "error": msg }))).into_response()
    }
}

// Handler returning Result<T, AppError>
async fn handler() -> Result<Json<String>, AppError> {
    let data = fetch_from_db().await
        .map_err(AppError::Internal)?;
    Ok(Json(data))
}

async fn fetch_from_db() -> anyhow::Result<String> {
    Ok("data".to_string())
}
```

---

## Middleware with Tower

```rust
use tower::ServiceBuilder;
use tower_http::{
    trace::TraceLayer,
    cors::{CorsLayer, Any},
    compression::CompressionLayer,
};
use axum::middleware::{self, Next};
use axum::http::{Request, StatusCode};

// Custom middleware function
async fn auth_middleware(
    request: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    // Check Authorization header
    let auth_header = request
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok());

    if auth_header.map(|h| h.starts_with("Bearer ")).unwrap_or(false) {
        Ok(next.run(request).await)
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

fn app_with_middleware() -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/users", get(list_users_placeholder))
        .layer(middleware::from_fn(auth_middleware))  // route-level middleware
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())   // request tracing
                .layer(CompressionLayer::new())       // gzip compression
                .layer(cors),
        )
}

async fn list_users_placeholder() -> &'static str { "users" }
```

---

## Testing Handlers

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use axum::{body::Body, http::{Request, StatusCode}};
    use tower::ServiceExt;  // for .oneshot()

    #[tokio::test]
    async fn test_health_check() {
        let app = create_app();

        let request = Request::builder()
            .uri("/health")
            .body(Body::empty())
            .unwrap();

        let response = app.oneshot(request).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_create_user() {
        let app = create_app();

        let body = serde_json::json!({
            "username": "alice",
            "email": "alice@example.com"
        });

        let request = Request::builder()
            .method("POST")
            .uri("/users")
            .header("content-type", "application/json")
            .body(Body::from(serde_json::to_string(&body).unwrap()))
            .unwrap();

        let response = app.oneshot(request).await.unwrap();
        assert_eq!(response.status(), StatusCode::CREATED);
    }
}
```

---

## Deploying Axum

```rust
// Production configuration with graceful shutdown
#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::init();

    let app = create_app();

    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(3000);

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port))
        .await
        .unwrap();

    println!("Listening on port {port}");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("failed to install Ctrl+C handler");
    println!("Shutdown signal received");
}
```

---

## Common Pitfalls

- **Multiple extractors order** — when using `State`, always put it first or it may conflict with other extractors. `State` must appear before `Json` in the parameter list.
- **`Mutex` blocking the async thread** — using `std::sync::Mutex` for `AppState` is common but `lock().unwrap()` blocks. For high-concurrency apps, use `tokio::sync::Mutex` or `DashMap`.
- **Request body consumed once** — the JSON body can only be extracted once. If you need it in middleware and the handler, buffer it with `Bytes` extractor first.
- **Missing `#[derive(Clone)]` on State** — `State<T>` requires T to implement `Clone`. `Arc<T>` implements Clone cheaply (reference count increment).
- **Large response bodies** — use `StreamBody` or `axum::body::Body::from_stream` for large responses instead of loading everything into memory.

---

## Review Questions

1. What is an "extractor" in Axum? How does `Path<u64>` differ from `Query<Params>` in terms of where it gets its data?
2. How do you share application state (e.g., a database connection pool) across all handlers in Axum? What trait must the state type implement?
3. Explain how a custom error type is made returnable from Axum handlers. What trait must you implement, and what does it produce?
4. How do you test an Axum handler without starting an actual HTTP server? Which Tower method enables this?

---

#Rust #web #axum #HTTP #REST #middleware #extractors
