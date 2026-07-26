# Quantitative Finance: Introduction to All Topics

This document is a guided tour of the 11 sections in the Quantitative Finance knowledge base — a production-focused reference for engineers and quants building, deploying, and reasoning about systematic trading systems. The content targets practitioners who combine finance theory with software and statistics, and covers everything from the mathematical bedrock through live trading operations.

**Suggested learning path:** Mathematical Foundations → Financial Instruments → Options Theory → Portfolio Theory → Risk Management → Statistical Methods → Quantitative Strategies → Execution & Microstructure → Machine Learning → Advanced Derivatives → Backtesting & Research

---

## 01. Mathematical Foundations

The formal toolkit that underpins every subsequent module. Build fluency here before touching pricing formulas or optimization problems.

**What's covered:**
- **Linear Algebra & Calculus** — Portfolio variance as a quadratic form σ_p² = wᵀΣw; covariance matrix eigendecomposition Σ = QΛQᵀ and Cholesky factorization Σ = LLᵀ (for Monte Carlo simulation); condition number κ = λ_max/λ_min as a numerical stability signal for near-singular covariance matrices; OLS normal equations (XᵀX)β = Xᵀy; Ridge regression adding λI to the Gram matrix; Ledoit-Wolf shrinkage Σ̂_shrunk = (1−α)Σ̂_sample + αF; Taylor second-order expansion δV ≈ Δ·δS + ½Γ(δS)² + Θ·δt; MVO Lagrangian formulation.
- **Probability & Statistics** — Lognormal expectation E[S_T] = S₀exp(μT + σ²T/2); Student-t excess kurtosis 6/(ν−4) for fat-tail modeling; Sklar's theorem and copula decomposition F(x,y) = C(F_X(x), F_Y(y)); GARCH(1,1) σ²_t = ω + αε²_{t-1} + βσ²_{t-1}; CLT convergence; EVT/GPD for tail estimation.
- **Stochastic Calculus** — Brownian motion quadratic variation [W]_t = t; Itô's lemma df = (∂f/∂t + μ∂f/∂x + ½σ²∂²f/∂x²)dt + σ∂f/∂x dW; GBM solution S_t = S₀exp((μ − σ²/2)t + σW_t) — the −σ²/2 Itô correction is the defining difference from ODE intuition; OU process dX = κ(θ−X)dt + σdW; CIR process dX = κ(θ−X)dt + σ√X dW (Feller condition 2κθ > σ² for positivity); Girsanov theorem for change of measure; Feynman-Kac for solving PDEs as expectations of SDE functionals.

**Key mental models:** Itô's lemma is the chain rule for stochastic processes — always add the ½σ²∂²f/∂x²dt correction term; large condition number on the covariance matrix means your MVO will be numerically unstable; Cholesky decomposition is the standard way to generate correlated random variables for simulation.

---

## 02. Financial Instruments

The building blocks of every portfolio and derivative structure. Understand these pricing formulas and risk sensitivities before modeling anything more complex.

**What's covered:**
- **Equities & Fixed Income** — Log vs simple returns and compounding regimes; bond pricing P = Σ c_i·D(t_i) + F·D(T); Modified Duration = −(1/P)·dP/dy; DV01 = −dP/d(y/10000); Convexity = (1/P)·d²P/dy²; yield curve shapes (normal/inverted/humped) and zero-rate bootstrapping from par bonds; Nelson-Siegel parameterization y(τ) = β₀ + β₁(1−e^{−λτ})/(λτ) + β₂[(1−e^{−λτ})/(λτ) − e^{−λτ}]; PCA of the yield curve (PC1 level ≈85% variance, PC2 slope ≈10%, PC3 curvature ≈3%).
- **Derivatives & Forwards** — Forward pricing F₀ = S₀·e^{(r−q)T} for equity and F₀ = S₀·e^{(r+c−y)T} for commodities (c = storage, y = convenience yield); put-call parity C − P = S₀·e^{−qT} − K·e^{−rT}; Breeden-Litzenberger density extraction p(S_T = K) = e^{rT}·∂²C/∂K²; minimum-variance hedge ratio h* = ρ·(σ_S/σ_F); credit spread s ≈ λ(1−R).
- **Swaps & Structured Products** — IRS fair swap rate as ratio of annuity to float present values; OIS discounting and the multi-curve framework post-2008; LIBOR-OIS spread as a bank stress indicator; cross-currency basis; swaption pricing via the Black formula; variance swap payoff N(σ²_R − K_var) and model-free replication via log-contract; VIX as the 30-day variance swap rate on S&P 500 options.

