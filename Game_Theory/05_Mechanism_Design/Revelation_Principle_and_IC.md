---
title: Revelation Principle and Incentive Compatibility
aliases: [Revelation Principle, IC, DSIC, Myerson 1979, Gibbard-Satterthwaite]
tags: [Game_Theory, MechanismDesign, RevelationPrinciple]
domain: Game_Theory
difficulty: Advanced
created: 2026-07-26
related: [VCG_Mechanism, Auction_Theory, Information_in_Games]
status: complete
---

# 📜 Revelation Principle and Incentive Compatibility

> [!abstract] TL;DR
> A **mechanism** is a game form (message space + outcome function) that implements a social choice function. The **Revelation Principle** (Myerson 1979): for any mechanism with a Bayesian Nash Equilibrium σ*, there exists a **direct mechanism** (where messages = type reports) where truthful reporting is a BNE yielding the same outcomes and payoffs. This reduces the design space to **incentive compatible (IC) direct mechanisms**. **DSIC** (dominant strategy IC) is the strongest notion: truth-telling is optimal regardless of others' reports. **Gibbard-Satterthwaite** (1973/1975): any DSIC non-dictatorial social choice function over ≥3 alternatives must be a dictatorship — impossibility! Escape routes: restricted domains (single-peaked preferences → Black's median voter theorem), quasilinear utility + monetary transfers (VCG mechanism).

---

## Intuition — analogy FIRST

Imagine you're designing a **tax system** to fund a public good. Citizens have private valuations for the public good (their "types"). You need to know these valuations to determine optimal provision, but citizens will lie to reduce their taxes.

The revelation principle says: **don't bother with complex reporting games**. Instead, just ask everyone to directly reveal their valuation, and design the tax rule so that truthful revelation is each person's best strategy. Any outcome achievable by a clever indirect mechanism (where citizens play strategic games) can be replicated by an appropriately designed direct mechanism where truth-telling is optimal.

This massively simplifies mechanism design: instead of searching over all possible game forms, just search over direct truthful mechanisms.

---

## How It Works

### Mechanisms Formally

**Social choice setting**:
- N = {1, …, n} agents with types θᵢ ∈ Θᵢ (private information)
- Outcome space O (e.g., allocations of goods + transfers)
- Social choice function (SCF) f: Θ → O

**Mechanism** M = (M₁, …, Mₙ, g) where:
- Mᵢ — message space for agent i (reports, not necessarily types)
- g: M → O — outcome function mapping messages to outcomes

**Implementation**: Mechanism M **implements** SCF f if there exists an equilibrium σ* of the mechanism's induced game such that g(σ*(θ)) = f(θ) for all θ ∈ Θ.

**Direct mechanism**: Mᵢ = Θᵢ (agents report types directly). Outcome function g: Θ → O.

**Truthful mechanism**: σᵢ*(θᵢ) = θᵢ (truth-telling is the equilibrium strategy).

### The Revelation Principle

**Theorem (Myerson 1979)**: If mechanism M with equilibrium strategy profile σ* implements SCF f, then the direct mechanism M' = (Θ₁×…×Θₙ, g') with g'(θ) = g(σ*(θ)) implements f with truth-telling as an equilibrium.

**Proof sketch**:
- Define the "simulation" direct mechanism: when agents report types, mechanically compute σ*(θᵢ) and feed into original mechanism
- Agent i's incentive to misreport in M': reporting θ̂ᵢ ≠ θᵢ gives outcome g'(θ̂ᵢ, θ₋ᵢ) = g(σ*(θ̂ᵢ), σ*(θ₋ᵢ))
- But in original mechanism M, agent i with type θᵢ chose σ*ᵢ(θᵢ) over σ*ᵢ(θ̂ᵢ) (equilibrium condition)
- Therefore, truth-telling in M' is at least as good as misreporting. ✓

**Scope**: The revelation principle applies to BNE, ex-post NE, and dominant strategy equilibria — each gives a corresponding IC notion.

---

## Key Concepts / Details

### Incentive Compatibility Notions

**Dominant Strategy IC (DSIC)**: Truth-telling is a dominant strategy for every agent, regardless of others' reports:
$$u_i(\theta_i, f(\theta_i, \theta_{-i})) \geq u_i(\theta_i, f(\hat{\theta}_i, \theta_{-i})) \quad \forall \hat{\theta}_i \in \Theta_i, \forall \theta_{-i} \in \Theta_{-i}$$

**Bayesian IC**: Truth-telling is optimal in expectation over others' types:
$$\mathbb{E}_{\theta_{-i}}[u_i(\theta_i, f(\theta_i, \theta_{-i}))] \geq \mathbb{E}_{\theta_{-i}}[u_i(\theta_i, f(\hat{\theta}_i, \theta_{-i}))] \quad \forall \hat{\theta}_i$$

**Ex-post IC**: Truth-telling is optimal after learning others' true types (stronger than Bayesian IC, weaker than DSIC).

**Hierarchy**: DSIC ⊂ Ex-post IC ⊂ Bayesian IC (in terms of stringency).

DSIC is most robust (doesn't require agents to know the prior or others' types) but hardest to achieve.

### Individual Rationality (IR)

**IR (Participation constraint)**: Agent i voluntarily participates iff their utility ≥ outside option (typically 0):
$$u_i(\theta_i, f(\theta_i, \theta_{-i})) \geq 0 \quad \forall \theta_i$$

Mechanisms must satisfy both IC and IR simultaneously — a joint constraint.

### Gibbard-Satterthwaite Impossibility (1973/1975)

