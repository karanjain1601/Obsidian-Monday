---
title: Coalitional Games and Shapley Value
aliases: [Shapley Value, TU Games, Characteristic Function, SHAP, Marginal Contribution]
tags: [Game_Theory, CooperativeGames, ShapleyValue]
domain: Game_Theory
difficulty: Intermediate
created: 2026-07-26
related: [Core_and_Stability, Power_Indices, Bargaining_Theory]
status: complete
---

# 🏆 Coalitional Games and Shapley Value

> [!abstract] TL;DR
> A **transferable utility (TU) coalitional game** is (N, v) where v: 2ᴺ → ℝ assigns a value to each coalition (with v(∅)=0). The **Shapley value** φᵢ(v) is the unique allocation satisfying: efficiency (Σφᵢ = v(N)), symmetry (symmetric players get equal shares), dummy (non-contributing player gets 0), and additivity (φ(v+w) = φ(v)+φ(w)). The formula is φᵢ(v) = Σ_{S⊆N\{i}} [|S|!(|N|−|S|−1)!/|N|!] · [v(S∪{i})−v(S)] — player i's expected marginal contribution over all join orderings. Computing exact Shapley values requires 2ⁿ evaluations; practical approaches use Monte Carlo sampling or TreeSHAP for tree models. SHAP (SHapley Additive exPlanations) applies Shapley values to ML model interpretation.

---

## Intuition — analogy FIRST

Three **law firm partners** share an office: Alice, Bob, Carol. Each has different client networks. If Alice works alone, she generates $100K. Bob alone: $150K. Carol alone: $80K. Alice+Bob together: $300K (synergy). Alice+Carol: $200K. Bob+Carol: $250K. All three: $400K.

How should the $400K be divided fairly? The Shapley value says: imagine all possible orderings of the partners joining the firm one by one (ABC, ACB, BAC, BCA, CAB, CBA). In each ordering, each partner is credited with their **marginal contribution** when they joined (the increase in value they brought). Average these marginal contributions over all orderings. This average is fair because it doesn't privilege any particular arrival order.

---

## How It Works

### TU Coalitional Game

**Definition**: A **transferable utility game** is (N, v) where:
- N = {1, …, n} — player set
- v: 2ᴺ → ℝ — **characteristic function**: value of each coalition (v(∅) = 0)
- **Superadditivity** (often assumed): v(S∪T) ≥ v(S) + v(T) for disjoint S, T ⊆ N

**Superadditivity** says there's no harm in merging coalitions — the grand coalition N is always at least as good as splitting. Under superadditivity, it's rational for the grand coalition to form.

**Convexity** (stronger): v(S∪T) + v(S∩T) ≥ v(S) + v(T) ∀ S, T ⊆ N. Convex games have non-empty cores and the Shapley value is in the core.

---

### Shapley Value Formula

**Shapley value** for player i in game (N, v):

$$\varphi_i(v) = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!\,(|N|-|S|-1)!}{|N|!} \cdot \left[v(S \cup \{i\}) - v(S)\right]$$

**Interpretation**: The weight |S|!(|N|−|S|−1)!/|N|! is the probability that coalition S forms first (in a random ordering of N players) and then player i joins. The term v(S∪{i}) − v(S) is i's marginal contribution when joining S. Shapley value = **expected marginal contribution** over all arrival orderings.

**Equivalent formula**: φᵢ(v) = (1/|N|!) Σ_{all orderings π} [v(P^π_i ∪ {i}) − v(P^π_i)]

where P^π_i is the set of players preceding i in ordering π.

---

### Worked Example: 3-Player Game

N = {A, B, C}, v(A) = 100, v(B) = 150, v(C) = 80, v(AB) = 300, v(AC) = 200, v(BC) = 250, v(ABC) = 400.

**All 6 orderings and marginal contributions**:

| Ordering | A's MC | B's MC | C's MC |
|---------|-------|-------|-------|
| ABC | v(A)=100 | v(AB)-v(A)=200 | v(ABC)-v(AB)=100 |
| ACB | v(A)=100 | v(ABC)-v(AC)=200 | v(AC)-v(A)=100 |
| BAC | v(AB)-v(B)=150 | v(B)=150 | v(ABC)-v(AB)=100 |
| BCA | v(ABC)-v(BC)=150 | v(B)=150 | v(BC)-v(B)=100 |
| CAB | v(AC)-v(C)=120 | v(ABC)-v(AC)=200 | v(C)=80 |
| CBA | v(ABC)-v(BC)=150 | v(BC)-v(C)=170 | v(C)=80 |

φ_A = (100+100+150+150+120+150)/6 = 770/6 ≈ **128.3**
φ_B = (200+200+150+150+200+170)/6 = 1070/6 ≈ **178.3**
φ_C = (100+100+100+100+80+80)/6 = 560/6 ≈ **93.3**

Check: 128.3 + 178.3 + 93.3 = **400 = v(ABC)** ✓

---

## Key Concepts / Details

### Four Axioms (Shapley 1953)

