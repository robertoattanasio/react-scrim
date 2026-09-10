# react-scrim

A covering layer for React. A provider owns the open/close lifecycle and its timing, a hook reports it, and every animation stays in your stylesheet.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Install

```sh
npm install react-scrim
```

## Use

```tsx
import { ReactScrimProvider, Scrim, useReactScrim } from "react-scrim";

const appReady = () => Promise.all([document.fonts.ready, wait(650)]);

<ReactScrimProvider until={appReady} duration={600} hold={1200}>
  <App />
  <Scrim>
    <SplashContent />
  </Scrim>
</ReactScrimProvider>;
```

`<ReactScrimProvider>` holds the state. With `until` it starts open, shows the content when that promise resolves, closes on its own after `hold`, and from then on is driven by `open()` / `close()` from the hook. `<Scrim>` renders the current phase onto a fixed, full-viewport `div` — place it where the node should live, put the splash inside it. Anything under the provider can call `useReactScrim()`.

### `<ReactScrimProvider>`

| Prop       | What it does                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `until`    | `() => Promise`. The scrim starts open; when it resolves the content is shown, then the scrim closes on its own. Omit to start closed.   |
| `duration` | ms. How long each phase animation runs — `opening`, `holding`, `closing`. Mirrored to `--scrim-duration`.                                |
| `hold`     | ms. After `until` resolves, the phase stays `open` for this long — content shown, scrim covering — before it starts closing. Can be `0`. |

### `useReactScrim()`

| Field                                                   | What it is                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `phase`                                                 | `"closed" \| "opening" \| "open" \| "holding" \| "closing"`.                               |
| `isOpening` `isOpen` `isHolding` `isClosing` `isClosed` | The phase, as booleans.                                                                    |
| `isReady`                                               | `until` resolved (or none given). Latched. While `false`, `open()` / `close()` do nothing. |
| `duration` `hold`                                       | The provider's props, echoed.                                                              |
| `open()` `close()`                                      | Drive the scrim.                                                                           |

```tsx
const { open, close } = useReactScrim();
const isNavigating = useRouterState({ select: (s) => s.isLoading });

useEffect(() => {
  isNavigating ? open() : close();
}, [isNavigating, open, close]);
```

## The phase

```
closed → opening → open → holding → closing → closed
         duration   hold   duration  duration
```

After `until` resolves the phase sits at `open` for `hold` ms (content shown, scrim covering), then `close()` runs on its own: `holding` (splash content animates out, scrim still covering), then `closing` (the layer moves). `open()` / `close()` from the hook drive the same phases for route changes. `data-scrim-open` is present through `holding` and drops at `closing`, so the layer and anything keyed to `isClosing` move together.

## The attributes

`<Scrim>` writes its state onto the layer, plus `--scrim-duration`.

| Attribute            | Present when                                                    |
| -------------------- | --------------------------------------------------------------- |
| `data-scrim`         | Always.                                                         |
| `data-scrim-phase`   | The phase string.                                               |
| `data-scrim-open`    | Phase is `opening`, `open` or `holding` — the covered position. |
| `data-scrim-instant` | Apply the covered state without animating (first paint).        |
| `data-scrim-ready`   | `until` resolved. Latched.                                      |

Your stylesheet does the rest:

```css
[data-scrim] {
  translate: -100% 0;
  transition: translate var(--scrim-duration) cubic-bezier(0.65, 0, 0.35, 1);
}

[data-scrim][data-scrim-open] {
  translate: 0;
}
```

The layer holds its covered position through `holding` and only moves at `closing`, so the stylesheet needs no `transition-delay`. The library stylesheet is three rules: the layer covers the viewport, it is visible unless the phase is `closed`, and it applies instantly while `data-scrim-instant`.

## Approach

- **The provider owns the lifecycle.** When the scrim opens, how long it holds, and what waits for it lives in one place. Consumers read the phase; they don't rebuild a state machine.
- **Timing is a prop.** `duration` and `hold` are passed once and used for the phase timers. Nothing reads a time back out of a stylesheet.
- **Appearance is CSS.** The library owns state, never looks.
- **Correct at first paint.** With `until`, the scrim covers in the server-rendered HTML.
- **Transitions, not keyframes.** Interrupt mid-animation and it reverses.

Conventions: [RULE.md](./RULE.md). License: [MIT](./LICENSE).
