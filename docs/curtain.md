# Curtain

The component you write and pass to `cover`, or to `createScrim` as `initial`. It receives its phase and tells the scrim when its animation is over.

```ts
type ScrimCurtain<TMeta> = ComponentType<ScrimProps<TMeta>>;

type ScrimProps<TMeta> = {
  scrim: {
    phase: "entering" | "covered" | "leaving";
    meta: Readonly<TMeta>;
    done: (event?: SyntheticEvent) => void;
  };
};
```

| Field   |                                                         |
| ------- | ------------------------------------------------------- |
| `phase` | where the curtain is                                    |
| `meta`  | the `meta` of this curtain, or the scrim's default      |
| `done`  | call it when the `entering` or `leaving` animation ends |

## Behavior

- `entering` and `leaving` wait for `done`: without it the curtain never moves on.
- `covered` needs nothing.
- Passed an event, `done` ignores it unless it comes from the element that has the handler. Animations of children, bubbling up, don't end the phase.
- The library never animates, never reads a duration, and doesn't look at `prefers-reduced-motion`. The curtain decides all of it, and still calls `done`.
- The `scrim` prop keeps its identity until the phase changes.
- A curtain always starts from `entering`, or from `covered` when it's the `initial` one. It's never restarted or reversed.

## Example

```tsx
const Curtain = ({ scrim: { phase, done } }: ScrimProps) => (
  <div className="curtain" data-phase={phase} onAnimationEnd={done} />
);
```

```css
.curtain {
  position: fixed;
  inset: 0;
  background: black;
}

.curtain[data-phase="entering"] {
  animation: curtain-in 600ms both;
}

.curtain[data-phase="leaving"] {
  animation: curtain-out 600ms both;
}
```
