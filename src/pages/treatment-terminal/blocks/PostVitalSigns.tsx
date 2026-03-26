import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePostVitals } from "./usePostVitals";
import { VITAL_SIGNS_RULES, VITAL_SIGNS_ALERT_THRESHOLDS } from "@/services/types";
import type { VitalSigns } from "@/services/types";
import { HeartPulse, AlertTriangle, Save, ArrowRight } from "lucide-react";

export interface PostVitalSignsProps {
  preVitals: VitalSigns;
  onSave: (postVitals: VitalSigns) => void;
}

type VitalField = "systolicBP" | "diastolicBP" | "heartRate";

const FIELDS: { key: VitalField; label: string; unit: string }[] = [
  { key: "systolicBP", label: VITAL_SIGNS_RULES.systolicBP.label, unit: VITAL_SIGNS_RULES.systolicBP.unit },
  { key: "diastolicBP", label: VITAL_SIGNS_RULES.diastolicBP.label, unit: VITAL_SIGNS_RULES.diastolicBP.unit },
  { key: "heartRate", label: VITAL_SIGNS_RULES.heartRate.label, unit: VITAL_SIGNS_RULES.heartRate.unit },
];

const CHANGE_THRESHOLD = 20;

export function PostVitalSigns({ preVitals, onSave }: PostVitalSignsProps) {
  const { values, validation, saving, canSave, changeMap, handleChange, handleSave } = usePostVitals(preVitals, onSave);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <HeartPulse className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          治疗后生理数据采集
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
          {FIELDS.map(({ key, label, unit }) => {
            const error = validation.errors[key];
            const isAlert = validation.alerts[key];
            const threshold = VITAL_SIGNS_ALERT_THRESHOLDS[key];
            const rule = VITAL_SIGNS_RULES[key];
            const change = changeMap?.[key];
            const isChangeWarning = change !== undefined && change > CHANGE_THRESHOLD;

            return (
              <div key={key} className="flex flex-col gap-1">
                <Label
                  htmlFor={`post-vital-${key}`}
                  className="text-xs leading-tight text-neutral-600"
                >
                  {label}
                  <span className="text-neutral-400 font-normal">（{unit}）</span>
                </Label>

                {/* Pre-vitals display */}
                <div className="flex items-center gap-1 text-xs leading-tight text-neutral-500">
                  <span>治疗前：</span>
                  <span className="font-mono font-medium text-neutral-700">{preVitals[key]}</span>
                  <span>{unit}</span>
                </div>

                {/* Post-vitals input + change arrow */}
                <div className="flex items-center gap-1">
                  <Input
                    id={`post-vital-${key}`}
                    type="text"
                    inputMode="numeric"
                    placeholder={`${rule.min}-${rule.max}`}
                    value={values[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    aria-label={`治疗后${label}`}
                    aria-invalid={!!error || undefined}
                    className={cn(
                      "text-xs leading-tight h-7 flex-1",
                      isAlert && "border-error-400 ring-2 ring-error-200"
                    )}
                  />
                  {change !== undefined && (
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-xs leading-tight whitespace-nowrap",
                        isChangeWarning ? "text-warning-600 font-medium" : "text-neutral-500"
                      )}
                    >
                      <ArrowRight className="h-3 w-3" />
                      {change.toFixed(1)}%
                      {isChangeWarning && <AlertTriangle className="h-3 w-3 text-warning-500" />}
                    </span>
                  )}
                </div>

                {error && (
                  <span className="text-xs text-error-600 leading-tight">{error}</span>
                )}
                {isAlert && !error && (
                  <span className="text-xs text-error-600 leading-tight flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    异常：超过 {threshold} {unit}
                  </span>
                )}
                {isChangeWarning && !error && (
                  <span className="text-xs text-warning-600 leading-tight">
                    变化超过 {CHANGE_THRESHOLD}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

      <div className="flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={!canSave || saving}>
            <Save className="h-3 w-3" />
            {saving ? "保存中..." : "保存治疗后数据"}
          </Button>
        </div>
    </div>
  );
}
