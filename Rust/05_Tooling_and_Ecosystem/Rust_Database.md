---
title: Rust Database
aliases: [Rust DB, sqlx, Diesel ORM, SeaORM, Rust Postgres, Rust MySQL]
tags: [Rust, database, sqlx, diesel, seaorm, postgres, async, ORM]
domain: Rust
difficulty: Intermediate
created: 2026-07-30
related:
  - "[[Rust_Async_Await]]"
  - "[[Tokio_Runtime]]"
  - "[[Rust_Error_Handling]]"
  - "[[Rust_Serde]]"
  - "[[Rust_Web_with_Axum]]"
status: complete
---

# Rust Database

> [!abstract] TL;DR
> Rust has three major database libraries: sqlx (async, compile-time query verification against a live DB), Diesel (synchronous, compile-time schema via generated code), and SeaORM (async, ActiveModel ORM built on sqlx). Each trades ergonomics against control differently. sqlx is the de facto standard for async Rust backends; Diesel is the choice when you want maximum compile-time guarantees with a synchronous driver; SeaORM provides the highest-level ORM abstraction at the cost of some query control.

---

## Analogy and Intuition

Choosing a Rust database library is like choosing between three watches:

- **Diesel** is a Swiss mechanical watch — compile-time verified, precise, rigid. Every query is checked against your schema at build time using generated Rust code. Zero surprises at runtime, but you set up the schema definition upfront and the library enforces it.
- **sqlx** is a GPS sports watch — async-first, flexible, and verifies your SQL queries at compile time by connecting to a real database and checking them. It trusts you to write SQL, then validates that SQL is correct during `cargo build`.
- **SeaORM** is a smartwatch — high-level ORM, code-first entities, async. It is the most ergonomic of the three, offering ActiveRecord-style patterns, but you give up some direct SQL control for the abstraction.

The right choice depends on whether you prefer synchronous or async, how much you trust your SQL, and whether you want a full ORM or a thin query layer.

---

## Library Overview and Cargo Setup

```toml
# Cargo.toml — choose ONE primary library for your project

[dependencies]
# --- sqlx (async, multi-database) ---
sqlx = { version = "0.8", features = [
    "runtime-tokio",     # async runtime
    "tls-rustls",        # TLS support
    "postgres",          # or "mysql", "sqlite"
    "macros",            # query! and query_as! macros
    "migrate",           # sqlx migrate run
    "chrono",            # DateTime support
    "uuid",              # Uuid support
] }

# --- Diesel (sync, multi-database) ---
diesel = { version = "2.2", features = [
    "postgres",          # or "mysql", "sqlite"
    "r2d2",              # connection pooling
    "chrono",            # DateTime support
    "uuid",              # Uuid support
] }
diesel-migrations = "2.2"   # for embed_migrations!

# --- SeaORM (async, multi-database) ---
sea-orm = { version = "1.1", features = [
    "sqlx-postgres",     # underlying sqlx driver
    "runtime-tokio-rustls",
    "macros",
] }
sea-orm-migration = "1.1"   # migrations

# --- Connection pooling (if not using built-in pool) ---
deadpool-postgres = "0.14"  # standalone pool for tokio-postgres
```

---

## sqlx — Async Queries with Compile-Time Verification

sqlx's signature feature is the `query!` macro family. During `cargo build`, the macro connects to the database specified by `DATABASE_URL` in your environment and checks whether the SQL is valid and whether the column types match.

