---
title: Rust Threads
aliases: [Rust threading, Rust Arc Mutex, Rust Rayon, Rust crossbeam, Rust thread safety]
tags: [Rust, concurrency, threads, Arc, Mutex, Rayon, Send, Sync]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rust_Async_Await]]"
  - "[[Tokio_Runtime]]"
  - "[[Smart_Pointers]]"
  - "[[Ownership_and_Borrowing]]"
status: complete
---

# Rust Threads

> [!abstract] TL;DR
> Rust's thread safety is enforced by two marker traits: `Send` (a type can be transferred between threads) and `Sync` (a type can be shared via reference between threads). The compiler prevents data races at compile time — you cannot share `Rc<T>` or non-thread-safe types across thread boundaries. `Arc<Mutex<T>>` is the standard pattern for shared mutable state. Rayon provides data parallelism via `par_iter()` with zero code restructuring.

---

## Intuition

The classic concurrency problem — two threads modifying shared data simultaneously — is a **compile error** in Rust, not a runtime crash. The type system enforces this: `Arc<T>` is an atomically reference-counted pointer (thread-safe), while `Rc<T>` is not (does not implement `Send`). Trying to move an `Rc` into a thread fails at compile time. This is "fearless concurrency": the compiler guarantees no data races, so you can fearlessly write parallel code.

---

## Spawning Threads

```rust
use std::thread;
use std::time::Duration;

fn main() {
    // thread::spawn — creates an OS thread
    let handle = thread::spawn(|| {
        for i in 0..10 {
            println!("spawned: {i}");
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 0..5 {
        println!("main: {i}");
        thread::sleep(Duration::from_millis(1));
    }

    // join() — wait for the thread to finish; returns Result
    handle.join().unwrap();
    // If we don't join, the spawned thread is killed when main exits

    // thread::sleep — yield CPU
    thread::sleep(Duration::from_millis(100));

    // Thread names (useful for debugging)
    let named_handle = thread::Builder::new()
        .name("worker-1".to_string())
        .spawn(|| println!("named thread"))
        .unwrap();
    named_handle.join().unwrap();

    // Current thread info
    println!("{:?}", thread::current().name());  // Some("main")
}
```

---

## move Closures — Moving Data into Threads

```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3];

    // Without move: data is borrowed — but thread may outlive this stack frame
    // ERROR: cannot borrow data in a variable that's moved into a thread
    // let handle = thread::spawn(|| println!("{:?}", data));

    // With move: data is MOVED into the thread's closure — thread owns it
    let handle = thread::spawn(move || {
        println!("{:?}", data);  // data is now owned by this thread
    });
    // data is no longer accessible here — it was moved

    handle.join().unwrap();
}
```

---

## Arc<Mutex<T>> — Shared Mutable State

`Arc` (atomic reference counting) + `Mutex` is the standard Rust pattern for shared mutable state across threads:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0i32));
    let mut handles = vec![];

    for i in 0..10 {
        let c = Arc::clone(&counter);  // each thread gets an Arc clone (cheap!)
        let h = thread::spawn(move || {
            let mut count = c.lock().unwrap();  // blocks until lock is acquired
            *count += 1;
            println!("thread {i}: count = {count}");
            // MutexGuard is dropped here → lock is released automatically
        });
        handles.push(h);
    }

    for h in handles { h.join().unwrap(); }

    println!("final: {}", *counter.lock().unwrap());  // 10
}
```

### RwLock — Multiple Readers, One Writer

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let data = Arc::new(RwLock::new(vec![1, 2, 3]));
    let mut handles = vec![];

    // Multiple reader threads — all can read concurrently
    for _ in 0..5 {
        let d = Arc::clone(&data);
        handles.push(thread::spawn(move || {
            let r = d.read().unwrap();  // read lock — blocks if writer holds lock
            println!("read: {:?}", *r);
        }));
    }

    // One writer thread — exclusive access
    {
        let d = Arc::clone(&data);
        handles.push(thread::spawn(move || {
            let mut w = d.write().unwrap();  // blocks until all reads are done
            w.push(4);
        }));
    }

    for h in handles { h.join().unwrap(); }
}
```

---

## Send and Sync — The Thread Safety Guarantees

These are auto-implemented marker traits (no methods):

