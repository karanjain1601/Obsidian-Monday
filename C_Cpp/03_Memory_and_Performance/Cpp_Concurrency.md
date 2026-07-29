---
title: C++ Concurrency
aliases: [C++ Threads, C++ mutex, std::atomic, C++ async, C++ memory model]
tags: [C, Cpp, concurrency, threads, mutex, atomic, async, memory-model]
domain: C_Cpp
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Cpp_Overview]]"
  - "[[Cpp_Exception_Handling]]"
  - "[[Memory_Management_Cpp]]"
status: complete
---

# C++ Concurrency

> [!abstract] TL;DR
> C++11 introduced a platform-portable threading model: `std::thread` for creating OS threads, `std::mutex`/`std::lock_guard` for mutual exclusion, `std::atomic<T>` for lock-free synchronization on primitive types, and `std::async`/`std::future` for task-based concurrency. C++20 adds `std::jthread` (auto-joining, cancellable threads) and the memory model formalizes how atomic operations order memory visibility across cores.

---

## `std::thread`

```cpp
#include <thread>
#include <iostream>
#include <vector>

void worker(int id, int iterations) {
    for (int i = 0; i < iterations; i++) {
        std::cout << "Thread " << id << " iteration " << i << "\n";
    }
}

int main() {
    // Spawn a thread — thread starts immediately
    std::thread t1(worker, 1, 5);     // passes arguments by copy
    std::thread t2(worker, 2, 3);

    // Must either join() or detach() before thread object is destroyed
    // join(): main thread BLOCKS until t1 finishes
    t1.join();
    // detach(): thread runs independently; main thread does not wait
    // t2.detach();  // DANGEROUS: if main exits first, program terminates
    t2.join();

    // Lambda thread
    int result = 0;
    std::thread t3([&result]() { result = 42; });  // capture by reference
    t3.join();
    std::cout << "result=" << result << "\n";       // 42

    // Thread ID
    std::cout << "main thread id: " << std::this_thread::get_id() << "\n";

    return 0;
}
```

---

## Mutex and Lock Guards

```cpp
#include <thread>
#include <mutex>
#include <shared_mutex>
#include <vector>
#include <iostream>

std::mutex g_mutex;
int g_counter = 0;

void increment_safe(int n) {
    for (int i = 0; i < n; i++) {
        std::lock_guard<std::mutex> lock(g_mutex);  // RAII: locked in ctor, unlocked in dtor
        ++g_counter;                                // only one thread at a time
    }   // lock released here
}

// unique_lock — more flexible than lock_guard (can unlock/relock manually)
void increment_with_cv(int n) {
    std::unique_lock<std::mutex> lock(g_mutex);       // locks immediately
    // lock.unlock();  // can temporarily release
    // lock.lock();    // and reacquire
    g_counter += n;
}

// Deadlock prevention: always lock in the same order, or use std::scoped_lock
std::mutex m1, m2;
void safe_lock() {
    std::scoped_lock lock(m1, m2);  // C++17: locks both atomically, preventing deadlock
    // ... use both resources ...
}

// Reader-Writer lock: multiple readers OR one exclusive writer
std::shared_mutex rw_mutex;
int shared_data = 0;

void reader() {
    std::shared_lock lock(rw_mutex);    // multiple readers can hold simultaneously
    std::cout << shared_data << "\n";
}
void writer(int val) {
    std::unique_lock lock(rw_mutex);    // exclusive: blocks all readers AND writers
    shared_data = val;
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; i++)
        threads.emplace_back(increment_safe, 1000);
    for (auto& t : threads) t.join();
    std::cout << "counter=" << g_counter << "\n";   // always 4000 — safe
    return 0;
}
```

---

## `std::condition_variable` — Producer-Consumer

```cpp
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

std::queue<int>         g_queue;
std::mutex              g_cv_mutex;
std::condition_variable g_cv;
bool                    g_done = false;

void producer(int n) {
    for (int i = 0; i < n; i++) {
        {
            std::lock_guard<std::mutex> lock(g_cv_mutex);
            g_queue.push(i);
        }
        g_cv.notify_one();   // wake one waiting consumer
    }
    {
        std::lock_guard<std::mutex> lock(g_cv_mutex);
        g_done = true;
    }
    g_cv.notify_all();       // wake all — signal completion
}

void consumer(int id) {
    while (true) {
        std::unique_lock<std::mutex> lock(g_cv_mutex);
        // wait: atomically releases mutex and sleeps until predicate is true
        // Predicate prevents spurious wakeups
        g_cv.wait(lock, [] { return !g_queue.empty() || g_done; });
        if (g_queue.empty() && g_done) break;
        int val = g_queue.front(); g_queue.pop();
        lock.unlock();
        std::cout << "Consumer " << id << " got " << val << "\n";
    }
}
```

