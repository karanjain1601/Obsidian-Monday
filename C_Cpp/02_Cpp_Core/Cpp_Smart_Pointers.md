---
title: C++ Smart Pointers
aliases: [unique_ptr, shared_ptr, weak_ptr, C++ RAII Memory, C++ ownership]
tags: [C, Cpp, smart-pointers, RAII, unique_ptr, shared_ptr, weak_ptr, memory-safety]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Cpp_Overview]]"
  - "[[Memory_Management_Cpp]]"
  - "[[Move_Semantics]]"
  - "[[C_Pointers_and_Memory]]"
status: complete
---

# C++ Smart Pointers

> [!abstract] TL;DR
> Smart pointers are RAII wrappers around raw pointers that automatically call `delete` when the owning object goes out of scope. `unique_ptr` expresses sole ownership (zero overhead over a raw pointer). `shared_ptr` enables shared ownership via reference counting (small overhead per pointer). `weak_ptr` observes a `shared_ptr` without extending lifetime — essential for breaking reference cycles. Together they eliminate the memory leaks and use-after-free bugs that C's manual `malloc`/`free` is prone to.

---

## Why Smart Pointers Exist

```cpp
// C manual memory management — every path needs a free()
void c_style() {
    int *data = malloc(100 * sizeof(int));
    if (!data) return;

    if (some_condition()) {
        // ... process ...
        free(data);    // must remember to free on EVERY exit path
        return;
    }
    // ... more work ...
    free(data);        // easy to forget; exception would skip this entirely
}

// C++ with smart pointer — destructor handles cleanup automatically
#include <memory>
void cpp_style() {
    auto data = std::make_unique<int[]>(100);
    if (some_condition()) {
        // ... process ...
        return;   // data freed here by unique_ptr destructor
    }
    // ... more work ...
}   // data freed here — no explicit delete, no leak possible
```

---

## `std::unique_ptr` — Sole Ownership

`unique_ptr` represents exclusive ownership. It cannot be copied (no two owners), only moved.

```cpp
#include <memory>
#include <iostream>

class Widget {
    int id_;
public:
    explicit Widget(int id) : id_(id) { std::cout << "Widget(" << id_ << ") created\n"; }
    ~Widget() { std::cout << "Widget(" << id_ << ") destroyed\n"; }
    int id() const { return id_; }
};

int main() {
    // ALWAYS use make_unique — avoids raw new, exception-safe
    auto w1 = std::make_unique<Widget>(1);
    // auto w2 = w1;               // ERROR: unique_ptr is not copyable
    auto w2 = std::move(w1);       // MOVE: w1 is now null, w2 owns the Widget

    std::cout << (w1 == nullptr);  // 1 — w1 is null after move
    std::cout << w2->id();         // 1

    // Custom deleter — for non-delete cleanup (file handles, C APIs)
    auto file_del = [](FILE *f) { if (f) fclose(f); };
    std::unique_ptr<FILE, decltype(file_del)> fp(fopen("test.txt", "r"), file_del);

    // Array form
    auto arr = std::make_unique<int[]>(100);
    arr[5] = 42;

    // Transfer ownership to a function
    auto process = [](std::unique_ptr<Widget> w) {
        std::cout << "Processing widget " << w->id() << "\n";
    };   // w destroyed here
    process(std::move(w2));

    return 0;
}   // everything destroyed here if not moved
```

---

## `std::shared_ptr` — Shared Ownership

`shared_ptr` maintains a reference count. The object is deleted when the last `shared_ptr` to it is destroyed.

```cpp
#include <memory>
#include <iostream>

int main() {
    // ALWAYS use make_shared — allocates object and control block together (one heap alloc)
    auto sp1 = std::make_shared<Widget>(2);
    std::cout << "refs=" << sp1.use_count() << "\n";   // 1

    {
        auto sp2 = sp1;             // copy — reference count becomes 2
        auto sp3 = sp1;             // copy — reference count becomes 3
        std::cout << "refs=" << sp1.use_count() << "\n";  // 3
    }   // sp2 and sp3 destroyed — count back to 1
    std::cout << "refs=" << sp1.use_count() << "\n";   // 1

    // sp1 goes out of scope — count hits 0 — Widget destroyed

    // Control block overhead: two atomic counters (strong_count, weak_count)
    // Cost: atomic increment/decrement per copy/destroy — avoid excessive shared_ptr copies in hot paths

    // NEVER mix raw new with make_shared in the same expression:
    // std::shared_ptr<Widget> bad(new Widget(3));  // two allocations (object + control block)
    // std::make_shared<Widget>(3);                 // ONE allocation — always prefer
}
```