```rust
// src/main.rs — sqlx with PostgreSQL
use sqlx::{PgPool, Row};

#[derive(Debug, sqlx::FromRow)]
struct User {
    id: i32,
    username: String,
    email: String,
    active: bool,
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    // Create a connection pool (reads DATABASE_URL from environment)
    let pool = PgPool::connect("postgres://user:password@localhost/mydb").await?;

    // query_as! maps rows to a typed struct (verified at compile time)
    let users: Vec<User> = sqlx::query_as!(
        User,
        "SELECT id, username, email, active FROM users WHERE active = $1",
        true
    )
    .fetch_all(&pool)
    .await?;

    for user in &users {
        println!("{:?}", user);
    }

    // query! returns an anonymous record — columns are accessible by name
    let row = sqlx::query!(
        "SELECT COUNT(*) as count FROM users"
    )
    .fetch_one(&pool)
    .await?;
    println!("Total users: {}", row.count.unwrap_or(0));

    // Insert with RETURNING to get the generated id
    let new_id: i32 = sqlx::query_scalar!(
        "INSERT INTO users (username, email, active) VALUES ($1, $2, $3) RETURNING id",
        "alice",
        "alice@example.com",
        true
    )
    .fetch_one(&pool)
    .await?;
    println!("Created user with id: {}", new_id);

    Ok(())
}
```

### Pool Configuration

```rust
use sqlx::postgres::PgPoolOptions;
use std::time::Duration;

let pool = PgPoolOptions::new()
    .max_connections(20)                          // maximum open connections
    .min_connections(5)                           // keep this many connections warm
    .acquire_timeout(Duration::from_secs(5))      // fail fast if no connection available
    .idle_timeout(Duration::from_secs(600))       // close idle connections after 10 min
    .max_lifetime(Duration::from_secs(1800))      // recycle connections after 30 min
    .connect("postgres://user:password@localhost/mydb")
    .await?;
```

### Transactions

```rust
async fn transfer_funds(
    pool: &PgPool,
    from_id: i32,
    to_id: i32,
    amount: i64,
) -> Result<(), sqlx::Error> {
    // begin() returns a Transaction, which derefs to an Executor
    let mut tx = pool.begin().await?;

    sqlx::query!(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
        amount, from_id
    )
    .execute(&mut *tx)
    .await?;

    sqlx::query!(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
        amount, to_id
    )
    .execute(&mut *tx)
    .await?;

    // commit() consumes the transaction; drop() without commit() rolls back
    tx.commit().await?;
    Ok(())
}
```

### sqlx Migrations

```bash
# Install the sqlx CLI
cargo install sqlx-cli --features postgres

# Create a new migration file
sqlx migrate add create_users_table

# Run pending migrations
sqlx migrate run

# Revert the last migration
sqlx migrate revert

# Check migration status
sqlx migrate info
```

```sql
-- migrations/20240101000001_create_users_table.up.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrations/20240101000001_create_users_table.down.sql
DROP TABLE users;
```

```rust
// Embed and run migrations at application startup
sqlx::migrate!("./migrations")
    .run(&pool)
    .await
    .expect("Failed to run migrations");
```

---

## Diesel ORM — Synchronous, Compile-Time Schema

Diesel is the original Rust ORM. It is synchronous (use `spawn_blocking` in async contexts), and generates Rust code representing your database schema from which it checks all queries at compile time.

```bash
# Install the Diesel CLI
cargo install diesel_cli --no-default-features --features postgres

# Set up Diesel in a project (creates diesel.toml and migrations/)
diesel setup

# Generate a migration
diesel migration generate create_posts

# Run migrations (generates src/schema.rs automatically)
diesel migration run
```

```rust
// src/schema.rs — auto-generated by Diesel from your migrations
diesel::table! {
    posts (id) {
        id -> Int4,
        title -> Varchar,
        body -> Text,
        published -> Bool,
        author_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        username -> Varchar,
        email -> Varchar,
    }
}

diesel::joinable!(posts -> users (author_id));
diesel::allow_tables_to_appear_in_same_query!(posts, users);
```

```rust
// src/models.rs
use diesel::prelude::*;
use crate::schema::posts;

// Queryable: can be returned from a SELECT query
#[derive(Debug, Queryable, Selectable)]
#[diesel(table_name = posts)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
    pub author_id: i32,
}

// Insertable: can be used as data for INSERT
#[derive(Debug, Insertable)]
#[diesel(table_name = posts)]
pub struct NewPost<'a> {
    pub title: &'a str,
    pub body: &'a str,
    pub author_id: i32,
}
```

