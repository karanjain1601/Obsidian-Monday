---
title: Async Python for Web Development
aliases: [Async Python, asyncio Web, Python async backend, httpx asyncio, aiofiles, async DB drivers]
tags: [python, asyncio, async, httpx, aiofiles, web, backend]
domain: AI-ML
difficulty: Advanced
created: 2026-07-26
related:
  - "[[Concurrency_in_Python]]"
  - "[[Context_Managers]]"
  - "[[Generators_and_Iterators]]"
  - "[[FastAPI_for_ML]]"
  - "[[Streaming_Responses]]"
  - "[[Python_for_ML]]"
  - "[[Model_Serving_Overview]]"
status: complete
---

# Async Python for Web Development

> [!abstract] TL;DR
> Async Python lets a single OS thread handle thousands of concurrent web operations — HTTP calls, DB queries, file I/O — by cooperatively yielding at every `await` point instead of blocking; the entire ecosystem (`httpx`, `aiofiles`, `asyncpg`, `asyncio.Queue`) is built around this model, and getting it wrong (any blocking call inside `async def`) silently freezes every concurrent user.

---

## Intuition

**Analogy:** A restaurant waiter who handles 30 tables alone — not because they move faster, but because they never stand still. They take table 1's order, walk it to the kitchen, and instead of waiting by the pass, they immediately check on table 2. The kitchen (I/O subsystem) signals "order up", and the waiter comes back to deliver. Blocking the event loop is the equivalent of the waiter standing frozen at table 5 watching a soufle bake for 20 minutes — all 29 other tables are ignored.

In technical terms: the event loop is the waiter, coroutines are the pending tables, and `await` is the moment the waiter hands off to the kitchen and walks away. Every `await` is a voluntary yield; no `await` means no yield — and a blocking operation without `await` freezes the entire loop.

---

## How It Works

### 1. asyncio Fundamentals Recap

The event loop is a single-threaded scheduler. It maintains a ready queue of coroutines and runs them one at a time, switching only at `await` points.

```
asyncio.run(main())          # creates a new event loop, runs until main() returns
await some_coro()            # suspends current coroutine, event loop runs others
task = asyncio.create_task(coro())  # schedules coro() immediately; it runs concurrently
                                    # do NOT just await coro() if you want concurrency
```

**Coroutine object vs Task:**
- `async def fetch(): ...` — defines a coroutine *function*.
- `fetch()` — calling it creates a *coroutine object*. It does NOT start running.
- `asyncio.create_task(fetch())` — wraps the object in a `Task`, schedules it immediately. It starts running on the next event loop iteration.
- `await fetch()` — suspends the *current* coroutine and runs `fetch()` to completion before continuing. Sequential, not concurrent.

**Introspection:**
```python
import asyncio

async def main() -> None:
    t = asyncio.create_task(some_coro(), name="worker-1")
    print(asyncio.current_task())    # the currently running Task
    print(asyncio.all_tasks())       # all live Tasks in the current loop
    await t
```

---

### 2. `asyncio.gather` and `TaskGroup`

**`asyncio.gather`** runs all coroutines concurrently and returns results as an ordered list:

```python
results = await asyncio.gather(
    fetch("url1"),
    fetch("url2"),
    fetch("url3"),
    return_exceptions=True,   # exceptions become list values; no early cancellation
)
# results[i] is either a return value or an Exception instance
```

With `return_exceptions=False` (default): the first exception is re-raised immediately. The remaining tasks continue running but their results are silently lost — a resource leak.

**`asyncio.TaskGroup` (Python 3.11+)** is structured concurrency: if any task raises, all siblings are cancelled immediately and the exception propagates as an `ExceptionGroup`:

```python
async with asyncio.TaskGroup() as tg:
    t1 = tg.create_task(fetch("url1"))
    t2 = tg.create_task(fetch("url2"))
    t3 = tg.create_task(fetch("url3"))
# All tasks are done or cancelled by this line — no orphaned coroutines
results = [t1.result(), t2.result(), t3.result()]
```

