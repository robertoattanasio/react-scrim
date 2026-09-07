import { useEffect, useState } from "react";

import type { ScrimProps } from "./type.js";

import "./scrim.css";

export const Scrim = ({ until, open = false, variant, children, ...rest }: ScrimProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    Promise.resolve(until?.()).then(() => setIsReady(true));
  }, [until]);

  useEffect(() => {
    if (!open) return setIsArmed(false);

    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setIsArmed(true)));

    return () => cancelAnimationFrame(frame);
  }, [open, variant]);

  return (
    <div
      {...rest}
      inert
      aria-hidden={true}
      role="presentation"
      data-scrim=""
      data-scrim-open={!isReady || (open && isArmed) || undefined}
      data-scrim-instant={!isReady || (open && !isArmed) || undefined}
      data-scrim-ready={isReady || undefined}
      data-scrim-variant={variant}
    >
      {children}
    </div>
  );
};
