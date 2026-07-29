---
title: C++ STL Containers
aliases: [C++ vector, C++ map, C++ unordered_map, STL Containers, C++ deque]
tags: [C, Cpp, STL, containers, vector, map, iterator-invalidation]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Cpp_Overview]]"
  - "[[Cpp_STL_Algorithms]]"
  - "[[Cpp_Modern_Features]]"
  - "[[Cpp_Templates]]"
status: complete
---

# C++ STL Containers

> [!abstract] TL;DR
> The STL provides battle-tested, generic containers covering every common data structure need. `std::vector` is the default choice for sequences; `std::unordered_map` for O(1) average lookups; `std::map` for ordered traversal. Iterator invalidation rules are the most dangerous aspect — modifying a container while iterating it or after storing an iterator is undefined behavior that causes silent corruption or crashes.

---

## `std::vector` — Dynamic Array

```cpp
#include <vector>
#include <iostream>
#include <algorithm>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5, 9};

    // capacity vs size
    std::cout << "size="     << v.size()     << "\n";  // 6 — elements present
    std::cout << "capacity=" << v.capacity() << "\n";  // >= 6 — allocated space

    // push_back: amortized O(1) — may cause reallocation (doubles capacity)
    v.push_back(2);     // copies 2 into the vector
    v.emplace_back(6);  // CONSTRUCTS 6 in-place — no copy; prefer for complex types

    // Reserve to avoid reallocations when size is known
    v.reserve(100);     // capacity = 100, size unchanged

    // Access — operator[] (no bounds check), at() (throws std::out_of_range)
    v[0] = 10;
    try { v.at(1000) = 5; } catch (const std::out_of_range&) { }

    // Erase — O(n) — shifts elements left
    v.erase(v.begin() + 2);                    // erase by iterator
    v.erase(v.begin() + 1, v.begin() + 3);     // erase range

    // Erase-remove idiom — remove all elements equal to a value
    std::erase(v, 1);                          // C++20
    // Pre-C++20: v.erase(std::remove(v.begin(), v.end(), 1), v.end());

    // Iteration
    for (int x : v) std::cout << x << " ";
    for (auto it = v.begin(); it != v.end(); ++it) std::cout << *it << " ";

    return 0;
}
```

---

## `std::string` — Character Container

```cpp
#include <string>
#include <string_view>   // C++17

int main() {
    std::string s = "Hello, world!";

    // SSO (Small String Optimization): strings <= ~15 chars stored inline (no heap)
    s.substr(7, 5);          // "world" — O(n) copy
    s.find("world");         // 7 (index) or std::string::npos if not found
    s += " How are you?";    // append — O(n)
    s.replace(7, 5, "C++");  // "Hello, C++! How are you?"

    // C++17: std::string_view — non-owning view, zero-copy
    // Use as function parameter instead of const std::string& when no modification needed
    auto count_chars = [](std::string_view sv, char c) {
        return std::count(sv.begin(), sv.end(), c);
    };

    std::cout << count_chars(s, 'o') << "\n";   // works with string, literal, or view
    // string_view can be constructed from: std::string, const char*, char array
    // DANGER: string_view must not outlive the string it views

    return 0;
}
```

---

## `std::map` and `std::unordered_map`

```cpp
#include <map>
#include <unordered_map>
#include <string>

int main() {
    // std::map — balanced BST (red-black tree), O(log n) operations, SORTED iteration
    std::map<std::string, int> word_count;
    word_count["apple"] = 3;
    word_count["banana"]++;                // default-constructs int to 0, then increments
    word_count.insert({"cherry", 5});
    word_count.emplace("date", 2);         // in-place construction — no copy

    auto it = word_count.find("apple");
    if (it != word_count.end()) {
        std::cout << it->first << ": " << it->second << "\n";
    }

    // Iterates in sorted key order
    for (const auto& [key, val] : word_count) {  // C++17 structured bindings
        std::cout << key << "=" << val << "\n";
    }

    // std::unordered_map — hash table, O(1) average, UNSORTED, needs hashable key
    std::unordered_map<std::string, int> freq;
    freq.reserve(1000);                    // avoid rehashing
    freq.max_load_factor(0.5f);            // lower = fewer collisions, more memory

    for (const char *word : {"a", "b", "a", "c", "a"}) {
        freq[word]++;
    }

    // Custom hash for user types
    struct PairHash {
        size_t operator()(const std::pair<int,int>& p) const {
            return std::hash<int>{}(p.first) ^ (std::hash<int>{}(p.second) << 32);
        }
    };
    std::unordered_map<std::pair<int,int>, int, PairHash> grid;
}
```

