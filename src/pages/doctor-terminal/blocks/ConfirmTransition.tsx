import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { useStatusTransition } from "./useStatusTransition";
import type { Patient, TherapyProject, ConsultationData } from "@/services/types";
import { TransitionResult } from "./TransitionResult";
import { ListMusic, ShieldAlert, ClipboardList, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmTransitionProps {
  patient: Patient;
  selectedProjects: TherapyProject[];
  consultationData: ConsultationData;
  onComplete: () => void;
}

type Phase = "idle" | "loading" | "success" | "error";

export function ConfirmTransition({
  patient,
  selectedProjects,
  consultationData,
  onComplete,
}: ConfirmTransitionProps) {
  const { state, queueItem, errorMsg, confirm } = useStatusTransition(patient.id, selectedProjects);
  const [btnPhase, setBtnPhase] = useState<"idle" | "shrink" | "check" | "done">("idle");

  const phase: Phase =
    state === "loading" ? "loading" :
    state === "success" ? "success" :
    state === "error" ? "error" : "idle";

  const handleConfirm = async () => {
    setBtnPhase("shrink");
    await confirm();
    setTimeout(() => setBtnPhase("check"), 300);
    setTimeout(() => setBtnPhase("done"), 900);
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        {phase === "success" && (
          <TransitionResult
            type="success"
            queueNumber={queueItem?.queueNumber}
            onComplete={onComplete}
            onRetry={() => {}}
          />
        )}

        {phase === "error" && (
          <TransitionResult
            type="error"
            errorMsg={errorMsg}
            onComplete={onComplete}
            onRetry={() => { setBtnPhase("idle"); confirm(); }}
          />
        )}

        {/* 正常态：摘要卡片 */}
        {(phase === "idle" || phase === "loading") && (
          <>
            {/* 患者信息 */}
            <div className="w-full rounded-xl border border-primary-200 bg-primary-50/50 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MaskedText type="name" value={patient.name} className="text-sm font-semibold text-neutral-800" />
                <Badge variant="outline" className="text-xs px-1.5 py-0 text-primary-600 border-primary-200 bg-primary-50">
                  {patient.gender === "male" ? "男" : "女"} · {patient.age}岁
                </Badge>
              </div>
            </div>

            {/* 已选配方 */}
            <div className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <ListMusic className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                <span className="text-xs font-medium text-neutral-800 leading-tight">
                  已选 {selectedProjects.length} 个疗愈项目
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedProjects.map((p) => (
                  <Badge key={p.id} className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-700 border-secondary-200">
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 禁忌症 + 量表 横排 */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-warning-200 bg-warning-50/50 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4 text-warning-500" aria-hidden="true" />
                  <span className="text-xs font-medium text-neutral-800 leading-tight">禁忌症</span>
                </div>
                {consultationData.contraindications.length === 0 ? (
                  <span className="text-xs text-neutral-400 leading-tight">无</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {consultationData.contraindications.map((c) => (
                      <Badge key={c.code} className="text-xs px-1.5 py-0 bg-warning-50 text-warning-700 border-warning-200">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-success-200 bg-success-50/50 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4 text-success-500" aria-hidden="true" />
                  <span className="text-xs font-medium text-neutral-800 leading-tight">量表评估</span>
                </div>
                {!consultationData.scaleResults ? (
                  <span className="text-xs text-neutral-400 leading-tight">未评估</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-success-700 leading-none">
                      {consultationData.scaleResults.totalScore ?? "—"}
                    </span>
                    <span className="text-xs text-neutral-400">分</span>
                  </div>
                )}
              </div>
            </div>

            {/* 确认按钮 */}
            <button
              type="button"
              disabled={btnPhase !== "idle" || phase === "loading"}
              onClick={handleConfirm}
              className={cn(
                "flex items-center justify-center gap-2 text-sm font-medium text-white transition-all duration-300 mt-2",
                btnPhase === "idle" && "rounded-xl bg-primary-600 hover:bg-primary-700 px-8 py-4",
                btnPhase === "shrink" && "rounded-full bg-primary-600 w-12 h-12 px-0 py-0",
                btnPhase === "check" && "rounded-full bg-success-500 w-12 h-12 px-0 py-0",
                btnPhase === "done" && "rounded-xl bg-success-500 px-8 py-4",
              )}
              aria-label="确认流转"
            >
              {btnPhase === "idle" && (
                <>
                  <Send className="h-4 w-4" />
                  确认流转至治疗队列
                </>
              )}
              {btnPhase === "shrink" && <span className="opacity-0">·</span>}
              {btnPhase === "check" && <Check className="h-5 w-5 animate-bounce" />}
              {btnPhase === "done" && (
                <>
                  <Check className="h-4 w-4" />
                  流转成功
                </>
              )}
            </button>

            {btnPhase === "done" && (
              <button
                type="button"
                onClick={onComplete}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors mt-2"
              >
                返回候诊队列
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
