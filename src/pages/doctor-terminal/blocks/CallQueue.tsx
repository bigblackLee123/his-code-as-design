import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaskedText } from "@/components/his/MaskedText";
import { useCallQueue } from "./useCallQueue";
import type { Patient } from "@/services/types";
import { Users, Phone } from "lucide-react";

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
  const { queue, calling, callNext } = useCallQueue();

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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
