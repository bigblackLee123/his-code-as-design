import { useEffect } from "react";
import type { QueueItem } from "@/services/types";
import { toQueueItem } from "@/services/supabase/mappers";

type QueueChangeCallback = (payload: {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: QueueItem | null;
  old: { id: string } | null;
}) => void;

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export function useQueueRealtime(callback: QueueChangeCallback) {
  useEffect(() => {
    if (useMock) return;

    let channel: ReturnType<typeof import("@supabase/supabase-js").SupabaseClient.prototype.channel> | null = null;

    import("@/services/supabase/client").then(({ supabase }) => {
      channel = supabase
        .channel("queue-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "queue_items" },
          (payload) => {
            callback({
              eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
              new: payload.new ? toQueueItem(payload.new as any) : null,
              old: payload.old ? { id: (payload.old as any).id } : null,
            });
          }
        )
        .subscribe();
    });

    return () => {
      if (channel) {
        import("@/services/supabase/client").then(({ supabase }) => {
          supabase.removeChannel(channel!);
        });
      }
    };
  }, [callback]);
}
