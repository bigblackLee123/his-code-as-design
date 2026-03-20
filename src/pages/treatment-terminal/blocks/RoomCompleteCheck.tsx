import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { treatmentQueueService } from "@/services/supabase/treatmentQueueService";
import type { RoomCompleteResult } from "@/services/types";
import { CheckCircle, MapPin, ArrowRight, RotateCcw } from "lucide-react";

export interface RoomCompleteCheckProps {
  consultationId: string;
  region: string;
  onAllDone: () => void;
  onNextPatient: () => void;
}

export function RoomCompleteCheck({ consultationId, region, onAllDone, onNextPatient }: RoomCompleteCheckProps) {
  const [state, setState] = useState<"loading" | "partial" | "done" | "error">("loading");
  const [result, setResult] = useState<RoomCompleteResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleComplete = useCallback(async () => {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await treatmentQueueService.completeRoom(consultationId, region);
      setResult(res);
      setState(res.allDone ? "done" : "partial");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "完成失败");
      setState("error");
    }
  }, [consultationId, region]);

  // Auto-trigger on mount
  useState(() => { handleComplete(); });

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center py-4 text-xs text-neutral-500">
        正在完成本房间治疗...
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <Alert variant="destructive">
          <AlertTitle className="text-xs font-medium">完成失败</AlertTitle>
          <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleComplete}>
            <RotateCcw className="h-3 w-3" /><span>重试</span>
          </Button>
        </div>
      </div>
    );
  }

  if (state === "partial" && result) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-primary-200 bg-primary-50 p-3">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-success-500" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">本房间治疗完成</span>
        </div>
        <div className="text-xs text-neutral-600 leading-tight">患者还需前往以下房间完成剩余项目：</div>
        <div className="flex flex-col gap-1">
          {result.pendingRegions.map((r) => {
            const stepsInRegion = result.pendingSteps.filter((s) => s.region === r);
            return (
              <div key={r} className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5">
                <MapPin className="h-3 w-3 text-primary-500" />
                <span className="text-xs font-medium text-neutral-800">{r}</span>
                <div className="flex gap-1 flex-wrap">
                  {stepsInRegion.map((s) => (
                    <Badge key={s.id} variant="outline" className="text-xs px-1 py-0">{s.projectName}</Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onNextPatient}>
            <ArrowRight className="h-3 w-3" /><span>等待下一位患者</span>
          </Button>
        </div>
      </div>
    );
  }

  // allDone
  return (
    <div className="flex flex-col gap-2 rounded-md border border-success-200 bg-success-50 p-3">
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-success-600" />
        <span className="text-xs font-medium text-success-800 leading-tight">全部疗愈项目已完成</span>
      </div>
      <div className="text-xs text-neutral-600 leading-tight">请继续完成治疗后数据采集。</div>
      <div className="flex justify-end">
        <Button size="sm" onClick={onAllDone}>
          <ArrowRight className="h-3 w-3" /><span>开始采集</span>
        </Button>
      </div>
    </div>
  );
}
