import { useCallback, useMemo, useReducer } from "react";
import type { SyntheticEvent } from "react";

import { scrimReducer, scrimStateFor } from "../reducer/scrim_reducer.js";
import type { ScrimInitial, ScrimTiming } from "../types/scrim.js";
import { isScrimReduced, useScrimRelease } from "./use_scrim_release.js";
import { useScrimWaiter } from "./use_scrim_waiter.js";

export const useScrimTimeline = (initial: ScrimInitial, timing: ScrimTiming) => {
  const [state, dispatch] = useReducer(scrimReducer, initial, scrimStateFor);
  const { status, ready, first } = state;

  const waitCovered = useScrimWaiter(state, status === "covered");
  const waitIdle = useScrimWaiter(state, status === "idle");

  useScrimRelease(state, dispatch, timing);

  const cover = useCallback(
    () => waitCovered(() => dispatch({ type: "cover", reduced: isScrimReduced() })),
    [waitCovered],
  );

  const uncover = useCallback(() => waitIdle(() => dispatch({ type: "uncover" })), [waitIdle]);

  const done = useCallback(
    (event?: SyntheticEvent) => {
      if (event && event.target !== event.currentTarget) return;

      dispatch({ type: "done", phase: status });
    },
    [status],
  );

  const timeline = useMemo(() => ({ status, ready, first }), [status, ready, first]);
  const actions = useMemo(() => ({ cover, uncover }), [cover, uncover]);

  return { timeline, actions, done };
};
