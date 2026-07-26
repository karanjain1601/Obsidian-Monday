---
title: SQLAlchemy and Databases
aliases: [SQLAlchemy, SQLAlchemy ORM, SQLAlchemy Core, Alembic, Python ORM, Python Database Layer]
tags: [python, sqlalchemy, databases, orm, sql, backend, alembic]
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related:
  - "[[SQL_for_ML]]"
  - "[[FastAPI_for_ML]]"
  - "[[Concurrency_in_Python]]"
  - "[[Context_Managers]]"
  - "[[ETL_ELT_for_ML]]"
  - "[[Pandas]]"
  - "[[pgvector]]"
status: complete
---

# SQLAlchemy and Databases

> [!abstract] TL;DR
> SQLAlchemy is the dominant Python database toolkit — it provides two complementary layers (Core for SQL expression building and ORM for object-relational mapping) plus Alembic for schema migrations, letting you go from raw SQL through a fully async, type-safe database layer without ever leaving Python.

---

## Intuition

**Analogy:** Think of a database connection as a power outlet, SQLAlchemy Core as an extension cord (you get raw power, shaped exactly how you want it), and the ORM as a smart power strip with surge protection, labeled ports, and automatic shut-off — it adds safety and convenience, but the electricity underneath is the same.

SQLAlchemy gives you the choice to plug in directly with the extension cord (Core: full SQL control, minimal magic) or use the smart strip (ORM: Python objects map to table rows, relationships traverse automatically, the session tracks all changes). Both talk to the same underlying `Engine`. Alembic is the electrician who manages safe upgrades to the wiring over time.

---

## How It Works

### Core Mechanics

SQLAlchemy is organised into two layers that sit on top of the database dialect/DBAPI:

1. **Engine** — manages the connection pool; the single object you create once per application process.
2. **Core (SQL Expression Language)** — constructs SQL programmatically using Python objects (`select()`, `insert()`, `Table`). Renders to dialect-specific SQL at execution time.
3. **ORM** — maps Python classes to database tables. A `Session` tracks object state and flushes changes as SQL when you commit. Implements the *Unit of Work* pattern.
4. **Alembic** — migration tool that generates and runs schema-change scripts against the Engine, tracking version history in a `alembic_version` table.

### Flow / Architecture

```mermaid
graph TD
    App[Application_Code] --> Session
    App --> Conn[Core_Connection]

    subgraph ORM_Layer
        Session --> UoW[Unit_of_Work]
        UoW --> IM[Identity_Map]
        IM --> MappedClasses[Mapped_Classes_User_Order]
    end

    subgraph Core_Layer
        Conn --> SEL[SQL_Expression_Language]
        SEL --> Text[text_raw_SQL]
    end

    Session --> Engine
    Conn --> Engine

    subgraph Engine_Layer
        Engine --> Pool[QueuePool_5_plus_10]
        Pool --> Dialect[Dialect_psycopg2_asyncpg]
        Dialect --> DBAPI[DBAPI_Driver]
    end

    DBAPI --> DB[(PostgreSQL_MySQL_SQLite)]

    subgraph Async_Variant
        AsyncSession --> AsyncEngine
        AsyncEngine --> AsyncPool[AsyncAdaptedQueuePool]
        AsyncPool --> AsyncDialect[asyncpg_aiomysql]
    end

    AsyncDialect --> DB
```

---

## Engine and Connection Pool

```python
from sqlalchemy import create_engine, text

# Synchronous PostgreSQL engine (psycopg2 driver, the default)
engine = create_engine(
    "postgresql+psycopg2://user:pass@localhost:5432/mydb",
    pool_size=5,          # persistent connections kept alive
    max_overflow=10,      # extra connections allowed under burst load (total cap = 15)
    pool_pre_ping=True,   # test connection health before using from pool
    echo=False,           # set True to log all SQL to stdout (dev only)
)

# Core usage: explicit connection, explicit transaction
with engine.connect() as conn:
    result = conn.execute(text("SELECT version()"))
    print(result.scalar())

# Core usage: auto-commit context manager (engine.begin())
with engine.begin() as conn:
    conn.execute(
        text("UPDATE users SET last_seen = NOW() WHERE id = :uid"),
        {"uid": 42}
    )
    # commits automatically on __exit__; rollback on exception

# Connection URL format:
#   dialect+driver://username:password@host:port/database
#   postgresql+psycopg2://...    (sync)
#   postgresql+asyncpg://...     (async)
#   mysql+pymysql://...
#   sqlite:///path/to/file.db    (file-based)
#   sqlite:///:memory:           (in-memory, great for tests)
```

---