- **`Send`**: Safe to transfer ownership to another thread. Almost all types implement `Send`. Exceptions: `Rc<T>`, raw pointers, `MutexGuard` (can't move a lock guard).
- **`Sync`**: Safe to share a reference (`&T`) between threads. `T: Sync` means `&T: Send`. Types like `Cell<T>` and `RefCell<T>` are NOT `Sync` (they allow interior mutability without locking).

```rust
// These compile — Vec<i32> is Send + Sync
fn needs_send<T: Send>(val: T) {}
fn needs_sync<T: Sync>(val: T) {}

needs_send(vec![1, 2, 3]);
needs_sync(42i32);

// Rc<T> is neither Send nor Sync — can't cross thread boundaries
// Rc<i32>: not Send (the reference count is non-atomic)
// thread::spawn(move || { drop(rc_val) }); // COMPILE ERROR

// Arc<T>: Send + Sync (atomic ref count)
// Arc<Mutex<T>>: Send + Sync (locking ensures safe mutation)
```

---

## Channels — Message Passing

Rust channels implement the "do not communicate by sharing memory; share memory by communicating" philosophy:

```rust
use std::sync::mpsc;  // multi-producer, single-consumer
use std::thread;

fn main() {
    // Create a channel — tx sends, rx receives
    let (tx, rx) = mpsc::channel::<String>();

    // Clone transmitter for multiple producers
    let tx2 = tx.clone();

    let h1 = thread::spawn(move || {
        tx.send(String::from("message from thread 1")).unwrap();
        tx.send(String::from("another from thread 1")).unwrap();
    });

    let h2 = thread::spawn(move || {
        tx2.send(String::from("message from thread 2")).unwrap();
    });

    // rx.recv() — blocking receive (waits for a message)
    // Returns Err when ALL transmitters are dropped (channel closed)
    for msg in rx {  // rx implements Iterator — loops until channel is closed
        println!("received: {msg}");
    }

    h1.join().unwrap();
    h2.join().unwrap();

    // Non-blocking try_recv
    let (tx3, rx3) = mpsc::channel::<i32>();
    tx3.send(42).unwrap();
    match rx3.try_recv() {
        Ok(val)  => println!("got {val}"),
        Err(e)   => println!("no message yet: {e}"),
    }
}
```

---

## crossbeam — Advanced Concurrency Primitives

```toml
[dependencies]
crossbeam = "0.8"
```

```rust
use crossbeam::channel;
use std::thread;

fn main() {
    // crossbeam channels are more ergonomic than std::sync::mpsc
    // They support both MPSC and MPMC (multi-producer, multi-consumer)

    let (tx, rx) = channel::bounded(10);  // bounded channel — backpressure

    let producer = thread::spawn(move || {
        for i in 0..20 {
            tx.send(i).unwrap();  // blocks when channel is full (backpressure)
        }
    });

    for _ in 0..2 {
        let r = rx.clone();  // multiple consumers — MPMC!
        thread::spawn(move || {
            while let Ok(msg) = r.recv() {
                println!("received: {msg}");
            }
        });
    }

    producer.join().unwrap();
}
```

---

## Rayon — Data Parallelism

```toml
[dependencies]
rayon = "1.10"
```

```rust
use rayon::prelude::*;

fn main() {
    let data: Vec<u64> = (0..1_000_000).collect();

    // Sequential
    let sum_seq: u64 = data.iter().sum();

    // Parallel — simply change .iter() to .par_iter()
    let sum_par: u64 = data.par_iter().sum();

    assert_eq!(sum_seq, sum_par);

    // Parallel map + collect
    let squares: Vec<u64> = data.par_iter().map(|&x| x * x).collect();

    // Parallel sort
    let mut to_sort = data.clone();
    to_sort.par_sort();

    // Parallel filter
    let evens: Vec<u64> = data.par_iter().copied().filter(|x| x % 2 == 0).collect();

    // Custom thread pool
    let pool = rayon::ThreadPoolBuilder::new()
        .num_threads(4)
        .build()
        .unwrap();
    pool.install(|| {
        let result: Vec<u64> = data.par_iter().map(|&x| x * 2).collect();
    });
}
```

---

## Common Pitfalls

- **Deadlock with Mutex** — holding two Mutex locks and acquiring them in different orders in different threads causes deadlock. Always acquire locks in the same order.
- **`lock().unwrap()` on a poisoned Mutex** — if a thread panics while holding a Mutex, the Mutex becomes "poisoned." `lock()` returns `Err` for poisoned mutexes. Handle with `lock().unwrap_or_else(|e| e.into_inner())`.
- **`RwLock` writer starvation** — if readers continuously hold the lock, a writer may wait indefinitely. Use `try_write()` with a timeout or restructure if this is a concern.
- **`Arc::clone` vs `data.clone()`** — both work, but `Arc::clone(&data)` makes the intent clear (cheap reference count increment, not a deep copy). `data.clone()` on an Arc also increments the count (same result) but looks misleading.
- **Rayon requires `Send + Sync` closures** — if your closure captures an `Rc` or `RefCell`, Rayon rejects it. Use `Arc<Mutex<T>>` for shared state in parallel closures.

---

## Review Questions

1. What are the `Send` and `Sync` marker traits? Give an example of a type that is `Send` but not `Sync`, and explain why.
2. Why does `thread::spawn(|| println!("{data:?}"))` fail without `move`? What does adding `move` do, and what happens to `data` after the spawn?
3. Explain the difference between `Mutex<T>` and `RwLock<T>`. When would you prefer `RwLock`?
4. You're parallelizing a `Vec<i32>` computation with `rayon::par_iter()` but the closure captures an `Rc<String>`. Why won't this compile? What should you use instead?

---

#Rust #concurrency #threads #Arc #Mutex #Rayon #Send #Sync