**Key mental models:** Put-call parity is a no-arbitrage identity — if it breaks, there is a riskless trade; DV01 and duration measure linear rate sensitivity but convexity matters for large moves; forward prices are not expected future prices — they are the no-arbitrage futures price given the cost-of-carry.

---

## 03. Options Theory

The core of derivatives pricing. Master the Black-Scholes assumptions, understand where they break down, and learn the models that fix each failure mode.

**What's covered:**
- **Black-Scholes** — BS call formula C = S₀e^{−qT}N(d₁) − Ke^{−rT}N(d₂); d₁ = [ln(S/K) + (r−q+σ²/2)T]/(σ√T); d₂ = d₁ − σ√T; BS PDE ∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S − rV = 0; CRR binomial tree (u = e^{σ√Δt}, risk-neutral probability p = (e^{(r−q)Δt} − d)/(u−d)); American early exercise conditions (deep ITM puts, calls with large dividends).
- **Greeks & Hedging** — Delta (e^{−qT}N(d₁)), Gamma (e^{−qT}n(d₁)/(Sσ√T)), Vega (S·e^{−qT}·n(d₁)·√T), Theta (negative time decay); daily P&L attribution dV ≈ Δ·dS + ½Γ(dS)² + Θ·dt + V·dσ; second-order Greeks Vanna (∂Δ/∂σ), Volga (∂Vega/∂σ), Charm (∂Δ/∂t); variance risk premium (implied variance consistently exceeds realized variance by ~20%).
- **Volatility Surface** — Implied vol uniqueness from the Black formula; SVI parameterization for the smile: w(k) = a + b[ρ(k−m) + √((k−m)² + σ²)]; no-arbitrage surface conditions (calendar spread monotonicity, butterfly positivity); Dupire local vol σ²_L(K,T) = 2[∂C/∂T + qC + (r−q)K∂C/∂K] / [K²∂²C/∂K²]; Heston stochastic vol with Carr-Madan FFT pricing; SABR Hagan approximation for the strike smile; rough volatility (Hurst exponent H ≈ 0.1, power-law ATM vol term structure).

**Key mental models:** Black-Scholes assumes constant vol — the implied vol surface is the market's confession that this is wrong; Gamma-Theta is a zero-sum trade (long gamma earns if realized vol exceeds implied, short gamma earns the opposite); the local vol surface can be read directly from observable option prices via Dupire — it is model-free given the surface.

---

## 04. Portfolio Theory

From the single-asset risk-return tradeoff to multi-factor risk decomposition and Bayesian view incorporation. The optimization machinery that drives systematic portfolio construction.

**What's covered:**
- **Markowitz & CAPM** — QP formulation min wᵀΣw s.t. wᵀμ ≥ μ*, wᵀ1 = 1; efficient frontier; two-fund separation theorem; Capital Market Line; tangency portfolio; CAPM E[r_i] = r_f + β_i(E[r_M] − r_f); β_i = Cov(r_i, r_M)/Var(r_M); Merton impossibility theorem (mean estimation requires infinite history); beta adjustments (Blume shrinkage toward 1, Vasicek Bayesian, Dimson sum-of-lagged for illiquid stocks); Fama-MacBeth two-pass procedure.
- **Factor Models** — CAPM empirical failures and anomalies; Fama-French 3-factor (MKT + SMB + HML), Carhart 4-factor (+UMD momentum), FF5 (+RMW profitability + CMA investment); PCA factors from returns; Marchenko-Pastur noise bound λ± = σ²(1 ± √(N/T))² for identifying spurious factors; factor zoo problem and data snooping corrections; equal-risk contribution (ERC) via log-barrier formulation; Euler risk decomposition MRC_i = ∂σ_p/∂w_i, ARC_i = w_i·MRC_i, with Σ w_i·MRC_i = σ_p.
- **Black-Litterman** — Prior equilibrium returns Π = δΣw_mkt (reverse-optimized); BL posterior μ_BL = [(τΣ)^{−1} + PᵀΩ^{−1}P]^{−1}[(τΣ)^{−1}Π + PᵀΩ^{−1}Q]; τ calibration (typically 0.025–0.05); Idzorek method for confidence-specified views; 9-step implementation checklist; BL resolves the extreme-concentration problem of unconstrained MVO.

