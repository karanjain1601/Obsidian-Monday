---
title: "Measuring Bullet Speed With a Pendulum"
id: SB127
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, momentum, ballistic-pendulum]
---

> **What it is:** A ~45-second simulation short where a bullet embeds in a hanging wooden block in 100× slow motion, the block swings up to a measured height of 0.12 m, and a two-step math panel chains energy conservation then momentum conservation to calculate the bullet's initial speed as 308 m/s — the same method invented in 1742. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Measuring Bullet Speed With a Pendulum
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A wooden block (brown rectangle, 60×80 px) hangs from two white strings against a dark grey background. Without warning, a tiny bright yellow bullet (radius 4 px) streaks across from the left at extreme speed (long motion blur trail). Block SLAMS — swings violently upward. Text: **"How fast was that bullet?"**

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene resets to initial state. Labels appear: block labeled **"M = 2.0 kg"** (white, above block), strings labeled with pendulum length **"L = 0.8 m"** (white with dimension line). Bullet labeled **"m = 0.010 kg (10 g)"** (yellow, left side). Bullet velocity shown as unknown: **"v = ?"** (red question mark).

**0:08** — Slow-motion replay (label: **"Slow Motion 100×"** top-left, grey). Bullet travels right at reduced speed. Contact point flashes white on entry. Block deforms slightly (subtle squish animation, 3 frames). Bullet visible embedded in block (tiny yellow dot inside brown rectangle) as they become one combined system.

**0:14** — Combined system (block + bullet) begins swinging upward in an arc. White pendulum string (2 px) remains taut, pivoting about the top anchor point. A dotted arc traces the swing path. Height indicator appears: a horizontal green dashed line at the block's maximum height, with a vertical bracket labeled **"h = ?"** and measurement ticks on the left side.

**0:20** — Block reaches peak height. Pendulum stops momentarily at maximum swing angle (~35° from vertical). Green bracket fully extends and labels: **"h = 0.12 m"** (green text, yellow highlight). Slow motion pauses here for 1 second.

**0:26** — Math panel slides up from the bottom (dark background, white text in two columns). Step 1: **"Step 1: Energy conservation (swing)"** — equation **"(M+m)gh = ½(M+m)V²"** → **"V = √(2gh) = √(2×9.81×0.12) = 1.53 m/s"** (yellow highlight on answer). V is the speed of block+bullet just after collision.

**0:32** — Step 2: **"Step 2: Momentum conservation (collision)"** — equation **"mv = (M+m)V"** → **"v = (M+m)V / m = (2.01 × 1.53) / 0.010"** → **"v = 308 m/s"** (bold green, large font). Red question mark from earlier transforms into the answer **"308 m/s"** with a satisfying green checkmark.

**0:38** — Full simulation replay at real speed with all labels now filled in. Bullet fires, block swings, height labels and speed labels already annotated. A small info card: **"This method was used before radar guns existed."** Below: **"Invented by Benjamin Robins, 1742."**

**0:43** — Schematic summary diagram (white on dark): bullet arrow → block → swing arc → height bracket. Below: two equations side-by-side: **"mv = (M+m)V"** and **"V = √(2gh)"**. Caption: **"Two equations. One pendulum. Bullet speed revealed."**

## Physics Concept Teased
The ballistic pendulum combines two conservation laws: momentum conservation during the instantaneous collision determines the block's initial velocity, and energy conservation during the pendulum swing determines the height — together yielding the bullet's initial speed.

## On-Screen Text / Captions
- **0:00** — "How fast was that bullet?" (center, bold white)
- **0:03** — "M = 2.0 kg, L = 0.8 m, m = 0.010 kg, v = ?" (labels as described)
- **0:08** — "Slow Motion 100×" (top-left, grey italic)
- **0:20** — "h = 0.12 m" (green bracket label)
- **0:26** — "Step 1: Energy conservation → V = 1.53 m/s" (panel, yellow)
- **0:32** — "Step 2: Momentum conservation → v = 308 m/s" (panel, bold green)
- **0:38** — "Invented by Benjamin Robins, 1742" (info card, white)
- **0:43** — "Two equations. One pendulum. Bullet speed revealed." (center, white bold)

## End Card
Final 3 seconds: Pendulum swings once more in silhouette on dark grey. White text: **"Follow CodedLaws for more physics secrets."** Logo bottom-right.

## Audio
Music: Low, tense pizzicato strings at 0:00–0:07; sharp percussion impact at bullet collision (0:08 slow-mo); gentle woodwind melody during math explanation (0:26–0:36); triumphant short brass sting at **"308 m/s"** reveal (0:32). No voiceover. Sound effects: whoosh (bullet flight), hard thwack (impact), pendulum swish (high-quality cloth/wood sound) during swing.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: simulate the pendulum as a rigid-body pivot — store angle θ, angular velocity ω, update with α = −(g/L)sinθ each frame. Set initial ω from V (the post-collision speed) using ω₀ = V/L. Mark maximum height from h = L(1−cosθ_max). The slow-motion replay: run physics at 1/100 normal speed (multiply dt by 0.01) for the collision segment, then restore dt=1/60 for the swing. Bullet embedding: after collision, set bullet position to block center and render as fixed yellow dot inside brown rect. Math panel: use timed CSS transitions to reveal each line sequentially (0.5 s delay between lines). Runtime: ~46 seconds. Gotcha: perfectly inelastic collision means bullet stops relative to block immediately — don't animate a penetration path; just snap bullet to block center on contact frame.
