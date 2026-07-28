---
title: "Transistor: The Switch That Changed Everything"
id: SB180
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, condensed-matter, transistor, semiconductors]
---

> **What it is:** A ~45-second simulation short where a thin 10 μA trickle injected into an NPN transistor base triggers a massive 5 mA torrent from emitter to collector, then two transistors form a NAND gate, revealing the minority-carrier injection principle behind every one of the 80 billion transistors in a modern chip. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Transistor: The Switch That Changed Everything
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An NPN transistor cross-section (silicon, 3 colored regions: blue emitter, red base, green collector) sits on screen. A tiny base current (thin orange wire, 10μA) is injected. Instantly, a massive collector current (thick orange flow, 5mA) erupts from emitter to collector — 500× amplification. The tiny controls the giant.

## Main Visual Sequence (0:03–0:50)
**0:03** — NPN transistor cross-section shown (silicon wafer, dark background). Three regions labeled: Emitter (N-type, blue, left), Base (P-type, red, thin center, 1μm wide), Collector (N-type, green, right). External connections: collector connected to 5V supply (gold wire), emitter to ground, base to signal input.

**0:10** — Base-Emitter junction forward biased (V_BE = 0.7V). Electrons (blue dots) injected from emitter into thin base region. Most electrons (99%) have high enough energy to sail through the thin base without recombining and reach the collector depletion region. Collector current flows: I_C = β × I_B = 500 × 10μA = 5mA.

**0:18** — Current amplification visualization: thin blue stream (I_B = 10μA) enters base; thick blue torrent (I_C = 5mA) exits collector. Ratio β (current gain) = I_C/I_B = 500. Transistor symbol shown with arrows. Label: "β = 500 — typical BJT."

**0:27** — Switching mode: base voltage pulses 0V→0.7V at 1 MHz. Collector current switches 0→5mA at same rate. LED in collector circuit flashes 1 million times per second (blurs to steady glow at 1 MHz). "This is a digital switch: 0 or 1, off or on."

**0:35** — Logic gate: two transistors in series (AND gate). Both bases must be HIGH for collector current to flow. Truth table shown: 00→0, 01→0, 10→0, 11→1. "This is a NAND gate — the building block of all computers."

**0:43** — Scale reveal: modern CPU has 80 billion transistors (Apple M2). Each transistor 3nm wide. "Your phone runs on 80,000,000,000 of these, switching at 3 GHz." CodedLaws logo.

## Physics Concept Teased
A bipolar junction transistor (BJT) amplifies current by using a small base current to control a much larger collector current through minority carrier injection. In N-type emitter material, electrons injected into the thin P-type base mostly traverse it (diffusion) and are swept into the collector by the reverse-biased B-C junction, providing current gain β = I_C/I_B up to several hundred.

## On-Screen Text / Captions
- 0:03 → "NPN transistor: Emitter → Base → Collector"
- 0:10 → "V_BE = 0.7V → electrons injected through base"
- 0:18 → "β = I_C/I_B = 500 — 500× amplification"
- 0:27 → "Switching at 1 MHz — 1 million times/second"
- 0:35 → "Two transistors = NAND gate = all digital logic"
- 0:43 → "80 billion transistors in one chip at 3nm"

## End Card
Final 3 seconds: CPU die photo (stylized, circuit traces glowing). Text: "80,000,000,000 transistors. One physics principle." CodedLaws subscribe.

## Audio
Upbeat, tech-forward electronic music, 110 BPM. 1 MHz switching frequency played as a 1000 Hz audio tone (scaled for hearing). Each logic gate truth table entry: keyboard click sound. Voiceover: "A tiny current controls a big one. That's the transistor. That's everything."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw cross-section as colored rectangles; animate electron dots injecting from emitter, crossing thin base, collecting at collector; size of dot flow proportional to current magnitude (thin stream for I_B, thick for I_C); show switching by toggling base voltage with a square wave and watching collector current toggle. Runtime: real-time. Gotcha: the base must be drawn much thinner than emitter/collector to convey why most electrons transit without recombining — make base width 10% of total device width minimum.
