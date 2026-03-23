import { useState, useCallback } from "react";
import { treatmentQueueService } from "@/services/supabase/treatmentQueueService";
import type { VitalSigns, ScaleResult } from "@/services/types";

type CompleteState = "confirm" | "loading" | "success" | "error";

export function useQueueComplete(patientId: string) {
  const [state, setState] = useState<CompleteState>("confirm");
  const [errorMsg, setErrorMsg] = useState("");

  const confirm = useCallback(async (postVitals?: VitalSigns, postScaleResult?: ScaleResult) => {
    setState("loading");
    setErrorMsg("");
    try {
      await treatmentQueueService.completeTreatment(patientId, postVitals, postScaleResult);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "出队失败，请重试");
      setState("error");
    }
  }, [patientId]);

  return { state, errorMsg, confirm };
}
