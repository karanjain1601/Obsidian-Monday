---
title: Rust Testing
aliases: [Rust unit tests, Rust integration tests, Rust doc tests, mockall, proptest]
tags: [Rust, testing, unit-tests, integration-tests, mockall, proptest, doc-tests]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Cargo_and_Toolchain]]"
  - "[[Rust_Error_Handling]]"
  - "[[Rust_Modules_and_Crates]]"
  - "[[Rust_Web_with_Axum]]"
status: complete
---

# Rust Testing

> [!abstract] TL;DR
> Rust has first-class testing built into the language and Cargo. Unit tests live in the same file as the code (in a `#[cfg(test)]` module), integration tests live in `tests/`, and doc tests live in documentation comments. `assert!`, `assert_eq!`, `assert_ne!`, and `#[should_panic]` cover basic assertions. `mockall` generates trait mocks; `proptest` generates random inputs for property-based testing.

---

## Intuition

Rust's testing approach has three tiers:
1. **Unit tests** — in the same file as the code, can access private functions, test implementation details
2. **Integration tests** — in a separate `tests/` directory, test only the public API as a library user would
3. **Doc tests** — code examples in doc comments that are compiled and run as tests, ensuring docs stay accurate

The `#[cfg(test)]` attribute means test code is compiled only when running `cargo test` — zero overhead in production.

---

## Unit Tests

```rust
// src/lib.rs or any source file

pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn internal_helper(x: i32) -> i32 {
    x * 2
}

pub fn process(n: i32) -> i32 {
    internal_helper(n) + 1
}

// Test module — compiled only when running `cargo test`
#[cfg(test)]
mod tests {
    // Import everything from the parent module — gives access to private functions!
    use super::*;

    // Basic test
    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
        assert_eq!(add(-1, 1), 0);
        assert_eq!(add(0, 0), 0);
    }

    // Testing private functions — allowed because test module is in the same crate
    #[test]
    fn test_internal_helper() {
        assert_eq!(internal_helper(5), 10);
    }

    // assert! — tests a boolean condition
    #[test]
    fn test_assert() {
        let v = vec![1, 2, 3];
        assert!(!v.is_empty());
        assert!(v.len() == 3, "expected 3 elements, got {}", v.len());
    }

    // assert_eq! — tests equality with a useful failure message showing both values
    #[test]
    fn test_assert_eq() {
        assert_eq!(2 + 2, 4);
        assert_eq!(
            add(1, 2),
            3,
            "1 + 2 should equal 3"  // custom failure message
        );
    }

    // assert_ne! — tests inequality
    #[test]
    fn test_assert_ne() {
        assert_ne!(add(1, 2), 10);
    }

    // #[should_panic] — test expects a panic
    #[test]
    #[should_panic]
    fn test_panics() {
        let v: Vec<i32> = vec![];
        let _ = v[0];  // panics: index out of bounds
    }

    // #[should_panic(expected = "message")] — check the panic message
    #[test]
    #[should_panic(expected = "divide by zero")]
    fn test_panic_message() {
        panic!("divide by zero");
    }

    // Return Result from tests — use ? instead of unwrap
    #[test]
    fn test_with_result() -> Result<(), String> {
        let n: i32 = "42".parse().map_err(|e: std::num::ParseIntError| e.to_string())?;
        assert_eq!(n, 42);
        Ok(())
    }

    // #[ignore] — skip expensive tests by default; run with --ignored
    #[test]
    #[ignore = "slow integration test — run manually"]
    fn expensive_test() {
        std::thread::sleep(std::time::Duration::from_secs(10));
    }
}
```

---

## Integration Tests

Integration tests live in `tests/` and can only call the public API:

```
src/
├── lib.rs
└── ...
tests/
├── integration_test.rs    ← each file is a separate test binary
└── common/
    └── mod.rs             ← shared test helpers
```

```rust
// tests/integration_test.rs
use my_crate;  // import the crate being tested (only public API available)

mod common;    // import shared helpers from tests/common/mod.rs

#[test]
fn test_public_api() {
    let result = my_crate::process(21);
    assert_eq!(result, 43);
}

#[test]
fn test_with_shared_setup() {
    let ctx = common::setup();
    let result = my_crate::run(&ctx);
    assert!(result.is_ok());
    common::teardown(ctx);
}
```

```rust
// tests/common/mod.rs
pub struct TestContext { /* ... */ }

pub fn setup() -> TestContext {
    TestContext { /* ... */ }
}

pub fn teardown(_ctx: TestContext) { /* cleanup */ }
```

---

## Doc Tests

Code in documentation comments is compiled and run as tests — documentation examples always stay accurate:

```rust
/// Adds two numbers.
///
/// # Examples
///
/// ```
/// let result = my_crate::add(2, 3);
/// assert_eq!(result, 5);
/// ```
///
/// Handles negative numbers:
/// ```
/// assert_eq!(my_crate::add(-1, -1), -2);
/// ```
///
/// This example is marked as should panic:
/// ```should_panic
/// my_crate::divide(1, 0);  // panics with "divide by zero"
/// ```
///
/// This example is not compiled (illustration only):
/// ```ignore
/// // This code won't compile but shows the concept
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

---

## Async Tests with Tokio

```rust
#[cfg(test)]
mod tests {
    // Async test — requires tokio
    #[tokio::test]
    async fn test_async_function() {
        let result = my_async_function().await;
        assert_eq!(result, "expected");
    }

    // Async test with timeout
    #[tokio::test]
    #[timeout(5000)]  // 5 second timeout (requires tokio-test)
    async fn test_with_timeout() {
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;
        assert!(true);
    }

    async fn my_async_function() -> &'static str {
        tokio::time::sleep(std::time::Duration::from_millis(10)).await;
        "expected"
    }
}
```

