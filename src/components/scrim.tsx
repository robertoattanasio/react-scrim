import type { ScrimProps, ScrimStyle } from "./type.js";

import { useReactScrim } from "./use_scrim.js";

import "./scrim.css";

export const Scrim = ({ children, style, ...rest }: ScrimProps) => {
  const { phase, isOpening, isOpen, isHolding, isReady, duration } = useReactScrim();

  const scrimStyle: ScrimStyle = {
    ...style,
    "--scrim-duration": `${duration}ms`,
  };

  return (
    <div
      {...rest}
      aria-hidden={true}
      role="presentation"
      style={scrimStyle}
      data-scrim=""
      data-scrim-phase={phase}
      data-scrim-open={isOpening || isOpen || isHolding || undefined}
      data-scrim-instant={(!isReady && isOpen) || undefined}
      data-scrim-ready={isReady || undefined}
    >
      {children}
    </div>
  );
};
