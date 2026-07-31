---
title: "Flutter — Map of Content"
aliases: [MOC Flutter]
tags: [MOC, WebDevelopment, Flutter]
domain: Web Development
created: 2026-07-26
status: complete
---

# 🐦 Flutter — Map of Content

> [!abstract] What This Section Covers
> Google's UI toolkit that compiles one Dart codebase to iOS, Android, web, and desktop — and, unlike React Native, owns its rendering engine (Impeller/Skia) to paint every pixel itself for pixel-perfect cross-platform parity and 120fps animation. This section covers: the Dart language essentials (including advanced streams and isolates), the Flutter architecture (three synchronized trees), widgets and layout, state management (setState → Provider → Riverpod → BLoC), navigation, networking (dio, WebSockets, GraphQL), Firebase integration, animations (implicit, explicit, Lottie, Rive), testing (unit, widget, integration, golden), and CI/CD/deployment (Codemagic, Fastlane, GitHub Actions, App Store, Play Store).

## Concept Map

```mermaid
graph TD
    CENTER["🐦 Flutter"]

    CENTER --> Arch["[[Flutter_Architecture]]\nWidget/Element/RenderObject trees\nImpeller rendering · build modes"]
    CENTER --> Dart["[[Dart_Language]]\nnull safety · async/await\nisolates · streams · mixins"]
    CENTER --> DartAdv["[[Dart_Advanced]]\nStreams · Isolates · compute()\nFutures · extension methods · FFI"]
    CENTER --> Widgets["[[Widgets_and_Layout]]\nStateless/Stateful · lifecycle\nlayout constraints · slivers · keys"]
    CENTER --> State["[[State_Management_Flutter]]\nsetState → Provider → Riverpod\nBLoC/Cubit · decision guide"]
    CENTER --> Nav["[[Flutter_Navigation]]\nNavigator 1/2 · GoRouter\ndeep linking · Hero · PopScope"]
    CENTER --> Net["[[Flutter_Networking]]\ndio · http · json_annotation\nWebSockets · GraphQL"]
    CENTER --> FB["[[Flutter_Firebase]]\nAuth · Firestore · FCM\nAnalytics · FlutterFire setup"]
    CENTER --> Anim["[[Flutter_Animations]]\nimplicit · explicit · Hero\nLottie · Rive · staggered"]
    CENTER --> Test["[[Flutter_Testing]]\nunit · widget · integration\ngolden · Mocktail · coverage"]
    CENTER --> CICD["[[Flutter_CICD_and_Deployment]]\nCodemagic · Fastlane · GitHub Actions\nApp Store · Play Store · flavors"]

    Dart -->|"language for"| Arch
    DartAdv -->|"advanced patterns"| Dart
    Arch -->|"widgets use"| Widgets
    Widgets -->|"state in"| State
    State -->|"with nav"| Nav
    Net -->|"data from"| State
    FB -->|"backend for"| State
    Test -->|"validates"| CICD

    style CENTER fill:#7c3aed,color:#fff
    style Arch fill:#0891b2,color:#fff
    style Dart fill:#2563eb,color:#fff
    style DartAdv fill:#1d4ed8,color:#fff
    style Widgets fill:#059669,color:#fff
    style State fill:#d97706,color:#fff
    style Nav fill:#dc2626,color:#fff
    style Net fill:#0369a1,color:#fff
    style FB fill:#ea580c,color:#fff
    style Anim fill:#9333ea,color:#fff
    style Test fill:#16a34a,color:#fff
    style CICD fill:#475569,color:#fff
```

## Learning Path

