import { useMemo } from "react";
import { MaskedText } from "@/components/his/MaskedText";
import { useHeaderSlot } from "@/components/layout/HeaderSlotContext";
import type { Patient } from "@/services/types";
import { MapPin, Activity } from "lucide-react";

export interface TreatmentHeaderSlotProps {
  region: string;
  patient: Patient;
}

/**
 * 治疗终端专用：将区域 + 患者信息注入全局 Header slot。
 * treating 状态时挂载，不渲染本地 DOM。
 */
export function TreatmentHeaderSlot({ region, patient }: TreatmentHeaderSlotProps) {
  const content = useMemo(() => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <Activity className="h-3 w-3 text-success-400 animate-pulse" aria-hidden="true" />
        <span className="text-xs text-success-300 leading-tight">治疗中</span>
      </div>
      <div className="flex items-center gap-1.5">
        <MapPin className="h-3 w-3 text-primary-300" aria-hidden="true" />
        <span className="text-xs font-medium text-white leading-tight">{region}</span>
      </div>
      <MaskedText type="name" value={patient.name} className="text-xs font-semibold text-white" />
      <span className="text-xs text-primary-300 leading-tight">
        {patient.gender === "male" ? "男" : "女"} · {patient.age}岁
      </span>
    </div>
  ), [region, patient]);

  useHeaderSlot(content);

  return null;
}
