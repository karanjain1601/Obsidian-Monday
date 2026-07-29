---
title: "Web Development — Master Map of Content"
aliases: [MOC WebDev Master, Web Development Vault Home]
tags: [MOC, WebDevelopment, MasterMOC]
domain: Web Development
created: 2026-07-26
status: complete
---

# 🌐 Web Development — Master Map of Content

> [!abstract] About This Vault
> A production-focused reference for engineers building browser UIs, single-page and full-stack applications, and cross-platform apps from a single codebase. **79 notes across 13 sections**, covering the full stack progression: markup and styling, the JavaScript runtime, TypeScript's type system, Angular, React, Flutter, Node.js backend, Vue 3, the modern build toolchain, Next.js, React Native mobile development, GraphQL, and Design Systems. Every note pairs an intuition-first analogy with code examples, Mermaid diagrams, trade-off tables, common pitfalls, and review questions. Follow one of the learning paths below, or jump directly to the section that matches your goal.

## Vault Architecture

```mermaid
graph TD
    Master["🌐 Web Dev Master"]

    Master --> S01["01 HTML & CSS Fundamentals"]
    Master --> S02["02 JavaScript Core"]
    Master --> S03["03 TypeScript"]
    Master --> S04["04 Angular"]
    Master --> S05["05 React"]
    Master --> S06["06 Flutter"]
    Master --> S07["07 Node.js"]
    Master --> S08["08 Vue"]
    Master --> S09["09 Build Tools"]

    S07 --> N1["NodeJS Fundamentals"]
    S07 --> N2["Modules & NPM"]
    S07 --> N3["Async & Streams"]
    S07 --> N4["HTTP & REST"]
    S07 --> N5["Express Framework"]
    S07 --> N6["DB & Production"]

    S08 --> V1["Vue Fundamentals"]
    S08 --> V2["Components & Props"]
    S08 --> V3["Reactivity & Composition API"]
    S08 --> V4["Router & Pinia"]
    S08 --> V5["Testing & Performance"]

    S09 --> B1["Build Tools Overview"]
    S09 --> B2["Vite & Rollup"]
    S09 --> B3["Webpack"]
    S09 --> B4["Package Managers"]

    style Master fill:#7c3aed,color:#fff
    style S01 fill:#2563eb,color:#fff
    style S02 fill:#d97706,color:#fff
    style S03 fill:#059669,color:#fff
    style S04 fill:#dc2626,color:#fff
    style S05 fill:#0891b2,color:#fff
    style S06 fill:#7c3aed,color:#fff
    style S07 fill:#059669,color:#fff
    style S08 fill:#2563eb,color:#fff
    style S09 fill:#d97706,color:#fff
    style S10 fill:#7c3aed,color:#fff
    style S11 fill:#0891b2,color:#fff
    style S12 fill:#059669,color:#fff

    S10 --> NX1["NextJS Fundamentals"]
    S10 --> NX2["App Router"]
    S10 --> NX3["Data Fetching"]
    S10 --> NX4["Optimization"]
    S10 --> NX5["Auth + Deploy"]
    S10 --> NX6["Fullstack Patterns"]

    Master --> S10["10 Next.js"]
    Master --> S11["11 React Native"]
    Master --> S12["12 GraphQL"]

    S11 --> RN1["RN Fundamentals"]
    S11 --> RN2["Core Components"]
    S11 --> RN3["Styling & Layout"]
    S11 --> RN4["Navigation"]
    S11 --> RN5["Device APIs"]
    S11 --> RN6["Production"]

    S12 --> GQ1["GraphQL Fundamentals"]
    S12 --> GQ2["Schema & Types"]
    S12 --> GQ3["Queries & Mutations"]
    S12 --> GQ4["Resolvers"]
    S12 --> GQ5["Apollo Server & Client"]
    S12 --> GQ6["GraphQL Advanced"]

    Master --> S13["13 Design System"]

    style S13 fill:#ff4785,color:#fff

    S13 --> DS1["Design System Overview"]
    S13 --> DS2["Design Tokens"]
    S13 --> DS3["Component Library"]
    S13 --> DS4["Accessibility Standards"]
    S13 --> DS5["Storybook & Testing"]
```

## Sections at a Glance

| # | Section | Notes | Entry Point | Difficulty |
|---|---------|-------|-------------|------------|
| 01 | HTML & CSS Fundamentals | 5 | [[_MOC_HTML_CSS]] | Beginner |
| 02 | JavaScript Core | 5 | [[_MOC_JavaScript_Core]] | Beginner → Intermediate |
| 03 | TypeScript | 5 | [[_MOC_TypeScript]] | Intermediate |
| 04 | Angular | 5 | [[_MOC_Angular]] | Intermediate → Advanced |
| 05 | React | 5 | [[_MOC_React]] | Intermediate → Advanced |
| 06 | Flutter | 5 | [[_MOC_Flutter]] | Intermediate → Advanced |
| 07 | Node.js | 6 | [[_MOC_NodeJS]] | Intermediate |
| 08 | Vue | 5 | [[_MOC_Vue]] | Intermediate |
| 09 | Build Tools | 4 | [[_MOC_Build_Tools]] | Beginner → Intermediate |
| 10 | Next.js | 6 | [[_MOC_NextJS]] | Intermediate → Advanced |
| 11 | React Native | 6 | [[_MOC_React_Native]] | Intermediate → Advanced |
| 12 | GraphQL | 6 | [[_MOC_GraphQL]] | Intermediate → Advanced |
| 13 | Design System | 5 | [[_MOC_Design_System]] | Intermediate |

