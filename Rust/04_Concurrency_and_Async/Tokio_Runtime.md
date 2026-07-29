---
title: Tokio Runtime
aliases: [Tokio, tokio::main, tokio channels, tokio sync, tokio time]
tags: [Rust, tokio, async, runtime, networking, concurrency]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rust_Async_Await]]"
  - "[[Rust_Web_with_Axum]]"
  - "[[Rust_Threads]]"
  - "[[Rust_Web_Ecosystem]]"
status: complete
---

# Tokio Runtime

> [!abstract] TL;DR
> Tokio is Rust's most widely used async runtime — a multi-threaded executor, I/O event loop, and rich standard library for async programming. It provides async channels (mpsc, oneshot, broadcast, watch), sync primitives (Mutex, RwLock, Semaphore), timers (sleep, timeout, interval), and async file/network I/O. The `#[tokio::main]` macro bootstraps the runtime; `tokio::task::spawn` creates concurrent tasks.

---

## Intuition

Tokio is to async Rust what the JVM is to Java — a managed execution environment. It runs a **multi-threaded work-stealing scheduler** (default: one thread per CPU core). When a task yields (`.await`s on a pending future), its thread can immediately pick up another ready task. This lets thousands of concurrent I/O operations share a handful of OS threads.

Three layers:
1. **Tasks** (`tokio::task::spawn`) — lightweight green threads, scheduled by Tokio
2. **Sync primitives** (`tokio::sync`) — async-aware locks and channels that yield instead of blocking
3. **I/O drivers** (`tokio::net`, `tokio::fs`) — non-blocking I/O integrated with the OS event loop (epoll/kqueue/IOCP)

---

## Setup

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
# "full" enables: rt-multi-thread, macros, io-util, net, fs, sync, time, process, signal
# For minimal builds, enable only needed features: ["rt", "sync", "macros"]
```

```rust
// #[tokio::main] is sugar for:
// fn main() { tokio::runtime::Runtime::new().unwrap().block_on(async { ... }) }
#[tokio::main]
async fn main() {
    println!("running on tokio");
}

// Single-threaded runtime (for embedded or tests)
#[tokio::main(flavor = "current_thread")]
async fn main() {
    // only one OS thread — cooperative only
}
```

---

## tokio::task — Task Spawning

```rust
use tokio::task;

#[tokio::main]
async fn main() {
    // spawn — async task (must be Send + 'static for multi-thread runtime)
    let handle = task::spawn(async {
        println!("I am a task");
        42
    });
    let result = handle.await.unwrap();  // Result<T, JoinError>

    // spawn_local — for non-Send futures (single-thread runtime only)
    // Useful for Rc<T>, non-Send futures that can't cross thread boundaries

    // spawn_blocking — run synchronous/blocking code on a dedicated thread pool
    // Prevents blocking the async thread pool
    let result = task::spawn_blocking(|| {
        // CPU-intensive or sync I/O code here
        std::thread::sleep(std::time::Duration::from_millis(100));
        "sync work done"
    }).await.unwrap();

    // block_in_place — convert current thread to a blocking thread temporarily
    // (only valid in multi-thread runtime)
    let result = task::block_in_place(|| {
        // blocking work
        42
    });

    // JoinSet — manage a collection of tasks
    let mut set = task::JoinSet::new();
    for i in 0..10 {
        set.spawn(async move { i * i });
    }
    while let Some(result) = set.join_next().await {
        println!("{}", result.unwrap());
    }
}
```

---

## tokio::sync — Async-Aware Synchronization

### Mutex and RwLock

```rust
use tokio::sync::{Mutex, RwLock};
use std::sync::Arc;

#[tokio::main]
async fn main() {
    let data = Arc::new(Mutex::new(vec![1, 2, 3]));

    let d = Arc::clone(&data);
    let task = tokio::spawn(async move {
        let mut guard = d.lock().await;  // .await — yields if lock is held
        guard.push(4);
        // guard dropped here — lock released
    });

    task.await.unwrap();
    println!("{:?}", *data.lock().await);  // [1, 2, 3, 4]

    // RwLock — multiple readers, one writer
    let rwdata = Arc::new(RwLock::new(0u32));
    {
        let r1 = rwdata.read().await;   // shared read lock
        let r2 = rwdata.read().await;   // OK — multiple readers
        println!("{r1} {r2}");
    } // locks released

    *rwdata.write().await = 42;  // exclusive write lock
}
```

### Semaphore

```rust
use tokio::sync::Semaphore;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    // Limit to 5 concurrent operations
    let sem = Arc::new(Semaphore::new(5));
    let mut handles = vec![];

    for i in 0..20 {
        let permit = sem.clone().acquire_owned().await.unwrap();
        handles.push(tokio::spawn(async move {
            println!("running task {i}");
            tokio::time::sleep(std::time::Duration::from_millis(100)).await;
            drop(permit);  // releases the permit — allows another task to proceed
        }));
    }

    for h in handles { h.await.unwrap(); }
}
```

---

## tokio::sync — Channels

Tokio provides four channel types, each for different communication patterns:

```rust
use tokio::sync::{mpsc, oneshot, broadcast, watch};

