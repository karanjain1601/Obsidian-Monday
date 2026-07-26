# Competitive Programming: Introduction to All Topics

This document is a guided tour of the 9 sections in the competitive programming notes library — a structured reference for engineers and students mastering algorithms, data structures, and problem-solving patterns for coding interviews and competitive programming contests.

---

## 01. Foundations

The mathematical and algorithmic bedrock. Start here to build the reasoning tools used throughout every other section.

**What's covered:**
- **Complexity Analysis** — Big-O, Omega, and Theta notation; the complexity hierarchy from O(1) to O(n!); rules for combining complexities (sequential adds, nested loops multiply); amortized analysis (dynamic array resizing); space complexity; worst/average/best cases; Python-specific cost pitfalls (string concatenation O(n²), slice costs, `in` on lists vs sets).
- **Math Basics** — GCD and LCM via the Euclidean algorithm and extended Euclid (Bezout coefficients); modular arithmetic (add/multiply mod m, subtraction pitfalls); fast (binary) exponentiation in O(log n); modular inverse via Fermat's Little Theorem; primality testing in O(√n); Sieve of Eratosthenes; logarithm identities; arithmetic and geometric series.
- **Recursion** — Base cases and recursive cases; the call stack and Python's recursion limit; recurrence relations; naive vs. memoized Fibonacci; Tower of Hanoi; recursion vs. iteration trade-offs; tail recursion; converting recursion to an explicit stack; the accumulator pattern.
- **Bit Manipulation** — AND, OR, XOR, NOT, left/right shift operators; essential bit tricks (check/set/clear/toggle a bit, isolate lowest set bit with `x & -x`, drop lowest set bit with `x & (x-1)`); popcount via Brian Kernighan; power-of-two check; XOR properties (find single number, swap without temp); bitmask subset enumeration and submask iteration in O(3^n); Python-specific pitfalls.

---

## 02. Basic Data Structures

The core containers that every algorithm builds on — their internals, complexities, and key patterns.

**What's covered:**
- **Arrays** — O(1) random access; Python list as a dynamic array; in-place reversal (two pointers); array rotation with the reversal trick; Kadane's algorithm for maximum subarray sum; prefix sums for O(1) range queries; 2D array construction pitfall (shared-reference bug); Dutch National Flag three-way partition; spiral matrix traversal.
- **Strings** — Immutability and the concatenation trap (O(n²) vs O(n) join); frequency counting with Counter and a 26-element array; palindrome check with two pointers; longest palindromic substring via expand-around-center; KMP/Rabin-Karp/Z-algorithm matching preview; building strings efficiently with StringIO.
- **Linked Lists** — Node structure; comparison vs. arrays; iterative and recursive reversal; Floyd's cycle detection (tortoise and hare) and finding cycle start; finding the middle; merging two sorted lists; doubly linked lists; LRU cache design (doubly linked list + hash map).
- **Stacks** — LIFO model; Python list as stack; balanced parentheses; RPN expression evaluation; iterative DFS; monotonic stack for next greater/smaller element in O(n); largest rectangle in histogram; Min Stack design; infix to postfix (Shunting Yard).
- **Queues** — FIFO model; `collections.deque` for O(1) both-ends operations; circular queue with modular arithmetic; BFS as the killer application; monotonic deque for sliding window maximum in O(n); queue vs. stack comparison.
- **Hashing** — Hash function and bucket index; O(1) average insert/lookup/delete; collision handling by chaining and open addressing; load factor and resizing; Two Sum (complement lookup); Counter; defaultdict grouping; hashable vs. unhashable types; polynomial rolling hash; subarray sum equals K using prefix-sum + hash map.

---

## 03. Searching and Sorting

The algorithms most likely to appear as building blocks inside a larger solution.

**What's covered:**
- **Searching** — Linear search O(n); binary search O(log n) with invariant explanation; lower-bound and upper-bound variants; Python's `bisect` module; ternary search for unimodal functions; search in a rotated sorted array; three binary search templates and when to use each.
- **Sorting** — Comparison table for all major algorithms (bubble, insertion, selection, merge, quick, heap, counting, radix) with time/space/stability; O(n log n) comparison lower bound; merge sort and quicksort with recurrence analysis; counting sort for small-integer ranges; radix sort (least-significant digit first); Python's Timsort; `key=` and `cmp_to_key` usage; Lomuto partition.
- **Binary Search — Advanced** — Monotonic feasibility condition; minimize-x and maximize-x templates with the `+1` bias trick to avoid infinite loops; worked examples: Koko eating bananas, split-array largest sum, ship packages; real-valued bisection for sqrt; recognizing "binary search on the answer" problems (minimize the max, maximize the min).

