---
title: "Why a Straw Looks Broken in Water (Snell's Law)"
id: B011
difficulty: 1.5/10
prereq: "None"
concept: "Snell's Law — n1·sin(θ1) = n2·sin(θ2)"
tags: [physics, optics, snells-law, refraction, light, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why a Straw Looks Broken in Water (Snell's Law)

**Alt title:** "The Math Behind Why Your Straw Looks Broken"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a close-up shot of a glass of water with a drinking straw angled into it. The camera is at eye level with the waterline. The straw appears sharply broken — as if someone snapped it right at the surface. Slowly zoom into the apparent break point until the waterline fills the frame. Then overlay a thin glowing ray of light entering the water — watch it kink at the surface and continue in a different direction below. Pause on that kink. Ask aloud: "Is this an illusion, or does the ray actually change direction?" Cut to an oscilloscope signal representing light as a wave — show it slowing down as it crosses into denser medium, wavelength compressing. "It genuinely changes direction. This is refraction, and the law governing it — Snell's Law — is also behind rainbows, mirages, fiber optics, camera lenses, and your eye itself." The hook must trigger the question: why does light care what medium it's in? Tease the answer: light doesn't slow down because the medium resists it — it slows because it's interacting with electron clouds in the material. That's a topic for a quantum optics video. Today: the geometry.

## The Naive Attempt

Open the code editor split-screen with a Canvas element. Start building a "light ray through water" simulation. Define a horizontal interface at y = 300 pixels — above is air, below is water. Render the interface with a subtle blue gradient below. Then shoot a ray from the top-left at 45 degrees. The ray is simply a line: `ctx.moveTo(x0, y0); ctx.lineTo(x0 + dx, y0 + dy)`. When the ray hits y = 300, continue in the exact same direction — no bending. Add a small straw object below the waterline at a known position. The straw appears exactly where it is. Render the "apparent position" by tracing the un-bent ray backward to where an observer above the water would perceive the object to be. With no bending, apparent position equals actual position. The code is about 40 lines. Works for objects in air. Looks perfectly reasonable. The simulation runs, the ray travels straight through, no complaints from the browser. But something is fundamentally wrong — a fishing scenario illustrates it. Draw a fish below the waterline and draw crosshairs at its "apparent position" — with no bending, aim for the apparent position, hit the actual position. The two coincide. There's nothing wrong yet. That's exactly the problem.

## The Moment of Failure

Add an "aim and throw" mechanic: click above the waterline to throw a harpoon at the apparent fish position. Without refraction, the harpoon travels in a straight line through the water and hits wherever the crosshair points. Now enable the refraction code — the fish's apparent position shifts upward because the upward-bent ray traces back to a position shallower than the fish. The fisherman aims at the apparent fish. The harpoon misses by 20–30 pixels. Angle the straw at 60 degrees: the apparent break is enormous. Animate multiple rays from a single object below the waterline fanning upward — each hits the surface at a different angle, bends differently, and traces back to a different apparent position. The apparent image of the object is distorted — a straight stick appears bent. Render this side by side: LEFT panel (naive, no bending) — stick is perfectly straight, fish appears exactly where it is. RIGHT panel (with Snell's law) — stick is kinked at the waterline, fish appears shallower. The difference is startling and immediately recognizable as the real-world effect everyone has seen.

## Why It Broke — The Physics

Light is an electromagnetic wave. In vacuum it travels at c = 3 × 10⁸ m/s. In a medium with refractive index n, it travels at v = c/n. Water has n ≈ 1.33, so light in water moves at c/1.33 ≈ 2.25 × 10⁸ m/s. When a wavefront hits an interface at an angle, different parts of the wavefront hit at different times — the part that enters the denser medium first slows down while the rest of the wavefront is still in air. This causes the wavefront to pivot — like a marching band turning a corner when one flank slows. The pivot angle is exactly described by Snell's Law:

**n₁ · sin(θ₁) = n₂ · sin(θ₂)**

Here θ₁ is the angle of incidence (measured from the normal to the surface), θ₂ is the angle of refraction (also from the normal), and n₁, n₂ are the refractive indices of the respective media. For air-to-water: n₁ = 1.0, n₂ = 1.33. A ray entering at 45° refracts to arcsin(sin(45°)/1.33) ≈ 32.1°. The apparent depth of an object is reduced by a factor of 1/n ≈ 0.75 — a fish 1 meter deep appears only 75 cm deep. This apparent-depth effect is why swimming pools always look shallower than they are.

## The One Concept

**Snell's Law: n₁ · sin(θ₁) = n₂ · sin(θ₂)**

**Formal definition:** At an interface between two media with refractive indices n₁ and n₂, a ray of light changes direction such that n₁ sin(θ₁) = n₂ sin(θ₂), where both angles are measured from the normal to the interface at the point of incidence. The law is derivable from Fermat's Principle of Least Time: light takes the path that minimizes travel time, not distance.

**Physical intuition:** Imagine soldiers marching in formation across a boundary between firm ground (fast) and mud (slow). The files of soldiers that hit the mud first slow down while others are still on firm ground — the whole line pivots. Light does the same: the wavefront pivots as it crosses the interface, bending toward the normal when entering a denser (slower) medium.

**Key equation:** The refractive index n = c/v, where v is the phase velocity of light in the medium. The full form for Snell's Law also connects to wavelength: since frequency is constant across the interface, the wavelength changes: λ₂/λ₁ = n₁/n₂.

**Real-world examples:**
1. **Mirages** — Hot air near a road surface has a lower refractive index than cooler air above. Light from the sky bends upward near the hot surface, appearing to come from the road — your brain interprets it as a puddle of water reflecting the sky.
2. **Rainbows** — Each water droplet refracts sunlight into its component wavelengths (each λ has a slightly different n), then internally reflects, then refracts again on exit. The different bending angles for different wavelengths spread them into the visible spectrum arc.
3. **Your eye** — The cornea and lens refract light to focus it onto the retina. Myopia (nearsightedness) is a Snell's Law problem: the eye's total refractive power is too high, focusing in front of the retina. Glasses correct this by adding a diverging refractive surface before the eye.

## The Fix

At the point where the ray crosses the interface, compute the refraction angle using the inverse-sine form of Snell's Law:

```javascript
function refractRay(angle_incident, n1, n2) {
  // angle_incident measured from normal (perpendicular to interface)
  const sin_theta2 = (n1 / n2) * Math.sin(angle_incident);
  
  // Check for total internal reflection
  if (Math.abs(sin_theta2) > 1.0) {
    return null; // TIR — no transmitted ray
  }
  
  const theta2 = Math.asin(sin_theta2);
  return theta2;
}

// At the interface:
const theta1 = Math.atan2(ray.dx, -ray.dy); // angle from normal
const theta2 = refractRay(theta1, n_air, n_water);

// New ray direction after refraction:
ray.dx = Math.sin(theta2);
ray.dy = Math.cos(theta2); // still going downward
```

For n1 = 1.0 (air), n2 = 1.33 (water), a 45° incident ray refracts to `arcsin(sin(45°)/1.33) = arcsin(0.531) ≈ 32.1°`. The ray continues into the water at this shallower angle from normal. To show the apparent position of an underwater object, trace the refracted ray backward: extend the ray above the waterline in the direction it appears to be coming from. The apparent depth = actual depth / n₂ for near-normal incidence.

## The Wow Moment — Push It

Build three extended demonstrations in sequence. First: a **2D underwater scene** with coral, fish, and a treasure chest. Show multiple rays from each object bending at the surface. The apparent scene above the waterline is geometrically distorted — fish appear shallower and slightly displaced horizontally. Make the objects draggable; as you move a fish, its apparent image moves differently.

Second: **mirage simulation**. Create a vertically varying refractive index profile: n(y) = 1.0003 - 0.0002 × exp(-y/h) near a hot road surface. Trace rays numerically through this continuous gradient using small-step ray marching. A ray aimed at a shallow angle curves upward — the sky appears reflected in the road. Toggle between "hot road" (mirage) and "uniform atmosphere" (no mirage). The ray bending is visible in real time.

Third: **diamond sparkle**. Set n = 2.42. Shoot a fan of rays into a faceted diamond (approximate as a polygon with angled facets). At n = 2.42, the critical angle is only 24.4°. Almost all internal rays undergo total internal reflection — the diamond traps light and bounces it through multiple internal paths before it exits at a steep angle, producing the characteristic brilliance. Use wavelength-dependent n (chromatic dispersion) to show each wavelength exiting at a slightly different angle — rainbow sparkle. Beautiful.

## The Interactive Demo

The browser demo runs entirely in a Canvas element, approximately 900 × 600 pixels. Controls panel on the right:

**Interface angle slider** (0° to 45°): Tilts the air-water interface. Watching how the refracted ray changes as the interface angle changes — not the incident angle — is a subtly different and illuminating perspective.

**n₁ slider** (1.0 to 2.5, labeled "Medium 1 index"): Refractive index of the upper medium. Labels update: n=1.0 = vacuum/air, n=1.33 = water, n=1.5 = glass, n=2.42 = diamond.

**n₂ slider** (1.0 to 2.5, labeled "Medium 2 index"): Lower medium index. System enforces a warning (orange highlight) when n₂ < n₁ near the critical angle.

**Incident angle slider** (0° to 89°): Angle of the incoming ray from the normal. Critical angle highlights in red when the ray would undergo TIR.

**Wavelength selector** (400–700 nm visible spectrum): Changes the ray color and applies the Cauchy dispersion formula `n(λ) = A + B/λ²` to show chromatic dispersion. Multiple wavelengths can be shown simultaneously with a "show spectrum" toggle.

**Show/hide buttons**: Toggle display of normal line, angle labels (θ₁ and θ₂), Snell's equation overlay, apparent-position dashed line.

**Scene mode dropdown**: "Single Ray", "Straw in Water" (the broken straw visualization), "Underwater Fish" (with aim-the-harpoon game mode), "Mirage" (gradient-index simulation), "Diamond" (internal reflections and sparkle).

**Apparent vs Actual toggle**: Shows a split view with dashed lines indicating where an observer above the water perceives the object vs where it actually is, with a numerical readout of the depth discrepancy.

## Production Notes

**Runtime estimate:** ~12–15 minutes total. Hook (1 min), Naive code build (3 min, live coding), Failure reveal (1 min), Physics explanation (3 min with whiteboard equations), Fix + code (2 min), Wow demos (3 min with commentary), Interactive demo walkthrough (2 min).

**Screen layout:** 60/40 split — left: live Canvas simulation, right: code editor (VS Code with dark theme). When coding, highlight the key line in the editor and simultaneously show its effect in real-time on the canvas.

**Animations to prepare in advance:** The marching-band wavefront animation (soldiers pivoting at the mud boundary) is best as a pre-rendered animation. The rainbow formation diagram (spherical droplet with ray paths) should be a vector illustration. The eye/cornea diagram for the real-world examples section.

**Key zoom moments:** (1) Zoom into the kink in the straw at the waterline — this is the hero shot of the video, mirrors the thumbnail. (2) Zoom into the sin(θ) formula update in the code when the fix is applied. (3) Zoom into the diamond facets as sparkle appears with the chromatic dispersion.

**B-roll ideas:** Real macro photography of a straw in a glass of water. Pool tiles looking shallower than they are. A mirage on a hot road in summer. A cut gemstone rotating under a point light source.

**Camera:** Code segments should be screen-recorded at 4K, 60fps. Zoom/pan effects in post to guide viewer attention to the critical line of code. Talking-head segments should use a shallow-DOF camera over a clean desk with physics props: real straw in glass, laser pointer, glass prism.

## Tags
`physics` `optics` `snells-law` `refraction` `light` `javascript` `canvas` `beginner`

## Thumbnail

Close-up macro photo of a thick glass straw in a water-filled glass, shot at waterline level so the apparent "break" in the straw is perfectly visible and dramatic. The straw is bright white against a deep blue water background. Overlaid are two glowing lines: a yellow-green ray entering from the upper-right, then bending sharply at the waterline and continuing in a different direction below. Bold white text at the bottom reads "WHY IT BENDS" with a smaller subline "Snell's Law in 12 minutes." The visual triggers a specific childhood memory — everyone has seen a bent straw — combined with a mathematical promise that feels achievable. The bent ray overlay tells viewers this is a simulation/coding video, not just a physics lecture. Color palette: deep blue water, bright white straw, high-contrast yellow ray. Emotion: "I've seen this my whole life and never knew why."
