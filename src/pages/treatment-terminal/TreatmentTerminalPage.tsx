import { useState, useCallback } from "react";
import { RegionSelector } from "./blocks/RegionSelector";
import { TreatmentQueue } from "./blocks/TreatmentQueue";
import { TreatmentPatientView } from "./blocks/TreatmentPatientView";
import { TreatmentAction } from "./blocks/TreatmentAction";
import { RoomCompleteCheck } from "./blocks/RoomCompleteCheck";
import { PostVitalSigns } from "./blocks/PostVitalSigns";
import { PostScaleForm } from "./blocks/PostScaleForm";
import { QueueComplete } from "./blocks/QueueComplete";
import type { TreatmentPatient, TreatmentState, VitalSigns, ScaleResult, RoomCheckIn, PrescriptionStep } from "@/services/types";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import { Syringe, MapPin } from "lucide-react";

type PageStatus =
  | "region-select"
  | "idle"
  | "checked-in"
  | "treating"
  | "room-completing"
  | "post-vitals"
  | "post-scale"
  | "completing";

const INITIAL_TREATMENT: TreatmentState = { status: "idle", startTime: null, endTime: null };

export function TreatmentTerminalPage() {
  const [region, setRegion] = useState<string | null>(null);
  const [pageStatus, setPageStatus] = useState<PageStatus>("region-select");
  const [currentPatient, setCurrentPatient] = useState<TreatmentPatient | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [treatmentState, setTreatmentState] = useState<TreatmentState>(INITIAL_TREATMENT);
  const [postVitals, setPostVitals] = useState<VitalSigns | null>(null);
  const [postScaleResult, setPostScaleResult] = useState<ScaleResult | null>(null);
  const [_roomSteps, setRoomSteps] = useState<PrescriptionStep[]>([]);

  const handleRegionSelect = useCallback((r: string) => {
    setRegion(r);
    setPageStatus("idle");
  }, []);

  const handleCheckIn = useCallback(async (checkIn: RoomCheckIn) => {
    const cId = await consultationHelper.getActiveId(checkIn.patient.id);
    setConsultationId(cId);
    setCurrentPatient({
      ...checkIn.patient,
      vitalSigns: { systolicBP: 0, diastolicBP: 0, heartRate: 0, recordedAt: "", recordedBy: "" },
      contraindications: [],
      projects: checkIn.stepsInThisRoom.map((s) => ({
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
      })),
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

  // Region select screen
  if (pageStatus === "region-select" || !region) {
    return (
      <div className="flex h-full bg-neutral-50">
        <RegionSelector onSelect={handleRegionSelect} />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-neutral-50 gap-2 p-2">
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <div className="flex items-center gap-1 px-1">
          <MapPin className="h-3 w-3 text-primary-500" />
          <span className="text-xs font-medium text-primary-700 leading-tight">{region}</span>
        </div>
        <TreatmentQueue
          region={region}
          onCheckIn={handleCheckIn}
          disabled={!!currentPatient}
        />
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-auto">
        {currentPatient ? (
          <>
            <TreatmentPatientView patient={currentPatient} />
            {(pageStatus === "checked-in" || pageStatus === "treating") && (
              <TreatmentAction
                state={treatmentState}
                onStart={handleStart}
                onEnd={handleEnd}
              />
            )}
            {pageStatus === "room-completing" && consultationId && region && (
              <RoomCompleteCheck
                consultationId={consultationId}
                region={region}
                onAllDone={handleAllDone}
                onNextPatient={handleNextPatient}
              />
            )}
            {pageStatus === "post-vitals" && (
              <PostVitalSigns
                preVitals={currentPatient.vitalSigns}
                onSave={handlePostVitalsSave}
              />
            )}
            {pageStatus === "post-scale" && (
              <PostScaleForm onSubmit={handlePostScaleSubmit} />
            )}
            {pageStatus === "completing" && (
              <QueueComplete
                patient={currentPatient}
                treatmentState={treatmentState}
                postVitals={postVitals}
                postScaleResult={postScaleResult}
                onComplete={handleComplete}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <Syringe className="h-6 w-6" />
            <span className="text-xs leading-tight">请刷卡签到开始治疗</span>
          </div>
        )}
      </div>
    </div>
  );
}
