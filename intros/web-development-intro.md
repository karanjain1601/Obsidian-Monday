# Web Development: Introduction to All Topics

This document is a guided tour of the 6 sections in the Web Development knowledge base — a production-focused reference for engineers building browser UIs, single-page and full-stack applications, and cross-platform apps from a single codebase. The content targets staff-level engineers and covers the full stack progression: markup and styling, the JavaScript runtime, TypeScript's type system, the Angular and React component ecosystems, and Flutter/Dart for native-quality mobile, web, and desktop.

**Suggested learning path:** HTML & CSS → JavaScript → TypeScript → Angular & React (either order) → Flutter. Each module opens with an explicit prerequisite callout; foundational mechanics come first, then tooling, then real-world architecture.

---

## 01. HTML & CSS

The declarative foundation under every rendered pixel: HTML supplies the semantic document structure that browsers, search engines, and assistive tech all parse, while CSS controls layout, motion, and adaptability across every viewport.

**What's covered:**
- **Semantic HTML** — HTML5 sectioning elements and landmark regions, ARIA roles, microdata, and how the browser builds the accessibility tree from meaningful markup rather than `<div>` soup.
- **Box Model, Cascade & Selectors** — The four box layers (content → padding → border → margin); `box-sizing: content-box` vs `border-box` and the universal reset `*, *::before, *::after { box-sizing: border-box }`; vertical margin collapsing (adjacent siblings, parent/first-child leak, never horizontal, never in flex/grid, blocked by a BFC via `display: flow-root`); the cascade order (origin & importance → `@layer` → specificity → source order); specificity as an (a,b,c) tuple where one ID (1,0,0) beats any pile of classes (0,9,9), and `:where()` contributes zero while `:is()`/`:not()`/`:has()` take their most-specific argument; pseudo-elements `::before`/`::after` render only with a `content` property.
- **Flexbox** — One-dimensional layout: container vs item properties, main/cross axes, the `flex-grow`/`flex-shrink`/`flex-basis` sizing algorithm, alignment (`justify-content`/`align-items`), and canonical patterns (centering, nav bars, holy-grail rows).
- **CSS Grid** — Two-dimensional layout: tracks/lines/cells/areas, the `fr` unit and `repeat()` (which absorbs `gap` where percentages overflow), ASCII-art `grid-template-areas`, auto-placement, the media-query-free responsive gallery `repeat(auto-fit, minmax(200px, 1fr))` (`auto-fit` collapses vs `auto-fill` reserves), `subgrid`, and intrinsic sizing (`min-content`/`max-content`/`fit-content`/the `minmax(0, 1fr)` shrink trick).
- **Animations & Transitions** — CSS `transition` and `@keyframes`; animating only compositor-friendly properties (`transform`, `opacity`) to avoid layout/paint; the FLIP technique; the Web Animations API (WAAPI); honoring `prefers-reduced-motion`.
- **Responsive Design** — The non-negotiable viewport meta (`width=device-width, initial-scale=1`, never `user-scalable=no`); mobile-first `min-width` queries on `rem` breakpoints (36/48/64/80rem ≈ 576/768/1024/1280px); fluid type via `clamp(MIN, PREFERRED, MAX)` e.g. `clamp(1.75rem, 1rem + 5vw, 3rem)`; container queries (`container-type: inline-size`, `@container`, `cqi`/`cqw` units); responsive images with `srcset`/`sizes` and `<picture>` art direction; always reserving image `width`/`height`/`aspect-ratio` to prevent Cumulative Layout Shift (CLS).

**Key mental models:** Apply `border-box` globally and keep specificity low and flat (avoid IDs and `!important`); reach for Grid in two dimensions and Flexbox in one; go mobile-first with `rem` breakpoints; reserve space for media to protect the CLS Core Web Vital.

---

## 02. JavaScript

The universal runtime of the web — deceptively simple syntax over a rich model of prototype chains, a single-threaded event loop, and well-defined but treacherous coercion rules.

