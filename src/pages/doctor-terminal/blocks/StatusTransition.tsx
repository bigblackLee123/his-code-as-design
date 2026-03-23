import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { useStatusTransition } from "./useStatusTransition";
import type { Patient, TherapyProject, ConsultationData } from "@/services/types";
import { ArrowRight, CheckCircle, AlertTriangle, RotateCcw, ListMusic } from "lucide-react";

export interface StatusTransitionProps {
  patient: Patient;
  selectedProjects: TherapyProject[];
  consultationData: ConsultationData;
  onComplete: () => void;
}

export function StatusTransition({ patient, selectedProjects, onComplete }: StatusTransitionProps) {
  const { state, queueItem, errorMsg, confirm: handleConfirm } = useStatusTransition(patient.id, selectedProjects);

  if (state === "confirm" || state === "loading") {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <div className="flex items-center gap-1">
          <ArrowRight className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">状态流转确认</span>
        </div>

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

        {selectedProjects.length > 0 && (
          <div className="flex flex-col gap-1 rounded-md bg-primary-50 p-2">
            <div className="flex items-center gap-1">
              <ListMusic className="h-3 w-3 text-primary-600" aria-hidden="true" />
              <span className="text-xs font-medium text-primary-700 leading-tight">
                已选 {selectedProjects.length} 个疗愈项目
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedProjects.map((proj) => (
                <Badge key={proj.id} variant="outline" className="text-xs leading-tight px-1 py-0">
                  {proj.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="default" size="sm" onClick={handleConfirm} disabled={state === "loading"} aria-label="确认流转至治疗队列">
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

  if (state === "success" && queueItem) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
        <Alert>
          <CheckCircle className="h-4 w-4 text-success-500" />
          <AlertTitle className="text-xs font-medium text-success-700">流转成功</AlertTitle>
          <AlertDescription className="text-xs text-neutral-600">
            患者已加入治疗队列，排队序号：
            <span className="font-mono font-medium text-primary-600">{queueItem.queueNumber}</span>
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
