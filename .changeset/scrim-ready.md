---
"react-scrim": minor
---

`useStatus` and `getStatus` return `ready`: `true` once the top curtain's `until` has resolved, before its `hold`, and when no curtain is on screen. A new curtain starts not ready.
