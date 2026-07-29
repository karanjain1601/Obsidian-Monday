---
title: Iterators and Functional Patterns
aliases: [Rust Iterator trait, Rust custom iterator, Rust functional, Rust lazy evaluation]
tags: [Rust, iterators, functional-programming, lazy-evaluation, collect]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rust_Collections]]"
  - "[[Rust_Functions_and_Closures]]"
  - "[[Traits_and_Generics]]"
  - "[[Rust_Performance]]"
status: complete
---

# Iterators and Functional Patterns

> [!abstract] TL;DR
> Rust iterators are lazy — nothing happens until consumed. They implement the `Iterator` trait with a single required method `next()`. Adaptors (`map`, `filter`, `flat_map`, `take`, `skip`) chain lazily; terminal operations (`collect`, `sum`, `fold`, `for_each`) consume them. The compiler fuses iterator chains into a single tight loop — zero overhead vs. hand-written `for` loops. `rayon` drops in parallel iteration with `par_iter()`.

---

## Intuition

An iterator is a state machine that produces values on demand. The `Iterator` trait requires only one method: `next() -> Option<Self::Item>`. All the ergonomic methods (`map`, `filter`, `collect`, etc.) are provided as default implementations on top of that single requirement. This means implementing your own iterator is trivial — define `next()` and you get the entire ecosystem for free.

The laziness is a feature: you can chain ten adaptors without allocating intermediate collections. The compiler sees through the chain and generates a single loop over the original data. This is what "zero-cost abstractions" means concretely.

---

## The Iterator Trait

```rust
// Simplified definition from std:
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;

    // All other methods are default implementations built on next():
    // map, filter, fold, collect, enumerate, zip, chain, flat_map, take, skip ...
}
```

---

## Creating Iterators

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // iter()       → yields &T (borrows, v is still usable after)
    // iter_mut()   → yields &mut T (mutable borrows)
    // into_iter()  → yields T (consumes v — v is moved)

    let iter1 = v.iter();        // Iterator<Item = &i32>
    let iter2 = v.iter();        // must re-create — iter() borrows
    let iter3 = v.into_iter();   // consumes v — yields i32 (owned)
    // v is now moved — cannot use v

    // Ranges are iterators
    let range = 0..10;           // Iterator<Item = i32>
    let inclusive = 0..=10;      // 0 through 10 inclusive

    // Other standard iterators
    let chars = "hello".chars(); // Iterator<Item = char>
    let bytes = "hello".bytes(); // Iterator<Item = u8>
    let lines = "a\nb\nc".lines(); // Iterator<Item = &str>
}
```

---

## Lazy Adaptors — Building the Chain

Adaptors return a new iterator that wraps the previous one. No computation happens yet:

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // map — transform each element
    let doubled = v.iter().map(|&x| x * 2);  // NOT computed yet

    // filter — keep elements matching predicate
    let evens = v.iter().filter(|&&x| x % 2 == 0);

    // flat_map — map then flatten (one-to-many transform)
    let expanded: Vec<i32> = vec![1, 2, 3]
        .iter()
        .flat_map(|&x| vec![x, x * 10])
        .collect();
    // [1, 10, 2, 20, 3, 30]

    // flatten — flatten nested iterables
    let nested = vec![vec![1, 2], vec![3, 4], vec![5]];
    let flat: Vec<i32> = nested.into_iter().flatten().collect();
    // [1, 2, 3, 4, 5]

    // take / skip
    let first3: Vec<&i32> = v.iter().take(3).collect();  // [1, 2, 3]
    let after3: Vec<&i32> = v.iter().skip(3).collect();  // [4, 5, 6, 7, 8, 9, 10]

    // take_while / skip_while — stop/skip based on predicate
    let before_5: Vec<&i32> = v.iter().take_while(|&&x| x < 5).collect();  // [1, 2, 3, 4]

    // chain — concatenate two iterators
    let a = vec![1, 2, 3];
    let b = vec![4, 5, 6];
    let all: Vec<i32> = a.iter().chain(b.iter()).copied().collect();

    // zip — pair elements from two iterators
    let keys = vec!["a", "b", "c"];
    let vals = vec![1, 2, 3];
    let pairs: Vec<(&&str, &i32)> = keys.iter().zip(vals.iter()).collect();

    // enumerate — add index
    for (i, val) in v.iter().enumerate() {
        println!("{i}: {val}");
    }

    // peekable — peek at next element without consuming
    let mut iter = v.iter().peekable();
    while let Some(&next) = iter.peek() {
        if next > 5 { break; }
        println!("{}", iter.next().unwrap());
    }

    // step_by — every nth element
    let every_other: Vec<&i32> = v.iter().step_by(2).collect(); // [1, 3, 5, 7, 9]

    // cycle — repeat infinitely (must use take!)
    let cycled: Vec<i32> = vec![1, 2, 3].into_iter().cycle().take(7).collect();
    // [1, 2, 3, 1, 2, 3, 1]
}
```

---

