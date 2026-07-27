---
title: "Finance — Master Map of Content"
aliases: [MOC Finance Master, Finance Vault Home]
tags: [MOC, Finance, MasterMOC]
domain: Finance
created: 2026-07-27
status: complete
---

# 💰 Finance — Master Map of Content

> [!abstract] About This Vault
> A complete core-finance reference: **37 notes across 6 sections**, covering the theory and practice taught in MBA finance courses and the CFA curriculum. This vault runs the full stack — from financial markets and instruments, through corporate finance (TVM, capital budgeting, WACC, capital structure), valuation (DCF, comps, precedents, LBO), investment analysis (fundamental analysis, financial statements, fixed income), risk and return (portfolio theory, CAPM, behavioral finance), and hands-on financial modeling (three-statement model, M&A, LBO, scenario analysis). Every note pairs an intuition-first analogy with real-world examples (Apple buybacks, Amazon AWS SOTP, Microsoft/Activision), worked numerical examples, mermaid diagrams, and review questions. Start at the section matching your goal, or follow one of the four learning paths below.

---

## Vault Architecture

```mermaid
graph TD
    Master["💰 Finance Master"]

    Master --> S01["01 Financial Markets"]
    Master --> S02["02 Corporate Finance"]
    Master --> S03["03 Valuation"]
    Master --> S04["04 Investment Analysis"]
    Master --> S05["05 Risk & Return"]
    Master --> S06["06 Financial Modeling"]

    S01 --> FM1["Market Structure\n& Participants"]
    S01 --> FM2["Equity Markets"]
    S01 --> FM3["Fixed Income\nMarkets"]
    S01 --> FM4["Money Markets"]
    S01 --> FM5["Market\nMicrostructure"]

    S02 --> CF1["Time Value\nof Money"]
    S02 --> CF2["Capital\nBudgeting"]
    S02 --> CF3["WACC"]
    S02 --> CF4["Capital\nStructure"]
    S02 --> CF5["Dividend\nPolicy"]

    S03 --> V1["DCF Analysis"]
    S03 --> V2["Comparable\nCompany Analysis"]
    S03 --> V3["Precedent\nTransactions"]
    S03 --> V4["LBO Analysis"]
    S03 --> V5["Sum-of-Parts\nValuation"]

    S04 --> IA1["Fundamental\nAnalysis"]
    S04 --> IA2["Financial Statement\nAnalysis"]
    S04 --> IA3["Equity Research"]
    S04 --> IA4["Fixed Income\nAnalysis"]
    S04 --> IA5["Alternative\nInvestments"]

    S05 --> RR1["Risk & Return\nFundamentals"]
    S05 --> RR2["Portfolio Theory\nBasics"]
    S05 --> RR3["CAPM &\nFactor Models"]
    S05 --> RR4["Behavioral\nFinance"]
    S05 --> RR5["Performance\nMeasurement"]

    S06 --> MO1["Three-Statement\nModel"]
    S06 --> MO2["Excel Best\nPractices"]
    S06 --> MO3["Scenario &\nSensitivity Analysis"]
    S06 --> MO4["Mergers &\nAcquisitions"]
    S06 --> MO5["Financial\nForecasting"]

    style Master fill:#7c3aed,color:#fff
    style S01 fill:#2563eb,color:#fff
    style S02 fill:#059669,color:#fff
    style S03 fill:#d97706,color:#fff
    style S04 fill:#dc2626,color:#fff
    style S05 fill:#7c3aed,color:#fff
    style S06 fill:#0891b2,color:#fff
```

---

## Sections at a Glance

| # | Section | Notes | Entry Point | Difficulty |
|---|---------|-------|-------------|------------|
| 01 | Financial Markets | 5 | [[_MOC_Financial_Markets]] | Beginner |
| 02 | Corporate Finance | 5 | [[_MOC_Corporate_Finance]] | Beginner → Intermediate |
| 03 | Valuation | 5 | [[_MOC_Valuation]] | Intermediate → Advanced |
| 04 | Investment Analysis | 5 | [[_MOC_Investment_Analysis]] | Intermediate |
| 05 | Risk & Return | 5 | [[_MOC_Risk_Return]] | Intermediate → Advanced |
| 06 | Financial Modeling | 5 | [[_MOC_Financial_Modeling]] | Intermediate → Advanced |

---

## Learning Paths

### Path 1 — Investment Banker

