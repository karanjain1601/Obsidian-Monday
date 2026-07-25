---
title: Binary Search
aliases: [BinarySearch, Bisect, Half-Interval Search, Logarithmic Search]
tags: [DSA, Searching, BinarySearch, Arrays, Sorted]
domain: DSA
difficulty: Beginner
created: 2026-07-26
related: [Two_Pointers, Binary_Search_Patterns, Sorting_Overview]
status: complete
---

# 🔍 Binary Search

> [!abstract] TL;DR
> Binary Search finds a target in a **sorted** array in O(log n) by repeatedly halving the search space. Three templates cover every case: exact match, leftmost (lower bound), and rightmost (upper bound). The trickiest part is getting the loop invariant and boundary conditions right. Python's `bisect` module handles all three templates correctly.

---

## Intuition — Analogy First

Looking up a word in a dictionary: you don't start from page 1. You open to the **middle**, see if your word comes before or after that page, throw away the wrong half, and repeat with the surviving half. After just 20 splits, you've narrowed 1,000,000 entries down to 1.

Binary search works on any **sorted** sequence where you can compare a candidate value to the target and decide which half to keep. The key intuition: **every comparison eliminates half the search space**, giving O(log n).

---

## How It Works + Mermaid

### The Three Templates

**Template 1 — Exact Match:**
```
left = 0, right = n-1
while left <= right:
    mid = left + (right-left)//2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1
```

**Template 2 — Leftmost / Lower Bound (first index where arr[i] >= target):**
```
left = 0, right = n
while left < right:
    mid = (left+right)//2
    if arr[mid] < target: left = mid + 1
    else: right = mid
return left   # left == right, invariant: all indices < left have arr[i] < target
```

**Template 3 — Rightmost / Upper Bound (last index where arr[i] <= target):**
```
left = 0, right = n
while left < right:
    mid = (left+right)//2
    if arr[mid] <= target: left = mid + 1
    else: right = mid
return left - 1  # rightmost position where arr[i] <= target
```

**Why `left + (right - left) // 2` instead of `(left + right) // 2`?**
In languages with fixed-size integers (C++, Java), `left + right` can overflow when both are large. In Python, integers are arbitrary precision so this isn't strictly necessary — but it's a good habit and interviewers notice it.

```mermaid
graph TD
    Start([arr=[1,3,5,7,9,11], target=7]) --> Step1["left=0, right=5\nmid=2, arr[2]=5"]
    Step1 -->|"5 < 7 → left=mid+1=3"| Step2["left=3, right=5\nmid=4, arr[4]=9"]
    Step2 -->|"9 > 7 → right=mid-1=3"| Step3["left=3, right=3\nmid=3, arr[3]=7"]
    Step3 -->|"7 == 7 → FOUND idx=3"| Done([Return 3])
```

---

## Complexity Analysis

| Operation             | Time    | Space  | Notes                               |
|-----------------------|---------|--------|-------------------------------------|
| Binary Search         | O(log n)| O(1)   | Iterative implementation            |
| Binary Search (rec.)  | O(log n)| O(log n)| Recursive: O(log n) call stack     |
| bisect_left/right     | O(log n)| O(1)   | Python stdlib; C implementation     |
| Binary Search on Answer| O(log(range) * f(n)) | O(1) | f(n) = verification cost  |

---

## Implementation (Python)

```python
from typing import List, Optional
import bisect

# =========================================================
# TEMPLATE 1: Exact Match
# =========================================================
def binary_search_exact(arr: List[int], target: int) -> int:
    """Returns index of target, or -1 if not found."""
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1


# =========================================================
# TEMPLATE 2: Leftmost occurrence (lower_bound)
# Find first index where arr[i] >= target.
# =========================================================
def lower_bound(arr: List[int], target: int) -> int:
    """
    Returns leftmost index i where arr[i] >= target.
    If target > all elements, returns len(arr).
    Equivalent to bisect.bisect_left(arr, target).
    """
    left, right = 0, len(arr)  # right = n, not n-1!

    while left < right:           # strict <, not <=
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid           # could be the answer, don't exclude

    return left  # left == right


def find_first_occurrence(arr: List[int], target: int) -> int:
    """Find index of first occurrence of target, or -1."""
    idx = lower_bound(arr, target)
    if idx < len(arr) and arr[idx] == target:
        return idx
    return -1


# =========================================================
# TEMPLATE 3: Rightmost occurrence (upper_bound - 1)
# Find last index where arr[i] <= target.
# =========================================================
def upper_bound(arr: List[int], target: int) -> int:
    """
    Returns index PAST the last element <= target.
    To get the last element <= target: upper_bound(arr, target) - 1.
    Equivalent to bisect.bisect_right(arr, target).
    """
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid

    return left  # all elements at indices < left are <= target


def find_last_occurrence(arr: List[int], target: int) -> int:
    """Find index of last occurrence of target, or -1."""
    idx = upper_bound(arr, target) - 1
    if idx >= 0 and arr[idx] == target:
        return idx
    return -1


# =========================================================
# PYTHON BISECT MODULE
# =========================================================
arr = [1, 3, 3, 5, 7, 7, 7, 9]

# bisect_left: leftmost position to insert target (first >= target)
print(bisect.bisect_left(arr, 7))   # 4 (first 7)
print(bisect.bisect_left(arr, 6))   # 4 (where 6 would be inserted)

# bisect_right: rightmost position to insert target (first > target)
print(bisect.bisect_right(arr, 7))  # 7 (after last 7)

# Count occurrences of a value:
count = bisect.bisect_right(arr, 7) - bisect.bisect_left(arr, 7)  # 3

# Insert while maintaining sorted order:
bisect.insort(arr, 4)  # [1,3,3,4,5,7,7,7,9]


# =========================================================
# FIND FIRST AND LAST POSITION (LC 34)
# =========================================================
def searchRange(nums: List[int], target: int) -> List[int]:
    """Returns [first, last] index of target, or [-1,-1]."""
    first = bisect.bisect_left(nums, target)

    if first >= len(nums) or nums[first] != target:
        return [-1, -1]

    last = bisect.bisect_right(nums, target) - 1
    return [first, last]


# =========================================================
# SEARCH IN ROTATED SORTED ARRAY (LC 33)
# =========================================================
def search_rotated(nums: List[int], target: int) -> int:
    """
    Key insight: one half of a rotated array is always sorted.
    Identify which half is sorted, check if target falls in it.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1


# =========================================================
# SEARCH A 2D MATRIX (LC 74) — treat as 1D sorted array
# =========================================================
def searchMatrix(matrix: List[List[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1

    while left <= right:
        mid = (left + right) // 2
        val = matrix[mid // n][mid % n]  # convert 1D index to 2D
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1

    return False
```

