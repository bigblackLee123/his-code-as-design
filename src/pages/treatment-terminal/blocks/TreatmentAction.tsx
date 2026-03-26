import { Button } from "@/components/ui/button";
import { Play, Square, Timer, Music } from "lucide-react";
import { useTreatmentTimer, formatElapsedTime } from "./useTreatmentTimer";
import type { TreatmentState } from "@/services/types";

export interface TreatmentActionProps {
  state: TreatmentState;
  onStart: () => void;
  onEnd: () => void;
}

export function TreatmentAction({ state, onStart, onEnd }: TreatmentActionProps) {
  const { elapsed } = useTreatmentTimer(state.startTime, state.status === "treating");

  const isTreating = state.status === "treating";
  const isIdle = state.status === "idle";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">治疗操作</span>
        </div>
        {isTreating && (
          <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
            闭环调控中
          </span>
        )}
      </div>

      {isIdle ? (
        <Button size="sm" onClick={onStart} aria-label="开始治疗">
          <Play className="h-3 w-3" />
          开始治疗
        </Button>
      ) : (
        <div className="flex flex-col gap-4">
          {/* 计时器 + 控制 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2">
              <Timer className="h-4 w-4 text-primary-600 animate-pulse" />
              {/* text-lg 用于治疗计时器，确保护士可远距离读取时间 */}
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
          </div>

          {/* 脉冲动画圆 — demo 核心视觉 */}
          {isTreating && (
            <div className="flex items-center justify-center py-6 bg-primary-50 rounded-3xl border border-primary-100">
              <div className="relative">
                <div className="absolute inset-0 m-auto h-28 w-28 rounded-full bg-primary-500 animate-ping opacity-20" />
                <div className="relative h-28 w-28 rounded-full bg-primary-600 flex items-center justify-center shadow-2xl">
                  <Music className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