> Best for: analysts and associates building deal models, pitch books, and executing M&A and capital markets transactions.

**Markets → Corporate Finance → Valuation → Modeling**

[[Market_Structure_and_Participants]] → [[Equity_Markets]] → [[Fixed_Income_Markets]] → [[Time_Value_of_Money]] → [[Cost_of_Capital_and_WACC]] → [[Capital_Structure]] → [[DCF_Analysis]] → [[Comparable_Company_Analysis]] → [[Precedent_Transactions]] → [[LBO_Analysis]] → [[Three_Statement_Model]] → [[Mergers_and_Acquisitions]] → [[Scenario_and_Sensitivity_Analysis]]

---

### Path 2 — Equity Analyst

> Best for: buy-side and sell-side analysts building investment theses, researching stocks, and writing research reports.

**Analysis → Valuation → Risk**

[[Financial_Statement_Analysis]] → [[Fundamental_Analysis]] → [[Equity_Research]] → [[DCF_Analysis]] → [[Comparable_Company_Analysis]] → [[Sum_of_Parts_Valuation]] → [[Risk_and_Return_Fundamentals]] → [[CAPM_and_Factor_Models]] → [[Performance_Measurement]] → [[Behavioral_Finance]]

---

### Path 3 — Corporate Finance Professional

> Best for: CFOs, finance managers, and treasury teams making capital allocation, financing, and dividend decisions.

**Foundations → Corporate Finance → Modeling**

[[Time_Value_of_Money]] → [[Capital_Budgeting]] → [[Cost_of_Capital_and_WACC]] → [[Capital_Structure]] → [[Dividend_Policy]] → [[Three_Statement_Model]] → [[Financial_Forecasting]] → [[Scenario_and_Sensitivity_Analysis]] → [[DCF_Analysis]]

---

### Path 4 — CFA Candidate

> Best for: Level I–III CFA candidates covering the full curriculum systematically.

- **Ethics & Markets:** [[Market_Structure_and_Participants]] → [[Equity_Markets]] → [[Fixed_Income_Markets]] → [[Money_Markets]] → [[Market_Microstructure]]
- **Corporate Finance:** [[Time_Value_of_Money]] → [[Capital_Budgeting]] → [[Cost_of_Capital_and_WACC]] → [[Capital_Structure]] → [[Dividend_Policy]]
- **Equity & Fixed Income:** [[Fundamental_Analysis]] → [[Financial_Statement_Analysis]] → [[Fixed_Income_Analysis]] → [[Equity_Research]]
- **Portfolio Management:** [[Risk_and_Return_Fundamentals]] → [[Portfolio_Theory_Basics]] → [[CAPM_and_Factor_Models]] → [[Performance_Measurement]] → [[Behavioral_Finance]]
- **Alternative Investments:** [[Alternative_Investments]]

---

## Cross-Vault Links

This vault covers core finance theory; related vaults handle quantitative methods and macro context:

- **Quantitative Finance vault** — [[Quantitative_Finance]] covers options pricing (Black-Scholes), derivatives, risk models (VaR, CVaR), and algorithmic trading — the mathematical toolkit layered on top of the concepts here.
- **Macroeconomics vault** — [[Macroeconomics]] covers GDP, inflation, monetary policy, and interest rate theory that drives the discount rates and market conditions analyzed in this vault.
- **Microeconomics vault** — [[Microeconomics]] covers supply/demand, pricing theory, and competitive dynamics underlying industry and company analysis.

---

## Section MOC Index

- [[_MOC_Financial_Markets]] — How markets are structured: exchanges, participants, equity/fixed-income/money markets, and market microstructure.
- [[_MOC_Corporate_Finance]] — The theory of the firm: TVM, investment decisions (NPV/IRR), cost of capital, capital structure (Modigliani-Miller), and dividend policy.
- [[_MOC_Valuation]] — How to value a business: DCF, comparable company analysis, precedent transactions, LBO, and sum-of-parts.
- [[_MOC_Investment_Analysis]] — How to analyze investments: fundamental analysis, financial statement analysis, equity research, fixed income analysis, and alternatives.
- [[_MOC_Risk_Return]] — The risk-return framework: diversification, portfolio theory, CAPM and factor models, behavioral finance, and performance measurement.
- [[_MOC_Financial_Modeling]] — Building financial models: three-statement model, Excel best practices, scenario/sensitivity analysis, M&A modeling, and forecasting.

#MOC #Finance #MasterMOC
