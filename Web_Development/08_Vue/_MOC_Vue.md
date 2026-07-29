---
title: "Vue — Map of Content"
aliases: [MOC Vue, Vue Section Index]
tags: [MOC, WebDevelopment, Vue]
domain: Web Development
created: 2026-07-29
status: complete
---

# Vue — Map of Content

> [!abstract] What This Section Covers
> Vue 3 is a progressive, component-based UI framework that sits between Angular's full-framework approach and React's minimal-library approach. Vue offers a gentle learning curve with its template-based syntax while providing the full power of the Composition API for complex applications. This section covers: Vue 3 fundamentals and SFC structure, component communication (props/emits/slots), the Proxy-based reactivity system and composable patterns, routing and state management with Vue Router 4 and Pinia, and testing with Vitest + Vue Test Utils plus performance optimization techniques.

## Concept Map

```mermaid
graph TD
    CENTER["🟢 Vue 3"]

    CENTER --> Fund["[[Vue_Fundamentals]]\nSFC · Options/Composition API\nDirectives · Lifecycle · Computed"]
    CENTER --> Comp["[[Vue_Components_and_Props]]\nProps · Emits · Slots\nProvide/Inject · Fallthrough"]
    CENTER --> React["[[Vue_Reactivity_and_Composition_API]]\nref/reactive · computed\nwatchEffect · Composables"]
    CENTER --> Router["[[Vue_Router_and_Pinia]]\nVue Router 4 · Guards\nPinia · defineStore"]
    CENTER --> Test["[[Vue_Testing_and_Performance]]\nVitest · Vue Test Utils\nKeepAlive · v-memo · AsyncComp"]

    Fund -->|"components use"| Comp
    Comp -->|"reactivity powers"| React
    React -->|"composables used in"| Router
    Router -->|"test with"| Test

    style CENTER fill:#42b883,color:#fff
    style Fund fill:#0891b2,color:#fff
    style Comp fill:#2563eb,color:#fff
    style React fill:#7c3aed,color:#fff
    style Router fill:#d97706,color:#fff
    style Test fill:#059669,color:#fff
```

## Learning Path

1. [[Vue_Fundamentals]] — Start here: SFC structure, Options API vs Composition API, template directives, computed/watchers, lifecycle hooks.
2. [[Vue_Components_and_Props]] — Component communication: props with `defineProps`, emits with `defineEmits`, default/named/scoped slots, provide/inject.
3. [[Vue_Reactivity_and_Composition_API]] — Deep dive: `ref` vs `reactive`, `computed`, `watch`/`watchEffect`, custom composables (`useXxx`), reactivity under the hood (Proxy).
4. [[Vue_Router_and_Pinia]] — App-level concerns: Vue Router 4 route config, navigation guards, dynamic routes; Pinia `defineStore`, state/getters/actions, `storeToRefs`.
5. [[Vue_Testing_and_Performance]] — Quality and optimization: Vitest + VTU component tests, mocking Pinia, `v-memo`, `<KeepAlive>`, `defineAsyncComponent`, virtual scrolling.

## All Notes at a Glance

| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Vue_Fundamentals]] | Beginner | SFC, template syntax, v-if/v-for/v-model, computed, watchers, lifecycle hooks |
| [[Vue_Components_and_Props]] | Intermediate | defineProps, defineEmits, slots, provide/inject, attribute inheritance |
| [[Vue_Reactivity_and_Composition_API]] | Intermediate | ref/reactive, Proxy tracking, watchEffect, composables, toRefs |
| [[Vue_Router_and_Pinia]] | Intermediate | Route config, navigation guards, Pinia stores, storeToRefs |
| [[Vue_Testing_and_Performance]] | Advanced | Vitest setup, VTU mount, v-memo, KeepAlive, async components, virtualization |

## Key Questions This Section Answers

- What is a Single File Component and how does it differ from React's JSX approach?
- What is the difference between `ref()` and `reactive()`, and when do you use each?
- How does Vue's Proxy-based reactivity track dependencies automatically?
- How do you write a reusable composable, and why is it better than mixins?
- How do navigation guards enable authentication-protected routes?
- What is the difference between Pinia and Vuex, and why is Pinia the new standard?
- How do you test a Vue component that depends on a Pinia store?

## Related Sections

- [[_MOC_WebDev_Master|↑ Web Dev Master MOC]]
- [[_MOC_React|← React]] — Alternative component framework with similar reactivity concepts
- [[_MOC_TypeScript|← TypeScript]] — Vue 3 and Pinia have first-class TypeScript support
- [[_MOC_Build_Tools|→ Build Tools]] — Vite powers Vue 3's dev server and production builds

#MOC #WebDevelopment #Vue
