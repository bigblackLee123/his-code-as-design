import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { useQueueComplete } from "./useQueueComplete";
import type { TreatmentPatient, TreatmentState, VitalSigns, ScaleResult } from "@/services/types";
import {
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ListMusic,
  Timer,
  HeartPulse,
  Send,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface QueueCompleteProps {
  patient: TreatmentPatient;
  treatmentState: TreatmentState;
  postVitals?: VitalSigns | null;
  postScaleResult?: ScaleResult | null;
  onComplete: () => void;
}

function formatDuration(startTime: Date | null, endTime: Date | null): string {
  if (!startTime || !endTime) return "--";
  const s = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m === 0 ? `${sec}秒` : `${m}分${sec}秒`;
}

export function QueueComplete({ patient, treatmentState, postVitals, postScaleResult, onComplete }: QueueCompleteProps) {
  const { state, errorMsg, confirm } = useQueueComplete(patient.id);
  const [btnPhase, setBtnPhase] = useState<"idle" | "shrink" | "check" | "done">("idle");

  const handleConfirm = async () => {
    setBtnPhase("shrink");
    await confirm(postVitals ?? undefined, postScaleResult ?? undefined);
    setTimeout(() => setBtnPhase("check"), 300);
    setTimeout(() => setBtnPhase("done"), 900);
  };

  // 成功态
  if (state === "success" || btnPhase === "done") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-success-100 p-4">
            <CheckCircle className="h-10 w-10 text-success-500" />
          </div>
          <span className="text-sm font-bold text-success-700">出队成功</span>
          <span className="text-xs text-neutral-500">患者治疗已完成，可接诊下一位</span>
          <button
            type="button"
            onClick={onComplete}
            className="flex items-center gap-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm px-6 py-3 mt-4 transition-colors"
          >
            返回治疗队列
          </button>
        </div>
      </div>
    );
  }

  // 错误态
  if (state === "error") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-error-100 p-4">
            <AlertTriangle className="h-10 w-10 text-error-500" />
          </div>
          <span className="text-sm font-bold text-error-700">出队失败</span>
          <span className="text-xs text-neutral-500">{errorMsg}</span>
          <button
            type="button"
            onClick={() => { setBtnPhase("idle"); handleConfirm(); }}
            className="flex items-center gap-1 rounded-full bg-error-50 px-4 py-2 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            重试
          </button>
        </div>
      </div>
    );
  }

  const preVitals = patient.vitalSigns;

  // 确认态：跟 ConfirmTransition 一样的全屏居中卡片
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        {/* 患者信息 */}
        <div className="w-full rounded-xl border border-primary-200 bg-primary-50/50 p-4 flex items-center gap-2">
          <MaskedText type="name" value={patient.name} className="text-sm font-semibold text-neutral-800" />
          <Badge variant="outline" className="text-xs px-1.5 py-0 text-primary-600 border-primary-200 bg-primary-50">
            {patient.gender === "male" ? "男" : "女"} · {patient.age}岁
          </Badge>
        </div>

        {/* 疗愈项目 */}
        <div className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <ListMusic className="h-4 w-4 text-secondary-500" />
            <span className="text-xs font-medium text-neutral-800 leading-tight">
              已完成 {patient.projects.length} 个疗愈项目
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {patient.projects.map((p) => (
              <Badge key={p.id} className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-700 border-secondary-200">
                {p.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* 治疗时长 + 生理数据对比 横排 */}
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4 text-primary-500" />
              <span className="text-xs font-medium text-neutral-800 leading-tight">治疗时长</span>
            </div>
            <span className="text-lg font-bold text-primary-700 leading-none">
              {formatDuration(treatmentState.startTime, treatmentState.endTime)}
            </span>
          </div>
          <div className="rounded-xl border border-success-200 bg-success-50/50 p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <HeartPulse className="h-4 w-4 text-success-500" />
              <span className="text-xs font-medium text-neutral-800 leading-tight">生理数据</span>
            </div>
            {postVitals ? (
              <div className="flex flex-col gap-0.5 text-xs leading-tight">
                <span className="text-neutral-600">
                  心率 {preVitals.heartRate} → {postVitals.heartRate}
                </span>
                <span className="text-neutral-600">
                  血压 {preVitals.systolicBP}/{preVitals.diastolicBP} → {postVitals.systolicBP}/{postVitals.diastolicBP}
                </span>
              </div>
            ) : (
              <span className="text-xs text-neutral-400">未录入</span>
            )}
          </div>
        </div>

        {/* 确认按钮 */}
        <button
          type="button"
          disabled={btnPhase !== "idle" || state === "loading"}
          onClick={handleConfirm}
          className={cn(
            "flex items-center justify-center gap-2 text-sm font-medium text-white transition-all duration-300 mt-2",
            btnPhase === "idle" && "rounded-xl bg-primary-600 hover:bg-primary-700 px-8 py-4",
            btnPhase === "shrink" && "rounded-full bg-primary-600 w-12 h-12 px-0 py-0",
            btnPhase === "check" && "rounded-full bg-success-500 w-12 h-12 px-0 py-0",
          )}
          aria-label="确认出队"
        >
          {btnPhase === "idle" && (
            <>
              <Send className="h-4 w-4" />
              确认出队
            </>
          )}
          {btnPhase === "shrink" && <span className="opacity-0">·</span>}
          {btnPhase === "check" && <Check className="h-5 w-5 animate-bounce" />}
        </button>
      </div>
    </div>
  );
}