| | `asyncio.gather` | `asyncio.TaskGroup` |
|---|---|---|
| Exception handling | `return_exceptions=True` returns them as values | Cancels siblings, raises `ExceptionGroup` |
| Result collection | Ordered list from return value | Via `task.result()` per task |
| Orphaned tasks | Possible with default settings | Impossible — scope enforces completion |
| Python version | 3.4+ | 3.11+ |
| Best for | Fan-out needing all results regardless of errors | Production code where partial failure must abort the group |

**Rule of thumb:** Prefer `TaskGroup` for new code. Use `gather` when you need `return_exceptions=True` semantics (partial success is acceptable) or need pre-3.11 compatibility.

---

### 3. `httpx` for Async HTTP

`httpx.AsyncClient` is the async HTTP client. It reuses a connection pool, unlike creating a new client per request:

```python
import httpx, asyncio

# Always use as async context manager — ensures connections are closed
async with httpx.AsyncClient(
    timeout=httpx.Timeout(connect=3.0, read=10.0, write=5.0, pool=1.0),
    limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
) as client:
    resp = await client.get("https://api.example.com/data")
    resp.raise_for_status()
    data = resp.json()
```

**Streaming responses** (large payloads, don't buffer entire body):
```python
async with client.stream("GET", "https://files.example.com/large.bin") as resp:
    async for chunk in resp.aiter_bytes(chunk_size=65536):
        process(chunk)
```

**`httpx` vs `aiohttp`:**

| Aspect | `httpx` | `aiohttp` |
|--------|---------|-----------|
| API symmetry | Sync and async share identical API (`httpx.Client` / `httpx.AsyncClient`) | Async-only — sync support via separate `requests` |
| HTTP/2 | Built-in with `http2=True` | Not supported natively |
| Test mocking | `httpx.MockTransport` — no network required | `aioresponses` — separate library |
| Streaming | `aiter_bytes`, `aiter_lines`, `aiter_text` | `content.iter_chunked` |
| Maturity | Newer, rapid development | Older, battle-tested, slightly faster raw throughput |

---

### 4. Rate Limiting with Semaphores

`asyncio.Semaphore(n)` allows at most `n` coroutines to be inside the `async with` block simultaneously. It is the standard throttle for outbound HTTP:

```python
import asyncio, httpx

async def fetch_one(sem: asyncio.Semaphore, client: httpx.AsyncClient, url: str) -> dict:
    async with sem:                              # blocks if n coroutines already active
        resp = await client.get(url, timeout=10.0)
        resp.raise_for_status()
        return resp.json()

async def fetch_all(urls: list[str], max_concurrent: int = 20) -> list[dict]:
    sem = asyncio.Semaphore(max_concurrent)
    async with httpx.AsyncClient() as client:
        tasks = [fetch_one(sem, client, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)
```

For time-based rate limiting (e.g., 10 requests/second), use the `aiolimiter` library:
```python
from aiolimiter import AsyncLimiter
limiter = AsyncLimiter(max_rate=10, time_period=1.0)  # 10 req/s

async with limiter:
    resp = await client.get(url)
```

---

### 5. `aiofiles` for Async File I/O

Regular `open()` blocks the OS thread — and since asyncio runs on a single thread, this stalls the entire event loop. `aiofiles` wraps file operations in a thread pool internally:

```python
import aiofiles

# Async read
async with aiofiles.open("data.json", "r", encoding="utf-8") as f:
    content = await f.read()

# Async line iteration
async with aiofiles.open("log.txt", "r") as f:
    async for line in f:
        process(line.rstrip())

# Async write
async with aiofiles.open("output.bin", "wb") as f:
    await f.write(binary_data)

# Async filesystem ops
import aiofiles.os
await aiofiles.os.rename("old.txt", "new.txt")
await aiofiles.os.remove("temp.txt")
exists = await aiofiles.os.path.exists("config.yml")
```

**Key rule:** `open()` inside `async def` = event loop blocked for the duration of every read/write. Use `aiofiles` for any file I/O in async code that runs in production.

---

### 6. Async Database Drivers

Each driver exposes native async connection pools. Never create a new connection per request.

**`asyncpg` — PostgreSQL (fastest, native binary protocol):**
```python
import asyncpg

# Create pool once at app startup
pool = await asyncpg.create_pool(
    dsn="postgresql://user:pass@localhost/db",
    min_size=5,
    max_size=20,
)

# Per-request: acquire a connection from the pool
async with pool.acquire() as conn:
    rows = await conn.fetch("SELECT id, name FROM users WHERE active = $1", True)
    row = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
    value = await conn.fetchval("SELECT COUNT(*) FROM orders")

    # Prepared statements: compiled once, reused many times
    stmt = await conn.prepare("SELECT * FROM products WHERE category = $1")
    products = await stmt.fetch("electronics")

await pool.close()   # at app shutdown
```

**SQLAlchemy async (ORM layer over asyncpg):**
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db", pool_size=10)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async with AsyncSessionLocal() as session:
    result = await session.execute(select(User).where(User.active == True))
    users = result.scalars().all()
```

**Other async drivers:**

| Driver | Database | Notes |
|--------|----------|-------|
| `aiosqlite` | SQLite | Wraps sqlite3 in thread pool; good for dev/test |
| `motor` | MongoDB | Official async MongoDB driver built on asyncio |
| `redis.asyncio` | Redis | Replaced `aioredis`; ships with the `redis` package |
| `aiomysql` | MySQL | Async MySQL/MariaDB |

---

### 7. `asyncio.Queue` for Producer-Consumer

`asyncio.Queue` provides back-pressure: producers block when the queue is full, consumers block when it is empty. This is the foundation of async data pipelines.

```python
import asyncio

queue: asyncio.Queue[str] = asyncio.Queue(maxsize=50)

# Producer: generates work
async def producer(n: int) -> None:
    for i in range(n):
        await queue.put(f"job_{i}")   # blocks if queue is full
    # Signal completion to all consumers
    for _ in range(NUM_WORKERS):
        await queue.put(None)          # sentinel per worker

# Consumer: processes work
async def worker(wid: int) -> int:
    count = 0
    while True:
        item = await queue.get()       # blocks until item available
        if item is None:
            queue.task_done()
            break
        await process(item)            # actual async work
        count += 1
        queue.task_done()              # signal this item is done
    return count

NUM_WORKERS = 4
async def pipeline() -> None:
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer(n=200))
        worker_tasks = [tg.create_task(worker(i)) for i in range(NUM_WORKERS)]

    total = sum(t.result() for t in worker_tasks)
    print(f"Processed {total} items across {NUM_WORKERS} workers")
