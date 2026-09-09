# react-scrim

A covering layer for React whose state is data attributes, so every animation stays in your stylesheet.

Package: [npmjs.com/package/react-scrim](https://www.npmjs.com/package/react-scrim)

Documentation: [dev.robertoattanasio.com/react-scrim](https://dev.robertoattanasio.com/react-scrim)

## Install

```sh
npm install react-scrim
```

## What you get

One component. It renders a fixed, full-viewport layer and writes its state onto that element. Nothing else: no timers, no durations, no easing, no router.

```tsx
<Scrim until={appReady} isLoading={isEnteringSection} variant={section}>
  <SplashContent />
</Scrim>
```

| Prop        | What it does                                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `until`     | A function returning a promise. The scrim covers from the first paint and stays until it resolves. Keep the reference stable: it is called again whenever it changes. |
| `isLoading` | Keeps the scrim covering while `true`, for route changes or anything else you drive.                                                                                  |
| `isReady`   | Starts the scrim already uncovered: `until` is never called, so there is no splash at first paint.                                                                    |
| `variant`   | Any string, mirrored to `data-scrim-variant` so your CSS can style this scrim differently.                                                                            |
| `onReady`   | Called once, when the scrim becomes ready: `until` resolved, or `isReady` was already true.                                                                           |
| `onLoading` | Called with `true` when the incoming variant has been parked and the cover starts animating in, with `false` when the scrim is told to uncover.                       |
| `onScreen`  | Called with `true` when the layer starts covering, with `false` when it starts uncovering.                                                                            |

Every other `div` prop is forwarded.

`onScreen` is `data-scrim-open` as a callback: the same condition, for consumers that cannot reach the element through CSS. It fires on mount with the value the layer starts at, so state wired to it is correct from the first commit.

The callbacks report the state the attributes already carry, for anything outside the stylesheet that has to follow the scrim. They report a start, never an end: when `onReady` fires the uncovering has begun, and how long it lasts is in your CSS, so a consumer that must wait for the layer to be gone reads that duration from its own stylesheet.

## The attributes

| Attribute            | Present when                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `data-scrim`         | Always. Marks the layer.                                                                    |
| `data-scrim-open`    | The scrim is covering.                                                                      |
| `data-scrim-instant` | The state must apply without animating.                                                     |
| `data-scrim-ready`   | The scrim is ready: `until` resolved, or `isReady` was passed. Latched: it never goes back. |
| `data-scrim-variant` | Mirrors the `variant` prop.                                                                 |

Your stylesheet decides what any of it looks like:

```css
[data-scrim] {
  transition-property: translate, visibility;
  transition-duration: 650ms;
}

[data-scrim]:not([data-scrim-open]) {
  translate: 0 100%;
}
```

Keep `visibility` in `transition-property`. The layer is `visibility: hidden` unless `data-scrim-open` is present, so leaving it out hides the element the instant the scrim closes and the exit never plays.

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