**What's covered:**
- **Data Types & Coercion** — Seven primitives plus Object; the immortal `typeof null === "object"` bug; every Number is an IEEE 754 double, so `0.1 + 0.2 === 0.30000000000000004` and `Number.MAX_SAFE_INTEGER` is 2⁵³−1 (9,007,199,254,740,991); the exactly eight falsy values (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`) — note `[]` and `{}` are truthy; the abstract equality (`==`) algorithm vs strict `===`; `NaN !== NaN` so test with `Number.isNaN`; controlling conversion with `Symbol.toPrimitive` (hints `number`/`string`/`default`) falling back to `valueOf`/`toString`.
- **Closures & Scope** — Lexical scope and environment records, closure capture mechanics, the four `this` binding rules (default/implicit/explicit/`new`), and the temporal dead zone (TDZ) for `let`/`const`.
- **Prototypes & OOP** — The `[[Prototype]]` chain and `Object.create`, `class` as sugar over prototypes, `#private` fields, mixins, and property descriptors (`writable`/`enumerable`/`configurable`, getters/setters).
- **Event Loop** — One call stack, host-provided async (Web APIs in the browser, libuv in Node); run-to-completion semantics; microtasks (Promise reactions, `queueMicrotask`, `MutationObserver`) drain **entirely** after each macrotask (`setTimeout`, I/O, UI events) and before render — so `setTimeout(fn, 0)` runs after all microtasks; Node's libuv phases (timers → pending → poll → check → close) with `process.nextTick` > Promise microtasks and `setImmediate` beating `setTimeout(0)` inside I/O; anything >50 ms is a "long task" (Long Tasks API via `PerformanceObserver`) → slice work, `scheduler.yield`, or offload to a Web Worker.
- **Promises & Async/Await** — Promise lifecycle and `.then` chaining; the combinators `all`/`allSettled`/`race`/`any`; `async`/`await` as desugared Promise chains; async iteration (`for await...of`); top-level `await` in modules.
- **Modules & Bundlers** — ESM (static, live read-only bindings, tree-shakeable, top-level await) vs CommonJS (dynamic `require`, value-snapshot exports, synchronous); circular-dependency hazards; tree shaking requires ESM + `"sideEffects": false` + named exports; Webpack chunk types (entry/vendor/dynamic/runtime, `splitChunks`, `[contenthash]`); Vite serves native ESM in dev (esbuild pre-bundles deps) and ships Rollup builds for prod; code splitting via dynamic `import()` and `React.lazy` + `Suspense`, split at route boundaries first.

**Key mental models:** JS is single-threaded and run-to-completion — never block the main thread; microtasks always jump ahead of macrotasks (even a zero-delay timer); never compare floats with `===` (use an epsilon or integer units); prefer `===` everywhere except the `x == null` guard; ESM's static shape + live bindings are what make tree shaking possible.

---

## 03. TypeScript

A structurally-typed superset of JavaScript that turns large codebases from "guess and check" into a refactorable, IDE-assisted system — and, at the deep end, a small functional language that computes over types.

**What's covered:**
- **Type System Basics** — Structural (duck) typing rather than nominal identity; inference with widening/narrowing; the `any`/`unknown`/`never` trio (top-unsafe, top-safe, bottom); literal narrowing with `as const`; validating without widening via `satisfies`.
- **Interfaces & Types** — `interface` vs `type` alias (declaration merging and `extends` vs unions/intersections), index signatures, call/construct signatures, and module augmentation for extending third-party types.
- **Generics** — Generic functions/classes/interfaces with call-site inference; constraints via `T extends`; `keyof` and indexed-access `T[K]`; variance (covariant outputs, contravariant inputs, invariant read-write, bivariant method-shorthand params under `strictFunctionTypes`, explicit `in`/`out` since 4.7); pattern-matching with `infer` (how `ReturnType`/`Awaited` are built); default type parameters.
- **Decorators** — TC39 Stage-3 decorators vs the legacy `experimentalDecorators`; class/method/accessor/field decorators; `reflect-metadata` and the DI patterns behind Angular and NestJS.
- **Advanced Types & Utility Types** — Conditional types (`T extends U ? X : Y`) as the type-level `if`; distribution over a naked union (and disabling it with the tuple-wrapped `[T] extends [U]`, needed because `never` is the empty union); template literal types with `Uppercase`/`Capitalize` and combinatorial union expansion; mapped types (`{ [K in keyof T]: ... }`, adding/removing `readonly` and `?` with `+`/`-`, `as` key remapping, homomorphism preserving modifiers); the full standard utility catalog (`Partial`/`Required`/`Readonly`/`Record`/`Pick`/`Omit`/`Exclude`/`Extract`/`NonNullable`/`Parameters`/`ReturnType`/`Awaited`/`NoInfer`); recursion capped ≈50 levels.

**Key mental models:** Types are compared structurally, not by name; prefer `unknown` over `any` and treat `never` as "impossible"; the advanced-type primitives form a language (conditional = branching, mapped = iteration, template literal = strings, `infer` = pattern match); let inference do the work and annotate only where it can't see the type.

---

## 04. Angular

Google's complete, opinionated, TypeScript-first framework — component model, hierarchical DI, router, reactive forms, and HTTP client all in the box — with modern standalone components and signal-based reactivity alongside the classic decorator patterns.

**What's covered:**
- **Components & Templates** — Lifecycle hooks, template syntax and structural directives, the new built-in control flow `@if`/`@for`/`@switch`, signal inputs, and standalone components (no NgModule).
- **DI & Services** — The hierarchical injector tree, `providedIn: 'root'` tree-shakeable providers, the `inject()` function, multi-providers, `InjectionToken`, and the provider types (`useClass`/`useValue`/`useFactory`/`useExisting`).
- **RxJS & Observables** — Lazy `Observable<T>` (nothing runs until subscribe); cold/unicast (fresh producer per subscriber, e.g. `HttpClient.get`) vs hot/multicast (shared, e.g. `Subject`, DOM events); multicasting with `share()`/`shareReplay({ bufferSize: 1, refCount: true })`; the four flattening operators — `switchMap` (cancel previous → typeahead), `mergeMap` (concurrent → parallel writes), `concatMap` (queue serial → ordered writes), `exhaustMap` (ignore new → prevent double-submit); `catchError`/`retry` with exponential backoff; Subject variants (`Subject`/`BehaviorSubject`/`ReplaySubject`/`AsyncSubject`); Signals interop via `toSignal()`/`toObservable()`; always unsubscribe (async pipe, `takeUntilDestroyed()`).
- **Reactive Forms** — `FormControl`/`FormGroup`/`FormArray`, strictly typed forms, sync and async validators, the `valueChanges`/`statusChanges` streams, and dynamically built form arrays.
- **Angular Router** — Route config with lazy loading, functional guards (`CanActivateFn`) and resolvers, nested/child routes, router events, and preloading strategies.
- **NgRx** — The Redux three principles (single read-only store, dispatch actions, pure `(state, action) => newState` reducers); `createAction`/`props` with `[Source] Event` naming; `createReducer`/`on`; memoized `createSelector`/`createFeatureSelector`; `createEffect` (the `Actions` stream, `ofType`, a flattening operator); `@ngrx/entity` for normalized `{ ids, entities }` collections; and the boilerplate-light `@ngrx/signals` `signalStore` (`withState`/`withComputed`/`withMethods`/`patchState`).

**Key mental models:** Angular is batteries-included and TS-first — lean on DI and the framework's own router/forms; choose the flattening operator deliberately or you get races and dropped saves; use Signals for synchronous template state and RxJS for async orchestration (bridge at the boundary); reducers must be pure; start feature state in `signalStore` and escalate to the global store only for cross-cutting, auditable state.

---

## 05. React

Meta's declarative, intentionally unopinionated UI library — the virtual DOM and Fiber reconciler, the hooks model, and React Server Components — with the ecosystem (routing, state, data) composed to fit the problem.

**What's covered:**
- **Fundamentals & JSX** — The React element model, JSX compiling to `jsx()`/`createElement` calls, the Fiber reconciler (render vs commit phases), the role of `key`s in list diffing, fragments, and StrictMode's intentional double-invocation in dev.
- **Hooks Deep Dive** — The two rules of hooks (top level only, React functions only) enforced because hooks are a positional linked list on `fiber.memoizedState` — call order is sacred; `useState` with functional updates (`setC(c => c + 1)`) and React 18 batching across promises/timeouts; `useReducer` for complex/interdependent transitions; `useEffect` runs after paint with cleanup-then-run ordering and a deps array, vs `useLayoutEffect` synchronously before paint; `useRef` as a mutable `{ current }` box that never triggers re-render; `useMemo` (a value) and `useCallback` (a function ≡ `useMemo(() => fn, deps)`) exist for referential identity, not raw speed — measure first; the concurrent hooks `useTransition`/`useDeferredValue`/`useSyncExternalStore`/`useId`.
- **Context & State** — Context re-render semantics and the split-context pattern, state co-location, external stores (Zustand, Jotai), and tear-free subscriptions via `useSyncExternalStore`.
- **React Query** — The stale-while-revalidate cache model; `useQuery`/`useMutation`/`useInfiniteQuery`; optimistic updates with rollback; and server-state dehydration/hydration for SSR.
- **Next.js & SSR** — App Router (`app/`, Server Components by default, `async` data fetching, persistent `layout.tsx`, `loading.tsx`) vs the Pages Router (`getStaticProps`/`getServerSideProps`); RSC ship zero JS while `'use client'` islands must receive serializable props; the four rendering strategies — SSG (build-time, CDN, fastest TTFB), SSR (`cache: 'no-store'`, always fresh), ISR (`revalidate: 60`), CSR; Suspense streaming (flush the shell first, then boundaries); Edge `middleware.ts` for auth gating with a `matcher`.
- **Performance** — The React Profiler and commit analysis, the real cost/benefit of `memo`/`useMemo`/`useCallback`, `useTransition` to keep input responsive, list virtualization, and tracking Web Vitals (LCP/CLS/INP).

**Key mental models:** React is a composable library, not a framework — you assemble the ecosystem; hooks are positional so never call them conditionally; memoization buys referential stability, so reach for it against an observed re-render, not pre-emptively; Server Components ship zero JS, so keep the `'use client'` boundary as low in the tree as possible; pick a rendering strategy by trading freshness against TTFB.

---

## 06. Flutter

Google's UI toolkit that compiles one Dart codebase to iOS, Android, web, and desktop — and, unlike React Native, owns its rendering engine (Impeller/Skia) to paint every pixel itself for pixel-perfect cross-platform parity and 120 fps animation.

**What's covered:**
- **Dart Essentials** — Sound null safety (`String` can never be null; `?` opts in; flow-promotion after `if (x != null)`; `?.`/`??`/`??=`/`!`/`late`); named, optional-positional, and `required` parameters (why widget trees read cleanly); constructor kinds — generative, named, canonicalized `const`, and `factory` (for caches/singletons/`fromJson`); mixins (`with`/`on`, rightmost-wins linearization); extension methods; `Future`/`async`/`await`; Dart's two-queue event loop (microtasks drain before events); `Stream` (`async*`/`yield`, single-subscription vs broadcast); isolates with their own heap and message passing (`Isolate.run`, Flutter's `compute`) so there are no data races.
- **Flutter Widgets** — The three synchronized trees: Widget (immutable config, rebuilt constantly), Element (mutable, long-lived, holds `State`), RenderObject (layout/paint/hit-test); `StatelessWidget` vs `StatefulWidget` and the `State` lifecycle (`initState`/`didChangeDependencies`/`didUpdateWidget`/`dispose`); the single-pass layout protocol "constraints go down, sizes go up, parent sets position" (O(n)) and the classic unbounded-constraints error; `Row`/`Column`/`Expanded`/`Stack`/`Positioned`; lazy Slivers in a `CustomScrollView`; `CustomPaint` (`paint`/`shouldRepaint`); and `Key`s (`ValueKey`/`GlobalKey`) to keep state attached to the right element.
- **State Management** — `setState` for ephemeral local state; `InheritedWidget` as the O(1) ancestor-lookup primitive under everything (`Theme.of`, `MediaQuery.of`); Provider (`ChangeNotifier` + `notifyListeners`, `context.watch` vs `read`, runtime `ProviderNotFoundException`); Riverpod 2.x (compile-safe, `BuildContext`-independent, `Notifier` + `NotifierProvider`, `FutureProvider` with built-in loading/error/caching, `ProviderScope`); BLoC/Cubit (events → states, `BlocBuilder`); plus a decision guide separating ephemeral UI state from shared app state.
- **Navigation & Routing** — Navigator 1.0 imperative stack (`push`/`pop`, awaiting a popped result) vs Navigator 2.0 declarative Router; GoRouter (path params `:id`, `context.go` replace vs `context.push`, centralized `redirect` auth guards, `errorBuilder`); deep linking (Android App Links + `assetlinks.json`, iOS Universal Links); `StatefulShellRoute.indexedStack` for persistent bottom-nav tabs; `Hero` shared-element transitions by `tag`; and `PopScope` (replacing `WillPopScope`, with the `context.mounted`-after-`await` rule).
- **Animations** — Implicit (`AnimatedContainer`/`AnimatedOpacity`/`TweenAnimationBuilder`, fire-and-forget to a target) vs explicit (an `AnimationController` you forward/reverse/repeat/stop); the pipeline Ticker (`vsync`) → controller 0.0→1.0 → `CurvedAnimation` easing → `Tween<T>` lerp `v = a + (b − a)·t`; `SingleTickerProviderStateMixin` and disposing controllers; staggered sequences via `Interval` sub-windows; designer-driven Lottie (After Effects JSON, play-once) vs Rive (interactive state machines, `SMIBool`/`SMITrigger`); GLSL fragment shaders AOT-compiled by Impeller (no runtime shader-compilation jank).
- **Platform & Deployment** — Build modes debug (JIT + hot reload) / profile (AOT + profiling, the only honest way to measure) / release (stripped AOT); flavors (`--flavor` + `-t` entrypoint) for dev/staging/prod side by side; Android AAB signing (`keytool` keystore, git-ignored `key.properties`, Play App Signing); iOS provisioning (distribution cert + profile → `.ipa` → TestFlight/App Store Connect); web renderers — legacy HTML (removed in 3.29+), CanvasKit (default, Skia-in-WASM, ≈+1.5 MB), and skwasm WASM (needs `COOP`/`COEP` cross-origin-isolation headers); `MethodChannel` for async native interop and `pigeon` for type-safe generated bindings; a CI/CD pipeline (analyze → test → build → signed upload) with secrets kept out of the repo.