```

`asyncio.PriorityQueue` accepts `(priority, item)` tuples and yields lowest-priority-value items first. Useful for scheduling work where some jobs are urgent.

---

### 8. Timeouts and Cancellation

**Per-operation timeout (pre-3.11):**
```python
try:
    result = await asyncio.wait_for(fetch(url), timeout=5.0)
except asyncio.TimeoutError:
    # TimeoutError is a subclass of Exception in 3.11+; asyncio.TimeoutError before
    handle_timeout()
```

**Block-level deadline (3.11+, preferred):**
```python
try:
    async with asyncio.timeout(5.0):
        r1 = await fetch(url1)
        r2 = await fetch(url2)   # total budget for both
except TimeoutError:
    handle_timeout()
```

**Manual cancellation:**
```python
task = asyncio.create_task(long_running())
await asyncio.sleep(3.0)
task.cancel()               # injects CancelledError into the task at its next await
try:
    await task
except asyncio.CancelledError:
    pass                    # task was cancelled — expected
```

**Cleaning up on cancellation (correct pattern):**
```python
async def worker_with_cleanup() -> None:
    resource = await acquire_resource()
    try:
        await do_work(resource)
    except asyncio.CancelledError:
        await release_resource(resource)   # cleanup runs even if cancelled
        raise                              # MUST re-raise — otherwise task won't be marked cancelled
