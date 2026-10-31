"use client";

import { useContext } from "react";

import { SCRIM_ACTIONS_CONTEXT } from "../constants/scrim.js";

export const useScrimActions = () => {
  const actions = useContext(SCRIM_ACTIONS_CONTEXT);

  if (!actions) throw new Error("Not wrapped in Scrim.");

  return actions;
};