---

## `std::atomic<T>` and Memory Order

```cpp
#include <atomic>
#include <thread>

// Lock-free counter — no mutex needed for simple increment
std::atomic<int> counter{0};

void increment_atomic(int n) {
    for (int i = 0; i < n; i++) {
        counter.fetch_add(1, std::memory_order_relaxed);   // no ordering guarantees
        // counter++;  // equivalent to fetch_add with memory_order_seq_cst (slow)
    }
}

// Memory order summary:
// memory_order_relaxed  — no ordering constraints — fastest, only atomicity guaranteed
// memory_order_acquire  — this load "acquires": operations below cannot move above
// memory_order_release  — this store "releases": operations above cannot move below
// memory_order_acq_rel  — both acquire and release (for RMW operations)
// memory_order_seq_cst  — total sequential consistency — safest, most expensive (default)

std::atomic<bool> ready{false};
int data = 0;

void producer_mo() {
    data = 42;
    ready.store(true, std::memory_order_release);   // release: data write is visible before ready=true
}

void consumer_mo() {
    while (!ready.load(std::memory_order_acquire))  // acquire: data read happens after ready=true
        ;   // spin
    std::cout << data << "\n";   // guaranteed to see 42
}

// Atomic flag — always lock-free (unlike atomic<bool> which may not be)
std::atomic_flag spinlock = ATOMIC_FLAG_INIT;
void spin_lock()   { while (spinlock.test_and_set(std::memory_order_acquire)) ; }
void spin_unlock() { spinlock.clear(std::memory_order_release); }
```

---

## `std::async` / `std::future` / `std::promise`

```cpp
#include <future>
#include <iostream>

int compute(int n) {
    return n * n;   // expensive computation
}

int main() {
    // std::async: runs function asynchronously, returns future
    // std::launch::async: forced to run in a new thread
    // std::launch::deferred: runs lazily when .get() is called (no thread)
    std::future<int> f = std::async(std::launch::async, compute, 10);

    // Do other work while compute runs in background...
    std::cout << "Working...\n";

    int result = f.get();   // blocks until result is ready
    std::cout << "result=" << result << "\n";   // 100

    // std::promise — manually set a future's value from another thread
    std::promise<int> promise;
    std::future<int> fut = promise.get_future();

    std::thread setter([&promise]() {
        promise.set_value(99);              // wakes any thread waiting on fut.get()
        // promise.set_exception(std::make_exception_ptr(std::runtime_error("fail")));
    });
    std::cout << fut.get() << "\n";         // 99
    setter.join();

    return 0;
}
```

---

## `std::jthread` (C++20)

```cpp
#include <thread>
#include <stop_token>

// jthread: automatically joins in destructor (no more "joinable" exceptions)
// Also supports cooperative cancellation via stop_token
std::jthread t([](std::stop_token stoken) {
    while (!stoken.stop_requested()) {
        // do work...
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
});

// Request cancellation from outside
t.request_stop();
// t goes out of scope → automatically joins
```

---

## Common Pitfalls

- **Forgetting to join or detach:** A `std::thread` object destroyed while still joinable calls `std::terminate()`. Always join or detach in a destructor, or use `std::jthread`.
- **Data races are UB:** Two threads accessing the same non-atomic variable where at least one writes is a data race — undefined behavior. The compiler may generate code that appears to work in debug but fails in release builds due to reordering.
- **Spurious wakeups:** `condition_variable::wait` can wake up without `notify` being called. Always pass a predicate lambda to `wait()`.
- **`counter++` is NOT atomic:** `++counter` on a plain `int` is a read-modify-write sequence that is not atomic. Use `std::atomic<int>` or protect with a mutex.

---

## Review Questions

1. What is a data race? Why is it undefined behavior rather than just "occasionally wrong"?
2. Explain `memory_order_acquire`/`memory_order_release`. Give the producer-consumer example and describe what memory visibility guarantees they provide.
3. Why does `condition_variable::wait` need a predicate (the second argument)? What problem does "spurious wakeup" cause without a predicate?
4. What is the difference between `std::async(std::launch::async, f)` and `std::async(std::launch::deferred, f)`? When does the function execute in each case?

---

#C #Cpp
