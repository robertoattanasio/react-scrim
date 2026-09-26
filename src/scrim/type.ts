export type ScrimStatus = "idle" | "entering" | "covered" | "leaving";

export type ScrimNodes<TName extends string> = Record<TName, HTMLElement>;

export type ScrimPlay = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions,
) => Promise<Animation>;

export type CreateScrimOptions<TName extends string> = {
  nodes: readonly TName[];
  initial?: Extract<ScrimStatus, "covered" | "idle">;
  animation?: KeyframeAnimationOptions;
  hold?: number;
  until?: (nodes: ScrimNodes<TName>, context: { play: ScrimPlay }) => unknown;
  enter: (nodes: ScrimNodes<TName>, context: { play: ScrimPlay; status: ScrimStatus }) => unknown;
  leave: (nodes: ScrimNodes<TName>, context: { play: ScrimPlay }) => unknown;
};

export type Scrim<TName extends string> = {
  node: (name: TName) => (element: HTMLElement | null) => (() => void) | undefined;
  cover: () => Promise<void> | undefined;
  uncover: () => Promise<void>;
  subscribe: (listener: () => void) => () => void;
  getStatus: () => ScrimStatus;
  getIsReady: () => boolean;
};
