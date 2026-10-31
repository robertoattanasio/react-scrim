import { useCallback, useEffect, useRef } from "react";

import type { ScrimState } from "../types/scrim_reducer.js";

export const useScrimWaiter = (state: ScrimState, isSettled: boolean) => {
  const waiters = useRef<(() => void)[]>([]);
  const presence = useRef<"mounted" | "cleaning" | "unmounted">("mounted");

  const flush = useCallback(() => waiters.current.splice(0).forEach((resolve) => resolve()), []);

  useEffect(() => {
    if (isSettled) flush();
  }, [state, isSettled, flush]);

  useEffect(() => {
    presence.current = "mounted";

    return () => {
      presence.current = "cleaning";

      queueMicrotask(() => {
        if (presence.current !== "cleaning") return;

        presence.current = "unmounted";
        flush();
      });
    };
  }, [flush]);

  return useCallback(
    (run: () => void) =>
      new Promise<void>((resolve) => {
        if (presence.current === "unmounted") return resolve();

        waiters.current.push(resolve);
        run();
      }),
    [],
  );
};
