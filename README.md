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
