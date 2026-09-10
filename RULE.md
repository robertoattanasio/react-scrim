# Conventions

How react-scrim is written. A provider, a hook, a layer component, and three CSS rules.

## The approach

**The provider owns the lifecycle.** `ReactScrimProvider` holds the phase and the timers between phases. `<Scrim>` renders that phase and holds no state. A consumer drives the scrim with `open()` / `close()` and reads it with `useReactScrim()` — never a timer of its own.

**Timing is a prop, in one place.** `duration` and `delay` are props on the provider, mirrored onto the layer as `--scrim-duration` / `--scrim-delay` for the stylesheet and used for the phase timers. The library never reads a time back out of CSS.

**Appearance is CSS.** The component writes state to the element as attributes and never owns appearance.

**Nothing about routing enters the library.** `until` answers one question — is the app ready for its first reveal. Everything after is `open()` / `close()` called by the app.

**Correct at first paint.** With `until`, the scrim covers in the server-rendered HTML.

**Transitions, not keyframes.** They reverse instead of restarting when interrupted.

## Files

Flat under `src/`, `snake_case`:

```
components/
  provider.tsx    ReactScrimProvider: the state machine
  scrim.tsx       the layer, renders the phase
  use_scrim.ts    useReactScrim
  context.ts      the context object
  scrim.css       the mechanism, nothing else
  type.ts         the public types
index.ts          the only barrel
```

## Naming

| what       | convention          | example                       |
| ---------- | ------------------- | ----------------------------- |
| file       | `snake_case`        | `components/provider.tsx`     |
| component  | `PascalCase`        | `Scrim`, `ReactScrimProvider` |
| hook       | `use<Name>`         | `useReactScrim`               |
| props type | `<Component>Props`  | `ScrimProps`                  |
| attribute  | `data-scrim-<name>` | `data-scrim-open`             |
| phase      | one lowercase word  | `opening`                     |
| flag out   | `is<Phase>`         | `isClosing`                   |

## The phase

`closed → opening → open → holding → closing → closed`. `opening`, `holding` and `closing` each run for `duration`; `open` and `closed` are rest states.

`open()` goes to `opening`, then `open`. `close()` goes to `holding` (splash content animates out here, scrim still covering), then `closing` (the layer moves), then `closed`. After `until` resolves the provider stays at `open` for `hold` ms, then calls `close()` itself. `data-scrim-open` stays through `holding` and drops at `closing`, so the layer and anything else keyed to `isClosing` start together.

The hook exposes `phase`, the five phase flags (`isOpening`, `isOpen`, `isHolding`, `isClosing`, `isClosed`), and `isReady`. Nothing else: a consumer that wants "the scrim is in front" writes `isOpening || isOpen || isHolding`.

`isReady` latches when `until` resolves and never goes back. Until it latches, `open()` and `close()` do nothing — the initial reveal is a phase the provider owns end to end, so a caller wiring navigation never has to know the splash is still up.

## The stylesheet

`scrim.css` carries only what makes a scrim a scrim: it covers the viewport, it is visible unless the phase is `closed`, and it applies instantly while `data-scrim-instant`. Everything else is the consumer's.

The instant reset is `transition: none`, not zeroed duration and delay. A consumer rule like `[data-scrim-phase="opening"]:not([data-scrim-open])` has the same specificity and comes later in the cascade, so it would win on `transition-delay`. Zeroing `transition-property` can't be overridden that way.

## No imperative DOM

The provider holds state; `<Scrim>` renders it. Neither touches `document.documentElement` or the element's style directly.

## Comments

None in the code. The reasoning lives here and on the documentation site.

## Breaking changes

The attribute names and the hook's fields are the public surface, more than the props are. Renaming one, or changing when a phase or attribute appears, is a major.