**Key mental models:** MVO is exquisitely sensitive to expected return inputs — a 1% error in means dominates the entire optimization; Black-Litterman fixes this by anchoring to market equilibrium and blending in views proportionally to their confidence; Marchenko-Pastur tells you which eigenvalues of your sample covariance matrix are pure noise.

---

## 05. Risk Management

VaR, Expected Shortfall, credit risk, and integrated economic capital — the regulatory and internal risk framework for financial institutions.

**What's covered:**
- **VaR & Expected Shortfall** — VaR_α = F_L^{−1}(α): the α-quantile of the loss distribution; parametric Normal VaR: VaR = −μ_P·h + σ_P·√h·z_α; Component VaR via Euler allocation ρ_{i,P}·σ_i·w_i·z_α; Cornish-Fisher adjustment for non-normal distributions; Historical Simulation (BRW age-weighted, Hull-White filtered HS); Monte Carlo via Cholesky decomposition with t-copula for tail dependence; ES = E[L | L > VaR_α] = μ + σ·φ(z_α)/(1−α) under normality; ES is coherent (sub-additive), VaR is not; ES_{97.5%} ≈ VaR_{99%} under normality (motivating Basel FRTB switch); Kupiec and Christoffersen backtests; Basel traffic light (green 0-4 exceptions/250 days, yellow 5-9, red 10+).
- **Credit & Liquidity Risk** — ECL = PD × LGD × EAD; rating transition Markov chains; Merton (1974) structural model (equity = call on assets, PD^Q = Φ(−d₂)); KMV Distance-to-Default = (V_A − D)/(V_A·σ_A); reduced-form hazard model Q(0,T) = exp(−∫h ds); CDS par spread s ≈ λ(1−R) with bootstrap procedure; Basel IRB ASRF capital formula with asset correlation ρ; Gaussian copula (zero upper tail dependence — caused CDO disaster); t-copula tail dependence λ_U > 0; Amihud ILLIQ, Kyle λ, Roll spread estimator; Almgren-Chriss optimal execution trajectory x*(t) = X·sinh(κ(T−t))/sinh(κT); Basel III LCR ≥ 100%, NSFR ≥ 100%.
- **Risk Integration** — Scenario P&L: δᵀΔx + ½ΔxᵀΓΔx; plausibility via Mahalanobis ellipsoid; maximum-loss scenario Δx* = −c·Σδ/√(δᵀΣδ); historical stress events table (1987 −22.6% one-day, GFC 2008 −50%, COVID 2020 −34%); reverse stress testing fragility threshold; Economic Capital EC = VaR_{99.9%,1yr} − EL; Euler EC allocation MEC_i = E[L_i | L_P = VaR_α]; RAROC = (Revenue − EL − Cost)(1−τ)/EC ≥ 12% hurdle; Basel III CET1 requirement ≈ 12-16% total.

**Key mental models:** VaR is not a coherent risk measure — two portfolios can have lower VaR than their combination; ES is coherent and is the Basel FRTB standard; the Gaussian copula's zero upper tail dependence is why AAA CDO tranches were mispriced before the GFC; RAROC is the single number connecting risk, return, and capital allocation.

---

## 06. Statistical Methods

The empirical toolkit for working with financial time series: identifying structure, modeling volatility, running regressions correctly, and reducing dimensionality.

