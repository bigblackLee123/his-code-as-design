import { useState, useCallback } from "react";
import type { Patient, VitalSigns } from "@/services/types";

export type TriageStep = "checkin" | "vitals" | "queue";

export function useTriageFlow() {
  const [step, setStep] = useState<TriageStep>("checkin");
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

  return {
    step,
    patient,
    vitalSigns,
    handleCheckInComplete,
    handleVitalsSave,
    handleQueueComplete,
  };
}
