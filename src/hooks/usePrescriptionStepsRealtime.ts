import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type StepChangeCallback = (payload: {
  eventType: "INSERT" | "UPDATE" | "DELETE";
}) => void;

const useMock = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 监听 prescription_steps 表的 Realtime 变更。
 * 多房间终端需实时感知 steps 状态变化（其他房间完成后刷新）。
 */
export function usePrescriptionStepsRealtime(callback: StepChangeCallback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (useMock) return;

    const channel: RealtimeChannel = supabase
      .channel("prescription-steps-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prescription_steps" },
        (payload) => {
          callbackRef.current({
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          });
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("[Realtime] prescription-steps-changes 订阅失败");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
