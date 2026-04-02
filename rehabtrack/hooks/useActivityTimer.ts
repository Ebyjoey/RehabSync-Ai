import { useEffect, useRef, useCallback } from "react";
import { useActivityStore } from "@/store";

/**
 * Drives the elapsed-seconds counter while a session is active.
 * Mount this hook in any component that needs the timer to tick.
 */
export function useActivityTimer() {
  const { isTracking, currentSession, updateElapsed } = useActivityStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    if (!currentSession) return;
    const seconds = Math.floor(
      (Date.now() - currentSession.startTime) / 1000
    );
    updateElapsed(seconds);
  }, [currentSession, updateElapsed]);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking, tick]);
}
