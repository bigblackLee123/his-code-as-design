import { useState, useCallback, useEffect } from "react";
import { CallQueue } from "./blocks/CallQueue";
import { PatientInfoBar } from "./blocks/PatientInfoBar";
import { ContraindicationInput } from "./blocks/ContraindicationInput";
import { SymptomInput } from "./blocks/SymptomInput";
import { ScaleForm } from "./blocks/ScaleForm";
import { AISuggestionPanel } from "./blocks/AISuggestionPanel";
import { TherapyProjectSelector } from "./blocks/TherapyProjectSelector";
import { TherapyProjectList } from "./blocks/TherapyProjectList";
import { StatusTransition } from "./blocks/StatusTransition";
import type {
  Patient,
  ConsultationData,
  AITherapySuggestion,
  Contraindication,
  Symptom,
  ScaleResult,
  TherapyProject,
} from "@/services/types";
import { therapyService, patientService, contraindicationService, scaleService } from "@/services";
import { consultationHelper } from "@/services/supabase/consultationHelper";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

/** Mock 模式下的预填患者数据 */
const MOCK_PATIENT: Patient = {
  id: "P003",
  name: "王建国",
  gender: "male",
  age: 72,
  idNumber: "440103195207203456",
  phone: "15012349876",
  insuranceCardNo: "YB20240003",
  status: "consulting",
  createdAt: "2024-01-15T09:00:00Z",
};

const MOCK_CONTRAINDICATIONS: Contraindication[] = [];

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

  // Mock 模式：自动加载预填数据，方便演示截图
  useEffect(() => {
    if (!useMock) return;
    // 预存生理数据，让 PatientInfoBar 能读到
    patientService.saveVitalSigns(MOCK_PATIENT.id, {
      systolicBP: 145,
      diastolicBP: 92,
      heartRate: 82,
      recordedAt: new Date().toISOString(),
      recordedBy: "分诊护士",
    });
    setCurrentPatient(MOCK_PATIENT);
    setConsultationData({
      contraindications: MOCK_CONTRAINDICATIONS,
      symptoms: [],
      scaleResults: null,
      aiSuggestion: null,
    });
    // 自动选中前两个项目
    therapyService.getProjects().then((projects) => {
      if (projects.length > 0) setSelectedProjects(projects.slice(0, 2));
    });
  }, []);

  const handlePatientCalled = useCallback((patient: Patient) => {
    setCurrentPatient(patient);
    setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    setSelectedProjects([]);
    setShowTransition(false);
  }, []);

  const handleContraindicationChange = useCallback(async (items: Contraindication[]) => {
    setConsultationData((prev) => ({ ...prev, contraindications: items }));
    // 即时持久化到 DB（AI 聚合数据依赖此表）
    if (currentPatient) {
      try {
        const cId = await consultationHelper.getActiveId(currentPatient.id);
        await contraindicationService.saveForConsultation(cId, items);
      } catch { /* 静默失败，不阻塞 UI */ }
    }
  }, [currentPatient]);

  const handleSymptomChange = useCallback((items: Symptom[]) => {
    setConsultationData((prev) => ({ ...prev, symptoms: items }));
  }, []);

  const handleScaleSubmit = useCallback(async (results: ScaleResult) => {
    setConsultationData((prev) => ({ ...prev, scaleResults: results }));
    // 即时持久化到 DB（AI 聚合数据依赖此表）
    if (currentPatient) {
      try {
        await scaleService.saveResult(currentPatient.id, results, "pre");
      } catch { /* 静默失败，不阻塞 UI */ }
    }
  }, [currentPatient]);

  const handleAdoptSuggestion = useCallback(async (suggestion: AITherapySuggestion) => {
    setConsultationData((prev) => ({ ...prev, aiSuggestion: suggestion }));
    const results = await Promise.all(
      suggestion.projectIds.map((id) => therapyService.getProjectById(id)),
    );
    const projects = results.filter((p): p is TherapyProject => p !== null);
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
            <SymptomInput
              value={consultationData.symptoms}
              onChange={handleSymptomChange}
            />
            <ScaleForm onSubmit={handleScaleSubmit} />
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
