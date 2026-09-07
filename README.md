# react-scrim

A covering layer for React whose state is data attributes, so every animation stays in your stylesheet.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Install

```sh
npm install react-scrim
```

## What you get

One component. It renders a fixed, inert, full-viewport layer and writes its state onto that element. Nothing else: no timers, no durations, no easing, no router.

```tsx
<Scrim until={appReady} open={isEnteringSection} variant={section}>
  <SplashContent />
</Scrim>
```

| Prop      | What it does                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------- |
| `until`   | A function returning a promise. The scrim covers from the first paint and stays until it resolves. |
| `open`    | Keeps the scrim covering while `true`, for route changes or anything else you drive.               |
| `variant` | Any string, mirrored to `data-scrim-variant` so your CSS can style this scrim differently.         |

Every other `div` prop is forwarded.

## The attributes

| Attribute            | Present when                                       |
| -------------------- | -------------------------------------------------- |
| `data-scrim`         | Always. Marks the layer.                           |
| `data-scrim-open`    | The scrim is covering.                             |
| `data-scrim-instant` | The state must apply without animating.            |
| `data-scrim-ready`   | `until` has resolved. Latched: it never goes back. |
| `data-scrim-variant` | Mirrors the `variant` prop.                        |

Your stylesheet decides what any of it looks like:

```css
[data-scrim] {
  transition-property: translate;
  transition-duration: 650ms;
}

[data-scrim]:not([data-scrim-open]) {
  translate: 0 100%;
}
```

## Built with

React 19 and TypeScript, nothing else: no dependencies, no runtime beyond React itself. Published as source, with a stylesheet of three rules.

## Approach

- **Data attributes are the API.** The component owns state, never appearance. Which properties animate, how long, with what curve, and whether a variant slides or fades is CSS you write.
- **Correct at first paint.** The scrim covers in the server-rendered HTML, so there is no flash before hydration.
- **The entrance belongs to the variant that enters.** Opening applies the incoming variant unanimated for one frame, then opens. Without it a transition would start from wherever the previous variant parked the element.
- **Transitions, not keyframes.** Everything stays interruptible: navigate mid-animation and it reverses instead of restarting.
- **No timing in JavaScript.** The library never reads or holds a duration. If you need to wait for the scrim, read the value from your own CSS.

Conventions for contributing: [RULE.md](./RULE.md).

## License

[MIT](./LICENSE).
