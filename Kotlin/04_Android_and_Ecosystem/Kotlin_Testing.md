---
title: Kotlin Testing
aliases: [Kotlin JUnit5, MockK, Kotest, runTest, turbine Flow testing]
tags: [Kotlin, Testing, MockK, Kotest, JUnit5, Coroutines, Flow]
domain: Kotlin
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# 🟣 Kotlin Testing

> [!abstract] TL;DR
> Kotlin testing combines JUnit 5 (familiar Java test runner) with Kotlin-native tools: **MockK** for mocking (with `coEvery`/`coVerify` for `suspend` functions), **Kotest** for expressive assertions and property-based testing, **`runTest`** for coroutine tests (fast-forward virtual time), and **Turbine** for Flow assertions. Together they make async, coroutine-heavy code as testable as synchronous code.

---

## Intuition

Java's Mockito doesn't understand `suspend` functions — it blocks the thread and deadlocks. MockK was purpose-built for Kotlin: it handles `suspend` functions, extension functions, object declarations, and coroutines natively. `runTest` replaces `runBlocking` in tests and uses a virtual clock — `delay(10_000)` completes instantly, making time-dependent tests fast without `Thread.sleep`.

---

## How It Works

### JUnit 5 with Kotlin

```kotlin
// build.gradle.kts
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("io.mockk:mockk:1.13.10")
    testImplementation("io.kotest:kotest-assertions-core:5.8.0")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
    testImplementation("app.cash.turbine:turbine:1.1.0")
}

// Basic JUnit 5 Kotlin test
class UserServiceTest {
    private lateinit var service: UserService
    private lateinit var repository: UserRepository

    @BeforeEach
    fun setUp() {
        repository = mockk()
        service    = UserService(repository)
    }

    @AfterEach
    fun tearDown() { clearAllMocks() }

    @Test
    fun `getUser returns user when found`() {
        // given
        val expected = User(1L, "Alice", "alice@example.com")
        every { repository.findById(1L) } returns expected

        // when
        val actual = service.getUser(1L)

        // then
        assertEquals(expected, actual)
        verify(exactly = 1) { repository.findById(1L) }
    }

    @Test
    fun `getUser throws when not found`() {
        every { repository.findById(999L) } returns null
        assertThrows<UserNotFoundException> { service.getUser(999L) }
    }
}
```

### MockK — Kotlin-Native Mocking

```kotlin
// Mocking classes, objects, and coroutines
class OrderServiceTest {
    private val paymentGateway = mockk<PaymentGateway>()
    private val orderRepo      = mockk<OrderRepository>()
    private val service        = OrderService(paymentGateway, orderRepo)

    @Test
    fun `processOrder calls gateway and saves`() = runTest {
        val order = Order(1L, 100.0, "USD")

        // Stub suspend functions with coEvery
        coEvery { paymentGateway.charge(order) } returns PaymentResult.Success("txn-123")
        coEvery { orderRepo.save(any()) } returns order.copy(status = "PAID")

        val result = service.processOrder(order)

        // Verify suspend function was called
        coVerify(exactly = 1) { paymentGateway.charge(order) }
        coVerify(exactly = 1) { orderRepo.save(match { it.status == "PAID" }) }
        assertTrue(result.isPaid)
    }

    @Test
    fun `processOrder handles payment failure`() = runTest {
        coEvery { paymentGateway.charge(any()) } throws IOException("Connection refused")

        assertThrows<PaymentException> { service.processOrder(Order(2L, 50.0, "USD")) }

        coVerify(exactly = 0) { orderRepo.save(any()) }  // should NOT save on failure
    }
}

// Mocking objects and companion objects
@Test
fun `log calls static logger`() {
    mockkObject(Logger)
    every { Logger.log(any()) } just Runs

    service.doSomething()

    verify { Logger.log("Action performed") }
    unmockkObject(Logger)
}

// relaxed mocks — returns default values without explicit stubs
val gateway = mockk<PaymentGateway>(relaxed = true)
// gateway.charge(anything) returns a default PaymentResult — no stub needed
```

### `runTest` — Coroutine Testing with Virtual Time

