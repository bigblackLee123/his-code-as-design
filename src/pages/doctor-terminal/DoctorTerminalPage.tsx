import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CallQueue } from "./blocks/CallQueue";
import { DoctorQueueHeaderSlot } from "./blocks/DoctorQueueHeaderSlot";
import { PatientInfoCard } from "./blocks/PatientInfoCard";
import { SidebarSummary } from "./blocks/SidebarSummary";
import { ContraindicationInput } from "./blocks/ContraindicationInput";
import { SymptomInput } from "./blocks/SymptomInput";
import { ScaleForm } from "./blocks/ScaleForm";
import { AISuggestionPanel } from "./blocks/AISuggestionPanel";
import { TherapyProjectSelector } from "./blocks/TherapyProjectSelector";
import { ConfirmTransition } from "./blocks/ConfirmTransition";
import { useMockInit } from "./blocks/useMockInit";
import { PatientHistory } from "./blocks/PatientHistory";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type {
  Patient,
  ConsultationData,
  AITherapySuggestion,
  Contraindication,
  Symptom,
  ScaleResult,
  TherapyProject,
} from "@/services/types";

type Step = "collect" | "plan" | "confirm";

export function DoctorTerminalPage() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [step, setStep] = useState<Step>("collect");
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    contraindications: [],
    symptoms: [],
    scaleResults: null,
    aiSuggestion: null,
  });
  const [selectedProjects, setSelectedProjects] = useState<TherapyProject[]>([]);

  useMockInit(
    useCallback((p: Patient) => {
      setCurrentPatient(p);
      setStep("collect");
      setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    }, []),
    useCallback((projects: TherapyProject[]) => {
      setSelectedProjects(projects);
    }, []),
  );

  const handlePatientCalled = useCallback((patient: Patient) => {
    setCurrentPatient(patient);
    setStep("collect");
    setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    setSelectedProjects([]);
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
      setStep("confirm");
    }
  }, [selectedProjects]);

  const handleTransitionComplete = useCallback(() => {
    setCurrentPatient(null);
    setStep("collect");
    setConsultationData({ contraindications: [], symptoms: [], scaleResults: null, aiSuggestion: null });
    setSelectedProjects([]);
  }, []);

  return (
    <>
      {/* 已接诊时：候诊队列注入 Header slot */}
      {currentPatient && (
        <DoctorQueueHeaderSlot onPatientCalled={handlePatientCalled} disabled={!!currentPatient} />
      )}

      {currentPatient ? (
        step === "collect" ? (
          /* ── collect：3 行 grid，逐行左右对齐 ── */
          <div className="grid h-full grid-cols-[1fr_20rem] grid-rows-[auto_auto_1fr] gap-3 p-3">
            {/* R1 左：禁忌症 */}
            <ContraindicationInput
              patientId={currentPatient.id}
              onItemsChange={handleContraindicationChange}
            />
            {/* R1 右：患者信息卡 */}
            <PatientInfoCard patient={currentPatient} />

            {/* R2 左：症状 + 量表（等高对齐） */}
            <div className="flex flex-col gap-3">
              <SymptomInput
                value={consultationData.symptoms}
                onChange={handleSymptomChange}
              />
              <ScaleForm patientId={currentPatient.id} onSubmit={handleScaleSubmit} />
            </div>
            {/* R2 右：历史记录 + 按钮（等高对齐） */}
            <div className="flex flex-col gap-3">
              <PatientHistory patientId={currentPatient.id} />
              <Button
                onClick={() => setStep("plan")}
                disabled={!consultationData.scaleResults}
                className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm py-6 disabled:opacity-50"
              >
                下一步：方案制定
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* R3：溢出空间 */}
            <div />
            <div />
          </div>
        ) : step === "plan" ? (
          /* ── plan：返回按钮 + 2 行 grid ── */
          <div className="flex flex-col h-full gap-2 p-3 overflow-hidden">
            {/* 返回按钮：独立于 grid 之上 */}
            <button
              type="button"
              onClick={() => setStep("collect")}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors self-start"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回信息采集
            </button>

            <div className="grid flex-1 grid-cols-[1fr_20rem] grid-rows-[auto_1fr] gap-3 min-h-0">
              {/* R1 左：AI 面板 */}
              <AISuggestionPanel
                patient={currentPatient}
                consultationData={consultationData}
                onAdopt={handleAdoptSuggestion}
              />
              {/* R1 右：患者信息卡 */}
              <PatientInfoCard patient={currentPatient} />

              {/* R2 左：项目选择 */}
              <div className="flex flex-col gap-5 overflow-y-auto min-h-0">
                <TherapyProjectSelector
                  selectedProjects={selectedProjects}
                  patientContraindications={consultationData.contraindications}
                  onSelect={handleSelectProjects}
                />
              </div>
              {/* R2 右：摘要 + 流转按钮 */}
              <div className="flex flex-col gap-3">
                <SidebarSummary
                  contraindications={consultationData.contraindications}
                  scaleResults={consultationData.scaleResults}
                  selectedProjects={selectedProjects}
                />
                <Button
                  onClick={handleConfirmPrescription}
                  disabled={selectedProjects.length === 0}
                  className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm py-6 disabled:opacity-50"
                >
                  确认处方并流转
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ── confirm：流转确认页 ── */
          <ConfirmTransition
            patient={currentPatient}
            selectedProjects={selectedProjects}
            consultationData={consultationData}
            onComplete={handleTransitionComplete}
          />
        )
      ) : (
        <div className="flex h-full p-3">
          <div className="w-96 mx-auto">
            <CallQueue onPatientCalled={handlePatientCalled} disabled={false} />
          </div>
        </div>
      )}
    </>
  );
}
