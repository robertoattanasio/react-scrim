---
"react-scrim": patch
---

Ship compiled JavaScript with type declarations instead of the TypeScript source, so the package works with any bundler without extra configuration. A `transpilePackages` entry added for react-scrim can be removed.

Widen the React peer range to `^19.0.0`: the package only uses APIs available since React 18.
