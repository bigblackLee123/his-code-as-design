import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaskedText } from "@/components/his/MaskedText";
import { queueService } from "@/services";
import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import type { QueueItem } from "@/services/types";
import { Moon, Heart, Footprints, Users } from "lucide-react";

const REGIONS = [
  { id: "睡眠区", label: "睡眠区", icon: Moon, accent: "text-indigo-600" },
  { id: "情志区", label: "情志区", icon: Heart, accent: "text-rose-600" },
  { id: "运动疗愈区", label: "运动疗愈区", icon: Footprints, accent: "text-emerald-600" },
] as const;

export function RegionQueueBoard() {
  const [queues, setQueues] = useState<Record<string, QueueItem[]>>({});
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const entries = await Promise.all(
        REGIONS.map(async (r) => {
          const items = await queueService.getTreatmentQueueByRegion(r.id);
          return [r.id, items] as const;
        })
      );
      setQueues(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Realtime 刷新
  useQueueRealtime(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  return (
    <Card className="rounded-lg shadow-sm flex-1">
      <CardHeader className="p-2">
        <CardTitle className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
          <Users className="h-4 w-4 text-primary-500" />
          区域排号看板
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        {loading ? (
          <span className="text-xs text-neutral-400 leading-tight">加载中…</span>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {REGIONS.map(({ id, label, icon: Icon, accent }) => {
              const items = queues[id] ?? [];
              return (
                <div key={id} className="flex flex-col gap-1 rounded-md border border-neutral-200 p-2">
                  <div className="flex items-center gap-1 pb-1 border-b border-neutral-100">
                    <Icon className={`h-4 w-4 ${accent}`} />
                    <span className="text-xs font-medium text-neutral-700 leading-tight">{label}</span>
                    <span className="ml-auto text-xs text-neutral-400">{items.length} 人</span>
                  </div>
                  {items.length === 0 ? (
                    <span className="text-xs text-neutral-300 leading-tight py-2 text-center">暂无排队</span>
                  ) : (
                    <div className="flex flex-col gap-0.5 max-h-60 overflow-auto">
                      {items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-1.5 rounded px-1.5 py-1 bg-neutral-50"
                        >
                          <span className="text-xs font-mono text-neutral-400 w-4 shrink-0">
                            {idx + 1}
                          </span>
                          <MaskedText
                            type="name"
                            value={item.patientName}
                            className="text-xs text-neutral-700"
                          />
                          <span className="ml-auto text-xs text-neutral-400">
                            {item.insuranceCardNo.slice(-4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
