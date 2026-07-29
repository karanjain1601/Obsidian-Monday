---
title: Rust Collections
aliases: [Rust Vec, Rust HashMap, Rust String, Rust Iterators, Rust Collections]
tags: [Rust, collections, Vec, HashMap, String, iterators]
domain: Rust
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Rust_Types_and_Variables]]"
  - "[[Ownership_and_Borrowing]]"
  - "[[Iterators_and_Functional_Patterns]]"
  - "[[Traits_and_Generics]]"
status: complete
---

# Rust Collections

> [!abstract] TL;DR
> Rust's standard collections live on the heap and grow dynamically. `Vec<T>` is the workhorse (contiguous, cache-friendly, O(1) amortized push). `HashMap<K,V>` offers O(1) lookup with an ergonomic entry API for insert-or-update. `String` vs `&str` is a common source of confusion — `String` owns heap memory, `&str` borrows it. Iterators are lazy and compose into zero-overhead chains.

---

## Intuition

Rust collections own their data — they allocate heap memory and drop it (freeing memory) when they go out of scope. The borrow checker applies here too: you cannot mutate a `Vec` while holding a reference to one of its elements, because mutation might reallocate the underlying buffer, invalidating the reference.

---

## Vec<T> — Dynamic Array

```rust
fn main() {
    // Creating a Vec
    let mut v: Vec<i32> = Vec::new();
    let v2 = vec![1, 2, 3];  // macro shorthand — type inferred

    // Pushing and popping
    v.push(1);
    v.push(2);
    v.push(3);
    let last = v.pop();  // returns Option<T> — Some(3)

    // Accessing elements
    let third = v[2];          // panics if out of bounds
    let safe = v.get(2);       // returns Option<&T> — safe
    let safe = v.get(100);     // None — no panic

    // Iterating (borrow)
    for item in &v {
        println!("{item}");   // item is &i32
    }

    // Iterating (mutable)
    for item in &mut v {
        *item *= 2;           // dereference to modify
    }

    // Iterating (consuming — v is moved)
    for item in v {
        println!("{item}");   // item is i32 (owned)
    }
    // v is dropped — cannot use it after consuming iteration

    // Useful methods
    let mut data = vec![3, 1, 4, 1, 5, 9, 2, 6];
    data.sort();                            // [1, 1, 2, 3, 4, 5, 6, 9]
    data.sort_by(|a, b| b.cmp(a));         // descending
    data.dedup();                           // remove consecutive duplicates
    data.retain(|&x| x > 3);               // keep only elements > 3
    let idx = data.binary_search(&5);      // Ok(index) or Err(insertion point)

    println!("{}", data.len());
    println!("{}", data.is_empty());
    data.truncate(3);                       // keep first 3 elements
    data.clear();

    // Slices from Vec
    let v = vec![1, 2, 3, 4, 5];
    let slice = &v[1..3];  // &[i32] — [2, 3]

    // Collecting into Vec from an iterator
    let doubled: Vec<i32> = v.iter().map(|&x| x * 2).collect();

    // Extending
    let mut a = vec![1, 2, 3];
    let b = vec![4, 5, 6];
    a.extend(b.iter().copied());  // [1, 2, 3, 4, 5, 6]
}
```

---

## HashMap<K, V>

```rust
use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();

    // Insert
    scores.insert(String::from("Alice"), 100);
    scores.insert(String::from("Bob"), 85);

    // Note: String keys are MOVED into the map (HashMap owns them)
    let name = String::from("Charlie");
    scores.insert(name, 90);
    // println!("{name}");  // ERROR: name was moved into the map

    // Lookup
    let score = scores.get("Alice");        // Option<&i32>
    let score = scores.get("Unknown");      // None

    // .get() returns &V, not V — borrows from the map
    if let Some(s) = scores.get("Bob") {
        println!("Bob's score: {s}");
    }

    // Iteration (order is arbitrary — HashMap is not sorted)
    for (name, score) in &scores {
        println!("{name}: {score}");
    }

    // Checking existence
    println!("{}", scores.contains_key("Alice")); // true

    // Remove
    let removed = scores.remove("Bob");   // Option<i32> — returns the value

    // --- The Entry API (most idiomatic pattern) ---

    // Insert if key doesn't exist (or_insert)
    scores.entry(String::from("Dave")).or_insert(50);
    scores.entry(String::from("Alice")).or_insert(0);  // Alice already exists — no change
    println!("{:?}", scores.get("Alice"));  // Some(100) — unchanged

    // Insert if absent, then get mutable reference to value
    let count = scores.entry(String::from("Eve")).or_insert(0);
    *count += 5;  // now Eve has 5

    // or_insert_with — compute default lazily (avoid allocation on every call)
    scores.entry(String::from("Frank")).or_insert_with(|| expensive_compute());

    // Count word frequencies — canonical entry API pattern
    let text = "hello world hello rust world hello";
    let mut word_count: HashMap<&str, u32> = HashMap::new();
    for word in text.split_whitespace() {
        let count = word_count.entry(word).or_insert(0);
        *count += 1;
    }
    // {"hello": 3, "world": 2, "rust": 1}
    println!("{:?}", word_count);
}

fn expensive_compute() -> i32 { 42 }
```

### Other Map/Set Types

| Type | Ordered | Use case |
|------|---------|----------|
| `HashMap<K,V>` | No | General-purpose, O(1) average |
| `BTreeMap<K,V>` | Yes (by key) | When you need sorted order or range queries |
| `HashSet<T>` | No | Membership testing, deduplication |
| `BTreeSet<T>` | Yes | Sorted set, range queries |

---

## String vs &str — Why Two Types?

This is one of Rust's most common beginner confusions:

