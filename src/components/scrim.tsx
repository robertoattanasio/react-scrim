import type { CSSProperties } from "react";
import { useEffect, useEffectEvent, useState } from "react";

import type { ScrimProps } from "./type.js";

import "./scrim.css";

export const Scrim = ({
  until,
  isLoading = false,
  isReady = false,
  variant,
  durationTime,
  holdTime,
  onStatus,
  children,
  style,
  ...rest
}: ScrimProps) => {
  const [_isReady, _setIsReady] = useState(isReady);
  const [_isLoading, _setIsLoading] = useState(false);

  const isOnScreen = !_isReady || (isLoading && _isLoading);
  const [_isCovering, _setIsCovering] = useState(isOnScreen);

  const _onLoading = useEffectEvent((value: boolean) => {
    _setIsLoading(value);
    onStatus && onStatus(value ? "loading" : "idle");
  });

  const _onReady = useEffectEvent(() => {
    _setIsReady(true);
    onStatus && onStatus("ready");
  });

  const _onScreen = useEffectEvent((value: boolean) => {
    onStatus && onStatus(value ? "covering" : "uncovering");
  });

  const scrimStyle: CSSProperties = {
    ...style,
    ...(durationTime !== undefined && { "--scrim-duration": `${durationTime}ms` }),
  };

  useEffect(() => {
    if (isReady) return _onReady();

    let cancelled = false;
    Promise.resolve(until?.()).then(() => {
      if (!cancelled) _onReady();
    });

    return () => {
      cancelled = true;
    };
  }, [until, isReady]);

  useEffect(() => {
    if (!isLoading) return _onLoading(false);

    let inner: number | undefined;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => _onLoading(true));
    });

    return () => {
      cancelAnimationFrame(outer);
      if (inner !== undefined) cancelAnimationFrame(inner);
    };
  }, [isLoading, variant]);

  useEffect(() => {
    if (isOnScreen) return _setIsCovering(true);

    const timeout = window.setTimeout(() => _setIsCovering(false), holdTime ?? 0);
    return () => window.clearTimeout(timeout);
  }, [isOnScreen, holdTime]);

  useEffect(() => {
    _onScreen(_isCovering);
  }, [_isCovering]);

  return (
    <div
      {...rest}
      style={scrimStyle}
      aria-hidden={true}
      role="presentation"
      data-scrim=""
      data-scrim-open={_isCovering || undefined}
      data-scrim-instant={!_isReady || (isLoading && !_isLoading) || undefined}
      data-scrim-ready={_isReady || undefined}
      data-scrim-variant={variant}
    >
      {children}
    </div>
  );
};
