import { use } from "react";

import type { ScrimState } from "./type.js";

import { ScrimContext } from "./context.js";

export const useReactScrim = (): ScrimState => {
  const state = use(ScrimContext);

  if (!state) throw new Error("useReactScrim must be used inside a ReactScrimProvider.");

  return state;
};