## SQLAlchemy Core — SQL Expression Language

```python
from sqlalchemy import (
    MetaData, Table, Column, Integer, String, ForeignKey,
    select, insert, update, delete
)

metadata = MetaData()

users_table = Table(
    "users", metadata,
    Column("id",    Integer, primary_key=True),
    Column("name",  String(100), nullable=False),
    Column("email", String(255), unique=True),
)

orders_table = Table(
    "orders", metadata,
    Column("id",      Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("amount",  Integer, nullable=False),
)

# DDL
metadata.create_all(engine)

with engine.begin() as conn:
    # INSERT
    conn.execute(
        insert(users_table),
        [{"name": "Alice", "email": "alice@example.com"},
         {"name": "Bob",   "email": "bob@example.com"}]
    )

    # SELECT with WHERE, ORDER BY, LIMIT
    stmt = (
        select(users_table)
        .where(users_table.c.name.like("A%"))
        .order_by(users_table.c.name)
        .limit(10)
    )
    rows = conn.execute(stmt).fetchall()   # list of Row objects
    for row in rows:
        print(row.name, row.email)

    # JOIN
    stmt = (
        select(users_table.c.name, orders_table.c.amount)
        .join(orders_table, users_table.c.id == orders_table.c.user_id)
    )
    results = conn.execute(stmt).fetchall()

    # UPDATE
    conn.execute(
        update(users_table)
        .where(users_table.c.email == "alice@example.com")
        .values(name="Alicia")
    )

    # DELETE
    conn.execute(
        delete(users_table).where(users_table.c.id == 99)
    )
```

**When to use Core vs ORM:**
- Core: ETL pipelines, bulk operations, complex analytics queries, when you want SQL-level control.
- ORM: CRUD web services, domain model with relationships, when objects represent business entities.

---

## ORM — Declarative Models

```python
from sqlalchemy import (
    String, Integer, Float, Boolean, DateTime, JSON, Enum,
    ForeignKey, UniqueConstraint, Index, CheckConstraint
)
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, mapped_column, relationship
)
from datetime import datetime
import enum

class Base(DeclarativeBase):
    pass

class Role(enum.Enum):
    admin = "admin"
    user  = "user"

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
        Index("ix_users_name", "name"),
        CheckConstraint("char_length(email) > 3", name="ck_users_email_len"),
    )

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True)
    name:       Mapped[str]           = mapped_column(String(100), nullable=False)
    email:      Mapped[str]           = mapped_column(String(255), nullable=False)
    role:       Mapped[Role]          = mapped_column(Enum(Role), default=Role.user)
    score:      Mapped[float | None]  = mapped_column(Float, nullable=True)
    is_active:  Mapped[bool]          = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow)
    meta:       Mapped[dict | None]   = mapped_column(JSON, nullable=True)

    # One-to-many relationship
    orders: Mapped[list["Order"]] = relationship(
        "Order",
        back_populates="user",
        cascade="all, delete-orphan",  # delete orders when user is deleted
        lazy="select",                 # default: lazy-load on first access
    )

class Order(Base):
    __tablename__ = "orders"

    id:      Mapped[int]   = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int]   = mapped_column(ForeignKey("users.id"), nullable=False)
    amount:  Mapped[float] = mapped_column(Float, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="orders")
```

---

## Session and Unit of Work

```python
from sqlalchemy.orm import sessionmaker, Session

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=True,           # flush before queries (keeps session consistent)
    expire_on_commit=True,    # default: expire objects after commit (reload on next access)
)

# Pattern: always use a context manager
with SessionLocal() as session:
    # ADD new objects
    user = User(name="Alice", email="alice@example.com")
    session.add(user)
    session.flush()   # sends INSERT, assigns user.id — does NOT commit

    order = Order(user_id=user.id, amount=99.99)
    session.add(order)
    session.commit()  # finalise transaction; all objects expire (expire_on_commit=True)

    # QUERY: primary key lookup (hits identity map cache first)
    alice = session.get(User, user.id)

    # QUERY: 2.0-style select
    from sqlalchemy import select
    stmt = select(User).where(User.email == "alice@example.com")
    result = session.execute(stmt)

    user_obj = result.scalar_one()           # exactly one row; raises if zero or multiple
    # result.scalar_one_or_none()            # None if no row, raises if multiple
    # result.scalars().all()                 # list of User objects

    # DELETE
    session.delete(alice)
    session.commit()

    # MERGE: upsert-like — if object with same PK exists in session, update it
    detached_user = User(id=1, name="Updated Alice", email="alice2@example.com")
    merged = session.merge(detached_user)
    session.commit()

    # ROLLBACK
    try:
        session.add(User(name="Bad", email=None))  # violates NOT NULL
        session.commit()
    except Exception:
        session.rollback()
```

