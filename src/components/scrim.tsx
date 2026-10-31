"use client";

import { useMemo } from "react";

import { SCRIM_ACTIONS_CONTEXT, SCRIM_STATE_CONTEXT } from "../constants/scrim.js";
import { useScrimTimeline } from "../hooks/use_scrim_timeline.js";
import type { ScrimComponentProps, ScrimMeta } from "../types/scrim.js";

export const Scrim = <TMeta = ScrimMeta,>({
  children,
  curtain: Curtain,
  initial = "covered",
  hold,
  until,
  meta,
}: ScrimComponentProps<TMeta>) => {
  const { timeline, actions, done } = useScrimTimeline(initial, { hold, until });
  const { status } = timeline;

  const state = useMemo(() => ({ ...timeline, meta: meta as TMeta }), [timeline, meta]);

  const curtain = useMemo(
    () => (status === "idle" ? null : <Curtain scrim={{ phase: status, meta: meta as TMeta, done }} />),
    [Curtain, status, meta, done],
  );

  return (
    <SCRIM_ACTIONS_CONTEXT value={actions}>
      <SCRIM_STATE_CONTEXT value={state}>
        {children}
        {curtain}
      </SCRIM_STATE_CONTEXT>
    </SCRIM_ACTIONS_CONTEXT>
  );
};
