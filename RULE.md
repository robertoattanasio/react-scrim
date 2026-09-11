# Conventions

How react-scrim is written. The library is one component, one timing utility, and three CSS rules, and these are the rules that keep it that way.

## The approach

**Data attributes are the API.** The component owns state and writes it to the element. It never owns appearance. Which properties animate, for how long, with what curve, and whether a variant slides or fades is CSS the consumer writes. A feature that can be expressed as an attribute the stylesheet reacts to is not a prop.

**Nothing about routing enters the library.** No loader type, no route options, no promise handed to a router by name. `scrimLoader` returns a plain signal — a function returning a promise, the exact shape `until` already expects — and it is the same function whether a consumer passes it as `until` or as a router's `loader`. The library never imports a router, and never knows which of the two it was used as.

**Two numbers live in JavaScript, deliberately.** `durationTime` and `holdTime` are the one exception to "the stylesheet owns appearance," because a consumer sometimes has to know a time *outside* the stylesheet it doesn't control the cascade of — a router loader that should resolve roughly when the transition does. The library still never reads a computed style or parses a CSS value back out: `durationTime` flows one way, from prop to a `--scrim-duration` custom property; `holdTime` never touches CSS at all — it only delays the moment the component sets its own covering state to `false`.

**Correct at first paint.** The scrim covers in the server-rendered HTML. State that only exists after hydration cannot express itself in the served markup, which is how a flash of content gets in.

**Transitions, not keyframes.** Keyframes would let each variant declare its own start, but they restart instead of reversing when a transition is interrupted mid-flight. Reversibility wins.

**One callback out, not several.** `onStatus` reports every transition the component makes with a name attached. A separate `onReady`/`onLoading`/`onScreen` used to exist alongside it, but each said nothing `onStatus` didn't already — `onLoading`'s rising edge duplicated `onStatus("covering")`'s timing exactly, and its falling edge only echoed the `isLoading` prop the consumer had set themselves. Keeping them would have meant three names to learn for one feed.

## Files

Flat under `src/`, in `snake_case`:

```
components/
  scrim.tsx     the component
  scrim.css     the mechanism, nothing else
  type.ts       its props and status
utils/
  scrim_loader.ts   the one timing utility
index.ts        the only barrel
```

## Naming

| what       | convention            | example                |
| ---------- | ---------------------- | ----------------------- |
| file       | `snake_case`           | `utils/scrim_loader.ts` |
| component  | `PascalCase`           | `Scrim`                 |
| utility    | `scrim<Noun>`          | `scrimLoader`           |
| props type | `<Component>Props`     | `ScrimProps`            |
| status     | `<state>` string union | `"covering"`            |
| attribute  | `data-scrim-<state>`   | `data-scrim-ready`      |
| prop in    | `is<State>`             | `isLoading`             |
| prop out   | `on<Noun>`              | `onStatus`              |
| state      | `_is<State>`            | `_isLoading`            |

Attributes are named for the state they describe, never for what the consumer should do about it. `data-scrim-instant` says "apply this without animating", not "skip the fade".

## The stylesheet

`scrim.css` carries only what makes a scrim a scrim: it covers the viewport, it is shown when open, its transition reads its duration from `--scrim-duration` (falling back to `300ms` when nothing set it), and it applies instantly when told to. Everything else is the consumer's.

The instant reset is `transition: none`, not a zeroed duration. A consumer rule like `[data-scrim-variant="x"]:not([data-scrim-open])` has the same specificity and comes later in the cascade, so it would win on a numeric `transition-duration` and the state would apply late. Zeroing `transition-property` cannot be overridden that way.

## State

The component holds three pieces of state.

`_isReady` latches when `until` resolves — or immediately, if `isReady` was passed — and never goes back, so `data-scrim-ready` is safe to style against for anything that must stay revealed. The effect that sets it guards a stale resolution with a `cancelled` flag: `until` is arbitrary consumer code, and React re-runs this effect once on mount in development, so without the guard a slow `until` can call back twice.

`_isLoading` is the armed flag for the *incoming* variant, and it exists for one reason: opening applies the incoming variant unanimated for one frame, then opens. Without it a transition starts from wherever the previous variant parked the element, and a variant that fades leaves nothing for a variant that slides to animate from. That frame is two `requestAnimationFrame` calls, and both ids are tracked so both are cancelable — a variant switching mid-arm has to cancel the second, nested call as well as the first, or a stale update lands after a newer navigation already started arming its own.

`_isCovering` is what actually drives `data-scrim-open`. It mirrors `isOnScreen` — the pure, instant combination of `_isReady` and `_isLoading` — immediately on the rising edge, because covering is never worth delaying. On the falling edge it waits `holdTime` before following, and that wait is canceled if `isOnScreen` turns true again before it fires. This is what lets `holdTime` be one concept regardless of *why* the layer stopped needing to cover — content becoming ready, or a route finishing — instead of a CSS delay that could only ever see one of those paths and not the other.

No imperative DOM writes. The component renders attributes, and one inline custom property (`--scrim-duration`, when `durationTime` is passed) the same declarative way as everything else; it never calls `element.style.setProperty` or reaches for the element outside of React's own render.

## Comments

None in the code. The reasoning lives here and in the documentation site.

## Breaking changes

The attribute names are the public surface, more than the props are: consumers style against them. Renaming one, or changing when it appears, is a major even though the TypeScript signature did not move. The same is true of what a prop writes into CSS: renaming `--scrim-duration`, or changing what `holdTime` delays, is a major for the same reason.
