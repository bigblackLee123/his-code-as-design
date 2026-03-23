import { useState, useEffect, useCallback } from "react";
import { patientService } from "@/services";
import type { PatientHistoryRecord } from "@/services/types";

export function usePatientHistory(patientId: string | null) {
  const [records, setRecords] = useState<PatientHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!patientId) {
      setRecords([]);
      return;
    }
    setLoading(true);
    try {
      const data = await patientService.getPatientHistory(patientId);
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  return { records, loading };
}
