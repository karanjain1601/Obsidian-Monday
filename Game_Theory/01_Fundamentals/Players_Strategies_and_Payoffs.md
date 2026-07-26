---
title: Players, Strategies, and Payoffs
aliases: [vNM Utility, Expected Utility, Pure Mixed Strategies, Strategy Profiles]
tags: [Game_Theory, Fundamentals, PlayersStrategiesPayoffs]
domain: Game_Theory
difficulty: Beginner
created: 2026-07-26
related: [Game_Representations, Dominance_and_Rationality]
status: complete
---

# 🎲 Players, Strategies, and Payoffs

> [!abstract] TL;DR
> A game's atoms are: **players** i ∈ N with **strategy spaces** Sᵢ (pure) or Δ(Sᵢ) (mixed), and **payoff functions** uᵢ: S → ℝ. The von Neumann–Morgenstern (vNM) utility theorem (1944) axiomatically justifies representing preferences over lotteries by an expected utility functional uᵢ(σ) = Σₛ σ(s)·uᵢ(s), assuming completeness, transitivity, continuity, and independence. Strategy profiles (sᵢ, s₋ᵢ) use the −i notation for all opponents. Zero-sum games satisfy Σuᵢ = 0; general-sum games admit cooperative surplus. A pure strategy is a deterministic complete plan; a mixed strategy is a probability distribution over pure strategies.

---

## Intuition — analogy FIRST

Imagine a **negotiation between a buyer and seller** over a used car. The buyer (Player 1) has a private valuation v₁ = $12,000; the seller (Player 2) has a cost c₂ = $8,000. Each player chooses a price to name. The surplus ($4,000) is split according to the outcome. The **payoff function** captures how much each player values each outcome — not just money, but money adjusted for risk attitude (encoded in the utility function). A risk-averse buyer might accept a lower expected price to avoid the variance of a price war.

This is why we need vNM utility: money ≠ utility for risk-averse or risk-seeking agents.

---

## How It Works

### Players

- **Player set**: N = {1, 2, …, n}, finite unless stated otherwise
- Each player i has a **strategy set** Sᵢ, a **utility function** uᵢ, and **beliefs** (in Bayesian games) about others' types
- Players are **rational**: they maximize expected utility given beliefs

### Pure Strategies

A **pure strategy** sᵢ ∈ Sᵢ is a complete, deterministic, contingent plan specifying an action at every information set where player i could potentially move.

- **Action**: a single move at one decision point (local)
- **Strategy**: specifies actions everywhere, including off-path nodes (global)

**Profile notation**:
$$s = (s_i, s_{-i}) \in S_i \times S_{-i}$$

where $s_{-i} = (s_1, \ldots, s_{i-1}, s_{i+1}, \ldots, s_n)$ denotes all opponents' strategies.

**Best response**:
$$BR_i(s_{-i}) = \arg\max_{s_i \in S_i} u_i(s_i, s_{-i})$$

### Mixed Strategies

A **mixed strategy** σᵢ ∈ Δ(Sᵢ) is a probability distribution over pure strategies:

$$\sigma_i: S_i \to [0,1], \quad \sum_{s_i \in S_i} \sigma_i(s_i) = 1$$

The **support** of σᵢ: supp(σᵢ) = {sᵢ ∈ Sᵢ : σᵢ(sᵢ) > 0}

**Expected payoff** under independent mixed profile σ = (σ₁, …, σₙ):

$$u_i(\sigma) = \sum_{s \in S} \left(\prod_{j \in N} \sigma_j(s_j)\right) u_i(s) = \mathbb{E}_{s \sim \sigma}[u_i(s)]$$

---

## Key Concepts / Details

### vNM Expected Utility Theory

**Von Neumann & Morgenstern (1944)** showed that if preferences over lotteries satisfy four axioms, they can be represented by an expected utility functional:

| Axiom | Statement |
|-------|-----------|
| **Completeness** | ∀ lotteries L, L': L ≻ L' or L' ≻ L or L ~ L' |
| **Transitivity** | L ≻ L' and L' ≻ L'' ⟹ L ≻ L'' |
| **Continuity** | ∃ p ∈ [0,1]: L ~ pL₁ + (1-p)L₂ for L between L₁, L₂ |
| **Independence** | L ≻ L' ⟹ αL + (1-α)L'' ≻ αL' + (1-α)L'' ∀α ∈ (0,1] |

**Theorem (vNM)**: Preferences satisfying these axioms have a utility function u such that:
$$L \succcurlyeq L' \iff \mathbb{E}[u(L)] \geq \mathbb{E}[u(L')]$$

u is **unique up to positive affine transformation**: ũ = au + b (a > 0) represents the same preferences.

### Risk Attitudes

| Type | Utility Shape | Jensen's Inequality |
|------|-------------|-------------------|
| **Risk-neutral** | Linear u(w) = w | u(E[W]) = E[u(W)] |
| **Risk-averse** | Concave u(w) = √w, ln(w) | u(E[W]) > E[u(W)] |
| **Risk-seeking** | Convex u(w) = w² | u(E[W]) < E[u(W)] |

