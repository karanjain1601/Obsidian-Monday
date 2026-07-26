---
title: Core and Stability
aliases: [Core, Bondareva-Shapley, Nucleolus, Balanced Games, Least Core]
tags: [Game_Theory, CooperativeGames, CoreStability]
domain: Game_Theory
difficulty: Intermediate
created: 2026-07-26
related: [Coalitional_Games_and_Shapley_Value, Bargaining_Theory, Power_Indices]
status: complete
---

# 🔒 Core and Stability

> [!abstract] TL;DR
> The **Core** of a TU game (N, v) is the set of payoff allocations x = (x₁, …, xₙ) satisfying efficiency Σxᵢ = v(N) and coalition rationality Σᵢ∈S xᵢ ≥ v(S) for all S ⊆ N — no coalition wants to break away. The **Bondareva-Shapley theorem** (1963): Core is non-empty iff the game is **balanced** (every balanced collection of coalitions satisfies the balancing condition on v). Convex games always have non-empty core; simple majority games often have empty core. When the core is empty, the **ε-core** (least core) and **nucleolus** (Schmeidler 1969, lexicographic minimization of excess) provide unique stable alternatives. The Shapley value lies in the core iff the game is convex.

---

## Intuition — analogy FIRST

Imagine **three cities** considering building a shared railway: City A (pop 1M), City B (pop 2M), City C (pop 3M). Building alone costs A=$100, B=$200, C=$300. Building any pair costs 20% less: AB=$240, AC=$320, BC=$400. All three together: $480.

An allocation of the shared cost ($480) is in the **core** if no city (or pair) would prefer to build separately. City B's share must satisfy xB ≤ $200 (B wouldn't pay more alone), xB ≥ $480 − $320 = $160 (if A and C build together, B must pay at most the remainder), etc. The core is the set of allocations surviving all these stability constraints.

If the core is empty — like in a symmetric majority voting game — there's no allocation that makes everyone happy. Someone always has an incentive to defect.

---

## How It Works

### The Core

**Definition**: For TU game (N, v), the **Core** C(v) is:

$$C(v) = \left\{ x \in \mathbb{R}^n : \sum_{i \in N} x_i = v(N) \text{ and } \sum_{i \in S} x_i \geq v(S) \; \forall S \subseteq N \right\}$$

**Components**:
- **Efficiency**: Total payoff = grand coalition value v(N)
- **Coalition rationality**: Every coalition S gets at least what it could achieve alone

**Blocking**: Coalition S **blocks** allocation x if Σᵢ∈S xᵢ < v(S) — the coalition prefers to break away and divide v(S) among themselves.

**Core = {allocations not blocked by any coalition}**

---

### Bondareva-Shapley Theorem (1963)

A game (N, v) has a non-empty core iff it is **balanced**.