---

## Other Containers

```cpp
#include <set>
#include <deque>
#include <array>
#include <span>      // C++20

// std::set — sorted unique keys, O(log n) operations
std::set<int> s = {3, 1, 4, 1, 5};   // {1, 3, 4, 5} — duplicates removed
s.insert(2);
bool has_3 = s.count(3);              // 1 (exists) or 0

// std::unordered_set — hash table set, O(1) average
std::unordered_set<int> us = {1, 2, 3};

// std::deque — double-ended queue, O(1) push/pop at both ends
std::deque<int> dq;
dq.push_front(1);  dq.push_back(2);
dq.pop_front();    dq.pop_back();

// std::array — fixed-size array, same cost as C array but STL-compatible
std::array<int, 5> arr = {1, 2, 3, 4, 5};
arr.at(2);         // bounds-checked access
arr.size();        // 5 — constexpr

// std::span (C++20) — non-owning view over contiguous sequence
// Use as function parameter instead of (T*, size_t)
void sum(std::span<const int> data) {
    int total = 0;
    for (int x : data) total += x;
}
// Works with vector, array, C array, anything contiguous
sum(arr);
sum(std::vector<int>{1,2,3});
```

---

## Iterator Invalidation Rules

| Container | What invalidates iterators |
|-----------|---------------------------|
| `vector` | Any reallocation (push_back when capacity exceeded), insert/erase before the point |
| `deque` | Any insert/erase (all iterators invalidated) |
| `list` | Only the erased element's iterator is invalidated |
| `map`/`set` | Only the erased element's iterator is invalidated |
| `unordered_map` | Rehashing invalidates ALL iterators (happens on insert when load_factor exceeded) |

```cpp
// WRONG: erase during iteration with index-based loop
std::vector<int> v = {1, 2, 3, 2, 4};
for (size_t i = 0; i < v.size(); i++) {
    if (v[i] == 2) v.erase(v.begin() + i);  // skips element after erasure!
}

// CORRECT: iterator-based erase — erase returns iterator to next valid element
for (auto it = v.begin(); it != v.end(); ) {
    if (*it == 2) it = v.erase(it);   // it points to next element
    else          ++it;
}
```

---

## Common Pitfalls

- **`operator[]` on map inserts:** `map[key]` inserts a default-constructed value if `key` is absent — even in `const`-looking read code. Use `.find()` or `.count()` for safe lookup.
- **Storing iterators after modification:** Any operation that invalidates iterators (vector push_back causing reallocation) silently makes stored iterators dangling.
- **`string_view` dangling:** `std::string_view sv = std::string("temp");` — the temporary is destroyed immediately, `sv` dangles. Only bind `string_view` to lvalues that outlive the view.

---

## Review Questions

1. `vector::push_back` has amortized O(1) complexity. Explain what "amortized" means in this context — what happens during occasional reallocations, and why is the average still O(1)?
2. You have a `std::map<string, int>` and call `map["missing_key"]`. What happens? How do you check for key existence without insertion?
3. Explain why `unordered_map` is not always faster than `map`. Give a scenario where `map` is preferable.
4. A colleague iterates a `std::vector<int> v` with a range-based for loop and also calls `v.push_back(x)` inside the loop. What is the risk, and how do you fix it?

---

#C #Cpp
