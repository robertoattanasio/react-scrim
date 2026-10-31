"use client";

import { useContext } from "react";

import { SCRIM_STATE_CONTEXT } from "../constants/scrim.js";
import type { ScrimStateValue, ScrimValue } from "../types/scrim.js";
import { useScrimActions } from "./use_scrim_actions.js";

export const useScrim = <TMeta = undefined,>(): ScrimValue<TMeta> => {
  const state = useContext(SCRIM_STATE_CONTEXT) as ScrimStateValue<TMeta> | null;
  const actions = useScrimActions();

  if (!state) throw new Error("Not wrapped in Scrim.");

  return { ...state, ...actions };
};