```

**`asyncio.shield(coro)`** — protects a coroutine from an outer cancellation (the shielded task continues running even if its parent is cancelled). Use with caution: the shielded task becomes an orphan if nothing else holds a reference to it.

**FastAPI lifespan for structured startup/shutdown:**
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: runs before first request
    app.state.db_pool = await asyncpg.create_pool(DATABASE_URL)
    yield
    # shutdown: runs after last request
    await app.state.db_pool.close()

app = FastAPI(lifespan=lifespan)
```

---

### 9. Running Sync Code from Async

**Never call blocking I/O or CPU work directly inside `async def`.** The event loop runs on one thread — any blocking call freezes all concurrent requests for its full duration.

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

# asyncio.to_thread (3.9+): runs sync function in the default thread pool
# Clean API; equivalent to run_in_executor(None, ...)
async def read_with_requests(url: str) -> str:
    import requests
    return await asyncio.to_thread(requests.get, url)

# run_in_executor: lower-level; allows custom executor
_thread_pool = ThreadPoolExecutor(max_workers=10)
_process_pool = ProcessPoolExecutor(max_workers=4)

async def call_blocking_db(query: str) -> list:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(_thread_pool, sync_db_query, query)

async def cpu_intensive(data: bytes) -> bytes:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(_process_pool, compress, data)
```

**`asyncio.to_thread` vs `run_in_executor`:**

| Aspect | `asyncio.to_thread` | `loop.run_in_executor` |
|--------|--------------------|-----------------------|
| Python version | 3.9+ | 3.4+ |
| API ergonomics | `await asyncio.to_thread(fn, a, b)` — simple | `await loop.run_in_executor(exec, fn, a, b)` — verbose |
| Custom executor | No — always uses default thread pool | Yes — pass any `Executor` instance |
| CPU-bound work | No — thread pool, still GIL-limited | Yes — pass `ProcessPoolExecutor` |

**Detecting event loop blockage:** Enable asyncio debug mode to get warnings when a coroutine holds the event loop for > 100ms:
```python
import asyncio
asyncio.run(main(), debug=True)
# or: PYTHONASYNCIODEBUG=1 python server.py
```

---

### 10. ASGI and Server Options

**WSGI** (Web Server Gateway Interface, PEP 3333): synchronous spec — one callable per request, one OS thread (or process) per concurrent request. Foundation of Flask, Django (classic mode).

**ASGI** (Asynchronous Server Gateway Interface, PEP 3394): async spec — `await app(scope, receive, send)`. One event loop can handle thousands of concurrent in-flight requests. Foundation of FastAPI, Starlette, Django Channels.

```
# WSGI callable signature
def app(environ: dict, start_response: callable) -> Iterable[bytes]: ...

# ASGI callable signature
async def app(scope: dict, receive: callable, send: callable) -> None: ...
```

**Server options:**

| Server | Description | Use case |
|--------|-------------|----------|
| `uvicorn` | ASGI server, single process, production-ready | Managed by an orchestrator (Kubernetes, ECS) |
| `gunicorn + UvicornWorker` | Multi-process manager; each worker is a uvicorn event loop | Classic VMs, systemd deployments |
| `hypercorn` | ASGI + HTTP/2 + HTTP/3 (QUIC) support | When HTTP/2 push or QUIC is required |

**Worker count for I/O-bound apps:** `2 × CPU_cores + 1`. I/O-bound workloads leave CPUs idle waiting for network/DB — more workers fill that slack.

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production: 4-core machine, I/O-bound
gunicorn app.main:app \
  -w 9 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120
```

---

### 11. Testing Async Code

```python
# pip install pytest anyio httpx

import pytest
import pytest_anyio  # or anyio; anyio runs tests on asyncio and trio
from httpx import AsyncClient
from myapp.main import app

# Mark test as async — anyio runs it in an event loop
@pytest.mark.anyio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as client:
        resp = await client.post("/users", json={"name": "Alice"})
    assert resp.status_code == 201
    assert resp.json()["name"] == "Alice"

# Mock async functions
from unittest.mock import AsyncMock, patch

@pytest.mark.anyio
async def test_fetch_with_mock():
    mock_resp = AsyncMock()
    mock_resp.json.return_value = {"key": "value"}
    mock_resp.raise_for_status = AsyncMock()

    with patch("myapp.services.client.get", return_value=mock_resp):
        result = await myapp.services.fetch_data("http://example.com")
    assert result == {"key": "value"}
```