**What's covered:**
- **Time Series & Volatility** — Weak stationarity (constant mean, autocovariance depends only on lag); random walk non-stationarity (variance grows with T); spurious regression between independent I(1) processes; ADF test (H₀ = unit root, 5% CV ≈ −2.86) and KPSS test (H₀ = stationarity, 5% CV = 0.463) — use both together; ARIMA identification via PACF/ACF; GARCH(1,1) σ²_t = ω + αε²_{t-1} + βσ²_{t-1} with stationarity condition α + β < 1, unconditional variance σ̄² = ω/(1−α−β), half-life = ln(0.5)/ln(α+β); GJR-GARCH for leverage asymmetry; DCC-GARCH for multivariate dynamics; Hamilton Markov regime switching; HAR-RV model for realized variance (daily + weekly + monthly lags).
- **Regression & Cointegration** — OLS; Frisch-Waugh-Lovell theorem as foundation of panel within estimators; Newey-West HAC standard errors (bandwidth L = ⌊4(T/100)^{2/9}⌋); Ridge, Lasso, Elastic Net; Fama-MacBeth two-step with Shanken correction for EIV bias; panel fixed effects with Hausman test (H ~ χ²_K) for RE vs FE choice; IV/2SLS with weak instrument rule (first-stage F > 10); Engle-Granger two-step cointegration (ADF on residuals, 5% CV ≈ −3.90); Johansen trace/max-eigenvalue tests for cointegration rank; VECM with adjustment speed α and cointegrating vector β; Kalman filter for dynamic hedge ratio estimation.
- **Bayesian Methods & Dimensionality Reduction** — Bayesian posterior p(θ|data) ∝ p(data|θ)·p(θ); Normal-Normal conjugate (posterior precision = prior + likelihood precision); Normal-Inverse-Gamma yielding Student-t predictive; Zellner g-prior = Ridge MAP estimator; MCMC diagnostics (R̂ < 1.1, ESS > 100); HMC/NUTS for high-dimensional posteriors; Kalman filter as exact Bayesian filter for linear Gaussian state space; PCA via leading eigenvectors; Marchenko-Pastur noise bound for factor selection; Ledoit-Wolf optimal shrinkage; ICA (FastICA) for non-Gaussian sources; t-SNE for local structure visualization.

**Key mental models:** Always test both ADF and KPSS — if they disagree, suspect a structural break; regressing two random walks on each other gives R² → 1 (spurious regression); GARCH half-life tells you how quickly volatility shocks decay; use Newey-West SEs whenever you suspect autocorrelation or heteroskedasticity in regression residuals.

---

## 07. Quantitative Strategies

The implementation of systematic trading ideas: mean reversion, momentum, statistical arbitrage, market making, and carry — with attention to signal construction, risk controls, and strategy-level Sharpe targets.

**What's covered:**
- **Mean Reversion & Momentum** — Mean reversion diagnosis: Variance Ratio VR(q) < 1, Hurst exponent H < 0.5, negative autocorrelation; OU process parameters κ (reversion speed) and half-life ln(2)/κ; half-life trading guidelines (<2d HFT, 2-10d daily, 10-30d weekly, 30-90d monthly, >90d position); Z-score entry/exit/stop levels (k_entry = 2.0, k_exit = 0.0, k_stop = 3.0); Kelly-optimal position sizing ∝ −z_t; cross-sectional momentum (Jegadeesh-Titman 12-1 month, ~1%/month gross alpha historically); TSMOM via sign(12M return) × vol-scaled position; momentum crash mechanism (implicit short put, bear market rally); crash prediction via VIX regime filter; IC-weighted multi-lookback signal combination.
- **Statistical Arbitrage & Market Making** — Avellaneda-Lee pipeline: PCA factors → residual regression → cumulated spread → OU fit → s-score = ε/σ_eq; s-score thresholds s_bo = 1.25 (open), s_bc = 0.50 (close); dollar/beta/factor neutrality constraints via null-space projection; August 2007 Quant Crisis crowding mechanism; capacity ~$1-10B per stat-arb strategy; Stoll spread decomposition s = s_op + s_inv + s_adv; Roll spread estimator ŝ = 2√(−Cov(ΔP_t, ΔP_{t-1})); Glosten-Milgrom dynamic Bayesian pricing; Kyle (1985) λ = σ_v/(2σ_u) for information asymmetry; Avellaneda-Stoikov reservation price r = s − qρσ²(T−t) and optimal half-spread δ* = 1/k + ρσ²(T−t)/2.
- **Carry Strategies** — Universal carry definition C_i = (F^expected_{t+1} − P_t)/P_t: return if prices unchanged; carry by asset class (FX forward premium, bond yield minus risk-free, commodity backwardation/convenience yield, equity dividend yield minus financing); UIP failure / Fama puzzle (empirical β̂ ≈ −0.8 in Fama regression); HML_FX carry SR ≈ 0.5-0.8; bond Cochrane-Piazzesi tent-shaped factor; commodity F = S·e^{(r+c−y)T} and Theory of Storage; carry crash risk (short vol/skewness, skewness −1.5 to −2.0, VIX correlation −0.5); Peso problem adjustment to apparent Sharpe ratio; AMP three-factor (carry + momentum + value) combined SR ≈ 1.0-1.3.

