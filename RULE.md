# Rules

How react-scrim code is written.

## Files

Flat under `src/`, in `snake_case`:

```
components/
  scrim.tsx         the component
  scrim.css         the base rules
  type.ts           its props and status
utils/
  scrim_loader.ts   the timing utility
index.ts            the only barrel
```

## Naming

| what       | convention             | example                 |
| ---------- | ---------------------- | ----------------------- |
| file       | `snake_case`           | `utils/scrim_loader.ts` |
| component  | `PascalCase`           | `Scrim`                 |
| utility    | `scrim<Noun>`          | `scrimLoader`           |
| props type | `<Component>Props`     | `ScrimProps`            |
| status     | `<state>` string union | `"covering"`            |
| attribute  | `data-scrim-<state>`   | `data-scrim-ready`      |
| prop in    | `is<State>`            | `isLoading`             |
| prop out   | `on<Noun>`             | `onStatus`              |
| state      | `_is<State>`           | `_isLoading`            |

Attributes are named for the state they describe: `data-scrim-instant`, not `data-scrim-skip-fade`.

## Styles

- The component writes state as `data-scrim-*` attributes. Appearance and animation are the consumer's CSS.
- `scrim.css` only covers the viewport, shows the element when open, reads the duration from `--scrim-duration` (300ms by default) and applies `transition: none` when instant.
- Animations are transitions, not keyframes.
- `durationTime` is written to `--scrim-duration`. `holdTime` stays in JavaScript: it delays when `_isCovering` turns false.

## State

- `_isReady` latches when `until` resolves, or immediately with `isReady`, and never goes back.
- `_isLoading` turns true two animation frames after `isLoading`, so the incoming variant is applied without a transition first. Both frames are cancelled on cleanup.
- `_isCovering` drives `data-scrim-open`. It follows the covering state at once when it turns on, and after `holdTime` when it turns off.
- Async work that can resolve after unmount is guarded by a `cancelled` flag.
- `onStatus` is the only callback.

## Code

- No imperative DOM writes: everything is rendered as attributes or an inline custom property.
- No comments.
