# react-scrim

## 0.3.0

### Breaking Changes

- The component is now a provider and a hook. `<Scrim>` no longer owns state or takes drivers: wrap the tree in `<ReactScrimProvider>`, which owns the open/close lifecycle, and read it anywhere with `useReactScrim()`. `<Scrim>` is the layer that renders the current phase to the DOM.
- The `isLoading` / `isReady` props and the `on*` callbacks are gone. `until`, `duration` and `hold` are props on `<ReactScrimProvider>`; everything else drives the scrim through `open()` / `close()` from the hook. While `until` is pending, `open()` / `close()` are ignored.
- The library now holds timing. `duration` is the per-phase animation length (mirrored to `--scrim-duration`); `hold` is how long the phase stays `open` after `until` resolves before closing on its own. `holding` is a phase — splash content animates out there while the scrim still covers, then `closing` moves the layer. No `--scrim-delay`, no time read back out of CSS.
- The phase is `closed | opening | open | holding | closing`, on `data-scrim-phase`. `data-scrim-open` is present for `opening`, `open` and `holding`. The layer is visible unless the phase is `closed`.

### Minor Changes

- `useReactScrim()` reports `phase`, the flags `isOpening` / `isOpen` / `isHolding` / `isClosing` / `isClosed` / `isReady`, and echoes `duration` / `hold`. Any component under the provider follows the scrim without a timer of its own.

## 0.2.0

### Breaking Changes

- `open` is now `isLoading`. Props that carry state in are `is<State>`, callbacks that report it out are `on<State>`, so the pair reads the same way from either side. Rename `open` at the call site; no attribute moved.
- The React peer range is now `^19.2.0`, the first version with `useEffectEvent`, which the component has always required.

### Minor Changes

- Add `onReady` and `onLoading`, so state the scrim already writes to the element can also be read by code that cannot reach it through CSS. The component keeps its two pieces of state; the callbacks only report the transitions it was already making, and report starts, never ends: no duration enters the library.
- Add `onScreen`, called with `true` when the layer starts covering and `false` when it starts uncovering. It is `data-scrim-open` reported as a callback, so a consumer no longer has to rebuild that condition from `onReady` and `onLoading` to know whether the scrim is on screen. Like the other callbacks it reports a start, never an end: no duration enters the library.
- Add `isReady`, the input side of `onReady`. It seeds the latch, so a scrim rendered with `isReady` never calls `until` and is uncovered from the first paint: the same component, on a visit that has already had its splash. `until` and `isReady` are the two ways to answer the same question, and the component asks only one of them.
