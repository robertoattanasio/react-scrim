# react-scrim

## 3.0.0-unstable.1
### Minor Changes

- `ScrimRegister` types `meta` once for the whole app through module augmentation, so `useScrim` and `ScrimProps` don't need a generic. It is optional, and an explicit generic still wins.

## 3.0.0-unstable.0

### Major Changes

- A scrim is now a provider around its subtree instead of a global store.

  - `createScrim`, `Root`, `useStatus` and `getStatus` are removed. Mount `<Scrim curtain={Curtain}>` and read it with `useScrim`.
  - `useScrimActions` returns only `cover` and `uncover`, and doesn't re-render when the phase changes.
  - `cover()` no longer stacks curtains: a `cover` during `leaving` sends the same curtain back.
  - `key` is removed. `hold`, `until` and `meta` are props of `Scrim`.
  - `useScrim` returns `first`, `true` while the initial curtain is on screen.
  - `until` receives an `AbortSignal`, and its errors go to `reportError`.
  - `cover` and `uncover` resolve when `Scrim` unmounts.
  - A `done()` left over from a previous phase is ignored.
  - The peer range is now React `^19.2.0`.

## 2.1.0

### Minor Changes

- 892e682: `useStatus` and `getStatus` return `ready`: `true` once the top curtain's `until` has resolved, before its `hold`, and when no curtain is on screen. A new curtain starts not ready.

## 2.0.0

### Major Changes

- A scrim is now a component instead of a config. See `MIGRATION.md`.

  - `createScrim(initial?, options?)` returns `Root`, `cover`, `uncover`, `useStatus` and `getStatus`.
  - A curtain is your own component. It receives `scrim.phase`, `scrim.meta` and `scrim.done`, and calls `done()` when its animation ends.
  - Every `cover()` puts a new curtain on top. Curtains already on screen never restart or reverse.
  - `hold`, `until` and `meta` are options of each curtain.
  - `nodes`, `node()`, `play`, `animation`, `useScrim` and `isReady` are removed.

### Minor Changes

- `cover` takes an optional `key`, and `useStatus` and `getStatus` return the `key` of the top curtain, so the app can tell which curtain is covering.

## 2.0.0-next.0

### Major Changes

- A scrim is now a component instead of a config. See `MIGRATION.md`.

  - `createScrim(initial?, options?)` returns `Root`, `cover`, `uncover`, `useStatus` and `getStatus`.
  - A curtain is your own component. It receives `scrim.phase`, `scrim.meta` and `scrim.done`, and calls `done()` when its animation ends.
  - Every `cover()` puts a new curtain on top. Curtains already on screen never restart or reverse.
  - `hold`, `until` and `meta` are options of each curtain.
  - `nodes`, `node()`, `play`, `animation`, `useScrim` and `isReady` are removed.

## 1.0.0

### Major Changes

- First stable release. The store API introduced in 0.4.0, `createScrim` and `useScrim`, is now stable: no breaking changes from 0.4.0.

### Patch Changes

- d4c9798: Ship compiled JavaScript with type declarations instead of the TypeScript source, so the package works with any bundler without extra configuration. A `transpilePackages` entry added for react-scrim can be removed.

  Widen the React peer range to `^19.0.0`: the package only uses APIs available since React 18.

## 0.4.0

Replace the `Scrim` component with a store. See `MIGRATION.md`.

### Breaking Changes

- `Scrim`, `scrimLoader` and the CSS are removed. `createScrim` declares the nodes, the `enter` and `leave` animations, `until` and `hold` in one place, and returns a store.
- `isLoading` is replaced by `cover()` and `uncover()`: a route loader awaits `cover()` and the router calls `uncover()` once resolved.
- `onStatus` is replaced by `useScrim`, which returns `status` (`idle`, `entering`, `covered`, `leaving`) and `isReady`.
- `durationTime` becomes `animation.duration`, `holdTime` becomes `hold`, and `isReady` becomes `initial: "idle"`.

### Minor Changes

- `enter` and `leave` receive `play`, a Web Animations helper with the store's defaults. Anything that can be awaited works in its place, so GSAP and Motion can drive the nodes.
- `status` reports when animations finish, not only when they start.
- A store goes back to its initial status when one of its nodes unmounts and nothing replaces it.

## 0.3.1

### Patch Changes

- Run the component's effects as layout effects (`useLayoutEffect` instead of `useEffect`), so the state they set is applied before the browser paints.

## 0.3.0

### Breaking Changes

- `onReady`, `onLoading` and `onScreen` are removed. `onStatus` replaces all three with one callback, called with `"ready" | "loading" | "idle" | "covering" | "uncovering"` at the same points the three used to fire — nothing any of them reported is gone, it just has one name to import instead of three. `onLoading`'s rising edge duplicated `onStatus("covering")`'s timing exactly, and its falling edge only echoed the `isLoading` prop the consumer had already set — keeping it meant a fourth name for information `onStatus` already carried.

### Minor Changes

- Add `durationTime` and `holdTime`, the one exception to "the stylesheet owns appearance." `durationTime` is written onto the layer as `--scrim-duration`, so `transition-duration` reads it without the number being declared twice; `holdTime` never touches CSS, it delays the moment the component itself decides it is done covering, the same way regardless of why the cover started.
- Add `scrimLoader`, a small utility exported alongside `Scrim`: `scrimLoader(ms, ...extra)` builds a signal — the same shape `until` and a router `loader` both expect — that waits at least `ms`, in parallel with whatever else it's given. Resolves immediately on the server, so it's safe to hand straight to a route `loader`.

### Patches

- Fix the two-frame park (the incoming variant applied unanimated before it opens) leaking a stale update across an interrupted navigation: both `requestAnimationFrame` ids are now tracked and canceled, not just the outer one.
- Fix the `until` effect calling back twice under React's development double-invoke: a cancellation guard now ignores a stale resolution instead of firing `onReady`/`onStatus("ready")` a second time.
- Fix `holdTime` only ever applying to one of the two reasons a layer can stop covering. Covering state is now driven by a single piece of state (`isOnScreen`) that the hold delay watches directly, instead of `_isLoading`'s own transition — so an interruption mid-hold no longer snaps the layer instantly to the new variant.

## 0.2.0

### Breaking Changes

- `open` is now `isLoading`. Props that carry state in are `is<State>`, callbacks that report it out are `on<State>`, so the pair reads the same way from either side. Rename `open` at the call site; no attribute moved.
- The React peer range is now `^19.2.0`, the first version with `useEffectEvent`, which the component has always required.

### Minor Changes

- Add `onReady` and `onLoading`, so state the scrim already writes to the element can also be read by code that cannot reach it through CSS. The component keeps its two pieces of state; the callbacks only report the transitions it was already making, and report starts, never ends: no duration enters the library.
- Add `onScreen`, called with `true` when the layer starts covering and `false` when it starts uncovering. It is `data-scrim-open` reported as a callback, so a consumer no longer has to rebuild that condition from `onReady` and `onLoading` to know whether the scrim is on screen. Like the other callbacks it reports a start, never an end: no duration enters the library.
- Add `isReady`, the input side of `onReady`. It seeds the latch, so a scrim rendered with `isReady` never calls `until` and is uncovered from the first paint: the same component, on a visit that has already had its splash. `until` and `isReady` are the two ways to answer the same question, and the component asks only one of them.
