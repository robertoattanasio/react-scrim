import { createContext } from "react";

import type { ScrimState } from "./type.js";

export const ScrimContext = createContext<ScrimState | null>(null);
