---
title: Evolutionary Stable Strategies
aliases: [ESS, Maynard Smith, Hawk-Dove, Invasion Stability, Bishop-Cannings]
tags: [Game_Theory, EvolutionaryComputational, EvolutionaryStableStrategies]
domain: Game_Theory
difficulty: Intermediate
created: 2026-07-26
related: [Replicator_Dynamics, Nash_Equilibrium, Mixed_Strategies]
status: complete
---

# 🦅 Evolutionary Stable Strategies

> [!abstract] TL;DR
> An **Evolutionarily Stable Strategy** (ESS, Maynard Smith & Price 1973) is a strategy σ* such that a population of σ*-players cannot be successfully invaded by a small group of mutants playing σ ≠ σ*. Formally: either (i) u(σ*, σ*) > u(σ, σ*), or (ii) u(σ*, σ*) = u(σ, σ*) AND u(σ*, σ) > u(σ, σ). Every ESS is a Nash equilibrium, but **not every NE is an ESS** (e.g., (D,D) in PD is NE but not ESS under some dynamics; more critically, NE in symmetric games can fail ESS's stability condition). **Hawk-Dove** has a mixed ESS at p* = V/C when C>V. **Bishop-Cannings theorem**: all strategies in support of a mixed ESS have equal fitness. ESS corresponds to asymptotic stability under replicator dynamics.

---

## Intuition — analogy FIRST

Imagine a **bird population** where individuals compete for food. Each bird can be a **Hawk** (fight aggressively) or a **Dove** (display, retreat if challenged). An all-Dove population is unstable: a Hawk mutant arrives and wins every conflict (Doves always retreat) → Hawks spread. An all-Hawk population is also unstable: Hawks fight each other, incurring costs → Doves do better (avoid costly fights).

The stable outcome is a **mixed ESS**: some fraction p* of Hawks and (1−p*) Doves, where both strategies have equal average fitness. No mutant strategy can invade this equilibrium — it's evolutionarily stable.

ESS formalizes "survival of the fittest strategies" without invoking rational agents — just differential reproduction based on payoffs.

---

## How It Works

### Formal Definition (Maynard Smith & Price 1973)

A **mixed strategy σ*** is an **Evolutionarily Stable Strategy** if for every σ ≠ σ*, there exists ε̄ > 0 such that for all ε ∈ (0, ε̄):

$$u(\sigma^*, (1-\varepsilon)\sigma^* + \varepsilon\sigma) > u(\sigma, (1-\varepsilon)\sigma^* + \varepsilon\sigma)$$

The incumbent σ* outperforms any rare mutant σ when they face a population that is mostly σ* with a small fraction ε of mutants.

**Equivalent conditions** (derived by expanding and taking ε → 0):

**Primary condition**: u(σ*, σ*) ≥ u(σ, σ*) [σ* is a NE]

**Secondary condition** (when u(σ*, σ*) = u(σ, σ*)): u(σ*, σ) > u(σ, σ)

Short: σ* must be a NE (primary), and must outperform mutants in direct encounters (secondary).

---

### ESS ⊂ NE (Strict Inclusion)

**Every ESS is a Nash Equilibrium**: 
- If σ* is ESS, then u(σ*, σ*) ≥ u(σ, σ*) for all σ (from primary condition) → σ* is a NE.

**Not every NE is an ESS**:

**Example**: Prisoner's Dilemma (D,D) is the unique NE. Is it ESS? Check: u(D,D) = 1 ≥ u(C,D) = 0 → primary OK. But any deviation from D is also a NE, so secondary is vacuously satisfied... Actually (D,D) IS ESS in PD since D strictly dominates — u(D,σ) > u(C,σ) for all σ, including the mutant σ = C. → (D,D) is ESS.

**Better counterexample**: In a coordination game with two symmetric NE, the "wrong" NE may fail ESS. Consider: (H,H)=(1,1), (H,D)=(0,0), (D,H)=(0,0), (D,D)=(1,1). Two pure NE: (H,H) and (D,D). Both are ESS (strict NE ⟹ ESS). Mixed NE (½,½) is NE but NOT ESS: u(mixed, mixed) = ½ = u(H, mixed), but u(H, H) = 1 > u(mixed, H) = ½. Fails secondary condition → NOT ESS.

**Theorem**: Every strict Nash equilibrium (u(sᵢ, s₋ᵢ) > u(s'ᵢ, s₋ᵢ) for all deviations) is an ESS. Mixed NE can fail ESS.

---

## Key Concepts / Details

### Hawk-Dove Game

**Setup**: Two players contest a resource of value V. If one Hawk meets a Dove, Hawk gets V, Dove gets 0. If two Doves meet, they share: V/2 each. If two Hawks meet, they fight: expected payoff (V−C)/2 each (equal probability of winning, winning gives V, losing costs C).

**Payoff matrix** (symmetric, column = opponent's strategy):

| | H | D |
|--|:--:|:--:|
| **H** | (V−C)/2 | V |
| **D** | 0 | V/2 |

**Case V > C** (resource valuable, conflict cheap):
- Pure NE: (H,H) (Hawk strictly dominates Dove)
- ESS: H is ESS (u(H,H) = (V−C)/2 > 0 = u(D,H))

**Case V < C** (conflict costly):
- No pure NE (H,H): Dove would deviate. No pure NE (D,D): Hawk would deviate.
- Mixed NE: p* = V/C (prob of Hawk).

**Verification of mixed ESS**: At p* = V/C:
- u(H, p*) = p*(V−C)/2 + (1−p*)V = V/C·(V−C)/2 + (1−V/C)V = V(V−C)/(2C) + V(C−V)/C = ... = V/2 (after algebra)
- u(D, p*) = p*·0 + (1−p*)V/2 = (1−V/C)V/2 = V(C−V)/(2C) = ... Hmm, let me recalculate.

u(H, p*) = p*(V-C)/2 + (1-p*)*V
u(D, p*) = p*·0 + (1-p*)*V/2

Setting equal: p*(V-C)/2 + (1-p*)*V = (1-p*)*V/2

p*(V-C)/2 = (1-p*)*V/2 - (1-p*)*V = -(1-p*)*V/2

p*(V-C) = -(1-p*)*V

p*V - p*C = -V + p*V

-p*C = -V → **p* = V/C** ✓

**ESS secondary condition** at p* (mixed): For any σ ≠ p*H+(1-p*)D, we need u(p*, σ) > u(σ, σ). This holds in Hawk-Dove (the mixed ESS is unique and asymptotically stable under replicator dynamics).

### Bishop-Cannings Theorem (1978)

**Theorem**: If σ* is a mixed ESS with support S* = {s₁, …, sₖ}, then:
- All strategies in S* have equal fitness against σ*: u(sᵢ, σ*) = u(σ*, σ*) ∀ sᵢ ∈ S*
- Any strategy NOT in S* has strictly lower fitness: u(s, σ*) < u(σ*, σ*) ∀ s ∉ S*

This parallels the **support lemma** for Nash equilibria. ESS inherits this structure plus the stability condition.

**Implication**: In Hawk-Dove, at ESS p* = V/C, both H and D have equal fitness V/2. Non-support strategies have lower fitness — vacuously true since there are only 2 strategies here.

### ESS and Asymmetric Games

In **asymmetric games** (player roles differ), ESS applies separately to each role. A strategy pair (σ₁*, σ₂*) is ESS if each is ESS given the other's fixed play.

**Important**: In 2-player asymmetric games, pure NE that are asymmetric are always ESS — the roles prevent invasion by switching.

---

## Real-World Notes

- **Animal contests**: Aggressive vs. peaceful animals follow Hawk-Dove dynamics. Observed frequency of aggressive vs. peaceful behavior in territorial animals (lizards, deer) approximates the ESS
- **Antibiotic resistance**: Bacteria populations evolve resistance strategies. "Cooperative" (non-resistant) vs "defector" (resistant) bacteria follow evolutionary dynamics
- **Social norms**: Cooperate vs. defect in social dilemmas — evolutionary dynamics explain why cooperation persists despite individual defection incentives
- **AI agents**: Evolutionary game theory used to analyze multi-agent systems where agents adapt strategies over time (learning rules replace biological selection)
- **Marketing strategies**: Aggressive vs. accommodating pricing in oligopoly markets evolves toward ESS via learning dynamics

---

## Common Pitfalls

1. **ESS ≠ NE**: Every ESS is NE, not vice versa. The NE concept doesn't require stability against invasion; ESS does.
2. **Mixed ESS in asymmetric games**: In asymmetric games, a mixed strategy for the role-symmetric case may not be ESS because the invasion analysis must account for the two roles.
3. **ESS is a local concept**: ESS only requires stability against *small* mutant invasions. Large mutations (mass invasion) can destabilize an ESS population.
4. **Multiple ESS**: A game can have multiple ESS (like multiple strict NE). The particular ESS reached depends on the initial population composition.

---

## Related Concepts

- [[_MOC_Evolutionary_Computational|↑ Evolutionary & Computational MOC]]
- [[Replicator_Dynamics|Replicator Dynamics]]
- [[../02_Static_Games/Nash_Equilibrium|Nash Equilibrium]]
- [[../02_Static_Games/Mixed_Strategies|Mixed Strategies]]

---

## Review Questions

1. In the Hawk-Dove game with V=4, C=6, find the mixed ESS p*. Verify that u(H, ESS) = u(D, ESS) and compute the common fitness value.
2. Show that a strict Nash equilibrium (where the pure strategy strictly dominates all others given the equilibrium opponents' play) is always an ESS. Does a weak NE need to be ESS? Provide a counterexample.
3. In a 3-strategy symmetric game with payoff matrix A = [[0,1,-1],[-1,0,1],[1,-1,0]] (rock-paper-scissors), show that the unique NE (⅓,⅓,⅓) is NOT an ESS by violating the secondary condition.

---

## Sources

- Maynard Smith, J. & Price, G. (1973) — "The Logic of Animal Conflict," *Nature*
- Maynard Smith, J. (1982) — *Evolution and the Theory of Games*
- Bishop, D. & Cannings, C. (1978) — "A Generalized War of Attrition," *Journal of Theoretical Biology*

#Game_Theory #EvolutionaryComputational #EvolutionaryStableStrategies