**Theorem**: Any social choice function f: Θ → A (A = finite set of ≥3 alternatives) satisfying:
1. **Onto** (every alternative is chosen for some type profile)
2. **DSIC**
must be a **dictatorship** (there exists agent i such that f(θ) ∈ argmaxₐ uᵢ(a, θᵢ) ∀θ).

**Implication**: If we want DSIC and non-dictatorship with ≥3 alternatives, it's **impossible**.

**Proof structure**: Based on Arrow's impossibility theorem for social welfare functions. Arrow's theorem → Gibbard-Satterthwaite via the Gibbard-Satterthwaite lemma (monotone + onto + DSIC = dictatorship).

**Connection to Arrow**: Arrow: collective rationality (transitivity) + IIA + Pareto efficiency + non-dictatorship → impossible. GS: onto + DSIC + ≥3 alternatives → dictatorship. Both show fundamental limits of aggregating preferences.

### Escape Routes from Gibbard-Satterthwaite

**Route 1 — Restricted domains**: If agents have single-peaked preferences over a linear order of alternatives:
- **Black's median voter theorem**: The median voter's preferred alternative is the unique Condorcet winner and is DSIC implementable.
- **Application**: Referendums over policy positions (spend more/less on education), voting on committee sizes.

**Route 2 — Quasilinear utility + transfers**: If uᵢ(a, t) = vᵢ(a) + tᵢ (value for outcome + money transfer):
- Transfers break the impossibility: now the outcome space includes money
- **VCG mechanism** achieves DSIC + efficiency (see [[VCG_Mechanism|VCG]])
- GS applies to allocation-only social choices; with transfers, the range of the SCF expands

**Route 3 — Weaker IC**: Use Bayesian IC instead of DSIC:
- More mechanisms are implementable in BNE
- Myerson's optimal auction is Bayesian IC

**Route 4 — Relaxing "onto"**: Restrict to a subset of alternatives where a non-dictatorial DSIC mechanism exists.

### Myerson-Satterthwaite Impossibility (1983)

Even with quasilinear utility and transfers, bilateral trade is subject to fundamental limits:

**Theorem**: There is no mechanism for bilateral trade (buyer value v_B ~ F_B, seller cost c_S ~ F_S with overlapping supports) that simultaneously achieves:
1. DSIC
2. IR (both parties participate voluntarily)
3. Budget balance (no outside subsidy)
4. Efficiency (trade occurs iff v_B ≥ c_S)

**Implication**: Efficient bilateral trading without subsidies is impossible under private information. Some trades that should occur (v_B > c_S) won't happen in any IC, IR, BB mechanism.

---

## Real-World Notes

- **Tax design**: Mirrlees (1971) optimal income tax is a DSIC mechanism over ability types (private info). Tax schedule implements efficient labor supply while satisfying IC
- **Spectrum auctions**: FCC uses auction mechanisms designed with IC in mind. Combinatorial auction formats balance efficiency and IC
- **Healthcare**: Hospital residency matching uses DSIC-compatible Gale-Shapley algorithm on the proposing (hospitals') side
- **Recommendation systems**: Netflix, Spotify — eliciting genuine preferences (stars, listens) for personalization; IC design prevents gaming
- **AI systems**: RLHF (Reinforcement Learning from Human Feedback) implicitly designs a mechanism where human raters reveal preferences. IC issues arise when raters game the system

---

## Common Pitfalls

1. **Revelation principle doesn't guarantee DSIC** — It says any BNE mechanism = a BIC direct mechanism. Getting DSIC requires the original mechanism to have a dominant strategy equilibrium.
2. **GS applies to pure allocation, not transfer mechanisms** — Adding monetary transfers escapes GS (VCG is DSIC and non-dictatorial with transfers).
3. **IR and IC are separate constraints** — A DSIC mechanism may not satisfy IR (agents might prefer not to participate). Both must hold simultaneously.
4. **"Implementation" vs "achieving"** — A mechanism implements f if the equilibrium outcome equals f(θ). It doesn't mean players play truthfully in all mechanisms; indirect mechanisms can implement through non-truthful equilibria.

---

## Related Concepts

- [[_MOC_Mechanism_Design|↑ Mechanism Design MOC]]
- [[VCG_Mechanism|VCG Mechanism]]
- [[Auction_Theory|Auction Theory]]
- [[Matching_Markets|Matching Markets]]
- [[../01_Fundamentals/Information_in_Games|Information in Games]]

---

## Review Questions

1. State and prove the revelation principle for dominant strategy implementation. (Hint: Show that if truth-telling is not a dominant strategy in the direct mechanism, there would exist a profitable deviation in the original mechanism, contradicting the dominant strategy equilibrium assumption.)
2. Give a concrete example of a 3-alternative social choice problem with 2 agents that has no DSIC non-dictatorial mechanism. Show explicitly that any two non-dictatorial SCFs fail DSIC for some type profile.
3. Single-peaked preferences: agents rank policy levels x ∈ {1,2,3,4,5} with single peaks. Prove that the median voter's peak is DSIC. When does a voter gain by misreporting their peak?

---

## Sources

- Myerson, R.B. (1979) — "Incentive Compatibility and the Bargaining Problem," *Econometrica*
- Gibbard, A. (1973) — "Manipulation of Voting Schemes," *Econometrica*
- Satterthwaite, M. (1975) — "Strategy-proofness and Arrow's Conditions," *Journal of Economic Theory*
- Myerson & Satterthwaite (1983) — "Efficient Mechanisms for Bilateral Trading," *JET*

#Game_Theory #MechanismDesign #RevelationPrinciple