**Event loop scope:** By default, pytest-anyio creates a new event loop per test function. For tests sharing expensive resources (DB pools, HTTP clients), use `anyio_backend` fixture with `scope="session"`.

---

### Flow / Architecture

**Event loop lifecycle — coroutine suspension and resumption:**

```mermaid
sequenceDiagram
    participant EL as Event Loop
    participant C as Coroutine
    participant IO as I/O Subsystem

    EL->>C: schedule via create_task()
    C->>EL: await io_operation()
    Note over EL: Suspends C, picks next ready task
    EL->>IO: register I/O callback (epoll/kqueue)
    Note over IO: Network/disk op in progress
    IO-->>EL: I/O ready signal
    EL->>C: resume with result
    C-->>EL: coroutine returns value
```

**Producer-consumer with `asyncio.Queue`:**

```mermaid
graph LR
    P1[Producer_1] -->|"await put()"| Q["asyncio.Queue\n(maxsize=50)"]
    P2[Producer_2] -->|"await put()"| Q
    Q -->|"await get()"| W1[Worker_1]
    Q -->|"await get()"| W2[Worker_2]
    Q -->|"await get()"| W3[Worker_3]
    W1 -->|task_done| JN{queue.join}
    W2 -->|task_done| JN
    W3 -->|task_done| JN
```

**ASGI vs WSGI architecture:**

```mermaid
graph LR
    subgraph WSGI["WSGI — Synchronous"]
        WC[Client] --> WG[Gunicorn]
        WG -->|one thread per req| WApp[Flask/Django]
        WApp -->|blocking DB call| WDB[(Database)]
        WDB -->|response| WC
    end
    subgraph ASGI["ASGI — Asynchronous"]
        AC[Client] --> UV[Uvicorn]
        UV -->|"await app(scope, receive, send)"| FA[FastAPI]
        FA --> T1[Coroutine_1]
        FA --> T2[Coroutine_2]
        FA --> T3[Coroutine_3]
        T1 -->|"await query()"| ADB[(asyncpg)]
        T2 -->|"await query()"| ADB
        ADB -->|results| AC
    end
```

---

## Code Demo

### 1. Fetch N URLs Concurrently with Semaphore Rate Limiting

```python
# pip install httpx
import asyncio
import httpx

async def fetch_url(
    sem: asyncio.Semaphore,
    client: httpx.AsyncClient,
    url: str,
) -> dict:
    """Fetch a single URL, throttled by the semaphore."""
    async with sem:
        try:
            resp = await client.get(url, timeout=10.0)
            resp.raise_for_status()
            return {"url": url, "status": resp.status_code, "bytes": len(resp.content)}
        except httpx.HTTPStatusError as e:
            return {"url": url, "error": f"HTTP {e.response.status_code}"}
        except Exception as e:
            return {"url": url, "error": str(e)}

async def fetch_all(urls: list[str], max_concurrent: int = 10) -> list[dict]:
    sem = asyncio.Semaphore(max_concurrent)
    async with httpx.AsyncClient(
        follow_redirects=True,
        limits=httpx.Limits(max_connections=max_concurrent + 5),
    ) as client:
        tasks = [fetch_url(sem, client, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=False)
    return results

if __name__ == "__main__":
    urls = [f"https://httpbin.org/get?n={i}" for i in range(20)]
    results = asyncio.run(fetch_all(urls, max_concurrent=5))
    for r in results:
        print(r)
```

### 2. `asyncio.Queue` Producer-Consumer Pipeline with Multiple Workers

