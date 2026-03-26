import { Badge } from "@/components/ui/badge";
import { useRoomComplete } from "./useRoomComplete";
import {
  CheckCircle,
  AlertTriangle,
  MapPin,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export interface RoomCompleteCheckProps {
  consultationId: string;
  region: string;
  onAllDone: () => void;
  onNextPatient: () => void;
}

export function RoomCompleteCheck({ consultationId, region, onAllDone, onNextPatient }: RoomCompleteCheckProps) {
  const { state, result, errorMsg, retry } = useRoomComplete(consultationId, region);

  // loading
  if (state === "loading") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
          <span className="text-xs text-neutral-500">正在完成本房间治疗…</span>
        </div>
      </div>
    );
  }

  // error
  if (state === "error") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-error-100 p-4">
            <AlertTriangle className="h-10 w-10 text-error-500" />
          </div>
          <span className="text-sm font-bold text-error-700">完成失败</span>
          <span className="text-xs text-neutral-500">{errorMsg}</span>
          <button
            type="button"
            onClick={retry}
            className="flex items-center gap-1 rounded-full bg-error-50 px-4 py-2 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            重试
          </button>
        </div>
      </div>
    );
  }

  // partial：还有其他房间
  if (state === "partial" && result) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 w-full max-w-lg">
          {/* 成功图标 */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-success-100 p-4">
              <CheckCircle className="h-10 w-10 text-success-500" />
            </div>
            <span className="text-sm font-bold text-success-700">
              {region} 治疗完成
            </span>
          </div>

          {/* 待前往房间 */}
          <div className="w-full rounded-xl border border-warning-200 bg-warning-50/50 p-4 flex flex-col gap-2">
            <span className="text-xs font-medium text-neutral-800 leading-tight">
              患者还需前往以下房间：
            </span>
            <div className="flex flex-col gap-2">
              {result.pendingRegions.map((r) => {
                const steps = result.pendingSteps.filter((s) => s.region === r);
                return (
                  <div key={r} className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-3 py-2">
                    <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                    <span className="text-xs font-medium text-neutral-800">{r}</span>
                    <div className="flex gap-1 flex-wrap ml-auto">
                      {steps.map((s) => (
                        <Badge key={s.id} className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-700 border-secondary-200">
                          {s.projectName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 操作按钮 */}
          <button
            type="button"
            onClick={onNextPatient}
            className="flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm px-8 py-4 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            等待下一位患者
          </button>
        </div>
      </div>
    );
  }

  // allDone：全部完成
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-success-100 p-4">
            <CheckCircle className="h-10 w-10 text-success-500" />
          </div>
          <span className="text-sm font-bold text-success-700">全部疗愈项目已完成</span>
          <span className="text-xs text-neutral-500">请继续完成治疗后数据采集</span>
        </div>

        <button
          type="button"
          onClick={onAllDone}
          className="flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm px-8 py-4 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          开始采集
        </button>
      </div>
    </div>
  );
}