---

## Code Demo

### 1. Full ORM Model with Alembic Migration

```python
# models.py — production-ready User/Order model
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True)
    email:      Mapped[str]           = mapped_column(String(255), nullable=False, unique=True)
    name:       Mapped[str]           = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow)
    orders:     Mapped[list["Order"]] = relationship(
        "Order", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )

class Order(Base):
    __tablename__ = "orders"

    id:         Mapped[int]   = mapped_column(Integer, primary_key=True)
    user_id:    Mapped[int]   = mapped_column(ForeignKey("users.id"), nullable=False)
    amount:     Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user:       Mapped["User"]   = relationship("User", back_populates="orders")
```

```bash
# alembic/env.py — point autogenerate at your models
# (after running: alembic init alembic)

# In env.py, import Base from your models so Alembic can diff:
# from myapp.models import Base
# target_metadata = Base.metadata

alembic revision --autogenerate -m "add users and orders tables"
# Creates: alembic/versions/xxxx_add_users_and_orders_tables.py

alembic upgrade head      # apply all pending migrations
alembic downgrade -1      # roll back the last migration
alembic current           # show current revision
alembic history           # show migration log
```

```python
# alembic/versions/xxxx_add_status_to_orders.py — example data migration
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(50), nullable=True))
    # Data migration: backfill existing rows
    op.execute("UPDATE orders SET status = 'pending' WHERE status IS NULL")
    # Now safe to make non-nullable
    op.alter_column("orders", "status", nullable=False)
    op.create_index("ix_orders_status", "orders", ["status"])

def downgrade():
    op.drop_index("ix_orders_status", table_name="orders")
    op.drop_column("orders", "status")
```

---

### 2. Async FastAPI Dependency with AsyncSession

```python
# pip install sqlalchemy[asyncio] asyncpg fastapi

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from fastapi import FastAPI, Depends
from sqlalchemy import select
from typing import AsyncGenerator

# Create async engine (asyncpg driver for PostgreSQL)
async_engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost:5432/mydb",
    pool_size=10,
    max_overflow=20,
    echo=False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,   # important for async: avoids lazy-load after commit
    autoflush=False,
)

# FastAPI dependency: yields a session per request, always closes it
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # selectinload required — no lazy loading in async context
    from sqlalchemy.orm import selectinload
    stmt = (
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.orders))  # eagerly load orders in a second IN query
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return {"name": user.name, "order_count": len(user.orders)}
```

---

### 3. Bulk Insert with Core INSERT and ON CONFLICT DO UPDATE (Upsert)

```python
from sqlalchemy.dialects.postgresql import insert as pg_insert

# Core bulk insert: single round-trip, bypasses ORM overhead entirely
with engine.begin() as conn:
    # Plain bulk insert (fastest for pure inserts)
    conn.execute(
        insert(users_table),
        [
            {"name": "Carol", "email": "carol@example.com"},
            {"name": "Dave",  "email": "dave@example.com"},
        ]
    )

    # Upsert (PostgreSQL ON CONFLICT DO UPDATE)
    stmt = pg_insert(users_table).values([
        {"name": "Alice", "email": "alice@example.com"},
        {"name": "Eve",   "email": "eve@example.com"},
    ])
    upsert_stmt = stmt.on_conflict_do_update(
        index_elements=["email"],          # the unique constraint to detect conflicts on
        set_={"name": stmt.excluded.name}  # update name if email already exists
    )
    conn.execute(upsert_stmt)
```

---

### 4. N+1 Query Problem — Demo and Fix

```python
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy import select

# ─── WRONG: N+1 queries ───────────────────────────────────────────────────
with SessionLocal() as session:
    users = session.execute(select(User)).scalars().all()  # 1 query: SELECT users
    for user in users:
        print(user.orders)  # 1 query PER user: SELECT orders WHERE user_id = ?
        # With 1000 users → 1001 queries total — catastrophic

# ─── CORRECT: selectinload (best for collections) ─────────────────────────
with SessionLocal() as session:
    stmt = select(User).options(selectinload(User.orders))
    users = session.execute(stmt).scalars().all()
    # Fires 2 queries total:
    #   1. SELECT * FROM users
    #   2. SELECT * FROM orders WHERE user_id IN (1, 2, 3, ...)
    for user in users:
        print(user.orders)  # already loaded — no additional queries

# ─── CORRECT: joinedload (best for single-row relationships) ──────────────
with SessionLocal() as session:
    stmt = (
        select(Order)
        .options(joinedload(Order.user))    # JOIN in the same query
    )
    orders = session.execute(stmt).unique().scalars().all()
    # Fires 1 query:
    #   SELECT orders.*, users.* FROM orders LEFT OUTER JOIN users ON ...
    for order in orders:
        print(order.user.name)  # already loaded — no additional query
```

