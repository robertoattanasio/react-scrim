import type { ScrimSignal } from "../components/type.js";

export const scrimLoader =
  (ms: number, ...extra: ScrimSignal[]): ScrimSignal =>
  () => {
    if (typeof document === "undefined") return;

    return Promise.all([new Promise((resolve) => window.setTimeout(resolve, ms)), ...extra.map((signal) => signal())]);
  };
