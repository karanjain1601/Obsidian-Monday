---
title: C++ STL Algorithms
aliases: [C++ Algorithms, std::algorithm, C++ Ranges, C++20 views, parallel algorithms]
tags: [C, Cpp, STL, algorithms, ranges, views, parallel]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Cpp_STL_Containers]]"
  - "[[Cpp_Modern_Features]]"
  - "[[Cpp_Templates]]"
status: complete
---

# C++ STL Algorithms

> [!abstract] TL;DR
> `<algorithm>` provides over 100 generic algorithms that work on any iterator range. C++17 adds parallel execution policies — the same algorithm code can run sequentially, in parallel, or vectorized just by passing a policy argument. C++20 Ranges modernizes the interface: algorithms accept containers directly, views compose lazily without allocating intermediate containers, and pipes (`|`) replace verbose iterator pairs.

---

## Core `<algorithm>` Functions

```cpp
#include <algorithm>
#include <vector>
#include <string>
#include <numeric>   // accumulate, iota, reduce
#include <iostream>

int main() {
    std::vector<int> v = {5, 3, 8, 1, 9, 2, 7, 4, 6};

    // ── Sorting ───────────────────────────────────────────────────────────────
    std::sort(v.begin(), v.end());                              // ascending
    std::sort(v.begin(), v.end(), std::greater<int>{});         // descending
    std::sort(v.begin(), v.end(), [](int a, int b) { return a % 3 < b % 3; }); // custom

    std::stable_sort(v.begin(), v.end());  // preserves relative order of equal elements
    std::partial_sort(v.begin(), v.begin() + 3, v.end());  // 3 smallest at front

    // ── Searching ─────────────────────────────────────────────────────────────
    std::sort(v.begin(), v.end());
    bool has5 = std::binary_search(v.begin(), v.end(), 5);   // O(log n) on sorted range
    auto it   = std::lower_bound(v.begin(), v.end(), 5);     // first element >= 5
    auto it2  = std::upper_bound(v.begin(), v.end(), 5);     // first element > 5

    auto pos  = std::find(v.begin(), v.end(), 7);            // linear search
    auto posf = std::find_if(v.begin(), v.end(), [](int x) { return x > 5; });

    // ── Counting ──────────────────────────────────────────────────────────────
    int cnt  = std::count(v.begin(), v.end(), 3);
    int cntf = std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });

    // ── Transformations ───────────────────────────────────────────────────────
    std::vector<int> doubled(v.size());
    std::transform(v.begin(), v.end(), doubled.begin(), [](int x) { return x * 2; });

    std::reverse(v.begin(), v.end());
    std::rotate(v.begin(), v.begin() + 2, v.end());   // [2..n, 0..1]

    // ── Remove/Unique ─────────────────────────────────────────────────────────
    // remove_if: moves elements to be kept to front, returns new logical end
    auto new_end = std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
    v.erase(new_end, v.end());   // erase-remove idiom — actually shrinks the vector

    v = {1, 1, 2, 2, 3, 3};
    auto uend = std::unique(v.begin(), v.end());   // remove consecutive duplicates
    v.erase(uend, v.end());      // v = {1, 2, 3}

    // ── Numeric ───────────────────────────────────────────────────────────────
    int sum  = std::accumulate(v.begin(), v.end(), 0);      // 0+1+2+3 = 6
    int prod = std::accumulate(v.begin(), v.end(), 1, std::multiplies<int>{});
    // std::reduce (C++17): like accumulate but order is unspecified (parallelizable)
    int sum2 = std::reduce(v.begin(), v.end());

    std::vector<int> seq(10);
    std::iota(seq.begin(), seq.end(), 0);   // {0, 1, 2, ..., 9}

    return 0;
}
```

---

## Copy, Fill, Generate

