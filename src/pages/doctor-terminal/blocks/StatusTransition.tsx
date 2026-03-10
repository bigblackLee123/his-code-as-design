import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MaskedText } from "@/components/his/MaskedText";
import { queueService } from "@/services/mock/queueService";
import type { Patient, QueueItem } from "@/services/types";
import { ArrowRight, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";

export interface StatusTransitionProps {
  patient: Patient;
  onComplete: () => void;
}

type TransitionState = "confirm" | "loading" | "success" | "error";

export function StatusTransition({ patient, onComplete }: StatusTransitionProps) {
  const [state, setState] = useState<TransitionState>("confirm");
  const [queueItem, setQueueItem] = useState<QueueItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleConfirm = useCallback(async () => {
    setState("loading");
    setErrorMsg("");

    try {
      const item = await queueService.enqueueTreatment(patient.id);
      setQueueItem(item);
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "流转失败，请重试");
      setState("error");
    }
  }, [patient.id]);

  // Confirm view: patient summary + confirm button
  if (state === "confirm" || state === "loading") {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <div className="flex items-center gap-1">
          <ArrowRight className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">
            状态流转确认
          </span>
        </div>

        {/* Patient summary */}
        <div className="flex flex-col gap-1 rounded-md bg-neutral-50 p-2">
          <span className="text-xs font-medium text-neutral-600 leading-tight">患者信息</span>
          <div className="grid grid-cols-2 gap-1 text-xs leading-tight">
            <div className="flex gap-1">
              <span className="text-neutral-500">姓名：</span>
              <MaskedText type="name" value={patient.name} />
            </div>
            <div className="flex gap-1">
              <span className="text-neutral-500">性别：</span>
              <span className="text-neutral-700">{patient.gender === "male" ? "男" : "女"}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-neutral-500">年龄：</span>
              <span className="text-neutral-700">{patient.age}岁</span>
            </div>
            <div className="flex gap-1">
              <span className="text-neutral-500">医保卡号：</span>
              <span className="font-mono text-neutral-700">{patient.insuranceCardNo}</span>
            </div>
          </div>
        </div>

        {/* Prescription summary */}
        <div className="flex flex-col gap-1 rounded-md bg-neutral-50 p-2">
          <span className="text-xs font-medium text-neutral-600 leading-tight">处方摘要</span>
          <span className="text-xs text-neutral-500 leading-tight">
            处方已提交，确认后将患者转入治疗队列
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={handleConfirm}
            disabled={state === "loading"}
            aria-label="确认流转至治疗队列"
          >
            {state === "loading" ? (
              <span className="text-xs">流转中…</span>
            ) : (
              <>
                <ArrowRight className="h-3 w-3" />
                <span>确认流转</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Success view
  if (state === "success" && queueItem) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <Alert>
          <CheckCircle className="h-4 w-4 text-success-500" />
          <AlertTitle className="text-xs font-medium text-success-700">流转成功</AlertTitle>
          <AlertDescription className="text-xs text-neutral-600">
            患者已加入治疗队列，排队序号：
            <span className="font-mono font-medium text-primary-600">
              {queueItem.queueNumber}
            </span>
          </AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onComplete} aria-label="完成流转">
            <CheckCircle className="h-3 w-3" />
            <span>完成</span>
          </Button>
        </div>
      </div>
    );
  }

  // Error view
  return (
    <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-xs font-medium">流转失败</AlertTitle>
        <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
      </Alert>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleConfirm} aria-label="重试流转">
          <RotateCcw className="h-3 w-3" />
          <span>重试</span>
        </Button>
      </div>
    </div>
  );
}
