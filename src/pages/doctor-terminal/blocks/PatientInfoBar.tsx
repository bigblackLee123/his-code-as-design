import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MaskedText } from "@/components/his/MaskedText";
import { patientService } from "@/services";
import { hasVitalSignsAlert, validateVitalSigns } from "@/lib/vitalSignsValidation";
import { VITAL_SIGNS_RULES } from "@/services/types";
import type { Patient, VitalSigns } from "@/services/types";
import { Users, HeartPulse, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PatientInfoBarProps {
  patient: Patient;
}

function VitalSignItem({
  label,
  value,
  unit,
  isAlert,
}: {
  label: string;
  value: number;
  unit: string;
  isAlert: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-neutral-500">{label}：</span>
      <span
        className={cn(
          "font-mono font-medium",
          isAlert ? "text-error-600" : "text-neutral-700"
        )}
      >
        {value}
      </span>
      <span className="text-neutral-400">{unit}</span>
      {isAlert && (
        <AlertTriangle
          className="h-3 w-3 text-error-500 animate-pulse"
          aria-label={`${label}异常`}
        />
      )}
    </div>
  );
}

export function PatientInfoBar({ patient }: PatientInfoBarProps) {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);

  useEffect(() => {
    let cancelled = false;
    patientService.getVitalSigns(patient.id).then((vs) => {
      if (!cancelled) setVitalSigns(vs);
    });
    return () => { cancelled = true; };
  }, [patient.id]);

  const alerts = vitalSigns
    ? validateVitalSigns(vitalSigns).alerts
    : {};
  const showGlobalAlert = vitalSigns ? hasVitalSignsAlert(vitalSigns) : false;

  return (
    <Card className="rounded-lg shadow-sm ring-0 border border-neutral-200">
      <CardContent className="px-3 py-2 flex flex-col gap-2">
        {/* Top row: Basic info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Users className="h-4 w-4 text-primary-500" aria-hidden="true" />
            <MaskedText
              type="name"
              value={patient.name}
              className="text-sm font-semibold text-neutral-800"
            />
            <span className="text-xs text-neutral-500">
              {patient.gender === "male" ? "男" : "女"} · {patient.age}岁
            </span>
          </div>

          <span className="text-xs text-neutral-300">|</span>

          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-500">身份证：</span>
            <MaskedText type="idNumber" value={patient.idNumber} />
          </div>

          <span className="text-xs text-neutral-300">|</span>

          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-500">电话：</span>
            <MaskedText type="phone" value={patient.phone} />
          </div>

          <span className="text-xs text-neutral-300">|</span>

          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-500">医保卡：</span>
            <span className="font-mono text-xs font-medium text-primary-600">
              {patient.insuranceCardNo.slice(-4)}
            </span>
          </div>
        </div>

        {/* Bottom row: Vital signs */}
        {vitalSigns && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-2 py-1 text-xs leading-tight">
              <HeartPulse
                className={cn(
                  "h-4 w-4 shrink-0",
                  showGlobalAlert ? "text-error-500" : "text-primary-500"
                )}
                aria-hidden="true"
              />
              <VitalSignItem
                label={VITAL_SIGNS_RULES.systolicBP.label}
                value={vitalSigns.systolicBP}
                unit={VITAL_SIGNS_RULES.systolicBP.unit}
                isAlert={!!alerts.systolicBP}
              />
              <span className="text-neutral-300">|</span>
              <VitalSignItem
                label={VITAL_SIGNS_RULES.diastolicBP.label}
                value={vitalSigns.diastolicBP}
                unit={VITAL_SIGNS_RULES.diastolicBP.unit}
                isAlert={!!alerts.diastolicBP}
              />
              <span className="text-neutral-300">|</span>
              <VitalSignItem
                label={VITAL_SIGNS_RULES.heartRate.label}
                value={vitalSigns.heartRate}
                unit={VITAL_SIGNS_RULES.heartRate.unit}
                isAlert={!!alerts.heartRate}
              />
            </div>
            {showGlobalAlert && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700 animate-pulse">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                异常
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
