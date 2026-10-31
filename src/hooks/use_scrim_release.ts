import { useEffect, useEffectEvent, useRef } from "react";
import type { ActionDispatch } from "react";

import { SCRIM_REDUCED_MOTION } from "../constants/scrim.js";
import type { ScrimTiming } from "../types/scrim.js";
import type { ScrimAction, ScrimState } from "../types/scrim_reducer.js";

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

export const isScrimReduced = () => window.matchMedia(SCRIM_REDUCED_MOTION).matches;

export const useScrimRelease = (
  { status, target }: ScrimState,
  dispatch: ActionDispatch<[ScrimAction]>,
  { hold = 0, until }: ScrimTiming,
) => {
  const heldUntil = useRef(0);

  const startHold = useEffectEvent(() => {
    heldUntil.current = Date.now() + hold;
  });

  const settle = useEffectEvent((signal: AbortSignal, onReady: () => void) =>
    Promise.allSettled([
      Promise.resolve()
        .then(() => (signal.aborted ? undefined : until?.(signal)))
        .catch((error: unknown) => {
          if (!signal.aborted) window.reportError(error);
        })
        .finally(onReady),
      wait(heldUntil.current - Date.now(), signal),
    ]),
  );

  useEffect(() => {
    if (status === "covered") startHold();
  }, [status]);

  useEffect(() => {
    if (status !== "covered" || target !== "idle") return;

    const controller = new AbortController();
    const { signal } = controller;

    void settle(signal, () => {
      if (!signal.aborted) dispatch({ type: "ready" });
    }).then(() => {
      if (!signal.aborted) dispatch({ type: "leave", reduced: isScrimReduced() });
    });

    return () => controller.abort();
  }, [status, target, dispatch]);
};
