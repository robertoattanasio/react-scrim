import type { ComponentType, ReactNode, SyntheticEvent } from "react";

export type ScrimPhase = "entering" | "covered" | "leaving";

export type ScrimStatus = ScrimPhase | "idle";

export type ScrimInitial = "covered" | "idle";

export type ScrimDone = (event?: SyntheticEvent) => void;

export type ScrimProps<TMeta = undefined> = {
  scrim: {
    phase: ScrimPhase;
    meta: TMeta;
    done: ScrimDone;
  };
};

export type ScrimCurtain<TMeta = undefined> = ComponentType<ScrimProps<TMeta>>;

export type ScrimTiming = {
  hold?: number;
  until?: (signal: AbortSignal) => Promise<unknown>;
};

export type ScrimComponentProps<TMeta = undefined> = ScrimTiming & {
  children?: ReactNode;
  curtain: ScrimCurtain<TMeta>;
  initial?: ScrimInitial;
  meta?: TMeta;
};

export type ScrimTimeline = {
  status: ScrimStatus;
  ready: boolean;
  first: boolean;
};

export type ScrimActions = {
  cover: () => Promise<void>;
  uncover: () => Promise<void>;
};

export type ScrimStateValue<TMeta = undefined> = ScrimTimeline & {
  meta: TMeta;
};

export type ScrimValue<TMeta = undefined> = ScrimStateValue<TMeta> & ScrimActions;
