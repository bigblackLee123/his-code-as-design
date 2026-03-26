import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MaskedText } from "@/components/his/MaskedText";
import { useCallQueue } from "./useCallQueue";
import type { Patient } from "@/services/types";
import { Users, Phone, SkipForward, UserX, ChevronDown, ChevronUp } from "lucide-react";

export interface CallQueueHeaderProps {
  onPatientCalled: (patient: Patient) => void;
  disabled: boolean;
}

const VISIBLE_COUNT = 3;

function formatWait(enqueuedAt: string): string {
  const mins = Math.floor((Date.now() - new Date(enqueuedAt).getTime()) / 60000);
  if (mins < 1) return "<1min";
  if (mins < 60) return `${mins}min`;
  return `${Math.floor(mins / 60)}h${mins % 60}m`;
}

export function CallQueueHeader({ onPatientCalled, disabled }: CallQueueHeaderProps) {
  const { queue, calling, callNext, skipPatient, removePatient } = useCallQueue();
  const [expanded, setExpanded] = useState(false);

  const handleCallNext = async () => {
    const patient = await callNext();
    if (patient) onPatientCalled(patient);
  };

  const visible = expanded ? queue : queue.slice(0, VISIBLE_COUNT);
  const hasMore = queue.length > VISIBLE_COUNT;

  return (
    <div className="rounded-xl bg-white border border-neutral-100 shadow-sm px-3 py-2 flex flex-col gap-1.5">
      {/* 标题行 */}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-700 leading-tight">
          候诊队列
        </span>
        <span className="text-xs text-neutral-400">({queue.length})</span>
        <div className="ml-auto">
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
      </div>

      {/* 队列列表 */}
      {queue.length === 0 ? (
        <span className="text-xs text-neutral-300 leading-tight text-center py-1">暂无候诊</span>
      ) : (
        <div className="flex flex-col gap-0.5">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded px-2 py-1 bg-neutral-50 text-xs leading-tight"
            >
              <span className="font-mono text-primary-600 w-6 shrink-0">{item.queueNumber}</span>
              <MaskedText type="name" value={item.patientName} className="shrink-0" />
              <span className="text-neutral-400 shrink-0">{formatWait(item.enqueuedAt)}</span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => skipPatient(item.id)}
                  disabled={disabled || calling}
                  className="rounded px-1.5 py-0.5 text-xs text-warning-600 bg-warning-50 hover:bg-warning-100 transition-colors flex items-center gap-0.5"
                  aria-label={`过号：${item.patientName}`}
                >
                  <SkipForward className="h-3 w-3" />
                  过号
                </button>
                <button
                  type="button"
                  onClick={() => removePatient(item.id)}
                  disabled={disabled || calling}
                  className="rounded px-1.5 py-0.5 text-xs text-error-600 bg-error-50 hover:bg-error-100 transition-colors flex items-center gap-0.5"
                  aria-label={`移出：${item.patientName}`}
                >
                  <UserX className="h-3 w-3" />
                  移出
                </button>
              </div>
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
