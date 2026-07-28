---
title: "DNA Supercoiling — Topoisomerase Action"
id: SM164
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, biophysics, DNA, supercoiling, topoisomerase, linking-number, writhe]
---

> **What it is:** A ~45-second simulation short where a DNA double helix is overwound until it buckles into a compact plectonemic supercoil as twist converts to writhe, then topoisomerase cuts a strand and instantly relieves the torsional stress, demonstrating how the topological invariant linking number (Lk = Tw + Wr) governs genome compaction and why antibiotic drugs target gyrase. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: DNA Supercoiling — Topoisomerase Action

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A double helix of DNA — 10 base pairs per turn. As it's twisted further (overwound), the helix itself starts to twist about its own axis — supercoiling — forming a compact, plectonemic structure. Then topoisomerase cuts one strand, lets it rotate to relieve the torsion, and reseals — the supercoiling is instantly removed. A molecular knot-untyping enzyme.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Topology of DNA: linking number Lk = Tw + Wr. Twist Tw: number of helical turns (1 per 10.5 bp for B-DNA). Writhe Wr: the coiling of the axis itself. White's theorem: Lk = Tw + Wr (topological invariant for a closed DNA ring). Caption: "White's theorem: Lk = Tw + Wr — topological invariant." Overwound DNA: ΔLk > 0 (positive supercoiling). Underwound: ΔLk < 0 (negative supercoiling — found in vivo).

**0:10–0:18** — Worm-like chain (WLC) model: DNA flexibility. Persistence length l_p = 50 nm ≈ 150 bp. For lengths > l_p: DNA is flexible (behaves like a Gaussian chain). Torsional stiffness C ≈ 3×10⁻²⁸ N·m². Supercoiling energy: E_sc = (C/2L)·(ΔLk·2π)² for low Lk. Caption: "Torsional energy: E_sc = (C/2L)·(2πΔLk)² — stored in supercoiling."

**0:18–0:27** — Plectoneme formation: at |ΔLk| > threshold, DNA writhe (Wr) increases — the DNA forms interwound (plectonemic) supercoils. The DNA becomes compact — this is how bacteria compact their genome (~4.6 Mb of DNA into a 1 μm cell). Caption: "Plectoneme: ΔLk → Wr → compact interwound structure." Show the Tw ↔ Wr exchange.

**0:27–0:36** — Topoisomerases: Type I: cuts one strand, allows rotation → changes Lk by ±1. Type II: cuts both strands, passes another segment through → changes Lk by ±2. Both relieve supercoiling. DNA gyrase (type II): actively introduces negative supercoiling (requires ATP). Caption: "Gyrase: type II, introduces -2 Lk per ATP — negative supercoiling." Gyrase inhibitors (fluoroquinolone antibiotics) kill bacteria.

**0:36–0:45** — Single-molecule experiments: magnetic tweezers — one end of a DNA molecule fixed, other end attached to a magnetic bead. Rotate the magnet → twist DNA → induce supercoiling. Measure extension vs Lk: plectoneme formation shortens the DNA. Caption: "Magnetic tweezers: directly measure extension vs supercoiling." Bold text: "DNA supercoiling — topology controls gene expression." Fade to black.

## Physics Concept Teased
DNA supercoiling: the topological state of DNA is described by the linking number Lk = Tw + Wr (White's theorem). In vivo, DNA is negatively supercoiled (ΔLk<0), facilitating strand separation for transcription. Supercoiling energy is E_sc ∝ (ΔLk)². Topoisomerases change Lk by cutting and resealing strands, relieving torsional stress. Measured by magnetic tweezers.

## On-Screen Text / Captions
- **0:00** — "Twist DNA — it supercoils. Topoisomerase untwists it."
- **0:05** — "Lk = Tw + Wr — White's theorem (topological)"
- **0:12** — "E_sc ∝ (ΔLk)² — supercoiling energy stored in DNA"
- **0:20** — "Plectoneme: ΔLk → writhe → compact, interwound"
- **0:28** — "Gyrase: type II topoisomerase, -2 Lk per ATP"
- **0:35** — "Magnetic tweezers: extension vs Lk — measured directly"
- **0:43** — "DNA supercoiling — topology controls biology."

## End Card
Final 3 seconds: the plectonemic DNA structure — a beautiful interwound coil, compact and torsionally stressed. Text: "Fluoroquinolone antibiotics (Cipro) kill bacteria by poisoning DNA gyrase — blocking DNA supercoiling resolution and causing lethal DNA breaks." CodedLaws logo.

## Audio
Twisting, tightening sound as DNA overwound, then a release as topoisomerase cuts. Voiceover at 0:00: "DNA in your cells is negatively supercoiled — like an overwound phone cord — and topoisomerase enzymes constantly manage this torsional stress to allow genes to be read." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: three.js (3D helical DNA). Key algorithm: elastic rod model for DNA. Kirchhoff elastic rod equations: curvature κ and twist τ as degrees of freedom. Energy: E = (A/2)∫κ²ds + (C/2)∫(τ - τ₀)²ds + (D/2)∫(ΔLk)². Minimise by relaxation (gradient descent). Simulate Tw → Wr conversion: fix Lk (topological), allow twist to convert to writhe (by relaxing the rod shape). Plectoneme forms naturally at |ΔLk| > 2-3. For topoisomerase: cut rod at one point (remove torsional constraint), allow it to rotate to ΔTw=0, then reseal. Magnetic tweezers: apply force along z-axis, rotate one end. Runtime: three.js, ~10 fps for N=200 segments.
