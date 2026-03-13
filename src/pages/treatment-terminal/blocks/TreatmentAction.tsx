import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Timer } from "lucide-react";
import type { TreatmentState } from "@/services/types";

export interface TreatmentActionProps {
  state: TreatmentState;
  onStart: () => void;
  onEnd: () => void;
}

/**
 * Format elapsed seconds as MM:SS or HH:MM:SS.
 * Shows HH:MM:SS when elapsed >= 1 hour.
 */
function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    const hh = String(hours).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function TreatmentAction({ state, onStart, onEnd }: TreatmentActionProps) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state.status === "treating" && state.startTime) {
      // Calculate initial elapsed from startTime
      const calcElapsed = () => {
        const diff = Math.floor((Date.now() - state.startTime!.getTime()) / 1000);
        setElapsed(Math.max(0, diff));
      };

      calcElapsed();
      intervalRef.current = setInterval(calcElapsed, 1000);

      return clearTimer;
    }

    // Not treating — clear timer and reset
    clearTimer();
    if (state.status === "idle") {
      setElapsed(0);
    }
  }, [state.status, state.startTime, clearTimer]);

  const isTreating = state.status === "treating";
  const isIdle = state.status === "idle";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Timer className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">治疗操作</span>
      </div>
      <div className="flex items-center gap-3">
        {isIdle ? (
          <Button
            size="sm"
            onClick={onStart}
            aria-label="开始治疗"
          >
            <Play className="h-3 w-3" />
            开始治疗
          </Button>
        ) : (
          <>
            {/* text-lg 用于治疗计时器，确保护士可远距离读取时间 */}
            <div className="flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1">
              <Timer className="h-4 w-4 text-primary-600 animate-pulse" />
              <span className="font-mono text-lg font-bold text-primary-700 leading-tight">
                {formatElapsedTime(elapsed)}
              </span>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={onEnd}
              disabled={!isTreating}
              aria-label="结束治疗"
            >
              <Square className="h-3 w-3" />
              结束治疗
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