```kotlin
// runTest — like runBlocking but with TestCoroutineScheduler
// delay() is skipped (virtual time) — tests run fast even with long delays

class TimerTest {
    @Test
    fun `retry waits between attempts`() = runTest {
        var attempts = 0
        val service = object : RetryableService {
            override suspend fun call(): String {
                attempts++
                if (attempts < 3) {
                    throw IOException("Not ready")
                }
                return "Success"
            }
        }

        val result = retryWithBackoff(service, maxRetries = 3, delayMs = 5_000)
        // In a real test, this would take 10 seconds of real time
        // runTest fast-forwards virtual time — completes instantly

        assertEquals("Success", result)
        assertEquals(3, attempts)
    }

    @Test
    fun `background poller calls every 30 seconds`() = runTest {
        val recorder = mutableListOf<Long>()
        val poller = startPoller { recorder.add(currentTime) }

        advanceTimeBy(90_000)   // fast-forward 90 virtual seconds
        assertEquals(3, recorder.size)   // should have polled 3 times

        poller.cancel()
    }
}
```

### Kotest — Kotlin-Native Assertion Library

```kotlin
import io.kotest.matchers.shouldBe
import io.kotest.matchers.collections.shouldContainAll
import io.kotest.matchers.string.shouldStartWith
import io.kotest.matchers.types.shouldBeInstanceOf

@Test
fun `kotest assertions are more readable`() {
    val user = User(1L, "Alice", "alice@example.com")

    user.name shouldBe "Alice"
    user.email shouldStartWith "alice"
    user.id shouldBe 1L

    val users = listOf(User(1L, "Alice", "a@e.com"), User(2L, "Bob", "b@e.com"))
    users.map { it.name } shouldContainAll listOf("Alice", "Bob")
    users.size shouldBe 2

    val result: Any = Success("data")
    result shouldBeInstanceOf Success::class

    // Soft assertions — collect all failures before throwing
    assertSoftly(user) {
        name shouldBe "Alice"
        email shouldBe "alice@example.com"
        isAdult shouldBe true
    }
}
```

### Turbine — Flow Testing

```kotlin
import app.cash.turbine.test

class SearchViewModelTest {
    @Test
    fun `search emits loading then results`() = runTest {
        val mockRepo = mockk<SearchRepository>()
        coEvery { mockRepo.search("kotlin") } returns listOf(
            Result("Kotlin docs"), Result("Kotlin tutorial")
        )

        val viewModel = SearchViewModel(mockRepo)

        viewModel.results.test {
            // Initial state
            awaitItem() shouldBe SearchState.Idle

            viewModel.search("kotlin")

            // Loading state
            awaitItem() shouldBe SearchState.Loading

            // Results state
            val results = awaitItem()
            results shouldBeInstanceOf SearchState.Success::class
            (results as SearchState.Success).items.size shouldBe 2

            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `StateFlow emits updates`() = runTest {
        val viewModel = CounterViewModel()

        viewModel.count.test {
            awaitItem() shouldBe 0
            viewModel.increment()
            awaitItem() shouldBe 1
            viewModel.increment()
            awaitItem() shouldBe 2
            cancelAndConsumeRemainingEvents()
        }
    }
}
```

## Testing Library Comparison

| Library | Purpose | Key APIs |
|---------|---------|---------|
| JUnit 5 | Test runner | `@Test`, `@BeforeEach`, `assertThrows` |
| MockK | Mocking (Kotlin-native) | `mockk()`, `every`, `coEvery`, `verify`, `coVerify` |
| Kotest Assertions | Expressive assertions | `shouldBe`, `shouldThrow`, `assertSoftly` |
| `kotlinx-coroutines-test` | Coroutine + time testing | `runTest`, `advanceTimeBy`, `TestDispatcher` |
| Turbine | Flow testing | `.test {}`, `awaitItem()`, `awaitError()` |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Using `runBlocking` in tests with `delay` — tests are slow | Use `runTest` which uses virtual time — `delay` is instant |
| 2 | Mockito doesn't work with Kotlin `suspend` functions | Use MockK's `coEvery`/`coVerify` for suspend function stubs/verifications |
| 3 | Testing `Flow` with `collect` — hangs because Flow doesn't complete | Use Turbine's `.test { }` which handles cancellation properly |
| 4 | MockK strict mode — every call needs a stub | Use `mockk(relaxed = true)` for mocks where you only care about a few calls |
| 5 | Not calling `clearAllMocks()` in `@AfterEach` — test pollution | Always clear mocks between tests to prevent state leakage |

## Review Questions

1. Why should you use `runTest` instead of `runBlocking` in unit tests? What is "virtual time"?
2. What is the difference between `every` and `coEvery` in MockK? When must you use `coEvery`?
3. Why does testing `Flow` with a plain `collect {}` cause test hangs? How does Turbine solve this?

---

Related: [[Kotlin_Coroutines_Intro]] | [[Kotlin_Flow]] | [[Kotlin_Android_Basics]] | [[JUnit5_and_Assertions]] | [[Mockito]]

#Kotlin
