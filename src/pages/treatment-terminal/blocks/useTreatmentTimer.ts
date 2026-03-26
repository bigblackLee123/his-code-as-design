import { useState, useEffect, useRef, useCallback } from "react";

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function useTreatmentTimer(startTime: Date | null, running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running && startTime) {
      const calcElapsed = () => {
        const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setElapsed(Math.max(0, diff));
      };
      calcElapsed();
      intervalRef.current = setInterval(calcElapsed, 1000);
      return clearTimer;
    }
    clearTimer();
    if (!running && !startTime) setElapsed(0);
  }, [running, startTime, clearTimer]);

  const reset = useCallback(() => setElapsed(0), []);

  return { elapsed, reset };
}