### Zero-Sum vs General-Sum

**Zero-sum**: u₁(s) + u₂(s) = 0 ∀s ∈ S (equivalently, u₁ = -u₂)
- Interests are diametrically opposed
- Von Neumann's minimax theorem applies
- Examples: chess, poker (ignoring rake), rock-paper-scissors

**Constant-sum**: Σᵢ uᵢ(s) = k ∀s — equivalent to zero-sum after normalization

**General-sum**: No restriction on Σᵢ uᵢ
- Cooperation possible (positive-sum outcomes)
- Conflict possible simultaneously with cooperation (mixed motive games)
- Examples: Prisoner's Dilemma, Battle of the Sexes, Stag Hunt

**Stag Hunt Payoff Matrix** (coordination game):

|  | **Stag** | **Hare** |
|--|:---:|:---:|
| **Stag** | (4, 4) | (0, 3) |
| **Hare** | (3, 0) | (3, 3) |

*Two NE: (Stag,Stag) Pareto-dominant; (Hare,Hare) risk-dominant. Illustrates tension between efficiency and safety.*

### The −i Notation and Deviations

For player i with strategy sᵢ, a **unilateral deviation** to s'ᵢ changes the profile from (sᵢ, s₋ᵢ) to (s'ᵢ, s₋ᵢ). Player i benefits from deviating if:
$$u_i(s'_i, s_{-i}) > u_i(s_i, s_{-i})$$

The concept of **no profitable unilateral deviation** is the foundation of Nash equilibrium.

### Worked Example: Rock-Paper-Scissors (Zero-Sum)

Payoff matrix for Player 1 (P2 payoff = -P1 payoff):

|  | R | P | S |
|--|:--:|:--:|:--:|
| **R** | 0 | -1 | 1 |
| **P** | 1 | 0 | -1 |
| **S** | -1 | 1 | 0 |

No pure strategy NE (every pure strategy is beaten by another). Unique NE: σ₁* = σ₂* = (⅓, ⅓, ⅓). Expected payoff = 0 for both players.

---

## Real-World Notes

- **Finance**: Portfolio theory uses vNM utility (mean-variance with risk-aversion). Prospect theory (Kahneman-Tversky) departs from vNM to explain behavioral anomalies.
- **AI/ML**: Reinforcement learning agents maximize expected cumulative reward — a vNM utility over trajectories. Multi-agent RL is a general-sum game between agents.
- **Auctions**: Bidder payoffs are (value − price) × (win indicator). Risk-neutral bidders maximize expected monetary payoff; risk-averse bidders bid more aggressively in first-price auctions.
- **Sports analytics**: Game-theoretic models of mixed strategies appear in soccer penalty kicks (Chiappori et al. 2002 find empirical support for mixed NE).

---

## Common Pitfalls

1. **vNM utility is ordinal over lotteries, cardinal over outcomes** — The numbers matter (not just ordering) because they determine mixing weights. But a positive affine transformation is still allowed.
2. **Mixed strategy ≠ uncertainty about pure strategy** — A mixed strategy is the player's own randomization device, not their uncertainty about what they will do.
3. **−i notation pitfall** — s₋ᵢ is a tuple, not a set; order matters when indexing payoffs.
4. **Zero-sum ≠ competitive** — Symmetric coordination games are not zero-sum even if they feel competitive. Zero-sum is a precise mathematical property.

---

## Related Concepts

- [[_MOC_GT_Fundamentals|↑ Fundamentals MOC]]
- [[Game_Representations|Game Representations]]
- [[Dominance_and_Rationality|Dominance & Rationality]]
- [[../02_Static_Games/Nash_Equilibrium|Nash Equilibrium]]
- [[../02_Static_Games/Mixed_Strategies|Mixed Strategies]]
- [[../02_Static_Games/Minimax_Theorem|Minimax Theorem]]

---

## Review Questions

1. Prove that if u is a vNM utility function, then ũ = 2u + 5 represents the same preferences. Why does a monotone *nonlinear* transformation (e.g., u²) not work?
2. In a 2-player zero-sum game, Player 1 uses mixed strategy (½, ½) and Player 2 uses (⅓, ⅔). Write out the full expected payoff calculation for the 2×2 payoff matrix A = [[2,-1],[-1,3]].
3. Construct a 2-player general-sum game with no pure strategy Nash equilibrium but exactly one mixed strategy NE. Verify the NE using the indifference condition.

---

## Sources

- Von Neumann, J. & Morgenstern, O. (1944) — *Theory of Games and Economic Behavior*
- Mas-Colell, Whinston & Green — *Microeconomic Theory*, Ch. 6
- Osborne & Rubinstein — *A Course in Game Theory*, Ch. 1–2

#Game_Theory #Fundamentals #PlayersStrategiesPayoffs
