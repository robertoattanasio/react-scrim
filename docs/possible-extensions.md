# Possible extensions

react-scrim is React-only, published as such, and stays that way. This is not a roadmap.

It's notes from a spike: three throwaway apps (Vue, Svelte, Angular), each with a router and the same curtain+page animation as this site's own `/react-scrim/examples/route-transitions`, wired by hand outside this package. The point was to check whether `createScrim` actually travels, not to plan a release. If this direction is ever picked back up, start here instead of re-deriving it.

## Why the core travels

`scrim/scrim.ts` never imports React. Its only outward surface is DOM elements and the Web Animations API. `node(name)` returns `(element) => cleanup`, which is a plain convention, not a React API — any framework can call it from its own mount/unmount hook.

`useScrim` is the only React-specific piece, and it's six lines around `useSyncExternalStore`. An equivalent for another framework is the same size.

## Binding a node

Each framework has its own way of getting an element reference and cleaning it up. All of them reduce to calling `scrim.node(name)(element)` on mount and the function it returns on unmount.

**Vue** — a function ref. Its type is wider than `HTMLElement | null` (it also allows `ComponentPublicInstance`), so guard it:

```ts
const bindNode = (name: string) => {
  let cleanup: (() => void) | undefined;
  return (el: unknown) => {
    cleanup?.();
    cleanup = el instanceof HTMLElement ? scrim.node(name)(el) : undefined;
  };
};
```

```html
<div :ref="bindNode('curtain')" />
```

**Svelte** — an action. It receives the element directly and returns `{ destroy }`:

```ts
function bindNode(el: HTMLElement, name: string) {
  const cleanup = scrim.node(name)(el);
  return { destroy: () => cleanup?.() };
}
```

```html
<div use:bindNode={"curtain"} />
```

**Angular** — `@ViewChild` plus the two lifecycle hooks:

```ts
@ViewChild("curtain") private curtainRef!: ElementRef<HTMLElement>;
private cleanupCurtain?: () => void;

ngAfterViewInit() {
  this.cleanupCurtain = scrim.node("curtain")(this.curtainRef.nativeElement);
}

ngOnDestroy() {
  this.cleanupCurtain?.();
}
```

One Angular-specific trap: if the store subscription reads a constructor-injected property (e.g. `this.router`), it can't be a class field initializer. Field initializers run before TypeScript's parameter-property assignment, so `this.router` is still `undefined` at that point. Subscribe inside the constructor body instead.

## Covering and uncovering on navigation

Each router has exactly one hook that it actually awaits before it loads the next route, and that's the one `cover()` belongs in. The others only notify after the fact — good enough for `uncover()`, wrong for `cover()`.

**Vue Router** — a guard's return value is awaited if it's a promise:

```ts
router.beforeEach((_to, from) => {
  if (from.matched.length === 0) return;
  return scrim.cover();
});

router.afterEach(() => scrim.uncover());
```

**Angular Router** — a route resolver is awaited before the route activates; `Router.events` reports after:

```ts
export const scrimResolver: ResolveFn<boolean> = async () => {
  if (hasNavigatedOnce) await scrim.cover();
  hasNavigatedOnce = true;
  return true;
};
```

```ts
this.router.events
  .pipe(filter((event) => event instanceof NavigationEnd))
  .subscribe(() => scrim.uncover());
```

**Svelte, with `svelte-spa-router`** — its `onRouteLoading` callback is *not* awaited; the route loads whether or not the promise it returns has settled. What the router does await is a route's `conditions`, passed through `wrap()`:

```ts
import wrap from "svelte-spa-router/wrap";

const coverCondition = async () => {
  if (hasNavigatedOnce) await scrim.cover();
  hasNavigatedOnce = true;
  return true;
};

const routes = {
  "/": wrap({ component: Home, conditions: [coverCondition] }),
};
```

```html
<Router {routes} onRouteLoaded={() => scrim.uncover()} />
```

In all three, skip `cover()` on the very first navigation (there's no previous route to hide behind a curtain yet, and the curtain's node may not even be mounted when that first navigation starts).

## The one gap that has nothing to do with the framework

`createScrim` never calls `enter` for the state it starts in — only for an actual `cover()`/`uncover()`. The resting CSS of every node has to already match `initial`, because the first real transition reads its starting point from whatever is on screen: a single-keyframe Web Animation animates from the element's current computed style, not from a value the store remembers.

On this site that's invisible, because the SSR'd HTML already paints the curtain in place before any JS runs. A client-rendered app has no such head start — the matching CSS has to be written by hand, and nothing in the library can paint it earlier than the app's own first paint. This isn't specific to Vue, Svelte or Angular; it would be true of a CSR-only React app too.

## A rough edge, left as-is

`src/index.ts` exports `createScrim` and `useScrim` from the same entry point, and `useScrim` imports `react`. A non-React consumer that only wants `createScrim` still needs `react` resolvable, even unused. Vite tree-shakes around it without complaint; Angular's esbuild-based builder surfaces it as a CommonJS-dependency warning.

Splitting the package into two entry points (`.` for the core, `./react` for the hook) would remove this. Not done here — it's a real change to how the package is published, not part of this spike.
