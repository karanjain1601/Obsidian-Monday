---
title: Static Games — Section MOC
aliases: [Static Games MOC]
tags: [Game_Theory, StaticGames, MOC]
domain: Game_Theory
created: 2026-07-26
status: complete
---

# ⚖️ Static Games — Section MOC

> [!abstract] Section Overview
> Static (simultaneous-move) games are the core laboratory of game theory. Players choose strategies simultaneously without observing each other's choices. This section covers the central equilibrium concepts: Nash equilibrium (fixed point of best responses), mixed strategies (indifference principle), correlated equilibrium (mediated coordination), and the minimax theorem (zero-sum game value).

---

## Concept Map

```mermaid
graph TD
    SG[Static Games] --> NE[Nash Equilibrium]
    SG --> MS[Mixed Strategies]
    SG --> CE[Correlated Equilibrium]
    SG --> MM[Minimax Theorem]

    NE --> DS[Dominant Strategy Eq.]
    NE --> MNE[Mixed NE via Indifference]
    MS --> SUP[Support Lemma]
    MS --> IND[Indifference Principle]
    CE --> CCE[Coarse Correlated Eq.]
    CE --> LP[LP Characterization]
    MM --> ZS[Zero-Sum Value]
    MM --> SAD[Saddle Point]

    DS -.->|subset| NE
    NE -.->|subset| CE
    CE -.->|subset| CCE
```

---

## Notes in This Section

| Note | Core Idea | Difficulty |
|------|-----------|-----------|
| [[Nash_Equilibrium\|Nash Equilibrium]] | Fixed point of BRs; Nash 1950 existence; uniqueness; Pareto sub-optimality | Intermediate |
| [[Mixed_Strategies\|Mixed Strategies]] | Indifference principle; 2×2 closed form; support identification; Matching Pennies | Intermediate |
| [[Correlated_Equilibrium\|Correlated Equilibrium]] | Aumann 1974; obedience constraint; LP; no-regret learning → CCE | Intermediate |
| [[Minimax_Theorem\|Minimax Theorem]] | Von Neumann 1928; saddle point; LP duality proof; zero-sum value | Intermediate |

---

## Equilibrium Hierarchy

```
Dominant Strategy Eq. ⊂ Nash Eq. ⊆ Correlated Eq. ⊆ Coarse Correlated Eq.
```

## Learning Path

```
Nash_Equilibrium → Mixed_Strategies → Minimax_Theorem → Correlated_Equilibrium
```

## Key Questions

1. Does every finite game have a Nash equilibrium?
2. How do you find mixed NE using the indifference principle?
3. What can a mediator achieve that Nash equilibria cannot?
4. Why does the minimax theorem hold only for zero-sum games?

---

## Related Sections

- [[_MOC_Game_Theory_Master|↑ Master MOC]]
- [[../01_Fundamentals/_MOC_GT_Fundamentals|← Fundamentals]]
- [[../03_Dynamic_Games/_MOC_Dynamic_Games|→ Dynamic Games]]

#Game_Theory #StaticGames #MOC
