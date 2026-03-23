import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaskedText } from "@/components/his/MaskedText";
import { useCallQueue } from "./useCallQueue";
import type { Patient } from "@/services/types";
import { Users, Phone, SkipForward, UserX } from "lucide-react";

export interface CallQueueProps {
  onPatientCalled: (patient: Patient) => void;
  disabled: boolean;
}

function formatWaitingTime(enqueuedAt: string): string {
  const diff = Date.now() - new Date(enqueuedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "<1分钟";
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  return `${hours}小时${remainMinutes}分钟`;
}

export function CallQueue({ onPatientCalled, disabled }: CallQueueProps) {
  const { queue, calling, callNext, skipPatient, removePatient } = useCallQueue();

  const handleCallNext = async () => {
    const patient = await callNext();
    if (patient) onPatientCalled(patient);
  };

  return (
    <Card className="rounded-lg shadow-sm h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" />
          候诊队列
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-2">
        <Button
          size="sm"
          onClick={handleCallNext}
          disabled={disabled || calling || queue.length === 0}
          className="w-full"
          aria-label="叫号下一位候诊患者"
        >
          <Phone className="h-3 w-3" />
          {calling ? "叫号中..." : "叫号"}
        </Button>

        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
            <Users className="h-6 w-6 mb-2" />
            <span className="text-xs leading-tight">暂无候诊患者</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-md bg-neutral-50 px-2 py-1 text-xs leading-tight"
              >
                <span className="font-mono font-medium text-primary-600 w-8 shrink-0">
                  {item.queueNumber}
                </span>
                <div className="flex-1 flex items-center gap-1 truncate">
                  <MaskedText type="name" value={item.patientName} className="shrink-0" />
                  <span className="text-neutral-400 font-mono shrink-0">
                    ({item.insuranceCardNo?.slice(-4) || "****"})
                  </span>
                </div>
                <span className="text-neutral-400 shrink-0">
                  {formatWaitingTime(item.enqueuedAt)}
                </span>
                <button
                  type="button"
                  onClick={() => skipPatient(item.id)}
                  disabled={disabled || calling}
                  className="shrink-0 rounded px-1.5 py-0.5 text-xs text-warning-600 bg-warning-50 hover:bg-warning-100 transition-colors flex items-center gap-0.5"
                  aria-label={`过号：${item.patientName}`}
                  title="过号"
                >
                  <SkipForward className="h-3 w-3" />
                  过号
                </button>
                <button
                  type="button"
                  onClick={() => removePatient(item.id)}
                  disabled={disabled || calling}
                  className="shrink-0 rounded px-1.5 py-0.5 text-xs text-error-600 bg-error-50 hover:bg-error-100 transition-colors flex items-center gap-0.5"
                  aria-label={`移出：${item.patientName}`}
                  title="移出队列"
                >
                  <UserX className="h-3 w-3" />
                  移出
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