```rust
fn main() {
    // &str — string slice, borrowed, points to data stored elsewhere
    // Stored in binary (for literals) or as a view into a String
    let literal: &str = "hello";     // points to binary data section
    let greeting = "world";          // type inferred as &str

    // String — owned, heap-allocated, growable
    let mut owned: String = String::from("hello");
    owned.push(' ');
    owned.push_str("world");
    owned.push('!');

    // String → &str: borrow (Deref coercion, free operation)
    let s: &str = &owned;           // borrow the String as a &str
    let s2: &str = owned.as_str();  // explicit

    // &str → String: clone (allocates new heap memory)
    let owned2: String = literal.to_string();
    let owned3: String = String::from(literal);

    // Function parameter: prefer &str over &String
    // &String is automatically coerced to &str (Deref coercion)
    fn takes_str(s: &str) { println!("{s}"); }
    takes_str(literal);  // &str directly
    takes_str(&owned);   // &String coerces to &str

    // String methods
    let s = String::from("  hello world  ");
    println!("{}", s.trim());                    // "hello world"
    println!("{}", s.to_uppercase());
    println!("{}", s.contains("world"));         // true
    println!("{}", s.replace("world", "Rust"));
    let parts: Vec<&str> = s.split_whitespace().collect();

    // Concatenation
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2;  // s1 is MOVED, s2 is borrowed
    // s1 is no longer valid; s3 owns the concatenated string

    // Use format! for complex concatenation (no moves)
    let s4 = format!("{s2} and {s3}");  // s2 and s3 both borrowed
}
```

---

## VecDeque — Double-Ended Queue

```rust
use std::collections::VecDeque;

fn main() {
    let mut deque: VecDeque<i32> = VecDeque::new();
    deque.push_back(1);
    deque.push_back(2);
    deque.push_front(0);  // [0, 1, 2]

    let front = deque.pop_front();  // Some(0)
    let back  = deque.pop_back();   // Some(2)
    // Use as a queue (FIFO): push_back + pop_front
    // Use as a stack (LIFO): push_back + pop_back
}
```

---

## Iterator Basics

Iterators are lazy — they don't compute anything until consumed. They chain with zero overhead (the compiler fuses chains into a single loop via inlining):

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Lazy adaptors — no computation yet
    let chain = v.iter()
        .filter(|&&x| x % 2 == 0)  // even numbers
        .map(|&x| x * x);           // square them

    // Consume the iterator — computation happens HERE
    let result: Vec<i32> = chain.collect();
    println!("{:?}", result);  // [4, 16, 36, 64, 100]

    // fold — reduce to a single value
    let sum: i32 = v.iter().fold(0, |acc, &x| acc + x);

    // sum() / product() — specialized folds
    let total: i32 = v.iter().sum();
    let product: i32 = v.iter().product();

    // enumerate — add index
    for (i, &val) in v.iter().enumerate() {
        println!("{i}: {val}");
    }

    // zip — pair two iterators
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![100, 85, 90];
    let pairs: Vec<(&&str, &i32)> = names.iter().zip(scores.iter()).collect();

    // chain — concatenate two iterators
    let a = vec![1, 2];
    let b = vec![3, 4];
    let all: Vec<&i32> = a.iter().chain(b.iter()).collect();

    // flat_map — map then flatten
    let words = vec!["hello world", "foo bar"];
    let letters: Vec<&str> = words.iter().flat_map(|s| s.split(' ')).collect();

    // take / skip
    let first3: Vec<&i32> = v.iter().take(3).collect();
    let after3: Vec<&i32> = v.iter().skip(3).collect();

    // any / all — short-circuit boolean checks
    let has_negative = v.iter().any(|&x| x < 0);   // false
    let all_positive = v.iter().all(|&x| x > 0);   // true

    // find / position
    let first_even = v.iter().find(|&&x| x % 2 == 0);   // Some(&2)
    let even_idx   = v.iter().position(|&x| x % 2 == 0); // Some(1)

    // count
    let evens_count = v.iter().filter(|&&x| x % 2 == 0).count();  // 5
}
```

---

## Common Pitfalls

- **Borrow during mutation** — holding a `&v[i]` reference while calling `v.push()` fails to compile. Push may reallocate the buffer, invalidating the reference. Rust prevents this statically.
- **`String + &str` moves the String** — `s1 + &s2` takes ownership of `s1`. Use `format!("{s1}{s2}")` to avoid moves in complex concatenations.
- **HashMap key ownership** — inserting a `String` key moves it into the map. Copy types (integers, `&str`) are copied. Use `.entry(key.clone())` if you need the key after insertion.
- **Iterator `.collect()` needs a type hint** — `v.iter().map(|x| x * 2).collect()` fails if the compiler can't infer the output collection type. Use `collect::<Vec<_>>()` or annotate the binding.
- **`iter()` vs `into_iter()` vs `iter_mut()`** — `iter()` gives `&T`, `iter_mut()` gives `&mut T`, `into_iter()` on a `Vec` gives `T` (consumes the Vec). On a `&Vec`, `into_iter()` gives `&T`.

---

## Review Questions

1. Why does Rust prevent you from calling `v.push(4)` while holding `let first = &v[0]`? What would happen in C++ in the equivalent scenario?
2. What does the `Entry` API do? Write the idiomatic way to increment a counter in a `HashMap<String, u32>`, creating the entry with value 0 if it doesn't exist.
3. Explain the difference between `String` and `&str`. When should a function parameter be `String` vs `&str`? When should a struct field be `String` vs `&str`?
4. What does "lazy" mean for iterators? Trace through `v.iter().filter(...).map(...).collect()` and describe when the actual computation happens.

---

#Rust #collections #Vec #HashMap #String #iterators
