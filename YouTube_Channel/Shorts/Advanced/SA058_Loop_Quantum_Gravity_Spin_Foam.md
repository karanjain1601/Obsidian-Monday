---
title: "Loop Quantum Gravity — Spin Foam Amplitude"
id: SA058
type: youtube-short
duration: "~45 seconds"
feeds_video: "Loop Quantum Gravity: Spin Networks and Quantum Geometry"
difficulty: advanced
tags: [physics, simulation, short, advanced, quantum-gravity, LQG, spin-foam, spin-network]
---

> **What it is:** A ~45-second simulation showing a loop quantum gravity spin-foam amplitude for a 4-simplex with edge labels representing discrete area eigenvalues and the sum producing a quantum spacetime transition amplitude. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Loop Quantum Gravity: Spin Networks and Quantum Geometry

# Short: Loop Quantum Gravity — Spin Foam Amplitude

**Feeds full video:** Loop Quantum Gravity: Spin Networks and Quantum Geometry

## Visual Hook (First 3 Seconds)
A spin network fills the screen: a graph with 12 nodes (glowing gold spheres) connected by 18 edges, each edge labeled with a half-integer spin j = 1/2, 1, 3/2, 2 (displayed in colored text: red, green, blue, magenta). At each node, an intertwiner symbol (4-valent vertex with Clebsch-Gordan coefficients) glows white. Text: "Area eigenvalue: A = 8πγl_P²√(j(j+1))."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The kinematic Hilbert space of LQG is shown: basis states are spin-network functions Ψ_Γ,j,i[A] on SU(2) connections. A cylindrical function on a single edge is animated: f(g_e) = D^j_{mn}(g_e), a Wigner matrix element, plotted as a function on the SU(2) group manifold (shown as a 3-sphere S³).

**0:10–0:18** — Area operator action: Â·|j⟩ = 8πγl_P²√(j(j+1))|j⟩. For j=1/2: A = 8πγl_P²·(√3/2). The discrete area spectrum is displayed as a bar chart: j = 0 (A=0), j=1/2 (A=4.2l_P²), j=1 (A=8.9l_P²), j=3/2 (A=14.4l_P²). Each bar in a different color.

**0:18–0:26** — The spin foam: a 2-complex (a 2D foam-like structure) is shown. Faces of the foam are colored by spin label j (rainbow colormap). Edges labeled by intertwiners. A single vertex amplitude (the EPRL vertex) is highlighted: W_v = Σ_{jf,ie} ∏_f dim(j_f) · ∏_v A_v(j_f, i_e). The foam "bubbles" in and out of view.

**0:26–0:34** — The EPRL amplitude for a single 4-simplex vertex: 15j-symbol visualization. A pentagonal arrangement of 5 nodes (representing the 5 tetrahedra of a 4-simplex) connected by 10 edges (representing the 10 triangles) with spin labels. The 15j-symbol value for j=1/2 on all faces is computed: A_v = 0.0183 (displayed in green).

**0:34–0:42** — Quantum-to-classical transition: in the large-j limit, the spin foam amplitude oscillates as e^(iS_Regge), where S_Regge is the classical Regge action for the simplex. A plot of Im[A_v] vs j for j from 1 to 20 shows oscillations with period matching the Regge prediction (red dashed curve overlay).

**0:42–0:50** — Final frame: a loop in the spin network (a closed loop with j=1 on all edges) is shown alongside its area eigenvalue. A volume operator eigenvalue is computed: V = √(|ε^{abc} J_a J_b J_c|/48) = 2.7l_P³. Fade to CodedLaws logo.

## Physics Concept Teased
Loop quantum gravity quantizes geometry itself: areas and volumes have discrete spectra labeled by SU(2) representation spins. The spin foam amplitude provides a covariant, path-integral formulation of LQG dynamics, with each foam history weighted by an amplitude that recovers the Regge action in the semiclassical limit.

## On-Screen Text / Captions
- **0:00** — "Spin network: j ∈ {½, 1, 3/2, 2} on edges"
- **0:06** — "Area eigenvalue: A = 8πγl_P²√(j(j+1))"
- **0:12** — "Discrete area spectrum: j=0,½,1,3/2…"
- **0:20** — "Spin foam: 2-complex weighted by EPRL amplitude"
- **0:28** — "15j-symbol for 4-simplex vertex: A_v = 0.0183"
- **0:36** — "Large j: A_v ~ e^(iS_Regge) — semiclassical limit"
- **0:44** — "Volume eigenvalue: V = 2.7 l_P³"

## End Card
Final 3 seconds: the glowing spin network with colored edge labels, CodedLaws logo centered. CTA: "Full video → Loop Quantum Gravity."

## Audio
Deep space ambient at 65 BPM. Sharp metallic click on each discrete area eigenvalue reveal. Oscillating hum on the large-j Regge oscillation animation. No voiceover.

## Production Notes
Renderer: Python/NetworkX for spin network graph. SU(2) Wigner matrices computed with sympy.physics.quantum. 15j-symbol evaluated using Racah algebra (custom Python). Three.js for 3D spin foam 2-complex visualization. GLSL shader for foam bubble effect. Area spectrum bar chart in Matplotlib. 60 fps, 1080×1920.
