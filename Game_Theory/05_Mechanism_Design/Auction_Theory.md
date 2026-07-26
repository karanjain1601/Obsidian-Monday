---
title: Auction Theory
aliases: [Auction Theory, First Price Auction, Second Price Auction, Revenue Equivalence, Optimal Auction, Myerson]
tags: [Game_Theory, MechanismDesign, AuctionTheory]
domain: Game_Theory
difficulty: Advanced
created: 2026-07-26
related: [VCG_Mechanism, Revelation_Principle_and_IC, Matching_Markets]
status: complete
---

# 🔨 Auction Theory

> [!abstract] TL;DR
> Auction theory studies how to sell goods to bidders with private valuations. **First-price auction**: highest bidder wins, pays their bid. BNE bid shading for n bidders with v ~ U[0,1]: b*(v) = v(n−1)/n (bid below true value). **Second-price (Vickrey)**: highest bidder wins, pays second-highest bid — truth-telling is a weakly dominant strategy. **Revenue Equivalence Theorem (RET)**: any two auction formats that (i) award to the highest-value bidder, (ii) give zero expected payoff to the lowest type, yield the same expected revenue. **Myerson's optimal auction** (1981) maximizes revenue by allocating to the bidder with highest virtual value ψ(v) = v − (1−F(v))/f(v), which may mean not selling even when a bidder has positive value. **Winner's curse**: in common-value auctions, winning is bad news about value — rational bidders shade bids below their signal.

---

## Intuition — analogy FIRST

You're selling a **startup** at auction. Ten venture capitalists each privately estimate the company's value. In a **first-price auction** (highest bid wins, pays their bid), rational VCs don't bid their true estimate — they shade down, knowing they'd overpay by winning against lower estimates. In a **second-price auction** (pays the second-highest bid), each VC bids their true estimate: if they win, they pay someone else's lower estimate, so there's no incentive to shade.

The shocking result: **both formats generate the same expected revenue** (Revenue Equivalence Theorem)! The first-price format has lower bids but winners pay MORE; the second-price has higher bids but winners pay LESS. It balances out perfectly under symmetric IPV.

---

## How It Works

### Model: Independent Private Values (IPV)

**Symmetric IPV auction**:
- n bidders, each with private value vᵢ ~ F(v) on [0, v̄], i.i.d.
- Bidder i knows own vᵢ, not others'
- Quasilinear utility: uᵢ = (vᵢ − price)·1[win]

### Second-Price Auction (Vickrey 1961)

**Rule**: Highest bid wins; winner pays the **second-highest bid**.

**Dominant strategy**: Bid truthfully bᵢ = vᵢ for all types.

**Proof**: 
- Let b₋ᵢ = max bid of others.
- If vᵢ > b₋ᵢ: bidding truthfully wins (good). Bidding lower risks losing when winning is beneficial. Bidding higher doesn't change outcome. → Truth is weakly best.
- If vᵢ < b₋ᵢ: bidding truthfully loses (good — would pay b₋ᵢ > vᵢ, a loss). Bidding higher risks winning at a loss. → Truth is weakly best.
- If vᵢ = b₋ᵢ: tie-breaking; truth is still weakly best.

Truth-telling **weakly dominates all other strategies** — regardless of others' bids.

---

### First-Price Auction: BNE Bid Shading

**Rule**: Highest bid wins; winner pays their own bid.

**BNE with symmetric strategies** b(v) (all bidders use same bid function):

**Optimization for bidder i** with value vᵢ: max (vᵢ − b) · P(b > b(vⱼ) ∀j≠i)

If others use b(·), P(win at bid b) = P(b(v) < b)^{n-1} = (F(b⁻¹(b)))^{n-1}.

Let v = b⁻¹(b): win prob = F(v)^{n-1}. FOC (envelope theorem):

$$b^*(v) = v - \frac{\int_0^v F(t)^{n-1} dt}{F(v)^{n-1}}$$

**For v ~ U[0,1]** (F(v) = v):

$$b^*(v) = v - \frac{\int_0^v t^{n-1} dt}{v^{n-1}} = v - \frac{v^n/n}{v^{n-1}} = v - \frac{v}{n} = \frac{n-1}{n} v$$

**Result**: In first-price auction with n bidders and U[0,1] values, optimal bid = **(n−1)/n × value**.

- 2 bidders: bid ½v
- 10 bidders: bid 0.9v (more competition → less shading)
- As n → ∞: bid → v (competitive market → full competition eliminates rent)

---

## Key Concepts / Details

### Revenue Equivalence Theorem (RET)

**Theorem (Vickrey 1961, Myerson 1981)**: In the symmetric IPV model, any two auction formats that:
1. Award the item to the bidder with the **highest value**
2. Give **zero expected payoff to the lowest type** (v = 0)

yield the **same expected revenue to the seller**.

**Proof sketch** (via envelope theorem / Payoff Equivalence):

Agent i's expected payoff Vᵢ(v) in any IC mechanism satisfies:
$$V_i(v) = V_i(0) + \int_0^v P_i(t) dt$$

where Pᵢ(t) = probability of winning with type t. Two mechanisms with same allocation rule (same Pᵢ) and same Vᵢ(0) → same Vᵢ(v) → same payments (by quasilinearity). □

**Practical application**:
- First-price ≡ second-price ≡ all-pay auction ≡ Dutch auction ≡ English auction (under symmetric IPV)
- Revenue equivalence gives the seller freedom to choose format based on other criteria (simplicity, collusion resistance, etc.)

### Myerson's Optimal Auction (1981)

**Goal**: Maximize expected revenue (not just efficiency).

