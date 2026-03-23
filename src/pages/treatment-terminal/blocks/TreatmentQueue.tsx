import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaskedText } from "@/components/his/MaskedText";
import { queueService } from "@/services";
import { treatmentQueueService } from "@/services/supabase/treatmentQueueService";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import type { RoomCheckIn, QueueItem } from "@/services/types";
import { Syringe, CreditCard, Search } from "lucide-react";

export interface TreatmentQueueProps {
  region: string;
  onCheckIn: (checkIn: RoomCheckIn, consultationId: string) => void;
  disabled: boolean;
}

function formatWaitingTime(enqueuedAt: string): string {
  const diff = Date.now() - new Date(enqueuedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "<1分钟";
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  return `${hours}小时${minutes % 60}分钟`;
}

export function TreatmentQueue({ region, onCheckIn, disabled }: TreatmentQueueProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [cardSuffix, setCardSuffix] = useState("");
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadQueue = useCallback(async () => {
    try {
      const items = await queueService.getTreatmentQueue();
      setQueue(items);
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);
  useQueueRealtime(useCallback(() => { loadQueue(); }, [loadQueue]));

  const handleCheckIn = async () => {
    if (cardSuffix.length !== 4) return;
    setChecking(true);
    setErrorMsg("");
    try {
      const result = await treatmentQueueService.checkInByRoom(cardSuffix, region);
      const cId = await consultationHelper.getActiveId(result.patient.id);
      onCheckIn(result, cId);
      setCardSuffix("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "签到失败");
    } finally {
      setChecking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheckIn();
  };

  return (
    <Card className="rounded-lg shadow-sm h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <Syringe className="h-4 w-4 text-primary-500" />
          {region} · 刷卡签到
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-neutral-500 leading-tight">
            <CreditCard className="h-3 w-3" />
            <span>请输入医保卡号后四位</span>
          </div>
          <div className="flex gap-1">
            <Input
              value={cardSuffix}
              onChange={(e) => setCardSuffix(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={handleKeyDown}
              placeholder="如 0003"
              maxLength={4}
              disabled={disabled || checking}
              className="font-mono text-center text-sm"
              aria-label="医保卡号后四位"
            />
            <Button
              size="sm"
              onClick={handleCheckIn}
              disabled={disabled || checking || cardSuffix.length !== 4}
              aria-label="签到"
            >
              <Search className="h-3 w-3" />
              {checking ? "查询中..." : "签到"}
            </Button>
          </div>
          {errorMsg && (
            <span className="text-xs text-error-600 leading-tight">{errorMsg}</span>
          )}
        </div>

        <div className="border-t border-neutral-100 pt-2">
          <span className="text-xs font-medium text-neutral-600 leading-tight">待治疗队列</span>
        </div>
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-neutral-400">
            <Syringe className="h-5 w-5 mb-1" />
            <span className="text-xs leading-tight">暂无待治疗患者</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-md bg-neutral-50 px-2 py-1 text-xs leading-tight">
                <span className="font-mono font-medium text-primary-600 w-6 shrink-0">{item.queueNumber}</span>
                <MaskedText type="name" value={item.patientName} className="shrink-0" />
                <span className="text-neutral-400 font-mono shrink-0">({item.insuranceCardNo?.slice(-4) || "****"})</span>
                <span className="text-neutral-400 ml-auto shrink-0">{formatWaitingTime(item.enqueuedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
