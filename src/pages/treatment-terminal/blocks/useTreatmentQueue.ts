import { useState, useEffect, useCallback } from "react";
import { queueService } from "@/services";
import { treatmentQueueService } from "@/services/supabase/treatmentQueueService";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import type { RoomCheckIn, QueueItem } from "@/services/types";

export function useTreatmentQueue(region: string) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadQueue = useCallback(async () => {
    try {
      const items = await queueService.getTreatmentQueue();
      setQueue(items);
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);
  useQueueRealtime(useCallback(() => { loadQueue(); }, [loadQueue]));

  const checkIn = useCallback(async (cardSuffix: string): Promise<{ checkIn: RoomCheckIn; consultationId: string } | null> => {
    if (cardSuffix.length !== 4) return null;
    setChecking(true);
    setErrorMsg("");
    try {
      const result = await treatmentQueueService.checkInByRoom(cardSuffix, region);
      const cId = await consultationHelper.getActiveId(result.patient.id);
      await loadQueue();
      return { checkIn: result, consultationId: cId };
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "签到失败");
      return null;
    } finally {
      setChecking(false);
    }
  }, [region, loadQueue]);

  return { queue, checking, errorMsg, checkIn };
}
