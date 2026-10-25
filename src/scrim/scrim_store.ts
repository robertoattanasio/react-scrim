import type { SyntheticEvent } from "react";

import type { ScrimCurtain, ScrimOptions, ScrimPhase, ScrimProps, ScrimState } from "./type.js";

export type ScrimLayer<TMeta> = {
  id: number;
  curtain: ScrimCurtain<TMeta>;
  options: ScrimOptions<TMeta>;
  meta: Readonly<TMeta>;
  phase: ScrimPhase;
  done: (event?: SyntheticEvent) => void;
  scrim: ScrimProps<TMeta>["scrim"];
};

export type ScrimStore<TMeta> = ReturnType<typeof createScrimStore<TMeta>>;

const layerPhased = <TMeta>(layer: ScrimLayer<TMeta>, phase: ScrimPhase): ScrimLayer<TMeta> => ({
  ...layer,
  phase,
  scrim: { phase, meta: layer.meta, done: layer.done },
});

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const createScrimStore = <TMeta>(initial?: ScrimCurtain<TMeta>, initialOptions: ScrimOptions<TMeta> = {}) => {
  const listeners = new Set<() => void>();
  const finishers = new Map<number, () => void>();
  const covering = new Map<number, Promise<void>>();

  let nextId = 0;
  let run = 0;
  let hasStarted = false;

  const metaDefault = initialOptions.meta as TMeta;

  const layerCreate = (
    component: ScrimCurtain<TMeta>,
    options: ScrimOptions<TMeta>,
    phase: ScrimPhase,
  ): ScrimLayer<TMeta> => {
    const id = nextId++;

    const done = (event?: SyntheticEvent) => {
      if (event && event.target !== event.currentTarget) return;

      finishers.get(id)?.();
    };

    const meta = options.meta ?? metaDefault;

    return { id, curtain: component, options, meta, phase, done, scrim: { phase, meta, done } };
  };

  let layers: ScrimLayer<TMeta>[] = initial ? [layerCreate(initial, initialOptions, "covered")] : [];
  let state: ScrimState<TMeta> = { status: layers.at(-1)?.phase ?? "idle", meta: layers.at(-1)?.meta ?? metaDefault };

  const notify = () => listeners.forEach((listener) => listener());

  const setLayers = (next: ScrimLayer<TMeta>[]) => {
    layers = next;

    const top = layers.at(-1);
    const status = top?.phase ?? "idle";
    const meta = top?.meta ?? state.meta;

    if (status !== state.status || meta !== state.meta) state = { status, meta };

    notify();
  };

  const phaseSet = (layer: ScrimLayer<TMeta>, phase: ScrimPhase) => {
    const next = layerPhased(layer, phase);

    setLayers(layers.map((item) => (item.id === layer.id ? next : item)));

    return next;
  };

  const finished = (id: number) =>
    new Promise<void>((resolve) =>
      finishers.set(id, () => {
        finishers.delete(id);
        resolve();
      }),
    );

  const cover = (component: ScrimCurtain<TMeta>, options: ScrimOptions<TMeta> = {}) => {
    run += 1;

    const layer = layerCreate(component, options, "entering");
    const entered = finished(layer.id);

    setLayers([...layers, layer]);

    const covered = entered.then(() => {
      covering.delete(layer.id);

      const top = layers.at(-1);

      if (top?.id !== layer.id) return;

      layers.slice(0, -1).forEach((below) => finishers.get(below.id)?.());
      setLayers([layerPhased(top, "covered")]);
    });

    covering.set(layer.id, covered);

    return covered;
  };

  const uncover = async () => {
    let top = layers.at(-1);

    if (!top) return;

    await covering.get(top.id);

    top = layers.at(-1);
    if (!top || top.phase !== "covered") return;

    const id = ++run;
    const { hold = 0, until } = top.options;

    await until?.();
    await wait(hold);
    if (id !== run) return;

    const left = finished(top.id);

    phaseSet(top, "leaving");
    await left;

    if (id === run) setLayers([]);
  };

  const start = () => {
    if (hasStarted) return;
    hasStarted = true;

    void uncover();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getLayers = (): readonly ScrimLayer<TMeta>[] => layers;
  const getState = () => state;

  return { cover, uncover, start, subscribe, getLayers, getState };
};
