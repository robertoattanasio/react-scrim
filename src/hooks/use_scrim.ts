import { useSyncExternalStore } from "react";

import type { Scrim, ScrimStatus } from "../scrim/type.js";

type UseScrim = {
  status: ScrimStatus;
  isReady: boolean;
};

export const useScrim = <TName extends string>(scrim: Scrim<TName>): UseScrim => {
  const status = useSyncExternalStore(scrim.subscribe, scrim.getStatus, scrim.getStatus);
  const isReady = useSyncExternalStore(scrim.subscribe, scrim.getIsReady, scrim.getIsReady);

  return { status, isReady };
};
