import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ReactScrimProviderProps, ScrimPhase, ScrimState } from "./type.js";

import { ScrimContext } from "./context.js";

export const ReactScrimProvider = ({ children, duration = 0, hold = 0, until }: ReactScrimProviderProps) => {
  const [phase, setPhaseState] = useState<ScrimPhase>(until ? "open" : "closed");
  const [isReady, setIsReady] = useState(!until);

  const timer = useRef<number>(undefined);
  const ready = useRef(!until);
  const phaseRef = useRef(phase);
  const config = useRef({ duration, hold });
  config.current = { duration, hold };

  const setPhase = useCallback((next: ScrimPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const open = useCallback(() => {
    if (!ready.current) return;
    window.clearTimeout(timer.current);
    setPhase("opening");
    timer.current = window.setTimeout(() => setPhase("open"), config.current.duration);
  }, [setPhase]);

  const close = useCallback(() => {
    if (!ready.current) return;
    if (phaseRef.current === "holding" || phaseRef.current === "closing" || phaseRef.current === "closed") return;
    window.clearTimeout(timer.current);
    const { duration } = config.current;
    setPhase("holding");
    timer.current = window.setTimeout(() => {
      setPhase("closing");
      timer.current = window.setTimeout(() => setPhase("closed"), duration);
    }, duration);
  }, [setPhase]);

  useEffect(() => {
    if (!until) return;
    let cancelled = false;
    Promise.resolve(until()).then(() => {
      if (cancelled) return;
      ready.current = true;
      setIsReady(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(close, config.current.hold);
    });
    return () => {
      cancelled = true;
    };
  }, [until, close]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo<ScrimState>(
    () => ({
      phase,
      isReady,
      isOpening: phase === "opening",
      isOpen: phase === "open",
      isHolding: phase === "holding",
      isClosing: phase === "closing",
      isClosed: phase === "closed",
      duration,
      hold,
      open,
      close,
    }),
    [phase, isReady, duration, hold, open, close],
  );

  return <ScrimContext value={value}>{children}</ScrimContext>;
};