---

## Loading Strategies Reference

| Strategy | How It Works | Best For | Caveat |
|---|---|---|---|
| `lazy="select"` (default) | Extra SELECT on first access | Small-scale, code simplicity | N+1 in loops; forbidden in async |
| `selectinload` | One IN-clause SELECT for all parents | Collections (one-to-many) | Two queries; great balance |
| `joinedload` | JOIN in the same query | Single-object relationships (many-to-one) | Row duplication on collections; use `.unique()` |
| `subqueryload` | Correlated subquery | Collections; legacy code | More memory than selectinload |
| `lazy="dynamic"` | Returns a query object | Deprecated in 2.0; avoid | Breaks async; use `write_only` instead |

---

## Real-World Example

> **Example — Instagram (Django + PostgreSQL, pattern applies directly to SQLAlchemy):** Instagram's backend exposes relationships like "user has many posts, posts have many comments." Without eager loading, rendering a feed of 20 posts with comment counts would fire 41 queries (1 + 20 posts + 20 comment-count queries). Instagram's data layer enforces eager loading for all feed endpoints — equivalent to `selectinload` — reducing that to 3 queries regardless of feed size. This single pattern is responsible for more database query-count reductions than any other ORM technique in production web services. The Alembic equivalent ensures that every schema change (adding a `story_id` column, creating an index on `post.created_at`) is tracked, reversible, and applied consistently across dev/staging/prod without manual `ALTER TABLE` commands.

---

## Trade-offs

| Aspect | ORM | Core (SQL Expression Language) | Raw SQL via `text()` |
|---|---|---|---|
| Abstraction | Highest — Python objects, relationship traversal | Medium — programmatic SQL building | None — full SQL control |
| Performance | Overhead from object hydration | Near-raw speed | Fastest; no ORM overhead |
| Complex queries | Awkward (window fns, CTEs need Core fallback) | Natural | Fully expressive |
| Portability | Dialect-agnostic by default | Mostly dialect-agnostic | Tied to specific SQL dialect |
| Maintainability | High — refactors propagate via model | Medium | Low — SQL strings in code |

| Strategy | N+1 risk | Memory | Query count | Best for |
|---|---|---|---|---|
| `selectinload` | None | Low | 2 | Collections (one-to-many) |
| `joinedload` | None | Higher (duplicated rows) | 1 | Many-to-one (single objects) |
| `subqueryload` | None | Medium | 2 | Collections; legacy |
| Lazy (default) | High in loops | Low | N+1 | Simple scripts; never async |

| Mode | Complexity | Throughput | Framework fit |
|---|---|---|---|
| Sync SQLAlchemy | Low — familiar blocking code | Good for I/O-bound workers | Flask, Django, CLI tools |
| Async SQLAlchemy | Higher — no lazy loads; `await` everywhere | Excellent — thousands of concurrent connections | FastAPI, Starlette, async services |

---

## When to Use vs Avoid

**Use SQLAlchemy ORM when:**
- Building CRUD services where tables map cleanly to domain objects.
- The team values refactoring safety over raw SQL flexibility.
- You need Alembic-managed migrations in a CI/CD pipeline.
- You want to switch databases (SQLite in tests, PostgreSQL in prod) without changing application code.

**Use SQLAlchemy Core when:**
- Running bulk data pipelines where ORM object overhead matters.
- Writing analytical queries with CTEs, window functions, or dialect-specific features.
- You want SQL expressibility but parameterized query safety (no f-string injection risk).

**Avoid SQLAlchemy entirely when:**
- The application is pure read-only analytics — use `pandas.read_sql()` or DuckDB directly.
- You are writing data migrations that need to operate on billions of rows — prefer `COPY` / native bulk tools.
- The team has a deep SQL background and the ORM abstraction adds confusion without value.

---

## Common Pitfalls

- **N+1 queries with lazy loading in loops** — accessing a relationship inside a `for` loop with the default `lazy="select"` fires one SELECT per parent object. Fix by adding `.options(selectinload(...))` to every query that will traverse a relationship. Audit with `echo=True` — if you see the same query repeated hundreds of times, you have N+1.

- **`DetachedInstanceError` after session close** — accessing a lazy relationship on an ORM object after its session has been closed raises `DetachedInstanceError`. Root cause: `expire_on_commit=True` expires all attributes on commit, and lazy loading requires an open session. Fix: eager-load relationships before the session closes, or set `expire_on_commit=False` on read-heavy sessions.

