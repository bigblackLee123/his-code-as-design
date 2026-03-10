import { useState, useCallback } from "react";
import { TreatmentQueue } from "./blocks/TreatmentQueue";
import { TreatmentPatientView } from "./blocks/TreatmentPatientView";
import { TreatmentAction } from "./blocks/TreatmentAction";
import { PostVitalSigns } from "./blocks/PostVitalSigns";
import { PostScaleForm } from "./blocks/PostScaleForm";
import { QueueComplete } from "./blocks/QueueComplete";
import type { TreatmentPatient, TreatmentState, VitalSigns, ScaleResult } from "@/services/types";
import { Syringe } from "lucide-react";

const INITIAL_STATE: TreatmentState = {
  status: "idle",
  startTime: null,
  endTime: null,
};

export function TreatmentTerminalPage() {
  const [currentPatient, setCurrentPatient] = useState<TreatmentPatient | null>(null);
  const [treatmentState, setTreatmentState] = useState<TreatmentState>(INITIAL_STATE);
  const [postVitals, setPostVitals] = useState<VitalSigns | null>(null);

  const handlePatientCalled = useCallback((patient: TreatmentPatient) => {
    setCurrentPatient(patient);
    setTreatmentState(INITIAL_STATE);
    setPostVitals(null);
  }, []);

  const handleStart = useCallback(() => {
    setTreatmentState((prev) => ({ ...prev, status: "treating", startTime: new Date() }));
  }, []);

  const handleEnd = useCallback(() => {
    setTreatmentState((prev) => ({ ...prev, status: "post-vitals", endTime: new Date() }));
  }, []);

  const handlePostVitalsSave = useCallback((vitals: VitalSigns) => {
    setPostVitals(vitals);
    setTreatmentState((prev) => ({ ...prev, status: "post-scale" }));
  }, []);

  const handlePostScaleSubmit = useCallback((_results: ScaleResult) => {
    setTreatmentState((prev) => ({ ...prev, status: "completing" }));
  }, []);

  const handleComplete = useCallback(() => {
    setCurrentPatient(null);
    setTreatmentState(INITIAL_STATE);
    setPostVitals(null);
  }, []);

  return (
    <div className="flex h-full bg-neutral-50 gap-2 p-2">
      {/* Left: Treatment queue panel */}
      <div className="w-64 shrink-0">
        <TreatmentQueue onPatientCalled={handlePatientCalled} disabled={!!currentPatient} />
      </div>

      {/* Right: Treatment work area */}
      <div className="flex-1 flex flex-col gap-1 overflow-auto">
        {currentPatient ? (
          <>
            <TreatmentPatientView patient={currentPatient} />
            <TreatmentAction
              state={treatmentState}
              onStart={handleStart}
              onEnd={handleEnd}
            />
            {treatmentState.status === "post-vitals" && (
              <PostVitalSigns
                preVitals={currentPatient.vitalSigns}
                onSave={handlePostVitalsSave}
              />
            )}
            {treatmentState.status === "post-scale" && (
              <PostScaleForm onSubmit={handlePostScaleSubmit} />
            )}
            {treatmentState.status === "completing" && (
              <QueueComplete
                patient={currentPatient}
                treatmentState={treatmentState}
                postVitals={postVitals}
                onComplete={handleComplete}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <Syringe className="h-6 w-6" />
            <span className="text-xs leading-tight">请从左侧治疗队列叫号开始治疗</span>
          </div>
        )}
      </div>
    </div>
  );
}
