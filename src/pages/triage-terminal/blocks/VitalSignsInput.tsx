import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useVitalSignsInput } from "./useVitalSignsInput";
import { VITAL_SIGNS_RULES, VITAL_SIGNS_ALERT_THRESHOLDS } from "@/services/types";
import type { Patient, VitalSigns } from "@/services/types";
import { HeartPulse, AlertTriangle, Save } from "lucide-react";

export interface VitalSignsInputProps {
  patient: Patient;
  onSave: (vitals: VitalSigns) => void;
}

type VitalField = "systolicBP" | "diastolicBP" | "heartRate";

const FIELDS: { key: VitalField; label: string; unit: string }[] = [
  { key: "systolicBP", label: VITAL_SIGNS_RULES.systolicBP.label, unit: VITAL_SIGNS_RULES.systolicBP.unit },
  { key: "diastolicBP", label: VITAL_SIGNS_RULES.diastolicBP.label, unit: VITAL_SIGNS_RULES.diastolicBP.unit },
  { key: "heartRate", label: VITAL_SIGNS_RULES.heartRate.label, unit: VITAL_SIGNS_RULES.heartRate.unit },
];

export function VitalSignsInput({ patient, onSave }: VitalSignsInputProps) {
  const { values, validation, saving, canSave, handleChange, handleSave } = useVitalSignsInput(patient.id, onSave);

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-primary-500" />
          生理数据采集
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          {FIELDS.map(({ key, label, unit }) => {
            const error = validation.errors[key];
            const isAlert = validation.alerts[key];
            const threshold = VITAL_SIGNS_ALERT_THRESHOLDS[key];
            const rule = VITAL_SIGNS_RULES[key];

            return (
              <div key={key} className="flex flex-col gap-1">
                <Label
                  htmlFor={`vital-${key}`}
                  className={cn(
                    "text-xs leading-tight",
                    isAlert ? "text-error-600 font-medium" : "text-neutral-600"
                  )}
                >
                  {label}
                  <span className="text-neutral-400 font-normal">（{unit}）</span>
                  {isAlert && (
                    <AlertTriangle className="h-3 w-3 text-error-500 animate-pulse" />
                  )}
                </Label>
                <Input
                  id={`vital-${key}`}
                  type="text"
                  inputMode="numeric"
                  placeholder={`${rule.min}-${rule.max}`}
                  value={values[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  aria-invalid={!!error || undefined}
                  className={cn(
                    "text-xs leading-tight h-7",
                    isAlert && "border-error-400 ring-2 ring-error-200"
                  )}
                />
                {error && (
                  <span className="text-xs text-error-600 leading-tight">{error}</span>
                )}
                {isAlert && !error && (
                  <span className="text-xs text-error-600 leading-tight flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    异常：超过 {threshold} {unit}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={!canSave || saving}>
            <Save className="h-3 w-3" />
            {saving ? "保存中..." : "保存生理数据"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