**Key mental models:** Carry is compensation for being short volatility — it has persistent positive expected return but large crash risk; momentum's worst enemy is the bear-market rally; stat arb capacity is limited by market impact — the Avellaneda-Lee s-score framework provides the signal, but position sizing and risk controls determine realized Sharpe; Kelly criterion gives the growth-optimal fraction but use half-Kelly in practice.

---

## 08. Execution & Microstructure

How price formation works at the order book level, how to minimize the cost of executing large orders, and how algorithmic trading and HFT systems are built and regulated.

**What's covered:**
- **Market Microstructure** — LOB microprice = (P_ask·Q_bid + P_bid·Q_ask)/(Q_bid + Q_ask); order book imbalance OBI = (Q_bid − Q_ask)/(Q_bid + Q_ask); Stoll (1978) spread decomposition (order processing + inventory + adverse selection); spread measures (quoted, effective, realized, price impact); Roll model Cov(ΔP_t, ΔP_{t-1}) = −s²/4; Kyle (1985) λ = σ_v/(2σ_u); order flow imbalance (Cont-Kukanov-Stoikov 2014, R² ≈ 60-80% of mid-price changes); square-root impact law MI ∝ σ√(Q/V); propagator model G(τ) = G₀τ^{−β}, β ≈ 0.5; Amihud ILLIQ; PIN; VPIN toxicity; intraday U-shaped volume profile.
- **Optimal Execution** — Implementation Shortfall (Perold): IS = delay cost + spread + market impact + opportunity cost; Almgren-Chriss ODE ẍ = κ²x with solution x*(t) = X·sinh(κ(T−t))/sinh(κT); urgency parameter κT (large = aggressive front-loaded, small = passive TWAP-like); TWAP (linear schedule), VWAP (volume-profile weighted), POV (participate at ρ·V_t), IS (dynamic urgency); alpha decay correction to urgency parameter; Obizhaeva-Wang resilience model for fast-recovering books; SOR KKT venue allocation q*_k = (μ − s_k/2)/(2λ_k); Garleanu-Pedersen aim portfolio with transaction costs; break-even half-spread = μ_g/(2·TO).
- **Algo Trading & HFT** — Execution stack: PM → OMS → EMS → Algo → SOR → Exchange; speed hierarchy (FPGA 1-10μs, software 10-100μs, co-lo HFT 1-5ms, institutional 5-50ms); microwave vs fiber (NYSE↔CME 2ms vs 4ms); latency arbitrage; HFT market maker break-even from spread minus adverse selection; Hawkes process for order arrival; Lee-Ready classification algorithm (70-80% accuracy); Flash Crash (May 6, 2010) mechanism — hot potato effect, VPIN spike, 9% drop in minutes; Knight Capital (2012) $440M loss in 45 minutes from legacy code; regulatory table (Reg NMS, MiFID II, MAR); Budish-Cramton-Shim batch auction proposal.

