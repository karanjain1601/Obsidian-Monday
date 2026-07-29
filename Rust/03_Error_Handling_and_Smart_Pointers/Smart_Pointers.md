---
title: Smart Pointers
aliases: [Rust Box, Rust Rc, Rust RefCell, Rust Arc, Rust Cow, Interior Mutability]
tags: [Rust, smart-pointers, Box, Rc, RefCell, Arc, memory, interior-mutability]
domain: Rust
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Ownership_and_Borrowing]]"
  - "[[Rust_Threads]]"
  - "[[Trait_Objects_and_Dynamic_Dispatch]]"
  - "[[Rust_Error_Handling]]"
status: complete
---

# Smart Pointers

> [!abstract] TL;DR
> Smart pointers wrap raw pointers with extra metadata and semantics. `Box<T>` moves data to the heap; `Rc<T>` enables multiple ownership via reference counting (single-threaded); `RefCell<T>` defers borrow checking to runtime for interior mutability. `Arc<T>` + `Mutex<T>` is the thread-safe combination for shared mutable state. `Cow<T>` avoids allocations when data is often read-only but occasionally needs modification.

---

## Intuition

Rust's ownership system enforces one owner per value. But some real-world patterns genuinely need multiple owners — a graph where nodes reference each other, a shared configuration object, a plugin system. Smart pointers are the controlled escape hatch: they let you opt into specific relaxations of the ownership rules while preserving safety.

The cost is runtime overhead: `Rc` does reference counting, `Mutex` does locking, `RefCell` does dynamic borrow checking. You pay only for what you use, and you always know exactly what you're paying for.

---

## Box<T> — Heap Allocation

`Box<T>` is the simplest smart pointer: it allocates T on the heap and owns it. When the Box is dropped, the heap memory is freed.

**Use cases:**
1. Recursive types (a type that contains itself — impossible on the stack since size is unknown)
2. Moving large values without copying
3. Trait objects (`Box<dyn Trait>`)
4. Transferring ownership of heap data with a known fixed pointer size

```rust
fn main() {
    // Simple heap allocation
    let b = Box::new(5);
    println!("{b}");  // 5 — Box implements Deref, so it behaves like i32
    // b is dropped here — heap memory freed

    // Large array on the heap (stack might overflow for very large data)
    let large = Box::new([0u8; 1_000_000]);  // 1MB on the heap, not the stack

    // Box with Deref coercion
    let x = Box::new(String::from("hello"));
    println!("{}", x.len());  // 5 — x auto-derefs to String, then to str
}

// Recursive type — without Box, the size is infinite (struct contains itself)
#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),  // Box breaks the infinite size — the pointer has known size
    Nil,
}

fn main2() {
    let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Cons(3, Box::new(List::Nil))))));
    println!("{:?}", list);
}
```

---

## Rc<T> — Reference Counted Shared Ownership

`Rc<T>` (Reference Counted) allows **multiple ownership** of the same data. The data is dropped when the last `Rc` pointing to it is dropped. **Single-threaded only** — use `Arc` for threads.

```rust
use std::rc::Rc;

fn main() {
    let shared = Rc::new(String::from("shared data"));

    let owner1 = Rc::clone(&shared);  // increment reference count (cheap — no copy!)
    let owner2 = Rc::clone(&shared);

    println!("count: {}", Rc::strong_count(&shared));  // 3

    println!("{shared}");   // shared data
    println!("{owner1}");   // shared data
    println!("{owner2}");   // shared data

    drop(owner1);
    println!("count after drop: {}", Rc::strong_count(&shared));  // 2

    // When shared and owner2 go out of scope, count reaches 0 → data is dropped
}

// Graph / tree node with multiple parents (shared ownership):
#[derive(Debug)]
struct Node {
    value: i32,
    children: Vec<Rc<Node>>,
}

impl Node {
    fn new(value: i32) -> Rc<Node> {
        Rc::new(Node { value, children: vec![] })
    }
}
```

### Rc Limitations

- `Rc<T>` is not thread-safe — the reference count uses non-atomic operations
- `Rc<T>` does not allow mutation (only gives `&T`)
- Cycles of `Rc` references create memory leaks — use `Weak<T>` to break cycles

---

## RefCell<T> — Interior Mutability

`RefCell<T>` moves borrow checking from compile time to **runtime**. It allows you to mutate T even when you only have a shared `&RefCell<T>` reference. If the borrow rules are violated at runtime, it panics.

```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(vec![1, 2, 3]);

    // borrow() → Ref<T> — immutable borrow (panics if already mutably borrowed)
    let r1 = data.borrow();
    println!("{:?}", *r1);  // [1, 2, 3]
    drop(r1);               // release the borrow

    // borrow_mut() → RefMut<T> — mutable borrow (panics if any borrow is active)
    data.borrow_mut().push(4);
    println!("{:?}", data.borrow());  // [1, 2, 3, 4]

    // try_borrow() — returns Result instead of panicking
    match data.try_borrow_mut() {
        Ok(mut v) => v.push(5),
        Err(e)    => println!("borrow failed: {e}"),
    }
}
```

---

## Rc<RefCell<T>> — Shared Mutable Data (Single-Threaded)

The classic combination for graphs and single-threaded shared mutable state:

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    value: i32,
    next: Option<Rc<RefCell<Node>>>,
}