```python
import asyncio
import random

SENTINEL = None

async def producer(queue: asyncio.Queue, n_jobs: int, n_workers: int) -> None:
    """Generates jobs and signals each worker to stop via sentinel."""
    for i in range(n_jobs):
        job = {"id": i, "payload": f"data_{i}"}
        await queue.put(job)
        print(f"[producer] queued job {i}  (queue size: {queue.qsize()})")
    for _ in range(n_workers):
        await queue.put(SENTINEL)   # one sentinel per worker

async def worker(wid: int, queue: asyncio.Queue) -> int:
    """Processes jobs until it receives the sentinel."""
    processed = 0
    while True:
        job = await queue.get()
        if job is SENTINEL:
            queue.task_done()
            break
        await asyncio.sleep(random.uniform(0.01, 0.05))   # simulate async I/O
        print(f"  [worker-{wid}] done job {job['id']}")
        processed += 1
        queue.task_done()
    return processed

async def main() -> None:
    N_JOBS = 30
    N_WORKERS = 4
    queue: asyncio.Queue = asyncio.Queue(maxsize=10)

    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer(queue, N_JOBS, N_WORKERS))
        worker_tasks = [tg.create_task(worker(i, queue)) for i in range(N_WORKERS)]

    totals = [t.result() for t in worker_tasks]
    print(f"Workers processed: {totals} — total: {sum(totals)}")

asyncio.run(main())
```

### 3. FastAPI Endpoint: Stream File from Disk via `aiofiles`

```python
# pip install fastapi uvicorn aiofiles
import asyncio
import aiofiles
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import aiofiles.os

app = FastAPI()

UPLOAD_DIR = "/tmp/uploads"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> dict:
    """Receive an uploaded file and write it asynchronously."""
    await aiofiles.os.makedirs(UPLOAD_DIR, exist_ok=True)
    dest = f"{UPLOAD_DIR}/{file.filename}"

    async with aiofiles.open(dest, "wb") as out:
        while chunk := await file.read(65536):   # 64 KB chunks
            await out.write(chunk)

    size = (await aiofiles.os.stat(dest)).st_size
    return {"filename": file.filename, "size_bytes": size}

@app.get("/download/{filename}")
async def download_file(filename: str) -> StreamingResponse:
    """Stream a file to the client without loading it fully into memory."""
    path = f"{UPLOAD_DIR}/{filename}"
    if not await aiofiles.os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")

    async def file_stream():
        async with aiofiles.open(path, "rb") as f:
            while chunk := await f.read(65536):
                yield chunk

    return StreamingResponse(file_stream(), media_type="application/octet-stream")
```

### 4. Async Retry Decorator with Exponential Backoff

```python
import asyncio
import functools
import logging
from typing import Callable, TypeVar, Any

log = logging.getLogger(__name__)
T = TypeVar("T")

def async_retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    backoff_factor: float = 2.0,
    exceptions: tuple = (Exception,),
) -> Callable:
    """Decorator: retries an async function with exponential backoff."""
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            delay = base_delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as exc:
                    if attempt == max_attempts:
                        log.error(f"{func.__name__} failed after {max_attempts} attempts")
                        raise
                    jitter = delay * 0.1 * (asyncio.get_running_loop().time() % 1)
                    wait = min(delay + jitter, max_delay)
                    log.warning(
                        f"{func.__name__} attempt {attempt} failed: {exc}. "
                        f"Retrying in {wait:.2f}s"
                    )
                    await asyncio.sleep(wait)
                    delay = min(delay * backoff_factor, max_delay)
        return wrapper
    return decorator

# Usage
import httpx

@async_retry(max_attempts=4, base_delay=0.5, exceptions=(httpx.TransportError, httpx.HTTPStatusError))
async def resilient_fetch(url: str) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()

if __name__ == "__main__":
    result = asyncio.run(resilient_fetch("https://httpbin.org/json"))
    print(result)
```

---

## Real-World Example

