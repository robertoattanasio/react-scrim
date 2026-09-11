# react-scrim

A covering layer for React whose state is data attributes, so every animation stays in your stylesheet.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Install

```sh
npm install react-scrim
```

## What you get

One component and one small utility. The component renders a fixed, full-viewport layer and writes its state onto that element — as data attributes, and as two numbers you already know. Nothing else: no easing, no router.

```tsx
import { Scrim, scrimLoader } from "react-scrim";

const appReady = scrimLoader(500, () => document.fonts.ready);

<Scrim until={appReady} isLoading={isEnteringSection} variant={section} durationTime={500} holdTime={1200}>
  <SplashContent />
</Scrim>
```

| Prop          | What it does                                                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `until`       | A function returning a promise. The scrim covers from the first paint and stays until it resolves. Keep the reference stable: it is called again whenever it changes.       |
| `isLoading`   | Keeps the scrim covering while `true`, for route changes or anything else you drive.                                                                                        |
| `isReady`     | Starts the scrim already uncovered: `until` is never called, so there is no splash at first paint.                                                                          |
| `variant`     | Any string, mirrored to `data-scrim-variant` so your CSS can style this scrim differently.                                                                                  |
| `durationTime`| Milliseconds. Written onto the layer as `--scrim-duration`, so your `transition-duration` can read it without you redeclaring the number in a second place.                |
| `holdTime`    | Milliseconds the layer keeps covering after it would otherwise stop, before the exit is allowed to start. Lives in JavaScript, not CSS — see [why](#durationtime-and-holdtime) below. |
| `onStatus`    | Called with one of `"ready" \| "loading" \| "idle" \| "covering" \| "uncovering"` at every transition the layer makes, from the first paint onward.                          |

Every other `div` prop is forwarded.

`onStatus` is every piece of state the attributes already carry, for anything that cannot reach the element through CSS — a log line, a piece of state mirrored with `useState`, or an external timeline (GSAP, say) driven from a single switch. It fires on mount with the status the layer starts at, so anything wired to it is correct from the first commit, not just from the next transition.

Two of the five values are worth being precise about, because they diverge: `"loading"`/`"idle"` mirror the `isLoading` prop directly, the instant it changes — before any `holdTime` has been honored. `"covering"`/`"uncovering"` mirror `data-scrim-open`, which is `holdTime`-aware: `"uncovering"` only fires once the hold has actually elapsed and the exit is starting for real. Something synchronized with the layer's own CSS transition — a page behind it animating in step, say — wants `"covering"`/`"uncovering"`; something that only cares about the loading process itself wants `"loading"`/`"idle"`.

The callback reports a start, never an end: `"uncovering"` fires the instant the exit is allowed to begin, not when it finishes. How long it then takes is `durationTime`, which you already have in hand as a prop — the library doesn't hand you a second event for "finished", because it would either be a guess (a timer racing the real transition) or a promise this library doesn't make about owning your CSS.

### `durationTime` and `holdTime`

Every other prop expresses state, not time — appearance is still entirely your stylesheet's job. These two exist because a consumer sometimes has to know a time *outside* the stylesheet too: a router `loader` that should resolve roughly when the transition does, or an app that would otherwise declare `650` once in CSS and again in JavaScript and hope the two never drift.

- `durationTime` flows one way, from prop to a `--scrim-duration` custom property on the layer. Your CSS reads it with `var(--scrim-duration, <fallback>)`; the library never reads it back.
- `holdTime` never touches CSS at all. It purely delays the moment the component itself decides it's done covering — the same delay applies whether that's because content became ready or a route finished loading, which a CSS `transition-delay` could never tell apart from a fresh, unrelated close.

## The attributes

| Attribute             | Present when                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `data-scrim`           | Always. Marks the layer.                                                                      |
| `data-scrim-open`      | The scrim is covering.                                                                        |
| `data-scrim-instant`   | The state must apply without animating.                                                       |
| `data-scrim-ready`     | The scrim is ready: `until` resolved, or `isReady` was passed. Latched: it never goes back.   |
| `data-scrim-variant`   | Mirrors the `variant` prop.                                                                    |

Your stylesheet decides what any of it looks like:

```css
[data-scrim] {
  transition-property: translate, visibility;
}

[data-scrim]:not([data-scrim-open]) {
  translate: 0 100%;
}
```

Notice there's no `transition-duration` here — the library already sets one (falling back to `300ms` if you never pass `durationTime`). Write it yourself only if you want a value the prop doesn't cover, e.g. a different duration per variant.

Keep `visibility` in `transition-property`. The layer is `visibility: hidden` unless `data-scrim-open` is present, so leaving it out hides the element the instant the scrim closes and the exit never plays.

## `scrimLoader`

The one utility the package ships besides `Scrim`. It builds a signal — a function returning a promise, the same shape `until` and a router `loader` both expect — that waits at least `ms` milliseconds, in parallel with whatever else you give it.

```tsx
import { scrimLoader } from "react-scrim";

const appReady = scrimLoader(500, () => document.fonts.ready);
const routeLoader = scrimLoader(500);
```

Both wait 500ms; the first also waits for fonts. Extra arguments are thunks — `() => promise`, not the promise itself — so nothing browser-only runs until the signal actually does, which keeps a config file that exports both of these safe to import on the server.

On the server (`typeof document === "undefined"`) it resolves immediately, so it's safe to hand straight to a route `loader` — the delay only ever runs client-side, where there's a transition to actually wait for.

## Built with

React 19 and TypeScript, nothing else: no dependencies, no runtime beyond React itself. Published as source, with a stylesheet of three rules and one small timing utility.

## Approach

- **Data attributes are the API, timing is the one exception.** Which properties animate, with what curve, and whether a variant slides or fades is still CSS you write. Only `durationTime` and `holdTime` move into props — because a router loader or anything else outside the stylesheet needs those two numbers without re-deriving them from a computed style.
- **Correct at first paint.** The scrim covers in the server-rendered HTML, so there is no flash before hydration.
- **The entrance belongs to the variant that enters.** Opening applies the incoming variant unanimated for one frame, then opens. Without it a transition would start from wherever the previous variant parked the element.
- **Transitions, not keyframes.** Everything stays interruptible: navigate mid-animation and it reverses instead of restarting.
- **One wait, reused.** A splash and a route loader both need to wait roughly as long as the transition takes. `scrimLoader` is the one place that number is written down.
- **One callback, not three.** `onStatus` is a strict superset of what separate `onReady`/`onLoading`/`onScreen` props used to say — splitting it back out would only buy a direct boolean, at the cost of a name to remember for each and a duplicate of information the single callback already carries.

Conventions for contributing: [RULE.md](./RULE.md).

## License

[MIT](./LICENSE).
