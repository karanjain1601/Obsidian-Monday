---
title: Sieve of Eratosthenes
aliases: [Prime Sieve, Sieve, Linear Sieve, SPF Sieve, Segmented Sieve]
tags: [DSA, CompetitiveProgramming, Sieve, Primes, NumberTheory]
domain: DSA
difficulty: Intermediate
created: 2026-07-26
related: [Number_Theory, Modular_Arithmetic]
status: complete
---

# 🔭 Sieve of Eratosthenes

> [!abstract] TL;DR
> The Sieve of Eratosthenes generates all primes up to n in O(n log log n) time and O(n) memory by iteratively marking multiples of each prime composite. The Smallest Prime Factor (SPF) sieve is a powerful extension: it enables any number ≤ n to be fully factorized in O(log n) time after an O(n) precomputation. Linear and segmented variants handle edge cases.

## Intuition — analogy FIRST

Imagine a whiteboard with every integer from 2 to 100 written in chalk. You circle 2 (the first prime) and immediately cross out all its multiples: 4, 6, 8, ... Then you circle the next un-crossed number (3) and cross out all its multiples: 9, 15, 21, ... (6, 12, ... were already crossed). Repeat until no uncrossed composites remain.

The key insight that makes this efficient: you don't have to start crossing out multiples of p from 2p — you can start from p² because every smaller multiple of p (i.e., kp for k < p) already has a prime factor smaller than p and was crossed out earlier. This starting-from-p² optimization is responsible for the O(n log log n) complexity.

## How It Works — full explanation + mermaid

### Basic Sieve

1. Create a boolean array `is_prime[0..n]`, initialize all to True
2. Set `is_prime[0] = is_prime[1] = False`
3. For each p from 2 to √n:
   - If `is_prime[p]`: mark `p², p²+p, p²+2p, ...` as False
4. All remaining True entries are prime

### Smallest Prime Factor (SPF) Sieve

Instead of a boolean, store `spf[i]` = the smallest prime that divides i.

- `spf[i]` starts as i (every number is "prime until proven composite")
- When marking multiples of prime p: if `spf[p*k]` is still `p*k` (i.e., not yet updated), set `spf[p*k] = p`

After this, factorize any n in O(log n):
```
while n > 1:
    record spf[n]
    n //= spf[n]
```

### Linear Sieve

The basic sieve is O(n log log n) because composite numbers get marked multiple times (once per prime factor). The linear sieve marks each composite exactly once by only marking `p * composites[i]` when p ≤ spf[composites[i]]:

```
for i from 2 to n:
    if i is not marked: add i to primes list
    for each prime p in primes (while p*i <= n and p <= spf[i]):
        mark p*i; spf[p*i] = p
```

This is O(n) but slightly more complex to implement.

### Segmented Sieve

For primes in range [L, R] where R can be up to 10^12 but R − L ≤ 10^6:
1. Find all primes up to √R using the basic sieve (√(10^12) = 10^6)
2. Create a local boolean array of size R − L + 1
3. For each prime p ≤ √R, mark its multiples in [L, R]

Memory: O(√R) for small primes + O(R − L) for the segment.

### Euler's Totient Sieve

Compute φ(i) for all i ≤ n simultaneously:

```
phi[i] = i for all i
for p = 2 to n:
    if phi[p] == p (p is prime):
        for k = p, 2p, 3p, ... <= n:
            phi[k] -= phi[k] // p
```

This applies the formula $\varphi(n) = n \prod_{p|n}(1 - 1/p)$ factor by factor.

```mermaid
flowchart TD
    A["Initialize: is_prime[0..n] = True\nis_prime[0] = is_prime[1] = False"] --> B["p = 2"]
    B --> C{p * p <= n?}
    C -->|No| D["Collect all True indices as primes"]
    C -->|Yes| E{is_prime[p]?}
    E -->|No| F["p += 1\n(skip composite)"]
    E -->|Yes| G["Mark p*p, p*p+p, p*p+2p, ... as False\n(start from p^2, not 2p)"]
    G --> F
    F --> C
    D --> H["Done: all primes up to n"]

    subgraph SPF_Sieve["SPF Sieve Extension"]
        I["spf[i] = i for all i"]
        J["For each prime p:\n  for k = p, 2p, ..., n:\n    if spf[k] == k: spf[k] = p"]
        K["Factorize n in O(log n):\n  while n > 1: record spf[n]; n //= spf[n]"]
        I --> J --> K
    end
```

## The Math