1. [[Dart_Language]] — Null safety, named/optional params, constructor kinds, mixins, async/await, streams, and isolates.
2. [[Dart_Advanced]] — Streams deep dive, Isolates, `compute()`, async generators, extension methods, and Dart FFI.
3. [[Flutter_Architecture]] — The three synchronized trees, Impeller rendering, build modes, and platform channels.
4. [[Widgets_and_Layout]] — StatelessWidget, StatefulWidget lifecycle, the constraint protocol ("constraints down, sizes up"), slivers, and keys.
5. [[State_Management_Flutter]] — The progression from `setState` to Provider, Riverpod 2.x, and BLoC — with a decision guide.
6. [[Flutter_Navigation]] — Navigator 1.0 vs 2.0, GoRouter, deep linking, `StatefulShellRoute`, Hero transitions, and `PopScope`.
7. [[Flutter_Networking]] — REST APIs with dio/http, JSON serialization with `json_annotation`, WebSockets, and GraphQL.
8. [[Flutter_Firebase]] — FlutterFire setup, Firebase Auth, Firestore real-time sync, FCM push notifications, and Analytics.
9. [[Flutter_Animations]] — Implicit vs explicit animations, AnimationController, Tween, Hero, Lottie, Rive, and staggered sequences.
10. [[Flutter_Testing]] — Unit, widget, and integration tests; `WidgetTester`; Mocktail; golden tests; test coverage.
11. [[Flutter_CICD_and_Deployment]] — Flavors, code signing, Codemagic, GitHub Actions, App Store, and Play Store publishing.

## All Notes at a Glance

| Note | Difficulty | What You'll Learn |
|------|------------|-------------------|
| [[Dart_Language]] | Intermediate | Null safety, ?/??/!/ late, factory/const constructors, mixins, isolates, streams |
| [[Dart_Advanced]] | Advanced | Streams, Isolates, compute(), async*, extension methods, Dart FFI |
| [[Flutter_Architecture]] | Intermediate | Widget/Element/RenderObject trees, Impeller, debug/profile/release, MethodChannel |
| [[Widgets_and_Layout]] | Intermediate | Stateless/Stateful, lifecycle, Row/Column/Stack, Expanded, slivers, CustomPaint, Keys |
| [[State_Management_Flutter]] | Intermediate | setState, InheritedWidget, Provider, Riverpod, BLoC/Cubit |
| [[Flutter_Navigation]] | Intermediate | push/pop, GoRouter, path params, redirect guards, deep linking, Hero |
| [[Flutter_Networking]] | Intermediate | dio vs http, interceptors, json_annotation, build_runner, WebSockets, GraphQL |
| [[Flutter_Firebase]] | Intermediate | FlutterFire setup, Auth, Firestore streams, FCM, Analytics, Cloud Functions |
| [[Flutter_Animations]] | Intermediate | AnimationController, Tween, CurvedAnimation, Hero, Lottie, Rive, staggered |
| [[Flutter_Testing]] | Intermediate | Unit/widget/integration tests, WidgetTester, Mocktail, golden tests, coverage |
| [[Flutter_CICD_and_Deployment]] | Advanced | Flavors, Fastlane Match, GitHub Actions, Codemagic, store publishing, code signing |

## Key Questions This Section Answers

- What are the three synchronized trees in Flutter and what does each do?
- Why does Flutter own its rendering engine (Impeller/Skia) instead of using native widgets?
- What is the constraint protocol: "constraints go down, sizes go up, parent positions"?
- When do you use Provider vs Riverpod vs BLoC for state management?
- What is the difference between Navigator 1.0 and Navigator 2.0 (the Router API)?
- How do you implement deep linking in Flutter?
- When should you use `compute()` vs a long-lived Isolate for CPU-heavy work?
- What is the difference between implicit and explicit Flutter animations?
- How does FlutterFire Auth integrate with Firestore security rules?
- What is the difference between unit, widget, and integration tests in Flutter?
- How do flavors work, and what is the role of code signing in deployment?

## Related Sections

- [[_MOC_WebDev_Master|↑ Web Dev Master MOC]]
- [[_MOC_TypeScript|← TypeScript]] (Dart has similar type system concepts)
- [[_MOC_React|← React]] (widget model similarities to React component model)

#MOC #WebDevelopment #Flutter
