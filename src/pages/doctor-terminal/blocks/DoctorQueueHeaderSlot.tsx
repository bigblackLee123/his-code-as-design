import { useMemo } from "react";
import { MaskedText } from "@/components/his/MaskedText";
import { useHeaderSlot } from "@/components/layout/HeaderSlotContext";
import { useCallQueue } from "./useCallQueue";
import type { Patient } from "@/services/types";
import { Users, Phone, SkipForward, UserX } from "lucide-react";

export interface DoctorQueueHeaderSlotProps {
  onPatientCalled: (patient: Patient) => void;
  disabled: boolean;
}

/**
 * 医生终端专用：将候诊队列摘要注入全局 Header slot。
 * 不渲染任何本地 DOM，纯粹通过 Context 向 Header 投递内容。
 */
export function DoctorQueueHeaderSlot({ onPatientCalled, disabled }: DoctorQueueHeaderSlotProps) {
  const { queue, calling, callNext, skipPatient, removePatient } = useCallQueue();

  const handleCallNext = async () => {
    const patient = await callNext();
    if (patient) onPatientCalled(patient);
  };

  const content = useMemo(() => (
    <div className="flex items-center gap-3 bg-primary-800 px-4 py-2 rounded-lg border border-primary-700">
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-primary-300" aria-hidden="true" />
        <span className="text-xs text-primary-200 leading-tight">候诊</span>
        <span className="text-xs font-medium text-white leading-tight">{queue.length}</span>
      </div>

      {queue.length > 0 && (
        <div className="flex items-center gap-2">
          {queue.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-1.5 bg-primary-700 rounded px-2 py-0.5">
              <span className="text-xs font-mono text-primary-300">{item.queueNumber}</span>
              <MaskedText type="name" value={item.patientName} className="text-xs text-white" />
              <button
                type="button"
                onClick={() => skipPatient(item.id)}
                disabled={disabled || calling}
                className="text-warning-400 hover:text-warning-300 transition-colors"
                aria-label={`过号：${item.patientName}`}
              >
                <SkipForward className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => removePatient(item.id)}
                disabled={disabled || calling}
                className="text-error-400 hover:text-error-300 transition-colors"
                aria-label={`移出：${item.patientName}`}
              >
                <UserX className="h-3 w-3" />
              </button>
            </div>
          ))}
          {queue.length > 2 && (
            <span className="text-xs text-primary-400">+{queue.length - 2}</span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleCallNext}
        disabled={disabled || calling || queue.length === 0}
        className="flex items-center gap-1 text-xs text-primary-200 hover:text-white transition-colors disabled:opacity-50"
        aria-label="叫号"
      >
        <Phone className="h-3 w-3" />
        {calling ? "叫号中..." : "叫号"}
      </button>
    </div>
  ), [queue, calling, disabled, handleCallNext, skipPatient, removePatient]);

  useHeaderSlot(content);

  return null;
}
