---
title: "Zipf's Law — City Size Distribution"
id: SM147
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, complexity, zipf-law, power-law, city-sizes, rank-frequency]
---

> **What it is:** A ~45-second simulation short where a bar chart of world cities ranked by population reveals each city is roughly half the size of the one above it, and a log-log rank-size plot shows a perfect straight line with slope -1 spanning four orders of magnitude, demonstrating how Zipf's law emerges from proportional Gibrat growth with a reflecting lower barrier. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Zipf's Law — City Size Distribution

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A bar chart of world cities by population — New York, Los Angeles, Chicago... Each city is exactly half the size of the one above it. The rank-size rule: rank × population = constant. This is Zipf's law — and it applies to cities, word frequencies, income, and company sizes, everywhere.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Zipf's law: if you rank cities by population, the nth largest city has population P_n ∝ 1/n^α with α≈1. New York (rank 1): 8M. Los Angeles (rank 2): 4M. Chicago (rank 3): 2.7M. Caption: "Zipf: P_n ∝ 1/n — rank × population ≈ constant." G.K. Zipf (1949). Log-log plot: straight line, slope=-1.

**0:10–0:18** — Words and language: Zipf originally studied word frequencies in English. "The" (rank 1): ~7% of all words. "Of" (rank 2): ~3.5%. Each word at rank r has frequency ∝ 1/r. Caption: "Word frequency: 'the' (rank 1), 'of' (rank 2) — always exactly Zipf." Show the word frequency rank plot from a text corpus.

**0:18–0:27** — City growth model: Gabaix (1999) — if each city's growth rate is independent and drawn from the same distribution (Gibrat's law: growth ∝ size), the distribution converges to Zipf's law. The log-normal distribution with a lower reflecting barrier gives Zipf. Caption: "Gibrat's law + lower barrier → Zipf distribution for cities."

**0:27–0:36** — Simulation: N=1000 "cities" grow according to Gibrat's law: ln(P_{n,t+1}) = ln(P_{n,t}) + ε_n with ε_n ~ N(0,σ²). Add a reflecting barrier at P_min (cities don't disappear). After long time: Zipf's law emerges. Caption: "Gibrat's law: random proportional growth → Zipf." Show rank-size plot over time.

**0:36–0:45** — Other Zipf distributions: income (top tail), company sizes, frequency of gene expression, frequency of papers cited, number of links per webpage. Caption: "Genes, companies, papers, webpages — Zipf everywhere." The universality mystery: why does Zipf appear so widely? Bold text: "Zipf's law — rank times frequency is always constant." Fade to black.

## Physics Concept Teased
Zipf's law: the nth most frequent item has frequency proportional to 1/n. Equivalently, the rank-frequency plot is a power law with exponent -1. For city sizes, Zipf's law emerges from Gibrat's law (proportional growth) with a reflecting barrier. The same mechanism applies to word frequencies, firm sizes, and many other rank distributions in complex systems.

## On-Screen Text / Captions
- **0:00** — "City rank × population = constant — Zipf's law."
- **0:05** — "P_n ∝ 1/n — log-log plot: straight line, slope=-1"
- **0:12** — "Words: 'the' (rank 1), 'of' (rank 2) — Zipf in language"
- **0:20** — "Gibrat + barrier → Zipf for cities"
- **0:28** — "Simulation: proportional growth → Zipf emerges"
- **0:35** — "Genes, companies, papers, links — Zipf universal"
- **0:43** — "Zipf — rank times frequency is always constant."

## End Card
Final 3 seconds: the log-log rank-size plot — a single straight line with slope -1 spanning 4 orders of magnitude. Text: "Benford's law — the distribution of first digits in data — is also a power law, and appears in accounting fraud detection." CodedLaws logo.

## Audio
Ambient city sounds — traffic, crowd. Voiceover at 0:00: "If you rank cities by population, the second largest is half the first, the third is a third — this rank times frequency equals a constant, always, everywhere." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (log-log scatter plot). Key algorithm: Gabaix-Gibrat city model. N=1000 cities, initial population log-uniform between P_min and P_max. At each step: for each city, log(P) += N(0, σ²)·dt. If log(P) < log(P_min): reflect back (P=P_min). After T=500 steps: rank all cities by size; plot rank-size on log-log. Fit power law: slope should be ≈-1. Word frequency: download Project Gutenberg text, compute word frequencies, plot rank-frequency on log-log. Runtime: fast, Canvas 2D.
