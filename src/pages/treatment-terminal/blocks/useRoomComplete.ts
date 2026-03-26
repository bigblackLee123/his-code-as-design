import { useState, useCallback, useEffect } from "react";
import { treatmentQueueService } from "@/services/supabase/treatmentQueueService";
import type { RoomCompleteResult } from "@/services/types";

type RoomState = "loading" | "partial" | "done" | "error";

export function useRoomComplete(consultationId: string, region: string) {
  const [state, setState] = useState<RoomState>("loading");
  const [result, setResult] = useState<RoomCompleteResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleComplete = useCallback(async () => {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await treatmentQueueService.completeRoom(consultationId, region);
      setResult(res);
      setState(res.allDone ? "done" : "partial");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "完成失败");
      setState("error");
    }
  }, [consultationId, region]);

  // Auto-trigger on mount
  useEffect(() => {
    handleComplete();
  }, [handleComplete]);

  return { state, result, errorMsg, retry: handleComplete };
}
