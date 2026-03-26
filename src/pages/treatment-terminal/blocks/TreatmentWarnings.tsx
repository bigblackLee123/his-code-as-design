import { Button } from "@/components/ui/button";
import { AlertTriangle, Square } from "lucide-react";

const WARNINGS = [
  "患者出现头晕、恶心",
  "患者情绪激动或哭泣不止",
  "患者心率异常升高",
  "患者主动要求停止",
];

export interface TreatmentWarningsProps {
  onEmergencyStop?: () => void;
}

export function TreatmentWarnings({ onEmergencyStop }: TreatmentWarningsProps) {
  return (
    <div className="rounded-xl bg-warning-50 border border-warning-300 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-warning-500 shrink-0" aria-hidden="true" />
        <span className="text-xs font-bold text-error-600 leading-tight">
          出现以下症状时需立即停止治疗
        </span>
      </div>
      <ul className="flex flex-col gap-0.5 mb-3">
        {WARNINGS.map((w) => (
          <li key={w} className="text-xs leading-tight text-warning-700 flex items-start gap-1">
            <span className="shrink-0">•</span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
      {onEmergencyStop && (
        <Button
          variant="destructive"
          size="lg"
          onClick={onEmergencyStop}
          className="w-full bg-error-600 hover:bg-error-700 text-white font-bold rounded-xl py-3"
          aria-label="紧急停止并生成不良事件报告"
        >
          <Square className="h-4 w-4" />
          紧急停止并生成不良事件报告
        </Button>
      )}
    </div>
  );
}