**Key mental models:** The square-root impact law MI ∝ σ√(Q/V) means doubling order size roughly increases impact by 41% — not 2×; Almgren-Chriss gives the optimal execution schedule given a risk aversion λ over execution shortfall variance; VWAP minimizes tracking error to the daily volume profile but ignores alpha decay; IS algorithms balance alpha decay against market impact.

---

## 09. Machine Learning for Finance

Applying ML to systematic trading: the structural challenges of low-SNR financial data, the right cross-validation methods, supervised and ensemble models, neural networks, and reinforcement learning for portfolio and execution problems.

**What's covered:**
- **Supervised Learning & Features** — Structural challenges: SNR ≈ 1-5% (prediction R² often < 1%), non-stationarity, look-ahead bias, fat tails, serial correlation, crowding; purged walk-forward CV (López de Prado: purge H bars before test fold, embargo H/2 bars after); CPCV for distributional inference on OOS Sharpe; IC (Spearman rank correlation), ICIR = IC/std(IC); Grinold's law IR ≈ IC·√N_independent_bets; OOS R² (Campbell-Thompson) = 1 − Σ(r−r̂)²/Σ(r−r̄)²; feature types — price/volume (MOM_{12,1}, REV_1, MACD, RVol, IVOL), fundamental (E/P, B/M, gross profitability, SUE, accruals, Piotroski F-score, CAPE), NLP (Loughran-McDonald sentiment, Fog Index); signal decay IC(h) = IC(1)·e^{−ρh}; optimal holding horizon H* = 1/(2ρ).
- **Ensemble Methods & Neural Networks** — CART impurity-based splits; Random Forest OOB error; residual variance floor = ρ_tree·σ²_tree; MDI vs MDA feature importance; Gradient Boosting sequential residual fitting; XGBoost second-order Taylor approximation with optimal leaf weight w*_j = −G_j/(H_j + λ); LightGBM GOSS (5-10× speed via gradient-based one-side sampling); SHAP Shapley axioms (efficiency, symmetry, linearity, null player), TreeSHAP O(TLD²); PSR/DSR (Bailey-López de Prado): PSR = Φ((ŜR − SR*)√(T−1)/denom); MinBTL ≈ 120 months for SR̂ = 1.0; LSTM forget gate bias initialization b_f = 1 critical for long-sequence gradient flow; Transformer scaled dot-product attention Attn(Q,K,V) = softmax(QKᵀ/√d_k)V; Deep Hedging (Buehler 2019) training on real-world measure to minimize hedging error directly.
- **Reinforcement Learning & Validation** — MDP tuple (S, A, P, R, γ); Bellman equations for V* and Q*; DQN with experience replay and target network; Double DQN for overestimation bias; PPO with ε = 0.2 clipped surrogate objective; RL portfolio (state = (w_{t-1}, returns, vols, factors), reward = PnL − TC); RL execution (state = (q/Q₀, τ, σ, OBI), Actor-Critic matching Almgren-Chriss analytical solution); walk-forward CV (expanding vs rolling window, IS/OOS ratio 10:1-20:1 for macro); backtest bias taxonomy (look-ahead, survivorship, selection, time-period, overfitting); multiple testing corrections (Bonferroni, BH FDR, BHY FDR); HLZ t-thresholds by era (pre-1980: t > 1.96, post-2003: t > 3.00); key deployment thresholds: NW t > 3.00, PSR > 0.95, DSR > 0.95.

**Key mental models:** Standard k-fold CV on financial time series leaks future information — always use purged walk-forward CV with an embargo period; the single most important diagnostic is IS/OOS IC decay ratio (target 0.3-0.7 — below 0.3 is overfit, above 0.7 is suspicious); PSR/DSR account for non-Gaussianity of returns and multiple testing simultaneously — never deploy without DSR > 0.95.

---

## 10. Advanced Derivatives

Short-rate models for the full yield curve, stochastic volatility for option surface calibration, and exotic structures including variance swaps, CDOs, and credit derivatives.

