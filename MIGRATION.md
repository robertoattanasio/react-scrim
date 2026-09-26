# Migrating to react-scrim 0.4.0

Instructions for updating a project from react-scrim 0.3.x to 0.4.0. Each section says what changed, what to search for in the project, and what to replace it with.

0.4.0 replaces the `Scrim` component with a store. The animation moves from the stylesheet to one config file, and the router drives the store directly.

## `Scrim` and `scrimLoader` are removed

Search for `from "react-scrim"`. The only exports are now `createScrim`, `useScrim` and their types.

## One config file

Create one file, for example `src/config/scrim.config.ts`, and declare one store per scrim with `createScrim`. Name the node constants and the stores after what they are:

```ts
import { createScrim } from "react-scrim";

export const SCRIM_NODE_CURTAIN = "curtain";

export const scrimRouteConfig = createScrim({
  nodes: [SCRIM_NODE_CURTAIN],
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

## The layer becomes a node

Replace each `<Scrim …>` with its own component, named `Scrim<Name>` (for example `ScrimRoute`), that renders the layer as a plain element and registers it:

```tsx
// before
<Scrim until={appReady} isLoading={isLoading} variant={section} durationTime={650} holdTime={1000}>
  <SplashContent />
</Scrim>

// after
<div ref={scrimRouteConfig.node(SCRIM_NODE_CURTAIN)} aria-hidden className="fixed inset-0 z-9999">
  <SplashContent />
</div>
```

The element renders covering by default. Give it the covering look directly in its classes, because that is what the server sends.

## The CSS becomes keyframes

Search the stylesheets for `[data-scrim]`, `data-scrim-open`, `data-scrim-instant`, `data-scrim-ready`, `data-scrim-variant` and `--scrim-duration`. Move each transition into `enter` and `leave` as keyframes, then delete those rules:

| 0.3 CSS                                            | 0.4 config                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| the style of `[data-scrim]:not([data-scrim-open])` | the first keyframe of `enter` when `status === "idle"`, and the keyframe of `leave` |
| the style of `[data-scrim][data-scrim-open]`       | the last keyframe of `enter`                                                        |
| `transition-duration`, `--scrim-duration`          | `animation.duration`                                                                |
| `transition-timing-function`                       | `animation.easing`                                                                  |
| `[data-scrim-instant]`                             | nothing, the store handles the first paint                                          |

If the layer used different styles per `data-scrim-variant`, read the variant in `enter` and `leave`, or declare one store per variant.

## Props become options

| 0.3 prop                              | 0.4                                                             |
| ------------------------------------- | --------------------------------------------------------------- |
| `until={scrimLoader(ms, ...signals)}` | `until: () => Promise.all(signals)`, and `ms` moves into `hold` |
| `isReady`                             | `initial: "idle"`                                               |
| `holdTime`                            | `hold`                                                          |
| `durationTime`                        | `animation.duration`                                            |
| `isLoading`                           | `cover()` and `uncover()`, see below                            |
| `variant`                             | see above                                                       |
| `onStatus`                            | `useScrim`, see below                                           |

## Routes drive the store

Search for `loader: scrimRouteLoader` and for any `scrimLoader(…)` used as a route `loader`. Replace them with `cover`, which resolves once the scrim has covered:

```ts
export const Route = createFileRoute("/about")({
  loader: () => scrimRouteConfig.cover(),
});
```

Then uncover when the router has resolved, where the router is created:

```ts
if (typeof window !== "undefined") router.subscribe("onResolved", () => scrimRouteConfig.uncover());
```

Delete the router selector that computed `isLoading` for the scrim.

For anything that is not a route, such as a global operation, call `cover()` before it and `uncover()` after it.

## `onStatus` becomes `useScrim`

Search for `onStatus`. Read the state with the hook instead:

```tsx
const { status, isReady } = useScrim(scrimRouteConfig);
```

| 0.3 `onStatus`         | 0.4                            |
| ---------------------- | ------------------------------ |
| `"ready"`              | `isReady` is `true`            |
| `"covering"`           | `status === "entering"`        |
| `"uncovering"`         | `status === "leaving"`         |
| `"loading"` / `"idle"` | the router's own loading state |

`status` also reports the ends: `"covered"` once `enter` has finished and `"idle"` once `leave` has finished. Delete any timer, token or duration that rebuilt those ends by hand.

## Page animations join the config

If a page animated in after the scrim, for example with Motion keyed on a scrim status, register its root as a node and animate it in `leave`:

```ts
leave: ({ curtain, page }, { play }) =>
  Promise.all([
    play(curtain, [{ transform: "translateY(-100%)" }]),
    play(page, [{ opacity: 0 }, { opacity: 1 }], { delay: 500 }),
  ]),
```

```tsx
<main ref={scrimRouteConfig.node(SCRIM_NODE_PAGE)}>
```

Motion or GSAP can stay: `enter` and `leave` accept anything that can be awaited.
