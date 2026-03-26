import { useState, useCallback } from "react";
import type { TreatmentPatient, TreatmentState, VitalSigns, ScaleResult, RoomCheckIn, PrescriptionStep, TherapyProject } from "@/services/types";
import { therapyService } from "@/services";

export type PageStatus =
  | "region-select"
  | "idle"
  | "checked-in"
  | "treating"
  | "room-completing"
  | "post-vitals"
  | "post-scale"
  | "completing";

const INITIAL_TREATMENT: TreatmentState = { status: "idle", startTime: null, endTime: null };

export function useTreatmentFlow() {
  const [region, setRegion] = useState<string | null>(null);
  const [pageStatus, setPageStatus] = useState<PageStatus>("region-select");
  const [currentPatient, setCurrentPatient] = useState<TreatmentPatient | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [treatmentState, setTreatmentState] = useState<TreatmentState>(INITIAL_TREATMENT);
  const [postVitals, setPostVitals] = useState<VitalSigns | null>(null);
  const [postScaleResult, setPostScaleResult] = useState<ScaleResult | null>(null);
  const [roomSteps, setRoomSteps] = useState<PrescriptionStep[]>([]);

  const handleRegionSelect = useCallback((r: string) => {
    setRegion(r);
    setPageStatus("idle");
  }, []);

  const handleCheckIn = useCallback(async (checkIn: RoomCheckIn, cId: string) => {
    setConsultationId(cId);
    // 查完整项目数据（含 guidanceScript、frequency 等）
    const fullProjects = await Promise.all(
      checkIn.stepsInThisRoom.map(async (s): Promise<TherapyProject> => {
        const proj = await therapyService.getProjectById(s.projectId);
        if (proj) return proj;
        return {
          id: s.projectId,
          region: s.region,
          name: s.projectName,
          mechanism: "",
          guidanceScript: null,
          bpm: null,
          mood: "",
          energyLevel: "",
          hasGuidance: false,
          hasScenario: false,
          targetAudience: "",
          contraindications: [],
          frequency: null,
          frequencyBand: null,
        };
      })
    );
    setCurrentPatient({
      ...checkIn.patient,
      vitalSigns: { systolicBP: 0, diastolicBP: 0, heartRate: 0, recordedAt: "", recordedBy: "" },
      contraindications: [],
      projects: fullProjects,
    });
    setRoomSteps(checkIn.stepsInThisRoom);
    setTreatmentState(INITIAL_TREATMENT);
    setPostVitals(null);
    setPostScaleResult(null);
    setPageStatus("checked-in");
  }, []);

  const handleStart = useCallback(() => {
    setTreatmentState({ status: "treating", startTime: new Date(), endTime: null });
    setPageStatus("treating");
  }, []);

  const handleEnd = useCallback(() => {
    setTreatmentState((prev) => ({ ...prev, status: "post-vitals", endTime: new Date() }));
    setPageStatus("room-completing");
  }, []);

  const handleAllDone = useCallback(() => {
    setPageStatus("post-vitals");
  }, []);

  const handleNextPatient = useCallback(() => {
    setCurrentPatient(null);
    setConsultationId(null);
    setRoomSteps([]);
    setTreatmentState(INITIAL_TREATMENT);
    setPageStatus("idle");
  }, []);

  const handlePostVitalsSave = useCallback((vitals: VitalSigns) => {
    setPostVitals(vitals);
    setPageStatus("post-scale");
  }, []);

  const handlePostScaleSubmit = useCallback((results: ScaleResult) => {
    setPostScaleResult(results);
    setPageStatus("completing");
  }, []);

  const handleComplete = useCallback(() => {
    setCurrentPatient(null);
    setConsultationId(null);
    setRoomSteps([]);
    setTreatmentState(INITIAL_TREATMENT);
    setPostVitals(null);
    setPostScaleResult(null);
    setPageStatus("idle");
  }, []);

  return {
    region,
    pageStatus,
    currentPatient,
    consultationId,
    treatmentState,
    postVitals,
    postScaleResult,
    roomSteps,
    handleRegionSelect,
    handleCheckIn,
    handleStart,
    handleEnd,
    handleAllDone,
    handleNextPatient,
    handlePostVitalsSave,
    handlePostScaleSubmit,
    handleComplete,
  };
}
