---
title: C/C++ Testing and Debugging
aliases: [GDB debugging, Google Test, Catch2, AddressSanitizer, Valgrind, gtest]
tags: [C, Cpp, testing, debugging, GDB, gtest, Catch2, sanitizers, valgrind]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[C_Pointers_and_Memory]]"
  - "[[CMake_Build_System]]"
  - "[[Cpp_Exception_Handling]]"
status: complete
---

# C/C++ Testing and Debugging

> [!abstract] TL;DR
> C and C++ lack the runtime safety nets of managed languages — bugs manifest as silent data corruption, crashes in unrelated code, or undefined behavior that appears to work until deployment. The defense is layered: sanitizers catch bugs at runtime during testing, Valgrind detects memory errors with full instrumentation, GDB lets you inspect program state at any point, and Google Test / Catch2 provide structured unit testing with assertion macros.

---

## GDB — GNU Debugger

```bash
# Compile with debug symbols (-g), minimal optimization (-O0 or -Og)
g++ -g -O0 -o myapp myapp.cpp

# Start GDB
gdb ./myapp
gdb --args ./myapp arg1 arg2   # pass command-line arguments

# Core dump debugging (post-mortem)
ulimit -c unlimited             # enable core dumps
./myapp                         # crash → generates core file
gdb ./myapp core
```

```
# GDB commands
(gdb) run                   # start the program
(gdb) run arg1 arg2         # start with arguments

# Breakpoints
(gdb) break main            # break at function
(gdb) break myfile.cpp:42   # break at line 42
(gdb) break MyClass::method # break at member function
(gdb) info breakpoints      # list all breakpoints
(gdb) delete 2              # delete breakpoint 2
(gdb) condition 1 x > 0     # break only when x > 0

# Execution
(gdb) continue   (c)        # resume until next breakpoint
(gdb) next       (n)        # step over (don't enter function calls)
(gdb) step       (s)        # step into function calls
(gdb) finish                # run until current function returns
(gdb) until 55              # run until line 55

# Inspection
(gdb) print x               # print variable
(gdb) print *ptr            # dereference pointer
(gdb) print arr[3]          # array element
(gdb) x/10d arr             # examine 10 ints at address arr
(gdb) info locals           # all local variables
(gdb) backtrace  (bt)       # print call stack
(gdb) frame 3               # switch to stack frame 3
(gdb) up / down             # navigate call stack frames

# Watchpoints — break when a variable's value changes
(gdb) watch x               # break when x is written
(gdb) rwatch x              # break when x is read

# Memory
(gdb) info address my_func  # show address of symbol
(gdb) x/s ptr               # examine memory as string
```

---

## AddressSanitizer (ASan) + UBSan

ASan and UBSan are compiler-instrumented sanitizers — they add lightweight checks around every memory operation and print exact error locations with stack traces:

```bash
# Compile with sanitizers (use -O1 for readable output, -g for line numbers)
g++ -fsanitize=address,undefined -g -O1 -o prog prog.cpp
clang++ -fsanitize=address,undefined -g -O1 -o prog prog.cpp

./prog   # runs normally; sanitizers output errors to stderr
```

```
# ASan output example — buffer overflow:
==12345==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7ffd...
WRITE of size 4 at 0x7ffd... thread T0
    #0 0x401234 in main prog.cpp:15
    #1 0x7f... in __libc_start_main
Shadow bytes around the buggy address:
  [...]
```

```cpp
// Code that ASan catches:
void asan_demo() {
    int arr[5];
    arr[10] = 42;       // ASan: stack-buffer-overflow at arr+10

    int *p = new int(1);
    delete p;
    *p = 2;             // ASan: heap-use-after-free

    // UBSan catches:
    int x = INT_MAX;
    x += 1;             // UBSan: signed integer overflow

    int *null_p = nullptr;
    *null_p = 5;        // UBSan: null pointer dereference
}
```

---

## Valgrind Memcheck

Valgrind emulates the CPU and instruments every memory access — catches leaks and errors that ASan misses (e.g., uninitialized reads):

```bash
gcc -g -O0 -o prog prog.c     # debug build
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         --error-exitcode=1 \
         ./prog

# Typical output:
# ==PID== Invalid read of size 4       ← use-after-free / buffer overflow
# ==PID== Invalid write of size 4
# ==PID== Conditional jump or move depends on uninitialised value  ← uninitialized read
# ==PID== LEAK SUMMARY:
# ==PID==    definitely lost: 96 bytes in 1 blocks  ← real leak
# ==PID==    indirectly lost: 0 bytes
# ==PID==    still reachable: 0 bytes
```

