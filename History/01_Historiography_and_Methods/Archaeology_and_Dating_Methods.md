---
title: "Archaeology and Dating Methods"
aliases: ["Dating the Past", "Absolute and Relative Dating", "Archaeological Methods"]
tags: [history, historiography, methods, archaeology, dating, intermediate]
domain: History
difficulty: intermediate
created: 2026-07-30
related: ["[[Primary_and_Secondary_Sources]]", "[[Periodization_and_Chronology]]", "[[What_Is_History_and_Historiography]]", "[[_MOC_Historiography]]"]
status: complete
---

# 🏺 Archaeology and Dating Methods

> [!abstract] TL;DR
> Where texts fall silent — most of the human past — we know it through **material culture**: the physical residue of human life, recovered and dated by archaeology. Dating splits into **relative** methods that establish sequence (**stratigraphy**, **typology**, **seriation**) and **absolute** methods that assign calendar years (**radiocarbon**, **dendrochronology**, **thermoluminescence**, **potassium-argon**). The workhorse is **radiocarbon dating** (Willard Libby, 1949): living things absorb carbon-14, which decays after death with a half-life of ~5,730 years, so residual C-14 measures elapsed time — once **calibrated** against tree-ring curves to correct for atmospheric variation. **Ancient DNA** now adds a molecular dimension, rewriting the story of human migration.

## Intuition — analogy first

Think of the ground beneath an old city as a **layered cake**, and dating as reading it two ways.

Cut a slice and you see the layers stacked: the bottom layer was poured first, the top last. You don't need a clock to know the *order* — lower means older. That's **stratigraphy**, relative dating: pure sequence, no calendar. And if you find the same distinctive sprinkle only in the middle layer, then any slice containing that sprinkle must belong to that moment — that's **typology and seriation**, dating by the changing style of objects.

But sequence alone won't tell you the cake was baked in 1789. For that you need a layer with a built-in timer. Imagine a layer laced with a substance that fades at a known rate: measure how faded it is, and you get an actual age. That's **absolute dating** — radiocarbon, tree rings, radioactive clocks. Great archaeology weaves the two together: stratigraphy gives the order, absolute methods pin the order to the calendar.

---

## How It Works — The Radiocarbon Clock

```mermaid
graph LR
    Atm["Cosmic rays hit atmosphere\n→ carbon-14 formed"] --> Live["Living organism\nabsorbs C-14 (equilibrium)"]
    Live -->|"death: intake stops"| Decay["C-14 decays to N-14\nhalf-life ~5,730 yr"]
    Decay --> Meas["Measure residual C-14\n(AMS: count atoms)"]
    Meas --> Raw["Raw radiocarbon age\n(BP, uncalibrated)"]
    Raw -->|"correct for atmospheric variation"| Cal["Calibrate vs tree-ring curve\n(IntCal)"]
    Cal --> Date["Calendar-year date range\n(cal BCE/CE, ±)"]

    style Atm fill:#7c3aed,color:#fff
    style Live fill:#2563eb,color:#fff
    style Decay fill:#059669,color:#fff
    style Meas fill:#d97706,color:#fff
    style Raw fill:#0891b2,color:#fff
    style Cal fill:#dc2626,color:#fff
    style Date fill:#db2777,color:#fff
```

## Key Concepts

### Relative Dating — Establishing Sequence

- **Stratigraphy** — borrowed from geology (the **law of superposition**: in undisturbed deposits, lower layers are older). Excavation reads a site as a vertical sequence of contexts. The **Harris Matrix** (Edward Harris, 1973) formalizes stratigraphic relationships into a diagram of what precedes what.
- **Typology** — objects change style over time; ordering artifact *types* (pot forms, tool shapes, coin designs) builds a relative chronology. Pioneered systematically by **Flinders Petrie**.
- **Seriation** — arranging assemblages so that each artifact type follows a "battleship curve" of rising then falling popularity; the ordering that makes all types behave this way is the chronological order. Petrie used it on Egyptian predynastic graves in the 1890s.

### Absolute Dating — Assigning Calendar Years

| Method | Basis | Typical range | Materials |
|--------|-------|---------------|-----------|
| **Radiocarbon (C-14)** | Decay of C-14, half-life ~5,730 yr | ~present to ~50,000 yr | Organic: charcoal, bone, wood, textiles, seeds |
| **Dendrochronology** | Counting/matching annual tree rings | Up to ~12,000+ yr (regional) | Preserved wood, timbers |
| **Thermoluminescence (TL)** | Trapped-electron light released on heating | ~300 to ~500,000 yr | Fired clay, pottery, burnt flint |
| **Potassium-argon / Ar-Ar** | K-40 → Ar-40 decay, half-life ~1.25 billion yr | >100,000 yr to billions | Volcanic rock (dates hominin sites) |
| **Uranium-series** | Decay chain of uranium isotopes | ~1,000 to ~500,000 yr | Calcite, coral, cave formations (dates cave art) |
| **Ancient DNA (aDNA)** | Sequencing degraded genetic material | ~present to ~1–2 million yr (exceptional) | Bone, teeth, sediment |

### Radiocarbon Dating in Depth

