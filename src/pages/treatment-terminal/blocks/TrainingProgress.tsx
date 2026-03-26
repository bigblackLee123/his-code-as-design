import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  label: string;
  bpm: number;
}

const STAGES: Stage[] = [
  { label: "热身", bpm: 60 },
  { label: "基础", bpm: 70 },
  { label: "强化", bpm: 80 },
  { label: "放松", bpm: 60 },
];

export interface TrainingProgressProps {
  /** 当前阶段索引 (0-3)，-1 表示未开始 */
  currentStage?: number;
}

export function TrainingProgress({ currentStage = 0 }: TrainingProgressProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-3">
      <span className="text-xs font-medium text-neutral-500 leading-tight">训练进度</span>
      <div className="flex items-center gap-1">
        {STAGES.map((stage, idx) => (
          <div key={stage.label} className="flex items-center gap-1">
            <div
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium leading-tight transition-colors",
                idx === currentStage
                  ? "bg-success-500 text-white"
                  : idx < currentStage
                    ? "bg-success-100 text-success-700"
                    : "bg-neutral-100 text-neutral-500"
              )}
            >
              {stage.label}({stage.bpm})
            </div>
            {idx < STAGES.length - 1 && (
              <ArrowRight className="h-3 w-3 text-neutral-300 shrink-0" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