```cpp
#include <algorithm>
#include <vector>
#include <iterator>

int main() {
    std::vector<int> src = {1, 2, 3, 4, 5};
    std::vector<int> dst(5);

    std::copy(src.begin(), src.end(), dst.begin());
    std::copy_if(src.begin(), src.end(), std::back_inserter(dst),
                 [](int x) { return x % 2 == 0; });   // copies only even elements

    std::fill(dst.begin(), dst.end(), 0);              // set all to 0
    std::fill_n(dst.begin(), 3, 42);                   // first 3 → 42

    int n = 0;
    std::generate(dst.begin(), dst.end(), [&n]() { return n++ * n; }); // 0,1,4,9,16
    std::generate_n(std::back_inserter(dst), 5, []() { return rand() % 100; });

    // min/max element
    auto max_it = std::max_element(src.begin(), src.end());
    auto [min_it, max_it2] = std::minmax_element(src.begin(), src.end());

    return 0;
}
```

---

## C++20 Ranges

```cpp
#include <ranges>    // C++20
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // Ranges algorithms — take container directly, no begin()/end()
    std::ranges::sort(v);
    std::ranges::reverse(v);
    auto it = std::ranges::find(v, 5);

    // Views — lazy, composable, ZERO allocation
    auto result = v
        | std::views::filter([](int x) { return x % 2 == 0; })   // keep even
        | std::views::transform([](int x) { return x * x; })     // square them
        | std::views::take(3);                                     // first 3

    for (int x : result) std::cout << x << " ";   // 100 64 36 (lazy evaluation)

    // views::iota: lazy integer range
    for (int i : std::views::iota(0, 10)) std::cout << i << " ";

    // views::zip (C++23): iterate two containers together
    // for (auto [a, b] : std::views::zip(v1, v2)) { ... }

    // Convert view to vector (materializes the lazy view)
    auto vec = result | std::ranges::to<std::vector>();   // C++23
    // Pre-C++23:
    std::vector<int> materialized;
    std::ranges::copy(result, std::back_inserter(materialized));

    return 0;
}
```

---

## Parallel Execution Policies (C++17)

```cpp
#include <algorithm>
#include <execution>    // std::execution::par
#include <vector>
#include <numeric>

int main() {
    std::vector<int> v(10'000'000);
    std::iota(v.begin(), v.end(), 0);

    // Sequential (default — always safe)
    std::sort(std::execution::seq, v.begin(), v.end());

    // Parallel — uses thread pool (TBB, OpenMP, or platform-specific backend)
    std::sort(std::execution::par, v.begin(), v.end());

    // Parallel + vectorized — may use SIMD instructions within each thread
    std::sort(std::execution::par_unseq, v.begin(), v.end());

    // Works with most algorithms: for_each, transform, reduce, count_if, ...
    long long sum = std::reduce(std::execution::par, v.begin(), v.end(), 0LL);

    // WARNING: parallel execution requires that the callable is thread-safe
    // DO NOT capture by non-atomic reference and mutate shared state
    int safe_count = 0;
    std::atomic<int> atomic_count{0};
    std::for_each(std::execution::par, v.begin(), v.end(),
        [&atomic_count](int x) {
            if (x % 2 == 0) atomic_count.fetch_add(1, std::memory_order_relaxed);
        }
    );

    return 0;
}
```

---

## Common Pitfalls

- **`std::remove` does not shrink the container:** `std::remove` / `std::remove_if` moves elements to be kept to the front and returns an iterator to the new logical end — it does not call `erase`. Always follow with `v.erase(new_end, v.end())`.
- **Views must not outlive the container:** `std::views::filter(container, pred)` holds a reference to the container. If the container is destroyed or reallocated, the view is dangling.
- **`std::sort` requires random-access iterators:** `std::list` does not have random-access iterators — use `list.sort()` member function instead of `std::sort`.
- **Parallel algorithm safety:** Lambda functions used with parallel policies must not share mutable state without synchronization. Capturing a plain `int&` and incrementing it from multiple threads is a data race.

---

## Review Questions

1. What is the "erase-remove idiom"? Why does `std::remove_if` not shrink the vector by itself?
2. Explain the difference between `std::accumulate` and `std::reduce`. What constraint does `std::reduce` relax, and why does that matter for parallel execution?
3. What is a lazy view in the C++20 Ranges library? Why is `v | views::filter(...) | views::transform(...)` more efficient than storing intermediate `std::vector` results?
4. Why can't `std::sort` be applied to `std::list` iterators? What is the correct way to sort a `std::list`?

---

#C #Cpp
