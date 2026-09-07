import type { ComponentProps } from "react";

export type ScrimSignal = () => unknown;

export type ScrimProps = ComponentProps<"div"> & {
  until?: ScrimSignal;
  open?: boolean;
  variant?: string;
};
