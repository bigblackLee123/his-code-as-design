import { Timer, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTreatmentTimer, formatElapsedTime } from "./useTreatmentTimer";
import { cn } from "@/lib/utils";

export interface SessionTimerProps {
  startTime: Date | null;
  running: boolean;
  totalDuration?: number;
  onSkip?: () => void;
  className?: string;
}

function formatTotal(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function SessionTimer({
  startTime,
  running,
  totalDuration = 1500,
  onSkip,
  className,
}: SessionTimerProps) {
  const { elapsed } = useTreatmentTimer(startTime, running);

  return (
    <div className={cn("flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-3", className)}>
      <div className="flex items-center gap-1">
        <Timer className="h-3 w-3 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-500 leading-tight">执行时长</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-neutral-800 leading-tight font-mono">
          {formatElapsedTime(elapsed)}
        </span>
        <span className="text-xs text-neutral-400 leading-tight font-mono">
          / {formatTotal(totalDuration)}
        </span>
      </div>
      {onSkip && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSkip}
          className="mt-1 text-xs"
          aria-label="跳转"
        >
          <SkipForward className="h-3 w-3" />
          跳转
        </Button>
      )}
    </div>
  );
}
