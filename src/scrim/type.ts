import type { ComponentType, ReactNode, SyntheticEvent } from "react";

export type ScrimPhase = "entering" | "covered" | "leaving";

export type ScrimStatus = ScrimPhase | "idle";

export type ScrimProps<TMeta = undefined> = {
  scrim: {
    phase: ScrimPhase;
    meta: Readonly<TMeta>;
    done: (event?: SyntheticEvent) => void;
  };
};

export type ScrimCurtain<TMeta = undefined> = ComponentType<ScrimProps<TMeta>>;

export type ScrimOptions<TMeta = undefined> = {
  key?: string;
  hold?: number;
  until?: () => unknown;
  meta?: TMeta;
};

export type ScrimState<TMeta = undefined> = {
  status: ScrimStatus;
  key: string | undefined;
  meta: Readonly<TMeta>;
};

export type Scrim<TMeta = undefined> = {
  Root: (props: { children: ReactNode }) => ReactNode;
  cover: (curtain: ScrimCurtain<TMeta>, options?: ScrimOptions<TMeta>) => Promise<void>;
  uncover: () => Promise<void>;
  getStatus: () => ScrimState<TMeta> | undefined;
  useStatus: () => ScrimState<TMeta>;
};