> **Example:** Discord's Python backend handles millions of concurrent WebSocket connections per gateway node. Each connection is a coroutine managed by an event loop. When a message arrives, the gateway coroutine reads it (`await websocket.receive()`), enqueues it to a dispatch `asyncio.Queue`, and immediately yields back to the event loop. A pool of worker coroutines pulls from the queue, fetches user data via `asyncpg` (non-blocking, native async), and sends back a response — all within a single OS thread per event loop. Discord replaced their aiohttp client with `httpx` for internal microservice calls to gain HTTP/2 multiplexing, reducing TCP handshake overhead by reusing a single connection for multiple concurrent requests to the same service.

---

## Trade-offs

| Aspect | `asyncio.gather` | `asyncio.TaskGroup` |
|--------|-----------------|---------------------|
| Error isolation | `return_exceptions=True` silently collects errors | First exception cancels all siblings |
| Partial success | Supported — process successful results, log failures | Not directly — all-or-nothing per group |
| Resource cleanup | Manual — orphaned tasks can linger | Automatic — scope exit guarantees completion |
| Exception type | Original exception or list of exceptions | `ExceptionGroup` (may need `except*`) |

| Aspect | `asyncio.to_thread` | `loop.run_in_executor` |
|--------|--------------------|-----------------------|
| Verbosity | `await asyncio.to_thread(fn, arg)` — minimal | `await loop.run_in_executor(pool, fn, arg)` — explicit |
| CPU-bound support | No (only thread pool) | Yes — pass `ProcessPoolExecutor` |
| Custom pool size | No | Yes — full executor control |
| Version requirement | Python 3.9+ | Python 3.4+ |

| Aspect | `httpx.AsyncClient` | `aiohttp.ClientSession` |
|--------|--------------------|-----------------------|
| Sync/async API parity | Identical API for `Client` and `AsyncClient` | `aiohttp` is async-only |
| HTTP/2 | Yes (`http2=True`) | No |
| Testing | `httpx.MockTransport` — no network | `aioresponses` (external library) |
| Raw throughput | Slightly lower than aiohttp on benchmarks | Marginally faster in high-load benchmarks |
| Connection pooling | `httpx.Limits` — clear config | Built-in but less ergonomic to configure |

---

## When to Use vs Avoid

**Use when:**
- Building API clients that make many outbound HTTP calls concurrently (scrapers, API aggregators, LLM orchestrators calling multiple providers)
- Serving I/O-bound endpoints where latency is dominated by DB queries or external API calls
- Implementing real-time data pipelines where `asyncio.Queue` provides back-pressure
- Writing FastAPI/Starlette endpoints — the framework is async-native; fighting it is wasteful

**Avoid when:**
- The codebase is entirely CPU-bound (model inference, image processing) — asyncio adds complexity with no concurrency benefit; use `ProcessPoolExecutor` instead
- All dependencies are sync-only and cannot be wrapped cheaply — wrapping everything in `to_thread` is not free and defeats some of the benefit
- Team is unfamiliar with async Python and the service handles < 10 concurrent users — the complexity cost exceeds the throughput benefit

---

## Common Pitfalls

- **`time.sleep()` inside `async def`** — Blocks the entire event loop for its full duration. Every other coroutine waits. Replace with `await asyncio.sleep(n)`. This is the single most common asyncio bug in production codebases.

- **Forgetting `await` on a coroutine call** — `result = some_coroutine()` creates a coroutine object that is never executed. Python 3.11+ emits `RuntimeWarning: coroutine was never awaited`, but the bug is silent in earlier versions. Always either `await` immediately or `asyncio.create_task()` if concurrent execution is intended.

- **`asyncio.gather` swallows exceptions** — With the default `return_exceptions=False`, the first exception is re-raised but the remaining tasks continue running without supervision. Their results are lost. With `return_exceptions=True`, exceptions are returned as values and can be silently ignored. Use `TaskGroup` when you need guaranteed cleanup on failure.

- **Sharing non-thread-safe objects across `run_in_executor` calls** — An `asyncio.Queue`, `asyncio.Lock`, or any asyncio primitive is NOT thread-safe. Passing them into a thread pool via `run_in_executor` causes undefined behavior. Use `queue.Queue` (the `threading` version) or `threading.Lock` for objects that cross the async/sync boundary.

