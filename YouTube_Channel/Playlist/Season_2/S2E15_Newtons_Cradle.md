---
title: "Newton's Cradle: My Physics Engine Got the Count Wrong"
season: 2
episode: 15
difficulty: 5.5/10
concept: "Impulse-based simultaneous constraint resolution"
prereq: "E14 (collision framework) + E02 (restitution)"
tags: [Newtons-cradle, impulse-based-physics, collision-response, javascript, constraint-resolution, momentum-conservation, rigid-body, LCP]
type: playlist-video
---

## S2·E15 — "Newton's Cradle: My Physics Engine Got the Count Wrong"

- **Alt title:** "Why Coding Newton's Cradle Is Harder Than It Looks"
- **Difficulty:** 5.5/10 · **Prereq:** E14 (collision framework) + E02 (restitution)
- **Hook:** A five-ball Newton's cradle. Pull back two balls and release. Three balls rise on the other side. Pull back one ball — wrong number rises again. Something is wrong with the collision math.
- **The break (bug):** Sequential pairwise collision resolution — resolve collision between ball 1 and ball 2, then 2 and 3, then 3 and 4, etc. — distributes momentum incorrectly. Each resolution changes the velocity of involved balls *before* the next collision is resolved, creating cumulative errors. Newton's cradle requires resolving all simultaneous contacts *as a system*, not sequentially. The correct tool is impulse-based constraint resolution (linear complementarity problem formulation).
- **Concept introduced:** Impulse-based rigid body contact resolution. Contacts are expressed as velocity constraints (`v_rel · n ≥ 0` after impulse application). Solving all constraints simultaneously via LCP or iterative projection gives physically correct multi-contact behavior. Sequential resolution is a common approximation that fails for chain contacts.
- **Push it / wow moment:** Cradle with balls of different masses — the output pattern (which balls rise, how many, with what velocity) is completely non-obvious and counterintuitive, but exactly correct. Viewers can predict outcomes and then verify with the simulation.
- **Demo:** Drag any number of balls to any height. Change individual ball masses via sliders. Slow-motion replay. Live energy and momentum meters. Export the collision event as a sequence of screenshots.
- **Tags:** `Newtons-cradle` `impulse-based-physics` `collision-response` `javascript` `constraint-resolution` `momentum-conservation` `rigid-body` `LCP`
- **Thumbnail:** Newton's cradle mid-swing — the wrong number of balls rising on the right side (e.g., 3 up when 2 were pulled). "THAT'S WRONG" label.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