---

## Dry Run / Example Trace

**Find First and Last Position of 7 in [1,3,3,5,7,7,7,9]:**

```
Lower bound (first 7):
  left=0, right=8
  mid=4, arr[4]=7: not < 7 → right=4
  left=0, right=4
  mid=2, arr[2]=3: 3 < 7 → left=3
  left=3, right=4
  mid=3, arr[3]=5: 5 < 7 → left=4
  left=4, right=4 → exit. arr[4]=7 ✓ → first = 4

Upper bound (past last 7):
  left=0, right=8
  mid=4, arr[4]=7: 7 <= 7 → left=5
  left=5, right=8
  mid=6, arr[6]=7: 7 <= 7 → left=7
  left=7, right=8
  mid=7, arr[7]=9: 9 > 7 → right=7
  left=7, right=7 → exit. last = 7-1 = 6

Result: [4, 6] ✓ (indices of first and last 7)
```

---

## Patterns & LeetCode Applications

| Problem                                 | LC #  | Template          | Key Insight                                     |
|-----------------------------------------|-------|-------------------|-------------------------------------------------|
| Binary Search                           | 704   | Exact match       | Textbook implementation                         |
| Find First and Last Position            | 34    | Lower + Upper     | Two binary searches                             |
| Search in Rotated Sorted Array          | 33    | Exact + half check| One half always sorted                          |
| Find Minimum in Rotated Sorted Array    | 153   | Upper bound       | Find pivot using BS                             |
| Search a 2D Matrix                      | 74    | Exact match       | Flatten 2D to 1D index                          |
| Guess Number Higher or Lower           | 374   | Exact match       | API-based binary search                         |
| Peak Index in Mountain Array            | 852   | Lower bound       | Find peak where arr[i]>arr[i+1]                 |
| Sqrt(x)                                 | 69    | Upper bound       | Find largest k where k² ≤ x                     |

---

## Common Pitfalls

1. **Off-by-one on `right` initialization:** Template 1 uses `right = n-1`; Templates 2 and 3 use `right = n`. Mixing these up breaks the invariant.
2. **Wrong loop condition:** Template 1: `left <= right`. Templates 2/3: `left < right`. Using `<=` in templates 2/3 causes infinite loop when `left == right`.
3. **Forgetting to check result validity:** Lower/upper bound always returns a valid index in [0, n] — but you must verify `arr[result] == target` for "find first/last occurrence."
4. **Integer overflow:** Not relevant in Python (arbitrary precision integers), but in Java/C++: use `left + (right - left) / 2`.
5. **Binary search on unsorted array:** BS requires a sorted (or at least monotonic) sequence. Apply sort first or verify monotonicity.
6. **Rotated array with duplicates (LC 81):** When `nums[left] == nums[mid]`, you can't determine which half is sorted — just increment `left`. This degrades to O(n) worst case.

---

## Related Concepts

- [[_MOC_Sorting_Searching|↑ Section MOC]]
- [[Two_Pointers]] — shares the "narrowing search space with two pointers" idea
- [[Binary_Search_Patterns]] — advanced: binary search on the answer space
- [[Sorting_Overview]] — prerequisite: BS requires sorted input

---

## Review Questions

1. **There are three distinct binary search templates (exact, leftmost, rightmost). What is the key difference in the loop condition and the update for `right` between Template 1 and Templates 2/3? Why does this difference matter?**
2. **`bisect.bisect_left(arr, x)` and `bisect.bisect_right(arr, x)` return different values when x appears multiple times. Explain the difference and give a formula using both to count the occurrences of x in arr.**
3. **In Search in Rotated Sorted Array (LC 33), why is it always possible to determine which half is sorted, and how do you use that to decide which half to recurse on?**

---

## Sources

- CLRS — Introduction to Algorithms, Ch. 2.1 (Insertion Sort includes BS motivation)
- [Python bisect module docs](https://docs.python.org/3/library/bisect.html)
- LeetCode #704, #34, #33, #74
- [LeetCode Binary Search Template](https://leetcode.com/discuss/study-guide/786126/)
- [NeetCode — Binary Search](https://neetcode.io)

#binarysearch #searching #sorted #bisect #lobound #upbound #templates
