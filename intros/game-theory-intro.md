# Game Theory: Introduction to All Topics

This document is a guided tour of the 6 sections in the Game Theory knowledge base — a first-principles reference for engineers, economists, and researchers who model strategic interaction, equilibrium, and incentive design. The content targets advanced readers comfortable with probability, linear algebra, and optimization, and covers everything from strategic-form representations and Nash equilibria through dynamic, cooperative, mechanism-design, and evolutionary/computational game theory.

**Suggested learning path:** Fundamentals → Static Games → Dynamic Games → Cooperative Games → Mechanism Design → Evolutionary & Computational

---

## 01. Fundamentals

Game theory begins with a precise language: players choose strategies, their interactions produce payoffs, and the game's rules fix what each player knows when choosing. This module establishes the vocabulary every later concept depends on.

**What's covered:**
- **Game representations** — strategic/normal form (player set N, pure-strategy spaces Sᵢ, payoff functions uᵢ: S → ℝ), the bimatrix form, and extensive form (game tree with decision/chance/terminal nodes and information sets); the mixed extension σᵢ ∈ Δ(Sᵢ); the payoff-matrix convention — rows = Player 1, columns = Player 2, entries (u₁, u₂); finite vs infinite/continuous strategy spaces.
- **Players, strategies & payoffs** — pure vs mixed strategies; expected utility under the von Neumann–Morgenstern axioms; expected payoff uᵢ(σ) = Σ_{s∈S} σ(s)·uᵢ(s); profile notation (sᵢ, s₋ᵢ); zero-sum vs general-sum; payoff dominance. A strategy is a complete contingent plan (one action at every information set), not a single action.
- **Dominance & rationality** — strict dominance uᵢ(sᵢ, s₋ᵢ) > uᵢ(s'ᵢ, s₋ᵢ) ∀ s₋ᵢ, weak dominance, iterated elimination of dominated strategies (IEDS), common knowledge of rationality (CKR); rationalizability (Bernheim/Pearce 1984) characterized by never-best-response (NBR) elimination. Strict IEDS is order-independent; weak IEDS is not.
- **Information types** — perfect (whole tree observed) vs imperfect (information sets group indistinguishable decision nodes) vs incomplete (private payoff types — Harsanyi type space Tᵢ with common prior p) information; Bayesian games; asymmetric information → adverse selection & moral hazard. Incomplete and imperfect are orthogonal dimensions (a game can be perfect-information yet incomplete).

**Key mental models:** A strategy is a full contingent plan, not a move; a mixed strategy carries both a randomization and an epistemic (opponent-belief) interpretation; incomplete information (unknown payoff types) and imperfect information (unobserved actions) are independent axes — always name which one you mean.

---

## 02. Static Games

Static games — all players choosing simultaneously without observing one another — are the canonical setting for equilibrium analysis. Nash equilibrium is defined here along with its existence proof, its mixed-strategy extension, and the refinements (correlated equilibrium, minimax) that complete the picture for finite games.

**What's covered:**
- **Nash equilibrium & existence** — NE = mutual best response with no profitable unilateral deviation; Nash's (1950) theorem guarantees ≥ 1 NE (possibly mixed) in every finite game, proved via the Kakutani fixed-point theorem applied to the best-response correspondence (BRC); support lemma for mixed NE; uniqueness under diagonal dominance; NE need not be Pareto optimal (Prisoner's Dilemma: (D,D) is the unique NE yet is Pareto-dominated by (C,C)).
- **Mixed strategies** — the indifference principle: player i mixes to make the *opponent* indifferent across the opponent's support (not to balance i's own payoffs); support-identification algorithm; closed-form 2×2 mixing; n-player mixed NE via LP; the population-frequency reading; canonical no-pure-NE games (Matching Pennies, Battle of the Sexes).
- **Correlated & coarse correlated equilibrium** — Aumann's (1974) correlation device/mediator with obedience constraint Σ_{s₋ᵢ} p(sᵢ, s₋ᵢ)·[uᵢ(sᵢ, s₋ᵢ) − uᵢ(s'ᵢ, s₋ᵢ)] ≥ 0; the CE set is a convex polytope containing the convex hull of all NE and is solvable by LP; coarse correlated equilibrium (CCE) is the target set of no-regret learning. Containment chain: dominant ⊂ Nash ⊆ correlated ⊆ coarse correlated.
- **Minimax theorem** — von Neumann (1928): max_x min_y xᵀAy = min_y max_x xᵀAy for mixed strategies in two-player zero-sum games; a saddle point is the pure-strategy value when it exists; proved by LP duality; in zero-sum games minimax = maximin = the unique NE value. Minimax reasoning does not generalize beyond zero-sum.
- **IEDS & rationalizability** — strict-dominance elimination is order-independent and always terminates; for two-player games the rationalizable set equals the survivors of iterated strict (mixed-strategy) dominance; run IEDS to completion; weak-dominance elimination is order-dependent.

