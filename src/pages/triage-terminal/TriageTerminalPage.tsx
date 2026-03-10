import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientCheckIn } from "./blocks/PatientCheckIn";
import { VitalSignsInput } from "./blocks/VitalSignsInput";
import { QueueAssignment } from "./blocks/QueueAssignment";
import type { Patient, VitalSigns } from "@/services/types";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "checkin" | "vitals" | "queue";

const STEPS: { key: Step; label: string; number: number }[] = [
  { key: "checkin", label: "患者签到", number: 1 },
  { key: "vitals", label: "生理数据采集", number: 2 },
  { key: "queue", label: "候诊队列分配", number: 3 },
];

export function TriageTerminalPage() {
  const [step, setStep] = useState<Step>("checkin");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);

  const handleCheckInComplete = useCallback((p: Patient) => {
    setPatient(p);
    setStep("vitals");
  }, []);

  const handleVitalsSave = useCallback((v: VitalSigns) => {
    setVitalSigns(v);
    setStep("queue");
  }, []);

  const handleQueueComplete = useCallback(() => {
    setPatient(null);
    setVitalSigns(null);
    setStep("checkin");
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full bg-neutral-50 p-3">
      {/* Page header */}
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary-500" />
            分诊终端
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map(({ key, label, number }, idx) => (
              <div key={key} className="flex items-center gap-2">
                {idx > 0 && (
                  <div
                    className={cn(
                      "h-px w-8",
                      STEPS.findIndex((s) => s.key === step) >= idx
                        ? "bg-primary-400"
                        : "bg-neutral-200"
                    )}
                  />
                )}
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                      step === key
                        ? "bg-primary-600 text-white"
                        : STEPS.findIndex((s) => s.key === step) > STEPS.findIndex((s) => s.key === key)
                          ? "bg-primary-100 text-primary-700"
                          : "bg-neutral-200 text-neutral-500"
                    )}
                  >
                    {number}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-tight",
                      step === key
                        ? "text-primary-700 font-medium"
                        : "text-neutral-500"
                    )}
                  >
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      {step === "checkin" && (
        <PatientCheckIn onCheckInComplete={handleCheckInComplete} />
      )}
      {step === "vitals" && patient && (
        <VitalSignsInput patient={patient} onSave={handleVitalsSave} />
      )}
      {step === "queue" && patient && vitalSigns && (
        <QueueAssignment
          patient={patient}
          vitalSigns={vitalSigns}
          onComplete={handleQueueComplete}
        />
      )}
    </div>
  );
}
