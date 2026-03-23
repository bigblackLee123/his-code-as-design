import { useState, useCallback } from "react";
import { CallQueue } from "./blocks/CallQueue";
import { PatientInfoBar } from "./blocks/PatientInfoBar";
import { ContraindicationInput } from "./blocks/ContraindicationInput";
import { SymptomInput } from "./blocks/SymptomInput";
import { ScaleForm } from "./blocks/ScaleForm";
import { AISuggestionPanel } from "./blocks/AISuggestionPanel";
import { TherapyProjectSelector } from "./blocks/TherapyProjectSelector";
import { TherapyProjectList } from "./blocks/TherapyProjectList";
import { StatusTransition } from "./blocks/StatusTransition";
import { useMockInit } from "./blocks/useMockInit";
import { PatientHistory } from "./blocks/PatientHistory";
import type {
  Patient,
  ConsultationData,
  AITherapySuggestion,
  Contraindication,
  Symptom,
  ScaleResult,
  TherapyProject,
} from "@/services/types";

export function DoctorTerminalPage() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    contraindications: [],
    symptoms: [],
    scaleResults: null,
    aiSuggestion: null,
  });
  const [selectedProjects, setSelectedProjects] = useState<TherapyProject[]>([]);
  const [showTransition, setShowTransition] = useState(false);

  // Mock 模式：自动加载预填数据
  useMockInit(
    useCallback((p: Patient) => {
      setCurrentPatient(p);
      setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    }, []),
    useCallback((projects: TherapyProject[]) => {
      setSelectedProjects(projects);
    }, []),
  );

  const handlePatientCalled = useCallback((patient: Patient) => {
    setCurrentPatient(patient);
    setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    setSelectedProjects([]);
    setShowTransition(false);
  }, []);

  const handleContraindicationChange = useCallback((items: Contraindication[]) => {
    setConsultationData((prev) => ({ ...prev, contraindications: items }));
  }, []);

  const handleSymptomChange = useCallback((items: Symptom[]) => {
    setConsultationData((prev) => ({ ...prev, symptoms: items }));
  }, []);

  const handleScaleSubmit = useCallback((results: ScaleResult) => {
    setConsultationData((prev) => ({ ...prev, scaleResults: results }));
  }, []);

  const handleAdoptSuggestion = useCallback((_suggestion: AITherapySuggestion, projects: TherapyProject[]) => {
    setConsultationData((prev) => ({ ...prev, aiSuggestion: _suggestion }));
    setSelectedProjects(projects);
  }, []);

  const handleSelectProjects = useCallback((projects: TherapyProject[]) => {
    setSelectedProjects(projects);
  }, []);

  const handleConfirmPrescription = useCallback(() => {
    if (selectedProjects.length > 0) {
      setShowTransition(true);
    }
  }, [selectedProjects]);

  const handleTransitionComplete = useCallback(() => {
    setCurrentPatient(null);
    setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    setSelectedProjects([]);
    setShowTransition(false);
  }, []);

  return (
    <div className="flex h-full bg-neutral-50 gap-2 p-2">
      {/* Left: Call queue panel */}
      <div className="w-80 shrink-0">
        <CallQueue onPatientCalled={handlePatientCalled} disabled={!!currentPatient} />
      </div>

      {/* Right: Consultation work area */}
      <div className="flex-1 flex flex-col gap-2">
        {currentPatient ? (
          <>
            <PatientInfoBar patient={currentPatient} />
            <PatientHistory patientId={currentPatient.id} />
            <ContraindicationInput
              patientId={currentPatient.id}
              onItemsChange={handleContraindicationChange}
            />
            <SymptomInput
              value={consultationData.symptoms}
              onChange={handleSymptomChange}
            />
            <ScaleForm patientId={currentPatient.id} onSubmit={handleScaleSubmit} />
            <AISuggestionPanel
              patient={currentPatient}
              consultationData={consultationData}
              onAdopt={handleAdoptSuggestion}
            />
            <TherapyProjectSelector
              selectedProjects={selectedProjects}
              patientContraindications={consultationData.contraindications}
              onSelect={handleSelectProjects}
            />
            <TherapyProjectList selectedProjects={selectedProjects} />
            {selectedProjects.length > 0 && !showTransition && (
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
                selectedProjects={selectedProjects}
                consultationData={consultationData}
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