**Key mental models:** Every finite game has a (possibly mixed) NE — never conclude "no equilibrium" without checking mixed; you mix to make the *other* player indifferent, not yourself; solution concepts nest as dominant ⊂ Nash ⊆ correlated ⊆ coarse correlated, and minimax coincides with Nash only in two-player zero-sum games.

---

## 03. Dynamic Games

When players move sequentially and observe prior actions, the equilibrium concept must respect sequential rationality — no player should plan an action that would be irrational at the moment of play. Backward induction achieves this under perfect information, SPE generalizes it, and repeated games unlock cooperation via the Folk Theorems.

**What's covered:**
- **Extensive form & game trees** — decision/chance/terminal nodes; information sets encode imperfect information; strategies as complete contingent plans; behavioral vs mixed strategies with Kuhn's theorem (they coincide under perfect recall); the perfect-recall assumption; game-tree complexity.
- **Backward induction** — solve from terminal nodes upward; unique in generic finite perfect-information games; Zermelo's theorem (chess/checkers are determined — a winning-or-drawing strategy provably exists, though the ≈ 10¹²⁰-node tree makes it intractable to find); the Centipede paradox (BI predicts immediate stop, contradicting experiment); dynamic consistency.
- **Subgame perfect equilibrium** — a proper subgame starts at a singleton information set and is closed under information sets; SPE (Selten 1965) is a strategy profile that is a NE in *every* subgame; the one-shot-deviation principle is the practical test; SPE eliminates non-credible threats that plain NE permits (entry deterrence: "always fight" is a NE but not SPE); Stackelberg leadership as SPE; sequential equilibrium for imperfect information.
- **Repeated games & Folk Theorems** — infinite repetition with discount factor δ; grim-trigger and tit-for-tat; per-player minmax payoff v̄ᵢ and feasible set V*; Folk Theorem (Fudenberg–Maskin): any v ∈ V* with vᵢ > v̄ᵢ is supportable as SPE for δ near 1; cooperation is sustainable iff δ ≥ δ* — for the grim-trigger Prisoner's Dilemma δ* = (T − R)/(T − P).
- **Signaling games** — sender–receiver setup; Perfect Bayesian Equilibrium (PBE) with on-path Bayes-rule belief updating; separating vs pooling vs semi-separating equilibria; Spence (1973) education signaling; the Cho–Kreps (1987) Intuitive Criterion prunes implausible off-path beliefs; cheap talk.

**Key mental models:** Plain NE tolerates non-credible threats in sequential play — use backward induction (perfect info) or SPE via the one-shot-deviation test (general); cooperation is a SPE of a repeated game only when players are patient enough, δ ≥ δ* = (T − R)/(T − P) for grim-trigger PD; PBE must specify beliefs at every information set, and refinements like the Intuitive Criterion discipline off-path beliefs.

---

## 04. Cooperative Games

When players can form binding agreements, the question shifts from "what will they do?" to "how should the jointly created surplus be divided?" The characteristic function captures what each coalition can guarantee, and solution concepts — the core, the Shapley value, the nucleolus — prescribe stable and fair allocations.