Developed by **Willard Libby** at Chicago (1949; Nobel Prize in Chemistry, 1960). Living organisms exchange carbon with the atmosphere and hold a roughly constant ratio of radioactive **carbon-14** to stable carbon-12. At death, intake stops and C-14 decays with a **half-life of ~5,730 years** (the "Cambridge half-life"; Libby's original 5,568-year value is still used by convention for raw ages). Measuring the surviving fraction gives elapsed time. Key subtleties:

- **Calibration is essential.** Atmospheric C-14 has *not* been constant, so raw "radiocarbon years BP" (Before Present, fixed at 1950) must be **calibrated** against independently dated records — chiefly tree rings — using curves like **IntCal** (latest major revision IntCal20). Uncalibrated dates can be off by centuries.
- **AMS** (Accelerator Mass Spectrometry) now counts C-14 atoms directly rather than waiting for decays, allowing dating of milligram samples (a single seed, a thread of the Shroud).
- **Reservoir effects** (marine carbon, "old wood," contamination) can bias results; results always come with an uncertainty (e.g. 3200 ± 40 BP → a calibrated *range*).

### Dendrochronology

Trees add one growth ring per year, thicker in good years. Because a *pattern* of wide and narrow rings is like a barcode of local climate, overlapping samples (a living tree back into ancient timbers) build continuous **master chronologies** stretching millennia (e.g. European oak and bristlecone-pine sequences beyond 10,000 years). Dendrochronology dates wood to the exact year and, crucially, **provides the calibration backbone for radiocarbon**. Developed by astronomer **A.E. Douglass** in the early 20th century (originally to study sunspot cycles in the US Southwest).

### Ancient DNA (aDNA)

Sequencing degraded DNA from bones and teeth — and even from cave sediments — has revolutionized deep human history. **Svante Pääbo** (Nobel Prize in Physiology or Medicine, 2022) sequenced the Neanderthal genome and identified the **Denisovans** from a single finger bone (Denisova Cave, 2010), showing that non-African modern humans carry Neanderthal DNA. aDNA (associated with labs such as David Reich's) has rewritten narratives of migration — e.g. the Bronze Age steppe **Yamnaya** expansion into Europe.

### Material Culture

Beyond dating, archaeology reads **material culture** — objects as evidence of behavior, economy, and belief. This corrects and extends the textual record: it recovers the pre-literate, the illiterate, and the everyday (see [[Primary_and_Secondary_Sources]] on material vs textual sources), and can contradict what elites chose to write down.

## Primary Sources & Examples

- **Ötzi the Iceman:** A body found in the Alps in 1991 was radiocarbon-dated to c. 3350–3100 BCE, and his copper axe, tattoos, and stomach contents (analyzed materially) rebuilt a Copper Age life in extraordinary detail — a showcase of dating plus material culture.
- **The Shroud of Turin:** In 1988, three independent labs used AMS radiocarbon dating on samples and returned a date of c. 1260–1390 CE — consistent with a medieval origin, an illustration of AMS on tiny textile samples (and of the debates over sampling and contamination it can provoke).
- **Recalibrating Egypt:** Radiocarbon programs cross-checked against king-list (regnal) chronology (see [[Periodization_and_Chronology]]) have tightened Egyptian absolute dates, showing how material and textual chronologies are triangulated.
- **Denisova finger bone (2010):** A fragment yielded aDNA revealing a previously unknown human population — evidence with no textual counterpart whatsoever.

## Common Pitfalls / Misconceptions

- **"Radiocarbon gives an exact year."** It gives a *probabilistic range* after calibration (e.g. 68% or 95% confidence intervals), not a single date — and only dates *organic* material.
- **Skipping calibration.** Confusing raw "radiocarbon years BP" with calendar years; the two diverge by centuries in some periods because atmospheric C-14 varied.
- **The association problem.** A method dates the *sample* (a piece of charcoal), not automatically the *event* you care about. "Old wood," residuality, and disturbed stratigraphy can decouple the two.
- **Overreach of ancient DNA.** DNA degrades; contamination is a constant hazard, and genetic ancestry is not identical to culture, language, or ethnicity — equating them repeats old errors.

## Related Concepts

- [[_MOC_Historiography|↑ Section MOC]] — the section hub
- [[Primary_and_Secondary_Sources]] — archaeology supplies and dates the *material* sources that complement and check textual ones
- [[Periodization_and_Chronology]] — absolute dating provides the anchors that convert relative sequences and the three-age system into calendar dates
- [[What_Is_History_and_Historiography]] — material evidence lets historians write the past of pre-literate peoples the written record ignores
- Cross-vault: [[_MOC_Prehistory]] — the domain where these methods are the primary evidence for the human story

## Review Questions

1. Distinguish relative from absolute dating, giving one method of each, and explain how stratigraphy and radiocarbon dating are typically used together on a single site.
2. Explain the physical basis of radiocarbon dating and why calibration against dendrochronology is necessary. What is the significance of the ~5,730-year half-life and the "BP" (Before Present) convention?
3. What is the "association problem" in dating, and how might "old wood" or a disturbed stratum lead a technically accurate radiocarbon date to mislead about the age of an event?

## Sources

- Renfrew, C. & Bahn, P. (2020). *Archaeology: Theories, Methods and Practice* (8th ed.). Thames & Hudson
- Libby, W.F. (1952). *Radiocarbon Dating*. University of Chicago Press
- Reich, D. (2018). *Who We Are and How We Got Here: Ancient DNA and the New Science of the Human Past*. Pantheon
- Harris, E.C. (1979). *Principles of Archaeological Stratigraphy*. Academic Press

#history #historiography #methods #archaeology #dating #radiocarbon
