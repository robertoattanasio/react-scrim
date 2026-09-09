# react-scrim

## 0.2.0

### Breaking Changes

- `open` is now `isLoading`. Props that carry state in are `is<State>`, callbacks that report it out are `on<State>`, so the pair reads the same way from either side. Rename `open` at the call site; no attribute moved.
- The React peer range is now `^19.2.0`, the first version with `useEffectEvent`, which the component has always required.

### Minor Changes

- Add `onReady` and `onLoading`, so state the scrim already writes to the element can also be read by code that cannot reach it through CSS. The component keeps its two pieces of state; the callbacks only report the transitions it was already making, and report starts, never ends: no duration enters the library.
- Add `onScreen`, called with `true` when the layer starts covering and `false` when it starts uncovering. It is `data-scrim-open` reported as a callback, so a consumer no longer has to rebuild that condition from `onReady` and `onLoading` to know whether the scrim is on screen. Like the other callbacks it reports a start, never an end: no duration enters the library.
- Add `isReady`, the input side of `onReady`. It seeds the latch, so a scrim rendered with `isReady` never calls `until` and is uncovered from the first paint: the same component, on a visit that has already had its splash. `until` and `isReady` are the two ways to answer the same question, and the component asks only one of them.