---

## Mocking with mockall

`mockall` generates mock implementations of traits, enabling unit testing of code with external dependencies:

```toml
[dev-dependencies]
mockall = "0.13"
```

```rust
use mockall::{automock, predicate::*};

// Trait to be mocked
#[cfg_attr(test, automock)]  // generates MockDatabase in test builds
trait Database {
    fn get_user(&self, id: u64) -> Option<String>;
    fn save_user(&mut self, id: u64, name: &str) -> bool;
}

// Production code using the trait
fn process_user(db: &impl Database, id: u64) -> String {
    match db.get_user(id) {
        Some(name) => format!("Hello, {name}!"),
        None       => String::from("User not found"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::predicate::*;

    #[test]
    fn test_process_user_found() {
        let mut mock = MockDatabase::new();

        // Set up expectation: get_user(1) returns Some("Alice")
        mock.expect_get_user()
            .with(eq(1u64))                     // expect id == 1
            .times(1)                            // called exactly once
            .returning(|_| Some("Alice".to_string()));

        let result = process_user(&mock, 1);
        assert_eq!(result, "Hello, Alice!");
    }

    #[test]
    fn test_process_user_not_found() {
        let mut mock = MockDatabase::new();

        mock.expect_get_user()
            .with(eq(99u64))
            .times(1)
            .returning(|_| None);

        let result = process_user(&mock, 99);
        assert_eq!(result, "User not found");
    }

    #[test]
    fn test_save_user() {
        let mut mock = MockDatabase::new();

        mock.expect_save_user()
            .with(eq(1u64), eq("Bob"))
            .times(1)
            .returning(|_, _| true);

        assert!(mock.save_user(1, "Bob"));
    }
}
```

---

## Property-Based Testing with proptest

Property tests check that your code satisfies invariants for randomly generated inputs:

```toml
[dev-dependencies]
proptest = "1.5"
```

```rust
use proptest::prelude::*;

fn sort_and_dedup(mut v: Vec<i32>) -> Vec<i32> {
    v.sort();
    v.dedup();
    v
}

proptest! {
    // Test that sorted output is actually sorted
    #[test]
    fn test_sort_is_sorted(v in prop::collection::vec(any::<i32>(), 0..100)) {
        let result = sort_and_dedup(v);
        for window in result.windows(2) {
            prop_assert!(window[0] <= window[1], "not sorted: {:?}", result);
        }
    }

    // Test that no duplicates remain
    #[test]
    fn test_no_duplicates(v in prop::collection::vec(-100i32..100, 0..50)) {
        let result = sort_and_dedup(v);
        for window in result.windows(2) {
            prop_assert_ne!(window[0], window[1], "duplicate found in {:?}", result);
        }
    }

    // Test that add is commutative
    #[test]
    fn test_add_commutative(a in -1000i32..1000, b in -1000i32..1000) {
        prop_assert_eq!(a + b, b + a);
    }

    // Custom strategies — generate valid email strings
    #[test]
    fn test_email_parsing(
        local in "[a-z]{3,10}",
        domain in "[a-z]{3,8}"
    ) {
        let email = format!("{local}@{domain}.com");
        // test that your email parser accepts valid emails
        prop_assert!(email.contains('@'));
    }
}
```

---

## Test Organization Best Practices

```rust
// Fixtures and test data
#[cfg(test)]
mod tests {
    use super::*;

    // Helper function for test setup
    fn make_test_user() -> User {
        User { id: 1, username: "testuser".to_string(), email: "test@test.com".to_string() }
    }

    // Group related tests in nested modules
    mod user_tests {
        use super::*;

        #[test]
        fn creates_valid_user() { /* ... */ }

        #[test]
        fn rejects_empty_username() { /* ... */ }
    }

    mod auth_tests {
        use super::*;

        #[test]
        fn valid_token_authenticates() { /* ... */ }
    }
}
```

---

## Common Pitfalls

- **Tests run in parallel by default** — tests in the same binary run concurrently. Tests that modify shared global state (env vars, files) can interfere. Use `--test-threads=1` or isolate state.
- **`println!` doesn't show in passing tests** — use `cargo test -- --nocapture` to see stdout. Or use `dbg!()` which goes to stderr (always visible).
- **Integration tests can only access public API** — this is intentional. If you find yourself wanting to test private details from integration tests, those details might need to become a separate internal module.
- **Doc test imports** — doc tests are run in a separate context. You need to use the full path (`my_crate::add`) or add `use my_crate::add` inside the doc test block.
- **Mockall with generic methods** — `automock` has limitations with generic methods. Use concrete type parameters or refactor to associated types when possible.

---

## Review Questions

1. Why are unit tests placed in a `#[cfg(test)]` module inside the same file as the production code? What access does this give you that integration tests don't have?
2. A doc test in a `//!` module comment fails to compile. You realize the type is not public. What are your options?
3. You're testing a function that calls a database. Without mocking, the test requires a live database. How does `mockall` solve this? What constraint does it impose on how the function is structured?
4. What is a property test? Give an example of a property you could test for a `reverse(v: Vec<T>) -> Vec<T>` function that would catch most bugs but require no specific known inputs.

---

#Rust #testing #unit-tests #integration-tests #mockall #proptest #doc-tests