- **`expire_on_commit=True` causing unexpected DB round-trips** — after `session.commit()`, every attribute access reloads from the database. In a high-QPS API endpoint, this doubles query count. Set `expire_on_commit=False` on `async_sessionmaker` for async FastAPI services where you won't reuse objects after commit.

- **Raw SQL with f-strings instead of `text()` bound parameters** — `conn.execute(text(f"SELECT * FROM users WHERE name = '{name}'"))` is a SQL injection vulnerability. Always use `text("... WHERE name = :name")` with `{"name": name}` as the second argument. SQLAlchemy's ORM and Core never interpolate values directly; only `text()` misuse is dangerous.

- **Alembic autogenerate missing changes** — `alembic revision --autogenerate` detects column additions/removals and index changes, but silently misses: server-side column default changes, `CHECK` constraint modifications, partial indexes, and changes inside stored procedures. Always review the generated migration script before running `upgrade`. For missed changes, write the `op.execute()` calls manually.

- **Async lazy loading prohibition** — accessing a lazy relationship inside an `async with AsyncSession` block raises `MissingGreenlet`. Async SQLAlchemy cannot transparently issue a blocking SELECT mid-execution. Every relationship accessed in async code must be declared `lazy="selectin"` or loaded explicitly with `.options(selectinload(...))`. No exceptions.

---

## Related Concepts

- [[SQL_for_ML]] — foundational SQL patterns (window functions, CTEs, feature engineering) that map directly to SQLAlchemy Core expressions and `text()` raw queries
- [[FastAPI_for_ML]] — async FastAPI uses `AsyncSession` via `Depends(get_db)` dependency injection; the session lifecycle shown here is the standard pattern for FastAPI + SQLAlchemy services
- [[Concurrency_in_Python]] — the asyncio model underpins async SQLAlchemy; understanding `async/await`, the event loop, and I/O-bound vs CPU-bound constraints explains why lazy loading is forbidden in async contexts
- [[Context_Managers]] — `with engine.begin()`, `with SessionLocal() as session:`, and `async with AsyncSession() as session:` are all context manager patterns; understanding `__enter__`/`__exit__` explains the transaction lifecycle
- [[ETL_ELT_for_ML]] — Core bulk insert and upsert patterns are the preferred interface for loading transformed data into operational databases from ETL pipelines
- [[Pandas]] — `pd.read_sql(query, con=engine)` bridges SQLAlchemy engines directly into DataFrames; the two tools complement each other for analytics vs operational workloads
- [[pgvector]] — the `pgvector` PostgreSQL extension integrates with SQLAlchemy via a custom column type, enabling vector similarity search directly through ORM models

---

## Review Questions

1. A colleague calls `session.commit()` inside a loop that processes 500 user objects, then accesses `user.name` after each commit to build a response. The service is visibly slow. Explain the root cause at the SQLAlchemy session level and describe two distinct fixes with different performance trade-offs.

2. You need to load 1000 `Order` objects and display each order's associated `User.name`. Compare `selectinload(Order.user)` vs `joinedload(Order.user)` in terms of the SQL emitted, memory consumption, and when you would prefer each. What does `.unique()` do and when is it required?

3. Your Alembic autogenerate migration script looks correct but your staging environment fails with a `CHECK constraint violation` after `upgrade head`. The constraint was defined in the ORM model three months ago but never appeared in a migration. What categories of changes does Alembic autogenerate reliably detect, and what does it consistently miss? How do you fix this class of drift going forward?

4. A junior engineer sets `lazy="select"` on all relationships in an async FastAPI service with SQLAlchemy async. Their first integration test passes, but production throws `MissingGreenlet` errors under load. Explain exactly why this happens, and describe the minimal change needed to the model definitions and queries to fix it without sacrificing query efficiency.

---

## Sources

- [SQLAlchemy 2.0 Documentation — ORM Quickstart](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)
- [SQLAlchemy 2.0 — Relationship Loading Techniques](https://docs.sqlalchemy.org/en/20/orm/loading_relationships.html)
- [SQLAlchemy — Asynchronous I/O (asyncio)](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Alembic Documentation — Auto Generating Migrations](https://alembic.sqlalchemy.org/en/latest/autogenerate.html)
- [SQLAlchemy — Connection Pooling](https://docs.sqlalchemy.org/en/20/core/pooling.html)
- [PostgreSQL — ON CONFLICT (Upsert)](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)

---

#python #sqlalchemy #databases #orm #sql #backend #alembic
