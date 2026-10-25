# react-scrim

Page transitions for React. Each transition is a component you animate however you like.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Install

```sh
npm install react-scrim
```

## Usage

Write a curtain. It gets its `phase` and calls `done()` when its animation ends:

```tsx
const Curtain = ({ scrim }: ScrimProps) => (
  <motion.div
    className="fixed inset-0 bg-black"
    initial={{ x: "-100%" }}
    animate={{ x: scrim.phase === "leaving" ? "100%" : "0%" }}
    onAnimationComplete={() => scrim.done()}
  />
);
```

Create the scrim and put its `Root` around the app:

```tsx
export const AppScrim = createScrim();

<AppScrim.Root>
  <App />
</AppScrim.Root>;
```

Cover before the page changes, uncover when it's ready:

```ts
await AppScrim.cover(Curtain);

AppScrim.uncover();
```

## How it works

Every `cover()` puts a new curtain on top. Curtains already on screen never restart, so fast navigations always look the same.

react-scrim doesn't know how long your animations take. It waits for `done()`, so CSS, Motion, GSAP and the Web Animations API all work.

## API

`createScrim(initial?, options?)` returns:

| member      | what it does                                        |
| ----------- | --------------------------------------------------- |
| `Root`      | renders the app and the curtains on top of it       |
| `cover`     | adds a curtain on top, resolves once it has covered |
| `uncover`   | lets the top curtain leave                          |
| `useStatus` | `{ status, key, meta }` of the top curtain          |
| `getStatus` | the same, outside React                             |

`initial` is a curtain already covering on the first paint. `cover` takes the same options:

| option  | what it does                            |
| ------- | --------------------------------------- |
| `key`   | your own id, read back by `useStatus`   |
| `hold`  | milliseconds to stay covered            |
| `until` | something to wait for before leaving    |
| `meta`  | your own data, read back by `useStatus` |

A curtain receives `scrim.phase` (`"entering"`, `"covered"`, `"leaving"`), `scrim.meta` and `scrim.done`.

Routing, `meta` and full examples are in the [documentation](https://dev.robertoattanasio.com/react-scrim).

## License

MIT
