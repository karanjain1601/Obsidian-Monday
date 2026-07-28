---
title: "Hysteresis Loop — Magnetic Memory"
id: SM129
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Magnetism_Materials_Full]]"
difficulty: medium
tags: [physics, simulation, short, magnetism, condensed-matter, materials-science, memory]
---

> **What it is:** A ~45-second simulation short where a ferromagnet's domain pattern evolves as the applied field cycles, tracing a glowing B-H hysteresis loop in real time and revealing the material's magnetic memory through its remanence and coercive field — with hard vs. soft magnet loops compared side by side. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Magnetism_Materials_Full]]

# Short: Hysteresis Loop — Magnetic Memory
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A glowing orange B-H hysteresis loop traces itself in real time on screen — a fat, closed oval tilted diagonally. The curve being drawn is the history of magnetization: the material remembers where it has been. When the external field drops to zero, the material still has magnetization. That memory is a magnetic bit.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** A 2D domain structure of a ferromagnet (realistic irregular domain pattern, grey background, blue/red domains). Applied field H = 0. The domains are in a demagnetized state — roughly equal blue/red domains, random. Net magnetization M ≈ 0. Starting point on B-H graph: origin (0, 0), marked with a white dot.
- **0:10–0:18:** H slowly increases (applied field rightward, green arrow). Domains with the favorable orientation (blue, aligned with H) grow — blue domains expand eating red domains. M increases. On the B-H graph: the curve traces upward and rightward, following the initial magnetization curve. Saturation at H_sat: all domains blue (M = M_s). Top-right of loop reached.
- **0:18–0:28:** H decreases back to zero. The domain walls don't return to their original positions — pinned by defects. Many domains stay blue. Net magnetization M_r > 0 at H=0 — this is the remanence. On the B-H graph: curve follows the upper branch leftward, arriving at the y-axis intercept M_r (bright gold dot).
- **0:28–0:38:** H reversed (applied leftward). The blue domains shrink slowly. At the coercive field H_c (the x-intercept of the hysteresis loop, bright red dot), M = 0 again but the domain pattern is very different from the initial state. Push further: red domains dominate, M → -M_s. Then reverse again: the lower loop branch traced. Full loop closed.
- **0:38–0:45:** Material comparison: hard magnet (wide loop, high H_c — strong coercivity, good for permanent magnets) vs. soft magnet (narrow loop, low H_c — easy to switch, good for transformer cores). Two loops shown side-by-side. Loop area = energy dissipated per cycle = heat. Text: "This loop area is the magnetic hard drive of 1970."

## Physics Concept Teased
The magnetic hysteresis loop (B-H curve) shows that magnetization depends not just on the current applied field but on the history of applied fields — the material has memory. Key parameters: saturation magnetization M_s (maximum M), remanence M_r (M at H=0 after saturation), and coercive field H_c (H needed to drive M back to zero). The loop area equals the energy dissipated per cycle as heat (eddy currents and domain wall friction). Wide loops = hard magnets (permanent); narrow loops = soft magnets (transformer cores).

## On-Screen Text / Captions
- **0:00:** "The material remembers where it has been. That memory is a bit of data."
- **0:08:** "Increasing H → domains align → M rises"
- **0:15:** "H returns to 0 → M_r remains — remanence"
- **0:23:** "Coercive field H_c: the field needed to erase the memory"
- **0:30:** "Full loop: one complete magnetization cycle"
- **0:38:** "Loop area = energy lost as heat per cycle"
- **0:44:** "Hard loop = permanent magnet. Soft loop = transformer."

## End Card
Final 3 seconds: the two hysteresis loops (hard vs. soft) side by side, glowing orange and cyan on black. Text: "Every magnetic material has its own signature loop." Channel logo.

## Audio
Smooth, slowly evolving ambient pad that follows the H-field sweep — rises as H increases, fades as H drops, swells again as H reverses. Voiceover (calm, deliberate): "The field disappears. The memory remains. That's the entire principle of magnetic storage." Subtle domain-flip clicking sounds (Barkhausen-like) during the magnetization sweeps.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Preisach model for hysteresis — superposition of elementary hysterons (bistable switching units with threshold fields α, β). Each hysteron i switches up at H > α_i, down at H < β_i. Distribution of (α_i, β_i): Gaussian in the Preisach plane. Net M = Σ_i m_i(H). Hysteresis loop: sweep H from -H_max to +H_max to -H_max. Simultaneously animate domain structure: group of "macroscopic domains" each representing a Preisach hysteron — show them flipping blue/red as their thresholds are crossed. B-H graph: update each timestep. Loop area: integrate numerically. Hard vs. soft: change the Gaussian width in the Preisach plane (wide distribution = hard magnet). Gotcha: Preisach model needs the "return point memory" property satisfied — verify by minor loop testing.
