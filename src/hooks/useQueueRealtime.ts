import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type QueueChangeCallback = (payload: {
  eventType: "INSERT" | "UPDATE" | "DELETE";
}) => void;

const useMock = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 监听 queue_items 表的 Realtime 变更。
 * callback 只传递 eventType，不解析行数据——
 * 因为 Realtime payload 不含 JOIN 字段，消费端应自行 reload。
 */
export function useQueueRealtime(callback: QueueChangeCallback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (useMock) return;

    const channel: RealtimeChannel = supabase
      .channel("queue-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_items" },
        (payload) => {
          callbackRef.current({
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          });
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("[Realtime] queue-changes 订阅失败");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