**Virtual value** of bidder i with type v ~ F (density f):
$$\psi(v) = v - \frac{1 - F(v)}{f(v)}$$

The term (1−F(v))/f(v) is the "information rent" the seller must leave to type v to prevent downward misreporting.

**Optimal auction**: Allocate to bidder i with **highest virtual value** (provided ψ(vᵢ) ≥ 0). If all virtual values are negative, don't sell.

**For U[0,1]**: ψ(v) = v − (1−v)/1 = 2v − 1. Set ψ(v) ≥ 0 → v ≥ ½. **Optimal reserve price = ½**.

**Revenue in optimal vs efficient auction** (n=1, U[0,1] example):
- Efficient (always sell): E[revenue] = E[v] = ½ (but leave rents)
- With reserve r = ½: E[revenue] = E[v · 1(v≥½)] − (½) · P(v≥½) = ... = 3/8 > ½/2 = ¼?

Wait, let me compute properly. With one bidder and reserve ½:
- Sell if v ≥ ½, price = ½ (posted price is optimal for monopoly)
- E[rev] = ½ × P(v≥½) = ½ × ½ = **¼**

Comparison: always sell at p=0 gives 0 revenue; always sell with truthful mechanism (second-price with no reserve, n=1) → posted price at monopoly = ½. E[rev] = ¼. Same. □

With n=2 bidders and reserve r=½:
- If both v₁,v₂ ≥ ½: sell to higher at second-highest price ≥ ½
- If only one ≥ ½: sell at ½
- If both < ½: don't sell

**Ironing**: When virtual values are non-monotone (f is not log-concave), apply "ironing" to make ψ̃(v) non-decreasing — average virtual values over an interval.

### Winner's Curse (Common Values)

**Common value auction**: True value V of the good is the same for all bidders, but each observes a private **signal** sᵢ = V + εᵢ (noisy). Example: oil tract auction, government bond auction.

**Winner's curse**: The winning bidder is the one with the HIGHEST signal. But highest signal → positively biased estimate of V. Conditioning on winning: E[V | win] < sᵢ (winning is bad news).

**Rational response**: Shade bids significantly below signal. Specifically, bid as if you had the lowest possible signal consistent with winning: b*(s) = E[V | sᵢ = s, s = max of all signals].

**Empirical evidence**: Inexperienced bidders suffer winner's curse in spectrum auctions, oil tract auctions, and experiments. Experienced bidders shade more aggressively.

**Common value BNE formula** (n bidders, V uniform, signals V±ε):
$$b^*(s) = E[V | s_i = s, s_{(n)} = s] = s - \frac{2\varepsilon}{n+1}$$

(For symmetric uniform-signal model.) As n increases, bid shading (2ε/(n+1)) decreases — more competition, less curse concern (information revealed by market price).

---

## Real-World Notes

- **Google/Facebook ad auctions**: Generalized Second Price (GSP) for keyword auctions. Not true VCG but approximates it; bidders' equilibrium behavior approximates truthful reporting in symmetric environments
- **Treasury bond auctions**: US used "discriminatory" (first-price) auctions until 1998; switched to uniform-price (closer to second-price). Revenue equivalence ≈ holds empirically
- **IPO book building**: Investment bankers collect bids from institutional investors; price-setting analogous to optimal auction with reserve
- **Real estate**: Sealed-bid offers in hot markets approximate first-price auctions; buyer shading = strategic behavior
- **FCC incentive auctions** (2016–2017): Reverse auction to buy back spectrum from broadcasters, forward auction to sell to carriers; $20B revenue — largest spectrum auction

---

## Common Pitfalls

1. **RET requires symmetric IPV** — Revenue equivalence breaks down with: asymmetric bidders (different value distributions), risk aversion, affiliated signals (common values), reserve prices. Don't over-apply RET.
2. **Second-price is dominant strategy, first-price is BNE** — DSIC vs BNE are very different. Second-price is robust; first-price BNE requires knowing n and F.
3. **Optimal auction may not sell** — Myerson's optimal auction withholds the item when all virtual values are negative. "No sale" maximizes revenue but wastes efficiency.
4. **Winner's curse applies to common values, not IPV** — In pure private values, there's no winner's curse. In correlated/common values, bid shading beyond standard adjustments is necessary.

---

## Related Concepts

- [[_MOC_Mechanism_Design|↑ Mechanism Design MOC]]
- [[VCG_Mechanism|VCG Mechanism]]
- [[Revelation_Principle_and_IC|Revelation Principle & IC]]
- [[Matching_Markets|Matching Markets]]
- [[../01_Fundamentals/Information_in_Games|Information in Games]]

---

## Review Questions

1. Compute the BNE bid function for a first-price auction with n=3 bidders and values v ~ U[0,2]. Verify that expected revenue equals the second-price auction revenue.
2. Myerson's optimal auction for n=2 bidders with v ~ U[0,1]: compute the optimal reserve price and expected revenue. Compare to second-price with no reserve.
3. In a common-value auction with V ~ U[0,1] and signals sᵢ = V + Uniform(−0.1, 0.1): if you observe s₁ = 0.7 and there are 5 bidders, what should you bid in a first-price sealed-bid auction? Set up the winner's curse correction formally.

---

## Sources

- Vickrey, W. (1961) — "Counterspeculation, Auctions and Competitive Sealed Tenders," *Journal of Finance*
- Myerson, R.B. (1981) — "Optimal Auction Design," *Mathematics of Operations Research*
- Krishna, V. (2002) — *Auction Theory* (Academic Press)
- Milgrom & Weber (1982) — "A Theory of Auctions and Competitive Bidding," *Econometrica*

#Game_Theory #MechanismDesign #AuctionTheory
