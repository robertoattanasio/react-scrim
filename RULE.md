# Rules

How react-scrim code is written.

## Files

```
src/
  scrim/
    scrim.tsx        createScrim and the React side: Root, useStatus
    scrim_store.ts   the stack of curtains, with no React in it
    type.ts          the public types
  index.ts           the only barrel
```

Relative imports end in `.js`, and types are imported with `import type`.

## Naming

| what    | convention    | example          |
| ------- | ------------- | ---------------- |
| file    | `snake_case`  | `scrim_store.ts` |
| factory | `createScrim` | `createScrim`    |
| type    | `Scrim*`      | `ScrimStatus`    |
| generic | `T<Noun>`     | `TMeta`          |

## What the library does

It keeps the order of the curtains and tells each one its phase. Nothing else.

- It never animates and never reads a duration. It waits for `done()`.
- Every `cover` adds a curtain on top. A curtain on screen never restarts or reverses.
- When the top curtain has covered, the curtains below it are unmounted.
- `uncover` only moves the top curtain: its `until`, then its `hold`, then `leaving`.
- `key` and `meta` are carried, never read. `key` is read back by `getStatus` and `useStatus`, so the app can tell which curtain is on top.
- A curtain's `scrim` prop keeps its identity until its phase changes.

What to cover, when, and how the page reacts belongs to the app.