---

## 04. Advanced Data Structures

Specialized containers that unlock solutions impossible with basic structures.

**What's covered:**
- **Trees** — Terminology (root, leaf, height, depth, subtree, binary tree); preorder/inorder/postorder DFS (recursive and iterative); level-order BFS; height and balance check; tree diameter; lowest common ancestor; serialize/deserialize with preorder + null markers; Morris inorder traversal in O(1) space.
- **Binary Search Trees** — BST ordering invariant; search, insert, delete (three cases); inorder traversal produces sorted output; BST validation with bounds; k-th smallest via iterative inorder; AVL rotation code (four imbalance cases); BST iterator with O(1) amortized next(); `sortedcontainers.SortedList` as a practical alternative.
- **Heaps** — Min-heap property; complete binary tree stored as array with index formulas; sift-up and sift-down; heapify in O(n); Python `heapq` usage; max-heap negation trick; top-K elements with a size-k min-heap; merge K sorted lists; running median with two heaps; lazy deletion.
- **Tries** — Trie node (children dict + is_word flag); insert/search/starts_with in O(L); wildcard search with DFS; autocomplete via subtree DFS; XOR trie (binary trie) for maximizing XOR in O(n × bits); trie deletion with pruning; counting trie for prefix counts.
- **Segment Trees** — O(log n) range query and point update; recursive implementation with 4n storage; three overlap cases (none/full/partial); configurable merge for sum/min/max/GCD; lazy propagation for range updates in O(log n); iterative 2n segment tree; range assignment with tagged lazy.
- **Fenwick Tree / BIT** — Lowest-set-bit mechanics (`i & -i`); update and query loops; O(n) build; inversion counting with coordinate compression; 2D Fenwick tree; range-update with point-query via difference BIT; k-th element via binary lifting on BIT.
- **Disjoint Set Union (Union-Find)** — Path compression and union by rank/size; O(m α(n)) combined complexity; cycle detection in undirected graphs; counting connected components; Kruskal's MST preview; DSU on grids; weighted DSU for relation queries; DSU with rollback.

---

## 05. Algorithmic Paradigms

General problem-solving strategies that cut across data structures — the patterns you reach for when the structure of the solution is the insight.

**What's covered:**
- **Two Pointers** — Converging (both ends) and fast/slow (same direction) flavors; two sum on sorted array; container with most water; remove duplicates in-place; 3Sum with deduplication; trapping rain water; when to use converging vs. same-direction.
- **Sliding Window** — Fixed-size window (turning O(nk) into O(n)); variable-size window template (expand right, shrink left while invalid); longest substring without repeating characters; minimum window substring; "exactly k = atMost(k) − atMost(k−1)" trick.
- **Prefix Sums** — 1D prefix array for O(1) range sum; subarray-sum-equals-k with hash map in O(n); difference arrays for O(1) range updates; 2D prefix sums with inclusion-exclusion; prefix over XOR and other associative operations.
- **Greedy** — Greedy choice property and optimal substructure; exchange argument proof technique; activity selection / interval scheduling (earliest finish first); fractional knapsack; Huffman coding with a min-heap; jump game; greedy traps and how to verify correctness before committing.
- **Divide and Conquer** — Three steps (divide, conquer, combine); Master Theorem with case table (binary search, merge sort, Karatsuba, Strassen); counting inversions; maximum subarray via D&C; closest pair of points (strip check); D&C vs. DP (independent vs. overlapping subproblems); quickselect for k-th smallest in O(n) average.
- **Backtracking** — Choose → explore → un-choose rhythm; general template; subsets/power set; permutations with dedup; N-Queens with column/diagonal sets; Sudoku solver; pruning techniques (feasibility, bounding, ordering, symmetry breaking, memoization); most-constrained-variable heuristic.

---

## 06. Graphs

The most versatile problem domain in competitive programming — almost any network, dependency, or spatial problem maps to a graph.

