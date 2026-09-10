import type { ComponentProps, CSSProperties, ReactNode } from "react";

export type ScrimPhase = "closed" | "opening" | "open" | "holding" | "closing";

export type ScrimState = {
  phase: ScrimPhase;
  isReady: boolean;
  isOpening: boolean;
  isOpen: boolean;
  isHolding: boolean;
  isClosing: boolean;
  isClosed: boolean;
  duration: number;
  hold: number;
  open: () => void;
  close: () => void;
};

export type ReactScrimProviderProps = {
  children: ReactNode;
  duration?: number;
  hold?: number;
  until?: () => unknown;
};

export type ScrimProps = ComponentProps<"div">;

export type ScrimStyle = CSSProperties & {
  "--scrim-duration": string;
};