**Balanced collection**: A collection B of subsets of N is balanced if there exist weights λS ≥ 0 for S ∈ B such that Σ_{S∈B: i∈S} λS = 1 for all i ∈ N. (Each player's weights sum to 1 — like fractional coalitions forming "full-time".)

**Balanced game**: For every balanced collection B with weights {λS}: Σ_{S∈B} λS v(S) ≤ v(N).

**Intuition**: If every way of "fractionally" forming coalitions (where each player contributes fractional time to each coalition) produces total value ≤ v(N), then the grand coalition is efficient and stable allocations exist.

**Proof direction**: If the game is unbalanced, there exists a fractional coalition structure worth more than v(N) → no efficient allocation can satisfy all coalitions. If balanced, LP duality shows feasibility of core constraints.

---

## Key Concepts / Details

### Convex Games and Core

**Convex game**: v(S∪T) + v(S∩T) ≥ v(S) + v(T) for all S, T ⊆ N.

**Theorem**: Every convex game has a non-empty core. Moreover, the Shapley value lies in the core for every convex game.

**Intuition**: Convexity means marginal contributions are increasing (the more players already in a coalition, the more valuable a new member is). This supermodularity implies no coalition can gain by leaving the grand coalition.

**Example**: Majority voting games are NOT convex → core often empty.

### Core of Majority Voting Game

**3-player majority game**: Any coalition of 2+ players wins. v({1,2}) = v({1,3}) = v({2,3}) = v({1,2,3}) = 1; v({1}) = v({2}) = v({3}) = 0.

**Core conditions**:
- x₁ + x₂ ≥ 1 (coalition {1,2})
- x₁ + x₃ ≥ 1 (coalition {1,3})
- x₂ + x₃ ≥ 1 (coalition {2,3})
- x₁ + x₂ + x₃ = 1 (efficiency)

Sum all three coalition constraints: 2(x₁+x₂+x₃) ≥ 3 → x₁+x₂+x₃ ≥ 3/2 > 1. **Contradiction!** → Core is empty.

**Implication**: In majority voting, there's always a blocking coalition — no stable outcome exists. This is related to Arrow's impossibility theorem.

### ε-Core and Least Core

**ε-Core** (Shapley-Shubik 1966): Relax coalition rationality by ε:
$$C_\varepsilon(v) = \left\{ x : \sum_i x_i = v(N), \sum_{i \in S} x_i \geq v(S) - \varepsilon |S| \; \forall S \right\}$$

As ε increases from 0, the ε-core grows. The **least core** is the minimum ε for which the ε-core is non-empty.

**Least core** = C_ε* where ε* = min ε s.t. C_ε ≠ ∅. This is a linear program!

### Nucleolus (Schmeidler 1969)

**Excess** of coalition S under allocation x: e(S, x) = v(S) − Σᵢ∈S xᵢ (how unhappy S is with x; negative = satisfied).

**Nucleolus**: The unique allocation that **lexicographically minimizes** the vector of excesses (sorted in decreasing order). It:
1. Minimizes the maximum excess (most unhappy coalition's dissatisfaction)
2. Subject to this, minimizes the second-largest excess
3. ... continues lexicographically

**Properties**:
- Always exists and is unique
- Always in the core (if core is non-empty)
- Always in the least core
- Satisfies efficiency, symmetry, covariance

**Computing nucleolus**: Solve a sequence of LPs. First LP minimizes maximum excess (finds ε*). Fix coalitions that achieve ε*, solve second LP, etc.

**Comparison**:

| Solution Concept | Uniqueness | Always Exists | In Core? | Fairness Axioms |
|-----------------|-----------|--------------|---------|----------------|
| Core | Set | No | — | Coalition rational |
| Shapley value | Yes | Yes | Only if convex | Efficiency, symmetry, dummy, additivity |
| Nucleolus | Yes | Yes | Yes (if core non-empty) | Leximin excess |

---

## Real-World Notes

- **Bankruptcy law**: Divide v(N) = asset value among creditors with claims. O'Neill's model (1982) uses nucleolus as principled allocation — parallels Talmud division rules
- **Cost allocation**: Airport runways, water networks — core allocation ensures no municipal coalition prefers to build independently
- **Spectrum auctions**: Auction packages of spectrum licenses; core-selecting auctions ensure stable assignment (Erdil-Klemperer 2010)
- **International coalitions**: Climate agreements, trade pacts — core stability means no subgroup of countries benefits from leaving
- **Platform economics**: Multi-sided markets — platform allocation of surplus must be in the "core" relative to bilateral deals

---

## Common Pitfalls

1. **Empty core is common** — Majority games, competitive markets with complementarities — many economically important games have empty cores. Always check Bondareva-Shapley condition before assuming stability.
2. **Core ≠ Shapley value** — The Shapley value may not be in the core (it is only for convex games). A stable allocation isn't necessarily fair, and a fair allocation isn't necessarily stable.
3. **Nucleolus computation** — The sequential LP approach can be numerically unstable for large games. Specialized algorithms (Megalidakis 2001) are more robust.
4. **Core is a set, not a point** — The core contains potentially many allocations. Further solution concepts (nucleolus, Shapley) are needed to select a unique point.

---

## Related Concepts

- [[_MOC_Cooperative_Games|↑ Cooperative Games MOC]]
- [[Coalitional_Games_and_Shapley_Value|Coalitional Games & Shapley Value]]
- [[Power_Indices|Power Indices]]
- [[Bargaining_Theory|Bargaining Theory]]
- [[../05_Mechanism_Design/Matching_Markets|Matching Markets]]

---

## Review Questions

1. Show that the 3-player glove game (v({L})=v({R})=0, v({L,L})=0, v({L,R})=1, v({L,L,R})=1 for N={L₁,L₂,R}) has a non-empty core. Characterize all core allocations.
2. Prove that every convex game has a non-empty core by showing the Shapley value satisfies all coalition rationality constraints.
3. Compute the nucleolus for the 3-player bankruptcy game with asset = 100 and claims c₁=60, c₂=80, c₃=100 using the sequential LP approach.

---

## Sources

- Bondareva, O.N. (1963) — "Some Applications of Linear Programming to the Theory of Cooperative Games"
- Shapley, L.S. (1967) — "On Balanced Sets and Cores," *Naval Research Logistics*
- Schmeidler, D. (1969) — "The Nucleolus of a Characteristic Function Game," *SIAM Journal*

#Game_Theory #CooperativeGames #CoreStability
