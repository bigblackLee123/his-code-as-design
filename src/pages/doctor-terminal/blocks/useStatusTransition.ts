import { useState, useCallback } from "react";
import { queueService, prescriptionService } from "@/services";
import type { QueueItem, TherapyProject, PrescriptionData } from "@/services/types";

type TransitionState = "confirm" | "loading" | "success" | "error";

function buildPrescriptionData(_projects: TherapyProject[]): PrescriptionData {
  return {
    meta: { route: "", usage: "", frequency: "", dosage: "", orderType: "疗愈处方", department: "音乐疗愈科", doses: 1 },
    herbs: [],
    totalAmount: 0,
  };
}

export function useStatusTransition(patientId: string, selectedProjects: TherapyProject[]) {
  const [state, setState] = useState<TransitionState>("confirm");
  const [queueItem, setQueueItem] = useState<QueueItem | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const confirm = useCallback(async () => {
    setState("loading");
    setErrorMsg("");
    try {
      const prescriptionData = buildPrescriptionData(selectedProjects);
      await prescriptionService.saveWithSteps(patientId, prescriptionData, selectedProjects);
      const item = await queueService.enqueueTreatment(patientId);
      setQueueItem(item);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "流转失败，请重试");
      setState("error");
    }
  }, [patientId, selectedProjects]);

  return { state, queueItem, errorMsg, confirm };
}
