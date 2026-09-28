# react-scrim

A scrim store for React. Declare the nodes and how they animate once, then cover and uncover from anywhere, route loaders included.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Install

```sh
npm install react-scrim
```

## Usage

```ts
import { createScrim } from "react-scrim";

export const scrimRouteConfig = createScrim({
  nodes: ["curtain"],
  animation: { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
  hold: 1000,
  until: () => document.fonts.ready,
  enter: ({ curtain }, { status, play }) =>
    play(
      curtain,
      status === "idle"
        ? [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }]
        : [{ transform: "translateY(0)" }],
    ),
  leave: ({ curtain }, { play }) => play(curtain, [{ transform: "translateY(-100%)" }]),
});
```

```tsx
<div ref={scrimRouteConfig.node("curtain")} className="fixed inset-0" />
```

```ts
export const Route = createFileRoute("/about")({
  loader: () => scrimRouteConfig.cover(),
});
```

```ts
router.subscribe("onResolved", () => scrimRouteConfig.uncover());
```

```tsx
import { useScrim } from "react-scrim";

const { status, isReady } = useScrim(scrimRouteConfig);
```

## Timing

The store has no idea how long anything takes. `cover` and `uncover` don't carry a duration — they call `enter`/`leave` and wait for whatever those return, which in practice is `play`'s return value: the same `Animation.finished` promise the browser resolves once the animation actually on screen has actually finished. There's nowhere else the time is written down, so there's nothing to keep in sync — no CSS duration to match against a JS timer, no `transitionend` that fires twice for two properties or not at all when an animation is replaced mid-flight.

`leave` can compose more than one `play` call — a curtain and a page, each with its own delay, duration and easing — and `uncover` still just awaits the result. It doesn't know either duration; it waits for whichever finishes last. The choreography is a consequence of what's composed, not a number anyone maintains.

`hold` is the one exception: a fixed pause the store keeps for itself, deliberately, between being ready and starting to leave.

Why this also means an interrupted navigation just works: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim#section-the-problem) for the idea, [/react-scrim/create-scrim#section-interruptions](https://dev.robertoattanasio.com/react-scrim/create-scrim#section-interruptions) for how.

## Options

| option      | what it does                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------- |
| `nodes`     | the names of the nodes the store animates                                                     |
| `initial`   | `"covered"` (default) starts covering, for a splash. `"idle"` starts uncovered                |
| `animation` | default options for every `play` call                                                         |
| `hold`      | milliseconds to stay covered before leaving                                                   |
| `until`     | what to wait for before the first leave                                                       |
| `enter`     | the enter animation. `status` is `"idle"` when starting from rest, `"leaving"` when reversing |
| `leave`     | the leave animation                                                                           |

`enter`, `leave` and `until` can return anything that can be awaited, so GSAP and Motion work in place of `play`.

## Store

| method         | what it does                                       |
| -------------- | -------------------------------------------------- |
| `node(name)`   | a ref that registers a node                        |
| `cover()`      | runs `enter`. Resolves once covered                |
| `uncover()`    | waits for `until` and `hold`, then runs `leave`    |
| `subscribe`    | listens to every change                            |
| `getStatus()`  | `"idle"`, `"entering"`, `"covered"` or `"leaving"` |
| `getIsReady()` | `true` once `until` has resolved                   |

## License

MIT