---

## Google Test (gtest)

```cpp
// test_math.cpp
#include <gtest/gtest.h>
#include "math_utils.h"   // code under test

// TEST(SuiteName, TestName) — standalone test
TEST(AddTest, HandlesPositives) {
    EXPECT_EQ(add(2, 3), 5);
    EXPECT_EQ(add(0, 0), 0);
}

TEST(AddTest, HandlesNegatives) {
    EXPECT_EQ(add(-1, 1), 0);
    EXPECT_LT(add(-5, -3), 0);   // EXPECT_LT: less than
}

// ASSERT_* vs EXPECT_*
// ASSERT_*: fatal — stops the current test immediately on failure
// EXPECT_*: non-fatal — test continues (preferred for most checks)

// TEST_F(FixtureName, TestName) — test with shared setup/teardown
class VectorTest : public ::testing::Test {
protected:
    void SetUp() override {
        v.push_back(1); v.push_back(2); v.push_back(3);
    }
    void TearDown() override { v.clear(); }
    std::vector<int> v;
};

TEST_F(VectorTest, SizeIsThree) {
    EXPECT_EQ(v.size(), 3u);
}

TEST_F(VectorTest, ContainsTwo) {
    EXPECT_THAT(v, ::testing::Contains(2));   // Google Mock matchers
}

// Exception testing
TEST(MathTest, ThrowsOnZeroDivide) {
    EXPECT_THROW(safe_divide(1, 0), std::invalid_argument);
    EXPECT_NO_THROW(safe_divide(10, 2));
}

// Parameterized test
class EvenTest : public ::testing::TestWithParam<int> {};
TEST_P(EvenTest, IsEven) {
    EXPECT_EQ(GetParam() % 2, 0);
}
INSTANTIATE_TEST_SUITE_P(EvenNumbers, EvenTest, ::testing::Values(2, 4, 6, 8, 100));

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

---

## Catch2 — Header-Only Testing

```cpp
// test_math_catch.cpp
#define CATCH_CONFIG_MAIN   // Catch2 provides main()
#include <catch2/catch.hpp>

TEST_CASE("add function", "[math]") {
    SECTION("positive numbers") {
        REQUIRE(add(2, 3) == 5);   // REQUIRE = fatal assertion
    }
    SECTION("negative numbers") {
        CHECK(add(-1, -1) == -2);  // CHECK = non-fatal (like EXPECT_*)
    }
}

TEST_CASE("exceptions are thrown for invalid input", "[math][exception]") {
    REQUIRE_THROWS_AS(safe_divide(1, 0), std::invalid_argument);
}
```

```bash
# Run tests with filters
./test_math_catch "[math]"          # run tests tagged [math]
./test_math_catch --list-tests      # list all test names
```

---

## Common Pitfalls

- **Testing in Debug vs Release:** A bug may disappear in debug builds (due to zero-initialized stack memory, slower execution, or different padding). Always run sanitizers and tests in both configurations.
- **UB that passes tests:** Undefined behavior can appear to work 99% of the time but fail under different compilers, optimization levels, or workloads. UBSan makes it fail loudly — run it regularly.
- **ASSERT_EQ type mismatch:** `ASSERT_EQ(v.size(), 5)` compares `size_t` (unsigned) with `int` — can cause comparison warnings or subtle failures. Use `ASSERT_EQ(v.size(), 5u)` or cast.
- **Not testing edge cases:** Empty containers, null pointers, maximum values, and empty strings are the cases most likely to trigger C-style buffer and arithmetic bugs.

---

## Review Questions

1. What is the difference between `ASSERT_EQ` and `EXPECT_EQ` in Google Test? When would you choose one over the other?
2. A buffer overflow in a C program does not crash immediately but corrupts the heap, causing a crash 100 lines later. How would you use ASan to find the actual overflow rather than the downstream crash?
3. Valgrind reports "Conditional jump depends on uninitialised value." What code pattern causes this, and why is it dangerous even if the condition happens to evaluate correctly?
4. Explain the difference between a test fixture (`TEST_F`) and a standalone test (`TEST`). When do you need a fixture?

---

#C #Cpp
