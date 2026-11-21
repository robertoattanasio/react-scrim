# cover and uncover

```ts
cover(curtain: ScrimCurtain<TMeta>, options?: ScrimOptions<TMeta>): Promise<void>
uncover(): Promise<void>
```

## cover

Puts a new curtain on top, in `entering`.

- Resolves when the curtain calls `done` at the end of `entering`.
- Once it has covered, the curtains below it are unmounted, and their pending promises resolve.
- `options` are those of this curtain: see [createScrim](./create-scrim.md#options).

## uncover

Lets the top curtain leave.

1. Waits for the top curtain to finish `entering`, if it hasn't.
2. Awaits its `until`.
3. Marks it ready.
4. Waits its `hold`.
5. Moves it to `leaving`, and waits for `done`.
6. Unmounts every curtain.

- Resolves at the end, or as soon as there's nothing to uncover.
- A `cover` or another `uncover` called while it waits cancels it: the curtain doesn't leave. A `cover` during `leaving` lets the leaving curtain finish, but keeps it mounted under the new one.
- `hold` starts after `until`, not when the curtain covered.
- A rejected `until` rejects the `uncover` promise, and the curtain stays.

## Example

In a route loader:

```ts
loader: async () => {
  await AppScrim.cover(Curtain, { key: "route" });
  const data = await fetchPage();
  void AppScrim.uncover();
  return data;
};
```
