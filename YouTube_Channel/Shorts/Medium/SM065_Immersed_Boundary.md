---
title: "Immersed Boundary — Elastic Filament in Flow"
id: SM065
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, immersed-boundary, fluid-structure-interaction, elastic-filament, CFD]
---

> **What it is:** A ~45-second simulation short where a flexible elastic filament anchored at one end undulates like a flag in a streaming flow and sheds alternating vortices downstream, demonstrating the Immersed Boundary method's coupling of a Lagrangian structure to an Eulerian fluid grid without any body-fitted mesh. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Immersed Boundary — Elastic Filament in Flow

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A blue flow field streams from left to right. In the centre: a flexible red filament, anchored at one end, waving like a flag in a breeze. The flow pattern around the filament changes as it undulates — a beautiful fluid-structure interaction in real time.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — IB method concept: the fluid is on a fixed Eulerian grid (blue). The elastic filament is a set of Lagrangian points (red). The key: the filament communicates with the fluid via a spreading operation (Lagrangian → Eulerian) and interpolation (Eulerian → Lagrangian). Caption: "IB: Lagrangian filament + Eulerian fluid grid."

**0:10–0:18** — The spreading operation: the elastic force F at each Lagrangian point is spread to nearby Eulerian grid cells using a delta function kernel (Peskin's δh). The fluid feels a body force. Caption: "Elastic force spreads to fluid: f_euler = Σ F_ib · δ_h." Then the fluid is solved with this body force (standard NS solver).

**0:18–0:27** — The interpolation step: the fluid velocity at each Lagrangian point is interpolated from surrounding Eulerian cells using the same δh kernel. The filament moves with the fluid velocity. Caption: "Filament moves with local fluid velocity."

**0:27–0:36** — Vortex shedding from the filament: as the filament undulates, it sheds vortices downstream — alternating clockwise (red) and counter-clockwise (blue). Vorticity colour-map shown. The filament's Strouhal number: St ≈ 0.19. Caption: "Filament-induced Kármán street."

**0:36–0:45** — Application: cilia beating in a lung airway. The periodic beating of elastic cilia drives fluid transport. Multiple cilia shown in a coordinated metachronal wave (each cilium slightly out of phase). Bold text: "IB method: cilia, heart valves, blood cells." Fade to black.

## Physics Concept Teased
Immersed Boundary method (Peskin 1972): couples a Lagrangian elastic structure with an Eulerian fluid. Elastic forces spread from structure to fluid via a regularised delta function; fluid velocity interpolated back to structure. No body-fitted mesh needed — the complex geometry is handled by the body forces. Applications: heart valve modelling, insect flight, cilia, blood flow.

## On-Screen Text / Captions
- **0:00** — "A flexible filament in flow — real-time simulation."
- **0:05** — "IB: Lagrangian filament + Eulerian fluid grid"
- **0:12** — "Elastic force spreads to fluid via δ_h kernel"
- **0:20** — "Filament velocity interpolated from fluid"
- **0:28** — "Filament sheds vortices — Kármán street"
- **0:35** — "Cilia: coordinated metachronal waves — lung airway"
- **0:43** — "Immersed Boundary — no body-fitted mesh needed."

## End Card
Final 3 seconds: cilia metachronal wave driving fluid transport — a beautiful biological simulation. Text: "Charles Peskin invented IB to model heart valves — 1972." CodedLaws logo.

## Audio
Flowing, organic electronic (80 BPM). Sound of air/fluid movement. Voiceover at 0:00: "Simulating a heart valve or cilia without redesigning your mesh — that's what the Immersed Boundary method does." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D or WebGL. Key algorithm: IB method (Peskin 2002). Fluid: 2D incompressible NS on a Cartesian MAC grid (projection method). Filament: N=50 Lagrangian points with Hookean elastic springs (F_s = k·(|X_{i+1}-X_i| - L₀)·(X_{i+1}-X_i)/|X_{i+1}-X_i|) and bending stiffness. Spreading: f(x_e) = Σ_i F(X_i)·δ_h(x_e - X_i) using 4-point kernel. Interpolation: U(X_i) = Σ_{x_e} u(x_e)·δ_h(x_e - X_i)·Δx². Time step: limited by explicit stability (Δt < ρΔx²/μ). Gotcha: elastic filament requires stiff ODE solver or implicit treatment of spring forces for stability. Runtime: real-time Canvas 2D for 2D simulation.
