import { useState, useCallback } from "react";
import { CallQueue } from "./blocks/CallQueue";
import { PatientInfoBar } from "./blocks/PatientInfoBar";
import { ContraindicationInput } from "./blocks/ContraindicationInput";
import { ScaleForm } from "./blocks/ScaleForm";
import { AISuggestionPanel } from "./blocks/AISuggestionPanel";
import { TherapyPackageSelector } from "./blocks/TherapyPackageSelector";
import { TherapyProjectList } from "./blocks/TherapyProjectList";
import { StatusTransition } from "./blocks/StatusTransition";
import type {
  Patient,
  ConsultationData,
  AITherapySuggestion,
  Contraindication,
  ScaleResult,
  TherapyPackage,
} from "@/services/types";
import { therapyService } from "@/services";

export function DoctorTerminalPage() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    contraindications: [],
    scaleResults: null,
    aiSuggestion: null,
  });
  const [selectedPackage, setSelectedPackage] = useState<TherapyPackage | null>(null);
  const [showTransition, setShowTransition] = useState(false);

  const handlePatientCalled = useCallback((patient: Patient) => {
    setCurrentPatient(patient);
    setConsultationData({ contraindications: [], scaleResults: null, aiSuggestion: null });
    setSelectedPackage(null);
    setShowTransition(false);
  }, []);

  const handleContraindicationChange = useCallback((items: Contraindication[]) => {
    setConsultationData((prev) => ({ ...prev, contraindications: items }));
  }, []);

  const handleScaleSubmit = useCallback((results: ScaleResult) => {
    setConsultationData((prev) => ({ ...prev, scaleResults: results }));
  }, []);

  const handleAdoptSuggestion = useCallback(async (suggestion: AITherapySuggestion) => {
    setConsultationData((prev) => ({ ...prev, aiSuggestion: suggestion }));
    const pkg = await therapyService.getPackageById(suggestion.packageId);
    if (pkg) {
      setSelectedPackage(pkg);
    }
  }, []);

  const handleSelectPackage = useCallback((pkg: TherapyPackage) => {
    setSelectedPackage(pkg);
  }, []);

  const handleConfirmPrescription = useCallback(() => {
    if (selectedPackage) {
      setShowTransition(true);
    }
  }, [selectedPackage]);

  const handleTransitionComplete = useCallback(() => {
    setCurrentPatient(null);
    setConsultationData({ contraindications: [], scaleResults: null, aiSuggestion: null });
    setSelectedPackage(null);
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
            <TherapyPackageSelector
              selectedPackageId={selectedPackage?.id ?? null}
              onSelect={handleSelectPackage}
            />
            <TherapyProjectList selectedPackage={selectedPackage} />
            {selectedPackage && !showTransition && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmPrescription}
                  className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white leading-tight hover:bg-primary-700 transition-colors"
                >
                  确认处方并流转
                </button>
              </div>
            )}
            {showTransition && (
              <StatusTransition
                patient={currentPatient}
                selectedPackage={selectedPackage}
                onComplete={handleTransitionComplete}
              />
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
