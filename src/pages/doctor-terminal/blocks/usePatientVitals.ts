import { useState, useEffect } from "react";
import { patientService } from "@/services";
import type { VitalSigns } from "@/services/types";

export function usePatientVitals(patientId: string) {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);

  useEffect(() => {
    let cancelled = false;
    patientService.getVitalSigns(patientId).then((vs) => {
      if (!cancelled) setVitalSigns(vs);
    });
    return () => { cancelled = true; };
  }, [patientId]);

  return { vitalSigns };
}