---

## Learning Paths

### Path 1 — Frontend Developer

> Best for: engineers building browser UIs and want a systematic foundation.

**HTML/CSS → JavaScript → TypeScript → React**

[[_MOC_HTML_CSS]] → [[HTML5_Semantics]] → [[CSS_Box_Model]] → [[Flexbox_and_Grid]] → [[Responsive_Design]] → [[_MOC_JavaScript_Core]] → [[JS_Fundamentals]] → [[DOM_Manipulation]] → [[Async_JS_Promises]] → [[ES6_Modern_Features]] → [[_MOC_TypeScript]] → [[TypeScript_Fundamentals]] → [[_MOC_React]] → [[React_Fundamentals]] → [[Hooks_in_React]]

---

### Path 2 — Full-Stack Developer

> Best for: engineers building end-to-end applications with a JavaScript runtime.

**JavaScript → TypeScript → Next.js → Angular**

[[_MOC_JavaScript_Core]] → [[JS_Modules_Bundling]] → [[_MOC_TypeScript]] → [[Type_System_Advanced]] → [[Generics_in_TypeScript]] → [[_MOC_React]] → [[Next_js]] → [[State_Management_Redux]] → [[_MOC_Angular]] → [[Angular_Architecture]] → [[Services_and_DI]] → [[Angular_Routing_Forms]]

---

### Path 3 — Mobile Developer

> Best for: engineers targeting iOS, Android, and web from a single codebase.

**React path (if you know React):** React Native Fundamentals → Core Components → Navigation → Device APIs → Production

[[_MOC_React_Native]] → [[React_Native_Fundamentals]] → [[React_Native_Core_Components]] → [[React_Native_Navigation]] → [[React_Native_Device_APIs]] → [[React_Native_Production]]

**Flutter path (greenfield, pixel-perfect UI):** Dart → Flutter Architecture → Widgets → State → Navigation

[[_MOC_Flutter]] → [[Dart_Language]] → [[Flutter_Architecture]] → [[Widgets_and_Layout]] → [[State_Management_Flutter]] → [[Flutter_Navigation]]

---

### Path 4 — UI/UX Engineer

> Best for: designers-turned-engineers focused on visual precision, animation, and accessibility.

**CSS Deep Dive → Responsive → CSS Variables → React**

[[_MOC_HTML_CSS]] → [[CSS_Box_Model]] → [[Flexbox_and_Grid]] → [[CSS_Variables_Custom_Properties]] → [[Responsive_Design]] → [[_MOC_React]] → [[React_Performance]] → [[_MOC_Flutter]] → [[Widgets_and_Layout]]

---

## Cross-Vault Links

- **AI/ML vault** — [[_MOC_AI_ML_Master]] for ML-powered features, LLM integration, and model deployment that complements frontend work.
- **System Design vault** — [[_MOC_SystemDesign_Master]] for API design, CDN architecture, and the backend systems that web apps consume.
- **Database vault** — [[_MOC_Database_Master]] for data persistence, SQL, and the storage layer behind full-stack applications.
- **DSA vault** — [[_MOC_DSA_Master]] for algorithmic thinking and interview preparation.

---

## Section MOC Index

- [[_MOC_HTML_CSS]] — The declarative foundation: semantic HTML5, the CSS box model, Flexbox, Grid, custom properties, and responsive design.
- [[_MOC_JavaScript_Core]] — The universal runtime: types/coercion, closures, the event loop, async/promises, and modules/bundling.
- [[_MOC_TypeScript]] — Structural typing over JavaScript: fundamentals, advanced types, generics, React integration, and tooling.
- [[_MOC_Angular]] — Google's complete framework: architecture, components, DI, RxJS observables, and routing/forms.
- [[_MOC_React]] — Meta's composable UI library: fundamentals, hooks, state management, performance, and Next.js.
- [[_MOC_Flutter]] — Google's cross-platform UI toolkit: architecture, Dart, widgets, state management, and navigation.
- [[_MOC_NodeJS]] — Server-side JavaScript: event loop, CommonJS/ESM, streams, Express, database integration, and production deployment.
- [[_MOC_Vue]] — Vue 3's Composition API: reactivity system, SFCs, Vue Router 4, Pinia state management, and Vitest testing.
- [[_MOC_Build_Tools]] — The JavaScript toolchain: module systems, Vite/Rollup, Webpack 5, and package manager tradeoffs.
- [[_MOC_NextJS]] — Next.js App Router, rendering strategies (SSG/ISR/SSR/CSR), image/font/script optimization, Auth.js, deployment, and fullstack patterns.
- [[_MOC_React_Native]] — Meta's cross-platform mobile framework: Expo workflow, core components, StyleSheet + Flexbox, React Navigation, Expo SDK device APIs, and EAS Build/deploy.
- [[_MOC_GraphQL]] — GraphQL query language for APIs: SDL type system, resolver chains, DataLoader N+1 solution, Apollo Server/Client integration, federation, persisted queries, and the Relay specification.
- [[_MOC_Design_System]] — The shared language between design and engineering: design tokens (global/alias/component tiers, Style Dictionary, dark mode), component library (Atomic Design, React CVA + forwardRef, Vue defineProps + slots), WCAG 2.1/2.2 accessibility (POUR, ARIA, axe-core), and Storybook documentation with Chromatic visual regression testing.

#MOC #WebDevelopment #MasterMOC
