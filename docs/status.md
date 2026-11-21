# useStatus and getStatus

Read the state of the scrim: the phase of the top curtain, whether it's ready, its key and its meta.

```ts
useStatus(): ScrimState<TMeta>
getStatus(): ScrimState<TMeta> | undefined
```

| Field    | Type                  |                                                                   |
| -------- | --------------------- | ----------------------------------------------------------------- |
| `status` | `ScrimStatus`         | the phase of the top curtain, or `"idle"` with none               |
| `ready`  | `boolean`             | `true` once the top curtain's `until` has resolved, and with none |
| `key`    | `string \| undefined` | the `key` of the top curtain                                      |
| `meta`   | `Readonly<TMeta>`     | the `meta` of the top curtain                                     |

## Behavior

- `useStatus` re-renders on every change. It throws outside its scrim's `Root`.
- `getStatus` reads once, from anywhere. It returns `undefined` with no `Root` mounted.
- A new curtain starts not ready, even before `uncover` is called.
- With no curtain on screen, `key` and `meta` keep the values of the last one.
- The object keeps its identity until one of its fields changes.

## Example

The page reacts to the curtain:

```tsx
const { status } = AppScrim.useStatus();

<main data-covered={status === "covered"} />;
```

A guard outside React:

```ts
if (AppScrim.getStatus()?.status !== "idle") return;
```
