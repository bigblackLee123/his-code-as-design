import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { hasVitalSignsAlert, validateVitalSigns } from "@/lib/vitalSignsValidation";
import { VITAL_SIGNS_RULES } from "@/services/types";
import type { TreatmentPatient } from "@/services/types";
import { Users, HeartPulse, AlertTriangle, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreatmentPatientViewProps {
  patient: TreatmentPatient;
}

export function TreatmentPatientView({ patient }: TreatmentPatientViewProps) {
  const { vitalSigns, contraindications, prescription } = patient;
  const { alerts } = validateVitalSigns(vitalSigns);
  const showGlobalAlert = hasVitalSignsAlert(vitalSigns);

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="p-3 flex flex-col gap-3">
        {/* Section 1: 基本信息 */}
        <PatientBasicInfo patient={patient} showGlobalAlert={showGlobalAlert} />

        {/* Section 2: 生理数据 */}
        <VitalSignsSection vitalSigns={vitalSigns} alerts={alerts} showGlobalAlert={showGlobalAlert} />

        {/* Section 3: 禁忌症 */}
        {contraindications.length > 0 && (
          <ContraindicationsSection contraindications={contraindications} />
        )}

        {/* Section 4: 处方明细 */}
        <PrescriptionSection prescription={prescription} />
      </CardContent>
    </Card>
  );
}

/** Section 1: 患者基本信息 */
function PatientBasicInfo({
  patient,
  showGlobalAlert,
}: {
  patient: TreatmentPatient;
  showGlobalAlert: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <MaskedText type="name" value={patient.name} className="text-sm font-semibold text-neutral-800" />
          <span className="text-xs text-neutral-500">
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
    </div>
  );
}

/** Section 2: 生理数据 */
function VitalSignsSection({
  vitalSigns,
  alerts,
  showGlobalAlert,
}: {
  vitalSigns: TreatmentPatient["vitalSigns"];
  alerts: Record<string, boolean>;
  showGlobalAlert: boolean;
}) {
  return (
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
            {isAlert && (
              <AlertTriangle className="h-3 w-3 text-error-500 animate-pulse" aria-label={`${rule.label}异常`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Section 3: 禁忌症列表 */
function ContraindicationsSection({
  contraindications,
}: {
  contraindications: TreatmentPatient["contraindications"];
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-800 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3 text-warning-500" aria-hidden="true" />
        禁忌症
      </span>
      <div className="flex flex-wrap gap-1">
        {contraindications.map((item) => (
          <Badge
            key={item.code}
            variant="outline"
            className="text-xs leading-tight bg-warning-50 text-warning-700 border-warning-200"
          >
            {item.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/** Section 4: 处方明细 */
function PrescriptionSection({
  prescription,
}: {
  prescription: TreatmentPatient["prescription"];
}) {
  const { meta, herbs, totalAmount } = prescription;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-800 flex items-center gap-1">
        <Pill className="h-3 w-3 text-primary-500" aria-hidden="true" />
        处方明细
      </span>
      {/* 处方元数据 */}
      <div className="grid grid-cols-4 gap-1 text-xs leading-tight rounded-md bg-neutral-50 px-2 py-1">
        <span><span className="text-neutral-500">用法：</span>{meta.usage}</span>
        <span><span className="text-neutral-500">频次：</span>{meta.frequency}</span>
        <span><span className="text-neutral-500">剂量：</span>{meta.dosage}</span>
        <span><span className="text-neutral-500">帖数：</span>{meta.doses}帖</span>
      </div>
      {/* 药材列表 */}
      <div className="flex flex-wrap gap-1">
        {herbs.map((herb) => (
          <span
            key={herb.name}
            className="inline-flex items-center gap-1 rounded-sm bg-neutral-100 px-2 py-0.5 text-xs leading-tight"
          >
            <span className="text-neutral-800">{herb.name}</span>
            <span className="font-mono text-neutral-600">{herb.dosage}{herb.unit}</span>
            {herb.note && (
              <span className="text-warning-600 font-medium">({herb.note})</span>
            )}
          </span>
        ))}
      </div>
      <div className="text-xs leading-tight text-neutral-500 text-right">
        合计金额：<span className="font-mono font-medium text-neutral-800">¥{totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
}
