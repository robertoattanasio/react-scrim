import { createContext } from "react";

import type { ScrimActions, ScrimStateValue } from "../types/scrim.js";

export const SCRIM_STATE_CONTEXT = createContext<ScrimStateValue<any> | null>(null);

export const SCRIM_ACTIONS_CONTEXT = createContext<ScrimActions | null>(null);

export const SCRIM_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
