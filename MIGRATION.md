# Migrating to react-scrim 2.0

In 1.x a scrim was a config: named nodes plus `enter` and `leave` animations. In 2.0 a scrim is a component. It animates itself and calls `done()` when it has finished.

## The config becomes a curtain

Move the markup of the nodes and the keyframes of `enter` and `leave` into one component:

```tsx
// 1.x
export const scrimRouteConfig = createScrim({
  nodes: ["curtain"],
  animation: { duration: 650 },
  enter: ({ curtain }, { play }) => play(curtain, [{ transform: "translateX(0)" }]),
  leave: ({ curtain }, { play }) => play(curtain, [{ transform: "translateX(100%)" }]),
});

<div ref={scrimRouteConfig.node("curtain")} className="fixed inset-0" />;

// 2.0
const Curtain = ({ scrim }: ScrimProps) => (
  <motion.div
    className="fixed inset-0"
    initial={{ x: "-100%" }}
    animate={{ x: scrim.phase === "leaving" ? "100%" : "0%" }}
    transition={{ duration: 0.65 }}
    onAnimationComplete={() => scrim.done()}
  />
);
```

`nodes`, `node(name)`, `play` and `animation` are gone. Any animation works, as long as it calls `done()`.

The `status === "idle"` branch in `enter` is gone too: a curtain always starts from the beginning, and a new `cover()` puts a new curtain on top instead of reversing the current one.

## Create the scrim and mount its Root

```tsx
// 1.x
createScrim({ initial: "covered", hold: 650, until, ... });
createScrim({ initial: "idle", ... });

// 2.0
createScrim(Curtain, { hold: 650, until });
createScrim();
```

Wrap the app in its `Root`. The curtains render inside it:

```tsx
<AppScrim.Root>
  <App />
</AppScrim.Root>
```

Delete the component that rendered the nodes.

## cover takes the curtain

```ts
// 1.x
scrimRouteConfig.cover();

// 2.0
AppScrim.cover(Curtain, { hold: 650 });
```

`hold` and `until` are now options of each curtain. `uncover()` doesn't change.

## useScrim becomes useStatus

```ts
// 1.x
const { status, isReady } = useScrim(scrimRouteConfig);
scrimRouteConfig.getStatus();

// 2.0
const { status, meta } = AppScrim.useStatus();
AppScrim.getStatus()?.status;
```

The statuses keep their names. `isReady` is gone: the first curtain only leaves once `until` has resolved.

## Page nodes become status reads

A page that was a node animated in `leave` now animates itself from the status:

```tsx
const { status } = AppScrim.useStatus();

<motion.main animate={status === "covered" ? "hidden" : "visible"} />;
```

To keep its timing in step with the curtain, pass it through `meta`.