**What's covered:**
- **Coalitional (TU/NTU) games** — characteristic function v: 2ᴺ → ℝ; superadditivity v(S∪T) ≥ v(S) + v(T); convexity v(S∪T) + v(S∩T) ≥ v(S) + v(T), which is strictly stronger and implies a non-empty core with the Shapley value inside it; transferable vs non-transferable utility; simple and weighted voting games.
- **Shapley value** — the unique value satisfying efficiency + symmetry + dummy/null + additivity; φᵢ(v) = Σ_{S ⊆ N∖{i}} [ |S|!·(|N|−|S|−1)! / |N|! ]·[v(S∪{i}) − v(S)] = expected marginal contribution over a uniformly random join order; specializes to the Shapley–Shubik power index and to SHAP for ML attribution; exact cost is 2ⁿ subsets — use sampling or TreeSHAP for large n.
- **Core & stability** — Core = {x : Σ xᵢ = v(N) and Σ_{i∈S} xᵢ ≥ v(S) ∀ S} — no coalition can block; Bondareva–Shapley theorem: the core is non-empty iff the game is balanced; the ε-core, least core, and the nucleolus (Schmeidler 1969, which lexicographically minimizes the worst coalition excess). The Shapley value lies in the core only for convex games.
- **Bargaining** — Nash bargaining problem (feasible set F, disagreement point d); the Nash solution argmax_{u∈F} (u₁ − d₁)(u₂ − d₂), characterized by PO + SYM + INV + IIA; Kalai–Smorodinsky replaces IIA with monotonicity; Rubinstein alternating-offers yields a unique SPE (first-mover share (1 − δ₂)/(1 − δ₁δ₂)), the strategic foundation for the Nash solution as δ → 1.
- **Power indices** — Banzhaf index βᵢ = swingsᵢ / Σⱼ swingsⱼ (counts swing coalitions, uniform over subsets); Shapley–Shubik index (uniform over orderings) — the two can rank voters differently; weight ≠ power (dummy voters; EU Council and UN Security Council examples).

**Key mental models:** The Shapley value is the unique efficient/symmetric/additive/dummy-respecting allocation (an average marginal contribution) but sits in the core only for convex games; the core is non-empty iff the game is balanced (Bondareva–Shapley); Banzhaf (over subsets) and Shapley–Shubik (over orderings) count power differently, and realized voting power rarely equals nominal voting weight.

---

## 05. Mechanism Design

Mechanism design — "reverse game theory" — asks: given a desired social outcome, what game should we build so that rational, self-interested players produce it? The revelation principle collapses all mechanisms to truthful direct ones; VCG achieves efficiency; auction theory targets revenue; and matching markets pair agents stably without money.