```rust
// src/db.rs — Diesel query examples
use diesel::prelude::*;
use diesel::pg::PgConnection;
use crate::schema::posts::dsl::*;
use crate::models::{Post, NewPost};

pub fn establish_connection(database_url: &str) -> PgConnection {
    PgConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn get_published_posts(conn: &mut PgConnection) -> Vec<Post> {
    posts
        .filter(published.eq(true))
        .order(id.desc())
        .limit(10)
        .select(Post::as_select())
        .load(conn)
        .expect("Error loading posts")
}

pub fn create_post(conn: &mut PgConnection, title: &str, body: &str, author: i32) -> Post {
    let new_post = NewPost { title, body, author_id: author };
    diesel::insert_into(posts)
        .values(&new_post)
        .returning(Post::as_returning())
        .get_result(conn)
        .expect("Error saving new post")
}

pub fn delete_post(conn: &mut PgConnection, post_id: i32) -> usize {
    diesel::delete(posts.filter(id.eq(post_id)))
        .execute(conn)
        .expect("Error deleting post")
}
```

### Using Diesel in an Async Context

```rust
use tokio::task;

// Diesel connections are not Send-safe for async — use spawn_blocking
async fn get_posts_async(pool: r2d2::Pool<diesel::r2d2::ConnectionManager<PgConnection>>) 
    -> Result<Vec<Post>, Box<dyn std::error::Error>> 
{
    let result = task::spawn_blocking(move || {
        let mut conn = pool.get().expect("Failed to get DB connection");
        get_published_posts(&mut conn)
    })
    .await?;
    Ok(result)
}
```

---

## SeaORM — Async, ActiveModel ORM

SeaORM provides the highest-level ORM abstraction in the Rust ecosystem, with code-first entities and an ActiveRecord-inspired API.

```bash
# Install the SeaORM CLI
cargo install sea-orm-cli

# Generate entities from an existing database schema
sea-orm-cli generate entity -u postgres://user:password@localhost/mydb -o src/entities
```

```rust
// src/entities/user.rs — auto-generated by sea-orm-cli
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub username: String,
    pub email: String,
    pub active: bool,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::post::Entity")]
    Post,
}

impl Related<super::post::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Post.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

```rust
// src/main.rs — SeaORM CRUD operations
use sea_orm::{Database, EntityTrait, ActiveModelTrait, Set, ColumnTrait, QueryFilter};
use entities::user::{self, Entity as User};

#[tokio::main]
async fn main() -> Result<(), sea_orm::DbErr> {
    let db = Database::connect("postgres://user:password@localhost/mydb").await?;

    // Find all users
    let users = User::find().all(&db).await?;

    // Find by primary key
    let user = User::find_by_id(1).one(&db).await?;

    // Find with filter
    let active_users = User::find()
        .filter(user::Column::Active.eq(true))
        .all(&db)
        .await?;

    // Insert using ActiveModel
    let new_user = user::ActiveModel {
        username: Set("bob".to_owned()),
        email: Set("bob@example.com".to_owned()),
        active: Set(true),
        ..Default::default()  // id is auto-generated
    };
    let inserted = new_user.insert(&db).await?;
    println!("Inserted user with id: {}", inserted.id);

    // Update
    let mut user_to_update: user::ActiveModel = User::find_by_id(1)
        .one(&db)
        .await?
        .unwrap()
        .into();
    user_to_update.email = Set("new@example.com".to_owned());
    user_to_update.update(&db).await?;

    // Delete
    User::delete_by_id(1).exec(&db).await?;

    Ok(())
}
```

---

## Architecture Comparison — Mermaid Diagram

```mermaid
flowchart TD
    App["Application Code"]

    subgraph Diesel["Diesel (Synchronous)"]
        DS["Diesel Schema<br/>(schema.rs — generated)"]
        DQ["QueryDSL<br/>(.filter/.select/.order)"]
        DC["PgConnection / r2d2 Pool"]
    end

    subgraph sqlx["sqlx (Async)"]
        SM["query! / query_as! macros<br/>(verified at compile time)"]
        SP["PgPool<br/>(built-in async pool)"]
    end

    subgraph SeaORM["SeaORM (Async)"]
        SE["Entity / ActiveModel<br/>(code-first)"]
        SR["EntityTrait::find()<br/>ActiveModelBehavior"]
        SS["sqlx underneath"]
    end

    DB[("PostgreSQL / MySQL / SQLite")]

    App --> DS
    App --> SM
    App --> SE

    DS --> DQ --> DC --> DB
    SM --> SP --> DB
    SE --> SR --> SS --> DB

    style Diesel fill:#e8d5b7
    style sqlx fill:#b7d5e8
    style SeaORM fill:#d5b7e8
