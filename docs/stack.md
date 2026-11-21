# Stack

Every `cover` adds a curtain on top of the ones already on screen. The scrim keeps them in order and tells each one its phase.

## Rules

- A curtain on screen is never restarted or reversed. A new `cover` adds another curtain instead.
- When the top curtain finishes `entering`, every curtain below it is unmounted.
- A curtain covered below another one, still `entering`, stays mounted until the one on top has covered.
- `uncover` only moves the top curtain.
- When the top curtain finishes `leaving`, every curtain is unmounted, unless a `cover` came in meanwhile.

## Example

```ts
void AppScrim.cover(Fade);
void AppScrim.cover(Wipe);
```

`Fade` and `Wipe` both enter. When `Wipe` has covered, `Fade` is unmounted. `uncover()` then moves `Wipe` only.
