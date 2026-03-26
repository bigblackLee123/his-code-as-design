import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { usePatientVitals } from "./usePatientVitals";
import { hasVitalSignsAlert, validateVitalSigns } from "@/lib/vitalSignsValidation";
import { VITAL_SIGNS_RULES } from "@/services/types";
import type { Patient } from "@/services/types";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PatientInfoCardProps {
  patient: Patient;
  className?: string;
}

/** 小波形装饰：4 根竖条模拟心电图 */
function WaveDecor({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-0.5", className)} aria-hidden="true">
      <span className="w-1 h-2 rounded-full bg-current opacity-40" />
      <span className="w-1 h-4 rounded-full bg-current opacity-60" />
      <span className="w-1 h-3 rounded-full bg-current opacity-80" />
      <span className="w-1 h-5 rounded-full bg-current" />
      <span className="w-1 h-2 rounded-full bg-current opacity-60" />
      <span className="w-1 h-4 rounded-full bg-current opacity-40" />
    </div>
  );
}

export function PatientInfoCard({ patient, className }: PatientInfoCardProps) {
  const { vitalSigns } = usePatientVitals(patient.id);
  const alerts = vitalSigns ? validateVitalSigns(vitalSigns).alerts : {};
  const showGlobalAlert = vitalSigns ? hasVitalSignsAlert(vitalSigns) : false;

  return (
    <div
      className={cn("flex flex-col gap-3 rounded-xl border border-primary-200 bg-primary-50/50 p-3", className)}
    >
        {/* 标题行 — 与禁忌症标题行风格对齐：图标+文字左对齐 */}
        <div className="flex items-center gap-1">
          <Activity
            className={cn(
              "h-4 w-4",
              showGlobalAlert ? "text-error-500" : "text-success-500"
            )}
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-neutral-800 leading-tight">患者状态看板</span>
        </div>

        {/* 患者基本信息 */}
        <div className="flex items-center gap-2">
          <MaskedText type="name" value={patient.name} className="text-sm font-semibold text-neutral-800" />
          <Badge variant="outline" className="text-xs px-1.5 py-0 text-primary-600 border-primary-200 bg-primary-50">
            {patient.gender === "male" ? "男" : "女"} · {patient.age}岁
          </Badge>
        </div>

        {/* 生理数据 */}
        {vitalSigns && (
          <div className="flex flex-col gap-3">
            {/* 心率 — 紫色 */}
            <div>
              <span className="text-xs text-neutral-500 leading-tight">
                {VITAL_SIGNS_RULES.heartRate.label}
              </span>
              <div className="flex items-end justify-between mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "text-2xl font-black leading-none",
                    alerts.heartRate ? "text-error-600" : "text-primary-700"
                  )}>
                    {vitalSigns.heartRate}
                  </span>
                  <span className="text-xs text-neutral-400">{VITAL_SIGNS_RULES.heartRate.unit}</span>
                </div>
                <WaveDecor className={alerts.heartRate ? "text-error-400" : "text-primary-400"} />
              </div>
            </div>

            {/* 收缩压 — 蓝绿色 */}
            <div>
              <span className="text-xs text-neutral-500 leading-tight">
                {VITAL_SIGNS_RULES.systolicBP.label}
              </span>
              <div className="flex items-end justify-between mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "text-2xl font-black leading-none",
                    alerts.systolicBP ? "text-error-600" : "text-success-700"
                  )}>
                    {vitalSigns.systolicBP}
                  </span>
                  <span className="text-xs text-neutral-400">{VITAL_SIGNS_RULES.systolicBP.unit}</span>
                </div>
                <WaveDecor className={alerts.systolicBP ? "text-error-400" : "text-success-400"} />
              </div>
            </div>

            {/* 舒张压 — 蓝绿色 */}
            <div>
              <span className="text-xs text-neutral-500 leading-tight">
                {VITAL_SIGNS_RULES.diastolicBP.label}
              </span>
              <div className="flex items-end justify-between mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "text-2xl font-black leading-none",
                    alerts.diastolicBP ? "text-error-600" : "text-success-700"
                  )}>
                    {vitalSigns.diastolicBP}
                  </span>
                  <span className="text-xs text-neutral-400">{VITAL_SIGNS_RULES.diastolicBP.unit}</span>
                </div>
                <WaveDecor className={alerts.diastolicBP ? "text-error-400" : "text-success-400"} />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