- **Creating a new `httpx.AsyncClient` per request** — Each client creates a new connection pool. Under load, this exhausts file descriptors and adds TCP handshake latency per request. Create one client at app startup (lifespan) and share it via `app.state`.

- **Not re-raising `CancelledError`** — Catching `CancelledError` in cleanup code and not re-raising it marks the task as completed rather than cancelled. Structured concurrency (`TaskGroup`) depends on proper propagation to cancel siblings. Always `raise` after cleanup.

---

## Related Concepts

- [[Concurrency_in_Python]] — foundational coverage of the event loop, GIL, and all three concurrency models; this note builds directly on that foundation for web-specific patterns
- [[Context_Managers]] — `async with` and `@asynccontextmanager` underpin async resource management in httpx, aiofiles, asyncpg, and FastAPI lifespan; understanding `__aenter__`/`__aexit__` is prerequisite
- [[Generators_and_Iterators]] — `async for` and async generators (`async def` with `yield`) are the mechanism behind `aiter_bytes()`, streaming file responses, and SSE token streaming
- [[FastAPI_for_ML]] — production deployment of async endpoints; covers lifespan, Pydantic validation, and uvicorn workers that sit on top of all patterns described here
- [[Streaming_Responses]] — SSE token streaming in LLM apps uses async generators and `asyncio.Queue` for the producer-consumer between the model inference thread and the HTTP response stream
- [[Python_for_ML]] — foundational Python context; GIL constraints and why I/O-bound ML serving benefits from asyncio while CPU-bound inference needs `ProcessPoolExecutor`
- [[Model_Serving_Overview]] — compares ASGI-based serving (FastAPI + uvicorn) against Triton and Ray Serve; the ASGI/WSGI architecture covered here informs those serving trade-offs

---

## Review Questions

1. **TaskGroup vs gather cancellation:** You have an `asyncio.TaskGroup` running three tasks: a DB reader, a transformer, and an S3 writer. The DB reader raises `asyncpg.TooManyConnectionsError` after 2 seconds. What happens to the transformer and writer tasks at the Python runtime level? If the transformer had already enqueued 50 items to an `asyncio.Queue` shared with the writer, what happens to those items, and how would you ensure the writer drains them before shutting down?

2. **Semaphore for rate limiting:** You need to scrape 10,000 URLs from a single domain without triggering a 429. The domain allows 5 requests per second. Using `asyncio.Semaphore` alone is insufficient — explain why, and describe a correct approach using either `aiolimiter` or a token-bucket pattern built with `asyncio.sleep`.

3. **`to_thread` thread safety:** A FastAPI endpoint reads a prediction from a shared `results: dict` that is populated by a background `asyncio.create_task`. A colleague suggests passing the dict into `asyncio.to_thread(process_results, results)` for heavy post-processing. What is the thread-safety risk, and what data structure or synchronization primitive would you use instead?

4. **ASGI vs WSGI key difference:** A Django application deployed on gunicorn (WSGI, 4 workers) handles an endpoint that makes 3 external API calls (each ~200ms) in sequence per request. Under 100 concurrent users, response time degrades to 15+ seconds. Explain the root cause in terms of the WSGI threading model, and describe exactly what changes when you migrate to FastAPI on uvicorn (ASGI) — including which part of the code must change and which workers are freed as a result.

---

## Sources

- [Python docs — asyncio](https://docs.python.org/3/library/asyncio.html)
- [httpx Documentation](https://www.python-httpx.org/)
- [aiofiles on PyPI](https://github.com/Tinche/aiofiles)
- [asyncpg Documentation](https://magicstack.github.io/asyncpg/current/)
- [ASGI Specification — PEP 3394 / asgi.readthedocs.io](https://asgi.readthedocs.io/en/latest/)
- [anyio Documentation](https://anyio.readthedocs.io/en/stable/)
- [aiolimiter — Async rate limiter](https://github.com/mjpieters/aiolimiter)
- [uvicorn Deployment Guide](https://www.uvicorn.org/deployment/)

---

#python #asyncio #async #httpx #aiofiles #web #backend