**Time complexity of basic sieve**: The number of operations is:
$$\sum_{\text{prime } p \leq n} \frac{n}{p} \approx n \sum_{\text{prime } p \leq n} \frac{1}{p} = n \cdot O(\log \log n)$$

The sum of reciprocals of primes up to n grows as $\ln \ln n$ (by Mertens' theorem), giving the O(n log log n) bound.

**Starting from p²**: All composites kp for k < p have a prime factor q ≤ k < p. Since q < p, kp was already marked when we processed prime q. So starting from p² wastes no steps.

**SPF factorization correctness**: `spf[n]` is the smallest prime dividing n. After dividing out spf[n], the remaining number is n/spf[n], and we repeat. Since we divide by the smallest prime each time, the sequence of recorded primes is non-decreasing, giving a valid factorization.

**Linear sieve — each composite marked once**: Composite number $c = p \times m$ is marked exactly once, when i = m and p = spf[c] (the smallest prime factor of c). For any other prime q < spf[c], we would have q ≤ spf[m] (by the loop condition), meaning q × m = c' ≠ c, so c is not marked again.

**Density of primes**: By the Prime Number Theorem, the number of primes up to n is approximately $n / \ln n$. So for $n = 10^6$, there are roughly 78,498 primes.

## Template Code

```python
# ─── Basic Sieve of Eratosthenes ───────────────────────────────────
def sieve(n: int) -> list[bool]:
    """is_prime[i] = True if i is prime. O(n log log n)."""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False
        p += 1
    return is_prime

def get_primes(n: int) -> list[int]:
    """Returns list of all primes up to n."""
    is_prime = sieve(n)
    return [i for i in range(2, n + 1) if is_prime[i]]

# ─── Smallest Prime Factor Sieve ───────────────────────────────────
def spf_sieve(n: int) -> list[int]:
    """
    spf[i] = smallest prime factor of i.
    spf[1] = 1 (convention).
    O(n log log n) time, O(n) space.
    """
    spf = list(range(n + 1))   # spf[i] = i initially (assume each is its own smallest factor)
    p = 2
    while p * p <= n:
        if spf[p] == p:        # p is prime
            for multiple in range(p * p, n + 1, p):
                if spf[multiple] == multiple:  # not yet updated
                    spf[multiple] = p
        p += 1
    return spf

def factorize_with_spf(n: int, spf: list[int]) -> dict[int, int]:
    """
    Factorize n using precomputed SPF table. O(log n).
    Returns {prime: exponent}.
    """
    factors: dict[int, int] = {}
    while n > 1:
        p = spf[n]
        while n % p == 0:
            factors[p] = factors.get(p, 0) + 1
            n //= p
    return factors

# ─── Segmented Sieve ───────────────────────────────────────────────
def segmented_sieve(lo: int, hi: int) -> list[int]:
    """
    Returns all primes in [lo, hi].
    Useful when hi can be up to 10^12 but hi - lo <= 10^6.
    Memory: O(sqrt(hi) + hi - lo).
    """
    from math import isqrt
    limit = isqrt(hi)
    small_primes = get_primes(limit)

    # Local sieve for [lo, hi]
    is_prime_seg = [True] * (hi - lo + 1)
    if lo == 1:
        is_prime_seg[0] = False   # 1 is not prime
    if lo == 0:
        is_prime_seg[0] = is_prime_seg[1] = False

    for p in small_primes:
        # First multiple of p in [lo, hi]
        start = max(p * p, ((lo + p - 1) // p) * p)
        for multiple in range(start, hi + 1, p):
            if multiple != p:
                is_prime_seg[multiple - lo] = False

    return [lo + i for i in range(hi - lo + 1) if is_prime_seg[i] and lo + i >= 2]

# ─── Euler's Totient Sieve ─────────────────────────────────────────
def totient_sieve(n: int) -> list[int]:
    """
    phi[i] = Euler's totient of i, for all i in [0, n].
    O(n log log n).
    """
    phi = list(range(n + 1))
    for p in range(2, n + 1):
        if phi[p] == p:           # p is prime
            for k in range(p, n + 1, p):
                phi[k] -= phi[k] // p
    return phi

# ─── Count divisors sieve ──────────────────────────────────────────
def count_divisors_sieve(n: int) -> list[int]:
    """
    num_divisors[i] = number of divisors of i, for all i in [1, n].
    O(n log n).
    """
    num_div = [0] * (n + 1)
    for d in range(1, n + 1):
        for multiple in range(d, n + 1, d):
            num_div[multiple] += 1
    return num_div
```

## Worked Example — trace through a real problem

**Sieve of Eratosthenes up to n = 20**:

```
Initial: [F, F, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20

p=2: mark 4,6,8,10,12,14,16,18,20
     [F, F, T, T, F, T, F, T, F, T,  F, T,  F, T,  F, T,  F, T,  F, T,  F]

p=3: mark 9,15 (9 is first un-marked multiple from 3²=9; 6,12,18 already F)
     [F, F, T, T, F, T, F, T, F, F,  F, T,  F, T,  F, F,  F, T,  F, T,  F]

p=4: 4² = 16 > 20? No. But is_prime[4] = False → skip

p=5: p² = 25 > 20 → stop loop

Primes: 2, 3, 5, 7, 11, 13, 17, 19
```

**SPF trace for n = 12**:

```
Initial spf: [0,1,2,3,4,5,6,7,8,9,10,11,12]

p=2: spf[2]=2 (prime). Mark composites starting at 4:
     spf[4]=2, spf[6]=2, spf[8]=2, spf[10]=2, spf[12]=2

p=3: spf[3]=3 (prime). Mark starting at 9:
     spf[9]=3  (9 still has spf[9]=9 → update to 3)
     spf[12]: already spf[12]=2 → skip

Final spf: [0,1,2,3,2,5,2,7,2,3,2,11,2]

Factorize 12: spf[12]=2 → 12/2=6; spf[6]=2 → 6/2=3; spf[3]=3 → 3/3=1
Result: {2:2, 3:1} → 12 = 2² × 3 ✓
```

## CP Problem Patterns

| Problem | Sieve application |
|---|---|
| Count primes ≤ n | Basic sieve, count True entries |
| Is n prime? (n ≤ 10^6, many queries) | Precompute sieve, O(1) per query |
| Prime factorization (many queries) | SPF sieve + O(log n) factorization |
| Sum of φ(i) for i=1..n | Totient sieve |
| Primes in range [L, R] (R up to 10^12) | Segmented sieve |
| Count numbers in [1,n] with exactly k distinct prime factors | SPF sieve + DP |
| Goldbach conjecture verification | Sieve + check n-p is prime |

## Common Pitfalls & Edge Cases

- **Forgetting to start marking from p²**: Starting from 2p is correct but slower; the key optimization is starting from p².
- **p² integer overflow in C++**: If p is `int` and p ≈ 46341, then `p*p` overflows 32-bit int. Use `(long long)p * p <= n` or cast p to `long long` before squaring.
- **Segmented sieve with lo=1**: 1 is not prime; explicitly mark `is_prime_seg[0] = False` when lo=1.
- **SPF of prime p**: `spf[p] = p` by convention. The factorize loop `while n > 1: n //= spf[n]` terminates correctly.
- **Totient of 1**: φ(1) = 1. The sieve initializes `phi[1] = 1` and no prime divides 1, so it stays 1.
- **Memory for n = 10^7**: A `bool` array of 10^7 = 10 MB (fine). Using `int` or `long long` for spf at 10^7 = 40 MB or 80 MB — watch the limit.
- **Segmented sieve: small primes only go up to √hi**: Composite numbers in [lo, hi] all have a prime factor ≤ √hi. Do not forget to handle the case where lo itself is prime (it won't be marked by any small prime's multiple).

## Related Concepts

- [[_MOC_Competitive_Programming|↑ Section MOC]]
- [[Number_Theory]]
- [[Modular_Arithmetic]]
- [[Combinatorics]]

## Review Questions

1. The standard sieve starts marking multiples of p from p² rather than 2p. Explain precisely why every multiple kp for k < p has already been marked before we reach prime p in the outer loop.
2. Given the SPF sieve result `spf = [0,1,2,3,2,5,2,7,2,3,2,11,2]` for n=12, factorize 72 using repeated SPF lookups. How many steps does it take?
3. You need to find all prime pairs (p, p+2) (twin primes) up to n = 10^6. Describe the approach using the basic sieve and estimate the time and space complexity.

## Sources / Problems

- LeetCode: 204 (Count Primes), 2523 (Closest Prime Numbers in Range)
- Codeforces: problems tagged "sieve", "number theory"
- USACO: problems requiring prime counting or factorization
- CP-algorithms.com: "Sieve of Eratosthenes", "Linear Sieve", "Euler's Totient Function Sieve"
- "Competitive Programmer's Handbook" — Chapter 11
- Project Euler: 3 (Largest Prime Factor), 10 (Summation of Primes), 27 (Quadratic Primes)

#Sieve #PrimeSieve #SmallestPrimeFactor #SPF #LinearSieve #SegmentedSieve #EulerTotient #PrimeNumbers