**Key mental models:** Flutter renders everything itself (Impeller/Skia), so UI is pixel-identical across platforms; the Widget/Element/RenderObject trees explain rebuilds, keys, and performance; layout is one pass — constraints down, sizes up, parent positions; escalate state from `setState` → Provider/Riverpod/BLoC strictly by scope and complexity; always `dispose` controllers/subscriptions; and profile in `--profile` on a real device, never in debug.

---

## Cross-Cutting Mental Models

These principles recur across every section and are the ones worth internalizing beyond any single framework:

1. **Declarative UI + reconciliation** — You describe the target state (CSS declarations, JSX, Angular templates, the Flutter widget tree) and the platform diffs it against what's on screen (the cascade, React's Fiber reconciler, Angular change detection, Flutter's Element tree). Stop thinking in imperative DOM mutations and think in "what should the UI be for this state."

2. **Component composition with one-way data flow** — Build from small, reusable units; data flows down (props / `@Input` / widget config / selectors) and events flow up (callbacks / `@Output` / dispatched actions / BLoC events). Predictable state transitions — pure reducers in NgRx and Redux, immutable rebuilds in Flutter — are what make large apps debuggable.

3. **The single-threaded event loop is everywhere** — Browser JavaScript and Dart both run one thread with a microtask queue that drains ahead of the macro/event queue. Blocking it (a >50 ms long task, a heavy synchronous loop) freezes input, animation, and paint — so slice the work, yield, or offload to a Web Worker / Dart isolate.

4. **Types and specifications as guardrails** — TypeScript's structural types, Dart's sound null safety, and semantic HTML/ARIA all push failure to compile time (or to the accessibility tree) instead of production. Treat the type checker and the linter (`rules-of-hooks`, `exhaustive-deps`) as collaborators, not nags.

5. **Ship less, measure before optimizing** — Tree shaking, code splitting, Server Components (zero client JS), `const` widgets, and memoization all exist to reduce what reaches the device. But every optimization has a cost (memory, complexity, an extra round-trip), so profile first (React Profiler, Flutter `--profile`, the Long Tasks API) and optimize against observed Core Web Vitals, not hunches.
