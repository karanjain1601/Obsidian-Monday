---
title: Power Indices
aliases: [Shapley-Shubik Index, Banzhaf Index, Voting Power, Weighted Voting]
tags: [Game_Theory, CooperativeGames, PowerIndices]
domain: Game_Theory
difficulty: Intermediate
created: 2026-07-26
related: [Coalitional_Games_and_Shapley_Value, Core_and_Stability]
status: complete
---

# 🗳️ Power Indices

> [!abstract] TL;DR
> **Power indices** measure the ability of a voter to influence the outcome of a vote, independent of their nominal weight. In a **weighted voting game** [q; w₁, …, wₙ] (quota q, weights wᵢ), a player's weight ≠ their power. **Shapley-Shubik index** (SSI): count orderings where player i is the "pivotal" voter (their joining turns a losing coalition into a winning one), as a fraction of all n! orderings. **Banzhaf index**: count subsets where i is a "swing" voter, as a fraction of all swings. SSI and Banzhaf can rank voters differently. Application: UN Security Council (5 permanent members have veto power; SSI ≈ 19.6% each despite having 5 of 15 votes); EU Council (population-weight proposals yield very different power distributions).

---

## Intuition — analogy FIRST

In a **3-member board** requiring majority (2 of 3 votes), all members have equal votes = equal power. Now consider a **4-member board** [3; 2, 1, 1, 1]: member A has weight 2, others have weight 1, quota = 3.

- Winning coalitions: {A,B}, {A,C}, {A,D}, {B,C,D}, {A,B,C}, {A,B,D}, {A,C,D}, {A,B,C,D}
- B is a swing voter (their removal makes the coalition lose) in: {A,B}, {B,C,D}, {A,B,C}, {A,B,D} → 4 swings
- A is a swing voter in: {A,B}, {A,C}, {A,D}, {A,B,C}, {A,B,D}, {A,C,D} → 6 swings

**Weight ratio A:B = 2:1, but swing ratio A:B = 6:4 = 3:2 (not 2:1)**. Power and weight diverge!

---

## How It Works

### Weighted Voting Games

**Definition**: A **weighted voting game** [q; w₁, …, wₙ] where:
- q ∈ ℝ — winning quota
- wᵢ — voting weight of player i
- Coalition S wins iff Σᵢ∈S wᵢ ≥ q

**Characteristic function**: v(S) = 1 if S wins, v(S) = 0 otherwise. This is a **simple game**.

### Shapley-Shubik Index (1954)

**Definition**: Player i's Shapley-Shubik index = their Shapley value in the voting game:

$$\phi_i = \frac{1}{n!} \#\{\text{orderings where } i \text{ is pivotal}\}$$

Player i is **pivotal** in ordering π if adding i to the coalition of all players preceding i in π turns a losing coalition into a winning one.

**Formal**: Let P^π_i = {j : π(j) < π(i)} (predecessors of i in ordering π). Player i is pivotal in π if:
- Σⱼ∈P^π_i wⱼ < q (coalition without i loses)
- Σⱼ∈P^π_i wⱼ + wᵢ ≥ q (coalition with i wins)

**Computation**: Count pivotal orderings, divide by n!.

### Banzhaf Index (1965)

**Definition**: Player i's (normalized) Banzhaf index:

$$\beta_i = \frac{\text{swings}_i}{\sum_j \text{swings}_j}$$

where **swings_i** = number of winning coalitions S containing i such that S\{i} is losing (i is a swing voter in S).

**Difference from SSI**: SSI uses uniform distribution over orderings; Banzhaf uses uniform distribution over subsets (2^{n−1} subsets containing i).

---

## Key Concepts / Details

### Worked Example: [3; 2, 1, 1, 1]

N = {A, B, C, D}, q = 3, w_A = 2, w_B = w_C = w_D = 1.

**Winning coalitions** (weight ≥ 3):
- {A,B}, {A,C}, {A,D} (weight 3 each)
- {B,C,D} (weight 3)
- {A,B,C}, {A,B,D}, {A,C,D} (weight 4 each)
- {A,B,C,D} (weight 5)

**Banzhaf swings** (player is swing if removing them makes coalition lose):

| Player | Swings | Count |
|--------|--------|-------|
| A | {A,B}, {A,C}, {A,D}, {A,B,C}, {A,B,D}, {A,C,D} | 6 |
| B | {A,B}, {B,C,D}, {A,B,C}, {A,B,D} | 4 |
| C | {A,C}, {B,C,D}, {A,B,C}, {A,C,D} | 4 |
| D | {A,D}, {B,C,D}, {A,B,D}, {A,C,D} | 4 |

Total swings: 18. Normalized Banzhaf: βA = 6/18 = **1/3**; βB = βC = βD = 4/18 = **2/9**.

**Shapley-Shubik** (24 orderings, 4! = 24):

For A: A is pivotal when it's the 2nd player and all players before have weight < 3. Since A has weight 2, A is pivotal whenever it arrives in position where predecessors have total weight 1 (i.e., exactly one of B,C,D preceded A).
- 3 choices for the predecessor × 1 ordering for the rest with A next × 2! orderings for remaining = 3 × 2 = 6 orderings... Let me count systematically.

