---
title: Mixed Strategies
aliases: [Mixed Strategy Nash Equilibrium, Indifference Principle, Mixed NE, Randomization]
tags: [Game_Theory, StaticGames, MixedStrategies]
domain: Game_Theory
difficulty: Intermediate
created: 2026-07-26
related: [Nash_Equilibrium, Minimax_Theorem, Players_Strategies_and_Payoffs]
status: complete
---

# 🎯 Mixed Strategies

> [!abstract] TL;DR
> A mixed strategy σᵢ ∈ Δ(Sᵢ) randomizes over pure strategies. The **indifference principle** characterizes mixed NE: player i mixes over strategies in their support only if ALL those strategies yield the same expected payoff given opponents' strategies. The mixing probability is chosen to make OPPONENTS indifferent — not to express i's own uncertainty. In a 2×2 game, closed-form solutions exist by solving a 2-equation linear system. In n-player games with n strategies per player, support identification requires case analysis over all possible supports, then LP verification. **Matching Pennies** and **Battle of Sexes** are canonical examples with unique mixed NE.

---

## Intuition — analogy FIRST

A **soccer goalkeeper defending a penalty kick** cannot always dive left or always right — the striker would simply shoot the other way. The goalkeeper must randomize to keep the striker guessing. The optimal mix makes the striker **indifferent** between shooting left and right (they get the same expected goal probability either way). Critically, the goalkeeper doesn't choose mixing probabilities based on their own preferences about diving — they choose the probabilities that neutralize the striker's advantage. This is the fundamental insight: **you mix to make your opponent indifferent, not to express your own uncertainty**.

---

## How It Works

### The Indifference Principle

**Theorem**: In a mixed Nash equilibrium, player i is indifferent over all pure strategies in their support:

$$\forall s_i, s'_i \in \text{supp}(\sigma^*_i): \quad u_i(s_i, \sigma^*_{-i}) = u_i(s'_i, \sigma^*_{-i})$$

**Why**: If one strategy in the support were strictly better, player i would put all probability on it (pure strategy) — contradicting mixing. For i to be willing to mix, all mixed-over strategies must be equally good.

**Crucial direction**: Player i's mixing probabilities are determined by making their OPPONENTS indifferent (not player i themselves). Player i's probabilities appear in opponents' payoff calculations.

---

### 2×2 Closed-Form Solution

**Matching Pennies** (zero-sum):

|  | **Heads (H)** | **Tails (T)** |
|--|:---:|:---:|
| **Heads (H)** | (1, −1) | (−1, 1) |
| **Tails (T)** | (−1, 1) | (1, −1) |

Let P1 mix with prob p = P(H), P2 mix with prob q = P(H).

**Making P2 indifferent** (P2's payoffs as function of P1's mixing):
- P2 plays H: u₂(H) = −1·p + 1·(1−p) = 1 − 2p
- P2 plays T: u₂(T) = 1·p + (−1)·(1−p) = 2p − 1
- Indifference: 1 − 2p = 2p − 1 → 4p = 2 → **p = ½**

**Making P1 indifferent** (P1's payoffs as function of P2's mixing):
- P1 plays H: u₁(H) = 1·q + (−1)·(1−q) = 2q − 1
- P1 plays T: u₁(T) = −1·q + 1·(1−q) = 1 − 2q
- Indifference: 2q − 1 = 1 − 2q → 4q = 2 → **q = ½**

**Unique NE**: σ*₁ = σ*₂ = (½, ½). Expected payoffs: both 0.

---

### General 2×2 Procedure

Given payoff matrix for 2-player game with P1 strategies {T, B} and P2 strategies {L, R}:

| | L | R |
|--|:--:|:--:|
| **T** | (a, e) | (b, f) |
| **B** | (c, g) | (d, h) |

**P1's mixing prob p = P(T)**:
Equate P2's payoffs: e·p + g·(1−p) = f·p + h·(1−p)
→ p = (h−g) / (e−g−f+h)

**P2's mixing prob q = P(L)**:
Equate P1's payoffs: a·q + b·(1−q) = c·q + d·(1−q)
→ q = (d−b) / (a−b−c+d)

**Validity check**: Both p, q ∈ (0, 1). If outside [0,1], no fully mixed NE with this support.

---

### Battle of the Sexes

| | **Opera (O)** | **Football (F)** |
|--|:---:|:---:|
| **Opera (O)** | (2, 1) | (0, 0) |
| **Football (F)** | (0, 0) | (1, 2) |

P1 mixing prob p; P2 mixing prob q.

P2 indifference: 1·p + 0·(1−p) = 0·p + 2·(1−p) → p = 2(1−p) → **p = 2/3**

P1 indifference: 2q + 0·(1−q) = 0·q + 1·(1−q) → 2q = 1−q → **q = 1/3**

Mixed NE: P1 plays O with prob 2/3; P2 plays O with prob 1/3.
Expected payoffs: u₁ = 2·(1/3) = **2/3**; u₂ = 1·(2/3) = **2/3**.

