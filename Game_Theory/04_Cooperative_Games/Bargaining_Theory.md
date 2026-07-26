---
title: Bargaining Theory
aliases: [Nash Bargaining, Rubinstein Alternating Offers, Kalai-Smorodinsky, Bargaining Solution]
tags: [Game_Theory, CooperativeGames, BargainingTheory]
domain: Game_Theory
difficulty: Intermediate
created: 2026-07-26
related: [Coalitional_Games_and_Shapley_Value, Core_and_Stability, Subgame_Perfect_Equilibrium]
status: complete
---

# 🤝 Bargaining Theory

> [!abstract] TL;DR
> Bargaining theory asks how two rational agents split a cooperative surplus. **Nash bargaining** (1950) axiomatically characterizes the unique solution (d₁, d₂ = disagreement point): argmax_{(u₁,u₂)∈F, u≥d} (u₁−d₁)(u₂−d₂), satisfying Pareto optimality (PO), symmetry (SYM), scale invariance (INV), and independence of irrelevant alternatives (IIA). **Kalai-Smorodinsky** replaces IIA with monotonicity, giving a different solution. **Rubinstein's alternating-offers model** (1982) provides a strategic foundation: unique SPE first-mover share = (1−δ₂)/(1−δ₁δ₂). As δ → 1, Rubinstein converges to Nash bargaining — axiomatic and strategic approaches are reconciled.

---

## Intuition — analogy FIRST

Two chefs — a baker and a pastry chef — can open a restaurant together and earn $100K profit. Each could work alone: baker earns $20K, pastry chef earns $30K. The "bargaining problem" is: how to divide the extra $50K = $100K − $20K − $30K that they generate together?

**Nash's insight**: The division should be the outcome maximizing the **product of gains above the disagreement point**. If the baker gets u₁ and the pastry chef gets u₂, Nash solution maximizes (u₁−20)(u₂−30) subject to u₁+u₂ ≤ 100. This gives u₁ = 45, u₂ = 55 — each gets their disagreement payoff plus half the surplus.

**Rubinstein's insight**: When the chefs alternate making take-it-or-leave-it offers, the SPE of this infinite alternating-offer game ALSO gives exactly the Nash solution as patience → 1.

---

## How It Works

### The Nash Bargaining Problem

**Bargaining problem**: (F, d) where:
- F ⊆ ℝ² — feasible set of utility pairs (compact, convex, comprehensive)
- d = (d₁, d₂) ∈ F — **disagreement point** (what each player gets if no deal)
- Assume ∃ u ∈ F with u > d (negotiation worthwhile)

**Nash Bargaining Solution**: The unique (u₁*, u₂*) ∈ F solving:

$$\max_{(u_1, u_2) \in F,\; u \geq d} (u_1 - d_1)(u_2 - d_2)$$

**Geometric interpretation**: The Nash solution is the point on the Pareto frontier where the hyperbola (u₁−d₁)(u₂−d₂) = constant is tangent to F.

**For linear Pareto frontier** u₁ + u₂ = K (symmetric bargaining):
Nash solution: u₁* = u₂* = (K − d₁ − d₂)/2 + dᵢ — equal split of surplus above disagreement.

**For general frontier**: Nash solution gives each player their disagreement payoff plus an equal share of surplus in "Nash units" (normalized by marginal utilities).

---

### Nash's Four Axioms

