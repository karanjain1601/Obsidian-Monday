---
title: "Comparative Statics"
aliases: ["Comparative Statics Analysis", "Equilibrium Shifts", "Envelope Theorem"]
tags: [microeconomics, economics, foundations, intermediate]
domain: Microeconomics
difficulty: intermediate
created: 2026-07-27
related: ["[[Supply_and_Demand]]", "[[Market_Equilibrium]]", "[[Elasticity]]", "[[Consumer_Optimization]]", "[[Profit_Maximization]]"]
status: complete
---

# 🔄 Comparative Statics

> [!abstract] TL;DR
> **Comparative statics** is the method of comparing two equilibria — before and after a change in an exogenous parameter — without modeling the dynamic path between them. It answers "if X changes, what is the new equilibrium?" The **envelope theorem** provides the mathematical shortcut: the derivative of an optimized value function with respect to a parameter equals the partial derivative holding the choice variable fixed at its optimum.

## Intuition — analogy FIRST

Think of a thermostat-controlled room. The "equilibrium" is the target temperature. When you turn up the thermostat (a parameter change), the heater adjusts until a new, higher temperature equilibrium is reached. You don't care about every second of the heating process — you just want to know: *how much warmer will the room be?* Comparative statics is that calculation.

Economists use the same logic everywhere. How does a $10 rise in the minimum wage change employment? How does a new competitor entering a market change the incumbent's profit? How does a 20% tariff affect domestic production and prices? In each case, you find the equilibrium before, apply the change, find the equilibrium after, and compare.

---

## How It Works

```mermaid
graph LR
    Param["Parameter Change\n(tax, technology, income)"]
    Before["Initial Equilibrium\n(P₀*, Q₀*)"]
    Shift["Curve Shift\n(supply or demand)"]
    After["New Equilibrium\n(P₁*, Q₁*)"]

    Param --> Shift
    Before --> Shift
    Shift --> After
    After -->|"compare"| Before

    style Param fill:#4a9eff,color:#fff
    style Before fill:#7ed321,color:#fff
    style Shift fill:#ff6b6b,color:#fff
    style After fill:#7c3aed,color:#fff
```

## Key Concepts / Details

### The Comparative Statics Method

**Step 1**: Identify the initial equilibrium $(P_0^*, Q_0^*)$.
**Step 2**: Identify which exogenous parameter changed.
**Step 3**: Determine which curve shifts (supply or demand) and in which direction.
**Step 4**: Find the new equilibrium $(P_1^*, Q_1^*)$.
**Step 5**: Compare — sign and magnitude of changes $\Delta P^* = P_1^* - P_0^*$ and $\Delta Q^* = Q_1^* - Q_0^*$.

### Algebraic Comparative Statics

Given a linear system:
$$Q_D = a - bP + \alpha Y \qquad \text{(demand with income Y)}$$
$$Q_S = c + dP - \beta W \qquad \text{(supply with wage W)}$$

Equilibrium price:
$$P^* = \frac{a - c + \alpha Y + \beta W}{b + d}$$

Comparative statics derivatives:
$$\frac{\partial P^*}{\partial Y} = \frac{\alpha}{b + d} > 0 \quad \text{(income rises → price rises)}$$
$$\frac{\partial P^*}{\partial W} = \frac{\beta}{b + d} > 0 \quad \text{(wages rise → price rises)}$$
$$\frac{\partial Q^*}{\partial Y} = \frac{\alpha d}{b + d} > 0 \quad \text{(income rises → quantity rises)}$$

### The Four Standard Cases — Supply and Demand

| Change | Supply shift | Demand shift | $\Delta P^*$ | $\Delta Q^*$ |
|--------|-------------|-------------|------------|------------|
| Demand increases (right) | None | Right | Rises | Rises |
| Demand decreases (left) | None | Left | Falls | Falls |
| Supply increases (right) | Right | None | Falls | Rises |
| Supply decreases (left) | Left | None | Rises | Falls |

### Simultaneous Shifts — Ambiguous Cases

When both curves shift simultaneously, one effect is always determinate and one is ambiguous:

| Situation | $\Delta P^*$ | $\Delta Q^*$ |
|-----------|------------|------------|
| Both demand and supply increase | **Ambiguous** (depends on relative magnitudes) | **Rises** |
| Both demand and supply decrease | **Ambiguous** | **Falls** |
| Demand increases, supply decreases | **Rises** | **Ambiguous** |
| Demand decreases, supply increases | **Falls** | **Ambiguous** |

**Key insight**: When both curves shift, *one* of $\Delta P^*$ or $\Delta Q^*$ is always unambiguous, and the other requires knowing the relative magnitudes of the shifts.

### The Envelope Theorem

The **envelope theorem** is the mathematical foundation of comparative statics for optimization problems.

**Setup**: An agent maximizes $V(x, \alpha) = f(x, \alpha)$ by choosing $x$, where $\alpha$ is a parameter. The optimal choice is $x^*(\alpha)$ and the optimized value (value function) is:
$$V^*(\alpha) = f(x^*(\alpha), \alpha)$$

