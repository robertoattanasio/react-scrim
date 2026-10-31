---
"react-scrim": major
---

A scrim is now a provider around its subtree instead of a global store.

- `createScrim`, `Root`, `useStatus` and `getStatus` are removed. Mount `<Scrim curtain={Curtain}>` and read it with `useScrim`.
- `useScrimActions` returns only `cover` and `uncover`, and doesn't re-render when the phase changes.
- `cover()` no longer stacks curtains: a `cover` during `leaving` sends the same curtain back.
- `key` is removed. `hold`, `until` and `meta` are props of `Scrim`.
- `useScrim` returns `first`, `true` while the initial curtain is on screen.
- `until` receives an `AbortSignal`, and its errors go to `reportError`.
- `cover` and `uncover` resolve when `Scrim` unmounts.
- A `done()` left over from a previous phase is ignored.
- The peer range is now React `^19.2.0`.