*Note: both players earn less at the mixed NE than at either pure NE!*

---

## Key Concepts / Details

### Support Identification in n-Player Games

For games with more than 2 strategies, finding mixed NE requires:

1. **Enumerate possible supports**: For each player, pick a subset Sᵢ' ⊆ Sᵢ of strategies that might be in the support
2. **Solve indifference conditions**: For each player i and each pair s, s' ∈ Sᵢ': uᵢ(s, σ*₋ᵢ) = uᵢ(s', σ*₋ᵢ)
3. **Solve for mixing probabilities**: This is a linear system in the opponents' mixing probabilities
4. **Verify validity**: Check all mixing probabilities ∈ (0,1) and all out-of-support strategies yield ≤ equal expected payoffs
5. **Report all valid NE**

**Example**: 3×3 game has C(3,1) + C(3,2) + C(3,3) = 7 possible supports per player → up to 49 cases to check (in practice, symmetry reduces this).

### n-Player Mixed NE via LP

For n-player games, finding mixed NE can be formulated as an LP (in specific classes) or as the **Linear Complementarity Problem (LCP)**:

**For 2-player zero-sum**: P1's optimal mixed strategy solves:
$$\max_{p \geq 0, v} v \quad \text{s.t.} \quad p^\top A e_j \geq v \; \forall j, \quad \mathbf{1}^\top p = 1$$

where A is P1's payoff matrix. Dual LP gives P2's strategy. This is poly-time solvable.

**For general 2-player**: The Lemke-Howson algorithm (1964) finds a NE in finite steps but can take exponential time in worst case. Nash computation is PPAD-complete.

### Population Interpretation

Mixed strategies have a natural **population-frequency interpretation**: in a large population where a fraction p plays strategy T and (1−p) plays B, the population is in a mixed NE when no individual has incentive to switch strategies. This connects to [[../06_Evolutionary_Computational/Replicator_Dynamics|replicator dynamics]].

### Dominated Strategies and Mixed NE

**Key theorem**: A strategy sᵢ is never in the support of any NE (pure or mixed) if and only if it is strictly dominated (possibly by a mixed strategy).

This links [[../01_Fundamentals/Dominance_and_Rationality|IEDS]] and the set of mixed NE: IEDS survivors = strategies that appear in some NE.

---

## Real-World Notes

- **Sports**: Penalty kicks (Chiappori, Groseclose, Levitt 2002); serve direction in tennis; pitch selection in baseball — empirical studies find approximate mixed NE
- **Security games**: Airport security patrol randomization; "Stackelberg security games" (USC TEAMCORE) use randomized strategies as deployment policy
- **Cybersecurity**: Randomized intrusion detection; mixed strategies prevent attackers from learning patrol patterns
- **Poker**: GTO (Game Theory Optimal) poker strategy involves complex mixed strategies over bet sizes and frequencies, computed by modern solvers (PioSOLVER, GTO+)
- **Market microstructure**: High-frequency traders randomize order submission timing to prevent front-running

---

## Common Pitfalls

1. **Mixing to make SELF indifferent** — Wrong! Player i's mixing probabilities make OPPONENTS indifferent. Many students confuse the direction.
2. **Forgetting out-of-support check** — After finding mixing probabilities, verify that strategies NOT in the support would earn ≤ the equilibrium payoff.
3. **Multiple supports** — A game can have mixed NE with different supports. Enumerate all valid supports before concluding.
4. **Mixed NE uniqueness** — Games can have multiple mixed NE (unlike pure NE, which may be obviously identifiable). Coordination games often have mixed NE that are worse than pure NE for all players.

---

## Related Concepts

- [[_MOC_Static_Games|↑ Static Games MOC]]
- [[Nash_Equilibrium|Nash Equilibrium]]
- [[Minimax_Theorem|Minimax Theorem]]
- [[Correlated_Equilibrium|Correlated Equilibrium]]
- [[../01_Fundamentals/Players_Strategies_and_Payoffs|Players, Strategies & Payoffs]]
- [[../06_Evolutionary_Computational/Evolutionary_Stable_Strategies|Evolutionary Stable Strategies]]

---

## Review Questions

1. Find the unique mixed NE of Hawk-Dove with payoffs: (H,H)=(0,0), (H,D)=(4,1), (D,H)=(1,4), (D,D)=(3,3). Verify using the indifference principle.
2. In a 3-player matching pennies where each player wins $1 if the majority matches their choice: find all Nash equilibria (pure and mixed).
3. Explain intuitively why both players in Battle of the Sexes earn strictly less at the mixed NE than at either pure NE. Does this contradict the NE optimality concept? Why or why not?

---

## Sources

- Osborne & Rubinstein — *A Course in Game Theory*, Ch. 3
- Chiappori, Groseclose & Levitt (2002) — "Testing Mixed-Strategy Equilibria When Players Are Heterogeneous," *AER*
- Lemke & Howson (1964) — "Equilibrium Points of Bimatrix Games"

#Game_Theory #StaticGames #MixedStrategies
