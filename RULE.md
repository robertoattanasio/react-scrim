# Rules

How react-scrim code is written.

## Files

One factory and one hook:

```
src/
  scrim/
    scrim.ts        the factory
    type.ts         its options, its return, the status
  hooks/
    use_scrim.ts    the hook that reads a store
  index.ts          the only barrel
```

Relative imports end in `.js`, and types are imported with `import type`.

## Naming

| what         | convention           | example              |
| ------------ | -------------------- | -------------------- |
| file         | `snake_case`         | `hooks/use_scrim.ts` |
| factory      | `createScrim`        | `createScrim`        |
| hook         | `useScrim`           | `useScrim`           |
| type         | `Scrim*`             | `ScrimStatus`        |
| options type | `CreateScrimOptions` | `CreateScrimOptions` |
| generic      | `T<Noun>`            | `TName`              |

## The factory

`createScrim` returns a store, not a component. It lives outside React, so route loaders, router events and plain functions can call it.

- The status is one of `idle`, `entering`, `covered`, `leaving`. `cover` and `uncover` are the only ways to move it.
- Nodes are named up front. A component registers one with `ref={scrim.node(name)}`, and the store starts once every node is registered.
- `enter`, `leave` and `until` receive the nodes and a context. `play` in the context runs a Web Animation with the store's defaults and returns its `finished` promise. Anything that can be awaited works in its place.
- Every `cover` and `uncover` takes a new run id. A step whose run is no longer current does nothing.
- When a node unmounts and nothing replaces it in the same commit, the store goes back to `initial`.
- On the server `cover` returns nothing and the status stays `initial`.

## The hook

`useScrim` reads `status` and `isReady` through `useSyncExternalStore`, one call each. It uses the store's own getters as the server snapshot.