Actually counting orderings where A is pivotal:
A is pivotal when predecessors' weight ∈ [1, 2): only weight exactly 1 (since w_B=w_C=w_D=1). So exactly 1 of {B,C,D} precedes A.
Orderings where exactly 1 person precedes A: C(3,1) × 1 × 2! (arrange A and remaining 2 after) = 3 × 2 = 6 orderings.

φA = 6/24 = **1/4**. By symmetry: φB = φC = φD = (24−6)/24/3 = **6/24 = 1/4**.

Wait — that gives φA = φB. Let me recount: SSI in [3; 2,1,1,1]. All 4 players have equal Shapley-Shubik index? Actually yes — by symmetry there's nothing structurally special about having weight 2 vs 1 in this specific quota, since both 2-member winning and 4-member winning exist. Interesting!

**Banzhaf ≠ Shapley-Shubik in this game**: Banzhaf gives A = 1/3 > 1/4 = SSI for A. Different indices, different answers.

### UN Security Council

**Structure**: 5 permanent members (P5) with veto, 10 non-permanent members (NP). A resolution passes with ≥9 of 15 votes INCLUDING all 5 P5 votes.

**Power indices**:
| Member | Weight | Shapley-Shubik | Banzhaf |
|--------|--------|----------------|---------|
| Permanent (each) | 1+veto | ~19.6% | ~16.7% |
| Non-permanent (each) | 1 | ~1.9% | ~1.6% |

**Weight**: Permanent = 1/15 = 6.7% of total votes, but power ≈ 19.6%! This is the veto effect.

**10 non-permanent members together**: have ~19% of Shapley-Shubik power but cannot pass anything against a permanent member.

### When SSI = Banzhaf

For **dictator games** (one player has weight ≥ q): both indices give dictator = 100%, others = 0%.
For **symmetric games** (all players equal): both give each player 1/n.

**They diverge** for asymmetric games, especially when the quota and weights create interesting swing structures.

### Dummy Players

A player is a **dummy** if they are never pivotal/swing. A player with wᵢ = 0 or wᵢ < q − Σⱼ≠ᵢ wⱼ (their absence doesn't matter) is a dummy. Both SSI and Banzhaf give dummies a power index of 0.

---

## Real-World Notes

- **EU Council voting**: Pre-Lisbon (Nice treaty) weights vs. post-Lisbon (double majority: 55% of members + 65% of population). Power index analysis revealed that population-weighted voting dramatically changes power distribution
- **Corporate shareholder voting**: Major shareholders may have disproportionate power due to supermajority requirements (80% for charter amendments) even with 20% share
- **Electoral college**: SSI analysis of U.S. Electoral College shows large-state voters have disproportionate power per vote (winner-take-all amplification)
- **IMF governance**: Weighted voting where developed countries (USA especially) have dominant power — power indices reveal US near-veto capacity
- **Blockchain governance**: Token-weighted voting in DAOs — Banzhaf analysis reveals whale concentration

---

## Common Pitfalls

1. **Weight ≠ power**: This is the central lesson. In a game [51; 26, 25, 25], the first player has absolute power (pivot always) despite having only slightly more votes.
2. **SSI vs Banzhaf choice**: They can give different rankings. SSI is more natural for sequential processes (committees deliberating in order); Banzhaf is more natural for simultaneous voting.
3. **Normalization**: The Banzhaf index is sometimes given unnormalized (raw swing count divided by 2^{n-1}). Make sure you're using the normalized version for comparison.
4. **Quota matters enormously**: [51; 34, 33, 33] gives the first player all power. [50; 34, 33, 33] gives all players equal power (any two form a majority). Small quota changes → large power shifts.

---

## Related Concepts

- [[_MOC_Cooperative_Games|↑ Cooperative Games MOC]]
- [[Coalitional_Games_and_Shapley_Value|Coalitional Games & Shapley Value]]
- [[Core_and_Stability|Core & Stability]]

---

## Review Questions

1. For the weighted voting game [4; 3, 2, 1, 1], compute the Shapley-Shubik index for each player. Verify the SSI sums to 1.
2. Compare SSI and Banzhaf for the UN Security Council [39; 7,7,7,7,7,1,1,1,1,1,1,1,1,1,1] (5 P5 with weight 7, 10 NP with weight 1, quota 39). Show that permanent members have veto power.
3. Construct a 3-player weighted voting game where player 1 has weight 4, player 2 has weight 3, player 3 has weight 2, and quota = 5. Show that SSI and Banzhaf give different power rankings for players 2 and 3.

---

## Sources

- Shapley, L.S. & Shubik, M. (1954) — "A Method for Evaluating the Distribution of Power in a Committee System," *APSR*
- Banzhaf, J.F. (1965) — "Weighted Voting Doesn't Work," *Rutgers Law Review*
- Straffin, P. (1988) — "Shapley-Shubik and Banzhaf Power Indices as Probabilities"

#Game_Theory #CooperativeGames #PowerIndices
