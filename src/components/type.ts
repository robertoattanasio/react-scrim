import type { ComponentProps } from "react";

export type ScrimSignal = () => unknown;

export type ScrimStatus = "ready" | "loading" | "idle" | "covering" | "uncovering";

export type ScrimProps = ComponentProps<"div"> & {
  until?: ScrimSignal;
  isLoading?: boolean;
  isReady?: boolean;
  variant?: string;
  durationTime?: number;
  holdTime?: number;
  onStatus?: (status: ScrimStatus) => void;
};
