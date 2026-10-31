import type { ScrimInitial } from "../types/scrim.js";
import type { ScrimAction, ScrimState } from "../types/scrim_reducer.js";

export const scrimStateFor = (initial: ScrimInitial): ScrimState => ({
  status: initial,
  target: "idle",
  ready: initial === "idle",
  first: initial === "covered",
});

export const scrimReducer = (state: ScrimState, action: ScrimAction): ScrimState => {
  switch (action.type) {
    case "cover": {
      const next: ScrimState = { ...state, target: "covered", ready: false };

      if (state.status === "covered" || state.status === "entering") return next;

      return { ...next, first: false, status: action.reduced ? "covered" : "entering" };
    }
    case "uncover":
      return { ...state, target: "idle" };
    case "ready":
      return state.target === "idle" ? { ...state, ready: true } : state;
    case "leave":
      if (state.status !== "covered" || state.target !== "idle") return state;

      return { ...state, ready: true, status: action.reduced ? "idle" : "leaving" };
    case "done":
      if (action.phase !== state.status) return state;
      if (state.status === "entering") return { ...state, status: "covered" };
      if (state.status === "leaving") return { ...state, status: "idle" };

      return state;
  }
};
