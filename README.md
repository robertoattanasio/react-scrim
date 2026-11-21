# react-scrim

`react-scrim` helps coordinate page transitions in React. You provide a curtain component and its animation; the scrim keeps track of when the curtain covers the page and when it can leave. Call `cover` and `uncover` wherever you need them, including from a route loader. If transitions overlap, the scrim keeps the curtains in order.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Installation

```sh
npm install react-scrim
```

React 19 and React DOM 19 are required as peer dependencies.

Create a scrim and mount its `Root` around your app:

```tsx
import { createScrim } from "react-scrim";

export const AppScrim = createScrim();

<AppScrim.Root>
  <App />
</AppScrim.Root>;
```

Use `cover` and `uncover` to put a curtain around a navigation:

```ts
await AppScrim.cover(Curtain);
await navigate(to);
await AppScrim.uncover();
```

## API

These guides explain how to create and control a scrim, and how to build the curtain component it displays:

- [createScrim](./docs/create-scrim.md)
- [Curtain](./docs/curtain.md): the component you write
- [cover and uncover](./docs/cover-uncover.md)
- [useStatus and getStatus](./docs/status.md)
- [Stack](./docs/stack.md): what happens when curtains overlap
- [Migrating from 1.x](./docs/migration.md)

## Scripts

For the available project scripts and what they do, see [docs/scripts.md](./docs/scripts.md).

## License

[MIT](./LICENSE)
