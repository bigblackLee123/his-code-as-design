import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { hasVitalSignsAlert, validateVitalSigns } from "@/lib/vitalSignsValidation";
import { VITAL_SIGNS_RULES } from "@/services/types";
import type { TreatmentPatient } from "@/services/types";
import { Users, HeartPulse, AlertTriangle, Music, MapPin, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreatmentPatientViewProps {
  patient: TreatmentPatient;
}

export function TreatmentPatientView({ patient }: TreatmentPatientViewProps) {
  const { vitalSigns, contraindications, therapyPackage } = patient;
  const { alerts } = validateVitalSigns(vitalSigns);
  const showGlobalAlert = hasVitalSignsAlert(vitalSigns);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
      {/* 基本信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <MaskedText type="name" value={patient.name} className="text-xs font-semibold text-neutral-800" />
          <span className="text-xs text-neutral-500 leading-tight">
            {patient.gender === "male" ? "男" : "女"} · {patient.age}岁
          </span>
        </div>
        {showGlobalAlert && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700 animate-pulse">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            生理数据异常
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 text-xs leading-tight">
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">医保卡号：</span>
          <span className="font-mono text-neutral-700">{patient.insuranceCardNo}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">身份证：</span>
          <MaskedText type="idNumber" value={patient.idNumber} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">电话：</span>
          <MaskedText type="phone" value={patient.phone} />
        </div>
      </div>

      {/* 生理数据 */}
      <div className="flex items-center gap-4 rounded-md bg-neutral-50 px-2 py-1 text-xs leading-tight">
        <HeartPulse
          className={cn("h-4 w-4 shrink-0", showGlobalAlert ? "text-error-500" : "text-primary-500")}
          aria-hidden="true"
        />
        {(["systolicBP", "diastolicBP", "heartRate"] as const).map((field) => {
          const rule = VITAL_SIGNS_RULES[field];
          const isAlert = !!alerts[field];
          return (
            <div key={field} className="flex items-center gap-1">
              <span className="text-neutral-500">{rule.label}：</span>
              <span className={cn("font-mono font-medium", isAlert ? "text-error-600" : "text-neutral-700")}>
                {vitalSigns[field]}
              </span>
              <span className="text-neutral-400">{rule.unit}</span>
              {isAlert && <AlertTriangle className="h-3 w-3 text-error-500 animate-pulse" aria-label={`${rule.label}异常`} />}
            </div>
          );
        })}
      </div>

      {/* 禁忌症 */}
      {contraindications.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <AlertTriangle className="h-3 w-3 text-warning-500 shrink-0" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-600 leading-tight shrink-0">禁忌症：</span>
          {contraindications.map((item) => (
            <Badge key={item.code} variant="outline" className="text-xs leading-tight bg-warning-50 text-warning-700 border-warning-200">
              {item.name}
            </Badge>
          ))}
        </div>
      )}

      {/* 疗愈套餐 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <Music className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">
            疗愈套餐：{therapyPackage.name}
          </span>
          <Badge variant="outline" className="text-xs leading-tight ml-1">
            {therapyPackage.projects.length} 个项目
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          {therapyPackage.projects.map((proj, idx) => (
            <div key={proj.id} className="flex items-center gap-2 rounded-md bg-neutral-50 px-2 py-1 text-xs leading-tight">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 shrink-0">
                {idx + 1}
              </span>
              <span className="font-medium text-neutral-800">{proj.name}</span>
              <Badge variant="outline" className="text-xs leading-tight px-1 py-0">
                <MapPin className="h-3 w-3 mr-0.5" />
                {proj.region}
              </Badge>
              {proj.hasGuidance && (
                <Badge className="text-xs leading-tight px-1 py-0 bg-success-50 text-success-700 border-success-200">
                  <MessageSquare className="h-3 w-3 mr-0.5" />
                  有引导语
                </Badge>
              )}
              {proj.bpm && <span className="text-neutral-500">{proj.bpm} BPM</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