---

## `std::weak_ptr` — Non-Owning Observer

`weak_ptr` observes a `shared_ptr`-managed object without participating in reference counting. It cannot directly access the object — must be converted to `shared_ptr` first (which may fail if the object was already deleted).

```cpp
#include <memory>
#include <iostream>

// Classic use: break reference cycles
struct Node {
    int value;
    std::shared_ptr<Node> next;
    std::weak_ptr<Node>   prev;   // weak to break the cycle
    explicit Node(int v) : value(v) {}
    ~Node() { std::cout << "Node(" << value << ") destroyed\n"; }
};

int main() {
    auto n1 = std::make_shared<Node>(1);
    auto n2 = std::make_shared<Node>(2);
    n1->next = n2;
    n2->prev = n1;   // weak_ptr — n1's refcount NOT increased

    // If both were shared_ptr: n1 keeps n2 alive, n2 keeps n1 alive
    //   → both ref counts stay at 1 when n1/n2 go out of scope → LEAK
    // With weak_ptr: n2->prev doesn't increment n1's count → n1 deleted → n2 deleted

    // Access via weak_ptr — must check if the object still exists
    if (auto locked = n2->prev.lock()) {   // lock() returns shared_ptr or nullptr
        std::cout << "prev value: " << locked->value << "\n";   // 1
    } else {
        std::cout << "object was deleted\n";
    }

    // expired() — true if the pointed-to object has been deleted
    std::weak_ptr<Node> obs = n1;
    std::cout << "expired=" << obs.expired() << "\n";   // 0
    n1.reset();   // drop the last strong reference
    std::cout << "expired=" << obs.expired() << "\n";   // 1
}
```

---

## `enable_shared_from_this`

```cpp
#include <memory>

// Allows an object to safely create a shared_ptr to itself
class EventEmitter : public std::enable_shared_from_this<EventEmitter> {
public:
    std::shared_ptr<EventEmitter> get_self() {
        return shared_from_this();   // returns a shared_ptr sharing the same control block
        // NEVER do: return std::shared_ptr<EventEmitter>(this) — creates a SECOND control block!
    }
};

// EventEmitter must always be managed by shared_ptr for shared_from_this to work
auto emitter = std::make_shared<EventEmitter>();
auto self = emitter->get_self();   // same control block as emitter
```

---

## When Raw Pointers Are Still Appropriate

Smart pointers express ownership semantics. Raw pointers are appropriate for **non-owning observation**:

- Function parameters that just use the object but do not store it: `void render(const Widget *w)` — the caller owns `w`, the function merely observes
- Returning pointer to an element of a container (lifetime tied to container)
- Legacy C API interoperability: `c_api_function(ptr.get())` — pass the raw pointer, smart pointer still owns it
- Performance-critical inner loops where reference count atomics are measurable overhead

---

## Common Pitfalls

- **`shared_ptr` cycles without `weak_ptr`:** Two `shared_ptr` objects pointing to each other (or indirectly) create a reference cycle — both reference counts stay > 0 forever, neither object is deleted. Use `weak_ptr` for back-pointers and observer relationships.
- **`new` in constructor arguments:** `func(std::shared_ptr<T>(new T), might_throw())` — if `might_throw()` runs before the `shared_ptr` constructor, the raw pointer leaks. `make_shared` eliminates this entirely.
- **Calling `shared_from_this` in constructor:** The control block does not exist yet during construction. `shared_from_this()` in a constructor throws `std::bad_weak_ptr`.
- **Storing `get()` raw pointer:** `T *raw = sp.get(); sp.reset();` — `raw` is now a dangling pointer. Never store the result of `.get()` beyond the scope where the smart pointer is guaranteed alive.

---

## Review Questions

1. What is the memory overhead of `std::shared_ptr` vs `std::unique_ptr`? Why is `make_shared` preferable to `shared_ptr<T>(new T)`?
2. Explain a concrete reference cycle scenario that causes a memory leak with `shared_ptr`. Rewrite it using `weak_ptr` to fix the leak.
3. A function signature is `void process(std::unique_ptr<Task> task)`. What does this communicate about ownership, and how must the caller pass the argument?
4. When is a raw pointer (not a smart pointer) the correct tool? Give two legitimate use cases.

---

#C #Cpp
