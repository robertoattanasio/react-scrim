# Conventions

How react-scrim is written. The library is one component and three CSS rules, and these are the rules that keep it that way.

## The approach

**Data attributes are the API.** The component owns state and writes it to the element. It never owns appearance. Which properties animate, for how long, with what curve, and whether a variant slides or fades is CSS the consumer writes. A feature that can be expressed as an attribute the stylesheet reacts to is not a prop.

**Nothing about routing enters the library.** No loader, no route options, no delay, no promise handed to a router. The scrim is told when to cover through `open`; who decides that, and what has to wait for it, is the application's problem.

**No duration lives in JavaScript.** The library never reads, stores or parses a time. A consumer that must wait for the scrim reads the value from its own stylesheet.

**Correct at first paint.** The scrim covers in the server-rendered HTML. State that only exists after hydration cannot express itself in the served markup, which is how a flash of content gets in.

**Transitions, not keyframes.** Keyframes would let each variant declare its own start, but they restart instead of reversing when a transition is interrupted mid-flight. Reversibility wins.

## Files

Flat under `src/`, in `snake_case`:

```
components/
  scrim.tsx     the component
  scrim.css     the mechanism, nothing else
  type.ts       its props
index.ts        the only barrel
```

## Naming

| what       | convention           | example                |
| ---------- | -------------------- | ---------------------- |
| file       | `snake_case`         | `components/scrim.tsx` |
| component  | `PascalCase`         | `Scrim`                |
| props type | `<Component>Props`   | `ScrimProps`           |
| attribute  | `data-scrim-<state>` | `data-scrim-ready`     |
| prop in    | `is<State>`          | `isLoading`            |
| prop out   | `on<State>`          | `onLoading`            |
| state      | `_is<State>`         | `_isLoading`           |

Attributes are named for the state they describe, never for what the consumer should do about it. `data-scrim-instant` says "apply this without animating", not "skip the fade".

## The stylesheet

`scrim.css` carries only what makes a scrim a scrim: it covers the viewport, it is shown when open, and it applies instantly when told to. Everything else is the consumer's.

The instant reset is `transition: none`, not a pair of zeroed duration and delay. A consumer rule like `[data-scrim-variant="x"]:not([data-scrim-open])` has the same specificity and comes later in the cascade, so it would win on `transition-delay` and the state would apply late. Zeroing `transition-property` cannot be overridden that way.

## State

The component holds two pieces of state and no more.

`_isReady` latches when `until` resolves and never goes back, so `data-scrim-ready` is safe to style against for anything that must stay revealed.

`_isLoading` is the armed flag, and it exists for one reason: opening applies the incoming variant unanimated for one frame, then opens. Without it a transition starts from wherever the previous variant parked the element, and a variant that fades leaves nothing for a variant that slides to animate from.

That frame is two `requestAnimationFrame` calls. A forced reflow inside the effect reads deterministic but is not enough here: React commits the parked render and the arming update close enough that the browser collapses them into one style recalculation, and the transition loses its starting point.

No imperative DOM writes. The component renders attributes; it never sets them on `document.documentElement` or reaches for the element to change its style.

## Comments

None in the code. The reasoning lives here and in the documentation site.

## Breaking changes

The attribute names are the public surface, more than the props are: consumers style against them. Renaming one, or changing when it appears, is a major even though the TypeScript signature did not move.
