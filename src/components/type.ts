import type { ComponentProps } from "react";

export type ScrimSignal = () => unknown;

export type ScrimProps = ComponentProps<"div"> & {
  until?: ScrimSignal;
  isLoading?: boolean;
  isReady?: boolean;
  variant?: string;
  onReady?: () => void;
  onLoading?: (isLoading: boolean) => void;
  onScreen?: (isOnScreen: boolean) => void;
};
