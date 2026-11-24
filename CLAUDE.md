# react-scrim

Page transitions for React: a stack of curtains the consumer writes and animates, covered and uncovered from anywhere. Public package on npm.

## Docs

- [README.md](./README.md): install, links to the docs.
- [docs/](./docs/): [create-scrim.md](./docs/create-scrim.md), [curtain.md](./docs/curtain.md), [cover-uncover.md](./docs/cover-uncover.md), [status.md](./docs/status.md), [stack.md](./docs/stack.md), [migration.md](./docs/migration.md), plus [scripts.md](./docs/scripts.md) and [release.md](./docs/release.md).

Read the relevant doc before changing the package. When an option, a phase or a rule of the stack changes, update its doc in the same change.

## Structure

```
src/
  index.ts             the only barrel
  scrim/
    scrim.tsx          createScrim and the React side: Root, useStatus
    scrim-store.ts     the stack of curtains, with no React in it
    type.ts            the public types
```

## Naming

| What    | Convention    | Example          |
| ------- | ------------- | ---------------- |
| file    | kebab-case    | `scrim-store.ts` |
| factory | `createScrim` | `createScrim`    |
| type    | `Scrim*`      | `ScrimStatus`    |
| generic | `T<Noun>`     | `TMeta`          |

## What the library does

It keeps the order of the curtains and tells each one its phase. Nothing else.

- It never animates and never reads a duration. It waits for `done()`.
- Every `cover` adds a curtain on top. A curtain on screen never restarts or reverses.
- When the top curtain has covered, the curtains below it are unmounted.
- `uncover` only moves the top curtain: its `until`, then its `hold`, then `leaving`.
- `ready` is `true` once the top curtain's `until` has resolved, and when no curtain is on screen.
- `key` and `meta` are carried, never read by the library.
- A curtain's `scrim` prop keeps its identity until its phase changes.
- `cover`, `uncover` and `getStatus` act on the `Root` mounted last, so they work outside React.

What to cover, when, and how the page reacts belongs to the app.

## Conventions

- `scrim-store.ts` has no React import. `scrim.tsx` connects it with `useSyncExternalStore`.
- Relative imports end in `.js`, types are imported with `import type`.
- React and React DOM are peer dependencies. No other dependencies.
- No comments in the code unless asked.