| Axiom | Statement |
|-------|-----------|
| **Efficiency** | Σᵢ φᵢ(v) = v(N) — total value is fully distributed |
| **Symmetry** | If v(S∪{i}) = v(S∪{j}) ∀S not containing i,j, then φᵢ = φⱼ |
| **Dummy** | If v(S∪{i}) = v(S) ∀S, then φᵢ = 0 |
| **Additivity** | φᵢ(v+w) = φᵢ(v) + φᵢ(w) for any two games v, w |

**Shapley's theorem**: The Shapley value is the **unique** allocation satisfying all four axioms.

**Alternative axiom systems**: Young (1985) replaced additivity with a stronger marginality axiom; Monderer-Samet (1989) used potential functions.

### Computational Complexity

**Exact computation**: Requires evaluating v(S) for all 2ⁿ subsets → O(2ⁿ) calls. Infeasible for large n.

**Monte Carlo estimation**: Sample random orderings, compute average marginal contribution. Unbiased estimate; variance decreases as O(1/√samples).

**Weighted Least Squares (SHAP linear)**: For linear models, SHAP values are exact and computable in O(n).

**TreeSHAP** (Lundberg 2018): Exploits tree structure for exact computation in O(n · depth · 2^max_features_per_split) — polynomial in tree size.

### SHAP in Machine Learning

**SHAP (SHapley Additive exPlanations)**: Apply Shapley values with "players" = features and "value function" = ML model's prediction.

For a model f and input x:
$$\varphi_j(f, x) = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|!(|F|-|S|-1)!}{|F|!} \left[f_{S\cup\{j\}}(x) - f_S(x)\right]$$

where fS(x) = E[f(x) | x_S] (expected model output with only features in S observed).

**Desirable properties** (directly from Shapley axioms):
- Efficiency: feature importances sum to f(x) − E[f(x)] (total prediction explained)
- Symmetry: equal contribution → equal attribution
- Dummy: unused features get 0 attribution
- Additivity: ensemble SHAP = sum of member SHAPs

**Applications**: Model explanation (XAI), feature selection, fairness auditing, debugging.

### Superadditivity and Grand Coalition

**Why grand coalition forms**: Under superadditivity, v(N) ≥ Σᵢ v({i}) — forming the grand coalition is never worse than splitting. Shapley value allocates v(N) efficiently, giving each player at least their standalone value.

**When grand coalition might not form**: If the core is empty (see [[Core_and_Stability|Core & Stability]]), allocations in the grand coalition may not be stable against defection.

---

## Real-World Notes

- **Cost sharing**: Airport landing fee allocation, network cost sharing — Shapley value gives a principled fair split
- **Corporate liability**: Environmental cleanup costs allocated among multiple polluters — Shapley value used in legal proceedings
- **Sports analytics**: Player contribution to team performance — Shapley value isolates individual vs. team effects (used in Moneyball-style analytics)
- **Political science**: Voting power in UN Security Council, EU Council — Shapley-Shubik power index (see [[Power_Indices|Power Indices]])
- **AI Explainability**: SHAP is the industry standard for explaining black-box ML predictions — used in healthcare, finance, legal AI

---

## Common Pitfalls

1. **Shapley value may not be in the core** — The Shapley value satisfies efficiency and fairness axioms but may allocate less to some coalition than they could achieve alone, making it unstable. It's in the core only for convex games.
2. **Additivity axiom** — The additivity axiom is sometimes criticized as arbitrary. Alternative axiomatizations (marginality) avoid it while still uniquely characterizing Shapley value.
3. **Computational infeasibility** — For ML models with 100+ features, exact SHAP requires exponential time without structural assumptions. TreeSHAP and KernelSHAP approximate the exact Shapley value.
4. **SHAP baseline matters** — The "dummy" prediction f_∅(x) = E[f(x)] is a modeling choice; different baselines give different SHAP attributions.

---

## Related Concepts

- [[_MOC_Cooperative_Games|↑ Cooperative Games MOC]]
- [[Core_and_Stability|Core & Stability]]
- [[Power_Indices|Power Indices]]
- [[Bargaining_Theory|Bargaining Theory]]
- [[../05_Mechanism_Design/VCG_Mechanism|VCG Mechanism]]

---

## Review Questions

1. Compute the Shapley value for the 4-player game N={1,2,3,4} where v(S) = |S|² (number of players in S, squared). Which player has the highest Shapley value?
2. Prove that the Shapley value satisfies the dummy axiom. That is, if v(S∪{i}) = v(S) for all S, show the formula gives φᵢ = 0.
3. Explain why SHAP values computed with different baseline distributions (E[f(x)] vs. f(0)) give different attributions for the same model. Which baseline is more meaningful for a binary classification model predicting loan default?

---

## Sources

- Shapley, L.S. (1953) — "A Value for n-Person Games," *Contributions to the Theory of Games*
- Young, H.P. (1985) — "Monotonic Solutions of Cooperative Games," *International Journal of Game Theory*
- Lundberg & Lee (2017) — "A Unified Approach to Interpreting Model Predictions," *NIPS*

#Game_Theory #CooperativeGames #ShapleyValue
