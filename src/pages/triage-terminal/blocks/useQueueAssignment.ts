import { useState, useEffect, useCallback } from "react";
import { queueService } from "@/services";
import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import type { QueueItem } from "@/services/types";

type Status = "preview" | "assigning" | "assigned" | "full" | "error";

const DEPARTMENT_ID = "DEPT001";

export function useQueueAssignment(patientId: string) {
  const [status, setStatus] = useState<Status>("preview");
  const [waitingCount, setWaitingCount] = useState(0);
  const [maxSize, setMaxSize] = useState(0);
  const [queueItem, setQueueItem] = useState<QueueItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadQueueInfo = useCallback(async () => {
    try {
      const [queue, max] = await Promise.all([
        queueService.getWaitingQueue(DEPARTMENT_ID),
        queueService.getMaxQueueSize(DEPARTMENT_ID),
      ]);
      setWaitingCount(queue.length);
      setMaxSize(max);
    } catch {
      // 静默失败，保持当前计数
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [queue, max] = await Promise.all([
          queueService.getWaitingQueue(DEPARTMENT_ID),
          queueService.getMaxQueueSize(DEPARTMENT_ID),
        ]);
        setWaitingCount(queue.length);
        setMaxSize(max);
        setStatus(queue.length >= max ? "full" : "preview");
      } catch {
        setErrorMsg("加载队列信息失败");
        setStatus("error");
      }
    })();
  }, []);

  useQueueRealtime(useCallback(() => {
    loadQueueInfo();
  }, [loadQueueInfo]));

  const handleAssign = useCallback(async () => {
    setStatus("assigning");
    setErrorMsg(null);
    try {
      const item = await queueService.enqueueWaiting(patientId, DEPARTMENT_ID);
      setQueueItem(item);
      setStatus("assigned");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "分配失败，请重试";
      setErrorMsg(msg);
      setStatus(msg.includes("已满") ? "full" : "error");
    }
  }, [patientId]);

  return { status, waitingCount, maxSize, queueItem, errorMsg, loadQueueInfo, handleAssign };
}