```

---

## Trade-offs Table

| Feature | Diesel | sqlx | SeaORM |
|---------|--------|------|--------|
| Async support | No (use `spawn_blocking`) | Yes (native) | Yes (native) |
| Compile-time SQL check | Yes (generated schema) | Yes (requires live DB) | Partial (entity model) |
| Query language | QueryDSL (Rust API) | Raw SQL | Rust API + raw SQL |
| ORM abstraction | Medium | Low (thin layer) | High |
| Migration story | Diesel CLI, schema.rs regen | sqlx CLI, embed_migrations! | sea-orm-migration crate |
| Ecosystem maturity | Very mature (2015) | Mature (2019) | Newer (2021) |
| Ergonomics | Verbose setup | Moderate | Most ergonomic |
| Multi-database | Yes | Yes | Yes |
| Transactions | Closure-based | begin/commit/rollback | begin/commit/rollback |
| Connection pooling | r2d2 (external) | Built-in PgPool | Built-in (via sqlx) |
| Best for | Sync backends, max safety | Async backends, raw SQL | Async backends, high-level ORM |

---

## Common Pitfalls

- **Forgetting `DATABASE_URL` for sqlx compile-time checks** — sqlx's `query!` macro connects to a real database at compile time. If `DATABASE_URL` is not set in the environment (or `.env`), the build fails. Use `sqlx::query` (without `!`) to skip the check during offline development, or use `cargo sqlx prepare` to cache query metadata in a JSON file for CI builds without a live DB.

- **N+1 queries with SeaORM relations** — loading a list of users and then fetching each user's posts in a loop results in N+1 queries. Use `find_with_related()` or `load_many()` to fetch related data in a single join query.

- **Diesel is not async — blocking the tokio thread** — calling Diesel queries directly inside an async function blocks the tokio thread pool. Always wrap Diesel calls in `tokio::task::spawn_blocking`. For new async projects, prefer sqlx or SeaORM instead.

- **Connection pool exhaustion** — setting `max_connections` too low under high load causes requests to queue or timeout. Set it based on your PostgreSQL `max_connections` setting (typically 100 for a default Postgres install), minus connections reserved for admin access. Monitor pool wait times in production.

- **Forgetting to run migrations in production** — embedded migrations (`sqlx::migrate!` or `embed_migrations!`) only run if you call them at startup. Wire this into your application's startup sequence and ensure it runs before accepting requests.

- **Diesel's `schema.rs` getting out of sync** — after running a new migration you must re-run `diesel migration run` to regenerate `schema.rs`. Committing a migration without regenerating `schema.rs` causes compilation errors.

---

## Review Questions

1. sqlx's `query!` macro verifies SQL at compile time. What does this require at build time, and how do you handle CI environments where no live database is available?
2. Diesel is synchronous. If you are building an async Tokio-based web server, how do you safely use Diesel for database access without blocking the async runtime?
3. You have a SeaORM `User` entity with a `has_many` relation to `Post`. You want to load 50 users with all their posts in a single round trip. What SeaORM API do you use, and why does a naive `for user in users` loop fail?
4. Compare the transaction APIs of sqlx and Diesel. What happens if a sqlx `Transaction` is dropped without calling `commit()`?

---

#Rust #database #sqlx #diesel #seaorm #postgres #async #ORM
