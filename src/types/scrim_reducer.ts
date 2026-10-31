import type { ScrimStatus } from "./scrim.js";

export type ScrimState = {
  status: ScrimStatus;
  target: "covered" | "idle";
  ready: boolean;
  first: boolean;
};

export type ScrimAction =
  | { type: "cover"; reduced: boolean }
  | { type: "leave"; reduced: boolean }
  | { type: "uncover" }
  | { type: "ready" }
  | { type: "done"; phase: ScrimStatus };
