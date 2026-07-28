---
title: "3 Rules. 10,000 Birds. Nobody Told Them What to Do."
season: 2
episode: 19
difficulty: 5/10
concept: "Emergence from local boid rules with spatial hashing"
prereq: "E16 (particle systems) + E13 (spatial hashing)"
tags: [boids-simulation, flocking-algorithm, emergence, spatial-hashing, javascript, murmuration, Craig-Reynolds, agent-based-modeling]
type: playlist-video
---

## S2·E19 — "3 Rules. 10,000 Birds. Nobody Told Them What to Do."

- **Alt title:** "How Emergent Flocking Behavior Breaks Your Intuition About Programming"
- **Difficulty:** 5/10 · **Prereq:** E16 (particle systems) + E13 (spatial hashing)
- **Hook:** 10,000 boids that coalesce into a murmuration-like flock — splitting around a predator, swirling in connected sheets, and reforming — with no global coordinator, no choreography, and only three local rules per agent.
- **The break (bug):** Without spatial hashing, 10,000 boids doing pairwise neighbor searches require N² = 100 million comparisons per frame. FPS drops to zero. The simulation works perfectly with 100 boids, completely breaks with 10,000. Adding a spatial hash grid (divides space into cells; each boid only checks its cell and adjacent cells) reduces neighbor lookup to O(1) average case.
- **Concept introduced:** Emergence — complex collective behavior arising from simple local rules without any global coordination. Craig Reynolds' three boid rules: (1) Separation: steer away from too-close neighbors; (2) Alignment: steer toward the average heading of neighbors; (3) Cohesion: steer toward the average position of neighbors. Spatial hashing as an O(1) neighbor-lookup data structure for uniform grids.
- **Push it / wow moment:** Add a predator boid (larger, chases boids). Watch the flock split and reform around it — an emergent escape behavior nobody programmed. Add a wind field (spatially varying velocity added to each boid's update). Watch the flock flow around wind obstacles.
- **Demo:** Sliders for separation, alignment, and cohesion weights. Click to add/remove predators. Slow-motion mode that shows a single boid's decision: its three force vectors and their weighted sum. Boid count up to 50,000.
- **Tags:** `boids-simulation` `flocking-algorithm` `emergence` `spatial-hashing` `javascript` `murmuration` `Craig-Reynolds` `agent-based-modeling`
- **Thumbnail:** A spectacular murmuration silhouette shaped like a swooping bird, formed by 10,000 glowing dots, against a dusk-orange sky.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_2/_Season_2_Overview|Season 2 Overview]]*
