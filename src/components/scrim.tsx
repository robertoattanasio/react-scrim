import { useEffect, useEffectEvent, useState } from "react";

import type { ScrimProps } from "./type.js";

import "./scrim.css";

export const Scrim = ({
  until,
  isLoading = false,
  isReady = false,
  variant,
  onReady,
  onLoading,
  onScreen,
  children,
  ...rest
}: ScrimProps) => {
  const [_isReady, _setIsReady] = useState(isReady);
  const [_isLoading, _setIsLoading] = useState(false);

  const _onLoading = useEffectEvent((value: boolean) => {
    _setIsLoading(value);
    onLoading && onLoading(value);
  });

  const _onReady = useEffectEvent(() => {
    _setIsReady(true);
    onReady && onReady();
  });

  const _onScreen = useEffectEvent((value: boolean) => {
    onScreen && onScreen(value);
  });

  const isOnScreen = !_isReady || (isLoading && _isLoading);

  useEffect(() => {
    if (isReady) return _onReady();
    Promise.resolve(until?.()).then(_onReady);
  }, [until, isReady]);

  useEffect(() => {
    if (!isLoading) return _onLoading(false);
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => _onLoading(true)));
    return () => cancelAnimationFrame(frame);
  }, [isLoading, variant]);

  useEffect(() => {
    _onScreen(isOnScreen);
  }, [isOnScreen]);

  return (
    <div
      {...rest}
      aria-hidden={true}
      role="presentation"
      data-scrim=""
      data-scrim-open={isOnScreen || undefined}
      data-scrim-instant={!_isReady || (isLoading && !_isLoading) || undefined}
      data-scrim-ready={_isReady || undefined}
      data-scrim-variant={variant}
    >
      {children}
    </div>
  );
};
