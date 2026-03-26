import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MaskedText } from "@/components/his/MaskedText";
import { useCallQueue } from "./useCallQueue";
import type { Patient } from "@/services/types";
import { Users, Phone, ChevronDown, ChevronUp } from "lucide-react";

export interface CallQueueCompactProps {
  onPatientCalled: (patient: Patient) => void;
  disabled: boolean;
}

const VISIBLE_COUNT = 3;

function formatWaitingTime(enqueuedAt: string): string {
  const diff = Date.now() - new Date(enqueuedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "<1min";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h${minutes % 60}m`;
}

export function CallQueueCompact({ onPatientCalled, disabled }: CallQueueCompactProps) {
  const { queue, calling, callNext } = useCallQueue();
  const [expanded, setExpanded] = useState(false);

  const handleCallNext = async () => {
    const patient = await callNext();
    if (patient) onPatientCalled(patient);
  };

  const visibleItems = expanded ? queue : queue.slice(0, VISIBLE_COUNT);
  const hasMore = queue.length > VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-700 leading-tight">候诊队列</span>
          <span className="text-xs text-neutral-400">({queue.length})</span>
        </div>
        <Button
          size="sm"
          onClick={handleCallNext}
          disabled={disabled || calling || queue.length === 0}
          aria-label="叫号"
        >
          <Phone className="h-3 w-3" />
          {calling ? "叫号中..." : "叫号"}
        </Button>
      </div>

      {queue.length === 0 ? (
        <span className="text-xs text-neutral-300 leading-tight text-center py-2">暂无候诊</span>
      ) : (
        <div className="flex flex-col gap-0.5">
          {visibleItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 rounded px-1.5 py-1 bg-neutral-50 text-xs leading-tight"
            >
              <span className="font-mono text-neutral-400 w-4 shrink-0">{idx + 1}</span>
              <MaskedText type="name" value={item.patientName} className="truncate" />
              <span className="ml-auto text-neutral-400 shrink-0">{formatWaitingTime(item.enqueuedAt)}</span>
            </div>
          ))}
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-0.5 text-xs text-primary-500 py-0.5 hover:text-primary-700 transition-colors"
              aria-label={expanded ? "收起队列" : "展开完整队列"}
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "收起" : `展开全部 (${queue.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
