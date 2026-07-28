---
title: "Catch Bonds — Force-Enhanced Adhesion"
id: SM161
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, biophysics, catch-bond, adhesion, mechanobiology, cell-adhesion]
---

> **What it is:** A ~45-second simulation short where a receptor-ligand bond's off-rate is plotted against applied force, revealing a non-monotonic curve that decreases to a minimum at ~15 pN before rising — the paradoxical catch bond — with a two-state energy landscape animation showing how force shifts the bond into a stronger conformation, demonstrating the mechanosensitive adhesion strategy used by FimH and selectins. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Catch Bonds — Force-Enhanced Adhesion

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A receptor-ligand bond between a cell and a surface. Normally: pull harder → bond breaks faster (slip bond). But here — pulling harder makes the bond STRONGER. The off-rate actually decreases as force increases. A catch bond. The bond is paradoxically reinforced by the force trying to break it.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Bond types: (1) Slip bond: off-rate k_off(F) = k₀·exp(F·d/kT) — exponentially increasing (Bell 1978). (2) Catch bond: off-rate k_off(F) initially decreases with F (force strengthens the bond), then increases at high F. (3) Ideal bond: k_off independent of force. Caption: "Catch bond: k_off decreases with F — force strengthens adhesion."

**0:10–0:18** — Two-pathway model: Dembo-Torney-Saxman-Hammer (1988) / Thomas-Vogel (2008). The catch bond has two states: a weak state (off-rate k₁, favoured at low force) and a strong state (off-rate k₂ << k₁, favoured by force). Force tilts the energy landscape to favour the strong state. Caption: "Two-state model: force tips balance toward strong-state — catch." Show potential energy diagram.

**0:18–0:27** — Biological examples: (1) E. coli FimH adhesin: catches onto mannose at high shear flow — bacteria adhere better in fast-flowing blood vessels. (2) Selectin-PSGL1: white blood cells rolling on vessel walls — selectins are catch bonds, enabling rolling (optimal adhesion at physiological shear). (3) Titin in muscle: catch-bond behaviour allows muscle to resist sudden pulls. Caption: "FimH: E. coli grips harder in faster blood flow — catch bond."

**0:27–0:36** — Force dependence: k_off(F) for selectin shows a non-monotonic curve — decreases from 0 to ~15 pN, then increases above 15 pN. This is measured by AFM (atomic force microscopy) single-molecule force spectroscopy. Caption: "Selectin: k_off minimum at F=15 pN — measured by AFM." Show the non-monotonic k_off(F) curve.

**0:36–0:45** — Design principle: catch bonds optimise adhesion under specific force ranges. This is a mechanosensitive switch — cells can "feel" shear flow and respond by strengthening adhesion. Caption: "Catch bond = mechanosensitive switch — designed by evolution for shear." Bold text: "Catch bonds — evolution discovered force-enhanced adhesion." Fade to black.

## Physics Concept Teased
Catch bond: a receptor-ligand bond whose off-rate k_off(F) decreases with increasing tensile force F, in a certain force range — opposite to a slip bond (Bell's law). The two-state model explains the catch: force shifts the bond from a weak to a strong conformation. Biological examples: FimH (E. coli), selectin (leukocyte rolling), titin (muscle mechanosensing).

## On-Screen Text / Captions
- **0:00** — "Pull harder — bond gets stronger. Catch bond."
- **0:05** — "Slip: k_off = k₀·exp(Fd/kT). Catch: k_off decreases with F"
- **0:12** — "Two-state: force tips balance to strong state — catch"
- **0:20** — "FimH: E. coli grips harder in faster blood flow"
- **0:28** — "Selectin: k_off minimum at 15 pN — measured by AFM"
- **0:35** — "Catch bond = mechanosensitive shear switch"
- **0:43** — "Catch bond — force makes the grip tighter."

## End Card
Final 3 seconds: the off-rate curve — non-monotonic, with a minimum at 15 pN, rising steeply at high force. Text: "The catch bond was predicted theoretically by Dembo in 1988 but not observed experimentally until 2003 (Marshall et al., selectin-PSGL1)." CodedLaws logo.

## Audio
Gentle mechanical sound of a bond being stretched and holding. Voiceover at 0:00: "A catch bond does something impossible in simple physics — the harder you pull, the more tightly it holds, because force changes the protein's conformation into a stronger grip." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (single-molecule schematic + k_off(F) curve). Key algorithm: two-state catch bond model. States: W (weak, off-rate k_w, transition to S at rate k_ws(F)=k_ws0·exp(-F·d_ws/kT)) and S (strong, off-rate k_s << k_w, transition to W at rate k_sw). Stochastic simulation: Monte Carlo for bond lifetime. Or: compute k_off_eff(F) by solving the 2-state master equation at steady state. Plot k_off_eff(F) vs F: show non-monotonic curve. Compare to Bell slip bond. Single-molecule lifetime: plot t_lifetime distribution (exponential for slip, peaked for catch). Runtime: fast, Canvas 2D.
