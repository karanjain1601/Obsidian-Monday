---
title: CP Setup and Tools
aliases: [Competitive Programming Setup, CP Template, Fast IO]
tags: [DSA, CompetitiveProgramming, Setup, FastIO]
domain: DSA
difficulty: Beginner
created: 2026-07-26
related: [Time_Complexity_Classes, Bit_Manipulation]
status: complete
---

# ⚙️ CP Setup and Tools

> [!abstract] TL;DR
> Competitive programming demands speed at every layer: reading input fast, choosing the right algorithm from constraints, and avoiding classic traps like integer overflow. Master the workflow once and it becomes invisible, letting you focus on the actual problem.

## Intuition — analogy FIRST

Think of a CP contest like a surgical operation. The surgeon does not pick up a scalpel mid-procedure and read the manual — instruments are laid out and the procedure is rehearsed. Your CP template is the instrument tray: fast I/O, common imports, type aliases, and utility functions all pre-arranged so that when the clock starts, you write logic, not boilerplate.

The constraint analysis step is like reading the patient's chart before cutting: it tells you exactly how fast the algorithm needs to be before you design anything.

## How It Works — full explanation + mermaid

### Competitive Programming Workflow

1. **Read constraints first** — `n`, `m`, time limit, memory limit
2. **Map constraints to complexity** — 10^8 ops/sec is a safe ceiling for C++; Python is roughly 10–50x slower
3. **Design algorithm** targeting the required complexity
4. **Write using your template** — no time lost on boilerplate
5. **Test on examples + edge cases** — empty input, n=1, max n
6. **Submit → debug from verdict** — TLE → optimize, WA → logic error, MLE → reduce memory

### Constraint → Complexity Guide

| n (input size) | Required complexity | Algorithm class |
|---|---|---|
| n ≤ 10 | O(n!) | Brute force, permutations |
| n ≤ 20 | O(2^n) | Bitmask DP, subset enumeration |
| n ≤ 500 | O(n²) or O(n³) | DP, Floyd-Warshall |
| n ≤ 5,000 | O(n²) | DP, bubble sort |
| n ≤ 10^5 | O(n log n) | Sorting, segment tree, BFS/DFS |
| n ≤ 10^6 | O(n) or O(n log n) | Linear DP, sieve |
| n ≤ 10^9 | O(log n) or O(√n) | Binary search, math |

### Fast I/O

**Python**: `sys.stdin` bypasses the slow `input()` tokenizer. Reading all input at once and splitting is 5–10x faster for large inputs.

**C++**: `ios_base::sync_with_stdio(false)` unlinks C and C++ I/O buffers. `cin.tie(NULL)` prevents `cout` from flushing before every `cin`. Together they make `cin/cout` as fast as `scanf/printf`.

### Platform Overview

| Platform | Focus | Rating system | Key feature |
|---|---|---|---|
| Codeforces | Speed contests, Div 1–3 | ELO-style | Hack others' solutions |
| AtCoder | Math/algorithms, ABC–AGC | Color-based | Clean editorial quality |
| LeetCode | Interview prep | Contest rating | Massive problem bank |
| USACO | Olympiad training | Bronze–Platinum | 4-hour window, 3 problems |

### Memory Estimation

- 256 MB = ~256 × 10^6 bytes
- `int` = 4 bytes → ~64M integers
- `long long` = 8 bytes → ~32M integers
- `bool` = 1 byte → ~256M booleans
- Array of 10^6 `int`s = 4 MB (fine); 10^8 = 400 MB (MLE)

```mermaid
flowchart TD
    A[Read constraints: n, time, memory] --> B{n ≤ 20?}
    B -->|Yes| C[O(2^n) or O(n!) OK\nBitmask / Backtrack]
    B -->|No| D{n ≤ 500?}
    D -->|Yes| E[O(n^2) or O(n^3)\nDP / Graph]
    D -->|No| F{n ≤ 10^5?}
    F -->|Yes| G[O(n log n)\nSort / Segment Tree]
    F -->|No| H{n ≤ 10^6?}
    H -->|Yes| I[O(n) or O(n log n)\nLinear DP / Sieve]
    H -->|No| J[O(log n) or O(sqrt_n)\nBinary Search / Math]
    C --> K[Pick algorithm and template]
    E --> K
    G --> K
    I --> K
    J --> K
    K --> L{Memory OK?}
    L -->|Yes| M[Code + Test + Submit]
    L -->|No| N[Reduce memory usage\nor use rolling array]
    N --> M
```

## The Math

**Time budget**: `time_limit_sec × 10^8` gives the approximate op budget for C++. For Python, divide by 10–50.

**Integer overflow**: In C++, `int` holds up to $2^{31} - 1 \approx 2.1 \times 10^9$. Multiplying two `int`s near $10^9$ overflows. Rule:

$$a \times b \text{ where } a, b \leq 10^9 \Rightarrow \text{use } \texttt{long long}$$

`long long` holds up to $2^{63} - 1 \approx 9.2 \times 10^{18}$, safe for most CP problems. Python integers are arbitrary precision — no overflow ever.

**Memory**: A 1D array of `n` elements uses $4n$ bytes for `int`, $8n$ for `long long`. A 2D array `n × m` uses $4nm$ bytes.

