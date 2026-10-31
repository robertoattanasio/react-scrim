import { createContext, useContext, useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { createScrimStore } from "./scrim_store.js";
import type { ScrimStore } from "./scrim_store.js";
import type { Scrim, ScrimCurtain, ScrimOptions } from "./type.js";

export const createScrim = <TMeta = undefined,>(
  initial?: ScrimCurtain<TMeta>,
  options?: ScrimOptions<TMeta>,
): Scrim<TMeta> => {
  const StoreContext = createContext<ScrimStore<TMeta> | null>(null);

  let mounted: ScrimStore<TMeta> | null = null;

  const Root = ({ children }: { children: ReactNode }) => {
    const [store] = useState(() => createScrimStore<TMeta>(initial, options));
    const layers = useSyncExternalStore(store.subscribe, store.getLayers, store.getLayers);

    useLayoutEffect(() => {
      mounted = store;

      return () => {
        if (mounted === store) mounted = null;
      };
    }, [store]);

    useEffect(() => store.start(), [store]);

    return (
      <StoreContext value={store}>
        {children}
        {layers.map(({ id, curtain: Curtain, scrim }) => (
          <Curtain key={id} scrim={scrim} />
        ))}
      </StoreContext>
    );
  };

  const cover = (curtain: ScrimCurtain<TMeta>, coverOptions?: ScrimOptions<TMeta>) =>
    mounted?.cover(curtain, coverOptions) ?? Promise.resolve();

  const uncover = () => mounted?.uncover() ?? Promise.resolve();

  const getStatus = () => mounted?.getState();

  const useStatus = () => {
    const store = useContext(StoreContext);

    if (!store) throw new Error("useStatus must be used inside its scrim Root.");

    return useSyncExternalStore(store.subscribe, store.getState, store.getState);
  };

  return { Root, cover, uncover, getStatus, useStatus };
};
