import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MaskedText } from "@/components/his/MaskedText";
import { useQueueComplete } from "./useQueueComplete";
import type { TreatmentPatient, TreatmentState, VitalSigns, ScaleResult } from "@/services/types";
import { CheckCircle, AlertTriangle, RotateCcw, Timer } from "lucide-react";

export interface QueueCompleteProps {
  patient: TreatmentPatient;
  treatmentState: TreatmentState;
  postVitals?: VitalSigns | null;
  postScaleResult?: ScaleResult | null;
  onComplete: () => void;
}

/** Format duration in seconds to a human-readable string (e.g. "12分30秒") */
function formatDuration(startTime: Date | null, endTime: Date | null): string {
  if (!startTime || !endTime) return "--";
  const totalSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}秒`;
  return `${minutes}分${seconds}秒`;
}

export function QueueComplete({ patient, treatmentState, postVitals, postScaleResult, onComplete }: QueueCompleteProps) {
  const { state, errorMsg, confirm } = useQueueComplete(patient.id);

  const handleConfirm = async () => {
    await confirm(postVitals ?? undefined, postScaleResult ?? undefined);
  };

  const preVitals = patient.vitalSigns;

  // Success view
  if (state === "success") {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <Alert>
          <CheckCircle className="h-4 w-4 text-success-500" />
          <AlertTitle className="text-xs font-medium text-success-700">出队成功</AlertTitle>
          <AlertDescription className="text-xs text-neutral-600">
            患者治疗已完成，可叫号接诊下一位患者。
          </AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onComplete} aria-label="完成出队">
            <CheckCircle className="h-3 w-3" />
            <span>完成</span>
          </Button>
        </div>
      </div>
    );
  }

  // Error view
  if (state === "error") {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-xs font-medium">出队失败</AlertTitle>
          <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleConfirm} aria-label="重试出队">
            <RotateCcw className="h-3 w-3" />
            <span>重试</span>
          </Button>
        </div>
      </div>
    );
  }

  // Confirm view (default)
  return (
    <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">出队确认</span>
      </div>

      {/* Patient summary */}
      <div className="flex flex-col gap-1 rounded-md bg-neutral-50 p-2">
        <span className="text-xs font-medium text-neutral-600 leading-tight">患者信息</span>
        <div className="grid grid-cols-2 gap-1 text-xs leading-tight">
          <div className="flex gap-1">
            <span className="text-neutral-500">姓名：</span>
            <MaskedText type="name" value={patient.name} />
          </div>
          <div className="flex gap-1">
            <span className="text-neutral-500">性别：</span>
            <span className="text-neutral-700">{patient.gender === "male" ? "男" : "女"}</span>
          </div>
        </div>
      </div>

      {/* Treatment duration */}
      <div className="flex flex-col gap-1 rounded-md bg-neutral-50 p-2">
        <span className="text-xs font-medium text-neutral-600 leading-tight">治疗时长</span>
        <div className="flex items-center gap-1 text-xs leading-tight">
          <Timer className="h-3 w-3 text-primary-500" aria-hidden="true" />
          <span className="font-mono font-medium text-neutral-800">
            {formatDuration(treatmentState.startTime, treatmentState.endTime)}
          </span>
        </div>
      </div>

      {/* Vital signs comparison */}
      <div className="flex flex-col gap-1 rounded-md bg-neutral-50 p-2">
        <span className="text-xs font-medium text-neutral-600 leading-tight">
          生理数据对比
        </span>
        <div className="grid grid-cols-4 gap-1 text-xs leading-tight">
          <span className="text-neutral-400">指标</span>
          <span className="text-neutral-400">治疗前</span>
          <span className="text-neutral-400">治疗后</span>
          <span className="text-neutral-400">变化</span>

          <span className="text-neutral-600">收缩压</span>
          <span className="font-mono text-neutral-700">{preVitals.systolicBP} mmHg</span>
          <span className="font-mono text-neutral-700">{postVitals?.systolicBP ? `${postVitals.systolicBP} mmHg` : "--"}</span>
          <span className="font-mono text-neutral-500">{postVitals?.systolicBP ? `${postVitals.systolicBP - preVitals.systolicBP}` : "--"}</span>

          <span className="text-neutral-600">舒张压</span>
          <span className="font-mono text-neutral-700">{preVitals.diastolicBP} mmHg</span>
          <span className="font-mono text-neutral-700">{postVitals?.diastolicBP ? `${postVitals.diastolicBP} mmHg` : "--"}</span>
          <span className="font-mono text-neutral-500">{postVitals?.diastolicBP ? `${postVitals.diastolicBP - preVitals.diastolicBP}` : "--"}</span>

          <span className="text-neutral-600">心率</span>
          <span className="font-mono text-neutral-700">{preVitals.heartRate} 次/分</span>
          <span className="font-mono text-neutral-700">{postVitals?.heartRate ? `${postVitals.heartRate} 次/分` : "--"}</span>
          <span className="font-mono text-neutral-500">{postVitals?.heartRate ? `${postVitals.heartRate - preVitals.heartRate}` : "--"}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="default"
          size="sm"
          onClick={handleConfirm}
          disabled={state === "loading"}
          aria-label="确认出队"
        >
          {state === "loading" ? (
            <span className="text-xs">出队中…</span>
          ) : (
            <>
              <CheckCircle className="h-3 w-3" />
              <span>确认出队</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
