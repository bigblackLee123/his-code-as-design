import { Badge } from "@/components/ui/badge";
import { Play, Pause, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreatmentStageHeaderProps {
  /** 面板标题，如「情志区控制面板」「运动疗愈区控制面板」 */
  title: string;
  /** 当前状态 */
  status: "idle" | "running" | "paused" | "completed";
}

const STATUS_CONFIG = {
  idle: { label: "待开始", icon: Play, className: "text-neutral-500 border-neutral-300" },
  running: { label: "进行中", icon: Play, className: "bg-success-100 text-success-700 border-success-200" },
  paused: { label: "已暂停", icon: Pause, className: "bg-warning-50 text-warning-700 border-warning-200" },
  completed: { label: "已完成", icon: CheckCircle, className: "bg-primary-50 text-primary-700 border-primary-200" },
} as const;

export function TreatmentStageHeader({ title, status }: TreatmentStageHeaderProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between px-1 py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
        <span className="text-sm font-semibold text-neutral-800 leading-tight">
          {title}
        </span>
      </div>
      <Badge variant="outline" className={cn("text-xs leading-tight", config.className)}>
        {config.label}
      </Badge>
    </div>
  );
}
