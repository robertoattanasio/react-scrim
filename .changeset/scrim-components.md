---
"react-scrim": major
---

A scrim is now a component instead of a config. See `MIGRATION.md`.

- `createScrim(initial?, options?)` returns `Root`, `cover`, `uncover`, `useStatus` and `getStatus`.
- A curtain is your own component. It receives `scrim.phase`, `scrim.meta` and `scrim.done`, and calls `done()` when its animation ends.
- Every `cover()` puts a new curtain on top. Curtains already on screen never restart or reverse.
- `hold`, `until` and `meta` are options of each curtain.
- `nodes`, `node()`, `play`, `animation`, `useScrim` and `isReady` are removed.