## Template Code

### Python CP Template (fast I/O)

```python
import sys
import os
from collections import defaultdict, deque, Counter
from itertools import permutations, combinations, accumulate
from bisect import bisect_left, bisect_right
from heapq import heappush, heappop, heapify
from math import gcd, lcm, isqrt, inf, log2, ceil, floor
from functools import lru_cache, reduce
import threading

input = sys.stdin.readline   # Fast single-line input
def rline():  return input().split()
def rint():   return int(input())
def rints():  return list(map(int, input().split()))
def rstr():   return input().strip()

MOD = 10**9 + 7
INF = float('inf')

def solve():
    n = rint()
    a = rints()
    # --- your logic here ---

def main():
    T = rint()
    for _ in range(T):
        solve()

if __name__ == '__main__':
    # For deep recursion problems:
    # sys.setrecursionlimit(300000)
    # threading.stack_size(1 << 27)
    # thread = threading.Thread(target=main)
    # thread.start()
    main()
```

### C++ CP Template

```cpp
#include <bits/stdc++.h>
using namespace std;

// Type aliases
using ll  = long long;
using ull = unsigned long long;
using pii = pair<int,int>;
using pll = pair<ll,ll>;
using vi  = vector<int>;
using vll = vector<ll>;

// Constants
const ll  MOD = 1e9 + 7;
const ll  INF = 1e18;
const int INF32 = 2e9;

// Macros (use sparingly, but common in competitive settings)
#define all(x)  (x).begin(), (x).end()
#define sz(x)   (int)(x).size()
#define pb      push_back
#define fi      first
#define se      second
#define rep(i,a,b) for(int i=(a);i<(b);i++)

void solve() {
    int n;
    cin >> n;
    // --- your logic here ---
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // cout << fixed << setprecision(12);  // for floating point

    int t;
    cin >> t;
    while (t--) solve();
    return 0;
}
```

## Worked Example — trace through a real problem

**Problem**: Given n numbers, find if any two sum to a target. n ≤ 10^5.

**Constraint analysis**:
- n ≤ 10^5 → O(n log n) is fine, O(n²) may TLE
- Memory: one array of 10^5 ints = 400 KB, far under 256 MB

**Algorithm choice**: O(n) hash set (or sort + two-pointer O(n log n))

```python
def solve():
    n, target = rints()
    a = rints()
    seen = set()
    for x in a:
        if target - x in seen:
            print("YES")
            return
        seen.add(x)
    print("NO")
```

**Trace** for `n=4, target=9, a=[2,7,4,5]`:
- x=2: 7 not in {} → add 2
- x=7: 2 in {2} → print YES, return

## CP Problem Patterns

| Situation | Technique |
|---|---|
| TLE on O(n²) with n=10^5 | Sort + binary search, two pointers, hash map |
| Answer is huge, print mod p | Apply mod at every add/multiply step |
| Recursion depth > 1000 in Python | Set recursion limit or use iterative approach |
| Multiple test cases, shared precomputation | Precompute before the T loop |
| Input is large (10^6 lines) | Use `sys.stdin` in Python, fast I/O in C++ |

## Common Pitfalls & Edge Cases

- **Integer overflow in C++**: `int * int` overflows; cast to `(ll)a * b` before multiplying
- **Python TLE**: `input()` in a loop with 10^5 lines is slow; always use `sys.stdin.readline`
- **Off-by-one in 0/1 indexing**: be consistent; pick one and stick with it per problem
- **Modular arithmetic forgetting subtraction**: `(a - b) % MOD` can be negative in Python and C++; use `(a - b + MOD) % MOD`
- **Forgetting to reset global state** between test cases when using global arrays
- **Stack overflow in C++ DFS**: increase with `ulimit -s unlimited` locally, or use explicit stack
- **Uninitialized variables in C++**: `int dp[N]` has garbage values; always initialize
- **Reading extra whitespace**: `cin >> x` skips whitespace; `getline` does not

## Related Concepts

- [[_MOC_Competitive_Programming|↑ Section MOC]]
- [[Time_Complexity_Classes]]
- [[Bit_Manipulation]]
- [[Modular_Arithmetic]]
- [[Number_Theory]]

## Review Questions

1. Your C++ solution runs correctly locally but gets TLE on Codeforces. `n = 2 × 10^5` and your algorithm is O(n²). What is the minimum complexity you need, and name two data structures that can achieve it?
2. A problem asks you to print the answer modulo $10^9 + 7$. Your intermediate result is `a * b` where both `a` and `b` can be up to $10^9$. What goes wrong if you compute `(a * b) % MOD` using `int` in C++, and how do you fix it?
3. A Python solution TLEs with `n = 10^6` lines of input. You're using `input()` in a loop. What is the fix, and roughly how much faster is it?

## Sources / Problems

- Codeforces: Educational rounds (Div. 2 A/B problems for template practice)
- AtCoder: ABC contests problems A–C
- USACO Guide: [usaco.guide](https://usaco.guide) — Bronze section
- CP-algorithms.com: Input/Output optimization
- "Competitive Programmer's Handbook" — Antti Laaksonen (Chapter 1)

#CompetitiveProgramming #FastIO #CPTemplate #Setup #IntegerOverflow