fn main() {
    let node1 = Rc::new(RefCell::new(Node { value: 1, next: None }));
    let node2 = Rc::new(RefCell::new(Node { value: 2, next: None }));

    // Multiple owners can each mutate through borrow_mut
    node1.borrow_mut().next = Some(Rc::clone(&node2));

    // Another owner also holds a reference to node2
    let another_ref = Rc::clone(&node2);

    // Both can mutate:
    another_ref.borrow_mut().value = 99;
    println!("{:?}", node2.borrow().value);  // 99
}
```

---

## Weak<T> — Breaking Reference Cycles

`Weak<T>` is a non-owning reference that does NOT increment the strong reference count. When you need a back-reference (parent ← child), use `Weak` to avoid cycles:

```rust
use std::rc::{Rc, Weak};
use std::cell::RefCell;

#[derive(Debug)]
struct TreeNode {
    value: i32,
    children: Vec<Rc<RefCell<TreeNode>>>,
    parent: Option<Weak<RefCell<TreeNode>>>,   // Weak to avoid cycle
}

impl TreeNode {
    fn new(value: i32) -> Rc<RefCell<Self>> {
        Rc::new(RefCell::new(TreeNode { value, children: vec![], parent: None }))
    }

    fn add_child(parent: &Rc<RefCell<Self>>, child: Rc<RefCell<Self>>) {
        child.borrow_mut().parent = Some(Rc::downgrade(parent));  // downgrade → Weak
        parent.borrow_mut().children.push(child);
    }
}

fn main() {
    let root = TreeNode::new(1);
    let child = TreeNode::new(2);
    TreeNode::add_child(&root, child.clone());

    // Access parent from child (upgrade() returns Option<Rc<T>>)
    if let Some(parent) = child.borrow().parent.as_ref().and_then(|w| w.upgrade()) {
        println!("parent value: {}", parent.borrow().value);  // 1
    }
}
```

---

## Arc<T> — Thread-Safe Reference Counting

`Arc<T>` (Atomically Reference Counted) is `Rc<T>` but with atomic operations on the count — safe to use across threads. Always pair with `Mutex<T>` or `RwLock<T>` for mutation:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let c = Arc::clone(&counter);  // cheap clone — increments atomic count
        let h = thread::spawn(move || {
            let mut count = c.lock().unwrap();  // blocks until lock is acquired
            *count += 1;
        }); // Mutex guard is dropped here → lock released
        handles.push(h);
    }

    for h in handles { h.join().unwrap(); }
    println!("final count: {}", *counter.lock().unwrap());  // 10
}
```

---

## Cow<T> — Clone on Write

`Cow<'a, B>` (Clone on Write) is an enum that is either a borrowed `&B` or an owned `B`. It avoids allocation when you only need to read, but can clone to get ownership when mutation is needed:

```rust
use std::borrow::Cow;

fn ensure_uppercase(s: &str) -> Cow<str> {
    if s.chars().all(|c| c.is_uppercase()) {
        Cow::Borrowed(s)       // no allocation — return a borrow
    } else {
        Cow::Owned(s.to_uppercase())  // allocate only when needed
    }
}

fn main() {
    let already_upper = "HELLO";
    let result = ensure_uppercase(already_upper);
    // result is Cow::Borrowed — NO allocation

    let lower = "hello";
    let result2 = ensure_uppercase(lower);
    // result2 is Cow::Owned — allocated
}
```

---

## Smart Pointer Comparison

| Type | Ownership | Thread-safe | Mutation | Use case |
|------|-----------|-------------|----------|----------|
| `Box<T>` | Single | Yes | Direct | Heap alloc, trait objects, recursive types |
| `Rc<T>` | Multiple | No | Via RefCell | Single-threaded shared ownership |
| `Arc<T>` | Multiple | Yes | Via Mutex/RwLock | Multi-threaded shared ownership |
| `RefCell<T>` | Single | No | Runtime-checked | Interior mutability (single-threaded) |
| `Mutex<T>` | Single/Multi | Yes | Lock-guarded | Shared mutation across threads |
| `Cell<T>` | Single | No | Copy-based | Interior mutability for Copy types |
| `Cow<T>` | Either | Yes (borrowed) | Clone on write | Read-mostly, occasionally-mutated data |

---

## Common Pitfalls

- **`Rc` cycles cause memory leaks** — two `Rc` values pointing to each other keep each other alive forever. Use `Weak` for back-references (parent ← child).
- **`RefCell` panicking at runtime** — holding a `borrow_mut()` while also calling `borrow()` (or another `borrow_mut()`) panics. This is a logic bug — the borrow checker would have caught it at compile time with regular references.
- **Overusing `Arc<Mutex<T>>`** — it adds overhead. Consider whether the data truly needs to be shared across threads, or if you can structure the code to give each thread ownership of its own data.
- **`Arc::clone` looks like a deep copy** — it is NOT. It only increments the atomic counter. Use `Arc::clone(&val)` idiom (not `val.clone()`) to make the intent clear to readers.
- **`Box<T>` is not a general performance optimization** — boxing doesn't make code faster in general. Use it when you need heap allocation specifically (trait objects, large data, recursive types).

---

## Review Questions

1. When would you use `Box<T>` vs `Rc<T>`? Give a concrete scenario for each.
2. Explain `Rc<RefCell<T>>`. What problem does this combination solve? What are the runtime failure modes?
3. Why does `Rc<T>` not work across threads? What must you use instead, and what additional primitive is needed for mutation?
4. You have a tree where each node has a `Vec<Rc<Node>>` for children. Adding a parent back-reference as `Rc<Node>` creates a cycle. How do you fix this, and what does `upgrade()` return?

---

#Rust #smart-pointers #Box #Rc #RefCell #Arc #memory #interior-mutability
