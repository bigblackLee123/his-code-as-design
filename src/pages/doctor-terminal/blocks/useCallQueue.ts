import { useState, useEffect, useCallback } from "react";
import { queueService, patientService } from "@/services";
import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import type { Patient, QueueItem } from "@/services/types";

const DEPARTMENT_ID = "DEPT001";

export function useCallQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [calling, setCalling] = useState(false);

  const loadQueue = useCallback(async () => {
    try {
      const items = await queueService.getWaitingQueue(DEPARTMENT_ID);
      setQueue(items);
    } catch {
      // silently fail, queue stays empty
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useQueueRealtime(useCallback(() => {
    loadQueue();
  }, [loadQueue]));

  const callNext = useCallback(async (): Promise<Patient | null> => {
    setCalling(true);
    try {
      const queueItem = await queueService.callNextWaiting(DEPARTMENT_ID);
      if (!queueItem) return null;

      const patient = await patientService.getById(queueItem.patientId);
      await loadQueue();
      return patient ?? null;
    } catch {
      return null;
    } finally {
      setCalling(false);
    }
  }, [loadQueue]);

  return { queue, calling, callNext };
}
