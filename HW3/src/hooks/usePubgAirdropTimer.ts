
import { useEffect, useState } from "react";

export function usePubgAirdropTimer(
  targetEpochMs: number,
  serverOffsetMs = 0,
) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs)),
  );

  useEffect(() => {
    const syncClock = () => {
      const remaining = Math.max(
        0,
        targetEpochMs - (Date.now() + serverOffsetMs),
      );

      setRemainingMs(remaining);
    };

    syncClock();

    const timerId = window.setInterval(syncClock, 200);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncClock();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [targetEpochMs, serverOffsetMs]);

  return {
    remainingMs,
    isLive: remainingMs === 0,
  };
}