**What's covered:**
- **Interest Rate Models** — All affine short-rate models produce bond prices P(t,T) = exp(A(τ) − B(τ)r_t) with A, B satisfying Riccati ODEs; Vasicek (1977): dr = κ(θ−r)dt + σdW — Gaussian, negative rates possible, closed-form bond options; CIR (1985): dr = κ(θ−r)dt + σ√r dW — Feller condition 2κθ > σ² ensures r_t > 0, non-central χ² conditional distribution; Hull-White (1990): time-dependent drift θ(t) chosen to fit the initial curve exactly, caplet = bond put via Jamshidian decomposition, trinomial tree pricing; G2++ two-factor model with two correlated OU factors and richer yield curve shapes; HJM framework (no-arbitrage drift determined by volatility: α(t,T) = σ(t,T)·∫_t^T σ(t,u)du); LIBOR market model as lognormal HJM.
- **Heston & SABR Models** — Heston (1993): dS = rS dt + √v S dW^S; dv = κ(θ−v)dt + ξ√v dW^v; correlation d⟨W^S, W^v⟩ = ρ dt; characteristic function in Gatheral/Albrecher reparametrization (numerically stable, avoids branch cuts); Lewis (2001) single real integral formula; Carr-Madan FFT (grid N = 2^12, damping α = 1.5, O(N log N) for all strikes at one maturity); Full-Truncation Euler and Quadratic-Exponential MC schemes; two-step calibration (ATM term structure → v₀, κ, θ; skew → ρ, ξ); Bates model adding log-normal jumps; rough Heston (H ≈ 0.1) for power-law ATM term structure; SABR (Hagan 2002) with parameters α (level), β (backbone), ρ (skew), ν (curvature) and Hagan lognormal approximation; Shifted SABR for negative rates.
- **Variance Swaps & Credit Derivatives** — Variance swap payoff N(σ²_R − K_var); Neuberger log-contract model-free replication; VIX² discretization formula; Heston analytical K_var = θ + (v₀−θ)(1−e^{−κT})/(κT); VRP ≈ −2 variance points/month; vol swap convexity gap K_vol ≈ √K_var − Var[σ_R]/(8K_var^{3/2}); dispersion trade (sell index variance, buy single-stock variance); CDS hazard rate bootstrap procedure and CS01; CDO Gaussian copula (conditional PD given market factor M, LHP large-homogeneous-portfolio limit, equity/mezz/senior tranche EL via one-dimensional quadrature); Gaussian copula's zero upper tail dependence as root cause of CDO mispricing in GFC; base correlation quoting convention; Vasicek (2002) infinite-granularity formula = Basel IRB ASRF.

**Key mental models:** Hull-White can fit any initial yield curve exactly because θ(t) is a free function — Vasicek and CIR cannot; the Heston characteristic function must use the Albrecher reparametrization to avoid branch-cut discontinuities in FFT pricing; the Gaussian copula's zero tail dependence means joint extreme losses are underpriced — the t-copula fixes this; variance swap fair value is model-free given the full options surface.

---

## 11. Backtesting & Research

The discipline that separates real alpha from noise. Correct simulation methodology, rigorous out-of-sample validation, live deployment gates, and operational monitoring.

