import type { ComponentType, ReactNode, SyntheticEvent } from "react";

export type ScrimPhase = "entering" | "covered" | "leaving";

export type ScrimStatus = ScrimPhase | "idle";

export type ScrimInitial = "covered" | "idle";

export interface ScrimRegister {}

export type ScrimMeta = ScrimRegister extends { meta: infer TMeta } ? TMeta : undefined;

export type ScrimDone = (event?: SyntheticEvent) => void;

export type ScrimProps<TMeta = ScrimMeta> = {
  scrim: {
    phase: ScrimPhase;
    meta: TMeta;
    done: ScrimDone;
  };
};

export type ScrimCurtain<TMeta = ScrimMeta> = ComponentType<ScrimProps<TMeta>>;

export type ScrimTiming = {
  hold?: number;
  until?: (signal: AbortSignal) => Promise<unknown>;
};

export type ScrimComponentProps<TMeta = ScrimMeta> = ScrimTiming & {
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

export type ScrimStateValue<TMeta = ScrimMeta> = ScrimTimeline & {
  meta: TMeta;
};

export type ScrimValue<TMeta = ScrimMeta> = ScrimStateValue<TMeta> & ScrimActions;
