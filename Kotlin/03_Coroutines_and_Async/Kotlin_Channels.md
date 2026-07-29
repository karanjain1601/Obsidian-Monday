---
title: Kotlin Channels
aliases: [Kotlin Channel, Kotlin produce, Kotlin consumeEach, Kotlin select]
tags: [Kotlin, Channels, Coroutines, CSP, Select, Concurrency]
domain: Kotlin
difficulty: Advanced
created: 2026-07-29
related: []
status: complete
---

# 🟣 Kotlin Channels

> [!abstract] TL;DR
> `Channel<T>` is a coroutine-based, typed communication primitive — a pipe between coroutines for CSP (Communicating Sequential Processes) style concurrency. Unlike `Flow` (cold, one collector), a Channel is **hot**: values are produced independently of consumers and each value is consumed by exactly one receiver. The `produce` builder creates a coroutine that emits to a channel. The `select` expression waits on multiple channels simultaneously, unblocking on the first ready.

---

## Intuition

A `Channel` is a thread-safe queue that suspends: if the buffer is full, the sender suspends; if the buffer is empty, the receiver suspends. This models a **pipeline** where a producer and consumer run concurrently, naturally backpressuring each other. Think of it as Kotlin's equivalent of Go channels. `Flow` is better for data streams with one consumer; `Channel` is better for work queues, fan-out, or producer-consumer pipelines.

---

## How It Works

### Channel Basics

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
    val channel = Channel<Int>()

    // Producer coroutine
    launch {
        for (i in 1..5) {
            channel.send(i)       // suspends if channel is full
            println("Sent $i")
        }
        channel.close()           // signals end of stream; receive loop exits
    }

    // Consumer — receive until closed
    for (value in channel) {      // for-loop on Channel suspends until value available
        println("Received $value")
    }
}
// Sent 1, Received 1, Sent 2, Received 2, ... (interleaved by scheduler)
```

### Channel Types

```kotlin
// Rendezvous (default) — buffer size 0; sender suspends until receiver is ready
val rendezvous = Channel<String>()

// Buffered — sender suspends only when buffer is full
val buffered = Channel<String>(capacity = 10)

// Conflated — only the latest value is kept; old unread values overwritten
// (like MutableStateFlow but for channels)
val conflated = Channel<String>(Channel.CONFLATED)

// Unlimited — never suspends sender (can OOM if consumer is slow)
val unlimited = Channel<String>(Channel.UNLIMITED)
```

### `produce` — Coroutine Builder for Channels

```kotlin
// produce — launches a coroutine and returns a ReceiveChannel
// Automatically closes the channel when the block completes
fun CoroutineScope.generateNumbers(limit: Int): ReceiveChannel<Int> = produce {
    for (i in 1..limit) {
        delay(100)
        send(i)
    }
    // Channel automatically closed here
}

fun main() = runBlocking {
    val numbers = generateNumbers(5)
    numbers.consumeEach { println(it) }   // 1 2 3 4 5
}

// Pipeline pattern: chain of produce coroutines
fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (n in numbers) send(n * n)
}

fun main() = runBlocking {
    val numbers = generateNumbers(5)
    val squares = square(numbers)
    squares.consumeEach { println(it) }   // 1 4 9 16 25
}
```

### Fan-Out and Fan-In

```kotlin
// Fan-out: one producer, multiple consumers (each message goes to exactly one)
fun CoroutineScope.fanOut(producer: ReceiveChannel<Task>): Unit {
    repeat(4) { workerId ->            // 4 worker coroutines
        launch(Dispatchers.Default) {
            for (task in producer) {   // each task consumed by exactly one worker
                processTask(workerId, task)
            }
        }
    }
}

// Fan-in: multiple producers, one consumer
fun CoroutineScope.mergeChannels(
    vararg channels: ReceiveChannel<String>
): ReceiveChannel<String> = produce {
    for (channel in channels) {
        launch { channel.consumeEach { send(it) } }
    }
}
```

### `select` — Wait on Multiple Channels

```kotlin
// select — unblocks on the first ready channel (CSP select / Go select)
suspend fun processInput(
    commands: ReceiveChannel<Command>,
    events: ReceiveChannel<Event>,
    ticker: ReceiveChannel<Unit>
) {
    while (true) {
        select<Unit> {
            commands.onReceive { cmd ->
                handleCommand(cmd)
            }
            events.onReceive { event ->
                handleEvent(event)
            }
            ticker.onReceive {
                performPeriodicWork()
            }
        }
    }
}

// select with send — choose the channel that can receive first
suspend fun loadBalancer(
    serverA: SendChannel<Request>,
    serverB: SendChannel<Request>,
    request: Request
) {
    select<Unit> {
        serverA.onSend(request) { println("Sent to A") }
        serverB.onSend(request) { println("Sent to B") }
        // Whichever server is ready first gets the request
    }
}
```

### Channel vs Flow Comparison

```kotlin
// Flow — better for data streaming to one consumer
fun dataStream(): Flow<Int> = flow {
    (1..100).forEach { emit(it) }
}

// Channel — better for work queues, fan-out, CSP pipelines
fun workQueue(scope: CoroutineScope): Channel<WorkItem> {
    val channel = Channel<WorkItem>(capacity = 50)
    scope.launch {
        repeat(4) { workerId ->
            launch { for (item in channel) process(workerId, item) }
        }
    }
    return channel
}
```

## Channel Type Comparison

| Type | Buffer | Send suspends when | Receive suspends when | Use Case |
|------|--------|-------------------|----------------------|----------|
| Rendezvous | 0 | No receiver ready | No sender ready | Tight sync handoff |
| Buffered(n) | n | Buffer full | Buffer empty | Decouple prod/cons speed |
| Conflated | 1 (keeps latest) | Never | No value available | Latest-value-only (sensor readings) |
| Unlimited | ∞ | Never | No value available | Bursty producers (careful of OOM) |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Not closing a Channel — receiver loop hangs forever | Always call `channel.close()` after all sends, or use `produce { }` which auto-closes |
| 2 | Using `Channel` when `Flow` is sufficient | Default to `Flow` for data streams; use `Channel` only for hot work queues or fan-out |
| 3 | Fan-out with `Flow` — each collector gets a duplicate stream | Use `Channel` or `SharedFlow` when you want each element to go to exactly one consumer |
| 4 | Unlimited channel with a slow consumer — unbounded memory | Use `Buffered` with a reasonable capacity; add backpressure logic |
| 5 | `select` in a tight loop without `delay`/suspension — busy-spin | Ensure each `select` clause is backed by a suspending operation |

## Review Questions

1. How does a `Channel` differ from a `Flow` in terms of "temperature" (hot vs cold) and consumer semantics?
2. What does `Channel.CONFLATED` do? Give a real-world use case where this is the right choice.
3. What is the purpose of the `select` expression? How does it differ from an `if-else` chain on channels?

---

Related: [[Kotlin_Flow]] | [[Coroutine_Builders_and_Scope]] | [[Structured_Concurrency]] | [[Kotlin_Coroutines_Intro]]

#Kotlin
