# createScrim

Creates a scrim: a `Root` to mount, and the functions that drive it.

```ts
createScrim<TMeta = undefined>(initial?: ScrimCurtain<TMeta>, options?: ScrimOptions<TMeta>): Scrim<TMeta>
```

| Parameter | Type                  |                                                                           |
| --------- | --------------------- | ------------------------------------------------------------------------- |
| `initial` | `ScrimCurtain<TMeta>` | a curtain the page starts covered by                                      |
| `options` | `ScrimOptions<TMeta>` | the options of `initial`. Its `meta` is also the default of every curtain |

## Returns

| Field       | Type                                   |                                             |
| ----------- | -------------------------------------- | ------------------------------------------- |
| `Root`      | `({ children }) => ReactNode`          | mounts the scrim, renders the curtains      |
| `cover`     | `(curtain, options?) => Promise<void>` | see [cover and uncover](./cover-uncover.md) |
| `uncover`   | `() => Promise<void>`                  | see [cover and uncover](./cover-uncover.md) |
| `getStatus` | `() => ScrimState<TMeta> \| undefined` | see [status](./status.md)                   |
| `useStatus` | `() => ScrimState<TMeta>`              | see [status](./status.md)                   |

## Options

`ScrimOptions<TMeta>`, the same for `createScrim` and `cover`:

| Option  | Type            | Default |                                                              |
| ------- | --------------- | ------- | ------------------------------------------------------------ |
| `key`   | `string`        |         | a name for the curtain, read back from the status            |
| `hold`  | `number`        | `0`     | milliseconds the curtain stays after `until`, before leaving |
| `until` | `() => unknown` |         | awaited before the curtain leaves                            |
| `meta`  | `TMeta`         |         | data passed to the curtain and to the status                 |

## Behavior

- `Root` renders its children, then the curtains on top of them, in the order they were covered.
- With `initial`, the page starts covered. Once `Root` has mounted, the curtain waits for `until` and `hold`, then leaves.
- `cover`, `uncover` and `getStatus` work outside React: they act on the `Root` mounted last. With no `Root` mounted, the promises resolve at once and `getStatus` returns `undefined`.
- Each `Root` has its own state. Two scrims never share curtains.
- The files have no `"use client"` directive: in a Server Components app, create the scrim and mount its `Root` from a client module.

## Example

```tsx
type Meta = { label: string };

export const AppScrim = createScrim<Meta>(Intro, {
  hold: 400,
  until: () => document.fonts.ready,
  meta: { label: "" },
});
```