#[tokio::main]
async fn main() {
    // --- mpsc: multi-producer, single-consumer ---
    let (tx, mut rx) = mpsc::channel::<String>(32);  // 32 = buffer size

    let tx2 = tx.clone();
    tokio::spawn(async move { tx.send("msg1".to_string()).await.unwrap(); });
    tokio::spawn(async move { tx2.send("msg2".to_string()).await.unwrap(); });

    while let Some(msg) = rx.recv().await {
        println!("received: {msg}");
    }

    // --- oneshot: single message (request-response pattern) ---
    let (resp_tx, resp_rx) = oneshot::channel::<i32>();

    tokio::spawn(async move {
        // simulate processing
        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
        resp_tx.send(42).unwrap();
    });

    let result = resp_rx.await.unwrap();
    println!("response: {result}");

    // --- broadcast: one producer, many consumers ---
    let (bcast_tx, _) = broadcast::channel::<String>(16);

    let mut sub1 = bcast_tx.subscribe();
    let mut sub2 = bcast_tx.subscribe();

    bcast_tx.send("broadcast!".to_string()).unwrap();

    println!("{}", sub1.recv().await.unwrap());  // "broadcast!"
    println!("{}", sub2.recv().await.unwrap());  // "broadcast!"

    // --- watch: latest-value channel (config, metrics, state) ---
    let (watch_tx, mut watch_rx) = watch::channel("initial");

    tokio::spawn(async move {
        tokio::time::sleep(std::time::Duration::from_millis(10)).await;
        watch_tx.send("updated").unwrap();
    });

    watch_rx.changed().await.unwrap();  // wait for a change
    println!("{}", *watch_rx.borrow());  // "updated"
}
```

---

## tokio::time — Timers and Timeouts

```rust
use tokio::time::{sleep, timeout, interval, Duration};

#[tokio::main]
async fn main() {
    // sleep — pause for a duration
    sleep(Duration::from_millis(100)).await;

    // timeout — cancel a future if it takes too long
    match timeout(Duration::from_millis(50), slow_operation()).await {
        Ok(result) => println!("completed: {result}"),
        Err(_)     => println!("timed out!"),
    }

    // interval — trigger at regular intervals
    let mut ticker = interval(Duration::from_millis(100));
    for _ in 0..5 {
        ticker.tick().await;  // first tick fires immediately
        println!("tick");
    }

    // interval with missed tick behavior
    use tokio::time::MissedTickBehavior;
    let mut precise_ticker = interval(Duration::from_millis(100));
    precise_ticker.set_missed_tick_behavior(MissedTickBehavior::Skip);

    // Instant — monotonic clock for measuring elapsed time
    let start = tokio::time::Instant::now();
    sleep(Duration::from_millis(50)).await;
    println!("elapsed: {:?}", start.elapsed());
}

async fn slow_operation() -> &'static str {
    sleep(Duration::from_secs(10)).await;
    "done"
}
```

---

## tokio::net and tokio::fs

```rust
use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};

#[tokio::main]
async fn server_example() {
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();

    loop {
        let (mut socket, addr) = listener.accept().await.unwrap();
        tokio::spawn(async move {
            let mut buf = [0u8; 1024];
            let n = socket.read(&mut buf).await.unwrap();
            socket.write_all(&buf[..n]).await.unwrap(); // echo back
        });
    }
}

// Async file I/O
use tokio::fs;

async fn file_example() -> anyhow::Result<()> {
    // Read file asynchronously
    let content = fs::read_to_string("input.txt").await?;
    
    // Write file asynchronously
    fs::write("output.txt", content.as_bytes()).await?;
    
    Ok(())
}
```

---

## select! — Racing Futures

```rust
use tokio::{select, time::{sleep, Duration}};
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel::<String>(1);

    tokio::spawn(async move {
        sleep(Duration::from_millis(50)).await;
        tx.send("message".to_string()).await.unwrap();
    });

    // Loop with select — handle multiple event sources
    loop {
        select! {
            msg = rx.recv() => {
                match msg {
                    Some(m) => println!("received: {m}"),
                    None    => { println!("channel closed"); break; }
                }
            }
            _ = sleep(Duration::from_millis(200)) => {
                println!("timeout waiting for message");
                break;
            }
        }
    }
}
```

---

## Common Pitfalls

- **Using `std::sync::Mutex` with `.await`** — holding a `std::sync::MutexGuard` across an `.await` point makes the future not `Send` (can't be moved between threads) and may deadlock. Use `tokio::sync::Mutex` inside async code.
- **`spawn_blocking` for all sync work** — `spawn_blocking` uses a separate thread pool (default: 512 threads). Don't use it for trivially fast computations — only for I/O or CPU-intensive sync work.
- **Not handling `JoinError`** — `handle.await` returns `Result<T, JoinError>`. A `JoinError` means the task panicked. Handle it appropriately.
- **Broadcast channel lag** — if a consumer falls behind, old messages are overwritten. `recv().await` returns `Err(RecvError::Lagged(n))` when `n` messages were missed.
- **Watch channel**: `borrow()` holds a read lock — don't hold it across `.await`. Call `.clone()` to get an owned value if you need to await while using the value.

---

## Review Questions

1. What is the difference between `tokio::task::spawn` and `tokio::task::spawn_blocking`? When would you use each?
2. You need to implement request-response across tasks: task A sends a request, task B processes it and sends back a response. Which Tokio channel type is ideal, and why?
3. Why should you use `tokio::sync::Mutex` inside async code instead of `std::sync::Mutex`? What goes wrong with the standard library version?
4. Explain the four channel types in `tokio::sync`. Give a concrete use case for each: `mpsc`, `oneshot`, `broadcast`, `watch`.

---

#Rust #tokio #async #runtime #networking #concurrency