**Envelope theorem**:
$$\frac{dV^*}{d\alpha} = \frac{\partial f}{\partial \alpha}\bigg|_{x = x^*(\alpha)}$$

The derivative of the optimized value with respect to a parameter equals the direct (partial) effect of that parameter — the indirect effect through the optimal choice is **zero** (by the envelope condition, which is just the first-order condition).

**Practical consequence**: To find how a firm's maximum profit changes when input prices change, you don't need to re-solve the whole optimization — just take the partial derivative of the profit function with respect to the input price, evaluated at the optimum. This is **Hotelling's lemma** and **Shephard's lemma** in action.

### Hotelling's Lemma and Shephard's Lemma

For a firm maximizing profit $\pi(p, w, r)$ where $p$ is output price, $w$ is wage, $r$ is capital rental rate:

$$\frac{\partial \pi^*}{\partial p} = y^* \quad \text{(Hotelling: output supply)}$$
$$\frac{\partial \pi^*}{\partial w} = -L^* \quad \text{(conditional labor demand)}$$

For a firm minimizing cost $C(w, r, y)$:
$$\frac{\partial C^*}{\partial w} = L^* \quad \text{(Shephard's lemma)}$$
$$\frac{\partial C^*}{\partial r} = K^* \quad \text{(Shephard's lemma for capital)}$$

These theorems let us derive demand and supply functions from envelope derivatives without resolving optimization problems.

### SLUTSKY Equation as Comparative Statics

The Slutsky equation decomposes the comparative-static response of demand to a price change:
$$\underbrace{\frac{\partial x}{\partial p}}_{\text{total effect}} = \underbrace{\frac{\partial x^h}{\partial p}}_{\text{substitution effect}} - \underbrace{x \cdot \frac{\partial x}{\partial m}}_{\text{income effect}}$$

This is comparative statics applied to consumer theory. See [[Income_and_Substitution_Effects]] for the full treatment.

---

## Real-World Notes

- **COVID-19 supply shock**: Pandemic disrupted global supply chains (supply curve shifted left for many goods). Comparative statics predicts: price rises, quantity falls. This is exactly what happened with semiconductors, lumber, and shipping in 2020–2021.
- **Minimum wage policy analysis**: A minimum wage increase is a price floor above equilibrium. Comparative statics predicts a fall in employment (quantity of labor). The empirical debate is about the size of this effect — which depends on labor demand elasticity.
- **Carbon tax**: Taxing carbon emissions shifts the supply curve of fossil-fuel-intensive goods left (higher production cost). Comparative statics: higher consumer prices, lower consumption of dirty energy, and output of clean substitutes rises (demand shifts right for substitutes).
- **Fed interest rate hikes**: Higher interest rates raise the cost of capital → supply of goods produced with capital-intensive methods shifts left → higher prices, lower output. Also shifts demand left for interest-sensitive goods (housing, durable goods).

---

## Common Pitfalls

- **Forgetting that both price and quantity change.** Students sometimes predict only the price change and forget that quantity adjusts too — or vice versa.
- **Not checking for ambiguity in simultaneous shifts.** When both curves shift, don't just draw two arrows and assume you know both outcomes. State explicitly which effect is unambiguous.
- **Confusing exogenous and endogenous variables.** Only exogenous parameters shift curves; endogenous variables (price, quantity) move along them. Applying a price change as a "shift" is a category error.
- **Using comparative statics for large non-marginal changes without checking linearity.** The derivative-based envelope theorem is exact only locally; for large changes, use the full new equilibrium.

---

## Related Concepts

- [[_MOC_Foundations|↑ Section MOC]]
- [[Supply_and_Demand]] — The model that comparative statics is most often applied to.
- [[Market_Equilibrium]] — The starting and ending states in any comparative statics exercise.
- [[Elasticity]] — Determines the magnitude (not just sign) of equilibrium changes.
- [[Consumer_Optimization]] — The Slutsky decomposition is comparative statics for consumer theory.
- [[Profit_Maximization]] — Hotelling's and Shephard's lemmas apply comparative statics to firm optimization.

---

## Review Questions

1. The market for soybeans has $Q_D = 80 - 3P + 0.1Y$ and $Q_S = 10 + 2P - 5R$ where $Y$ is income and $R$ is rainfall (an inverse cost proxy). Find $\partial P^*/\partial Y$ and $\partial P^*/\partial R$. Interpret each.
2. A firm's profit function is $\pi(p, w) = p^2/(4w)$. Use the envelope theorem to derive the output supply function (Hotelling's lemma) and the labor demand function. Verify by solving the profit-maximization problem directly.
3. Supply and demand both shift right simultaneously. You observe that the equilibrium price is unchanged but quantity has risen. What does this imply about the relative sizes of the two shifts?

---

## Sources

- Varian, *Intermediate Microeconomics*, Ch. 2, 15
- Mas-Colell, Whinston & Green, *Microeconomic Theory*, Ch. 5
- Silberberg, *The Structure of Economics* (envelope theorem treatment)

#microeconomics #economics #foundations #comparativestatics #envelopetheorem #slutsky