**What's covered:**
- **Graph Basics** — Terminology (vertex, edge, degree, path, cycle, component); graph types (directed/undirected, weighted/unweighted, DAG, sparse/dense); adjacency list vs. adjacency matrix vs. edge list; grids as implicit graphs; bipartite, tree, complete, Eulerian, and planar graph properties; representation selection guide.
- **BFS and DFS** — BFS with queue (O(V+E), shortest paths in unweighted graphs, mark visited on enqueue); DFS recursive and iterative; use-case comparison table; connected components; cycle detection (undirected: parent tracking; directed: three-color WHITE/GRAY/BLACK); bipartite check via 2-coloring; multi-source BFS; DFS edge classification.
- **Topological Sort** — Only valid for DAGs; Kahn's algorithm (BFS on in-degrees, cycle detection if output < n); DFS-based (reversed post-order); course schedule application; uniqueness condition; DP on a DAG via topological order; counting paths in a DAG.
- **Shortest Paths** — Algorithm selection flowchart (BFS → 0-1 BFS → Dijkstra → Bellman-Ford → Floyd-Warshall); Dijkstra with min-heap and stale-entry skip; 0-1 BFS with deque; Bellman-Ford with V-1 relaxations and negative-cycle detection; Floyd-Warshall all-pairs O(V³); path reconstruction via parent array.
- **Minimum Spanning Tree** — Cut property (why greedy is safe); Kruskal's (sort edges + DSU) O(E log E) for sparse graphs; Prim's (min-heap) O(E log V) for dense graphs; MST properties (uniqueness, max spanning tree by negation, cycle property).
- **Advanced Graphs** — Strongly Connected Components via Kosaraju's two-DFS-pass and Tarjan's single-DFS with low-link values; LCA via binary lifting (preprocess O(n log n), query O(log n)); network flow (max-flow = min-cut) via Edmonds-Karp BFS O(VE²); articulation points and bridges; mentions of Heavy-Light Decomposition, Euler tour, bipartite matching, and 2-SAT.

---

## 07. Dynamic Programming

The discipline of recognizing when a problem has optimal substructure and overlapping subproblems, and converting that into a table or memo.

