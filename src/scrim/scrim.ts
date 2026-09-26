import type { CreateScrimOptions, Scrim, ScrimNodes, ScrimPlay, ScrimStatus } from "./type.js";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const createScrim = <TName extends string>({
  nodes: names,
  initial = "covered",
  animation,
  hold = 0,
  until,
  enter,
  leave,
}: CreateScrimOptions<TName>): Scrim<TName> => {
  const nodes = {} as ScrimNodes<TName>;
  const refs = new Map<TName, ReturnType<Scrim<TName>["node"]>>();
  const listeners = new Set<() => void>();

  let status: ScrimStatus = initial;
  let isReady = false;
  let hasStarted = false;
  let run = 0;
  let covering: Promise<void> = Promise.resolve();
  let markReady = () => {};
  const ready = new Promise<void>((resolve) => (markReady = resolve));

  const notify = () => listeners.forEach((listener) => listener());

  const setStatus = (next: ScrimStatus) => {
    status = next;
    notify();
  };

  const play: ScrimPlay = (element, keyframes, options) => {
    element.getAnimations().forEach((running) => {
      running.commitStyles();
      running.cancel();
    });

    return element.animate(keyframes, { fill: "both", ...animation, ...options }).finished;
  };

  const cover = () => {
    if (typeof document === "undefined") return;
    if (status === "covered" || status === "entering") return covering;

    const id = ++run;
    const from = status;

    setStatus("entering");
    covering = Promise.resolve(enter(nodes, { play, status: from })).then(() => {
      if (id === run) setStatus("covered");
    });

    return covering;
  };

  const uncover = async () => {
    await ready;
    if (status === "entering") await covering;
    if (status !== "covered") return;

    const id = ++run;
    await wait(hold);
    if (id !== run) return;

    setStatus("leaving");
    await leave(nodes, { play });
    if (id === run) setStatus("idle");
  };

  const reset = () => {
    run += 1;
    setStatus(initial);
  };

  const start = () => {
    if (hasStarted) return;
    hasStarted = true;

    Promise.resolve(until?.(nodes, { play })).then(() => {
      isReady = true;
      notify();
      markReady();
      void uncover();
    });
  };

  const node = (name: TName) => {
    const existing = refs.get(name);
    if (existing) return existing;

    const ref = (element: HTMLElement | null) => {
      if (!element) return;

      nodes[name] = element;
      if (names.every((key) => nodes[key])) start();

      return () => {
        if (nodes[name] !== element) return;

        delete nodes[name];
        queueMicrotask(() => {
          if (!nodes[name]) reset();
        });
      };
    };

    refs.set(name, ref);
    return ref;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getStatus = () => status;
  const getIsReady = () => isReady;

  return { node, cover, uncover, subscribe, getStatus, getIsReady };
};