**What's covered:**
- **Backtesting Framework** — Vectorized vs event-driven simulation (vectorized positions.shift(1) × returns − |trades|·TC is fast but requires careful look-ahead prevention; event-driven MarketEvent → SignalEvent → OrderEvent → FillEvent → NAV is natural but 10-1000× slower); bar timestamp = bar end, execute at Open(t+1) (shift(1)); PIT fundamental data (use announcement date not period-end — prevents 4-8 week look-ahead); survivorship bias correction via PIT constituent database; execution modeling (fill = mid + s/2 + ησ√(Q/V), volume cap φ ≤ 25%, short borrow costs); TC drag ΔS = 2c·TO/σ_ann; break-even turnover TO* = S_gross·σ_ann/(2c); performance metrics (CAGR, Sharpe SE = √((1 + S²/2)/T), Sortino, Calmar ≥ 0.5, Ulcer Index); Kelly fraction f* with half-Kelly in practice; Brinson-Hood-Beebower attribution; strategy capacity C* = (CAGR_gross/c₂)² × ADV.
- **Walk-Forward Validation** — Rolling (fixed IS length) vs anchored (expanding IS) WFA; IS/OOS ratio R guidelines (3:1-5:1 HFT, 10:1-20:1 macro); minimum IS sample T_IS^min = K·(z_{1−α}√(1+S*²/2)/S*)²; WFA efficiency ratio η = S_OOS/S_IS (>0.8 excellent, <0.2 failure, <0 pathological); per-fold η variance signals instability; parameter stability score = 1 − std(θ̂_j)/range(Θ_j), below 0.5 indicates overfitting; purged CV with embargo; CPCV (N=6, k=2) for 15 OOS paths and distributional inference; DSR > 0.95 as deployment threshold; backtest overfitting theorem (E[max Ŝ] ≈ √(2 ln K)/√T, MinBTL ≈ 576 for K=100); HLZ t-thresholds; White's Reality Check and Hansen's SPA test.
- **Live Trading Transition** — Backtest-to-live gap = S_backtest − ΔS_overfit − ΔS_execution (typical gap: 0.5-2 Sharpe units or 30-60% of IS Sharpe); deployment pipeline: WFA gate → paper trading ≥ 3 months → live at 5% notional ≥ 1 month → full deployment with monthly recalibration; paper trading statistical comparison test t = (Ŝ_paper − Ŝ_OOS)/√(SE₁² + SE₂²); OMS architecture (MarketData → SignalGen → RiskCheck → OrderRouter → ExecAlgo → BrokerAPI → FillBlotter → PostTradeRisk); pre-trade risk checks (position limits, sector limits, VaR check, velocity controls); circuit breakers (−5% alert, −8% reduce 50%, −10% halt, −15% shutdown); monitoring anomaly threshold |z| = |(metric − μ_hist)/σ_hist| > 3; common failure modes (doubled orders → idempotency key, wrong-side fill → directional assertions, latency creep, IC decay from crowding); strategy capacity degradation (doubling AUM → 41% more impact drag, 10× AUM → 3.16× more drag).

**Key mental models:** Any backtest without purging and embargo is contaminated by lookahead — the IC should be near zero at lag −1 and peak at lag 0; the expected maximum Sharpe from K trials grows as √(2 ln K/T) — always deflate your IS Sharpe by this amount; live shortfall vs backtest is largely market impact — model fill = mid + ησ√(Q/V) and measure η from post-trade data; never go full notional without a paper trading gate and a small-size live gate.

---

## Cross-Cutting Mental Models

These principles thread through every module and come up repeatedly in both interview contexts and production system design:

1. **Itô correction changes everything** — When a process is driven by Brownian motion, the drift acquires a −σ²/2 correction from Itô's lemma. GBM's expected log return is μ − σ²/2, not μ. This distinction is the foundation of all option pricing and risk-neutral valuation.

2. **The square-root law governs impact** — Market impact scales as MI ∝ σ√(Q/V). Doubling order size increases impact by ~41%, not 100%. This nonlinearity is why strategy capacity degrades superlinearly with AUM, and why large orders must be sliced across time.

3. **IS/OOS decay ratio 0.3-0.7 is the overfit diagnostic** — Below 0.3 means you overfit the in-sample period. Above 0.7 is suspicious (possibly data leak or too simple a model). This ratio, combined with DSR > 0.95, is the primary gate before live deployment.

4. **RAROC ≥ 12% connects risk, return, and capital** — Every trade, strategy, or business line can be evaluated on RAROC = (Revenue − EL − Cost)(1−τ)/EC. Below the hurdle rate, you are destroying capital. This single metric ties together modules 04-05 and the backtesting framework in module 11.

5. **Purge and embargo in CV, always** — Standard k-fold cross-validation leaks future information through serial correlation. López de Prado's purged CV removes training rows within H−1 bars of the test fold, and adds an embargo of H/2 bars after. Skipping this step makes your OOS Sharpe estimate an overestimate of live performance.