## Terminal Operations — Consuming the Chain

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // collect — materialize into a collection (needs type hint)
    let doubled: Vec<i32> = v.iter().map(|&x| x * 2).collect();
    let as_strings: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    let as_set: std::collections::HashSet<i32> = v.iter().copied().collect();

    // sum / product
    let total: i32 = v.iter().sum();           // 15
    let product: i32 = v.iter().product();     // 120

    // fold — reduce with accumulator
    let sum = v.iter().fold(0, |acc, &x| acc + x);
    // Building a string:
    let joined = v.iter().fold(String::new(), |mut s, &x| {
        if !s.is_empty() { s.push_str(", "); }
        s.push_str(&x.to_string());
        s
    });

    // for_each — consume without collecting (like a for loop)
    v.iter().for_each(|x| println!("{x}"));

    // any / all — short-circuit booleans
    let has_large = v.iter().any(|&x| x > 4);  // true (5 > 4)
    let all_pos   = v.iter().all(|&x| x > 0);  // true

    // find / position
    let first_even = v.iter().find(|&&x| x % 2 == 0);   // Some(&2)
    let pos        = v.iter().position(|&x| x == 3);     // Some(2)

    // count
    let n = v.iter().filter(|&&x| x > 2).count();  // 3

    // max / min
    let max = v.iter().max();  // Some(&5)
    let min = v.iter().min();  // Some(&1)

    // max_by_key / min_by_key
    let words = vec!["hello", "hi", "world"];
    let longest = words.iter().max_by_key(|s| s.len());  // Some(&"world")

    // last / nth
    let last = v.iter().last();  // Some(&5)
    let third = v.iter().nth(2); // Some(&3)

    // unzip — split Vec<(A, B)> into (Vec<A>, Vec<B>)
    let pairs = vec![(1, 'a'), (2, 'b'), (3, 'c')];
    let (nums, chars): (Vec<i32>, Vec<char>) = pairs.into_iter().unzip();

    // partition — split into two Vecs based on predicate
    let (evens, odds): (Vec<i32>, Vec<i32>) = v.iter().partition(|&&x| x % 2 == 0);
}
```

---

## Custom Iterator Implementation

```rust
struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Self {
        Counter { count: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.count < self.max {
            self.count += 1;
            Some(self.count)
        } else {
            None  // signals exhaustion
        }
    }
}

fn main() {
    let counter = Counter::new(5);

    // Automatically gets ALL iterator methods for free:
    let doubled: Vec<u32> = counter.map(|x| x * 2).collect();
    // [2, 4, 6, 8, 10]

    // Zip two Counters:
    let sum: u32 = Counter::new(5)
        .zip(Counter::new(5).skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 3 == 0)
        .sum();

    println!("{sum}");
}
```

---

## from_fn — Stateful Iterator from a Closure

```rust
use std::iter;

fn main() {
    // Fibonacci sequence via iter::from_fn
    let mut state = (0u64, 1u64);
    let fibs: Vec<u64> = iter::from_fn(move || {
        let next = state.0 + state.1;
        state = (state.1, next);
        Some(state.0)
    })
    .take(10)
    .collect();
    println!("{:?}", fibs);  // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

    // iter::once — single-element iterator
    let one: Vec<i32> = iter::once(42).collect();

    // iter::repeat — infinite iterator of one value
    let fives: Vec<i32> = iter::repeat(5).take(3).collect(); // [5, 5, 5]

    // iter::successors — each element computed from previous
    let powers_of_2: Vec<u64> = iter::successors(Some(1u64), |&n| n.checked_mul(2))
        .take(10)
        .collect();
}
```

---

## Parallel Iterators with Rayon

```rust
// Cargo.toml: rayon = "1.10"
use rayon::prelude::*;

fn main() {
    let data: Vec<u64> = (0..1_000_000).collect();

    // Drop-in parallel replacement for .iter() — uses all CPU cores
    let sum: u64 = data.par_iter().sum();

    // Parallel map + filter + collect
    let result: Vec<u64> = data
        .par_iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .collect();

    // par_iter() requires the closure to be Send + Sync (thread-safe captures)
    let factor = 3u64;
    let tripled: Vec<u64> = data.par_iter().map(|&x| x * factor).collect();
}
```

---

## Common Pitfalls

- **Forgetting `.collect()` type hint** — the compiler can't figure out the collection type without a hint. Use `collect::<Vec<_>>()` or annotate the binding.
- **Moving vs borrowing in iterator chains** — `v.into_iter().map(...)` moves v; `v.iter().map(...)` borrows v. After `into_iter()`, v is unavailable.
- **Infinite iterators without `.take()`** — `iter::repeat(1).collect::<Vec<_>>()` will loop forever. Always pair infinite iterators with `take()` or another terminator.
- **`.map()` vs `.for_each()`** — `.map()` is lazy; if you don't consume it, nothing happens. Use `.for_each()` for side effects.
- **Rayon requires `Send + Sync` closures** — captures must be thread-safe. `Rc<T>` and `RefCell<T>` won't compile with `par_iter()`.

---

## Review Questions

1. What is the only method you must implement to create a custom `Iterator`? What does returning `None` from it signify?
2. Explain what "lazy" means in the context of iterator adaptors. What would be the performance impact if `.map()` and `.filter()` were eager (computed immediately)?
3. Write an iterator chain using `v.iter()` that: filters to even numbers, squares them, takes the first 5, and sums them — as a single expression.
4. When would you use `rayon::par_iter()` vs a regular `.iter()` chain? What constraint does it place on closures?

---

#Rust #iterators #functional-programming #lazy-evaluation #collect
