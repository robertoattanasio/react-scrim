---
"react-scrim": minor
---

`ScrimRegister` types `meta` once for the whole app through module augmentation, so `useScrim` and `ScrimProps` don't need a generic. It is optional, and an explicit generic still wins.
