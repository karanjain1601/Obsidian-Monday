---
title: "How Materials Stretch and Snap (Stress, Strain, Young's Modulus)"
id: B062
difficulty: 2.5/10
prereq: "None"
concept: "Stress σ = F/A; strain ε = ΔL/L₀; Young's modulus E = σ/ε (Hooke's law in 3D form); elastic limit (yield point) beyond which deformation is permanent; fracture point."
tags: [materials, stress, strain, youngs-modulus, elasticity, fracture, canvas, beginner]
category: beginner
type: video-idea
---

# How Materials Stretch and Snap (Stress, Strain, Young's Modulus)

**Alt title:** "The Graph That Explains Why Everything Eventually Breaks"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The screen shows two identical metal wires hanging side by side. A weight is attached to one. The host narrates: "Both wires are made of steel. One has twice the cross-sectional area of the other. We add the same force to both. Which stretches more?" The thinner wire visibly stretches farther. "Now we double the force. And now we double it again." Thin cracks appear in the thinner wire. Then — snap — it fractures with a sharp audio effect and the weight falls. The thicker wire holds. The host pauses. "That's not just 'the thin one is weaker.' There's a precise, quantitative science to this. Engineers use it every day to design bridges, aircraft wings, and guitar strings. And it all lives on one graph — the stress-strain curve." The camera cuts to a clean stress-strain plot that slowly traces itself: a straight line, then a gentle curve, then a plateau, then a drop and an X mark where fracture occurs. The entire video will decode every segment of that curve.

## The Naive Attempt

The viewer creates an HTML Canvas page with a vertical rectangular bar in the centre representing a material sample, gripped at the top and bottom. The host writes a simple spring model: extension `dL = F / k`, where k is a fixed spring constant chosen by hand. A slider labelled "Applied Force (N)" lets the viewer drag F upward, and the bar stretches accordingly — its drawn height increases by `dL`. A numerical readout shows the extension in millimetres. The host also plots `dL` versus `F` in a small side panel, which produces a perfect straight line. This is Hooke's law. The host says: "This works! But watch what happens when I change the wire's dimensions." They double the bar's cross-sectional area. The spring constant stays the same in the code (because k was hard-coded), so the bar stretches by the same amount — which is wrong. A fatter wire should stretch less for the same force. Likewise, making the bar twice as long should double the extension — but the code doesn't reflect that either. The naive `dL = F/k` formula hides the geometry completely.

## The Moment of Failure

With the naive code, the host sets the bar to be very thin and very short, then applies a force. The simulation shows a modest extension of, say, 5 mm. But a quick hand calculation reveals that a real steel wire with those dimensions (cross-section 1 mm², length 10 cm, E = 200 GPa) would extend only 0.005 mm under 1 kN of force — the simulation is wrong by a factor of 1000. More embarrassingly, when the host makes the bar longer (stretching the drawn rectangle), the extension doesn't change in the simulation at all, even though physically a longer wire stretches more for the same force. On screen the viewer sees two bars of very different lengths responding identically — an obvious physical absurdity. The hard-coded k absorbed everything and learned nothing about the actual material.

## Why It Broke — The Physics

The spring constant k conflates the material property with the geometry. To separate them, engineers introduce stress and strain. **Stress** σ (sigma) is the force per unit area: σ = F / A, measured in Pascals (Pa). It represents how hard the material is being pulled at the molecular level, normalized for cross-section size. **Strain** ε (epsilon) is the fractional extension: ε = ΔL / L₀, dimensionless. It represents how much the material has deformed relative to its original size. **Young's modulus** E is defined as σ/ε = (F/A)/(ΔL/L₀), which gives ΔL = FL₀/(AE). This is the geometry-independent material constant. For steel, E ≈ 200 GPa. For rubber, E ≈ 0.01–0.1 GPa. The key equation is **E = σ/ε**, and it completely replaces the naive spring constant by encoding the material's intrinsic stiffness.

## The One Concept

