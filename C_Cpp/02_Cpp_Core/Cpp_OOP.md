---
title: C++ OOP
aliases: [C++ Classes, C++ Inheritance, C++ Virtual Functions, Rule of Five, vtable]
tags: [C, Cpp, OOP, classes, inheritance, virtual, polymorphism]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Cpp_Overview]]"
  - "[[Cpp_Smart_Pointers]]"
  - "[[Move_Semantics]]"
  - "[[Memory_Management_Cpp]]"
status: complete
---

# C++ OOP

> [!abstract] TL;DR
> C++ classes add constructors, destructors, access control, and operator overloading to C structs. The Rule of Five governs how objects are copied and moved: if you define any one of destructor/copy-constructor/copy-assignment/move-constructor/move-assignment, you likely need all five. Virtual functions enable runtime polymorphism through vtables; `override` and `final` prevent silent interface mismatches.

---

## Class vs Struct

```cpp
// In C++, struct and class are identical except default access:
// struct → public by default
// class  → private by default

struct Point { double x, y; };       // x and y are public
class  Point2 { double x, y; };      // x and y are private

class Counter {
    int count_;                       // private by default
public:
    Counter() : count_(0) {}         // constructor with member initializer list
    void increment() { ++count_; }
    int  value() const { return count_; }  // const member: does not modify *this
};
```

---

## Constructors, Destructors, and the Rule of Five

When a class manages a resource (heap memory, file handle, socket), the compiler-generated copy/move operations are wrong — they shallow-copy the pointer rather than deep-copying the data. Define all five special member functions:

```cpp
#include <cstring>
#include <stdexcept>
#include <utility>   // std::move, std::swap
#include <iostream>

class String {
    char   *data_;
    size_t  size_;

public:
    // 1. Constructor
    explicit String(const char *s = "") {
        size_ = strlen(s);
        data_ = new char[size_ + 1];
        memcpy(data_, s, size_ + 1);
    }

    // 2. Destructor — releases heap memory
    ~String() {
        delete[] data_;
    }

    // 3. Copy constructor — deep copy
    String(const String& other) {
        size_ = other.size_;
        data_ = new char[size_ + 1];
        memcpy(data_, other.data_, size_ + 1);
    }

    // 4. Copy assignment — handle self-assignment, then copy
    String& operator=(const String& other) {
        if (this == &other) return *this;       // guard against self-assignment
        String tmp(other);                      // copy-and-swap idiom
        swap(*this, tmp);
        return *this;
    }

    // 5. Move constructor — steal resources, leave other in valid-but-empty state
    String(String&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;   // prevent double-delete in other's destructor
        other.size_ = 0;
    }

    // 5b. Move assignment
    String& operator=(String&& other) noexcept {
        if (this == &other) return *this;
        delete[] data_;
        data_ = other.data_;
        size_ = other.size_;
        other.data_ = nullptr;
        other.size_ = 0;
        return *this;
    }

    friend void swap(String& a, String& b) noexcept {
        using std::swap;
        swap(a.data_, b.data_);
        swap(a.size_, b.size_);
    }

    const char* c_str() const { return data_; }
};
```

**Rule of Zero:** If your class members are all RAII types (`unique_ptr`, `string`, `vector`), the compiler-generated operations are correct — define NONE of the five.

---

## Virtual Functions and Polymorphism

```cpp
#include <iostream>
#include <memory>
#include <vector>

class Shape {
public:
    virtual double area() const = 0;        // pure virtual — makes Shape abstract
    virtual void   describe() const {       // virtual with default implementation
        std::cout << "Area: " << area() << "\n";
    }
    virtual ~Shape() = default;             // MUST be virtual for correct delete
};

class Circle : public Shape {
    double radius_;
public:
    explicit Circle(double r) : radius_(r) {}
    double area() const override { return 3.14159 * radius_ * radius_; }
    // override keyword: compile error if base class has no matching virtual function
};

class Rectangle : public Shape {
    double w_, h_;
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    void describe() const override final {  // final: no further overriding allowed
        std::cout << "Rectangle " << w_ << "x" << h_ << " area=" << area() << "\n";
    }
};

// Polymorphism via pointer/reference — NEVER by value (slicing!)
int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));

    for (const auto& s : shapes) {
        s->describe();    // correct virtual dispatch at runtime via vtable
    }
}
```

---

## Multiple Inheritance and the Diamond Problem

```cpp
class Animal {
public:
    virtual void speak() { std::cout << "...\n"; }
    virtual ~Animal() = default;
};

class Dog    : public virtual Animal { public: void speak() override { std::cout << "Woof\n"; } };
class Cat    : public virtual Animal { public: void speak() override { std::cout << "Meow\n"; } };

// Without virtual inheritance, DogCat would have TWO Animal subobjects — ambiguous
// With virtual inheritance, there is ONE shared Animal subobject
class DogCat : public Dog, public Cat {
public:
    void speak() override { std::cout << "Woof-Meow\n"; }
};

// Vtable structure (conceptual):
// Shape object: [ vtable_ptr | radius_ ]
//                     |
//                     v
//              [ &Circle::area | &Shape::describe | &Shape::~Shape ]
// Each class with virtual functions gets a vtable (one per class, shared by instances)
// Each instance has a hidden vptr pointing to its class's vtable
```

---

## Common Pitfalls

- **Missing virtual destructor:** If a base class destructor is not virtual and you `delete` a derived object through a base pointer, only the base destructor runs — the derived destructor is skipped and resources leak. Always declare destructors `virtual` in base classes (or `= default` in C++11).
- **Object slicing:** `Shape s = *circle_ptr;` copies only the `Shape` part — the `Circle` data is lost and `area()` calls the base version. Always use pointers or references for polymorphism.
- **Rule of Three trap:** Defining a destructor but forgetting copy constructor/assignment means the compiler generates shallow copies — two objects point to the same heap data, and both destructors try to `delete` it (double free).
- **Calling virtual functions in constructors:** During construction, the vtable points to the current class being constructed, not the most-derived class. Virtual dispatch does not work in constructors/destructors.

---

## Review Questions

1. What is the vtable and when is it used for dispatch? Give the memory overhead (per class, per object) of having virtual functions.
2. Explain the Rule of Five. Under what condition is the Rule of Zero the better choice?
3. Why must base class destructors be declared `virtual`? What specific memory error occurs without it?
4. A `Dog : public Animal` and `Cat : public Animal` both inherit from `Animal`. `DogCat : public Dog, public Cat` suffers from the diamond problem. What specifically is ambiguous, and how does `virtual` inheritance resolve it?

---

#C #Cpp
