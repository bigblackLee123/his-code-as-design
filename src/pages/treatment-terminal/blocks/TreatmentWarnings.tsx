import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const WARNINGS = [
  "患者出现头晕、恶心",
  "患者情绪激动或哭泣不止",
  "患者心率异常升高",
  "患者主动要求停止",
];

export function TreatmentWarnings() {
  return (
    <Alert className="bg-warning-50 border-warning-200">
      <AlertTriangle className="h-4 w-4 text-warning-600" />
      <AlertTitle className="text-xs font-medium text-warning-700">
        出现以下症状时需立即停止治疗
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-1 flex flex-col gap-0.5">
          {WARNINGS.map((w) => (
            <li key={w} className="text-xs leading-tight text-warning-600 flex items-start gap-1">
              <span className="shrink-0">•</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
