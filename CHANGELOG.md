# react-scrim

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
