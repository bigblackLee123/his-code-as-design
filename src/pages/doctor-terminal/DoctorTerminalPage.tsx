import { useState, useCallback } from "react";
import { CallQueue } from "./blocks/CallQueue";
import { PatientInfoBar } from "./blocks/PatientInfoBar";
import { ContraindicationInput } from "./blocks/ContraindicationInput";
import { ScaleForm } from "./blocks/ScaleForm";
import { AISuggestionPanel } from "./blocks/AISuggestionPanel";
import { StatusTransition } from "./blocks/StatusTransition";
import { PrescriptionForm } from "@/pages/outpatient-prescription/blocks/PrescriptionForm";
import { HerbGrid } from "@/pages/outpatient-prescription/blocks/HerbGrid";
import { ActionBar } from "@/pages/outpatient-prescription/blocks/ActionBar";
import type { Patient, ConsultationData, AISuggestion, Contraindication, ScaleResult, HerbItem } from "@/services/types";

export function DoctorTerminalPage() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    contraindications: [],
    scaleResults: null,
    aiSuggestion: null,
  });
  const [herbs, setHerbs] = useState<HerbItem[] | undefined>(undefined);
  const [showTransition, setShowTransition] = useState(false);

  const handlePatientCalled = useCallback((patient: Patient) => {
    setCurrentPatient(patient);
    setConsultationData({ contraindications: [], scaleResults: null, aiSuggestion: null });
    setHerbs(undefined);
    setShowTransition(false);
  }, []);

  const handleContraindicationChange = useCallback((items: Contraindication[]) => {
    setConsultationData((prev) => ({ ...prev, contraindications: items }));
  }, []);

  const handleScaleSubmit = useCallback((results: ScaleResult) => {
    setConsultationData((prev) => ({ ...prev, scaleResults: results }));
  }, []);

  const handleAdoptSuggestion = useCallback((suggestion: AISuggestion) => {
    setConsultationData((prev) => ({ ...prev, aiSuggestion: suggestion }));
    const mappedHerbs: HerbItem[] = suggestion.herbs.map((h) => ({
      name: h.name,
      dosage: h.dosage,
      unit: h.unit,
    }));
    setHerbs(mappedHerbs);
  }, []);

  const handleAction = useCallback((action: string) => {
    if (action === "处方上传") {
      setShowTransition(true);
    }
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setCurrentPatient(null);
    setConsultationData({ contraindications: [], scaleResults: null, aiSuggestion: null });
    setHerbs(undefined);
    setShowTransition(false);
  }, []);

  return (
    <div className="flex h-full bg-neutral-50 gap-2 p-2">
      {/* Left: Call queue panel */}
      <div className="w-56 shrink-0">
        <CallQueue onPatientCalled={handlePatientCalled} disabled={!!currentPatient} />
      </div>

      {/* Right: Consultation work area */}
      <div className="flex-1 flex flex-col gap-2 overflow-auto">
        {currentPatient ? (
          <>
            <PatientInfoBar patient={currentPatient} />
            <ContraindicationInput
              value={consultationData.contraindications}
              onChange={handleContraindicationChange}
            />
            <ScaleForm onSubmit={handleScaleSubmit} />
            <AISuggestionPanel
              patient={currentPatient}
              consultationData={consultationData}
              onAdopt={handleAdoptSuggestion}
            />
            <PrescriptionForm />
            <HerbGrid herbs={herbs} />
            <ActionBar onAction={handleAction} />
            {showTransition && (
              <StatusTransition patient={currentPatient} onComplete={handleTransitionComplete} />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-neutral-400 leading-tight">
            请从左侧候诊队列叫号开始接诊
          </div>
        )}
      </div>
    </div>
  );
}