**What's covered:**
- **DP Fundamentals** — Optimal substructure + overlapping subproblems as the two DP ingredients; top-down (memoization with `lru_cache`) vs. bottom-up (tabulation) vs. space-optimized rolling variables; 5-step framework (define state → transition → base cases → iteration order → read answer); climbing stairs and house robber worked examples; state identification guide; memoization vs. tabulation decision flowchart.
- **Classic DP Problems** — 0/1 knapsack (downward capacity loop prevents reuse); unbounded knapsack (upward loop); coin change (minimum coins and count ways — loop order encodes combinations vs. permutations); LIS in O(n²) and O(n log n) with patience sorting; LCS; edit distance (Levenshtein); subset sum / partition equal; pattern recognition cheat sheet.
- **DP on Grids** — Grid DP template (state = cell, transition from above/left); unique paths and closed-form C(m+n-2, m-1); unique paths with obstacles; minimum path sum; rolling-row space optimization; maximal square (min of three neighbors); longest increasing path with DFS + memo; reverse DP (Dungeon Game: fill from goal backward).
- **DP on Trees** — Post-order DFS as the core model; subtree size; tree diameter; House Robber III (include/exclude pair pattern); rerooting / in-out DP for computing answer at every root in O(n); down pass (subtree info) + up pass (parent/sibling info) with rerooting recurrence; counting colorings.
- **Advanced DP** — Bitmask DP: TSP in O(2^n × n²), assignment problem, submask enumeration in O(3^n); digit DP with tight/leading-zero flags; interval DP (matrix chain multiplication O(n³), longest palindromic subsequence); DP optimization table (prefix sum, monotonic deque, Convex Hull Trick, Divide & Conquer DP, Knuth's optimization).

---

## 08. Advanced Topics

Specialized mathematical and algorithmic techniques that appear in harder competitive programming problems and advanced system design.

**What's covered:**
- **Number Theory** — Modular exponentiation; Sieve of Eratosthenes with bytearray; Smallest Prime Factor (SPF) sieve for O(log x) factorization; modular inverse via Fermat's Little Theorem and extended Euclidean algorithm; Euler's totient φ(n) and totient sieve; Chinese Remainder Theorem (pairwise coprime moduli); precomputed factorials + inverse factorials for O(1) nCr; Miller-Rabin deterministic primality test for 64-bit integers; linear sieve O(n).
- **Combinatorics** — Permutations and combinations; Pascal's triangle and Pascal's recurrence; nCr mod prime with precomputed factorial inverses; stars and bars; inclusion-exclusion principle with bitmask implementation; Catalan numbers (formula, recurrence, what they count: trees, parentheses, triangulations); derangements; Lucas' theorem for nCr mod small prime; Burnside's lemma for counting up to symmetry.
- **String Algorithms** — Naive search O(nm); KMP (failure function/LPS array construction + search in O(n+m)); Z-algorithm (Z-array, Z-box window reuse, pattern matching via concatenation with separator); Rabin-Karp (rolling hash, always verify hits to avoid false positives); polynomial string hashing for O(1) substring comparison; Manacher's algorithm for all palindromes in O(n); suffix array (naive build, preview of SA-IS / prefix doubling).
- **Computational Geometry** — Dot product (angle indicator) and cross product (2D scalar); orientation function (CCW/CW/collinear) as the workhorse; Euclidean distance with preference for squared to stay exact; segment intersection using four orientations; polygon area via shoelace formula; convex hull via Andrew's monotone chain O(n log n); point-in-polygon via ray casting; rotating calipers for farthest pair; integer arithmetic recommendations.

---

## 09. Competitive Programming Practice

The meta-layer — how to practice effectively, recognize patterns under pressure, and convert problem statements into solutions.

**What's covered:**
- **Getting Started** — The CP workflow (read constraints → infer complexity → pick pattern → code → test → submit → debug); constraint-to-complexity cheat table (n ≤ 10 means O(n!), up to n ≤ 10^18 means O(log n)); fast I/O with `sys.stdin.readline` and buffer-read-all; output buffering; Python-specific tools (deque, heapq, SortedList, Counter, `lru_cache`, bisect); reusable contest template; debugging guide (WA/TLE/RE/MLE causes); stress testing setup.
- **Problem Patterns** — The recognition mindset (extract keywords → match pattern → recall template → adapt); keyword-to-pattern lookup table covering 18+ patterns (sliding window, binary search on answer, graph modeling, DP, greedy, heaps, tries, segment trees, backtracking, bitmask DP); pattern deep-dives with code templates; meet-in-the-middle technique (split n ≤ 40 into two 2^(n/2) halves); coordinate compression; two-pass prefix-suffix technique; time budget calculator table.
- **Practice Roadmap** — 5-phase study plan: Phase 1 fundamentals weeks 1–3 (50 easy problems); Phase 2 core patterns weeks 4–8 (100 medium); Phase 3 graphs & trees weeks 9–12; Phase 4 DP weeks 13–18 (80 DP problems); Phase 5 advanced topics & contests week 19+; curated resources (CSES, Codeforces, AtCoder, LeetCode 150/Blind 75, NeetCode); sustainable weekly schedule (2–3 problems/day + one timed contest/week + upsolve Sunday); Codeforces rating milestones (Newbie through Candidate Master); mindset and anti-burnout tips.

---

## Section Map at a Glance

| Section | Topics | Difficulty Range |
|---------|--------|-----------------|
| 01 Foundations | Complexity, Math, Recursion, Bit Manipulation | Beginner – Intermediate |
| 02 Basic Data Structures | Arrays, Strings, Linked Lists, Stacks, Queues, Hashing | Beginner – Intermediate |
| 03 Searching and Sorting | Linear/Binary Search, All Sorting Algorithms, Binary Search on Answer | Beginner – Intermediate |
| 04 Advanced Data Structures | Trees, BST, Heaps, Tries, Segment Trees, Fenwick Tree, DSU | Intermediate – Advanced |
| 05 Algorithmic Paradigms | Two Pointers, Sliding Window, Prefix Sums, Greedy, D&C, Backtracking | Beginner – Intermediate |
| 06 Graphs | Graph Basics, BFS/DFS, Topological Sort, Shortest Paths, MST, SCC/Flow | Beginner – Advanced |
| 07 Dynamic Programming | Fundamentals, Classic Problems, Grids, Trees, Bitmask/Digit/Interval DP | Intermediate – Advanced |
| 08 Advanced Topics | Number Theory, Combinatorics, String Algorithms, Computational Geometry | Advanced |
| 09 CP Practice | Getting Started, Problem Patterns, Practice Roadmap | Beginner – Advanced |

---

## How to Navigate This Knowledge Base

**If you're starting from scratch:**
`01 Foundations` → `02 Basic Data Structures` → `03 Searching and Sorting` → `05 Algorithmic Paradigms`

**If you're preparing for coding interviews (LeetCode / Blind 75 style):**
`02 Basic Data Structures` → `05 Algorithmic Paradigms` → `06 Graphs` → `07 Dynamic Programming`

**If you're targeting competitive programming contests (Codeforces / CSES):**
Follow the 5-phase roadmap in `09 CP Practice → Practice Roadmap`, which sequences all sections in dependency order.

**If you need a specific technique fast:**
Use `09 CP Practice → Problem Patterns` — the keyword-to-pattern lookup table maps problem signals (e.g., "k distinct", "shortest path", "all subsets") directly to the relevant section and code template.

**If you're working on a specific topic:**
Each section is self-contained with complexity analysis, worked examples, Python implementations, and an interactive visualizer. Advanced sections (04, 06, 07, 08) assume you are comfortable with everything in the preceding sections.