**What's covered:**
- **Revelation principle** — direct mechanisms (agents report types) with incentive compatibility (IC) and individual rationality (IR); Myerson's (1979) revelation principle — any BNE of any indirect mechanism is payoff-equivalent to a truthful direct mechanism, so it is w.l.o.g. to design over truthful direct mechanisms; dominant-strategy IC vs Bayesian IC.
- **Dominant-strategy implementation** — DSIC; the Gibbard–Satterthwaite theorem — for ≥ 3 alternatives, the only onto, DSIC, non-dictatorial social choice functions are dictatorships (an impossibility on unrestricted preferences); escape routes are restricted domains (single-peaked → Black's median voter) and quasilinear utility with money.
- **VCG mechanism** — Vickrey's (1961) second-price auction generalized; Groves payment t_i = Σ_{j≠i} v_j(o*) − Σ_{j≠i} v_j(o*_{−i}), so each agent internalizes the externality it imposes; truth-telling is a dominant strategy and the outcome is efficient; Green–Laffont impossibility — no mechanism is simultaneously efficient, DSIC, and budget-balanced.
- **Auction theory** — first-price sealed-bid BNE with bid shading b(v) = v·(n−1)/n (uniform IPV); second-price → truthful dominant strategy; the Revenue Equivalence Theorem (symmetric independent private values, same allocation and zero payoff for the lowest type ⇒ equal expected revenue); Myerson's (1981) optimal auction via virtual values ψ(v) = v − (1 − F(v))/f(v) (with ironing if irregular); the common-value winner's curse — bid conditional on having the highest signal.
- **Matching markets** — Gale–Shapley (1962) deferred acceptance yields a stable matching (no blocking pair); DA is strategy-proof for the proposing side only and produces the proposer-optimal stable matching; the rural-hospitals theorem; many-to-one school choice; the Roth–Peranson algorithm (NRMP) and kidney-exchange applications.

**Key mental models:** The revelation principle is a proof device — design a truthful direct mechanism, then verify truthfulness is an equilibrium; VCG buys efficiency and dominant-strategy truthfulness at the price of budget balance (Green–Laffont); revenue equivalence holds only under symmetric IPV, so risk aversion, correlation, or asymmetry break it; Gale–Shapley is stable and strategy-proof only for the proposing side.

---

## 06. Evolutionary & Computational

Evolutionary game theory replaces rational deliberation with selection pressure — higher-payoff strategies grow in population share — while algorithmic game theory asks how efficiently equilibria can be computed and how much strategic behavior costs society.

**What's covered:**
- **Evolutionary stable strategies (ESS)** — Maynard Smith & Price (1973); ESS ⊂ NE (every ESS is a NE, not conversely); the invasion condition — either u(σ*, σ*) > u(σ, σ*), or u(σ*, σ*) = u(σ, σ*) together with u(σ*, σ) > u(σ, σ); the Hawk–Dove mixed ESS; the Bishop–Cannings theorem; polymorphic populations.
- **Replicator dynamics** — the replicator equation ẋᵢ = xᵢ·[fᵢ(x) − f̄(x)] (a strategy's share grows when it beats mean fitness); the evolutionary folk theorem (stable rest points are NE, but not every NE is asymptotically stable); ESS ⇒ asymptotic stability under replicator dynamics, converse false; phase-portrait analysis of 2×2 games; connection to logit/best-response dynamics.
- **Population & potential games** — large anonymous population games and mean-field (McKean–Vlasov) equilibria; potential games (Monderer–Shapley 1996) admit a single potential Φ that aligns incentives, so better-response dynamics converge to a pure NE; congestion games are exactly the potential games.
- **Agent-based modeling** — the Mesa framework (Python); emergence from heterogeneous, boundedly rational agents (satisficing/imitation); spatial games on lattices; Axelrod's (1984) tournament (tit-for-tat wins — be nice, retaliatory, forgiving, and clear); social-network effects on outcomes.
- **Algorithmic game theory & price of anarchy** — routing/congestion games, Wardrop equilibrium, and Braess's paradox (adding a road can raise everyone's latency); the Price of Anarchy (Koutsoupias–Papadimitriou 1999) = worst-case NE cost / optimum, with the Price of Stability as the best-case counterpart; Roughgarden's (2009) smoothness framework PoA ≤ 1/(1 − μ) for (λ, μ)-smooth games (PoA = 4/3 for affine-latency routing); computing a NE is PPAD-complete (Lemke–Howson for two players, support enumeration for small games), while a correlated equilibrium is computable in polynomial time via LP / no-regret learning.

**Key mental models:** ESS is a NE plus robustness to invasion, and it implies asymptotic stability under replicator dynamics (but not conversely) — dynamics can even settle on non-NE rest points; potential and congestion games are the well-behaved class where simple dynamics reach a pure NE; strategic behavior costs society a bounded factor (PoA, e.g. 4/3 for selfish routing), and although Nash is PPAD-complete, correlated equilibria are efficiently learnable.

---

## Cross-Cutting Mental Models

These principles recur across every module — in equilibrium analysis, in interviews, and in applied market and mechanism design:

1. **Equilibrium = no profitable unilateral deviation** — Nash, SPE, PBE, correlated, and ESS are all fixed points where no agent, given correct beliefs about others, wants to move. Existence rests on a fixed-point theorem (Kakutani/Brouwer), which is exactly why *computing* one is hard (PPAD-completeness).

2. **Solution concepts nest, refinements shrink** — dominant ⊂ Nash ⊆ correlated ⊆ coarse correlated, while refinements (SPE, PBE, sequential, ESS, the Intuitive Criterion) carve down the NE set by demanding credibility, belief-consistency, or invasion-stability. Use the weakest concept that rules out the behavior you find implausible.

3. **Credibility and sequential rationality** — off-path threats and promises must be optimal at the moment they would be executed. Backward induction, the one-shot-deviation principle, and belief refinements all enforce this; ignoring it (plain NE in a dynamic game) predicts absurd outcomes like fighting every entrant.

4. **Patience and repetition unlock cooperation** — outcomes impossible in one shot (cooperation, collusion) become SPE once the game repeats and players are patient enough (δ ≥ δ*), per the Folk Theorems — the mathematical backbone of reciprocity, reputation, and relational contracts.

5. **Incentives, efficiency, and budget balance trade off** — you generally cannot have truthfulness, efficiency, and budget balance at once (Green–Laffont, Myerson–Satterthwaite), and dominant-strategy implementation collides with Gibbard–Satterthwaite. Good design is choosing which axiom to relax — VCG drops budget balance; the optimal auction drops efficiency for revenue.