| Axiom | Statement | Interpretation |
|-------|-----------|---------------|
| **Pareto Optimality (PO)** | No feasible u with uᵢ > u*ᵢ ∀i | Efficient — full surplus captured |
| **Symmetry (SYM)** | If d₁=d₂ and F symmetric, then u*₁=u*₂ | Equal players split equally |
| **Scale Invariance (INV)** | Positive affine transformations of utilities don't change solution | Independent of utility units |
| **Independence of Irrelevant Alternatives (IIA)** | If (F',d)⊆(F,d) and Nash solution of F is in F', then same solution in F' | Removing non-chosen alternatives doesn't change choice |

**Nash's theorem**: The Nash bargaining solution is the UNIQUE solution f: (F,d) → ℝ² satisfying all four axioms.

---

## Key Concepts / Details

### Worked Example: Symmetric Linear Case

Baker (P1): d₁ = 20, Pastry Chef (P2): d₂ = 30. Joint surplus: v = 100. Pareto frontier: u₁ + u₂ = 100.

Nash maximization: max (u₁−20)(100−u₁−30) = max (u₁−20)(70−u₁)

FOC: (70−u₁) − (u₁−20) = 0 → 90 = 2u₁ → u₁* = 45, u₂* = 55.

Gains: P1 gains 45−20 = 25; P2 gains 55−30 = 25. **Equal surplus split**. ✓

### Kalai-Smorodinsky Solution (1975)

**Criticism of IIA**: IIA can lead to counterintuitive results when expanding the feasible set makes one player's "ideal point" (max achievable utility) more distant.

**Ideal point**: a*ᵢ = max{uᵢ : u ∈ F, u ≥ d} — most player i can get while keeping the agreement acceptable.

**Kalai-Smorodinsky (KS) solution**: The Pareto optimal point on the segment from d to (a*₁, a*₂).

$$u^{KS} = d + \lambda (a^* - d) \text{ where } \lambda = \max\{\lambda': d + \lambda'(a^*-d) \in F\}$$

**KS axioms**: Replace IIA with **monotonicity**: if F ⊆ F' and the ideal point stays the same, neither player should get less in the larger game.

**Example**: If F = {u₁+u₂ ≤ 1} and F' = {u₁+2u₂ ≤ 2} (P2 has better outside options), KS gives P2 more in F' (monotonicity) while Nash may not.

### Rubinstein Alternating Offers (1982)

**Game**: Two players alternate making offers. If agreement in period t, payoffs are (sᵢ)·δᵢᵗ (discounted). Rejecting all offers: disagreement payoff (0, 0).

**Period structure**:
- Period 1: P1 proposes split (s₁, 1−s₁)
- P2 accepts (game ends) or rejects (period 2)
- Period 2: P2 proposes split (1−s₂, s₂)
- P1 accepts or rejects (period 3)
- ...

**SPE (backward induction on infinite horizon)**:

In period 2 (P2 proposes): P1 accepts any offer ≥ what P1 would get in period 3. By stationarity, if P1 would accept offer s₁ in period 1, P1 accepts δ₁s₁ in period 2.

P2 in period 2 offers P1 exactly δ₁s₁ (P1's reservation value) and keeps 1−δ₁s₁.

P1 in period 1 must offer P2 enough to not reject: P2 gets δ₂(1−δ₁s₁).

P1 maximizes: s₁ = 1 − δ₂(1−δ₁s₁) → s₁(1−δ₁δ₂) = 1−δ₂ → **s₁* = (1−δ₂)/(1−δ₁δ₂)**

**First-mover advantage**: s₁* > ½ when δ₁ = δ₂ = δ: s₁ = 1/(1+δ) > ½. Being first is advantageous.

**Limit as δ → 1** (δ₁ = δ₂ = δ): s₁* = 1/(1+1) = ½. First-mover advantage vanishes; players split equally.

**Connection to Nash bargaining**: As δᵢ = e^{−rᵢΔ} with Δ → 0 (continuous time limit), the SPE payoff vector converges to the Nash bargaining solution with disagreement point d = (0,0) and "discount rates" r₁, r₂ determining the split: s₁* = r₂/(r₁+r₂).

### Disagreement Point Matters

| Scenario | Disagreement Point | Nash Solution | P1 Share |
|---------|------------------|---------------|---------|
| Equal threat (d₁=d₂=0) | d=(0,0) | Equal split | 50% |
| P1 stronger outside option | d=(0.3, 0.1) | P1 gets more | >50% |
| P2 stronger | d=(0.1, 0.3) | P2 gets more | <50% |

**Coasian logic**: Bargaining outcome depends on the outside option (BATNA — Best Alternative To Negotiated Agreement). Improving your BATNA improves your bargaining outcome.

---

## Real-World Notes

- **Labor-management negotiations**: Union's threat to strike (disagreement payoff) vs. management's lockout threat determine Nash solution. Union building strike fund improves BATNA.
- **Mergers & acquisitions**: Rubinstein model predicts first-offer advantage; empirically, acquirers often overpay (winner's curse, impatience)
- **Patent licensing**: Two firms bargaining over technology license; Nash solution with asymmetric disagreement points (different expected litigation costs)
- **International climate agreements**: Nations bargain over emissions targets; disagreement = no agreement (business as usual). Nations with lower adjustment costs have lower disagreement payoffs → smaller Nash share
- **API pricing**: Platform/developer bargaining over revenue share; Rubinstein as model for why platforms usually win (impatience asymmetry)

---

## Common Pitfalls

1. **Nash ≠ equal split in general** — Equal split only when players have equal disagreement points or the problem is symmetric. With asymmetric disagreement points, Nash gives unequal shares.
2. **IIA seems innocuous but isn't** — The IIA axiom has non-trivial implications. KS drops it and gets a different solution; Kalai's proportional solution drops other axioms.
3. **Rubinstein and Nash are different frameworks** — Nash is axiomatic (cooperative); Rubinstein is strategic (non-cooperative). Their convergence as δ→1 is the main reconciliation result.
4. **Discounting ≠ impatience** — δᵢ can represent time preference OR risk of breakdown (exogenous termination). Same formula, different interpretations.

---

## Related Concepts

- [[_MOC_Cooperative_Games|↑ Cooperative Games MOC]]
- [[Coalitional_Games_and_Shapley_Value|Coalitional Games & Shapley Value]]
- [[Core_and_Stability|Core & Stability]]
- [[../03_Dynamic_Games/Subgame_Perfect_Equilibrium|Subgame Perfect Equilibrium]]
- [[../05_Mechanism_Design/Matching_Markets|Matching Markets]]

---

## Review Questions

1. Two firms bargain over a joint project worth $1M. Firm A's outside option is $200K (lawsuit settlement); Firm B's outside option is $400K (alternative partner). Find the Nash bargaining solution assuming the feasible set is all (u_A, u_B) with u_A + u_B ≤ 1M.
2. In Rubinstein's alternating-offers game with δ₁ = 0.8, δ₂ = 0.9, what is P1's SPE first-period share? What is P2's? What total value is lost to discounting?
3. Show that the Nash bargaining solution satisfies the IIA axiom. Then construct a feasible set expansion where the Kalai-Smorodinsky solution changes but the Nash solution does not, illustrating the practical difference between the two axioms.

---

## Sources

- Nash, J. (1950) — "The Bargaining Problem," *Econometrica*
- Rubinstein, A. (1982) — "Perfect Equilibrium in a Bargaining Model," *Econometrica*
- Kalai & Smorodinsky (1975) — "Other Solutions to Nash's Bargaining Problem," *Econometrica*

#Game_Theory #CooperativeGames #BargainingTheory