The stress-strain curve is the full story of a material's mechanical life from rest to ruin. In the **elastic region** (the initial straight-line portion), strain is proportional to stress via Young's modulus. Remove the force and the material returns to its original shape — no permanent damage. The slope of this line is E. At the **yield point** (elastic limit), the material begins to deform plastically: atomic planes slip past each other and cannot return. The material is now permanently stretched even after the force is removed. Beyond the yield point lies the **plastic region**, where strain increases rapidly with little additional stress — the material is flowing, not springing. Eventually the material reaches **ultimate tensile strength** (the peak of the curve), after which **necking** occurs: the bar narrows locally, stress concentrates, and the material fractures at the **breaking point**. Different materials have dramatically different curve shapes: glass has no plastic region at all (it is perfectly brittle — it snaps without warning at the elastic limit); rubber stretches enormously in its elastic region; steel has a wide plastic region which is why it can be bent and shaped before it breaks. Young's modulus values: steel 200 GPa, aluminium 70 GPa, bone 20 GPa, rubber 0.05 GPa.

## The Fix

The host replaces the hard-coded k with the correct formula: `const dL = (F * L0) / (A * E)`. The variables L0 (original length in metres), A (cross-sectional area in m²), and E (Young's modulus in Pa) are all exposed as sliders. Now doubling A halves the extension, and doubling L0 doubles the extension — exactly as the physics demands. The host also implements the full stress-strain curve by adding a piecewise function: in the elastic region, use the linear formula; past the yield stress σ_y, switch to a plastic hardening model `σ = σ_y + H*(ε - ε_y)` where H is the hardening modulus; past ultimate stress σ_u, add a fracture condition that snaps the bar. On screen, a red dot crawls along the stress-strain curve plot in real time as the force slider increases, matching the deformation of the visual bar.

## The Wow Moment — Push It

The host builds a material comparison museum: four bars side by side — steel, aluminium, rubber, and bone — all under the same increasing force. Each has its own stress-strain curve plotted below it. As the force ramps up, the rubber bar stretches enormously while the steel barely moves. Then the force passes the yield stress of bone: the bone bar shows a kink (the yield point), elongates, then fractures with a crack sound effect and a red X. The steel bar yields next but hangs on. The rubber never breaks (it just keeps stretching off-screen). The aluminium snaps cleanly after a short plastic region. The host then toggles on "earthquake load": an oscillating force that sweeps from 0 to 150% of the yield stress repeatedly, showing fatigue — the yield point gradually creeping down with each cycle until sudden fracture.

## The Interactive Demo

- **Applied force F (N):** slider 0–500,000 N
- **Original length L₀ (m):** slider 0.05–2.0 m
- **Cross-sectional area A (mm²):** slider 0.5–100 mm²
- **Material selector:** Steel, Aluminium, Rubber, Bone, Glass — each presets E, yield stress, and ultimate stress
- **Show stress-strain curve toggle:** overlays the full theoretical curve with a moving red dot
- **Snap mode toggle:** enables fracture once ultimate stress is exceeded (visual crack + sound)
- **Zoom into elastic region button:** re-scales the strain axis to show the very small initial deformation for stiff materials

## Production Notes

The canvas is divided into three vertical regions: the animated material bar on the left (with annotations showing F, A, L₀, and the extension bracket ΔL), the live stress-strain curve in the centre, and numerical readouts on the right showing σ, ε, and E. During the Physics section, the host should pause on the stress-strain curve and use a laser pointer effect to walk through each named region. The elastic region should be highlighted in green, the plastic region in yellow, and the fracture zone in red. A zoom-in animation into the atomic level — illustrated as circles in a lattice, with bonds shown as springs — should accompany the explanation of why the elastic region is reversible. Film the fracture in slow motion at 10× zoom for maximum drama.

## Tags
`materials` `stress` `strain` `youngs-modulus` `elasticity` `fracture` `canvas` `beginner`

## Thumbnail

Split-screen: on the left, a thick steel rod being pulled by large arrows labelled F and looking unchanged; on the right, a thin rod of the same material visibly necked and about to snap. Bold white text across the centre: "SAME FORCE." Bottom-right corner text in red: "One will SNAP." Dark industrial background with a subtle graph curve visible behind the rods. High-contrast, very clean.
